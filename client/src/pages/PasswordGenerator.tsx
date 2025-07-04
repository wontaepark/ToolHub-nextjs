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
import RelatedTools from "@/components/RelatedTools";

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
          <h2 className="text-2xl font-bold mb-4">
            {currentLang === 'ko' ? '주요 기능' : 
             currentLang === 'ja' ? '主要機能' : 
             'Main Features'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                {currentLang === 'ko' ? '비밀번호 생성 옵션' : 
                 currentLang === 'ja' ? 'パスワード生成オプション' : 
                 'Password Generation Options'}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• {currentLang === 'ko' ? '4-128자 길이 조절 가능' : 
                      currentLang === 'ja' ? '4-128文字の長さ調整可能' : 
                      'Adjustable length from 4-128 characters'}</li>
                <li>• {currentLang === 'ko' ? '대소문자, 숫자, 특수문자 선택' : 
                      currentLang === 'ja' ? '大文字・小文字、数字、特殊文字選択' : 
                      'Select uppercase, lowercase, numbers, symbols'}</li>
                <li>• {currentLang === 'ko' ? '혼동하기 쉬운 문자 제외 옵션' : 
                      currentLang === 'ja' ? '混同しやすい文字除外オプション' : 
                      'Option to exclude confusing characters'}</li>
                <li>• {currentLang === 'ko' ? '모호한 문자 제외 기능' : 
                      currentLang === 'ja' ? '曖昧な文字除外機能' : 
                      'Exclude ambiguous characters feature'}</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">
                {currentLang === 'ko' ? '보안 분석 기능' : 
                 currentLang === 'ja' ? 'セキュリティ分析機能' : 
                 'Security Analysis Features'}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• {currentLang === 'ko' ? '실시간 보안 강도 측정' : 
                      currentLang === 'ja' ? 'リアルタイムセキュリティ強度測定' : 
                      'Real-time security strength measurement'}</li>
                <li>• {currentLang === 'ko' ? '색상별 보안 등급 표시' : 
                      currentLang === 'ja' ? '色別セキュリティレベル表示' : 
                      'Color-coded security level display'}</li>
                <li>• {currentLang === 'ko' ? '보안 개선 제안 사항' : 
                      currentLang === 'ja' ? 'セキュリティ改善提案事項' : 
                      'Security improvement suggestions'}</li>
                <li>• {currentLang === 'ko' ? '생성 기록 관리' : 
                      currentLang === 'ja' ? '生成履歴管理' : 
                      'Generation history management'}</li>
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
                {currentLang === 'ko' ? '1. 기본 비밀번호 생성' : 
                 currentLang === 'ja' ? '1. 基本パスワード生成' : 
                 '1. Basic Password Generation'}
              </h3>
              <p className="text-muted-foreground">
                {currentLang === 'ko' ? 
                  '길이 슬라이더로 원하는 비밀번호 길이를 설정하고, 포함할 문자 유형을 체크박스로 선택합니다. \'비밀번호 생성\' 버튼을 클릭하면 조건에 맞는 안전한 비밀번호가 즉시 생성됩니다. 일반적으로 12자 이상, 모든 문자 유형을 포함하는 것을 권장합니다.' :
                 currentLang === 'ja' ? 
                  '長さスライダーで希望するパスワードの長さを設定し、含める文字タイプをチェックボックスで選択します。「パスワード生成」ボタンをクリックすると条件に合った安全なパスワードが即座に生成されます。一般的に12文字以上、すべての文字タイプを含むことを推奨します。' :
                  'Set your desired password length with the length slider, and select character types to include using checkboxes. Click the \'Generate Password\' button to instantly create a secure password that meets your conditions. Generally, 12+ characters including all character types is recommended.'
                }
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {currentLang === 'ko' ? '2. 고급 옵션 활용' : 
                 currentLang === 'ja' ? '2. 高度なオプション活用' : 
                 '2. Advanced Options Usage'}
              </h3>
              <p className="text-muted-foreground">
                {currentLang === 'ko' ? 
                  '\'유사한 문자 제외\' 옵션을 선택하면 0과 O, 1과 l 같이 헷갈리기 쉬운 문자를 제외합니다. \'모호한 문자 제외\' 옵션은 {}, [], () 같은 특수문자를 제외하여 입력하기 어려운 문자들을 피할 수 있습니다.' :
                 currentLang === 'ja' ? 
                  '「類似文字除外」オプションを選択すると0とO、1とlのような混同しやすい文字を除外します。「曖昧文字除外」オプションは{}、[]、()のような特殊文字を除外して入力しにくい文字を避けることができます。' :
                  'Selecting the \'Exclude Similar Characters\' option excludes easily confused characters like 0 and O, 1 and l. The \'Exclude Ambiguous Characters\' option excludes special characters like {}, [], () to avoid hard-to-type characters.'
                }
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {currentLang === 'ko' ? '3. 보안 강도 확인 및 복사' : 
                 currentLang === 'ja' ? '3. セキュリティ強度確認とコピー' : 
                 '3. Security Strength Check & Copy'}
              </h3>
              <p className="text-muted-foreground">
                {currentLang === 'ko' ? 
                  '생성된 비밀번호의 보안 강도를 확인하고, 복사 버튼으로 클립보드에 저장합니다. \'약함\', \'보통\', \'강함\', \'매우 강함\' 등급을 참고하여 적절한 보안 수준의 비밀번호를 선택하세요. 생성 기록에서 이전에 만든 비밀번호들을 다시 확인할 수 있습니다.' :
                 currentLang === 'ja' ? 
                  '生成されたパスワードのセキュリティ強度を確認し、コピーボタンでクリップボードに保存します。「弱い」、「普通」、「強い」、「非常に強い」グレードを参考に適切なセキュリティレベルのパスワードを選択してください。生成履歴で以前作成したパスワードを再確認できます。' :
                  'Check the security strength of generated passwords and save them to clipboard with the copy button. Select appropriate security level passwords by referring to \'Weak\', \'Medium\', \'Strong\', \'Very Strong\' grades. You can review previously generated passwords in the generation history.'
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
                {currentLang === 'ko' ? '온라인 계정 보안' : 
                 currentLang === 'ja' ? 'オンラインアカウントセキュリティ' : 
                 'Online Account Security'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  '이메일, 소셜미디어, 온라인 쇼핑몰, 은행 계정 등 중요한 온라인 서비스의 비밀번호를 생성할 때 사용합니다. 각 계정마다 고유한 강력한 비밀번호를 설정하여 보안을 강화할 수 있습니다.' :
                 currentLang === 'ja' ? 
                  'メール、ソーシャルメディア、オンラインショッピング、銀行口座など重要なオンラインサービスのパスワードを生成する際に使用します。各アカウントごとに固有の強力なパスワードを設定してセキュリティを強化できます。' :
                  'Use for generating passwords for important online services such as email, social media, online shopping, and bank accounts. You can enhance security by setting unique strong passwords for each account.'
                }
              </p>
            </div>
            <div className="bg-secondary/5 rounded-lg p-4 border border-secondary/20">
              <h3 className="text-lg font-semibold mb-2">
                {currentLang === 'ko' ? '업무용 시스템' : 
                 currentLang === 'ja' ? '業務用システム' : 
                 'Business Systems'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  '회사 시스템, 클라우드 서비스, 프로젝트 관리 도구 등 업무에 사용하는 각종 플랫폼의 보안 비밀번호를 생성합니다. 높은 보안 등급이 요구되는 업무 환경에 적합한 복잡한 비밀번호를 만들 수 있습니다.' :
                 currentLang === 'ja' ? 
                  '会社システム、クラウドサービス、プロジェクト管理ツールなど業務で使用する各種プラットフォームのセキュリティパスワードを生成します。高いセキュリティグレードが要求される業務環境に適した複雑なパスワードを作成できます。' :
                  'Generate secure passwords for various business platforms including company systems, cloud services, and project management tools. Create complex passwords suitable for work environments that require high security levels.'
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
                {currentLang === 'ko' ? 'Q. 생성된 비밀번호가 안전한가요?' : 
                 currentLang === 'ja' ? 'Q. 生成されたパスワードは安全ですか？' : 
                 'Q. Are the generated passwords secure?'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  'A. 네, 모든 비밀번호는 브라우저에서 암호학적으로 안전한 랜덤 생성기를 사용하여 로컬로 생성됩니다. 서버로 전송되지 않으므로 완전히 안전합니다.' :
                 currentLang === 'ja' ? 
                  'A. はい、すべてのパスワードはブラウザで暗号学的に安全なランダム生成器を使用してローカルで生成されます。サーバーに送信されないため完全に安全です。' :
                  'A. Yes, all passwords are generated locally in your browser using cryptographically secure random generators. They are not transmitted to servers, making them completely secure.'
                }
              </p>
            </div>
            <div className="border-b border-border pb-4">
              <h3 className="font-semibold mb-2">
                {currentLang === 'ko' ? 'Q. 비밀번호 길이는 얼마나 해야 하나요?' : 
                 currentLang === 'ja' ? 'Q. パスワードの長さはどのくらいにすべきですか？' : 
                 'Q. How long should passwords be?'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  'A. 일반적으로 12자 이상을 권장하며, 중요한 계정의 경우 16자 이상을 추천합니다. 길수록 보안이 강화되지만 기억하기 어려우므로 비밀번호 관리자 사용을 권장합니다.' :
                 currentLang === 'ja' ? 
                  'A. 一般的に12文字以上を推奨し、重要なアカウントの場合は16文字以上をお勧めします。長いほどセキュリティが強化されますが覚えにくいため、パスワードマネージャーの使用を推奨します。' :
                  'A. Generally, 12+ characters are recommended, with 16+ characters for important accounts. Longer passwords enhance security, but since they are harder to remember, using a password manager is recommended.'
                }
              </p>
            </div>
            <div className="border-b border-border pb-4">
              <h3 className="font-semibold mb-2">
                {currentLang === 'ko' ? 'Q. 어떤 문자를 포함해야 하나요?' : 
                 currentLang === 'ja' ? 'Q. どの文字を含めるべきですか？' : 
                 'Q. What characters should be included?'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  'A. 대문자, 소문자, 숫자, 특수문자를 모두 포함하는 것이 가장 안전합니다. 다만 일부 사이트에서 특수문자를 제한하는 경우가 있으니 해당 사이트의 정책을 확인하세요.' :
                 currentLang === 'ja' ? 
                  'A. 大文字、小文字、数字、特殊文字をすべて含むのが最も安全です。ただし一部のサイトで特殊文字を制限する場合があるため、該当サイトのポリシーを確認してください。' :
                  'A. Including uppercase, lowercase, numbers, and special characters is safest. However, some sites restrict special characters, so check the site\'s policy.'
                }
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                {currentLang === 'ko' ? 'Q. 같은 비밀번호를 여러 곳에 사용해도 되나요?' : 
                 currentLang === 'ja' ? 'Q. 同じパスワードを複数箇所で使用しても良いですか？' : 
                 'Q. Can I use the same password for multiple accounts?'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  'A. 절대 안됩니다. 각 계정마다 고유한 비밀번호를 사용해야 합니다. 하나의 계정이 해킹당해도 다른 계정은 안전하게 보호할 수 있습니다.' :
                 currentLang === 'ja' ? 
                  'A. 絶対にいけません。各アカウントごとに固有のパスワードを使用する必要があります。一つのアカウントがハッキングされても他のアカウントは安全に保護できます。' :
                  'A. Absolutely not. Each account should have a unique password. Even if one account is hacked, other accounts remain safely protected.'
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
              <h3 className="text-lg font-semibold mb-3">
                {currentLang === 'ko' ? '비밀번호 관리' : 
                 currentLang === 'ja' ? 'パスワード管理' : 
                 'Password Management'}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• {currentLang === 'ko' ? '비밀번호 관리자 사용 권장' : 
                      currentLang === 'ja' ? 'パスワードマネージャー使用推奨' : 
                      'Recommend using password manager'}</li>
                <li>• {currentLang === 'ko' ? '정기적인 비밀번호 변경' : 
                      currentLang === 'ja' ? '定期的なパスワード変更' : 
                      'Regular password changes'}</li>
                <li>• {currentLang === 'ko' ? '2단계 인증 함께 사용' : 
                      currentLang === 'ja' ? '2段階認証の併用' : 
                      'Use two-factor authentication'}</li>
                <li>• {currentLang === 'ko' ? '안전한 장소에 백업 보관' : 
                      currentLang === 'ja' ? '安全な場所にバックアップ保管' : 
                      'Store backups in secure location'}</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">
                {currentLang === 'ko' ? '보안 강화' : 
                 currentLang === 'ja' ? 'セキュリティ強化' : 
                 'Security Enhancement'}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• {currentLang === 'ko' ? '개인정보 포함 금지' : 
                      currentLang === 'ja' ? '個人情報含有禁止' : 
                      'Avoid including personal information'}</li>
                <li>• {currentLang === 'ko' ? '예측 가능한 패턴 피하기' : 
                      currentLang === 'ja' ? '予測可能なパターンの回避' : 
                      'Avoid predictable patterns'}</li>
                <li>• {currentLang === 'ko' ? '계정별 고유 비밀번호 사용' : 
                      currentLang === 'ja' ? 'アカウント別固有パスワード使用' : 
                      'Use unique passwords per account'}</li>
                <li>• {currentLang === 'ko' ? '피싱 사이트 주의' : 
                      currentLang === 'ja' ? 'フィッシングサイト注意' : 
                      'Beware of phishing sites'}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 현대 사이버 보안 위협과 비밀번호의 중요성 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <i className="ri-spy-line text-red-500"></i>
              {currentLang === 'ko' ? '현대 사이버 보안 위협과 비밀번호의 중요성' :
               currentLang === 'ja' ? '現代サイバーセキュリティ脅威とパスワードの重要性' :
               'Modern Cybersecurity Threats and Password Importance'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <i className="ri-error-warning-line text-orange-500"></i>
                  {currentLang === 'ko' ? '급증하는 사이버 범죄 현황' :
                   currentLang === 'ja' ? '急増するサイバー犯罪現況' :
                   'Rising Cybercrime Statistics'}
                </h3>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 p-3 rounded-lg border border-red-200/50 dark:border-red-800/30">
                    <h4 className="font-medium text-red-800 dark:text-red-300 mb-1">
                      {currentLang === 'ko' ? '글로벌 해킹 통계' :
                       currentLang === 'ja' ? 'グローバルハッキング統計' :
                       'Global Hacking Statistics'}
                    </h4>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {currentLang === 'ko' ? '2024년 사이버 보안 연구에 따르면, 전 세계적으로 매초 39명이 해킹 피해를 당하고 있으며, 이 중 81%가 약한 비밀번호나 재사용된 비밀번호로 인한 것입니다. 한국의 경우 2023년 개인정보 유출 신고 건수가 전년 대비 43% 증가했습니다.' :
                       currentLang === 'ja' ? '2024年サイバーセキュリティ研究によると、世界的に毎秒39人がハッキング被害を受けており、このうち81%が弱いパスワードや再使用されたパスワードによるものです。韓国の場合、2023年個人情報流出申告件数が前年比43%増加しました。' :
                       'According to 2024 cybersecurity research, 39 people worldwide fall victim to hacking every second, with 81% due to weak or reused passwords. In Korea, personal information breach reports increased by 43% in 2023 compared to the previous year.'}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 p-3 rounded-lg border border-orange-200/50 dark:border-orange-800/30">
                    <h4 className="font-medium text-orange-800 dark:text-orange-300 mb-1">
                      {currentLang === 'ko' ? '경제적 피해 규모' :
                       currentLang === 'ja' ? '経済的被害規模' :
                       'Economic Damage Scale'}
                    </h4>
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      {currentLang === 'ko' ? 'IBM의 \"2024 데이터 유출 비용 보고서\"에 따르면, 데이터 유출로 인한 전 세계 평균 피해 비용은 445만 달러에 달하며, 개인의 경우 평균 158달러의 직접적 손실과 함께 신용도 하락, 개인정보 도용 등의 2차 피해가 발생합니다.' :
                       currentLang === 'ja' ? 'IBMの「2024データ流出コスト報告書」によると、データ流出による世界平均被害コストは445万ドルに達し、個人の場合平均158ドルの直接的損失とともに信用度下落、個人情報盗用などの二次被害が発生します。' :
                       'According to IBM\'s \"2024 Cost of Data Breach Report,\" the global average cost of data breaches reaches $4.45 million, with individuals facing an average direct loss of $158 plus secondary damages including credit score decline and identity theft.'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <i className="ri-hacker-line text-purple-500"></i>
                  {currentLang === 'ko' ? '비밀번호 공격 기법의 진화' :
                   currentLang === 'ja' ? 'パスワード攻撃技法の進化' :
                   'Evolution of Password Attack Techniques'}
                </h3>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 p-3 rounded-lg border border-purple-200/50 dark:border-purple-800/30">
                    <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-1">
                      {currentLang === 'ko' ? '무차별 대입 공격 (Brute Force)' :
                       currentLang === 'ja' ? '総当たり攻撃 (Brute Force)' :
                       'Brute Force Attack'}
                    </h4>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      {currentLang === 'ko' ? '현대의 해커들은 초당 수십억 번의 비밀번호 조합을 시도할 수 있는 고성능 컴퓨터를 사용합니다. 8자리 숫자로만 구성된 비밀번호는 단 몇 초 만에 뚫릴 수 있으며, 12자리 복합 문자 비밀번호도 몇 시간 내에 해독 가능합니다.' :
                       currentLang === 'ja' ? '現代のハッカーは毎秒数十億回のパスワード組み合わせを試行できる高性能コンピュータを使用します。8桁の数字のみで構成されたパスワードは数秒で破られ、12桁の複合文字パスワードも数時間で解読可能です。' :
                       'Modern hackers use high-performance computers capable of attempting billions of password combinations per second. 8-digit numeric passwords can be cracked in seconds, and even 12-character complex passwords can be decoded within hours.'}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-3 rounded-lg border border-blue-200/50 dark:border-blue-800/30">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                      {currentLang === 'ko' ? 'AI를 활용한 패스워드 크래킹' :
                       currentLang === 'ja' ? 'AIを活用したパスワードクラッキング' :
                       'AI-Powered Password Cracking'}
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {currentLang === 'ko' ? '인공지능 기술의 발전으로 기존 방식보다 훨씬 빠른 비밀번호 해독이 가능해졌습니다. 대응책으로 더 긴 비밀번호(최소 16자 이상)와 완전한 랜덤성 확보가 필요합니다.' :
                       currentLang === 'ja' ? '人工知能技術の発展により従来の方式よりもはるかに速いパスワード解読が可能になりました。対応策として、より長いパスワード（最低16文字以上）と完全なランダム性の確保が必要です。' :
                       'AI technology advancement has enabled much faster password cracking than traditional methods. Countermeasures include longer passwords (minimum 16+ characters) and ensuring complete randomness.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 핵심 기능과 고급 보안 옵션 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <i className="ri-settings-3-line text-primary"></i>
              {currentLang === 'ko' ? '핵심 기능과 고급 보안 옵션' :
               currentLang === 'ja' ? '主要機能と高度セキュリティオプション' :
               'Core Features and Advanced Security Options'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <i className="ri-cpu-line text-green-600 text-xl"></i>
                </div>
                <h3 className="font-semibold text-foreground">
                  {currentLang === 'ko' ? '강력한 비밀번호 생성 엔진' :
                   currentLang === 'ja' ? '強力なパスワード生成エンジン' :
                   'Powerful Password Generation Engine'}
                </h3>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-green-600">
                      {currentLang === 'ko' ? '암호학적 보안 난수 생성' :
                       currentLang === 'ja' ? '暗号学的セキュア乱数生成' :
                       'Cryptographically Secure Random Generation'}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {currentLang === 'ko' ? 'Web Crypto API를 활용한 암호학적으로 안전한 의사난수 생성기(CSPRNG) 사용. 군사급 암호화 수준의 보안성 제공' :
                       currentLang === 'ja' ? 'Web Crypto APIを活用した暗号学的に安全な擬似乱数生成器（CSPRNG）使用。軍事級暗号化レベルのセキュリティ提供' :
                       'Uses Web Crypto API-based Cryptographically Secure Pseudo-Random Number Generator (CSPRNG). Provides military-grade encryption level security'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <i className="ri-tools-line text-blue-600 text-xl"></i>
                </div>
                <h3 className="font-semibold text-foreground">
                  {currentLang === 'ko' ? '맞춤형 설정 옵션' :
                   currentLang === 'ja' ? 'カスタム設定オプション' :
                   'Customizable Settings Options'}
                </h3>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-blue-600">
                      {currentLang === 'ko' ? '길이 설정 (4-128자)' :
                       currentLang === 'ja' ? '長さ設定（4-128文字）' :
                       'Length Settings (4-128 characters)'}
                    </span>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                      <li>• {currentLang === 'ko' ? '12-16자: 일반 온라인 계정용 (권장)' :
                              currentLang === 'ja' ? '12-16文字：一般オンラインアカウント用（推奨）' :
                              '12-16 chars: General online accounts (recommended)'}</li>
                      <li>• {currentLang === 'ko' ? '20-32자: 중요한 금융/업무 계정용' :
                              currentLang === 'ja' ? '20-32文字：重要な金融・業務アカウント用' :
                              '20-32 chars: Important financial/business accounts'}</li>
                      <li>• {currentLang === 'ko' ? '64-128자: 마스터 패스워드용 (최고 보안)' :
                              currentLang === 'ja' ? '64-128文字：マスターパスワード用（最高セキュリティ）' :
                              '64-128 chars: Master passwords (maximum security)'}</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <i className="ri-shield-star-line text-purple-600 text-xl"></i>
                </div>
                <h3 className="font-semibold text-foreground">
                  {currentLang === 'ko' ? '실시간 보안 강도 분석' :
                   currentLang === 'ja' ? 'リアルタイムセキュリティ強度分析' :
                   'Real-time Security Strength Analysis'}
                </h3>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-purple-600">
                      {currentLang === 'ko' ? 'NIST 가이드라인 기반 평가' :
                       currentLang === 'ja' ? 'NISTガイドライン基盤評価' :
                       'NIST Guideline-based Evaluation'}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {currentLang === 'ko' ? '미국 국립표준기술연구소(NIST)의 최신 비밀번호 가이드라인을 기반으로 실시간 보안 강도 평가' :
                       currentLang === 'ja' ? '米国国立標準技術研究所（NIST）の最新パスワードガイドラインに基づくリアルタイムセキュリティ強度評価' :
                       'Real-time security strength evaluation based on the latest NIST password guidelines'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 비밀번호 보안 모범 사례 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <i className="ri-shield-check-line text-green-500"></i>
              {currentLang === 'ko' ? '비밀번호 보안 모범 사례' :
               currentLang === 'ja' ? 'パスワードセキュリティベストプラクティス' :
               'Password Security Best Practices'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <i className="ri-folder-settings-line text-blue-500"></i>
                  {currentLang === 'ko' ? '생성 후 관리 전략' :
                   currentLang === 'ja' ? '生成後管理戦略' :
                   'Post-Generation Management Strategy'}
                </h3>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-4 rounded-lg border border-blue-200/50 dark:border-blue-800/30">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                      {currentLang === 'ko' ? '비밀번호 관리자 활용' :
                       currentLang === 'ja' ? 'パスワードマネージャー活用' :
                       'Password Manager Utilization'}
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                      {currentLang === 'ko' ? '생성된 강력한 비밀번호는 반드시 신뢰할 수 있는 비밀번호 관리자에 저장하세요:' :
                       currentLang === 'ja' ? '生成された強力なパスワードは必ず信頼できるパスワードマネージャーに保存してください：' :
                       'Always store generated strong passwords in a trusted password manager:'}
                    </p>
                    <ul className="text-xs text-blue-500 dark:text-blue-400 space-y-1">
                      <li>• {currentLang === 'ko' ? '추천 도구: 1Password, Bitwarden, LastPass, KeePass' :
                              currentLang === 'ja' ? '推奨ツール：1Password、Bitwarden、LastPass、KeePass' :
                              'Recommended tools: 1Password, Bitwarden, LastPass, KeePass'}</li>
                      <li>• {currentLang === 'ko' ? '장점: 자동 입력, 안전한 저장, 다기기 동기화' :
                              currentLang === 'ja' ? 'メリット：自動入力、安全な保存、マルチデバイス同期' :
                              'Benefits: Auto-fill, secure storage, multi-device sync'}</li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-lg border border-green-200/50 dark:border-green-800/30">
                    <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                      {currentLang === 'ko' ? '정기적 비밀번호 갱신' :
                       currentLang === 'ja' ? '定期的パスワード更新' :
                       'Regular Password Updates'}
                    </h4>
                    <ul className="text-xs text-green-600 dark:text-green-400 space-y-1">
                      <li>• {currentLang === 'ko' ? '최고 보안 (금융): 3개월' :
                              currentLang === 'ja' ? '最高セキュリティ（金融）：3ヶ月' :
                              'Maximum security (financial): 3 months'}</li>
                      <li>• {currentLang === 'ko' ? '높은 보안 (이메일, 업무): 6개월' :
                              currentLang === 'ja' ? '高セキュリティ（メール、業務）：6ヶ月' :
                              'High security (email, work): 6 months'}</li>
                      <li>• {currentLang === 'ko' ? '일반 보안 (소셜미디어): 12개월' :
                              currentLang === 'ja' ? '一般セキュリティ（ソーシャルメディア）：12ヶ月' :
                              'General security (social media): 12 months'}</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <i className="ri-alert-line text-red-500"></i>
                  {currentLang === 'ko' ? '절대 금지 사항' :
                   currentLang === 'ja' ? '絶対禁止事項' :
                   'Absolute Prohibitions'}
                </h3>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 p-4 rounded-lg border border-red-200/50 dark:border-red-800/30">
                    <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">
                      {currentLang === 'ko' ? '위험한 저장 및 공유 방법' :
                       currentLang === 'ja' ? '危険な保存・共有方法' :
                       'Dangerous Storage and Sharing Methods'}
                    </h4>
                    <ul className="text-xs text-red-600 dark:text-red-400 space-y-1">
                      <li>• {currentLang === 'ko' ? '이메일/메신저로 비밀번호 전송: 평문으로 전송 시 탈취 위험' :
                              currentLang === 'ja' ? 'メール・メッセンジャーでパスワード送信：平文送信時盗取リスク' :
                              'Email/messenger password transmission: Risk of interception in plain text'}</li>
                      <li>• {currentLang === 'ko' ? '메모장이나 텍스트 파일에 저장: 악성 소프트웨어 접근 가능' :
                              currentLang === 'ja' ? 'メモ帳やテキストファイルに保存：マルウェアアクセス可能' :
                              'Notepad or text file storage: Accessible to malware'}</li>
                      <li>• {currentLang === 'ko' ? '동일한 비밀번호 재사용: 하나의 침해가 전체 계정 위험으로 확산' :
                              currentLang === 'ja' ? '同一パスワード再使用：一つの侵害が全アカウントリスクに拡散' :
                              'Reusing same password: One breach spreads to all accounts'}</li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 p-4 rounded-lg border border-orange-200/50 dark:border-orange-800/30">
                    <h4 className="font-medium text-orange-800 dark:text-orange-300 mb-2">
                      {currentLang === 'ko' ? '2단계 인증 (2FA) 필수 적용' :
                       currentLang === 'ja' ? '2段階認証（2FA）必須適用' :
                       'Mandatory Two-Factor Authentication (2FA)'}
                    </h4>
                    <ul className="text-xs text-orange-600 dark:text-orange-400 space-y-1">
                      <li>• {currentLang === 'ko' ? 'SMS 인증: 기본적이지만 SIM 스와핑 위험' :
                              currentLang === 'ja' ? 'SMS認証：基本的だがSIMスワッピングリスク' :
                              'SMS authentication: Basic but SIM swapping risk'}</li>
                      <li>• {currentLang === 'ko' ? '앱 기반 인증: Google Authenticator, Authy 등 권장' :
                              currentLang === 'ja' ? 'アプリ基盤認証：Google Authenticator、Authy等推奨' :
                              'App-based authentication: Google Authenticator, Authy recommended'}</li>
                      <li>• {currentLang === 'ko' ? '하드웨어 키: YubiKey 등 물리적 보안 키 (최고 보안)' :
                              currentLang === 'ja' ? 'ハードウェアキー：YubiKey等物理的セキュリティキー（最高セキュリティ）' :
                              'Hardware keys: YubiKey etc. physical security keys (maximum security)'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 자주 묻는 질문 확장 버전 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <i className="ri-question-line text-primary"></i>
              {currentLang === 'ko' ? '자주 묻는 질문 (FAQ) - 상세 가이드' :
               currentLang === 'ja' ? 'よくある質問（FAQ）- 詳細ガイド' :
               'Frequently Asked Questions (FAQ) - Detailed Guide'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold mb-2 text-blue-700 dark:text-blue-400">
                  {currentLang === 'ko' ? 'Q1. 생성된 비밀번호가 정말 안전한가요?' :
                   currentLang === 'ja' ? 'Q1. 生成されたパスワードは本当に安全ですか？' :
                   'Q1. Are the generated passwords really secure?'}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {currentLang === 'ko' ? 
                    '네, 우리의 비밀번호 생성기는 Web Crypto API를 사용한 암호학적으로 안전한 난수 생성기를 활용합니다. 모든 비밀번호는 브라우저에서 로컬로 생성되어 외부로 전송되지 않으며, 군사급 암호화에서 사용되는 수준의 보안성을 제공합니다.' :
                   currentLang === 'ja' ? 
                    'はい、私たちのパスワード生成器はWeb Crypto APIを使用した暗号学的に安全な乱数生成器を活用します。すべてのパスワードはブラウザでローカルに生成され外部に送信されず、軍事級暗号化で使用されるレベルのセキュリティを提供します。' :
                    'Yes, our password generator uses cryptographically secure random number generators through Web Crypto API. All passwords are generated locally in your browser without external transmission, providing military-grade encryption level security.'
                  }
                </p>
                <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded text-xs text-blue-600 dark:text-blue-400">
                  {currentLang === 'ko' ? '16자 이상의 복합 문자 비밀번호는 현재 기술로 수백 년이 걸려야 해독 가능합니다.' :
                   currentLang === 'ja' ? '16文字以上の複合文字パスワードは現在の技術で数百年かかって解読可能です。' :
                   '16+ character complex passwords would take hundreds of years to crack with current technology.'}
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold mb-2 text-green-700 dark:text-green-400">
                  {currentLang === 'ko' ? 'Q2. 비밀번호 길이는 얼마나 설정해야 하나요?' :
                   currentLang === 'ja' ? 'Q2. パスワードの長さはどのくらいに設定すべきですか？' :
                   'Q2. How long should passwords be set?'}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {currentLang === 'ko' ? 
                    '사용 목적에 따라 다르지만, 일반적으로 최소 12자 이상을 권장합니다. 은행이나 중요한 업무 계정은 16자 이상, 소셜미디어 등 일반 계정은 12-14자가 적당합니다.' :
                   currentLang === 'ja' ? 
                    '使用目的によって異なりますが、一般的に最低12文字以上を推奨します。銀行や重要な業務アカウントは16文字以上、ソーシャルメディア等一般アカウントは12-14文字が適当です。' :
                    'It depends on usage purpose, but generally minimum 12+ characters are recommended. Banking or important business accounts should use 16+ characters, while general accounts like social media can use 12-14 characters.'
                  }
                </p>
                <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded text-xs text-green-600 dark:text-green-400">
                  {currentLang === 'ko' ? '길이가 길수록 보안이 강화되지만, 비밀번호 관리자를 사용하면 길이에 대한 부담을 줄일 수 있습니다.' :
                   currentLang === 'ja' ? '長いほどセキュリティが強化されますが、パスワードマネージャーを使用すれば長さの負担を減らせます。' :
                   'Longer passwords enhance security, but using a password manager can reduce the burden of length.'}
                </div>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold mb-2 text-orange-700 dark:text-orange-400">
                  {currentLang === 'ko' ? 'Q3. 특수문자를 반드시 포함해야 하나요?' :
                   currentLang === 'ja' ? 'Q3. 特殊文字を必ず含める必要がありますか？' :
                   'Q3. Must special characters be included?'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentLang === 'ko' ? 
                    '특수문자를 포함하면 비밀번호의 복잡성이 크게 증가하여 보안이 강화됩니다. 다만 일부 웹사이트나 시스템에서는 특정 특수문자를 허용하지 않는 경우가 있으므로, 해당 서비스의 비밀번호 정책을 확인한 후 설정하는 것이 좋습니다.' :
                   currentLang === 'ja' ? 
                    '特殊文字を含めるとパスワードの複雑性が大幅に増加してセキュリティが強化されます。ただし一部のウェブサイトやシステムでは特定の特殊文字を許可しない場合があるため、該当サービスのパスワードポリシーを確認後設定することをお勧めします。' :
                    'Including special characters significantly increases password complexity and enhances security. However, some websites or systems may not allow certain special characters, so it\'s recommended to check the password policy of the specific service before setting.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 마무리 섹션 */}
        <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-xl p-8 border border-green-200/50 dark:border-green-800/30">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            {currentLang === 'ko' ? '안전한 디지털 라이프의 시작' :
             currentLang === 'ja' ? '安全なデジタルライフの始まり' :
             'The Beginning of Secure Digital Life'}
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
            {currentLang === 'ko' ? 'ToolHub.tools 비밀번호 생성기와 함께 사이버 위협으로부터 안전한 디지털 환경을 구축하세요. 강력한 비밀번호는 여러분의 소중한 정보를 지키는 첫 번째 방어선입니다.' :
             currentLang === 'ja' ? 'ToolHub.toolsパスワード生成器と一緒にサイバー脅威から安全なデジタル環境を構築してください。強力なパスワードはあなたの大切な情報を守る第一の防御線です。' :
             'Build a secure digital environment protected from cyber threats with ToolHub.tools password generator. Strong passwords are the first line of defense protecting your valuable information.'}
          </p>
          <div className="flex justify-center">
            <div className="animate-pulse">
              <i className="ri-shield-keyhole-line text-primary text-4xl"></i>
            </div>
          </div>
        </div>
        
        {/* 관련 도구 섹션 */}
        <RelatedTools currentTool="/password" maxItems={4} />
      </div>
    </div>
  );
}