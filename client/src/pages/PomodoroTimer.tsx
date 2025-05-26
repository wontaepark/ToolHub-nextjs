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
  taskBasedTiming: boolean;
}

interface Task {
  id: string;
  text: string;
  completed: boolean;
  completedPomodoros: number;
  customWorkTime?: number; // minutes
  customShortBreak?: number; // minutes
  customLongBreak?: number; // minutes
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
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  
  const [settings, setSettings] = useState<PomodoroSettings>({
    workTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    autoStart: false,
    soundEnabled: true,
    taskBasedTiming: false
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load settings and data from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      setTimeLeft(parsed.workTime * 60);
    }

    const savedTasks = localStorage.getItem('pomodoroTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    const savedDailyPomodoros = localStorage.getItem('dailyPomodoros');
    if (savedDailyPomodoros) {
      setDailyPomodoros(parseInt(savedDailyPomodoros));
    }

    const savedCurrentTaskId = localStorage.getItem('currentTaskId');
    if (savedCurrentTaskId) {
      setCurrentTaskId(savedCurrentTaskId);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  }, [settings]);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoroTasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save daily pomodoros to localStorage
  useEffect(() => {
    localStorage.setItem('dailyPomodoros', dailyPomodoros.toString());
  }, [dailyPomodoros]);

  // Save current task ID to localStorage
  useEffect(() => {
    if (currentTaskId) {
      localStorage.setItem('currentTaskId', currentTaskId);
    }
  }, [currentTaskId]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  // Handle timer completion
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      handleTimerComplete();
    }
  }, [timeLeft, isRunning]);

  const playNotificationSound = () => {
    if (settings.soundEnabled) {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    playNotificationSound();

    if (timerState === 'work') {
      setCompletedPomodoros(prev => prev + 1);
      setDailyPomodoros(prev => prev + 1);
      
      // Update task pomodoro count
      if (currentTaskId) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === currentTaskId 
              ? { ...task, completedPomodoros: task.completedPomodoros + 1 }
              : task
          )
        );
      }

      // Determine next break type
      const nextState = currentCycle % 4 === 0 ? 'longBreak' : 'shortBreak';
      setTimerState(nextState);
      
      const nextTime = nextState === 'longBreak' ? settings.longBreakTime : settings.shortBreakTime;
      setTimeLeft(nextTime * 60);
      
      if (nextState === 'longBreak') {
        setCurrentCycle(1);
      } else {
        setCurrentCycle(prev => prev + 1);
      }
    } else {
      // Break completed, start work session
      setTimerState('work');
      const workTime = getCurrentWorkTime();
      setTimeLeft(workTime * 60);
    }

    if (settings.autoStart) {
      setIsRunning(true);
    }
  };

  const getCurrentWorkTime = () => {
    if (settings.taskBasedTiming && currentTaskId) {
      const currentTask = tasks.find(task => task.id === currentTaskId);
      return currentTask?.customWorkTime || settings.workTime;
    }
    return settings.workTime;
  };

  const getCurrentShortBreak = () => {
    if (settings.taskBasedTiming && currentTaskId) {
      const currentTask = tasks.find(task => task.id === currentTaskId);
      return currentTask?.customShortBreak || settings.shortBreakTime;
    }
    return settings.shortBreakTime;
  };

  const getCurrentLongBreak = () => {
    if (settings.taskBasedTiming && currentTaskId) {
      const currentTask = tasks.find(task => task.id === currentTaskId);
      return currentTask?.customLongBreak || settings.longBreakTime;
    }
    return settings.longBreakTime;
  };

  const startTimer = () => {
    if (timerState === 'idle') {
      setTimerState('work');
      const workTime = getCurrentWorkTime();
      setTimeLeft(workTime * 60);
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimerState('idle');
    setTimeLeft(getCurrentWorkTime() * 60);
    setCompletedPomodoros(0);
    setCurrentCycle(1);
  };

  const skipSession = () => {
    setIsRunning(false);
    
    if (timerState === 'work') {
      // Skip work session - go to break
      const nextState = currentCycle % 4 === 0 ? 'longBreak' : 'shortBreak';
      setTimerState(nextState);
      
      const nextTime = nextState === 'longBreak' ? getCurrentLongBreak() : getCurrentShortBreak();
      setTimeLeft(nextTime * 60);
      
      if (nextState === 'longBreak') {
        setCurrentCycle(1);
      } else {
        setCurrentCycle(prev => prev + 1);
      }
    } else {
      // Skip break session - go to work
      setTimerState('work');
      const workTime = getCurrentWorkTime();
      setTimeLeft(workTime * 60);
    }

    if (settings.autoStart) {
      setIsRunning(true);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerProgress = () => {
    let totalTime = 0;
    if (timerState === 'work') {
      totalTime = getCurrentWorkTime() * 60;
    } else if (timerState === 'shortBreak') {
      totalTime = getCurrentShortBreak() * 60;
    } else if (timerState === 'longBreak') {
      totalTime = getCurrentLongBreak() * 60;
    } else {
      return 0;
    }
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getSessionProgress = () => {
    // Calculate overall session progress (work + break combined)
    const workTime = getCurrentWorkTime() * 60;
    const breakTime = (currentCycle % 4 === 0 ? getCurrentLongBreak() : getCurrentShortBreak()) * 60;
    const totalSessionTime = workTime + breakTime;
    
    let elapsed = 0;
    
    if (timerState === 'work') {
      elapsed = workTime - timeLeft;
    } else if (timerState === 'shortBreak' || timerState === 'longBreak') {
      elapsed = workTime + (breakTime - timeLeft);
    }
    
    return Math.min((elapsed / totalSessionTime) * 100, 100);
  };

  const getStateLabel = () => {
    switch (timerState) {
      case 'work': return '작업 시간';
      case 'shortBreak': return '짧은 휴식';
      case 'longBreak': return '긴 휴식';
      default: return '준비됨';
    }
  };

  const getStateColor = () => {
    switch (timerState) {
      case 'work': return 'rgb(239, 68, 68)'; // red
      case 'shortBreak': return 'rgb(34, 197, 94)'; // green
      case 'longBreak': return 'rgb(59, 130, 246)'; // blue
      default: return 'rgb(107, 114, 128)'; // gray
    }
  };

  const addTask = () => {
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        completed: false,
        completedPomodoros: 0
      };
      setTasks([...tasks, newTask]);
      setNewTaskText("");
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    if (currentTaskId === taskId) {
      setCurrentTaskId(null);
    }
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const selectTask = (taskId: string) => {
    setCurrentTaskId(taskId);
    
    // If using task-based timing, update the current timer
    if (settings.taskBasedTiming && timerState === 'idle') {
      const task = tasks.find(t => t.id === taskId);
      if (task?.customWorkTime) {
        setTimeLeft(task.customWorkTime * 60);
      }
    }
  };

  const updateTaskTiming = (taskId: string, workTime: number, shortBreak: number, longBreak: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            customWorkTime: workTime,
            customShortBreak: shortBreak,
            customLongBreak: longBreak
          }
        : task
    ));
  };

  const currentTask = currentTaskId ? tasks.find(task => task.id === currentTaskId) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            포모도로 타이머
          </h1>
          <p className="text-muted-foreground">집중력을 높이고 생산성을 향상시키세요</p>
        </div>

        {/* Main Timer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-8">
              <CardContent className="text-center space-y-6">
                {/* Current Task Display */}
                {currentTask && (
                  <div className="mb-4">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/10 rounded-full">
                      <span className="text-sm text-primary font-medium">현재 작업:</span>
                      <span className="text-sm">{currentTask.text}</span>
                      {currentTask.completedPomodoros > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          🍅 {currentTask.completedPomodoros}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Timer Display */}
                <div className="relative inline-block">
                  <svg width="200" height="200" className="transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-muted-foreground/20"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke={getStateColor()}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 90}`}
                      strokeDashoffset={`${2 * Math.PI * 90 * (1 - getTimerProgress() / 100)}`}
                      className="transition-all duration-1000 ease-out"
                      style={{
                        filter: isRunning ? 'drop-shadow(0 0 8px currentColor)' : 'none',
                        animation: isRunning ? 'pulse 2s infinite' : 'none'
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-4xl font-bold mb-1" style={{ color: getStateColor() }}>
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-sm text-muted-foreground">{getStateLabel()}</div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center space-x-4">
                  {!isRunning ? (
                    <Button onClick={startTimer} size="lg" className="px-8">
                      <Play className="mr-2 h-5 w-5" />
                      시작
                    </Button>
                  ) : (
                    <Button onClick={pauseTimer} size="lg" variant="outline" className="px-8">
                      <Pause className="mr-2 h-5 w-5" />
                      일시정지
                    </Button>
                  )}
                  
                  <Button onClick={resetTimer} size="lg" variant="outline">
                    <Square className="mr-2 h-5 w-5" />
                    리셋
                  </Button>

                  <Button onClick={skipSession} size="lg" variant="outline">
                    <SkipForward className="mr-2 h-5 w-5" />
                    건너뛰기
                  </Button>
                </div>

                {/* Session Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>세션 진행률</span>
                    <span>{Math.round(getSessionProgress())}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary/60 to-primary transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${getSessionProgress()}%`,
                        animation: 'slideIn 0.5s ease-out'
                      }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-center space-x-8 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{completedPomodoros}</div>
                    <div className="text-sm text-muted-foreground">완료된 세션</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{currentCycle}</div>
                    <div className="text-sm text-muted-foreground">현재 사이클</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{dailyPomodoros}</div>
                    <div className="text-sm text-muted-foreground">오늘의 포모도로</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">설정</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>

              {showSettings && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="taskBasedTiming"
                      checked={settings.taskBasedTiming}
                      onChange={(e) => setSettings({
                        ...settings,
                        taskBasedTiming: e.target.checked
                      })}
                      className="rounded"
                    />
                    <label htmlFor="taskBasedTiming" className="text-sm">할일별 시간 설정</label>
                  </div>

                  <div className={`space-y-3 ${settings.taskBasedTiming ? 'opacity-50' : ''}`}>
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
                        disabled={settings.taskBasedTiming}
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
                        disabled={settings.taskBasedTiming}
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
                        disabled={settings.taskBasedTiming}
                      />
                    </div>
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

                  {/* Task Management in Settings */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium mb-3">할 일 목록</h4>
                    
                    {/* Add new task */}
                    <div className="flex space-x-2 mb-3">
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
                    <div className="space-y-1 max-h-40 overflow-y-auto">
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
                              onDoubleClick={() => settings.taskBasedTiming && setEditingTaskId(task.id)}
                              title={settings.taskBasedTiming ? `${task.text} (더블클릭으로 시간 설정)` : task.text}
                            >
                              {task.text}
                              {task.completedPomodoros > 0 && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  🍅{task.completedPomodoros}
                                </span>
                              )}
                              {settings.taskBasedTiming && task.customWorkTime && (
                                <span className="ml-2 text-xs text-blue-600">
                                  ⏱️{task.customWorkTime}분
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
                  </div>
                </div>
              )}

              {/* Tips Card */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-3">포모도로 팁</h4>
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Task Time Settings Modal */}
      {editingTaskId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold mb-4">시간 설정</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">작업 시간 (분)</label>
                <input
                  type="number"
                  min="15"
                  max="60"
                  defaultValue={tasks.find(t => t.id === editingTaskId)?.customWorkTime || settings.workTime}
                  onChange={(e) => {
                    const task = tasks.find(t => t.id === editingTaskId);
                    if (task) {
                      updateTaskTiming(
                        editingTaskId,
                        parseInt(e.target.value) || settings.workTime,
                        task.customShortBreak || settings.shortBreakTime,
                        task.customLongBreak || settings.longBreakTime
                      );
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">짧은 휴식 (분)</label>
                <input
                  type="number"
                  min="3"
                  max="15"
                  defaultValue={tasks.find(t => t.id === editingTaskId)?.customShortBreak || settings.shortBreakTime}
                  onChange={(e) => {
                    const task = tasks.find(t => t.id === editingTaskId);
                    if (task) {
                      updateTaskTiming(
                        editingTaskId,
                        task.customWorkTime || settings.workTime,
                        parseInt(e.target.value) || settings.shortBreakTime,
                        task.customLongBreak || settings.longBreakTime
                      );
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">긴 휴식 (분)</label>
                <input
                  type="number"
                  min="10"
                  max="45"
                  defaultValue={tasks.find(t => t.id === editingTaskId)?.customLongBreak || settings.longBreakTime}
                  onChange={(e) => {
                    const task = tasks.find(t => t.id === editingTaskId);
                    if (task) {
                      updateTaskTiming(
                        editingTaskId,
                        task.customWorkTime || settings.workTime,
                        task.customShortBreak || settings.shortBreakTime,
                        parseInt(e.target.value) || settings.longBreakTime
                      );
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setEditingTaskId(null)}
              >
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}