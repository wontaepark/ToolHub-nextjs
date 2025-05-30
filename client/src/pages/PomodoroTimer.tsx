import { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        <h2 className="text-3xl font-bold mb-2">{t('tools.pomodoroTimer.title')}</h2>
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
                  <span>현재 세션</span>
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
                            ⏱️{task.customWorkTime}분
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