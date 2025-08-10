'use client';

import { useState, useEffect, useRef } from 'react';
import { AdBannerInline } from '@/components/AdBanner';

export default function PomodoroPage() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // 타이머 완료
            setIsActive(false);
            playNotificationSound();
            if (isBreak) {
              // 휴식 완료, 작업 시간으로 전환
              setIsBreak(false);
              setMinutes(workDuration);
              setSeconds(0);
              alert('휴식이 끝났습니다! 다시 집중할 시간입니다.');
            } else {
              // 작업 완료, 휴식 시간으로 전환
              setIsBreak(true);
              setMinutes(breakDuration);
              setSeconds(0);
              alert('수고하셨습니다! 잠깐 휴식을 취하세요.');
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && minutes !== 0 && seconds !== 0) {
      clearInterval(interval!);
    }
    
    return () => clearInterval(interval!);
  }, [isActive, minutes, seconds, isBreak, workDuration, breakDuration]);

  const playNotificationSound = () => {
    try {
      if (audioRef.current) {
        audioRef.current.play();
      }
    } catch (error) {
      console.error('알림 소리 재생 실패:', error);
    }
  };

  const startTimer = () => setIsActive(true);
  const pauseTimer = () => setIsActive(false);
  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(workDuration);
    setSeconds(0);
  };

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          포모도로 타이머
        </h1>
        
        {/* 설정 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">설정</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                작업 시간 (분)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={workDuration}
                onChange={(e) => setWorkDuration(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                휴식 시간 (분)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={breakDuration}
                onChange={(e) => setBreakDuration(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* 타이머 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center mb-6">
          <div className={`text-6xl font-mono font-bold mb-6 ${isBreak ? 'text-green-600' : 'text-blue-600'}`}>
            {formatTime(minutes, seconds)}
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {isBreak ? '휴식 시간' : '집중 시간'}
          </p>
          <div className="flex justify-center space-x-4">
            {!isActive ? (
              <button
                onClick={startTimer}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                시작
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
              >
                일시정지
              </button>
            )}
            <button
              onClick={resetTimer}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              리셋
            </button>
          </div>
        </div>

        {/* 광고 */}
        <AdBannerInline />

        {/* 포모도로 기법 설명 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            포모도로 기법이란?
          </h3>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              포모도로 기법은 1980년대 후반 프란체스코 시릴로가 개발한 시간 관리 방법입니다. 
              25분간 집중해서 일하고 5분간 휴식을 취하는 것을 반복합니다.
            </p>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              사용법
            </h4>
            <ol className="list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>할 일을 정하고 타이머를 25분으로 설정합니다</li>
              <li>타이머가 울릴 때까지 해당 일에만 집중합니다</li>
              <li>25분이 끝나면 5분간 휴식을 취합니다</li>
              <li>이 과정을 4번 반복한 후에는 15-30분의 긴 휴식을 취합니다</li>
            </ol>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-4">
              효과
            </h4>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
              <li>집중력 향상</li>
              <li>시간 관리 능력 개선</li>
              <li>업무 효율성 증대</li>
              <li>스트레스 감소</li>
            </ul>
          </div>
        </div>

        {/* 알림 소리 (숨겨진 오디오 요소) */}
        <audio ref={audioRef} preload="auto">
          <source src="/notification.mp3" type="audio/mpeg" />
          {/* 브라우저 호환성을 위한 대체 소리 */}
        </audio>
      </div>
    </div>
  );
}