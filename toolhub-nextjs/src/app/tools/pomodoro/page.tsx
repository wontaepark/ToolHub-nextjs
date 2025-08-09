'use client';

import { useState, useEffect, useRef } from 'react';
import { Seo, SeoPresets } from '@/components/Seo';
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
    <>
      <Seo {...SeoPresets.pomodoro} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🍅 포모도로 타이머
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            25분 집중 + 5분 휴식으로 생산성을 극대화하세요
          </p>
        </div>

        {/* 타이머 메인 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center mb-8">
          {/* 현재 상태 표시 */}
          <div className="mb-6">
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
              isBreak 
                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
            }`}>
              {isBreak ? '🌟 휴식 시간' : '💪 집중 시간'}
            </div>
          </div>

          {/* 타이머 디스플레이 */}
          <div className="text-8xl sm:text-9xl font-mono font-bold text-gray-900 dark:text-white mb-8">
            {formatTime(minutes, seconds)}
          </div>

          {/* 컨트롤 버튼 */}
          <div className="flex justify-center space-x-4 mb-6">
            {!isActive ? (
              <button
                onClick={startTimer}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
              >
                시작
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
              >
                일시정지
              </button>
            )}
            <button
              onClick={resetTimer}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              리셋
            </button>
          </div>
        </div>

        {/* 설정 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            시간 설정
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                작업 시간 (분)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={workDuration}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setWorkDuration(value);
                  if (!isActive && !isBreak) {
                    setMinutes(value);
                    setSeconds(0);
                  }
                }}
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
        <audio
          ref={audioRef}
          preload="auto"
        >
          <source src="/notification.mp3" type="audio/mpeg" />
          {/* 브라우저 호환성을 위한 대체 소리 */}
        </audio>
      </div>
    </>
  );
}