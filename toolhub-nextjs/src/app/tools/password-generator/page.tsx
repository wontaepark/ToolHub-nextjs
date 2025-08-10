'use client';

import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { AdBannerInline } from '@/components/AdBanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Copy, RefreshCw, Shield, Eye, EyeOff, History } from 'lucide-react';
import { generatePassword, calculatePasswordStrength, type PasswordOptions } from '@/utils/calculation';
import { getRelatedTools } from '@/lib/tools';

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState<PasswordOptions>({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: false,
    excludeSimilar: false,
    excludeAmbiguous: false
  });
  const [history, setHistory] = useState<string[]>([]);

  // 관련 도구 가져오기
  const relatedTools = getRelatedTools('password-generator').map(tool => ({
    id: tool.id,
    name: tool.name.ko,
    emoji: tool.emoji,
    href: `/tools/${tool.id}`
  }));

  // localStorage에서 설정 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedOptions = localStorage.getItem('password-generator-options');
      const savedHistory = localStorage.getItem('password-generator-history');
      
      if (savedOptions) {
        setOptions(JSON.parse(savedOptions));
      }
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    }
  }, []);

  // 설정을 localStorage에 저장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('password-generator-options', JSON.stringify(options));
    }
  }, [options]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('password-generator-history', JSON.stringify(history));
    }
  }, [history]);

  // 비밀번호 생성
  const handleGeneratePassword = React.useCallback(() => {
    try {
      const newPassword = generatePassword(options);
      setPassword(newPassword);
      
      // 히스토리에 추가 (최근 10개까지만 저장)
      setHistory(prev => [newPassword, ...prev.filter(p => p !== newPassword)].slice(0, 10));
    } catch {
      alert('비밀번호 생성 중 오류가 발생했습니다. 설정을 확인해주세요.');
    }
  }, [options]);

  // 비밀번호 복사
  const copyToClipboard = async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 복사 실패시 fallback
      const textArea = document.createElement('textarea');
      textArea.value = password;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 비밀번호 강도 계산
  const strength = password ? calculatePasswordStrength(password) : { score: 0, level: 'weak' as const, feedback: [] };

  // 강도 색상 매핑
  const getStrengthColor = (level: string) => {
    switch (level) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-blue-500';
      case 'very-strong': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const getStrengthLabel = (level: string) => {
    switch (level) {
      case 'weak': return '약함';
      case 'medium': return '보통';
      case 'strong': return '강함';
      case 'very-strong': return '매우 강함';
      default: return '없음';
    }
  };

  // 초기 비밀번호 생성
  useEffect(() => {
    if (!password) {
      handleGeneratePassword();
    }
  }, [password, handleGeneratePassword]);

  return (
    <>
      
      <ToolLayout
        title="비밀번호 생성기"
        description="강력하고 안전한 비밀번호를 자동으로 생성"
        category="security"
        relatedTools={relatedTools}
      >
        {/* 비밀번호 생성 결과 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              생성된 비밀번호
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  readOnly
                  className="font-mono text-lg pr-20"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyToClipboard}
                    className={copied ? 'text-green-600' : ''}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button onClick={handleGeneratePassword} className="bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                새로 생성
              </Button>
            </div>

            {copied && (
              <div className="text-green-600 text-sm">
                비밀번호가 클립보드에 복사되었습니다!
              </div>
            )}

            {/* 비밀번호 강도 표시 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">비밀번호 강도</span>
                <Badge className={`${getStrengthColor(strength.level)} text-white`}>
                  {getStrengthLabel(strength.level)}
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strength.level)}`}
                  style={{ width: `${(strength.score / 7) * 100}%` }}
                />
              </div>
              {strength.feedback.length > 0 && (
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">개선 제안:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {strength.feedback.map((feedback, index) => (
                      <li key={index}>{feedback}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 비밀번호 설정 */}
        <Card>
          <CardHeader>
            <CardTitle>비밀번호 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 길이 설정 */}
            <div>
              <Label className="text-base font-medium">
                길이: {options.length}자
              </Label>
              <Slider
                value={[options.length]}
                onValueChange={(value) => setOptions({ ...options, length: value[0] })}
                max={50}
                min={4}
                step={1}
                className="mt-2"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>4</span>
                <span>50</span>
              </div>
            </div>

            {/* 문자 종류 설정 */}
            <div className="space-y-3">
              <Label className="text-base font-medium">포함할 문자</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="uppercase"
                    checked={options.includeUppercase}
                    onCheckedChange={(checked) => 
                      setOptions({ ...options, includeUppercase: checked as boolean })
                    }
                  />
                  <Label htmlFor="uppercase">대문자 (A-Z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lowercase"
                    checked={options.includeLowercase}
                    onCheckedChange={(checked) => 
                      setOptions({ ...options, includeLowercase: checked as boolean })
                    }
                  />
                  <Label htmlFor="lowercase">소문자 (a-z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="numbers"
                    checked={options.includeNumbers}
                    onCheckedChange={(checked) => 
                      setOptions({ ...options, includeNumbers: checked as boolean })
                    }
                  />
                  <Label htmlFor="numbers">숫자 (0-9)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="symbols"
                    checked={options.includeSymbols}
                    onCheckedChange={(checked) => 
                      setOptions({ ...options, includeSymbols: checked as boolean })
                    }
                  />
                  <Label htmlFor="symbols">특수문자 (!@#$...)</Label>
                </div>
              </div>
            </div>

            {/* 추가 옵션 */}
            <div className="space-y-3">
              <Label className="text-base font-medium">추가 옵션</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="excludeSimilar"
                    checked={options.excludeSimilar}
                    onCheckedChange={(checked) => 
                      setOptions({ ...options, excludeSimilar: checked as boolean })
                    }
                  />
                  <Label htmlFor="excludeSimilar">유사한 문자 제외 (i, l, 1, L, o, 0, O)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="excludeAmbiguous"
                    checked={options.excludeAmbiguous}
                    onCheckedChange={(checked) => 
                      setOptions({ ...options, excludeAmbiguous: checked as boolean })
                    }
                  />
                  <Label htmlFor="excludeAmbiguous">모호한 문자 제외 ({`{}[]()/"'`}, 등)</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 비밀번호 히스토리 */}
        {history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="w-5 h-5 mr-2" />
                최근 생성된 비밀번호
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {history.map((historyPassword, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-mono text-sm flex-1 mr-4">
                      {showPassword ? historyPassword : '•'.repeat(historyPassword.length)}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(historyPassword);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 광고 */}
        <AdBannerInline />

        {/* 보안 팁 */}
        <Card>
          <CardHeader>
            <CardTitle>비밀번호 보안 팁</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-green-700">✅ 권장사항</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 12자 이상의 길이 사용</li>
                  <li>• 대소문자, 숫자, 특수문자 조합</li>
                  <li>• 각 서비스마다 다른 비밀번호 사용</li>
                  <li>• 정기적인 비밀번호 변경</li>
                  <li>• 2단계 인증 활성화</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-red-700">❌ 피해야 할 것</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 개인정보 기반 비밀번호</li>
                  <li>• 연속된 숫자나 문자 (123, abc)</li>
                  <li>• 공용 컴퓨터에서 저장</li>
                  <li>• 비밀번호 재사용</li>
                  <li>• 비밀번호를 메모장에 저장</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </ToolLayout>
    </>
  );
}