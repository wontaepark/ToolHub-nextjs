import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, Ruler, Weight, Thermometer, Copy, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdSense from "@/components/AdSense";

interface ConversionUnit {
  key: string;
  name: string;
  symbol: string;
  toBase: number; // multiplier to convert to base unit
  offset?: number; // for temperature conversions
}

interface ConversionHistory {
  id: string;
  category: string;
  fromValue: number;
  fromUnit: string;
  toValue: number;
  toUnit: string;
  timestamp: number;
}

export default function UnitConverter() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const currentLang = i18n.language;
  
  const [activeTab, setActiveTab] = useState('length');
  const [inputValue, setInputValue] = useState('1');
  const [outputValue, setOutputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [history, setHistory] = useState<ConversionHistory[]>([]);

  // Unit definitions
  const units = {
    length: [
      { key: 'mm', name: t('unitConverter.units.length.mm'), symbol: 'mm', toBase: 0.001 },
      { key: 'cm', name: t('unitConverter.units.length.cm'), symbol: 'cm', toBase: 0.01 },
      { key: 'm', name: t('unitConverter.units.length.m'), symbol: 'm', toBase: 1 },
      { key: 'km', name: t('unitConverter.units.length.km'), symbol: 'km', toBase: 1000 },
      { key: 'in', name: t('unitConverter.units.length.in'), symbol: 'in', toBase: 0.0254 },
      { key: 'ft', name: t('unitConverter.units.length.ft'), symbol: 'ft', toBase: 0.3048 },
      { key: 'yd', name: t('unitConverter.units.length.yd'), symbol: 'yd', toBase: 0.9144 },
      { key: 'mi', name: t('unitConverter.units.length.mi'), symbol: 'mi', toBase: 1609.344 },
    ],
    weight: [
      { key: 'mg', name: t('unitConverter.units.weight.mg'), symbol: 'mg', toBase: 0.000001 },
      { key: 'g', name: t('unitConverter.units.weight.g'), symbol: 'g', toBase: 0.001 },
      { key: 'kg', name: t('unitConverter.units.weight.kg'), symbol: 'kg', toBase: 1 },
      { key: 't', name: t('unitConverter.units.weight.t'), symbol: 't', toBase: 1000 },
      { key: 'oz', name: t('unitConverter.units.weight.oz'), symbol: 'oz', toBase: 0.0283495 },
      { key: 'lb', name: t('unitConverter.units.weight.lb'), symbol: 'lb', toBase: 0.453592 },
      { key: 'st', name: t('unitConverter.units.weight.st'), symbol: 'st', toBase: 6.35029 },
    ],
    temperature: [
      { key: 'c', name: t('unitConverter.units.temperature.c'), symbol: '°C', toBase: 1, offset: 0 },
      { key: 'f', name: t('unitConverter.units.temperature.f'), symbol: '°F', toBase: 5/9, offset: -32 },
      { key: 'k', name: t('unitConverter.units.temperature.k'), symbol: 'K', toBase: 1, offset: -273.15 },
    ],
    volume: [
      { key: 'ml', name: t('unitConverter.units.volume.ml'), symbol: 'ml', toBase: 0.001 },
      { key: 'l', name: t('unitConverter.units.volume.l'), symbol: 'L', toBase: 1 },
      { key: 'cup', name: t('unitConverter.units.volume.cup'), symbol: 'cup', toBase: 0.236588 },
      { key: 'pt', name: t('unitConverter.units.volume.pt'), symbol: 'pt', toBase: 0.473176 },
      { key: 'qt', name: t('unitConverter.units.volume.qt'), symbol: 'qt', toBase: 0.946353 },
      { key: 'gal', name: t('unitConverter.units.volume.gal'), symbol: 'gal', toBase: 3.78541 },
      { key: 'floz', name: t('unitConverter.units.volume.floz'), symbol: 'fl oz', toBase: 0.0295735 },
    ]
  };

  // Conversion logic
  const convertValue = (value: number, from: ConversionUnit, to: ConversionUnit, category: string) => {
    if (category === 'temperature') {
      // Temperature conversion logic
      if (from.key === to.key) return value;
      
      // Convert to Celsius first
      let celsius = value;
      if (from.key === 'f') {
        celsius = (value - 32) * 5/9;
      } else if (from.key === 'k') {
        celsius = value - 273.15;
      }
      
      // Convert from Celsius to target
      if (to.key === 'f') {
        return celsius * 9/5 + 32;
      } else if (to.key === 'k') {
        return celsius + 273.15;
      }
      
      return celsius;
    } else {
      // Standard unit conversion
      const baseValue = value * from.toBase;
      return baseValue / to.toBase;
    }
  };

  // Perform conversion
  const performConversion = () => {
    if (!inputValue || !fromUnit || !toUnit) return;
    
    const value = parseFloat(inputValue);
    if (isNaN(value)) return;
    
    const currentUnits = units[activeTab as keyof typeof units];
    const fromUnitData = currentUnits.find(u => u.key === fromUnit);
    const toUnitData = currentUnits.find(u => u.key === toUnit);
    
    if (!fromUnitData || !toUnitData) return;
    
    const result = convertValue(value, fromUnitData, toUnitData, activeTab);
    const formattedResult = parseFloat(result.toFixed(8)).toString();
    setOutputValue(formattedResult);
    
    // Add to history
    const historyItem: ConversionHistory = {
      id: Date.now().toString(),
      category: activeTab,
      fromValue: value,
      fromUnit: fromUnitData.symbol,
      toValue: parseFloat(formattedResult),
      toUnit: toUnitData.symbol,
      timestamp: Date.now()
    };
    
    setHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10
  };

  // Auto-convert when values change
  useEffect(() => {
    performConversion();
  }, [inputValue, fromUnit, toUnit, activeTab]);

  // Reset units when tab changes
  useEffect(() => {
    const currentUnits = units[activeTab as keyof typeof units];
    if (currentUnits.length > 0) {
      setFromUnit(currentUnits[0].key);
      setToUnit(currentUnits[1]?.key || currentUnits[0].key);
    }
    setInputValue('1');
    setOutputValue('');
  }, [activeTab]);

  // Swap units
  const swapUnits = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setInputValue(outputValue || inputValue);
  };

  // Copy result to clipboard
  const copyResult = async () => {
    if (!outputValue) return;
    
    try {
      await navigator.clipboard.writeText(outputValue);
      toast({
        title: t('unitConverter.copySuccess'),
        description: t('unitConverter.copySuccessDesc'),
      });
    } catch (err) {
      toast({
        title: t('unitConverter.copyError'),
        description: t('unitConverter.copyErrorDesc'),
        variant: "destructive"
      });
    }
  };

  // Popular conversions
  const popularConversions = {
    length: [
      { from: 'in', to: 'cm', label: 'inch to cm' },
      { from: 'ft', to: 'm', label: 'feet to meter' },
      { from: 'cm', to: 'in', label: 'cm to inch' },
      { from: 'm', to: 'ft', label: 'meter to feet' },
    ],
    weight: [
      { from: 'kg', to: 'lb', label: 'kg to lb' },
      { from: 'lb', to: 'kg', label: 'lb to kg' },
      { from: 'g', to: 'oz', label: 'gram to ounce' },
      { from: 'oz', to: 'g', label: 'ounce to gram' },
    ],
    temperature: [
      { from: 'c', to: 'f', label: '°C to °F' },
      { from: 'f', to: 'c', label: '°F to °C' },
      { from: 'c', to: 'k', label: '°C to K' },
      { from: 'k', to: 'c', label: 'K to °C' },
    ],
    volume: [
      { from: 'l', to: 'gal', label: 'liter to gallon' },
      { from: 'gal', to: 'l', label: 'gallon to liter' },
      { from: 'cup', to: 'ml', label: 'cup to ml' },
      { from: 'ml', to: 'cup', label: 'ml to cup' },
    ]
  };

  const applyPopularConversion = (from: string, to: string) => {
    setFromUnit(from);
    setToUnit(to);
  };

  const currentUnits = units[activeTab as keyof typeof units];
  const currentPopular = popularConversions[activeTab as keyof typeof popularConversions];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {t('unitConverter.title')}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t('unitConverter.description')}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Converter */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                {t('unitConverter.converter')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="length" className="flex items-center gap-1">
                    <Ruler className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('unitConverter.categories.length')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="weight" className="flex items-center gap-1">
                    <Weight className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('unitConverter.categories.weight')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="temperature" className="flex items-center gap-1">
                    <Thermometer className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('unitConverter.categories.temperature')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="volume" className="flex items-center gap-1">
                    <div className="w-4 h-4 text-xs">🫗</div>
                    <span className="hidden sm:inline">{t('unitConverter.categories.volume')}</span>
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6 space-y-4">
                  {/* Input Section */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t('unitConverter.from')}</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="1"
                          className="flex-1"
                        />
                        <Select value={fromUnit} onValueChange={setFromUnit}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {currentUnits.map((unit) => (
                              <SelectItem key={unit.key} value={unit.key}>
                                {unit.symbol}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>{t('unitConverter.to')}</Label>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={outputValue}
                          readOnly
                          placeholder="0"
                          className="flex-1"
                        />
                        <Select value={toUnit} onValueChange={setToUnit}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {currentUnits.map((unit) => (
                              <SelectItem key={unit.key} value={unit.key}>
                                {unit.symbol}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={swapUnits}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                      {t('unitConverter.swap')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={copyResult}
                      disabled={!outputValue}
                      className="flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      {t('unitConverter.copy')}
                    </Button>
                  </div>

                  {/* Popular Conversions */}
                  <div className="space-y-2">
                    <Label>{t('unitConverter.popular')}</Label>
                    <div className="flex flex-wrap gap-2">
                      {currentPopular.map((conv, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => applyPopularConversion(conv.from, conv.to)}
                          className="text-xs"
                        >
                          {conv.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          {/* AdSense */}
          <Card className="bg-gray-50 dark:bg-gray-800">
            <CardContent className="p-4">
              <AdSense 
                adSlot="3456789012"
                style={{ display: 'block', textAlign: 'center', minHeight: '200px' }}
                className="rounded-lg"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Conversion History */}
          {history.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('unitConverter.history')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {history.slice(0, 5).map((item) => (
                    <div key={item.id} className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="font-mono">
                        {item.fromValue} {item.fromUnit} = {item.toValue} {item.toUnit}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t(`unitConverter.categories.${item.category}`)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('unitConverter.quickRef.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold mb-1">{t('unitConverter.categories.length')}</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>1 m = 100 cm = 1000 mm</li>
                    <li>1 inch = 2.54 cm</li>
                    <li>1 ft = 12 inches = 30.48 cm</li>
                    <li>1 yard = 3 ft = 0.9144 m</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{t('unitConverter.categories.weight')}</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>1 kg = 1000 g</li>
                    <li>1 lb = 16 oz = 453.592 g</li>
                    <li>1 stone = 14 lb = 6.35 kg</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{t('unitConverter.categories.temperature')}</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>°F = °C × 9/5 + 32</li>
                    <li>°C = (°F - 32) × 5/9</li>
                    <li>K = °C + 273.15</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('unitConverter.tips.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  {t('unitConverter.tips.tip1')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  {t('unitConverter.tips.tip2')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  {t('unitConverter.tips.tip3')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  {t('unitConverter.tips.tip4')}
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Content Section */}
      <div className="space-y-12 mt-16">
        {/* 단위 변환기 소개 */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">
            {currentLang === 'ko' ? '정확한 단위 변환기' : 
             currentLang === 'ja' ? '正確な単位変換ツール' : 
             'Accurate Unit Converter'}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {currentLang === 'ko' ? 
              'ToolHub.tools의 단위 변환기는 길이, 무게, 온도, 부피 등 다양한 측정 단위를 빠르고 정확하게 변환해주는 온라인 도구입니다. 과학적 계산, 요리, 여행, 학습 등 일상생활과 전문 업무에서 필요한 모든 단위 변환을 지원합니다. 직관적인 인터페이스와 실시간 변환 기능으로 누구나 쉽게 사용할 수 있으며, 변환 기록을 저장하여 자주 사용하는 변환을 빠르게 다시 확인할 수 있습니다.' :
             currentLang === 'ja' ? 
              'ToolHub.toolsの単位変換ツールは、長さ、重量、温度、体積など様々な測定単位を迅速かつ正確に変換するオンラインツールです。科学計算、料理、旅行、学習など、日常生活や専門業務で必要なすべての単位変換をサポートします。直感的なインターフェースとリアルタイム変換機能により誰でも簡単に使用でき、変換履歴を保存してよく使用する変換を素早く再確認できます。' :
              'ToolHub.tools\' unit converter is an online tool that quickly and accurately converts various measurement units such as length, weight, temperature, and volume. It supports all unit conversions needed in daily life and professional work including scientific calculations, cooking, travel, and learning. With an intuitive interface and real-time conversion features, anyone can easily use it, and conversion history is saved for quick re-checking of frequently used conversions.'
            }
          </p>
        </section>

        {/* 주요 기능 */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">
            {currentLang === 'ko' ? '주요 기능' : 
             currentLang === 'ja' ? '主な機能' : 
             'Key Features'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                {currentLang === 'ko' ? '지원 단위 카테고리' : 
                 currentLang === 'ja' ? 'サポート単位カテゴリ' : 
                 'Supported Unit Categories'}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• {currentLang === 'ko' ? '길이: mm, cm, m, km, inch, feet, yard' : 
                      currentLang === 'ja' ? '長さ: mm, cm, m, km, inch, feet, yard' : 
                      'Length: mm, cm, m, km, inch, feet, yard'}</li>
                <li>• {currentLang === 'ko' ? '무게: g, kg, oz, lb, ton' : 
                      currentLang === 'ja' ? '重量: g, kg, oz, lb, ton' : 
                      'Weight: g, kg, oz, lb, ton'}</li>
                <li>• {currentLang === 'ko' ? '온도: 섭씨, 화씨, 켈빈' : 
                      currentLang === 'ja' ? '温度: 摂氏、華氏、ケルビン' : 
                      'Temperature: Celsius, Fahrenheit, Kelvin'}</li>
                <li>• {currentLang === 'ko' ? '부피: ml, L, cup, gallon, pint' : 
                      currentLang === 'ja' ? '体積: ml, L, cup, gallon, pint' : 
                      'Volume: ml, L, cup, gallon, pint'}</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">
                {currentLang === 'ko' ? '편의 기능' : 
                 currentLang === 'ja' ? '便利機能' : 
                 'Convenience Features'}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• {currentLang === 'ko' ? '실시간 자동 변환' : 
                      currentLang === 'ja' ? 'リアルタイム自動変換' : 
                      'Real-time automatic conversion'}</li>
                <li>• {currentLang === 'ko' ? '양방향 변환 지원' : 
                      currentLang === 'ja' ? '双方向変換サポート' : 
                      'Bidirectional conversion support'}</li>
                <li>• {currentLang === 'ko' ? '변환 기록 저장' : 
                      currentLang === 'ja' ? '変換履歴保存' : 
                      'Conversion history saving'}</li>
                <li>• {currentLang === 'ko' ? '정확한 소수점 계산' : 
                      currentLang === 'ja' ? '正確な小数点計算' : 
                      'Accurate decimal calculations'}</li>
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
                {currentLang === 'ko' ? '1. 기본 단위 변환' : 
                 currentLang === 'ja' ? '1. 基本単位変換' : 
                 '1. Basic Unit Conversion'}
              </h3>
              <p className="text-muted-foreground">
                {currentLang === 'ko' ? 
                  '원하는 카테고리 탭(길이, 무게, 온도, 부피)을 선택하고, 변환할 값을 입력합니다. \'변환 전\' 단위와 \'변환 후\' 단위를 드롭다운에서 선택하면 자동으로 결과가 계산됩니다. 입력값을 수정할 때마다 실시간으로 변환 결과가 업데이트됩니다.' :
                 currentLang === 'ja' ? 
                  '希望するカテゴリタブ（長さ、重量、温度、体積）を選択し、変換する値を入力します。「変換前」単位と「変換後」単位をドロップダウンから選択すると自動的に結果が計算されます。入力値を修正するたびにリアルタイムで変換結果が更新されます。' :
                  'Select the desired category tab (length, weight, temperature, volume) and enter the value to convert. Choose the "from" and "to" units from the dropdowns and the result will be calculated automatically. The conversion result updates in real-time whenever you modify the input value.'
                }
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {currentLang === 'ko' ? '2. 양방향 변환 활용' : 
                 currentLang === 'ja' ? '2. 双方向変換活用' : 
                 '2. Bidirectional Conversion Usage'}
              </h3>
              <p className="text-muted-foreground">
                {currentLang === 'ko' ? 
                  '가운데 화살표 버튼을 클릭하면 변환 전과 변환 후 단위가 서로 바뀝니다. 이 기능을 통해 역방향 변환을 쉽게 수행할 수 있어, 예를 들어 미터에서 피트로 변환했다가 다시 피트에서 미터로 변환할 수 있습니다.' :
                 currentLang === 'ja' ? 
                  '中央の矢印ボタンをクリックすると、変換前と変換後の単位が入れ替わります。この機能により逆方向変換を簡単に実行でき、例えばメートルからフィートに変換した後、再びフィートからメートルに変換することができます。' :
                  'Clicking the center arrow button swaps the "from" and "to" units. This feature allows you to easily perform reverse conversions, for example converting from meters to feet and then back from feet to meters.'
                }
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {currentLang === 'ko' ? '3. 변환 기록 관리' : 
                 currentLang === 'ja' ? '3. 変換履歴管理' : 
                 '3. Conversion History Management'}
              </h3>
              <p className="text-muted-foreground">
                {currentLang === 'ko' ? 
                  '모든 변환 결과는 자동으로 기록되어 하단의 변환 기록 섹션에 표시됩니다. 이전 변환 결과를 클릭하면 해당 값을 현재 입력으로 불러올 수 있으며, \'기록 지우기\' 버튼으로 모든 기록을 삭제할 수 있습니다.' :
                 currentLang === 'ja' ? 
                  'すべての変換結果は自動的に記録され、下部の変換履歴セクションに表示されます。以前の変換結果をクリックするとその値を現在の入力として読み込むことができ、「履歴削除」ボタンですべての履歴を削除できます。' :
                  'All conversion results are automatically recorded and displayed in the conversion history section at the bottom. You can click on previous conversion results to load those values as current input, and use the "Clear History" button to delete all records.'
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
                {currentLang === 'ko' ? '일상 생활' : 
                 currentLang === 'ja' ? '日常生活' : 
                 'Daily Life'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  '요리할 때 레시피의 단위 변환, 해외 여행 시 현지 단위 이해, 운동 기록 관리, 온라인 쇼핑에서 제품 크기 확인 등 일상에서 자주 마주치는 단위 변환 상황에 유용합니다.' :
                 currentLang === 'ja' ? 
                  '料理時のレシピ単位変換、海外旅行時の現地単位理解、運動記録管理、オンラインショッピングでの商品サイズ確認など、日常でよく遭遇する単位変換状況に便利です。' :
                  'Useful for common unit conversion situations in daily life such as recipe unit conversions while cooking, understanding local units during overseas travel, managing exercise records, and checking product sizes in online shopping.'
                }
              </p>
            </div>
            <div className="bg-secondary/5 rounded-lg p-4 border border-secondary/20">
              <h3 className="text-lg font-semibold mb-2">
                {currentLang === 'ko' ? '전문 업무' : 
                 currentLang === 'ja' ? '専門業務' : 
                 'Professional Work'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  '건축 설계, 공학 계산, 과학 실험, 제조업 품질 관리, 국제 무역에서의 단위 표준화 등 전문적인 업무 환경에서 정확한 단위 변환이 필요한 상황에 활용할 수 있습니다.' :
                 currentLang === 'ja' ? 
                  '建築設計、工学計算、科学実験、製造業品質管理、国際貿易での単位標準化など、専門的な業務環境で正確な単位変換が必要な状況に活用できます。' :
                  'Can be utilized in professional work environments requiring accurate unit conversions such as architectural design, engineering calculations, scientific experiments, manufacturing quality control, and unit standardization in international trade.'
                }
              </p>
            </div>
          </div>
        </section>

        {/* 자주 묻는 질문 FAQ */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">
            {currentLang === 'ko' ? '자주 묻는 질문 (FAQ)' : 
             currentLang === 'ja' ? 'よくある質問 (FAQ)' : 
             'Frequently Asked Questions (FAQ)'}
          </h2>
          <div className="space-y-4">
            <div className="border-b border-border pb-4">
              <h3 className="font-semibold mb-2">
                {currentLang === 'ko' ? 'Q. 변환 결과가 정확한가요?' : 
                 currentLang === 'ja' ? 'Q. 変換結果は正確ですか？' : 
                 'Q. Are the conversion results accurate?'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  'A. 네, 국제 표준 변환 계수를 사용하여 높은 정확도를 보장합니다. 온도 변환의 경우 정확한 공식을 적용하며, 소수점 계산도 정밀하게 처리됩니다.' :
                 currentLang === 'ja' ? 
                  'A. はい、国際標準変換係数を使用して高い精度を保証します。温度変換の場合は正確な公式を適用し、小数点計算も精密に処理されます。' :
                  'A. Yes, we guarantee high accuracy using international standard conversion factors. For temperature conversions, accurate formulas are applied, and decimal calculations are processed precisely.'
                }
              </p>
            </div>
            <div className="border-b border-border pb-4">
              <h3 className="font-semibold mb-2">
                {currentLang === 'ko' ? 'Q. 더 많은 단위를 추가할 예정인가요?' : 
                 currentLang === 'ja' ? 'Q. より多くの単位を追加する予定ですか？' : 
                 'Q. Will more units be added in the future?'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  'A. 사용자 요청에 따라 지속적으로 새로운 단위와 카테고리를 추가할 예정입니다. 현재는 가장 일반적으로 사용되는 단위들을 우선 지원하고 있습니다.' :
                 currentLang === 'ja' ? 
                  'A. ユーザーのリクエストに応じて継続的に新しい単位とカテゴリを追加する予定です。現在は最も一般的に使用される単位を優先的にサポートしています。' :
                  'A. We plan to continuously add new units and categories based on user requests. Currently, we prioritize supporting the most commonly used units.'
                }
              </p>
            </div>
            <div className="border-b border-border pb-4">
              <h3 className="font-semibold mb-2">
                {currentLang === 'ko' ? 'Q. 소수점 자릿수를 조정할 수 있나요?' : 
                 currentLang === 'ja' ? 'Q. 小数点桁数を調整できますか？' : 
                 'Q. Can I adjust the decimal places?'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  'A. 현재는 최대 6자리 소수점까지 표시되며, 필요에 따라 자동으로 반올림됩니다. 과학적 정밀도가 필요한 경우 전체 정밀도로 계산됩니다.' :
                 currentLang === 'ja' ? 
                  'A. 現在は最大6桁の小数点まで表示され、必要に応じて自動的に四捨五入されます。科学的精度が必要な場合は完全な精度で計算されます。' :
                  'A. Currently, up to 6 decimal places are displayed and automatically rounded as needed. For scientific precision requirements, calculations are performed with full precision.'
                }
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                {currentLang === 'ko' ? 'Q. 복합 단위 변환도 가능한가요?' : 
                 currentLang === 'ja' ? 'Q. 複合単位変換も可能ですか？' : 
                 'Q. Are compound unit conversions possible?'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  'A. 현재는 기본 단위 변환을 지원하며, 복합 단위(예: m/s, kg/m³)는 향후 업데이트에서 추가할 예정입니다.' :
                 currentLang === 'ja' ? 
                  'A. 現在は基本単位変換をサポートしており、複合単位（例：m/s、kg/m³）は今後のアップデートで追加予定です。' :
                  'A. Currently we support basic unit conversions, and compound units (e.g., m/s, kg/m³) will be added in future updates.'
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
              <h3 className="text-lg font-semibold mb-3">효율적인 사용</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 자주 사용하는 변환은 북마크</li>
                <li>• 양방향 변환 버튼 활용</li>
                <li>• 변환 기록으로 재사용</li>
                <li>• 복사 기능으로 빠른 공유</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">정확성 확보</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 입력값 범위 확인</li>
                <li>• 단위 기호 정확히 확인</li>
                <li>• 온도 변환 시 절대온도 주의</li>
                <li>• 중요한 계산은 검산 권장</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}