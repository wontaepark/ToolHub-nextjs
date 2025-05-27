import { useState, useEffect, useRef } from 'react';
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
  const [maxNumber, setMaxNumber] = useState(100);
  const [drawCount, setDrawCount] = useState(1);
  const [currentNumbers, setCurrentNumbers] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnNumbers, setDrawnNumbers] = useState<RaffleResult[]>([]);
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([]);
  const [animationNumbers, setAnimationNumbers] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const slowdownRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize available numbers when maxNumber changes
  useEffect(() => {
    const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1);
    const remaining = numbers.filter(num => !drawnNumbers.map(r => r.number).includes(num));
    setAvailableNumbers(remaining);
  }, [maxNumber, drawnNumbers]);

  // Slot machine animation effect
  const startSlotAnimation = () => {
    let speed = 50; // Start fast
    const animate = () => {
      setAnimationNumbers(prev => 
        prev.map(() => Math.floor(Math.random() * maxNumber) + 1)
      );
    };

    // Fast animation phase
    animationRef.current = setInterval(animate, speed);

    // Gradually slow down
    setTimeout(() => {
      if (animationRef.current) clearInterval(animationRef.current);
      speed = 100;
      animationRef.current = setInterval(animate, speed);
      
      setTimeout(() => {
        if (animationRef.current) clearInterval(animationRef.current);
        speed = 200;
        animationRef.current = setInterval(animate, speed);
        
        setTimeout(() => {
          if (animationRef.current) clearInterval(animationRef.current);
          speed = 400;
          animationRef.current = setInterval(animate, speed);
          
          setTimeout(() => {
            if (animationRef.current) clearInterval(animationRef.current);
            finalizeNumber();
          }, 800);
        }, 600);
      }, 400);
    }, 800);
  };

  const finalizeNumber = () => {
    if (availableNumbers.length < drawCount) {
      setIsDrawing(false);
      return;
    }

    // 선택할 번호들을 무작위로 뽑기
    const shuffled = [...availableNumbers].sort(() => Math.random() - 0.5);
    const selectedNumbers = shuffled.slice(0, drawCount).sort((a, b) => a - b);
    
    setCurrentNumbers(selectedNumbers);
    
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
    
    setTimeout(() => {
      // 여러 개의 결과를 추가
      const newResults: RaffleResult[] = selectedNumbers.map((num, index) => ({
        number: num,
        order: drawnNumbers.length + index + 1,
        timestamp: Date.now() + index
      }));
      
      setDrawnNumbers(prev => [...newResults, ...prev]);
      setIsDrawing(false);
    }, 1000);
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
            번호 추첨기
          </h1>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg">
            1~{maxNumber}번 중 추첨
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">최대 번호</label>
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
                  <label className="text-sm font-medium mb-2 block">추첨 개수</label>
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
                
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full"
                  disabled={isDrawing || drawnNumbers.length === 0}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  초기화
                </Button>

                {/* Statistics */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">전체 번호</span>
                    <Badge variant="secondary">{maxNumber}개</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">추첨된 번호</span>
                    <Badge variant="default">{drawnCount}개</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">남은 번호</span>
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
                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-400 text-white shadow-lg scale-110'
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
                        {currentNumbers.map((num, index) => (
                          <div key={index} className="text-4xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text animate-bounce">
                            {num}
                          </div>
                        ))}
                      </div>
                      <p className="text-xl text-gray-600">
                        {currentNumbers.length === 1 ? '당첨 번호!' : `${currentNumbers.length}개 당첨 번호!`}
                      </p>
                    </div>
                  )}

                  {/* Draw Button */}
                  <Button
                    onClick={handleDraw}
                    disabled={isDrawing || availableNumbers.length === 0}
                    size="lg"
                    className={`w-32 h-32 rounded-full text-xl font-bold transition-all duration-300 ${
                      isDrawing
                        ? 'bg-gray-400 animate-spin'
                        : availableNumbers.length === 0
                        ? 'bg-gray-300'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                    }`}
                  >
                    {isDrawing ? (
                      <Shuffle className="w-8 h-8" />
                    ) : availableNumbers.length === 0 ? (
                      '완료'
                    ) : (
                      '추첨하기'
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
                  <CardTitle>추첨된 번호들</CardTitle>
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


    </div>
  );
}