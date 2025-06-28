import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Shield, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdSense from "@/components/AdSense";

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

interface PasswordStrength {
  score: number;
  level: 'weak' | 'medium' | 'strong' | 'very-strong';
  feedback: string[];
}

export default function PasswordGenerator() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const { toast } = useToast();
  
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [options, setOptions] = useState<PasswordOptions>({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: false,
    excludeSimilar: false,
    excludeAmbiguous: false
  });
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    level: 'weak',
    feedback: []
  });
  const [history, setHistory] = useState<string[]>([]);

  // Character sets
  const characterSets = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    similar: 'il1Lo0O',
    ambiguous: '{}[]()/\\\'"`~,;.<>'
  };

  // Generate password function
  const generatePassword = () => {
    let charset = '';
    
    if (options.includeLowercase) charset += characterSets.lowercase;
    if (options.includeUppercase) charset += characterSets.uppercase;
    if (options.includeNumbers) charset += characterSets.numbers;
    if (options.includeSymbols) charset += characterSets.symbols;
    
    // Remove similar characters if option is enabled
    if (options.excludeSimilar) {
      charset = charset.split('').filter(char => 
        !characterSets.similar.includes(char)
      ).join('');
    }
    
    // Remove ambiguous characters if option is enabled
    if (options.excludeAmbiguous) {
      charset = charset.split('').filter(char => 
        !characterSets.ambiguous.includes(char)
      ).join('');
    }
    
    if (charset === '') {
      toast({
        title: t('passwordGenerator.errors.noCharacterSet'),
        description: t('passwordGenerator.errors.selectAtLeastOne'),
        variant: "destructive"
      });
      return;
    }
    
    let newPassword = '';
    
    // Ensure at least one character from each selected set
    const requiredChars = [];
    if (options.includeLowercase) requiredChars.push(getRandomChar(characterSets.lowercase));
    if (options.includeUppercase) requiredChars.push(getRandomChar(characterSets.uppercase));
    if (options.includeNumbers) requiredChars.push(getRandomChar(characterSets.numbers));
    if (options.includeSymbols) requiredChars.push(getRandomChar(characterSets.symbols));
    
    // Fill remaining length with random characters
    for (let i = requiredChars.length; i < options.length; i++) {
      requiredChars.push(getRandomChar(charset));
    }
    
    // Shuffle the array to avoid predictable patterns
    newPassword = shuffleArray(requiredChars).join('');
    
    // Filter out non-ASCII characters (Korean/Hangul prevention)
    newPassword = newPassword.replace(/[^\x00-\x7F]/g, '');
    
    // If password became shorter due to filtering, regenerate
    if (newPassword.length < options.length) {
      generatePassword();
      return;
    }
    
    setPassword(newPassword);
    
    // Add to history (keep last 5)
    setHistory(prev => [newPassword, ...prev.slice(0, 4)]);
  };

  // Helper functions
  const getRandomChar = (charset: string) => {
    return charset.charAt(Math.floor(Math.random() * charset.length));
  };

  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Password strength calculation
  const calculateStrength = (pwd: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];
    
    // Length scoring
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;
    else if (pwd.length < 8) feedback.push(t('passwordGenerator.strength.tooShort'));
    
    // Character variety scoring
    if (/[a-z]/.test(pwd)) score += 1;
    else feedback.push(t('passwordGenerator.strength.needLowercase'));
    
    if (/[A-Z]/.test(pwd)) score += 1;
    else feedback.push(t('passwordGenerator.strength.needUppercase'));
    
    if (/[0-9]/.test(pwd)) score += 1;
    else feedback.push(t('passwordGenerator.strength.needNumbers'));
    
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    else feedback.push(t('passwordGenerator.strength.needSymbols'));
    
    // Pattern checks
    if (!/(.)\1{2,}/.test(pwd)) score += 1;
    else feedback.push(t('passwordGenerator.strength.avoidRepeating'));
    
    if (!/012|123|234|345|456|567|678|789|890|abc|bcd|cde|def/.test(pwd.toLowerCase())) score += 1;
    else feedback.push(t('passwordGenerator.strength.avoidSequential'));
    
    // Determine level
    let level: PasswordStrength['level'];
    if (score < 3) level = 'weak';
    else if (score < 6) level = 'medium';
    else if (score < 8) level = 'strong';
    else level = 'very-strong';
    
    return { score, level, feedback };
  };

  // Copy to clipboard function
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      toast({
        title: t('passwordGenerator.copySuccess'),
        description: t('passwordGenerator.copySuccessDesc'),
      });
    } catch (err) {
      toast({
        title: t('passwordGenerator.copyError'),
        description: t('passwordGenerator.copyErrorDesc'),
        variant: "destructive"
      });
    }
  };

  // Update strength when password changes
  useEffect(() => {
    if (password) {
      setStrength(calculateStrength(password));
    }
  }, [password]);

  // Generate initial password
  useEffect(() => {
    generatePassword();
  }, []);

  const getStrengthColor = (level: string) => {
    switch (level) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      case 'very-strong': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStrengthText = (level: string) => {
    switch (level) {
      case 'weak': return t('passwordGenerator.strength.weak');
      case 'medium': return t('passwordGenerator.strength.medium');
      case 'strong': return t('passwordGenerator.strength.strong');
      case 'very-strong': return t('passwordGenerator.strength.veryStrong');
      default: return '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {t('passwordGenerator.title')}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t('passwordGenerator.description')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {t('passwordGenerator.settings')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Length Slider */}
            <div className="space-y-2">
              <Label>{t('passwordGenerator.length')}: {options.length}</Label>
              <Slider
                value={[options.length]}
                onValueChange={(value) => setOptions(prev => ({ ...prev, length: value[0] }))}
                min={4}
                max={32}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>4</span>
                <span>32</span>
              </div>
            </div>

            {/* Character Options */}
            <div className="space-y-3">
              <Label>{t('passwordGenerator.includeCharacters')}</Label>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lowercase"
                  checked={options.includeLowercase}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, includeLowercase: checked as boolean }))
                  }
                />
                <Label htmlFor="lowercase">{t('passwordGenerator.lowercase')} (a-z)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="uppercase"
                  checked={options.includeUppercase}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, includeUppercase: checked as boolean }))
                  }
                />
                <Label htmlFor="uppercase">{t('passwordGenerator.uppercase')} (A-Z)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="numbers"
                  checked={options.includeNumbers}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, includeNumbers: checked as boolean }))
                  }
                />
                <Label htmlFor="numbers">{t('passwordGenerator.numbers')} (0-9)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="symbols"
                  checked={options.includeSymbols}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, includeSymbols: checked as boolean }))
                  }
                />
                <Label htmlFor="symbols">{t('passwordGenerator.symbols')} (!@#$%^&*)</Label>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="space-y-3">
              <Label>{t('passwordGenerator.advancedOptions')}</Label>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="excludeSimilar"
                  checked={options.excludeSimilar}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, excludeSimilar: checked as boolean }))
                  }
                />
                <Label htmlFor="excludeSimilar">{t('passwordGenerator.excludeSimilar')} (i, l, 1, L, o, 0, O)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="excludeAmbiguous"
                  checked={options.excludeAmbiguous}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, excludeAmbiguous: checked as boolean }))
                  }
                />
                <Label htmlFor="excludeAmbiguous">{t('passwordGenerator.excludeAmbiguous')} ({}[]()\/'"~,;.&lt;&gt;)</Label>
              </div>
            </div>

            <Button onClick={generatePassword} className="w-full" size="lg">
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('passwordGenerator.generate')}
            </Button>
          </CardContent>
        </Card>

        {/* Result Panel */}
        <div className="space-y-6">
          {/* Generated Password */}
          <Card>
            <CardHeader>
              <CardTitle>{t('passwordGenerator.generatedPassword')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  readOnly
                  className="pr-20 font-mono text-lg"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    disabled={!password}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Password Strength */}
              {password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{t('passwordGenerator.strength.title')}</Label>
                    <Badge variant="outline" className={`${getStrengthColor(strength.level)} text-white`}>
                      {getStrengthText(strength.level)}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getStrengthColor(strength.level)} transition-all duration-300`}
                      style={{ width: `${(strength.score / 9) * 100}%` }}
                    />
                  </div>
                  {strength.feedback.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      <p>{t('passwordGenerator.strength.suggestions')}:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {strength.feedback.map((feedback, index) => (
                          <li key={index}>{feedback}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AdSense Placeholder */}
          <Card className="bg-gray-50 dark:bg-gray-800">
            <CardContent className="p-4">
              <AdSense 
                adSlot="2345678901"
                style={{ display: 'block', textAlign: 'center', minHeight: '200px' }}
                className="rounded-lg"
              />
            </CardContent>
          </Card>

          {/* Password History */}
          {history.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('passwordGenerator.history')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {history.map((pwd, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <code className="font-mono text-sm">{pwd}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(pwd)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Tips */}
          <Card>
            <CardHeader>
              <CardTitle>{t('passwordGenerator.securityTips.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  {t('passwordGenerator.securityTips.tip1')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  {t('passwordGenerator.securityTips.tip2')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  {t('passwordGenerator.securityTips.tip3')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  {t('passwordGenerator.securityTips.tip4')}
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Content Section */}
      <div className="space-y-12 mt-16">
        {/* 비밀번호 생성기 소개 */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">
            {currentLang === 'ko' ? '안전한 비밀번호 생성기' : 
             currentLang === 'ja' ? '安全なパスワード生成器' : 
             'Secure Password Generator'}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {currentLang === 'ko' ? 
              'ToolHub.tools의 비밀번호 생성기는 해킹으로부터 계정을 보호하는 강력하고 안전한 비밀번호를 자동으로 생성합니다. 다양한 옵션을 제공하여 사용자가 원하는 조건에 맞는 비밀번호를 만들 수 있으며, 실시간 보안 강도 분석을 통해 생성된 비밀번호의 안전성을 즉시 확인할 수 있습니다. 모든 비밀번호는 브라우저에서 로컬로 생성되므로 외부로 전송되지 않아 완벽하게 안전합니다.' :
             currentLang === 'ja' ? 
              'ToolHub.toolsのパスワード生成器は、ハッキングからアカウントを保護する強力で安全なパスワードを自動的に生成します。様々なオプションを提供してユーザーが望む条件に合ったパスワードを作成でき、リアルタイムセキュリティ強度分析により生成されたパスワードの安全性を即座に確認できます。全てのパスワードはブラウザでローカルに生成されるため外部に送信されず、完全に安全です。' :
              'ToolHub.tools password generator automatically creates strong and secure passwords that protect your accounts from hacking. It provides various options to create passwords that meet your desired conditions, and you can instantly verify the security of generated passwords through real-time security strength analysis. All passwords are generated locally in your browser, so they are not transmitted externally and are completely secure.'
            }
          </p>
        </section>

        {/* 주요 기능 */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">주요 기능</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">비밀번호 생성 옵션</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 4-128자 길이 조절 가능</li>
                <li>• 대소문자, 숫자, 특수문자 선택</li>
                <li>• 혼동하기 쉬운 문자 제외 옵션</li>
                <li>• 모호한 문자 제외 기능</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">보안 분석 기능</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 실시간 보안 강도 측정</li>
                <li>• 색상별 보안 등급 표시</li>
                <li>• 보안 개선 제안 사항</li>
                <li>• 생성 기록 관리</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 상세 사용법 가이드 */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">상세 사용법 가이드</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">1. 기본 비밀번호 생성</h3>
              <p className="text-muted-foreground">
                길이 슬라이더로 원하는 비밀번호 길이를 설정하고, 포함할 문자 유형을 체크박스로 선택합니다. 
                '비밀번호 생성' 버튼을 클릭하면 조건에 맞는 안전한 비밀번호가 즉시 생성됩니다. 
                일반적으로 12자 이상, 모든 문자 유형을 포함하는 것을 권장합니다.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">2. 고급 옵션 활용</h3>
              <p className="text-muted-foreground">
                '유사한 문자 제외' 옵션을 선택하면 0과 O, 1과 l 같이 헷갈리기 쉬운 문자를 제외합니다. 
                '모호한 문자 제외' 옵션은 {}, [], () 같은 특수문자를 제외하여 
                입력하기 어려운 문자들을 피할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">3. 보안 강도 확인 및 복사</h3>
              <p className="text-muted-foreground">
                생성된 비밀번호의 보안 강도를 확인하고, 복사 버튼으로 클립보드에 저장합니다. 
                '약함', '보통', '강함', '매우 강함' 등급을 참고하여 적절한 보안 수준의 비밀번호를 선택하세요. 
                생성 기록에서 이전에 만든 비밀번호들을 다시 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* 활용 예시 */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">활용 예시</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
              <h3 className="text-lg font-semibold mb-2">온라인 계정 보안</h3>
              <p className="text-muted-foreground text-sm">
                이메일, 소셜미디어, 온라인 쇼핑몰, 은행 계정 등 
                중요한 온라인 서비스의 비밀번호를 생성할 때 사용합니다. 
                각 계정마다 고유한 강력한 비밀번호를 설정하여 보안을 강화할 수 있습니다.
              </p>
            </div>
            <div className="bg-secondary/5 rounded-lg p-4 border border-secondary/20">
              <h3 className="text-lg font-semibold mb-2">업무용 시스템</h3>
              <p className="text-muted-foreground text-sm">
                회사 시스템, 클라우드 서비스, 프로젝트 관리 도구 등 
                업무에 사용하는 각종 플랫폼의 보안 비밀번호를 생성합니다. 
                높은 보안 등급이 요구되는 업무 환경에 적합한 복잡한 비밀번호를 만들 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* 자주 묻는 질문 FAQ */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div className="border-b border-border pb-4">
              <h3 className="font-semibold mb-2">Q. 생성된 비밀번호가 안전한가요?</h3>
              <p className="text-muted-foreground text-sm">
                A. 네, 모든 비밀번호는 브라우저에서 암호학적으로 안전한 랜덤 생성기를 사용하여 로컬로 생성됩니다. 
                서버로 전송되지 않으므로 완전히 안전합니다.
              </p>
            </div>
            <div className="border-b border-border pb-4">
              <h3 className="font-semibold mb-2">Q. 비밀번호 길이는 얼마나 해야 하나요?</h3>
              <p className="text-muted-foreground text-sm">
                A. 일반적으로 12자 이상을 권장하며, 중요한 계정의 경우 16자 이상을 추천합니다. 
                길수록 보안이 강화되지만 기억하기 어려우므로 비밀번호 관리자 사용을 권장합니다.
              </p>
            </div>
            <div className="border-b border-border pb-4">
              <h3 className="font-semibold mb-2">Q. 어떤 문자를 포함해야 하나요?</h3>
              <p className="text-muted-foreground text-sm">
                A. 대문자, 소문자, 숫자, 특수문자를 모두 포함하는 것이 가장 안전합니다. 
                다만 일부 사이트에서 특수문자를 제한하는 경우가 있으니 해당 사이트의 정책을 확인하세요.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Q. 같은 비밀번호를 여러 곳에 사용해도 되나요?</h3>
              <p className="text-muted-foreground text-sm">
                A. 절대 안됩니다. 각 계정마다 고유한 비밀번호를 사용해야 합니다. 
                하나의 계정이 해킹당해도 다른 계정은 안전하게 보호할 수 있습니다.
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
              <h3 className="text-lg font-semibold mb-3">비밀번호 관리</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 비밀번호 관리자 사용 권장</li>
                <li>• 정기적인 비밀번호 변경</li>
                <li>• 2단계 인증 함께 사용</li>
                <li>• 안전한 장소에 백업 보관</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">보안 강화</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 개인정보 포함 금지</li>
                <li>• 예측 가능한 패턴 피하기</li>
                <li>• 계정별 고유 비밀번호 사용</li>
                <li>• 피싱 사이트 주의</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}