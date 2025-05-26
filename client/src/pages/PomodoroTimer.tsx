import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Square, Settings, Volume2, SkipForward, Plus, Trash2 } from "lucide-react";

type TimerState = 'work' | 'shortBreak' | 'longBreak' | 'idle';

interface PomodoroSettings {
  workTime: number; // minutes
  shortBreakTime: number; // minutes
  longBreakTime: number; // minutes
  autoStart: boolean;
  soundEnabled: boolean;
}

interface Task {
  id: string;
  text: string;
  completed: boolean;
  completedPomodoros: number;
}

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [dailyPomodoros, setDailyPomodoros] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  
  const [settings, setSettings] = useState<PomodoroSettings>({
    workTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    autoStart: false,
    soundEnabled: true
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    // Create a simple beep sound using Web Audio API
    const createBeepSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    };

    audioRef.current = { play: createBeepSound } as any;
  }, []);

  // Load saved data from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    const savedDaily = localStorage.getItem('dailyPomodoros');
    const savedDate = localStorage.getItem('pomodoroDate');
    const savedTasks = localStorage.getItem('pomodoroTasks');
    const today = new Date().toDateString();

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    if (savedDate === today && savedDaily) {
      setDailyPomodoros(parseInt(savedDaily));
    } else {
      // Reset daily count for new day
      setDailyPomodoros(0);
      localStorage.setItem('pomodoroDate', today);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  }, [settings]);

  // Save daily pomodoros to localStorage
  useEffect(() => {
    localStorage.setItem('dailyPomodoros', dailyPomodoros.toString());
  }, [dailyPomodoros]);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoroTasks', JSON.stringify(tasks));
  }, [tasks]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (settings.soundEnabled && audioRef.current) {
      audioRef.current.play();
    }

    if (timerState === 'work') {
      const newCompleted = completedPomodoros + 1;
      setCompletedPomodoros(newCompleted);
      setDailyPomodoros(prev => prev + 1);

      // Update current task pomodoro count
      if (currentTaskId) {
        setTasks(prev => prev.map(task => 
          task.id === currentTaskId 
            ? { ...task, completedPomodoros: task.completedPomodoros + 1 }
            : task
        ));
      }

      // After 4 pomodoros, take a long break
      if (newCompleted % 4 === 0) {
        setTimerState('longBreak');
        setTimeLeft(settings.longBreakTime * 60);
        setCurrentCycle(1);
      } else {
        setTimerState('shortBreak');
        setTimeLeft(settings.shortBreakTime * 60);
        setCurrentCycle(prev => prev + 1);
      }
    } else {
      // Break is over, back to work
      setTimerState('work');
      setTimeLeft(settings.workTime * 60);
    }

    if (settings.autoStart) {
      setIsRunning(true);
    }
  };

  const startTimer = () => {
    if (timerState === 'idle') {
      setTimerState('work');
      setTimeLeft(settings.workTime * 60);
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimerState('idle');
    setTimeLeft(settings.workTime * 60);
  };

  const skipSession = () => {
    setIsRunning(false);
    
    if (timerState === 'work') {
      // Skip work session, go to break
      if (completedPomodoros % 4 === 3) {
        setTimerState('longBreak');
        setTimeLeft(settings.longBreakTime * 60);
      } else {
        setTimerState('shortBreak');
        setTimeLeft(settings.shortBreakTime * 60);
      }
    } else {
      // Skip break, go to work
      setTimerState('work');
      setTimeLeft(settings.workTime * 60);
    }
  };

  // Task management functions
  const addTask = () => {
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        completed: false,
        completedPomodoros: 0
      };
      setTasks(prev => [...prev, newTask]);
      setNewTaskText("");
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    if (currentTaskId === taskId) {
      setCurrentTaskId(null);
    }
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const selectTask = (taskId: string) => {
    setCurrentTaskId(taskId);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentTimeTotal = () => {
    switch (timerState) {
      case 'work':
        return settings.workTime * 60;
      case 'shortBreak':
        return settings.shortBreakTime * 60;
      case 'longBreak':
        return settings.longBreakTime * 60;
      default:
        return settings.workTime * 60;
    }
  };

  const getProgressPercentage = () => {
    const total = getCurrentTimeTotal();
    return ((total - timeLeft) / total) * 100;
  };

  const getStateText = () => {
    switch (timerState) {
      case 'work':
        return '집중 시간';
      case 'shortBreak':
        return '짧은 휴식';
      case 'longBreak':
        return '긴 휴식';
      default:
        return '시작 대기';
    }
  };

  const getStateColor = () => {
    switch (timerState) {
      case 'work':
        return 'bg-red-500';
      case 'shortBreak':
        return 'bg-green-500';
      case 'longBreak':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">포모도로 타이머</h2>
        <p className="text-muted-foreground">
          25분 집중, 5분 휴식의 과학적인 시간 관리 기법으로 생산성을 향상시키세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timer */}
        <div className="lg:col-span-2">
          <Card className="p-8 text-center">
            <CardContent className="space-y-6">
              {/* Current State Badge */}
              <div className="flex items-center justify-center space-x-4">
                <Badge 
                  variant="secondary" 
                  className={`text-white px-4 py-2 text-lg ${getStateColor()}`}
                >
                  {getStateText()}
                </Badge>
                {timerState === 'work' && (
                  <Badge 
                    variant="outline" 
                    className="px-3 py-1 cursor-pointer hover:bg-muted"
                    onClick={() => setCurrentCycle(prev => prev === 4 ? 1 : prev + 1)}
                  >
                    세션 {currentCycle}
                  </Badge>
                )}
              </div>

              {/* Timer Display */}
              <div className="relative w-64 h-64 mx-auto">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl font-mono font-bold">
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <Progress 
                  value={getProgressPercentage()} 
                  className="w-full h-4 mt-4" 
                />
              </div>

              {/* Timer Controls */}
              <div className="flex justify-center space-x-4">
                {!isRunning ? (
                  <Button 
                    onClick={startTimer} 
                    size="lg" 
                    className="flex items-center space-x-2"
                  >
                    <Play className="h-5 w-5" />
                    <span>시작</span>
                  </Button>
                ) : (
                  <Button 
                    onClick={pauseTimer} 
                    size="lg" 
                    variant="secondary"
                    className="flex items-center space-x-2"
                  >
                    <Pause className="h-5 w-5" />
                    <span>일시정지</span>
                  </Button>
                )}
                
                {timerState !== 'idle' && (
                  <Button 
                    onClick={skipSession} 
                    size="lg" 
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <SkipForward className="h-5 w-5" />
                    <span>스킵</span>
                  </Button>
                )}
                
                <Button 
                  onClick={resetTimer} 
                  size="lg" 
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Square className="h-5 w-5" />
                  <span>리셋</span>
                </Button>
              </div>

              {/* Current Session Info */}
              <div className="text-sm text-muted-foreground">
                {timerState === 'work' && (
                  <div className="space-y-1">
                    <p>현재 사이클: {currentCycle}/4</p>
                    {currentTaskId && (
                      <p className="text-primary font-medium">
                        작업 중: {tasks.find(t => t.id === currentTaskId)?.text}
                      </p>
                    )}
                  </div>
                )}
                {timerState === 'shortBreak' && (
                  <p>짧은 휴식 후 다음 포모도로가 시작됩니다</p>
                )}
                {timerState === 'longBreak' && (
                  <p>긴 휴식 후 새로운 사이클이 시작됩니다</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats and Settings */}
        <div className="space-y-6">
          {/* Stats Card */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">오늘의 진행 상황</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>완료된 포모도로</span>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {dailyPomodoros}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>현재 세션</span>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {completedPomodoros % 4 + 1}/4
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span>총 완료 사이클</span>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {Math.floor(completedPomodoros / 4)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">설정</h3>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>

              {showSettings && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">작업 시간 (분)</label>
                    <input
                      type="number"
                      min="15"
                      max="60"
                      value={settings.workTime}
                      onChange={(e) => setSettings({
                        ...settings,
                        workTime: parseInt(e.target.value)
                      })}
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">짧은 휴식 (분)</label>
                    <input
                      type="number"
                      min="3"
                      max="15"
                      value={settings.shortBreakTime}
                      onChange={(e) => setSettings({
                        ...settings,
                        shortBreakTime: parseInt(e.target.value)
                      })}
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">긴 휴식 (분)</label>
                    <input
                      type="number"
                      min="10"
                      max="45"
                      value={settings.longBreakTime}
                      onChange={(e) => setSettings({
                        ...settings,
                        longBreakTime: parseInt(e.target.value)
                      })}
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="autoStart"
                      checked={settings.autoStart}
                      onChange={(e) => setSettings({
                        ...settings,
                        autoStart: e.target.checked
                      })}
                      className="rounded"
                    />
                    <label htmlFor="autoStart" className="text-sm">자동 시작</label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="soundEnabled"
                      checked={settings.soundEnabled}
                      onChange={(e) => setSettings({
                        ...settings,
                        soundEnabled: e.target.checked
                      })}
                      className="rounded"
                    />
                    <label htmlFor="soundEnabled" className="text-sm flex items-center space-x-1">
                      <Volume2 className="h-4 w-4" />
                      <span>알림음</span>
                    </label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tasks Card */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">할일 목록</h3>
              
              {/* Add new task */}
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  placeholder="새 할일을 입력하세요..."
                  className="flex-1 px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Button 
                  onClick={addTask} 
                  size="sm"
                  className="px-3"
                  disabled={!newTaskText.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Task list */}
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`flex items-center justify-between p-2 rounded border transition-colors ${
                      currentTaskId === task.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:bg-muted/50'
                    } ${task.completed ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskComplete(task.id)}
                        className="rounded flex-shrink-0"
                      />
                      <div 
                        className={`text-sm cursor-pointer truncate ${
                          task.completed ? 'line-through text-muted-foreground' : ''
                        }`}
                        onClick={() => selectTask(task.id)}
                        title={task.text}
                      >
                        {task.text}
                        {task.completedPomodoros > 0 && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            🍅{task.completedPomodoros}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button 
                      onClick={() => deleteTask(task.id)}
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto text-muted-foreground hover:text-destructive flex-shrink-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                
                {tasks.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">할일을 추가해보세요!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">포모도로 팁</h3>
              <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                <p className="flex items-start space-x-2">
                  <span className="flex-shrink-0">🍅</span>
                  <span className="leading-relaxed">한 번에 하나의 작업에만 집중하세요</span>
                </p>
                <p className="flex items-start space-x-2">
                  <span className="flex-shrink-0">⏰</span>
                  <span className="leading-relaxed">25분 동안은 방해 요소를 차단하세요</span>
                </p>
                <p className="flex items-start space-x-2">
                  <span className="flex-shrink-0">🚫</span>
                  <span className="leading-relaxed">휴식 시간을 건너뛰지 마세요</span>
                </p>
                <p className="flex items-start space-x-2">
                  <span className="flex-shrink-0">📝</span>
                  <span className="leading-relaxed">완료한 작업을 기록해보세요</span>
                </p>
                <p className="flex items-start space-x-2">
                  <span className="flex-shrink-0">🎯</span>
                  <span className="leading-relaxed">하루 목표를 설정해보세요</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}