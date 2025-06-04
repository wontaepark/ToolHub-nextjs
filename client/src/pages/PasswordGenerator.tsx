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
  const { t } = useTranslation();
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
    </div>
  );
}