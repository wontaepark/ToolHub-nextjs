'use client';

import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { AdBannerInline } from '@/components/AdBanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, Minus, Calculator } from 'lucide-react';
import { calculateDateDifference, isValidDate, subtractDaysFromDate, calculateAge } from '@/utils/calculation';
import { getRelatedTools } from '@/lib/tools';

interface DateCalculationHistory {
  id: string;
  type: 'difference' | 'add' | 'subtract' | 'age';
  input: string;
  result: string;
  timestamp: number;
}

export default function DateCalculatorPage() {
  const [activeTab, setActiveTab] = useState('difference');
  
  // 날짜 차이 계산
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateDifference, setDateDifference] = useState<{
    days: number;
    weeks: number;
    months: number;
    years: number;
  } | null>(null);

  // 날짜 더하기/빼기
  const [baseDate, setBaseDate] = useState('');
  const [daysToAdd, setDaysToAdd] = useState('');
  const [calculatedDate, setCalculatedDate] = useState('');

  // 나이 계산
  const [birthDate, setBirthDate] = useState('');
  const [ageResult, setAgeResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
  } | null>(null);

  // 히스토리
  const [history, setHistory] = useState<DateCalculationHistory[]>([]);

  // 관련 도구 가져오기
  const relatedTools = getRelatedTools('date-calculator').map(tool => ({
    id: tool.id,
    name: tool.name.ko,
    emoji: tool.emoji,
    href: `/tools/${tool.id}`
  }));

  // localStorage에서 히스토리 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem('date-calculator-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }

      // 오늘 날짜로 초기화
      const today = new Date().toISOString().split('T')[0];
      setEndDate(today);
      setBaseDate(today);
    }
  }, []);

  // 히스토리를 localStorage에 저장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('date-calculator-history', JSON.stringify(history));
    }
  }, [history]);

  // 히스토리에 추가
  const addToHistory = (type: DateCalculationHistory['type'], input: string, result: string) => {
    const newItem: DateCalculationHistory = {
      id: Date.now().toString(),
      type,
      input,
      result,
      timestamp: Date.now()
    };
    setHistory(prev => [newItem, ...prev].slice(0, 20));
  };

  // 날짜 차이 계산
  const calculateDifference = () => {
    if (!startDate || !endDate) return;
    
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      alert('올바른 날짜를 입력해주세요.');
      return;
    }

    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const difference = calculateDateDifference(start, end);
      setDateDifference(difference);
      
      addToHistory(
        'difference',
        `${startDate} ~ ${endDate}`,
        `${difference.days}일 (${difference.years}년 ${difference.months}개월)`
      );
    } catch {
      alert('날짜 계산 중 오류가 발생했습니다.');
    }
  };

  // 날짜 더하기
  const addDays = () => {
    if (!baseDate || !daysToAdd) return;
    
    if (!isValidDate(baseDate)) {
      alert('올바른 날짜를 입력해주세요.');
      return;
    }

    const days = parseInt(daysToAdd);
    if (isNaN(days)) {
      alert('올바른 숫자를 입력해주세요.');
      return;
    }

    try {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + days);
      const result = date.toISOString().split('T')[0];
      setCalculatedDate(result);
      
      addToHistory(
        'add',
        `${baseDate} + ${days}일`,
        result
      );
    } catch {
      alert('날짜 계산 중 오류가 발생했습니다.');
    }
  };

  // 날짜 빼기
  const subtractDays = () => {
    if (!baseDate || !daysToAdd) return;
    
    if (!isValidDate(baseDate)) {
      alert('올바른 날짜를 입력해주세요.');
      return;
    }

    const days = parseInt(daysToAdd);
    if (isNaN(days)) {
      alert('올바른 숫자를 입력해주세요.');
      return;
    }

    try {
      const result = subtractDaysFromDate(baseDate, days);
      setCalculatedDate(result);
      
      addToHistory(
        'subtract',
        `${baseDate} - ${days}일`,
        result
      );
    } catch {
      alert('날짜 계산 중 오류가 발생했습니다.');
    }
  };

  // 나이 계산
  const calculateAgeResult = () => {
    if (!birthDate) return;
    
    if (!isValidDate(birthDate)) {
      alert('올바른 생년월일을 입력해주세요.');
      return;
    }

    try {
      const age = calculateAge(birthDate);
      setAgeResult(age);
      
      addToHistory(
        'age',
        birthDate,
        `${age.years}세 ${age.months}개월 ${age.days}일 (총 ${age.totalDays}일)`
      );
    } catch {
      alert('나이 계산 중 오류가 발생했습니다.');
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <>
      
      <ToolLayout
        title="날짜 계산기"
        description="날짜 간격 계산, 날짜 더하기/빼기, 나이 계산을 쉽게"
        category="utility"
        relatedTools={relatedTools}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="difference">날짜 차이</TabsTrigger>
            <TabsTrigger value="calculate">날짜 계산</TabsTrigger>
            <TabsTrigger value="age">나이 계산</TabsTrigger>
          </TabsList>

          {/* 날짜 차이 계산 */}
          <TabsContent value="difference">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  날짜 차이 계산
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date">시작 날짜</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date">종료 날짜</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <Button 
                  onClick={calculateDifference}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!startDate || !endDate}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  차이 계산하기
                </Button>

                {dateDifference && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">계산 결과</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">{dateDifference.days}</div>
                        <div className="text-sm text-gray-600">일</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{dateDifference.weeks}</div>
                        <div className="text-sm text-gray-600">주</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{dateDifference.months}</div>
                        <div className="text-sm text-gray-600">개월</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{dateDifference.years}</div>
                        <div className="text-sm text-gray-600">년</div>
                      </div>
                    </div>
                    {startDate && endDate && (
                      <div className="mt-4 text-sm text-gray-600">
                        <p>{formatDate(startDate)}</p>
                        <p>{formatDate(endDate)}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 날짜 계산 */}
          <TabsContent value="calculate">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  날짜 더하기/빼기
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="base-date">기준 날짜</Label>
                    <Input
                      id="base-date"
                      type="date"
                      value={baseDate}
                      onChange={(e) => setBaseDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="days-input">일수</Label>
                    <Input
                      id="days-input"
                      type="number"
                      value={daysToAdd}
                      onChange={(e) => setDaysToAdd(e.target.value)}
                      placeholder="더하거나 뺄 일수"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    onClick={addDays}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={!baseDate || !daysToAdd}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    더하기
                  </Button>
                  <Button 
                    onClick={subtractDays}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    disabled={!baseDate || !daysToAdd}
                  >
                    <Minus className="w-4 h-4 mr-2" />
                    빼기
                  </Button>
                </div>

                {calculatedDate && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">계산 결과</h3>
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {calculatedDate}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(calculatedDate)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 나이 계산 */}
          <TabsContent value="age">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  나이 계산
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="birth-date">생년월일</Label>
                  <Input
                    id="birth-date"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <Button 
                  onClick={calculateAgeResult}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={!birthDate}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  나이 계산하기
                </Button>

                {ageResult && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">나이 정보</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{ageResult.years}</div>
                        <div className="text-sm text-gray-600">세</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{ageResult.months}</div>
                        <div className="text-sm text-gray-600">개월</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{ageResult.days}</div>
                        <div className="text-sm text-gray-600">일</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{ageResult.totalDays.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">총 일수</div>
                      </div>
                    </div>
                    {birthDate && (
                      <div className="mt-4 text-sm text-gray-600">
                        <p>생년월일: {formatDate(birthDate)}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 계산 히스토리 */}
        {history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>최근 계산 기록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {history.slice(0, 10).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">
                        {item.type === 'difference' && '📊 차이'}
                        {item.type === 'add' && '➕ 더하기'}
                        {item.type === 'subtract' && '➖ 빼기'}
                        {item.type === 'age' && '🎂 나이'}
                      </Badge>
                      <div className="text-sm">
                        <div className="font-medium">{item.input}</div>
                        <div className="text-gray-600">{item.result}</div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(item.timestamp).toLocaleTimeString()}
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
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">📊 날짜 차이</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 두 날짜 사이의 간격 계산</li>
                  <li>• 일, 주, 개월, 년 단위로 표시</li>
                  <li>• D-Day 계산에 유용</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📅 날짜 계산</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 특정 날짜에서 일수 더하기/빼기</li>
                  <li>• 미래/과거 날짜 예측</li>
                  <li>• 프로젝트 일정 계산에 활용</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🎂 나이 계산</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 정확한 나이 계산</li>
                  <li>• 년, 월, 일 단위로 표시</li>
                  <li>• 총 살아온 일수 확인</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </ToolLayout>
    </>
  );
}