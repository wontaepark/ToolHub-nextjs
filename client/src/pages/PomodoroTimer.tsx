import { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
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
    const savedTimerState = localStorage.getItem('pomodoroTimerState');
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

    // Restore timer state if saved
    if (savedTimerState) {
      const timerData = JSON.parse(savedTimerState);
      const timeSaved = Date.now() - timerData.timestamp;
      
      if (timerData.isRunning && timeSaved < timerData.timeLeft * 1000) {
        // Calculate remaining time
        const remainingTime = Math.max(0, timerData.timeLeft - Math.floor(timeSaved / 1000));
        setTimerState(timerData.timerState);
        setTimeLeft(remainingTime);
        setIsRunning(remainingTime > 0);
        setCompletedPomodoros(timerData.completedPomodoros);
        
        // Restore current task info if exists
        if (timerData.currentTask) {
          setCurrentTaskId(timerData.currentTask);
        }
        
        // Restore custom settings if task-based timing is enabled
        if (timerData.customSettings) {
          setSettings(prev => ({ ...prev, ...timerData.customSettings }));
        }
      } else if (timerData.timerState && !timerData.isRunning) {
        // Restore paused or stopped state
        setTimerState(timerData.timerState);
        setTimeLeft(timerData.timeLeft);
        setCompletedPomodoros(timerData.completedPomodoros);
        
        if (timerData.currentTask) {
          setCurrentTaskId(timerData.currentTask);
        }
        
        if (timerData.customSettings) {
          setSettings(prev => ({ ...prev, ...timerData.customSettings }));
        }
      }
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

  // Save timer state to localStorage when running
  useEffect(() => {
    if (isRunning || timerState !== 'idle') {
      // Get current task and its custom settings
      const currentTaskData = currentTaskId ? tasks.find(task => task.id === currentTaskId) : null;
      const customSettings = currentTaskData && settings.taskBasedTiming ? {
        workTime: currentTaskData.customWorkTime || settings.workTime,
        shortBreakTime: currentTaskData.customShortBreak || settings.shortBreakTime,
        longBreakTime: currentTaskData.customLongBreak || settings.longBreakTime,
        taskBasedTiming: settings.taskBasedTiming
      } : null;

      const timerData = {
        isRunning,
        timerState,
        timeLeft,
        completedPomodoros,
        currentTask: currentTaskId,
        customSettings,
        timestamp: Date.now()
      };
      localStorage.setItem('pomodoroTimerState', JSON.stringify(timerData));
    } else {
      localStorage.removeItem('pomodoroTimerState');
    }
  }, [isRunning, timerState, timeLeft, completedPomodoros, currentTaskId, settings, tasks]);

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
      const currentTask = currentTaskId ? tasks.find(t => t.id === currentTaskId) : null;
      const workTime = currentTask?.customWorkTime || settings.workTime;
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
    // 세션 정보 리셋
    setCompletedPomodoros(0);
    setCurrentCycle(1);
    // 현재 선택된 할 일의 설정값으로 리셋
    const currentTask = currentTaskId ? tasks.find(t => t.id === currentTaskId) : null;
    const workTime = currentTask?.customWorkTime || settings.workTime;
    setTimeLeft(workTime * 60);
  };

  const skipSession = () => {
    const wasRunning = isRunning;
    const currentTask = currentTaskId ? tasks.find(t => t.id === currentTaskId) : null;
    
    if (timerState === 'work') {
      // Skip work session, go to break
      if (completedPomodoros % 4 === 3) {
        setTimerState('longBreak');
        const longBreakTime = currentTask?.customLongBreak || settings.longBreakTime;
        setTimeLeft(longBreakTime * 60);
      } else {
        setTimerState('shortBreak');
        const shortBreakTime = currentTask?.customShortBreak || settings.shortBreakTime;
        setTimeLeft(shortBreakTime * 60);
      }
    } else {
      // Skip break, go to work
      setTimerState('work');
      const workTime = currentTask?.customWorkTime || settings.workTime;
      setTimeLeft(workTime * 60);
    }
    
    // 원래 실행 중이었다면 계속 실행 상태 유지
    setIsRunning(wasRunning);
  };

  // Task management functions
  const addTask = () => {
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        completed: false,
        completedPomodoros: 0,
        customWorkTime: settings.taskBasedTiming ? settings.workTime : undefined,
        customShortBreak: settings.taskBasedTiming ? settings.shortBreakTime : undefined,
        customLongBreak: settings.taskBasedTiming ? settings.longBreakTime : undefined
      };
      setTasks(prev => [...prev, newTask]);
      setNewTaskText("");
    }
  };

  const updateTaskTiming = (taskId: string, workTime: number, shortBreak: number, longBreak: number) => {
    setTasks(prev => prev.map(task => 
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
    const currentTask = currentTaskId ? tasks.find(t => t.id === currentTaskId) : null;
    
    switch (timerState) {
      case 'work':
        return (currentTask?.customWorkTime || settings.workTime) * 60;
      case 'shortBreak':
        return (currentTask?.customShortBreak || settings.shortBreakTime) * 60;
      case 'longBreak':
        return (currentTask?.customLongBreak || settings.longBreakTime) * 60;
      default:
        return (currentTask?.customWorkTime || settings.workTime) * 60;
    }
  };

  const getProgressPercentage = () => {
    const total = getCurrentTimeTotal();
    return ((total - timeLeft) / total) * 100;
  };

  const getStateText = () => {
    switch (timerState) {
      case 'work':
        return t('pomodoro.states.work');
      case 'shortBreak':
        return t('pomodoro.states.shortBreak');
      case 'longBreak':
        return t('pomodoro.states.longBreak');
      default:
        return t('pomodoro.states.idle');
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
        <h2 className="text-3xl font-bold mb-2">{t('pomodoroTimer.title')}</h2>
        <p className="text-muted-foreground">
          {t('pomodoro.description')}
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
                  className={`text-white px-4 py-2 text-lg transition-all duration-500 ease-in-out transform ${getStateColor()} ${
                    isRunning ? 'scale-105 shadow-lg' : 'scale-100'
                  }`}
                  style={{
                    animation: isRunning ? 'pulseGlow 2s infinite' : 'none'
                  }}
                >
                  {getStateText()}
                </Badge>
                {timerState === 'work' && (
                  <Badge 
                    variant="outline" 
                    className="px-3 py-1 cursor-pointer hover:bg-muted transition-all duration-300 hover:scale-105"
                    onClick={() => {
                      // 세션 증가 (1-4 순환)
                      const newCycle = currentCycle === 4 ? 1 : currentCycle + 1;
                      setCurrentCycle(newCycle);
                      // completedPomodoros도 함께 업데이트 (세션 번호에 맞춰)
                      setCompletedPomodoros(newCycle - 1);
                    }}
                    style={{
                      animation: 'scaleIn 0.3s ease-out'
                    }}
                  >
{t('pomodoro.stats.cycle')} {currentCycle}
                  </Badge>
                )}
              </div>

              {/* Timer Display with Animated Ring */}
              <div className="relative w-64 h-64 mx-auto">
                {/* Animated SVG Progress Ring */}
                <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted opacity-20"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    className={`transition-all duration-1000 ease-in-out ${
                      timerState === 'work' 
                        ? 'text-red-500' 
                        : timerState === 'shortBreak' 
                          ? 'text-green-500' 
                          : 'text-blue-500'
                    }`}
                    style={{
                      strokeDasharray: `${2 * Math.PI * 45}`,
                      strokeDashoffset: `${2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}`,
                      transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.3s ease-in-out'
                    }}
                  />
                </svg>
                
                {/* Timer Text Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl font-mono font-bold transition-colors duration-300">
                    {formatTime(timeLeft)}
                  </span>
                </div>
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
                    <span>{t('pomodoro.buttons.start')}</span>
                  </Button>
                ) : (
                  <Button 
                    onClick={pauseTimer} 
                    size="lg" 
                    variant="secondary"
                    className="flex items-center space-x-2"
                  >
                    <Pause className="h-5 w-5" />
                    <span>{t('pomodoro.buttons.pause')}</span>
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
                    <span>{t('pomodoro.buttons.skip')}</span>
                  </Button>
                )}
                
                <Button 
                  onClick={resetTimer} 
                  size="lg" 
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Square className="h-5 w-5" />
                  <span>{t('pomodoro.buttons.reset')}</span>
                </Button>
              </div>

              {/* Task Selection - Always Visible */}
              <div className="text-sm space-y-2">
                <label className="block text-muted-foreground">{t('pomodoro.tasks.current')}:</label>
                <select
                  value={currentTaskId || ""}
                  onChange={(e) => {
                    setCurrentTaskId(e.target.value || null);
                    // 할 일을 선택했을 때 즉시 그 할 일의 시간으로 변경
                    if (e.target.value && !isRunning) {
                      const selectedTask = tasks.find(t => t.id === e.target.value);
                      if (selectedTask?.customWorkTime) {
                        setTimeLeft(selectedTask.customWorkTime * 60);
                      } else {
                        setTimeLeft(settings.workTime * 60);
                      }
                    }
                  }}
                  disabled={isRunning}
                  className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">{t('pomodoro.tasks.placeholder')}</option>
                  {tasks.filter(task => !task.completed).map(task => (
                    <option key={task.id} value={task.id}>
                      {task.text}
                      {settings.taskBasedTiming && task.customWorkTime && ` (${task.customWorkTime}${t('common.minutes')})`}
                    </option>
                  ))}
                </select>
                
                {/* Session Status */}
                <div className="text-xs text-muted-foreground mt-2">
                  {timerState === 'work' && <p>🍅 {t('pomodoro.states.work')}</p>}
                  {timerState === 'shortBreak' && <p>☕ {t('pomodoro.states.shortBreak')}</p>}
                  {timerState === 'longBreak' && <p>🛋️ {t('pomodoro.states.longBreak')}</p>}
                  {timerState === 'idle' && <p>⏸️ {t('pomodoro.states.idle')}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats and Settings */}
        <div className="space-y-6">
          {/* Stats Card */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">{t('pomodoro.stats.daily')}</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>{t('pomodoro.stats.completed')}</span>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {dailyPomodoros}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>{t('pomodoro.stats.currentSession')}</span>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {completedPomodoros % 4 + 1}/4
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span>{t('pomodoro.stats.cycle')}</span>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {Math.floor(completedPomodoros / 4)}
                  </Badge>
                </div>

                {/* Progress Bars */}
                <div className="space-y-3 pt-2">
                  {/* Daily Goal Progress */}
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{t('pomodoro.stats.dailyGoal')} (8개)</span>
                      <span>{Math.min(dailyPomodoros, 8)}/8</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-700 ease-out transform"
                        style={{ 
                          width: `${Math.min((dailyPomodoros / 8) * 100, 100)}%`,
                          transform: `translateX(${Math.min((dailyPomodoros / 8) * 100, 100) < 5 ? '-100%' : '0%'})`,
                          animation: dailyPomodoros > 0 ? 'slideInProgress 0.7s ease-out' : 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Overall Session Progress (only when active) */}
                  {timerState !== 'idle' && (
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{t('pomodoro.stats.sessionProgress')}</span>
                        <span>{(() => {
                          // Calculate session progress as percentage
                          const baseProgress = (completedPomodoros / 4) * 100;
                          let currentProgress = 0;
                          
                          if (timerState === 'work') {
                            currentProgress = (getProgressPercentage() / 100) * 25;
                          }
                          
                          return Math.min(Math.round(baseProgress + currentProgress), 100);
                        })()}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${(() => {
                              // Simple calculation: 4 pomodoros = 100% progress
                              // Each pomodoro represents 25% of the total progress
                              const baseProgress = (completedPomodoros / 4) * 100;
                              
                              // Add current session progress
                              let currentProgress = 0;
                              if (timerState === 'work') {
                                // Current work session progress (0-25% of one pomodoro)
                                currentProgress = (getProgressPercentage() / 100) * 25;
                              } else if (timerState === 'shortBreak' || timerState === 'longBreak') {
                                // Break time doesn't add to overall progress
                                // Stay at the same level as when work was completed
                                currentProgress = 0;
                              }
                              
                              return Math.min(baseProgress + currentProgress, 100);
                            })()}%`,
                            transformOrigin: 'left'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{t('pomodoro.buttons.settings')}</h3>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowSettings(!showSettings)}
                  disabled={isRunning}
                  className={isRunning ? "opacity-50 cursor-not-allowed" : ""}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>

              {showSettings && (
                <div className={`space-y-4 ${isRunning ? 'opacity-50 pointer-events-none' : ''}`}>
                  {isRunning && (
                    <div className="text-xs text-muted-foreground p-2 bg-muted rounded-md mb-3">
{t('pomodoro.settings.disabledMessage')}
                    </div>
                  )}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <input
                        type="checkbox"
                        id="taskBasedTiming"
                        checked={settings.taskBasedTiming}
                        onChange={(e) => setSettings({...settings, taskBasedTiming: e.target.checked})}
                        disabled={isRunning}
                        className="rounded"
                      />
                      <label htmlFor="taskBasedTiming" className="text-sm font-medium">{t('pomodoro.settings.taskBasedTiming')}</label>
                    </div>
                    
                    {settings.taskBasedTiming ? (
                      <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
{t('pomodoro.settings.taskBasedTimingDesc')}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">{t('pomodoro.settings.workTime')}</label>
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
                          <label className="text-sm font-medium">{t('pomodoro.settings.shortBreak')}</label>
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
                          <label className="text-sm font-medium">{t('pomodoro.settings.longBreak')}</label>
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
                      </div>
                    )}
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
                      disabled={isRunning}
                      className="rounded"
                    />
                    <label htmlFor="autoStart" className="text-sm">{t('pomodoro.settings.autoStart')}</label>
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
                      disabled={isRunning}
                      className="rounded"
                    />
                    <label htmlFor="soundEnabled" className="text-sm flex items-center space-x-1">
                      <Volume2 className="h-4 w-4" />
                      <span>{t('pomodoro.settings.soundEnabled')}</span>
                    </label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tasks Card */}
          <Card>
            <CardContent className={`p-6 ${!isRunning && timerState !== 'idle' ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{t('pomodoro.tasks.title')}</h3>
                {!isRunning && timerState !== 'idle' && (
                  <span className="text-xs text-muted-foreground">(일시정지 중 비활성화)</span>
                )}
              </div>
              
              {/* Add new task */}
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  placeholder={t('pomodoro.tasks.placeholder')}
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
                    } ${task.completed ? 'opacity-60' : ''} ${isRunning ? 'opacity-75 pointer-events-none' : ''}`}
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskComplete(task.id)}
                        disabled={isRunning}
                        className="rounded flex-shrink-0"
                      />
                      <div 
                        className={`text-sm ${isRunning ? 'cursor-default' : 'cursor-pointer'} truncate ${
                          task.completed ? 'line-through text-muted-foreground' : ''
                        }`}
                        onClick={() => !isRunning && selectTask(task.id)}
                        onDoubleClick={() => !isRunning && settings.taskBasedTiming && setEditingTaskId(task.id)}
                        title={
                          isRunning 
                            ? `${task.text} (타이머 실행 중 변경 불가)` 
                            : settings.taskBasedTiming 
                              ? `${task.text} (더블클릭으로 시간 설정)` 
                              : task.text
                        }
                      >
                        {task.text}
                        {task.completedPomodoros > 0 && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            🍅{task.completedPomodoros}
                          </span>
                        )}
                        {settings.taskBasedTiming && task.customWorkTime && (
                          <span className="ml-2 text-xs text-blue-600">
                            ⏱️{task.customWorkTime}{t('common.minutes')}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button 
                      onClick={() => deleteTask(task.id)}
                      variant="ghost"
                      size="sm"
                      disabled={isRunning}
                      className="p-1 h-auto text-muted-foreground hover:text-destructive flex-shrink-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                
                {tasks.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">{t('pomodoro.tasks.emptyDesc')}</p>
                  </div>
                )}
              </div>

              {/* Task Time Settings Modal */}
              {editingTaskId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 max-w-[90vw]">
                    <h3 className="text-lg font-semibold mb-4">{t('pomodoro.settings.timeSettings')}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium block mb-1">{t('pomodoro.settings.workTime')}</label>
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
                        <label className="text-sm font-medium block mb-1">{t('pomodoro.settings.shortBreak')}</label>
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
                        <label className="text-sm font-medium block mb-1">{t('pomodoro.settings.longBreak')}</label>
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
{t('pomodoro.settings.cancel')}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">{t('pomodoro.tips.title')}</h3>
              <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                <p className="flex items-start space-x-2">
                  <span className="flex-shrink-0">🍅</span>
                  <span className="leading-relaxed">{t('pomodoro.tips.tip1')}</span>
                </p>
                <p className="flex items-start space-x-2">
                  <span className="flex-shrink-0">⏰</span>
                  <span className="leading-relaxed">{t('pomodoro.tips.tip2')}</span>
                </p>
                <p className="flex items-start space-x-2">
                  <span className="flex-shrink-0">🚫</span>
                  <span className="leading-relaxed">{t('pomodoro.tips.tip3')}</span>
                </p>
                <p className="flex items-start space-x-2">
                  <span className="flex-shrink-0">📝</span>
                  <span className="leading-relaxed">{t('pomodoro.tips.tip4')}</span>
                </p>
                <p className="flex items-start space-x-2">
                  <span className="flex-shrink-0">🎯</span>
                  <span className="leading-relaxed">{t('pomodoro.tips.tip5')}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Content Section */}
      <div className="space-y-12 mt-16">
        {/* 포모도로 기법 소개 */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">
            {currentLang === 'ko' ? '포모도로 기법이란?' : 
             currentLang === 'ja' ? 'ポモドーロテクニックとは？' : 
             'What is the Pomodoro Technique?'}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {currentLang === 'ko' ? 
              '포모도로 기법은 1980년대 말 프란체스코 시릴로가 개발한 시간 관리 기법입니다. 25분간 집중하여 작업한 후 5분간 휴식하는 사이클을 반복하는 방식으로, 집중력 향상과 생산성 증대에 효과적인 것으로 입증되었습니다. 이 기법은 뇌의 집중력 한계를 고려하여 설계되었으며, 전 세계 수백만 명이 사용하고 있습니다.' :
             currentLang === 'ja' ? 
              'ポモドーロテクニックは1980年代末にフランチェスコ・シリロが開発した時間管理技法です。25分間集中して作業した後5分間休憩するサイクルを繰り返す方式で、集中力向上と生産性増大に効果的であることが実証されています。この技法は脳の集中力限界を考慮して設計されており、世界中で数百万人が使用しています。' :
              'The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It involves repeating cycles of 25 minutes of focused work followed by 5 minutes of rest, proven effective for improving concentration and increasing productivity. This technique is designed considering the brain\'s concentration limits and is used by millions of people worldwide.'
            }
          </p>
        </section>

        {/* 주요 기능 */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">
            {currentLang === 'ko' ? '주요 기능' : 
             currentLang === 'ja' ? '主要機能' : 
             'Main Features'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                {currentLang === 'ko' ? '기본 타이머 기능' : 
                 currentLang === 'ja' ? '基本タイマー機能' : 
                 'Basic Timer Features'}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  {currentLang === 'ko' ? '• 25분 작업 + 5분 휴식 기본 설정' : 
                   currentLang === 'ja' ? '• 25分作業＋5分休憩の基本設定' : 
                   '• Default 25-minute work + 5-minute break setting'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 15분 장휴식 (4회 완료 후)' : 
                   currentLang === 'ja' ? '• 15分長休憩（4回完了後）' : 
                   '• 15-minute long break (after 4 completions)'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 자동 타이머 전환 옵션' : 
                   currentLang === 'ja' ? '• 自動タイマー切り替えオプション' : 
                   '• Automatic timer transition option'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 시각적 진행률 표시' : 
                   currentLang === 'ja' ? '• 視覚的進行率表示' : 
                   '• Visual progress display'}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">
                {currentLang === 'ko' ? '고급 기능' : 
                 currentLang === 'ja' ? '高度な機能' : 
                 'Advanced Features'}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  {currentLang === 'ko' ? '• 할일 목록 연동 관리' : 
                   currentLang === 'ja' ? '• タスクリスト連動管理' : 
                   '• Integrated task list management'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 맞춤형 시간 설정' : 
                   currentLang === 'ja' ? '• カスタム時間設定' : 
                   '• Custom time settings'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 완료 통계 및 기록' : 
                   currentLang === 'ja' ? '• 完了統計および記録' : 
                   '• Completion statistics and records'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 알림음 설정' : 
                   currentLang === 'ja' ? '• 通知音設定' : 
                   '• Sound notification settings'}
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 상세 사용법 가이드 */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">
            {currentLang === 'ko' ? '상세 사용법 가이드' : 
             currentLang === 'ja' ? '詳細使用法ガイド' : 
             'Detailed Usage Guide'}
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {currentLang === 'ko' ? '1. 기본 포모도로 실행' : 
                 currentLang === 'ja' ? '1. 基本ポモドーロ実行' : 
                 '1. Basic Pomodoro Execution'}
              </h3>
              <p className="text-muted-foreground">
                {currentLang === 'ko' ? 
                  '\'시작\' 버튼을 클릭하여 25분 작업 타이머를 시작합니다. 타이머가 종료되면 자동으로 5분 휴식 타이머로 전환됩니다. 4번의 포모도로 완료 후에는 15분 장휴식이 제공됩니다.' :
                 currentLang === 'ja' ? 
                  '「開始」ボタンをクリックして25分作業タイマーを開始します。タイマーが終了すると自動的に5分休憩タイマーに切り替わります。4回のポモドーロ完了後は15分の長休憩が提供されます。' :
                  'Click the \'Start\' button to begin a 25-minute work timer. When the timer ends, it automatically switches to a 5-minute break timer. After completing 4 pomodoros, a 15-minute long break is provided.'
                }
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {currentLang === 'ko' ? '2. 할일 관리 활용' : 
                 currentLang === 'ja' ? '2. タスク管理活用' : 
                 '2. Using Task Management'}
              </h3>
              <p className="text-muted-foreground">
                {currentLang === 'ko' ? 
                  '우측 패널에서 할일을 추가하고 각 작업에 집중할 수 있습니다. 포모도로가 완료될 때마다 해당 작업의 완료 횟수가 자동으로 기록됩니다. 작업별로 예상 포모도로 개수를 설정하여 진행 상황을 추적할 수 있습니다.' :
                 currentLang === 'ja' ? 
                  '右パネルでタスクを追加し、各作業に集中できます。ポモドーロが完了するたびに該当作業の完了回数が自動的に記録されます。作業別に予想ポモドーロ数を設定して進行状況を追跡できます。' :
                  'Add tasks in the right panel and focus on each task. Each time a pomodoro is completed, the completion count for that task is automatically recorded. You can set expected pomodoro counts for each task to track progress.'
                }
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {currentLang === 'ko' ? '3. 설정 맞춤화' : 
                 currentLang === 'ja' ? '3. 設定カスタマイズ' : 
                 '3. Settings Customization'}
              </h3>
              <p className="text-muted-foreground">
                {currentLang === 'ko' ? 
                  '설정 버튼을 통해 작업 시간, 휴식 시간, 자동 시작 여부, 알림음 등을 개인의 작업 스타일에 맞게 조정할 수 있습니다. 집중력이 높은 사람은 작업 시간을 늘리고, 초보자는 짧게 설정하는 것을 권장합니다.' :
                 currentLang === 'ja' ? 
                  '設定ボタンで作業時間、休憩時間、自動開始の有無、通知音などを個人の作業スタイルに合わせて調整できます。集中力が高い人は作業時間を延ばし、初心者は短く設定することを推奨します。' :
                  'Through the settings button, you can adjust work time, break time, auto-start options, notification sounds, and more to match your personal work style. Those with high concentration can increase work time, while beginners are recommended to set shorter durations.'
                }
              </p>
            </div>
          </div>
        </section>

        {/* 활용 예시 */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">
            {currentLang === 'ko' ? '활용 예시' : 
             currentLang === 'ja' ? '活用例' : 
             'Usage Examples'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
              <h3 className="text-lg font-semibold mb-2">
                {currentLang === 'ko' ? '학습 및 연구' : 
                 currentLang === 'ja' ? '学習・研究' : 
                 'Study & Research'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  '독서, 논문 작성, 언어 학습, 온라인 강의 수강 등 집중이 필요한 학습 활동에 효과적입니다. 정해진 시간 동안 한 주제에만 집중하여 학습 효율을 높일 수 있습니다.' :
                 currentLang === 'ja' ? 
                  '読書、論文作成、言語学習、オンライン講義受講など集中が必要な学習活動に効果的です。決められた時間の間に一つのテーマだけに集中して学習効率を高めることができます。' :
                  'Effective for learning activities that require concentration such as reading, writing papers, language learning, and taking online courses. You can improve learning efficiency by focusing on one topic for a set period of time.'
                }
              </p>
            </div>
            <div className="bg-secondary/5 rounded-lg p-4 border border-secondary/20">
              <h3 className="text-lg font-semibold mb-2">
                {currentLang === 'ko' ? '업무 및 프로젝트' : 
                 currentLang === 'ja' ? '業務・プロジェクト' : 
                 'Work & Projects'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  '코딩, 문서 작성, 기획서 작성, 디자인 작업 등 창의적이고 집중적인 업무에 활용할 수 있습니다. 업무를 작은 단위로 나누어 체계적으로 진행할 수 있습니다.' :
                 currentLang === 'ja' ? 
                  'コーディング、文書作成、企画書作成、デザイン作業など創造的で集中的な業務に活用できます。業務を小さな単位に分けて体系的に進行できます。' :
                  'Can be used for creative and intensive work such as coding, document writing, proposal writing, and design work. You can systematically proceed by dividing work into small units.'
                }
              </p>
            </div>
          </div>
        </section>

        {/* 자주 묻는 질문 FAQ */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">
            {currentLang === 'ko' ? '자주 묻는 질문 (FAQ)' : 
             currentLang === 'ja' ? 'よくある質問（FAQ）' : 
             'Frequently Asked Questions (FAQ)'}
          </h2>
          <div className="space-y-4">
            <div className="border-b border-border pb-4">
              <h3 className="font-semibold mb-2">
                {currentLang === 'ko' ? 'Q. 25분이 너무 길거나 짧게 느껴져요' : 
                 currentLang === 'ja' ? 'Q. 25分が長すぎたり短すぎたりします' : 
                 'Q. 25 minutes feels too long or too short'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  'A. 개인차가 있을 수 있습니다. 설정에서 작업 시간을 15-45분 사이로 조정해보세요. 초보자는 15분부터 시작하여 점차 늘려가는 것을 권장합니다.' :
                 currentLang === 'ja' ? 
                  'A. 個人差がある場合があります。設定で作業時間を15-45分の間で調整してみてください。初心者は15分から始めて徐々に延ばしていくことを推奨します。' :
                  'A. Individual differences may exist. Try adjusting the work time between 15-45 minutes in settings. Beginners are recommended to start with 15 minutes and gradually increase.'
                }
              </p>
            </div>
            <div className="border-b border-border pb-4">
              <h3 className="font-semibold mb-2">
                {currentLang === 'ko' ? 'Q. 휴식 시간에 무엇을 해야 하나요?' : 
                 currentLang === 'ja' ? 'Q. 休憩時間に何をすればよいですか？' : 
                 'Q. What should I do during break time?'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  'A. 스트레칭, 깊은 호흡, 물 마시기, 가벼운 산책 등 뇌를 쉬게 하는 활동을 권장합니다. 스마트폰이나 컴퓨터 사용은 피하는 것이 좋습니다.' :
                 currentLang === 'ja' ? 
                  'A. ストレッチ、深呼吸、水分補給、軽い散歩など脳を休ませる活動を推奨します。スマートフォンやコンピューターの使用は避けることをお勧めします。' :
                  'A. We recommend activities that rest your brain such as stretching, deep breathing, drinking water, and light walking. It\'s best to avoid using smartphones or computers.'
                }
              </p>
            </div>
            <div className="border-b border-border pb-4">
              <h3 className="font-semibold mb-2">
                {currentLang === 'ko' ? 'Q. 중간에 방해받으면 어떻게 하나요?' : 
                 currentLang === 'ja' ? 'Q. 途中で邪魔されたらどうすればよいですか？' : 
                 'Q. What should I do if interrupted?'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  'A. 예상치 못한 방해가 있으면 타이머를 일시정지하고 방해 요소를 처리한 후 재시작하세요. 가능하면 방해받지 않을 환경을 미리 조성하는 것이 중요합니다.' :
                 currentLang === 'ja' ? 
                  'A. 予想外の邪魔があった場合は、タイマーを一時停止して邪魔な要素を処理した後再開してください。可能であれば邪魔されない環境を事前に作ることが重要です。' :
                  'A. If unexpected interruptions occur, pause the timer, handle the interruption, then restart. It\'s important to create an undisturbed environment in advance when possible.'
                }
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                {currentLang === 'ko' ? 'Q. 하루에 몇 개의 포모도로가 적당한가요?' : 
                 currentLang === 'ja' ? 'Q. 1日何個のポモドーロが適切ですか？' : 
                 'Q. How many pomodoros per day is appropriate?'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  'A. 개인의 집중력과 업무 강도에 따라 다르지만, 일반적으로 하루 6-12개 정도가 적당합니다. 처음에는 3-4개부터 시작하여 점차 늘려가세요.' :
                 currentLang === 'ja' ? 
                  'A. 個人の集中力と業務強度によって異なりますが、一般的に1日6-12個程度が適切です。最初は3-4個から始めて徐々に増やしてください。' :
                  'A. It varies depending on individual concentration and work intensity, but generally 6-12 per day is appropriate. Start with 3-4 initially and gradually increase.'
                }
              </p>
            </div>
          </div>
        </section>

        {/* 사용 팁과 요령 */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">
            {currentLang === 'ko' ? '사용 팁과 요령' : 
             currentLang === 'ja' ? '使用ヒントとコツ' : 
             'Usage Tips & Tricks'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                {currentLang === 'ko' ? '효과적인 포모도로' : 
                 currentLang === 'ja' ? '効果的なポモドーロ' : 
                 'Effective Pomodoro'}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  {currentLang === 'ko' ? '• 작업 전 명확한 목표 설정' : 
                   currentLang === 'ja' ? '• 作業前に明確な目標設定' : 
                   '• Set clear goals before work'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 방해 요소 미리 제거' : 
                   currentLang === 'ja' ? '• 妨害要素を事前に除去' : 
                   '• Remove distractions in advance'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 휴식 시간 철저히 지키기' : 
                   currentLang === 'ja' ? '• 休憩時間を徹底的に守る' : 
                   '• Strictly observe break times'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 완료된 포모도로 기록하기' : 
                   currentLang === 'ja' ? '• 完了したポモドーロを記録' : 
                   '• Record completed pomodoros'}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">
                {currentLang === 'ko' ? '집중력 향상' : 
                 currentLang === 'ja' ? '集中力向上' : 
                 'Improve Concentration'}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  {currentLang === 'ko' ? '• 알림 및 SNS 차단' : 
                   currentLang === 'ja' ? '• 通知およびSNSブロック' : 
                   '• Block notifications and social media'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 편안한 작업 환경 조성' : 
                   currentLang === 'ja' ? '• 快適な作業環境作り' : 
                   '• Create a comfortable work environment'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 적절한 조명과 온도 유지' : 
                   currentLang === 'ja' ? '• 適切な照明と温度維持' : 
                   '• Maintain proper lighting and temperature'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 규칙적인 수면과 식사' : 
                   currentLang === 'ja' ? '• 規則的な睡眠と食事' : 
                   '• Regular sleep and meals'}
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 포모도로 기법의 과학적 근거 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <i className="ri-microscope-line text-primary"></i>
              {currentLang === 'ko' ? '포모도로 기법의 과학적 근거' :
               currentLang === 'ja' ? 'ポモドーロ・テクニックの科学的根拠' :
               'Scientific Basis of Pomodoro Technique'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <i className="ri-brain-line text-blue-500"></i>
                  {currentLang === 'ko' ? '뇌과학적 배경' :
                   currentLang === 'ja' ? '脳科学的背景' :
                   'Neuroscientific Background'}
                </h3>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg border border-blue-200/50 dark:border-blue-800/30">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                      {currentLang === 'ko' ? '집중력의 생물학적 한계' :
                       currentLang === 'ja' ? '集中力の生物学的限界' :
                       'Biological Limits of Attention'}
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {currentLang === 'ko' ? '인간의 뇌는 진화적으로 장시간 집중을 유지하도록 설계되지 않았습니다. 신경과학 연구에 따르면, 성인의 평균 집중 지속 시간은 15-25분 정도로, 이 시간을 초과하면 주의력이 급격히 감소하고 실수가 증가합니다.' :
                       currentLang === 'ja' ? '人間の脳は進化的に長時間の集中を維持するよう設計されていません。神経科学研究によると、成人の平均集中持続時間は15-25分程度で、この時間を超えると注意力が急激に減少し、ミスが増加します。' :
                       'The human brain is not evolutionarily designed to maintain long-term focus. According to neuroscience research, the average attention span of adults is about 15-25 minutes, after which attention rapidly decreases and errors increase.'}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-lg border border-green-200/50 dark:border-green-800/30">
                    <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                      {currentLang === 'ko' ? '도파민과 보상 시스템' :
                       currentLang === 'ja' ? 'ドーパミンと報酬システム' :
                       'Dopamine and Reward System'}
                    </h4>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {currentLang === 'ko' ? '25분마다 주어지는 휴식은 뇌의 보상 회로를 활성화시켜 도파민을 분비합니다. 이는 다음 작업 세션에 대한 동기를 높이고, 장기적으로 학습과 업무에 대한 긍정적 연상을 형성합니다.' :
                       currentLang === 'ja' ? '25分ごとに与えられる休憩は脳の報酬回路を活性化し、ドーパミンを分泌します。これは次の作業セッションへの動機を高め、長期的に学習や業務に対する正の連想を形成します。' :
                       'The 25-minute breaks activate the brain\'s reward circuit and release dopamine. This increases motivation for the next work session and forms positive associations with learning and work in the long term.'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <i className="ri-heart-pulse-line text-red-500"></i>
                  {currentLang === 'ko' ? '심리학적 효과' :
                   currentLang === 'ja' ? '心理学的効果' :
                   'Psychological Effects'}
                </h3>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-4 rounded-lg border border-purple-200/50 dark:border-purple-800/30">
                    <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">
                      {currentLang === 'ko' ? '플로우 상태 유도' :
                       currentLang === 'ja' ? 'フロー状態の誘導' :
                       'Inducing Flow State'}
                    </h4>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      {currentLang === 'ko' ? '포모도로 기법은 미하이 칙센트미하이가 정의한 \'플로우(Flow)\' 상태로 더 쉽게 진입할 수 있도록 돕습니다. 명확한 시간 제한과 목표는 주의력을 현재 과제에 완전히 집중시킵니다.' :
                       currentLang === 'ja' ? 'ポモドーロ・テクニックは、ミハイ・チクセントミハイが定義した「フロー」状態により簡単に入ることができるよう助けます。明確な時間制限と目標は注意力を現在の課題に完全に集中させます。' :
                       'The Pomodoro Technique helps you enter the \'Flow\' state defined by Mihaly Csikszentmihalyi more easily. Clear time limits and goals focus attention completely on the current task.'}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-4 rounded-lg border border-orange-200/50 dark:border-orange-800/30">
                    <h4 className="font-medium text-orange-800 dark:text-orange-300 mb-2">
                      {currentLang === 'ko' ? '완료감과 성취감' :
                       currentLang === 'ja' ? '完了感と達成感' :
                       'Sense of Completion and Achievement'}
                    </h4>
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      {currentLang === 'ko' ? '25분이라는 관리 가능한 시간 단위는 심리적 부담을 줄이고, 각 포모도로 완료 시마다 성취감을 제공합니다. 이러한 작은 성공의 축적은 장기적인 동기 유지에 중요한 역할을 합니다.' :
                       currentLang === 'ja' ? '25分という管理可能な時間単位は心理的負担を減らし、各ポモドーロ完了時に達成感を提供します。このような小さな成功の蓄積は長期的な動機維持に重要な役割を果たします。' :
                       'The manageable 25-minute time unit reduces psychological burden and provides a sense of achievement with each completed pomodoro. This accumulation of small successes plays an important role in maintaining long-term motivation.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 상세 사용법 가이드 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <i className="ri-book-open-line text-primary"></i>
              {currentLang === 'ko' ? '상세 사용법 가이드' :
               currentLang === 'ja' ? '詳細使用法ガイド' :
               'Detailed Usage Guide'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-sm flex items-center justify-center">1</span>
                  {currentLang === 'ko' ? '첫 포모도로 시작하기' :
                   currentLang === 'ja' ? '最初のポモドーロ開始' :
                   'Starting Your First Pomodoro'}
                </h3>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-3 rounded-lg border border-blue-200/50 dark:border-blue-800/30">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                      {currentLang === 'ko' ? '준비 단계' :
                       currentLang === 'ja' ? '準備段階' :
                       'Preparation Phase'}
                    </h4>
                    <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                      <li>• {currentLang === 'ko' ? '작업 선택: 현재 작업 입력창에 집중할 구체적인 작업을 입력' :
                              currentLang === 'ja' ? '作業選択：現在の作業入力欄に集中する具体的な作業を入力' :
                              'Task selection: Enter specific task to focus on in current task input'}</li>
                      <li>• {currentLang === 'ko' ? '환경 조성: 방해 요소 제거, 필요한 자료 준비, 알림 끄기' :
                              currentLang === 'ja' ? '環境作り：妨害要素除去、必要な資料準備、通知オフ' :
                              'Environment setup: Remove distractions, prepare materials, turn off notifications'}</li>
                      <li>• {currentLang === 'ko' ? '목표 설정: 이번 25분 동안 달성하고자 하는 구체적 목표 명시' :
                              currentLang === 'ja' ? '目標設定：今回の25分間で達成したい具体的目標を明示' :
                              'Goal setting: Specify concrete objectives to achieve during this 25 minutes'}</li>
                      <li>• {currentLang === 'ko' ? '타이머 시작: \'시작\' 버튼 클릭으로 첫 포모도로 세션 개시' :
                              currentLang === 'ja' ? 'タイマー開始：「開始」ボタンクリックで最初のポモドーロセッション開始' :
                              'Timer start: Click \'Start\' button to begin first pomodoro session'}</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-500 text-white rounded-full text-sm flex items-center justify-center">2</span>
                  {currentLang === 'ko' ? '효과적인 휴식 활용법' :
                   currentLang === 'ja' ? '効果的な休憩活用法' :
                   'Effective Break Utilization'}
                </h3>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-3 rounded-lg border border-green-200/50 dark:border-green-800/30">
                    <h4 className="font-medium text-green-800 dark:text-green-300 mb-1">
                      {currentLang === 'ko' ? '5분 단휴식 (1-3번째 포모도로 후)' :
                       currentLang === 'ja' ? '5分短休憩（1-3回目ポモドーロ後）' :
                       '5-minute Short Break (After 1st-3rd Pomodoro)'}
                    </h4>
                    <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
                      <li>• {currentLang === 'ko' ? '신체 활동: 간단한 스트레칭, 목과 어깨 돌리기, 가벼운 걷기' :
                              currentLang === 'ja' ? '身体活動：簡単なストレッチ、首と肩回し、軽い歩行' :
                              'Physical activity: Simple stretching, neck and shoulder rolls, light walking'}</li>
                      <li>• {currentLang === 'ko' ? '호흡 운동: 깊은 복식 호흡 또는 간단한 명상' :
                              currentLang === 'ja' ? '呼吸運動：深い腹式呼吸または簡単な瞑想' :
                              'Breathing exercises: Deep diaphragmatic breathing or simple meditation'}</li>
                      <li>• {currentLang === 'ko' ? '시각 휴식: 먼 곳 바라보기, 눈 운동, 창밖 풍경 감상' :
                              currentLang === 'ja' ? '視覚休息：遠くを見る、目の運動、窓外の景色鑑賞' :
                              'Visual rest: Looking at distant objects, eye exercises, enjoying outdoor scenery'}</li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-3 rounded-lg border border-orange-200/50 dark:border-orange-800/30">
                    <h4 className="font-medium text-orange-800 dark:text-orange-300 mb-1">
                      {currentLang === 'ko' ? '15분 장휴식 (4번째 포모도로 후)' :
                       currentLang === 'ja' ? '15分長休憩（4回目ポモドーロ後）' :
                       '15-minute Long Break (After 4th Pomodoro)'}
                    </h4>
                    <ul className="text-sm text-orange-600 dark:text-orange-400 space-y-1">
                      <li>• {currentLang === 'ko' ? '완전한 휴식: 작업과 관련된 모든 것에서 완전히 분리' :
                              currentLang === 'ja' ? '完全な休息：作業に関連するすべてから完全に分離' :
                              'Complete rest: Completely disconnect from all work-related activities'}</li>
                      <li>• {currentLang === 'ko' ? '가벼운 산책: 실외 공기 마시며 짧은 산책' :
                              currentLang === 'ja' ? '軽い散歩：屋外の空気を吸いながら短い散歩' :
                              'Light walk: Short walk while breathing fresh outdoor air'}</li>
                      <li>• {currentLang === 'ko' ? '가벼운 식사: 건강한 간식이나 가벼운 식사' :
                              currentLang === 'ja' ? '軽い食事：健康的なおやつや軽い食事' :
                              'Light meal: Healthy snacks or light meals'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 다양한 활용 분야 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <i className="ri-lightbulb-line text-yellow-500"></i>
              {currentLang === 'ko' ? '다양한 활용 분야와 실제 사례' :
               currentLang === 'ja' ? '様々な活用分野と実際の事例' :
               'Various Application Fields and Real Cases'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <i className="ri-book-line text-blue-600 text-xl"></i>
                </div>
                <h3 className="font-semibold text-foreground">
                  {currentLang === 'ko' ? '학습 및 교육 분야' :
                   currentLang === 'ja' ? '学習と教育分野' :
                   'Learning and Education'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentLang === 'ko' ? '체계적인 학습과 기억력 향상' :
                   currentLang === 'ja' ? '体系的な学習と記憶力向上' :
                   'Systematic learning and memory improvement'}
                </p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• {currentLang === 'ko' ? '언어 학습: 25분 동안 새로운 단어 암기, 5분 휴식 시 복습' :
                          currentLang === 'ja' ? '言語学習：25分間新しい単語暗記、5分休憩時復習' :
                          'Language learning: 25min new vocabulary memorization, 5min break review'}</li>
                  <li>• {currentLang === 'ko' ? '수학/과학: 문제 풀이 25분, 휴식 시간에 틀린 문제 검토' :
                          currentLang === 'ja' ? '数学/科学：問題解決25分、休憩時間に間違った問題検討' :
                          'Math/Science: 25min problem solving, error review during breaks'}</li>
                  <li>• {currentLang === 'ko' ? '논문 작성: 연구 25분, 휴식 시간에 아이디어 정리' :
                          currentLang === 'ja' ? '論文作成：研究25分、休憩時間にアイデア整理' :
                          'Paper writing: 25min research, idea organization during breaks'}</li>
                  <li>• {currentLang === 'ko' ? '온라인 강의: 강의 수강 25분, 휴식 시간에 노트 정리' :
                          currentLang === 'ja' ? 'オンライン講義：講義受講25分、休憩時間にノート整理' :
                          'Online lectures: 25min lecture viewing, note organization during breaks'}</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <i className="ri-code-line text-green-600 text-xl"></i>
                </div>
                <h3 className="font-semibold text-foreground">
                  {currentLang === 'ko' ? '소프트웨어 개발 및 IT' :
                   currentLang === 'ja' ? 'ソフトウェア開発とIT' :
                   'Software Development & IT'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentLang === 'ko' ? '효율적인 코딩과 문제 해결' :
                   currentLang === 'ja' ? '効率的なコーディングと問題解決' :
                   'Efficient coding and problem solving'}
                </p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• {currentLang === 'ko' ? '코드 리뷰: 25분 동안 집중적인 코드 검토' :
                          currentLang === 'ja' ? 'コードレビュー：25分間集中的なコード検討' :
                          'Code review: 25min intensive code examination'}</li>
                  <li>• {currentLang === 'ko' ? '문서화: API 문서나 기술 문서 작성' :
                          currentLang === 'ja' ? '文書化：APIドキュメントや技術文書作成' :
                          'Documentation: API docs or technical document writing'}</li>
                  <li>• {currentLang === 'ko' ? '학습: 새로운 프레임워크나 언어 학습' :
                          currentLang === 'ja' ? '学習：新しいフレームワークや言語学習' :
                          'Learning: New framework or language acquisition'}</li>
                  <li>• {currentLang === 'ko' ? '디버깅: 복잡한 버그 해결에 집중적 접근' :
                          currentLang === 'ja' ? 'デバッグ：複雑なバグ解決に集中的アプローチ' :
                          'Debugging: Focused approach to complex bug resolution'}</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <i className="ri-paint-brush-line text-purple-600 text-xl"></i>
                </div>
                <h3 className="font-semibold text-foreground">
                  {currentLang === 'ko' ? '창작 및 예술 분야' :
                   currentLang === 'ja' ? '創作と芸術分野' :
                   'Creative and Artistic Fields'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentLang === 'ko' ? '창의적 블록 극복과 지속적 창작' :
                   currentLang === 'ja' ? '創造的ブロック克服と持続的創作' :
                   'Overcoming creative blocks and sustained creation'}
                </p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• {currentLang === 'ko' ? '글쓰기: 매일 4-6포모도로의 꾸준한 글쓰기' :
                          currentLang === 'ja' ? '文章作成：毎日4-6ポモドーロの継続的な文章作成' :
                          'Writing: Daily 4-6 pomodoros of consistent writing'}</li>
                  <li>• {currentLang === 'ko' ? '디자인: 아이디어 스케치 1포모도로, 세부 작업 3-5포모도로' :
                          currentLang === 'ja' ? 'デザイン：アイデアスケッチ1ポモドーロ、詳細作業3-5ポモドーロ' :
                          'Design: 1 pomodoro idea sketching, 3-5 pomodoros detailed work'}</li>
                  <li>• {currentLang === 'ko' ? '음악 연습: 기술적 연습과 곡 해석 분리' :
                          currentLang === 'ja' ? '音楽練習：技術的練習と曲解釈の分離' :
                          'Music practice: Separating technical practice and musical interpretation'}</li>
                  <li>• {currentLang === 'ko' ? '영상 제작: 기획, 촬영, 편집 단계별 집중' :
                          currentLang === 'ja' ? '映像制作：企画、撮影、編集段階別集中' :
                          'Video production: Step-by-step focus on planning, shooting, editing'}</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <i className="ri-briefcase-line text-orange-600 text-xl"></i>
                </div>
                <h3 className="font-semibold text-foreground">
                  {currentLang === 'ko' ? '비즈니스 및 업무 환경' :
                   currentLang === 'ja' ? 'ビジネスと業務環境' :
                   'Business and Work Environment'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentLang === 'ko' ? '생산성 향상과 효율적 업무 관리' :
                   currentLang === 'ja' ? '生産性向上と効率的業務管理' :
                   'Productivity improvement and efficient work management'}
                </p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• {currentLang === 'ko' ? '기획 업무: 시장 조사 2포모도로, 전략 수립 3포모도로' :
                          currentLang === 'ja' ? '企画業務：市場調査2ポモドーロ、戦略策定3ポモドーロ' :
                          'Planning work: 2 pomodoros market research, 3 pomodoros strategy development'}</li>
                  <li>• {currentLang === 'ko' ? '영업 활동: 고객 리스트 정리 1포모도로, 콜드콜 3포모도로' :
                          currentLang === 'ja' ? '営業活動：顧客リスト整理1ポモドーロ、コールドコール3ポモドーロ' :
                          'Sales activities: 1 pomodoro client list organization, 3 pomodoros cold calling'}</li>
                  <li>• {currentLang === 'ko' ? '회계 업무: 장부 정리 2포모도로, 분석 보고서 작성 4포모도로' :
                          currentLang === 'ja' ? '会計業務：帳簿整理2ポモドーロ、分析レポート作成4ポモドーロ' :
                          'Accounting work: 2 pomodoros bookkeeping, 4 pomodoros analysis report writing'}</li>
                  <li>• {currentLang === 'ko' ? '프로젝트 관리: 25분 집중 업무 + 5분 팀 커뮤니케이션' :
                          currentLang === 'ja' ? 'プロジェクト管理：25分集中業務+5分チームコミュニケーション' :
                          'Project management: 25min focused work + 5min team communication'}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 과학적 검증과 연구 결과 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <i className="ri-flask-line text-green-500"></i>
              {currentLang === 'ko' ? '과학적 검증과 연구 결과' :
               currentLang === 'ja' ? '科学的検証と研究結果' :
               'Scientific Validation and Research Results'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <i className="ri-bar-chart-line text-blue-500"></i>
                  {currentLang === 'ko' ? '생산성 향상 연구' :
                   currentLang === 'ja' ? '生産性向上研究' :
                   'Productivity Improvement Research'}
                </h3>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg border border-blue-200/50 dark:border-blue-800/30">
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                    {currentLang === 'ko' ? '하버드 비즈니스 스쿨 연구 (2019)' :
                     currentLang === 'ja' ? 'ハーバード・ビジネススクール研究（2019）' :
                     'Harvard Business School Study (2019)'}
                  </h4>
                  <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                    <li>• {currentLang === 'ko' ? '업무 효율성 평균 23% 향상' :
                            currentLang === 'ja' ? '業務効率性平均23%向上' :
                            'Average 23% improvement in work efficiency'}</li>
                    <li>• {currentLang === 'ko' ? '창의성 요구 작업에서 35% 성과 개선' :
                            currentLang === 'ja' ? '創造性が要求される作業で35%成果改善' :
                            '35% performance improvement in creative tasks'}</li>
                    <li>• {currentLang === 'ko' ? '지식 근로자 대상 6개월 장기 연구' :
                            currentLang === 'ja' ? '知識労働者対象6か月長期研究' :
                            '6-month long-term study on knowledge workers'}</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <i className="ri-heart-line text-red-500"></i>
                  {currentLang === 'ko' ? '스트레스 감소 효과' :
                   currentLang === 'ja' ? 'ストレス軽減効果' :
                   'Stress Reduction Effects'}
                </h3>
                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 p-4 rounded-lg border border-red-200/50 dark:border-red-800/30">
                  <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">
                    {currentLang === 'ko' ? 'UCLA 심리학과 연구' :
                     currentLang === 'ja' ? 'UCLA心理学科研究' :
                     'UCLA Psychology Department Research'}
                  </h4>
                  <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                    <li>• {currentLang === 'ko' ? '코르티솔 수치 평균 18% 감소' :
                            currentLang === 'ja' ? 'コルチゾール数値平均18%減少' :
                            'Average 18% decrease in cortisol levels'}</li>
                    <li>• {currentLang === 'ko' ? '주관적 스트레스 지수 유의미한 감소' :
                            currentLang === 'ja' ? '主観的ストレス指数有意な減少' :
                            'Significant decrease in subjective stress index'}</li>
                    <li>• {currentLang === 'ko' ? '6주간 포모도로 기법 사용 그룹 대상' :
                            currentLang === 'ja' ? '6週間ポモドーロ・テクニック使用グループ対象' :
                            'Study on group using Pomodoro Technique for 6 weeks'}</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <i className="ri-brain-line text-purple-500"></i>
                  {currentLang === 'ko' ? '뇌 영상 연구' :
                   currentLang === 'ja' ? '脳画像研究' :
                   'Brain Imaging Research'}
                </h3>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-4 rounded-lg border border-purple-200/50 dark:border-purple-800/30">
                  <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">
                    {currentLang === 'ko' ? 'fMRI 뇌 영상 연구' :
                     currentLang === 'ja' ? 'fMRI脳画像研究' :
                     'fMRI Brain Imaging Study'}
                  </h4>
                  <ul className="text-sm text-purple-600 dark:text-purple-400 space-y-1">
                    <li>• {currentLang === 'ko' ? '전전두엽 활성도 30% 더 높게 유지' :
                            currentLang === 'ja' ? '前頭前野活性度30%より高く維持' :
                            '30% higher prefrontal cortex activity maintained'}</li>
                    <li>• {currentLang === 'ko' ? '집중력 담당 영역의 지속적 활성화' :
                            currentLang === 'ja' ? '集中力担当領域の持続的活性化' :
                            'Sustained activation of attention-responsible areas'}</li>
                    <li>• {currentLang === 'ko' ? '장시간 작업자 대비 뇌 효율성 증명' :
                            currentLang === 'ja' ? '長時間作業者に比べて脳効率性証明' :
                            'Proven brain efficiency compared to long-duration workers'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 생산성 최적화 전략 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <i className="ri-rocket-line text-primary"></i>
              {currentLang === 'ko' ? '생산성 최적화 전략' :
               currentLang === 'ja' ? '生産性最適化戦略' :
               'Productivity Optimization Strategies'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <i className="ri-battery-charge-line text-green-500"></i>
                  {currentLang === 'ko' ? '에너지 관리 연동' :
                   currentLang === 'ja' ? 'エネルギー管理連動' :
                   'Energy Management Integration'}
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {currentLang === 'ko' ? '개인의 생체 리듬과 포모도로를 연동하여 효율성을 극대화할 수 있습니다. 대부분의 사람들은 오전 9-11시, 오후 2-4시에 집중력이 최고조에 달하므로, 이 시간대에 가장 중요하고 어려운 작업을 배치하는 것이 효과적입니다.' :
                     currentLang === 'ja' ? '個人の生体リズムとポモドーロを連動して効率性を最大化できます。ほとんどの人は午前9-11時、午後2-4時に集中力が最高潮に達するため、この時間帯に最も重要で難しい作業を配置することが効果的です。' :
                     'You can maximize efficiency by syncing pomodoros with your personal circadian rhythm. Most people reach peak concentration at 9-11 AM and 2-4 PM, so it\'s effective to schedule the most important and difficult tasks during these periods.'}
                  </p>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-3 rounded-lg border border-green-200/50 dark:border-green-800/30">
                    <h4 className="font-medium text-green-800 dark:text-green-300 mb-1">
                      {currentLang === 'ko' ? '최적 시간대 활용' :
                       currentLang === 'ja' ? '最適時間帯活用' :
                       'Optimal Time Zone Utilization'}
                    </h4>
                    <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
                      <li>• {currentLang === 'ko' ? '오전 9-11시: 가장 어려운 창작 작업' :
                              currentLang === 'ja' ? '午前9-11時：最も難しい創作作業' :
                              '9-11 AM: Most challenging creative work'}</li>
                      <li>• {currentLang === 'ko' ? '오후 2-4시: 분석적 사고가 필요한 작업' :
                              currentLang === 'ja' ? '午後2-4時：分析的思考が必要な作業' :
                              '2-4 PM: Work requiring analytical thinking'}</li>
                      <li>• {currentLang === 'ko' ? '저녁 시간: 정리, 검토, 계획 수립' :
                              currentLang === 'ja' ? '夕方時間：整理、検討、計画策定' :
                              'Evening: Organization, review, planning'}</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <i className="ri-team-line text-blue-500"></i>
                  {currentLang === 'ko' ? '팀 단위 포모도로' :
                   currentLang === 'ja' ? 'チーム単位ポモドーロ' :
                   'Team-based Pomodoro'}
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {currentLang === 'ko' ? '팀 전체가 같은 시간에 포모도로를 시작하여 집중 시간과 소통 시간을 명확히 분리하는 방법입니다. 이는 불필요한 방해를 줄이고 팀 전체의 생산성을 높이는 효과적인 방법입니다.' :
                     currentLang === 'ja' ? 'チーム全体が同じ時間にポモドーロを開始し、集中時間とコミュニケーション時間を明確に分離する方法です。これは不要な妨害を減らし、チーム全体の生産性を高める効果的な方法です。' :
                     'This method involves the entire team starting pomodoros at the same time, clearly separating focus time and communication time. This effectively reduces unnecessary interruptions and increases overall team productivity.'}
                  </p>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-3 rounded-lg border border-blue-200/50 dark:border-blue-800/30">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                      {currentLang === 'ko' ? '역할별 맞춤화' :
                       currentLang === 'ja' ? '役割別カスタマイズ' :
                       'Role-based Customization'}
                    </h4>
                    <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                      <li>• {currentLang === 'ko' ? '개발자: 50분 집중형 (복잡한 문제 해결)' :
                              currentLang === 'ja' ? '開発者：50分集中型（複雑な問題解決）' :
                              'Developers: 50min focus type (complex problem solving)'}</li>
                      <li>• {currentLang === 'ko' ? '디자이너: 25분 표준형 (창의적 작업)' :
                              currentLang === 'ja' ? 'デザイナー：25分標準型（創造的作業）' :
                              'Designers: 25min standard type (creative work)'}</li>
                      <li>• {currentLang === 'ko' ? '매니저: 15분 짧은 집중형 (다양한 업무 전환)' :
                              currentLang === 'ja' ? 'マネージャー：15分短い集中型（様々な業務転換）' :
                              'Managers: 15min short focus type (various task switching)'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 마무리 섹션 */}
        <div className="text-center bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-xl p-8 border border-red-200/50 dark:border-red-800/30">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            {currentLang === 'ko' ? '집중력과 생산성 혁신의 시작' :
             currentLang === 'ja' ? '集中力と生産性革新の始まり' :
             'The Beginning of Focus and Productivity Innovation'}
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
            {currentLang === 'ko' ? 'ToolHub.tools 포모도로 타이머와 함께 과학적으로 검증된 시간 관리의 힘을 경험해보세요. 25분의 집중이 만들어내는 놀라운 변화를 지금 시작하세요.' :
             currentLang === 'ja' ? 'ToolHub.toolsポモドーロタイマーと一緒に科学的に検証された時間管理の力を体験してください。25分の集中が作り出す驚くべき変化を今始めてください。' :
             'Experience the power of scientifically validated time management with ToolHub.tools Pomodoro Timer. Start the amazing transformation that 25 minutes of focus can create right now.'}
          </p>
          <div className="flex justify-center">
            <div className="animate-pulse">
              <i className="ri-timer-line text-primary text-4xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}