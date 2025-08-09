/**
 * 공통 계산 유틸리티 함수들
 */

// 숫자 포맷팅
export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toLocaleString('ko-KR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
};

// 안전한 숫자 파싱
export const safeParseFloat = (value: string): number => {
  const parsed = parseFloat(value.replace(/,/g, ''));
  return isNaN(parsed) ? 0 : parsed;
};

export const safeParseInt = (value: string): number => {
  const parsed = parseInt(value.replace(/,/g, ''), 10);
  return isNaN(parsed) ? 0 : parsed;
};

// 범위 검증
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

// 퍼센트 계산
export const calculatePercentage = (value: number, total: number): number => {
  return total === 0 ? 0 : (value / total) * 100;
};

/**
 * 단위 변환 관련 유틸리티
 */
export interface Unit {
  key: string;
  name: string;
  symbol: string;
  toBase: number;
  offset?: number; // 온도 변환용
}

export interface UnitCategory {
  name: string;
  baseUnit: string;
  units: Unit[];
}

// 기본 단위 변환 함수
export const convertUnit = (
  value: number,
  fromUnit: Unit,
  toUnit: Unit,
  isTemperature: boolean = false
): number => {
  if (isTemperature) {
    // 온도 변환 (섭씨 기준)
    const celsius = fromUnit.offset 
      ? (value + fromUnit.offset) / fromUnit.toBase 
      : value;
    
    const result = toUnit.offset 
      ? celsius * toUnit.toBase - toUnit.offset 
      : celsius;
    
    return result;
  } else {
    // 일반 단위 변환
    const baseValue = value * fromUnit.toBase;
    return baseValue / toUnit.toBase;
  }
};

/**
 * 날짜 계산 관련 유틸리티
 */
export interface DateDifference {
  totalDays: number;
  years: number;
  months: number;
  days: number;
  weeks: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const calculateDateDifference = (
  startDate: Date,
  endDate: Date
): DateDifference => {
  const diffInMs = Math.abs(endDate.getTime() - startDate.getTime());
  
  // 기본 단위 계산
  const totalDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(totalDays / 7);
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const minutes = Math.floor(diffInMs / (1000 * 60));
  const seconds = Math.floor(diffInMs / 1000);

  // 년/월/일 계산
  let years = 0;
  let months = 0;
  let days = 0;

  if (totalDays > 0) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    years = end.getFullYear() - start.getFullYear();
    months = end.getMonth() - start.getMonth();
    days = end.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const daysInPrevMonth = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
      days += daysInPrevMonth;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // 종료일이 시작일보다 이전인 경우 음수로 표시
    if (endDate < startDate) {
      years = -years;
      months = -months;
      days = -days;
    }
  }

  return {
    totalDays: endDate < startDate ? -totalDays : totalDays,
    years,
    months,
    days,
    weeks: endDate < startDate ? -weeks : weeks,
    hours: endDate < startDate ? -hours : hours,
    minutes: endDate < startDate ? -minutes : minutes,
    seconds: endDate < startDate ? -seconds : seconds
  };
};

export const addDaysToDate = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addMonthsToDate = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const addYearsToDate = (date: Date, years: number): Date => {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
};

/**
 * 랜덤 관련 유틸리티
 */
export const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateRandomNumbers = (
  count: number,
  min: number,
  max: number,
  unique: boolean = true
): number[] => {
  const numbers: number[] = [];
  const maxPossible = max - min + 1;
  
  if (unique && count > maxPossible) {
    throw new Error('Cannot generate more unique numbers than the range allows');
  }

  while (numbers.length < count) {
    const num = generateRandomNumber(min, max);
    
    if (!unique || !numbers.includes(num)) {
      numbers.push(num);
    }
  }

  return numbers.sort((a, b) => a - b);
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * 비밀번호 생성 관련 유틸리티
 */
export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  similar: 'il1Lo0O',
  ambiguous: '{}[]()/\\\'"`~,;.<>'
};

export const generatePassword = (options: PasswordOptions): string => {
  let charset = '';
  
  if (options.includeUppercase) charset += CHAR_SETS.uppercase;
  if (options.includeLowercase) charset += CHAR_SETS.lowercase;
  if (options.includeNumbers) charset += CHAR_SETS.numbers;
  if (options.includeSymbols) charset += CHAR_SETS.symbols;
  
  if (options.excludeSimilar) {
    charset = charset.split('').filter(char => !CHAR_SETS.similar.includes(char)).join('');
  }
  
  if (options.excludeAmbiguous) {
    charset = charset.split('').filter(char => !CHAR_SETS.ambiguous.includes(char)).join('');
  }
  
  if (charset === '') {
    throw new Error('No character set selected');
  }
  
  let password = '';
  for (let i = 0; i < options.length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
};

export const calculatePasswordStrength = (password: string): {
  score: number;
  level: 'weak' | 'medium' | 'strong' | 'very-strong';
  feedback: string[];
} => {
  let score = 0;
  const feedback: string[] = [];
  
  // 길이 검사
  if (password.length >= 8) score += 1;
  else feedback.push('8자 이상 사용하세요');
  
  if (password.length >= 12) score += 1;
  else if (password.length >= 8) feedback.push('12자 이상 권장합니다');
  
  // 문자 종류 검사
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('소문자를 포함하세요');
  
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('대문자를 포함하세요');
  
  if (/\d/.test(password)) score += 1;
  else feedback.push('숫자를 포함하세요');
  
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push('특수문자를 포함하세요');
  
  // 패턴 검사
  if (!/(.)\1{2,}/.test(password)) score += 1;
  else feedback.push('반복되는 문자를 피하세요');
  
  // 레벨 결정
  let level: 'weak' | 'medium' | 'strong' | 'very-strong';
  if (score <= 2) level = 'weak';
  else if (score <= 4) level = 'medium';
  else if (score <= 6) level = 'strong';
  else level = 'very-strong';
  
  return { score, level, feedback };
};