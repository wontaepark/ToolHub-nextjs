'use client';

import React, { useState, useEffect, useRef } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Seo } from '@/components/Seo';
import { AdBannerInline } from '@/components/AdBanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Shuffle, RotateCcw, Settings, Volume2, VolumeX } from 'lucide-react';
import { generateRandomNumbers } from '@/utils/calculation';
import { isPositiveInteger, isInRange } from '@/utils/validation';
import { getRelatedTools } from '@/lib/tools';

interface RaffleResult {
  number: number;
  order: number;
  timestamp: number;
}

export default function NumberRafflePage() {
  const [maxNumber, setMaxNumber] = useState(100);
  const [drawCount, setDrawCount] = useState(1);
  const [currentNumbers, setCurrentNumbers] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnNumbers, setDrawnNumbers] = useState<RaffleResult[]>([]);
  const [animationNumbers, setAnimationNumbers] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [error, setError] = useState('');

  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // 관련 도구 가져오기
  const relatedTools = getRelatedTools('number-raffle').map(tool => ({
    id: tool.id,
    name: tool.name.ko,
    emoji: tool.emoji,
    href: `/tools/${tool.id}`
  }));

  // localStorage에서 설정 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMaxNumber = localStorage.getItem('raffle-max-number');
      const savedDrawCount = localStorage.getItem('raffle-draw-count');
      const savedSoundEnabled = localStorage.getItem('raffle-sound-enabled');
      const savedAllowDuplicates = localStorage.getItem('raffle-allow-duplicates');

      if (savedMaxNumber) setMaxNumber(parseInt(savedMaxNumber));
      if (savedDrawCount) setDrawCount(parseInt(savedDrawCount));
      if (savedSoundEnabled) setSoundEnabled(JSON.parse(savedSoundEnabled));
      if (savedAllowDuplicates) setAllowDuplicates(JSON.parse(savedAllowDuplicates));
    }
  }, []);

  // 설정을 localStorage에 저장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('raffle-max-number', maxNumber.toString());
    }
  }, [maxNumber]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('raffle-draw-count', drawCount.toString());
    }
  }, [drawCount]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('raffle-sound-enabled', JSON.stringify(soundEnabled));
    }
  }, [soundEnabled]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('raffle-allow-duplicates', JSON.stringify(allowDuplicates));
    }
  }, [allowDuplicates]);

  // 사운드 재생
  const playSound = () => {
    if (!soundEnabled) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.error('사운드 재생 실패:', error);
    }
  };

  // 애니메이션 숫자 업데이트
  const updateAnimationNumbers = () => {
    setAnimationNumbers(prev => 
      prev.map(() => Math.floor(Math.random() * maxNumber) + 1)
    );
  };

  // 추첨 실행
  const drawNumbers = async () => {
    setError('');

    // 유효성 검사
    if (!isPositiveInteger(maxNumber.toString()) || !isInRange(maxNumber, 1, 10000)) {
      setError('최대 번호는 1부터 10000 사이의 숫자여야 합니다.');
      return;
    }

    if (!isPositiveInteger(drawCount.toString()) || !isInRange(drawCount, 1, 100)) {
      setError('추첨 개수는 1부터 100 사이의 숫자여야 합니다.');
      return;
    }

    if (!allowDuplicates && drawCount > maxNumber) {
      setError('중복을 허용하지 않는 경우 추첨 개수는 최대 번호보다 작거나 같아야 합니다.');
      return;
    }

    setIsDrawing(true);
    setCurrentNumbers([]);

    // 애니메이션 시작
    animationRef.current = setInterval(updateAnimationNumbers, 100);

    // 2초 후 결과 표시
    setTimeout(() => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }

      try {
        const numbers = generateRandomNumbers(drawCount, 1, maxNumber, !allowDuplicates);
        setCurrentNumbers(numbers);

        // 결과를 히스토리에 추가
        const newResults: RaffleResult[] = numbers.map((number, index) => ({
          number,
          order: index + 1,
          timestamp: Date.now()
        }));

        setDrawnNumbers(prev => [...newResults, ...prev].slice(0, 50)); // 최근 50개까지만 저장
        playSound();
      } catch {
        setError('추첨 중 오류가 발생했습니다.');
      }

      setIsDrawing(false);
    }, 2000);
  };

  // 초기화
  const reset = () => {
    setCurrentNumbers([]);
    setDrawnNumbers([]);
    setError('');
    if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }
    setIsDrawing(false);
  };

  return (
    <>
      <Seo 
        title="번호 추첨기 | ToolHub.tools"
        description="공정한 랜덤 번호 생성과 추첨을 위한 도구"
        keywords="번호추첨기,랜덤번호,추첨,로또번호"
        canonicalUrl="https://toolhub.tools/tools/number-raffle"
      />
      
      <ToolLayout
        title="번호 추첨기"
        description="공정한 랜덤 번호 생성과 추첨을 위한 도구"
        category="utility"
        relatedTools={relatedTools}
      >
        {/* 설정 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              추첨 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxNumber">최대 번호</Label>
                <Input
                  id="maxNumber"
                  type="number"
                  min="1"
                  max="10000"
                  value={maxNumber}
                  onChange={(e) => setMaxNumber(parseInt(e.target.value) || 1)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="drawCount">추첨 개수</Label>
                <Input
                  id="drawCount"
                  type="number"
                  min="1"
                  max="100"
                  value={drawCount}
                  onChange={(e) => setDrawCount(parseInt(e.target.value) || 1)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={allowDuplicates}
                    onChange={(e) => setAllowDuplicates(e.target.checked)}
                    className="mr-2"
                  />
                  중복 허용
                </label>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span className="ml-1">{soundEnabled ? '사운드 켜짐' : '사운드 꺼짐'}</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 추첨 결과 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>추첨 결과</span>
              <div className="space-x-2">
                <Button
                  onClick={drawNumbers}
                  disabled={isDrawing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  {isDrawing ? '추첨 중...' : '추첨 시작'}
                </Button>
                <Button
                  onClick={reset}
                  variant="outline"
                  disabled={isDrawing}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  초기화
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDrawing ? (
              <div className="text-center py-8">
                <div className="flex justify-center space-x-2 mb-4">
                  {animationNumbers.slice(0, Math.min(6, drawCount)).map((num, index) => (
                    <div
                      key={index}
                      className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-2xl font-bold text-blue-600 animate-pulse"
                    >
                      {num}
                    </div>
                  ))}
                </div>
                <p className="text-gray-600">추첨 중입니다...</p>
              </div>
            ) : currentNumbers.length > 0 ? (
              <div className="text-center py-8">
                <div className="flex justify-center flex-wrap gap-2 mb-4">
                  {currentNumbers.map((number, index) => (
                    <Badge
                      key={index}
                      className="w-16 h-16 text-2xl font-bold bg-green-100 text-green-800 flex items-center justify-center rounded-lg"
                    >
                      {number}
                    </Badge>
                  ))}
                </div>
                <p className="text-lg font-semibold text-green-700">
                  추첨 완료! {currentNumbers.length}개의 번호가 선택되었습니다.
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                추첨 시작 버튼을 눌러주세요.
              </div>
            )}
          </CardContent>
        </Card>

        {/* 추첨 히스토리 */}
        {drawnNumbers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>최근 추첨 결과</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {drawnNumbers.slice(0, 10).map((result) => (
                  <div
                    key={`${result.timestamp}-${result.order}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">#{result.order}</Badge>
                      <span className="font-semibold text-lg">{result.number}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 광고 */}
        <AdBannerInline />

        {/* 사용법 안내 */}
        <Card>
          <CardHeader>
            <CardTitle>사용법</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">📝 기본 설정</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 최대 번호: 1부터 선택할 수 있는 최대 번호</li>
                  <li>• 추첨 개수: 뽑을 번호의 개수</li>
                  <li>• 중복 허용: 같은 번호가 여러 번 나올 수 있는지 설정</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🎯 활용 예시</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 로또 번호 추첨: 1~45, 6개</li>
                  <li>• 팀 나누기: 1~20, 5개</li>
                  <li>• 순서 정하기: 1~10, 10개 (중복 없음)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </ToolLayout>
    </>
  );
}