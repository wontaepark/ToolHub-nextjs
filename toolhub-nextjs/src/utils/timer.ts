/**
 * 공통 타이머 유틸리티 함수들
 */

export interface TimerState {
  timeLeft: number; // seconds
  isRunning: boolean;
  isPaused: boolean;
  totalTime: number; // seconds
}

export class Timer {
  private intervalId: NodeJS.Timeout | null = null;
  private state: TimerState;
  private onTick?: (state: TimerState) => void;
  private onComplete?: () => void;

  constructor(
    initialTime: number, // seconds
    onTick?: (state: TimerState) => void,
    onComplete?: () => void
  ) {
    this.state = {
      timeLeft: initialTime,
      isRunning: false,
      isPaused: false,
      totalTime: initialTime
    };
    this.onTick = onTick;
    this.onComplete = onComplete;
  }

  start(): void {
    if (this.state.isRunning) return;

    this.state.isRunning = true;
    this.state.isPaused = false;

    this.intervalId = setInterval(() => {
      this.state.timeLeft -= 1;
      
      this.onTick?.(this.state);

      if (this.state.timeLeft <= 0) {
        this.complete();
      }
    }, 1000);
  }

  pause(): void {
    if (!this.state.isRunning) return;

    this.state.isRunning = false;
    this.state.isPaused = true;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset(newTime?: number): void {
    this.stop();
    const timeToSet = newTime ?? this.state.totalTime;
    this.state = {
      timeLeft: timeToSet,
      isRunning: false,
      isPaused: false,
      totalTime: timeToSet
    };
    this.onTick?.(this.state);
  }

  stop(): void {
    this.state.isRunning = false;
    this.state.isPaused = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private complete(): void {
    this.stop();
    this.onComplete?.();
  }

  getState(): TimerState {
    return { ...this.state };
  }

  setTime(seconds: number): void {
    this.state.timeLeft = seconds;
    this.state.totalTime = seconds;
    this.onTick?.(this.state);
  }

  addTime(seconds: number): void {
    this.state.timeLeft += seconds;
    this.onTick?.(this.state);
  }
}

/**
 * 시간을 포맷팅하는 유틸리티 함수들
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatLongTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return formatTime(seconds);
};

export const parseTimeInput = (input: string): number => {
  // MM:SS 또는 HH:MM:SS 형식 파싱
  const parts = input.split(':').map(part => parseInt(part, 10));
  
  if (parts.length === 2) {
    // MM:SS
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  } else if (parts.length === 3) {
    // HH:MM:SS
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }
  
  // 숫자만 입력된 경우 분으로 간주
  const minutes = parseInt(input, 10);
  return isNaN(minutes) ? 0 : minutes * 60;
};

/**
 * 사운드 관련 유틸리티
 */
export class SoundManager {
  private audioContext: AudioContext | null = null;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  playBeep(frequency: number = 800, duration: number = 0.5, volume: number = 0.3): void {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.error('Failed to play beep:', error);
    }
  }

  playSuccessSound(): void {
    // 성공 사운드 (상승하는 톤)
    this.playBeep(523, 0.2, 0.3); // C5
    setTimeout(() => this.playBeep(659, 0.2, 0.3), 100); // E5
    setTimeout(() => this.playBeep(784, 0.3, 0.3), 200); // G5
  }

  playAlertSound(): void {
    // 알림 사운드 (반복되는 비프)
    for (let i = 0; i < 3; i++) {
      setTimeout(() => this.playBeep(800, 0.2, 0.4), i * 300);
    }
  }
}

/**
 * 로컬 스토리지 관련 유틸리티
 */
export const saveTimerSettings = (key: string, settings: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save timer settings:', error);
  }
};

export const loadTimerSettings = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error('Failed to load timer settings:', error);
    return defaultValue;
  }
};

/**
 * 날짜/시간 관련 유틸리티
 */
export const getCurrentDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getTodayKey = (): string => {
  return `timer_stats_${getCurrentDateString()}`;
};

/**
 * 진동 API 유틸리티 (모바일 지원)
 */
export const vibrate = (pattern: number | number[]): void => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

export const vibrateSuccess = (): void => {
  vibrate([100, 50, 100]);
};

export const vibrateAlert = (): void => {
  vibrate([200, 100, 200, 100, 200]);
};