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
  const { t } = useTranslation();
  const { toast } = useToast();
  
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
    </div>
  );
}