import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Shuffle, RotateCcw, Settings } from 'lucide-react';

interface RaffleResult {
  number: number;
  order: number;
  timestamp: number;
}

export default function NumberRaffle() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const [maxNumber, setMaxNumber] = useState(() => {
    const saved = localStorage.getItem('raffle-max-number');
    return saved ? parseInt(saved) : 100;
  });
  const [drawCount, setDrawCount] = useState(() => {
    const saved = localStorage.getItem('raffle-draw-count');
    return saved ? parseInt(saved) : 1;
  });
  const [currentNumbers, setCurrentNumbers] = useState<number[]>(() => {
    const saved = localStorage.getItem('raffle-current-numbers');
    return saved ? JSON.parse(saved) : [];
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnNumbers, setDrawnNumbers] = useState<RaffleResult[]>(() => {
    const saved = localStorage.getItem('raffle-drawn-numbers');
    return saved ? JSON.parse(saved) : [];
  });
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([]);
  const [animationNumbers, setAnimationNumbers] = useState<number[]>(() => {
    const saved = localStorage.getItem('raffle-animation-numbers');
    return saved ? JSON.parse(saved) : [0, 0, 0, 0, 0, 0];
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('raffle-sound-enabled');
    return saved ? JSON.parse(saved) : true;
  });
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('raffle-volume');
    return saved ? parseFloat(saved) : 0.8;
  });
  
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const slowdownRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const drumAudioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  // localStorage에 상태 저장
  useEffect(() => {
    localStorage.setItem('raffle-max-number', maxNumber.toString());
  }, [maxNumber]);

  useEffect(() => {
    localStorage.setItem('raffle-draw-count', drawCount.toString());
  }, [drawCount]);

  useEffect(() => {
    localStorage.setItem('raffle-current-numbers', JSON.stringify(currentNumbers));
  }, [currentNumbers]);

  useEffect(() => {
    localStorage.setItem('raffle-drawn-numbers', JSON.stringify(drawnNumbers));
  }, [drawnNumbers]);

  useEffect(() => {
    localStorage.setItem('raffle-animation-numbers', JSON.stringify(animationNumbers));
  }, [animationNumbers]);

  useEffect(() => {
    localStorage.setItem('raffle-sound-enabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('raffle-volume', volume.toString());
    if (drumAudioRef.current) {
      drumAudioRef.current.volume = volume;
    }
  }, [volume]);

  // 드럼 오디오 초기화
  useEffect(() => {
    if (!drumAudioRef.current) {
      drumAudioRef.current = new Audio();
      // Vite의 assets 처리 방식에 맞춰 import 사용
      import('@assets/Drum_org.mp3').then((module) => {
        if (drumAudioRef.current) {
          drumAudioRef.current.src = module.default;
          drumAudioRef.current.preload = 'auto';
          drumAudioRef.current.volume = volume;
          
          // 재생 완료 시 플래그 리셋
          drumAudioRef.current.addEventListener('ended', () => {
            isPlayingRef.current = false;
          });
        }
      }).catch(() => {
        console.log('드럼 사운드 파일을 찾을 수 없습니다.');
      });
    }
  }, [volume]);

  // 오디오 컨텍스트 초기화
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  // 스네어 드럼 사운드 (긴장감 있는 롤링 효과)
  const playSnareRoll = () => {
    if (!soundEnabled) return;
    const audioContext = initAudioContext();
    
    // 노이즈 생성 (스네어 효과)
    const bufferSize = audioContext.sampleRate * 0.1;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.3;
    }
    
    const noise = audioContext.createBufferSource();
    noise.buffer = buffer;
    
    // 하이패스 필터 (스네어 특성)
    const highpass = audioContext.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 1000;
    
    // 밴드패스 필터
    const bandpass = audioContext.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 200;
    bandpass.Q.value = 1;
    
    // 게인 조절
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    // 연결
    noise.connect(bandpass);
    bandpass.connect(highpass);
    highpass.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    noise.start();
    noise.stop(audioContext.currentTime + 0.1);
  };

  // 심벌즈 크래시 (당첨 시)
  const playCymbalCrash = () => {
    if (!soundEnabled) return;
    const audioContext = initAudioContext();
    
    // 여러 주파수의 사인파 조합 (심벌즈 효과)
    const frequencies = [523, 659, 784, 987, 1174, 1397];
    const duration = 1.5;
    
    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.value = freq + (Math.random() * 50 - 25);
      
      // 크래시 효과를 위한 엔벨로프
      gainNode.gain.setValueAtTime(0.1 / frequencies.length, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      
      // 하이패스 필터 (밝은 소리)
      const highpass = audioContext.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 500;
      
      oscillator.connect(highpass);
      highpass.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start(audioContext.currentTime + index * 0.01);
      oscillator.stop(audioContext.currentTime + duration);
    });
  };

  // 틱 사운드 (애니메이션 중)
  const playTickSound = () => {
    if (!soundEnabled) return;
    const audioContext = initAudioContext();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.value = 800;
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.05);
  };

  // 멋진 드럼 사운드 재생 (중복 재생 방지)
  const playDrumSound = async () => {
    if (!soundEnabled || !drumAudioRef.current || isPlayingRef.current) return;
    
    try {
      isPlayingRef.current = true;
      // 오디오를 처음부터 재생하기 위해 currentTime 리셋
      drumAudioRef.current.currentTime = 0;
      drumAudioRef.current.volume = volume;
      await drumAudioRef.current.play();
    } catch (error) {
      isPlayingRef.current = false;
      console.log('드럼 사운드 재생 중 오류 발생');
    }
  };

  // Initialize available numbers when maxNumber changes
  useEffect(() => {
    const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1);
    const remaining = numbers.filter(num => !drawnNumbers.map(r => r.number).includes(num));
    setAvailableNumbers(remaining);
  }, [maxNumber, drawnNumbers]);

  // Slot machine animation effect
  const startSlotAnimation = () => {
    // 시작 시 멋진 드럼 사운드 재생
    playDrumSound();
    
    const speed = 100; // 일정한 속도 유지
    
    const animate = () => {
      setAnimationNumbers(prev => 
        prev.map(() => Math.floor(Math.random() * maxNumber) + 1)
      );
    };

    // 일정한 속도로 애니메이션 유지
    animationRef.current = setInterval(animate, speed);

    // 드럼 사운드 길이에 맞춰 애니메이션 지속 (약 3.35초)
    setTimeout(() => {
      if (animationRef.current) clearInterval(animationRef.current);
      finalizeNumber();
    }, 3350);
  };

  // 번호별 색상 반환 함수
  const getNumberColor = (number: number, selectedNumbers: number[]) => {
    const colors = [
      'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-400',
      'bg-gradient-to-br from-blue-400 to-indigo-500 border-blue-400',
      'bg-gradient-to-br from-green-400 to-emerald-500 border-green-400'
    ];
    
    const index = selectedNumbers.indexOf(number);
    return index !== -1 ? colors[index] : 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-400';
  };

  const finalizeNumber = () => {
    if (availableNumbers.length < drawCount) {
      setIsDrawing(false);
      return;
    }

    // 선택할 번호들을 무작위로 뽑기
    const shuffled = [...availableNumbers].sort(() => Math.random() - 0.5);
    const selectedNumbers = shuffled.slice(0, drawCount).sort((a, b) => a - b);
    
    // 6개 슬롯에 번호 배치
    let finalSlots: number[] = [];
    
    if (drawCount === 1) {
      // 1개: 모든 슬롯에 같은 번호
      finalSlots = Array(6).fill(selectedNumbers[0]);
    } else if (drawCount === 2) {
      // 2개: 각각 3슬롯씩
      finalSlots = [
        selectedNumbers[0], selectedNumbers[0], selectedNumbers[0],
        selectedNumbers[1], selectedNumbers[1], selectedNumbers[1]
      ];
    } else if (drawCount === 3) {
      // 3개: 각각 2슬롯씩
      finalSlots = [
        selectedNumbers[0], selectedNumbers[0],
        selectedNumbers[1], selectedNumbers[1],
        selectedNumbers[2], selectedNumbers[2]
      ];
    }
    
    setAnimationNumbers(finalSlots);
    
    // 당첨 순간 드럼 사운드 (판과 동시에)
    playDrumSound();
    
    // 여러 개의 결과를 추가 (판과 동시에)
    const newResults: RaffleResult[] = selectedNumbers.map((num, index) => ({
      number: num,
      order: drawnNumbers.length + index + 1,
      timestamp: Date.now() + index
    }));
    
    setDrawnNumbers(prev => [...newResults, ...prev]);
    
    // 판 색상 변경과 동시에 당첨 번호 설정
    setTimeout(() => {
      setCurrentNumbers(selectedNumbers);
      setIsDrawing(false);
    }, 100);
  };

  const handleDraw = () => {
    if (availableNumbers.length < drawCount) return;
    
    setIsDrawing(true);
    setCurrentNumbers([]);
    startSlotAnimation();
  };

  const handleReset = () => {
    setDrawnNumbers([]);
    setCurrentNumbers([]);
    setAnimationNumbers([0, 0, 0, 0, 0, 0]);
  };

  const handleMaxNumberChange = (value: string) => {
    const num = parseInt(value);
    if (num && num > 0 && num <= 10000) {
      setMaxNumber(num);
      // Reset if new max is smaller than existing draws
      const invalidDraws = drawnNumbers.filter(r => r.number > num);
      if (invalidDraws.length > 0) {
        setDrawnNumbers(prev => prev.filter(r => r.number <= num));
      }
    }
  };

  const remainingCount = availableNumbers.length;
  const drawnCount = drawnNumbers.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
            {t('numberRaffle.title')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg">
            {t('numberRaffle.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
{t('numberRaffle.settings.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('numberRaffle.settings.maxNumber')}</label>
                  <Input
                    type="number"
                    min="1"
                    max="10000"
                    value={maxNumber}
                    onChange={(e) => handleMaxNumberChange(e.target.value)}
                    className="text-lg"
                    disabled={isDrawing}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">{t('numberRaffle.settings.drawCount')}</label>
                  <select
                    value={drawCount}
                    onChange={(e) => setDrawCount(parseInt(e.target.value))}
                    disabled={isDrawing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value={1}>1개</option>
                    <option value={2}>2개</option>
                    <option value={3}>3개</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">{t('numberRaffle.settings.sound')}</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={soundEnabled}
                      onChange={(e) => setSoundEnabled(e.target.checked)}
                      disabled={isDrawing}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    <span className="ml-3 text-sm text-gray-600">
                      {soundEnabled ? '🔊 ON' : '🔇 OFF'}
                    </span>
                  </label>
                </div>

                {soundEnabled && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">
{t('numberRaffle.settings.volume')} ({Math.round(volume * 100)}%)
                    </label>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs">🔇</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        disabled={isDrawing}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <span className="text-xs">🔊</span>
                    </div>
                  </div>
                )}
                
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full"
                  disabled={isDrawing || drawnNumbers.length === 0}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
{t('numberRaffle.buttons.reset')}
                </Button>

                {/* Statistics */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t('numberRaffle.stats.totalNumbers')}</span>
                    <Badge variant="secondary">{maxNumber}개</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t('numberRaffle.stats.drawnNumbers')}</span>
                    <Badge variant="default">{drawnCount}개</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t('numberRaffle.stats.remainingNumbers')}</span>
                    <Badge variant="outline">{remainingCount}개</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Drawing Area */}
          <div className="lg:col-span-2">
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
              <CardContent className="p-8">
                {/* Slot Machine Display */}
                <div className="text-center mb-8">
                  <div className="flex justify-center items-center gap-2 mb-6">
                    {animationNumbers.map((num, index) => (
                      <div
                        key={index}
                        className={`w-16 h-20 md:w-20 md:h-24 rounded-lg border-2 flex items-center justify-center text-2xl md:text-3xl font-bold transition-all duration-300 ${
                          isDrawing
                            ? 'bg-gray-100 border-gray-300 text-gray-700'
                            : currentNumbers.length > 0
                            ? `${getNumberColor(num, currentNumbers)} text-white shadow-lg scale-110`
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}
                        style={{
                          transform: isDrawing ? `translateY(${Math.sin(Date.now() * 0.01 + index) * 5}px)` : undefined,
                          animation: isDrawing ? 'pulse 0.5s infinite' : undefined
                        }}
                      >
                        {num || '?'}
                      </div>
                    ))}
                  </div>

                  {/* Current Result Display */}
                  {currentNumbers.length > 0 && !isDrawing && (
                    <div className="mb-6">
                      <div className="flex flex-wrap justify-center gap-4 mb-4">
                        {currentNumbers.map((num, index) => {
                          const colors = [
                            'from-yellow-400 via-orange-500 to-red-500',
                            'from-blue-400 via-indigo-500 to-purple-500', 
                            'from-green-400 via-emerald-500 to-teal-500'
                          ];
                          return (
                            <div key={index} className={`text-4xl md:text-6xl font-bold text-transparent bg-gradient-to-r ${colors[index]} bg-clip-text animate-bounce`}>
                              {num}
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-xl text-gray-600">
{currentNumbers.length === 1 ? t('numberRaffle.results.winningNumber') : t('numberRaffle.results.winningNumbers', { count: currentNumbers.length })}
                      </p>
                    </div>
                  )}

                  {/* Draw Button */}
                  <Button
                    onClick={handleDraw}
                    disabled={isDrawing || availableNumbers.length < drawCount}
                    size="lg"
                    className={`w-32 h-32 rounded-full text-xl font-bold transition-all duration-300 ${
                      isDrawing
                        ? 'bg-gray-400 animate-spin'
                        : availableNumbers.length < drawCount
                        ? 'bg-gray-300'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                    }`}
                  >
                    {isDrawing ? (
                      <div className="flex flex-col items-center">
                        <Shuffle className="w-8 h-8 mb-1" />
                        <span className="text-sm">{t('numberRaffle.buttons.drawing')}</span>
                      </div>
                    ) : availableNumbers.length < drawCount ? (
                      <div className="flex flex-col items-center text-xs">
                        <span>{t('numberRaffle.messages.notEnough')}</span>
                        <span>{t('numberRaffle.messages.remaining')}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Shuffle className="w-8 h-8 mb-1" />
                        <span className="text-sm">{t('numberRaffle.buttons.drawNumbers', { count: drawCount })}</span>
                      </div>
                    )}
                  </Button>

                  {availableNumbers.length === 0 && drawnNumbers.length > 0 && (
                    <p className="text-lg text-gray-600 mt-4">모든 번호가 추첨되었습니다!</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Results History */}
            {drawnNumbers.length > 0 && (
              <Card className="bg-white/95 backdrop-blur-sm shadow-2xl mt-6">
                <CardHeader>
                  <CardTitle>{t('numberRaffle.history.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-64 overflow-y-auto">
                    {drawnNumbers.map((result, index) => (
                      <div
                        key={result.timestamp}
                        className={`p-4 rounded-lg text-center transition-all duration-300 ${
                          index === 0
                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <div className="text-2xl font-bold">{result.number}</div>
                        <div className="text-xs opacity-75">#{result.order}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Content Section */}
      <div className="space-y-8 mt-12">
        {/* 번호 추첨기 소개 */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">
            {currentLang === 'ko' ? '공정한 번호 추첨기' : 
             currentLang === 'ja' ? '公正な番号抽選機' : 
             'Fair Number Raffle'}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {currentLang === 'ko' ? 
              '완전히 랜덤한 번호 추첨을 통해 공정하고 투명한 선택을 도와주는 온라인 도구입니다. 이벤트, 게임, 추첨, 순서 정하기 등 다양한 상황에서 편견 없는 무작위 선택이 필요할 때 사용하세요. 암호학적으로 안전한 난수 생성기를 사용하여 예측 불가능하고 공정한 결과를 보장합니다.' :
             currentLang === 'ja' ? 
              '完全にランダムな番号抽選により公正で透明な選択をサポートするオンラインツールです。イベント、ゲーム、抽選、順番決めなど様々な状況で偏見のない無作為選択が必要な時にご利用ください。暗号学的に安全な乱数生成器を使用して予測不可能で公正な結果を保証します。' :
              'An online tool that helps with fair and transparent selection through completely random number drawing. Use it when you need unbiased random selection in various situations such as events, games, raffles, and ordering. It uses cryptographically secure random number generators to ensure unpredictable and fair results.'
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
                {currentLang === 'ko' ? '추첨 옵션' : 
                 currentLang === 'ja' ? '抽選オプション' : 
                 'Raffle Options'}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  {currentLang === 'ko' ? '• 범위 설정 (최소값 ~ 최대값)' : 
                   currentLang === 'ja' ? '• 範囲設定（最小値～最大値）' : 
                   '• Range Setting (Min ~ Max values)'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 추첨 개수 선택' : 
                   currentLang === 'ja' ? '• 抽選数選択' : 
                   '• Number of draws selection'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 중복 허용/비허용 설정' : 
                   currentLang === 'ja' ? '• 重複許可/非許可設定' : 
                   '• Allow/Disallow duplicates setting'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 즉시 결과 표시' : 
                   currentLang === 'ja' ? '• 即座に結果表示' : 
                   '• Instant result display'}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">
                {currentLang === 'ko' ? '결과 관리' : 
                 currentLang === 'ja' ? '結果管理' : 
                 'Result Management'}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  {currentLang === 'ko' ? '• 추첨 기록 저장' : 
                   currentLang === 'ja' ? '• 抽選記録保存' : 
                   '• Save raffle history'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 시간 순서별 정렬' : 
                   currentLang === 'ja' ? '• 時間順ソート' : 
                   '• Sort by time order'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 결과 복사 기능' : 
                   currentLang === 'ja' ? '• 結果コピー機能' : 
                   '• Copy result function'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 기록 초기화' : 
                   currentLang === 'ja' ? '• 記録初期化' : 
                   '• Clear history'}
                </li>
              </ul>
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
                {currentLang === 'ko' ? '이벤트 및 게임' : 
                 currentLang === 'ja' ? 'イベント・ゲーム' : 
                 'Events & Games'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  '경품 추첨, 팀 나누기, 발표 순서 정하기, 보드게임 순서 결정, 벌칙 게임 등에 활용할 수 있습니다.' :
                 currentLang === 'ja' ? 
                  '景品抽選、チーム分け、発表順決め、ボードゲーム順番決定、罰ゲームなどに活用できます。' :
                  'Perfect for prize draws, team divisions, presentation order, board game turns, penalty games, and more.'
                }
              </p>
            </div>
            <div className="bg-secondary/5 rounded-lg p-4 border border-secondary/20">
              <h3 className="text-lg font-semibold mb-2">
                {currentLang === 'ko' ? '업무 및 학습' : 
                 currentLang === 'ja' ? '業務・学習' : 
                 'Work & Study'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  '무작위 샘플링, 실험 설계, 설문 대상자 선정, 업무 분배, 회의 순서 등 공정한 선택이 필요한 상황에 사용하세요.' :
                 currentLang === 'ja' ? 
                  'ランダムサンプリング、実験設計、アンケート対象者選定、業務分担、会議順番など公正な選択が必要な状況でご利用ください。' :
                  'Use for random sampling, experiment design, survey participant selection, task distribution, meeting order, and other situations requiring fair selection.'
                }
              </p>
            </div>
          </div>
        </section>

        {/* 사용 팁 */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">
            {currentLang === 'ko' ? '사용 팁' : 
             currentLang === 'ja' ? '使用ヒント' : 
             'Usage Tips'}
          </h2>
          <ul className="space-y-3 text-muted-foreground">
            <li>
              {currentLang === 'ko' ? 
                '• 중복을 허용하지 않는 경우 추첨 개수가 범위를 초과하지 않도록 주의하세요' :
               currentLang === 'ja' ? 
                '• 重複を許可しない場合、抽選数が範囲を超えないよう注意してください' :
                '• When not allowing duplicates, ensure the number of draws doesn\'t exceed the range'}
            </li>
            <li>
              {currentLang === 'ko' ? 
                '• 공정성이 중요한 상황에서는 모든 참가자가 보는 앞에서 추첨하세요' :
               currentLang === 'ja' ? 
                '• 公平性が重要な状況では全ての参加者が見ている前で抽選してください' :
                '• In situations where fairness is important, conduct the draw in front of all participants'}
            </li>
            <li>
              {currentLang === 'ko' ? 
                '• 추첨 기록을 통해 투명성을 확보할 수 있습니다' :
               currentLang === 'ja' ? 
                '• 抽選記録により透明性を確保できます' :
                '• Transparency can be ensured through draw records'}
            </li>
            <li>
              {currentLang === 'ko' ? 
                '• 큰 범위에서의 추첨도 즉시 처리됩니다' :
               currentLang === 'ja' ? 
                '• 大きな範囲での抽選も即座に処理されます' :
                '• Draws from large ranges are also processed instantly'}
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}