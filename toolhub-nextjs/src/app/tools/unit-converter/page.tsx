'use client';

import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Seo } from '@/components/Seo';
import { AdBannerInline } from '@/components/AdBanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftRight, Copy, History, Calculator } from 'lucide-react';
import { convertUnit, getUnitConversions, type ConversionCategory } from '@/utils/calculation';
import { getRelatedTools } from '@/lib/tools';

interface ConversionHistory {
  id: string;
  category: string;
  fromValue: number;
  fromUnit: string;
  toValue: number;
  toUnit: string;
  timestamp: number;
}

export default function UnitConverterPage() {
  const [activeTab, setActiveTab] = useState<ConversionCategory>('length');
  const [inputValue, setInputValue] = useState('1');
  const [outputValue, setOutputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [history, setHistory] = useState<ConversionHistory[]>([]);
  const [copied, setCopied] = useState(false);

  // 관련 도구 가져오기
  const relatedTools = getRelatedTools('unit-converter').map(tool => ({
    id: tool.id,
    name: tool.name.ko,
    emoji: tool.emoji,
    href: `/tools/${tool.id}`
  }));

  // localStorage에서 히스토리 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem('unit-converter-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    }
  }, []);

  // 히스토리를 localStorage에 저장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('unit-converter-history', JSON.stringify(history));
    }
  }, [history]);

  // 카테고리별 단위 목록 가져오기
  const units = getUnitConversions(activeTab);

  // 카테고리 변경 시 초기화
  useEffect(() => {
    const firstUnit = units[0];
    const secondUnit = units[1];
    
    if (firstUnit && secondUnit) {
      setFromUnit(firstUnit.key);
      setToUnit(secondUnit.key);
      setOutputValue('');
    }
  }, [activeTab, units]);

  // 단위 변환 실행
  const performConversion = React.useCallback(() => {
    if (!inputValue || !fromUnit || !toUnit) return;

    const numericValue = parseFloat(inputValue);
    if (isNaN(numericValue)) {
      setOutputValue('');
      return;
    }

    try {
      const result = convertUnit(numericValue, fromUnit, toUnit, activeTab);
      setOutputValue(result.toString());

      // 히스토리에 추가
      const newConversion: ConversionHistory = {
        id: Date.now().toString(),
        category: activeTab,
        fromValue: numericValue,
        fromUnit,
        toValue: result,
        toUnit,
        timestamp: Date.now()
      };

      setHistory(prev => [newConversion, ...prev].slice(0, 20)); // 최근 20개까지만 저장
    } catch {
      setOutputValue('변환 오류');
    }
  }, [inputValue, fromUnit, toUnit, activeTab]);

  // 입력값이나 단위가 변경될 때마다 자동 변환
  useEffect(() => {
    performConversion();
  }, [performConversion]);

  // 단위 교체
  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setInputValue(outputValue || '0');
  };

  // 결과 복사
  const copyResult = async () => {
    if (!outputValue) return;

    try {
      await navigator.clipboard.writeText(outputValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 복사 실패시 fallback
      const textArea = document.createElement('textarea');
      textArea.value = outputValue;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 단위 이름 가져오기
  const getUnitName = (unitKey: string) => {
    const unit = units.find(u => u.key === unitKey);
    return unit ? unit.name : unitKey;
  };

  // 카테고리 아이콘
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'length': return '📏';
      case 'weight': return '⚖️';
      case 'temperature': return '🌡️';
      case 'volume': return '🥤';
      case 'area': return '📐';
      case 'speed': return '🚗';
      default: return '🔢';
    }
  };

  return (
    <>
      <Seo 
        title="단위 변환기 | ToolHub.tools"
        description="길이, 무게, 온도, 부피 등 다양한 단위를 쉽게 변환"
        keywords="단위변환기,길이변환,무게변환,온도변환,부피변환"
        canonicalUrl="https://toolhub.tools/tools/unit-converter"
      />
      
      <ToolLayout
        title="단위 변환기"
        description="길이, 무게, 온도, 부피 등 다양한 단위를 쉽게 변환"
        category="utility"
        relatedTools={relatedTools}
      >
        {/* 단위 변환 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              단위 변환
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ConversionCategory)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                <TabsTrigger value="length">길이</TabsTrigger>
                <TabsTrigger value="weight">무게</TabsTrigger>
                <TabsTrigger value="temperature">온도</TabsTrigger>
                <TabsTrigger value="volume">부피</TabsTrigger>
                <TabsTrigger value="area">넓이</TabsTrigger>
                <TabsTrigger value="speed">속도</TabsTrigger>
              </TabsList>
              
              <div className="mt-6 space-y-4">
                {/* 입력 섹션 */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div className="md:col-span-2">
                    <Label htmlFor="input-value">값</Label>
                    <Input
                      id="input-value"
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="변환할 값을 입력하세요"
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="from-unit">변환 전</Label>
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                      <SelectTrigger>
                        <SelectValue placeholder="단위 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit.key} value={unit.key}>
                            {unit.name} ({unit.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      onClick={swapUnits}
                      variant="outline"
                      size="icon"
                      disabled={!fromUnit || !toUnit}
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <Label htmlFor="to-unit">변환 후</Label>
                    <Select value={toUnit} onValueChange={setToUnit}>
                      <SelectTrigger>
                        <SelectValue placeholder="단위 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit.key} value={unit.key}>
                            {unit.name} ({unit.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 결과 섹션 */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">변환 결과</h3>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {outputValue || '0'} {toUnit && getUnitName(toUnit)}
                      </div>
                      {inputValue && fromUnit && toUnit && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {inputValue} {getUnitName(fromUnit)} = {outputValue} {getUnitName(toUnit)}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={copyResult}
                      variant="outline"
                      disabled={!outputValue}
                      className={copied ? 'text-green-600' : ''}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copied ? '복사됨' : '복사'}
                    </Button>
                  </div>
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* 변환 히스토리 */}
        {history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="w-5 h-5 mr-2" />
                최근 변환 기록
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {history.slice(0, 10).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">
                        {getCategoryIcon(item.category)} {item.category}
                      </Badge>
                      <span className="text-sm">
                        {item.fromValue} {getUnitName(item.fromUnit)} = {item.toValue} {getUnitName(item.toUnit)}
                      </span>
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

        {/* 지원하는 단위 안내 */}
        <Card>
          <CardHeader>
            <CardTitle>지원하는 단위</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  📏 길이
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 밀리미터 (mm), 센티미터 (cm)</li>
                  <li>• 미터 (m), 킬로미터 (km)</li>
                  <li>• 인치 (in), 피트 (ft)</li>
                  <li>• 야드 (yd), 마일 (mi)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  ⚖️ 무게
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 밀리그램 (mg), 그램 (g)</li>
                  <li>• 킬로그램 (kg), 톤 (t)</li>
                  <li>• 온스 (oz), 파운드 (lb)</li>
                  <li>• 스톤 (st)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  🌡️ 온도
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 섭씨 (°C)</li>
                  <li>• 화씨 (°F)</li>
                  <li>• 켈빈 (K)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </ToolLayout>
    </>
  );
}