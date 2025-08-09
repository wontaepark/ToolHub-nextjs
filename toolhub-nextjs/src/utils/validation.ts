/**
 * 공통 검증 유틸리티 함수들
 */

// URL 검증
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// YouTube URL 검증 및 비디오 ID 추출
export const extractYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

export const isValidYouTubeUrl = (url: string): boolean => {
  return extractYouTubeVideoId(url) !== null;
};

// 이메일 검증
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 전화번호 검증 (한국 형식)
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^01[0-9]-?\d{3,4}-?\d{4}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

// 날짜 검증
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString === date.toISOString().split('T')[0];
};

export const isDateInRange = (date: Date, minDate?: Date, maxDate?: Date): boolean => {
  if (minDate && date < minDate) return false;
  if (maxDate && date > maxDate) return false;
  return true;
};

// 숫자 검증
export const isValidNumber = (value: string): boolean => {
  return !isNaN(Number(value)) && isFinite(Number(value));
};

export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

export const isPositiveInteger = (value: string): boolean => {
  const num = parseInt(value, 10);
  return !isNaN(num) && num > 0 && num.toString() === value;
};

// 텍스트 검증
export const isNotEmpty = (text: string): boolean => {
  return text.trim().length > 0;
};

export const hasMinLength = (text: string, minLength: number): boolean => {
  return text.length >= minLength;
};

export const hasMaxLength = (text: string, maxLength: number): boolean => {
  return text.length <= maxLength;
};

export const containsOnly = (text: string, allowedChars: string): boolean => {
  const regex = new RegExp(`^[${allowedChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]*$`);
  return regex.test(text);
};

// 파일 검증
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const isValidFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

// 비밀번호 강도 검증
export const hasMinPasswordLength = (password: string): boolean => {
  return password.length >= 8;
};

export const hasUppercase = (password: string): boolean => {
  return /[A-Z]/.test(password);
};

export const hasLowercase = (password: string): boolean => {
  return /[a-z]/.test(password);
};

export const hasNumber = (password: string): boolean => {
  return /\d/.test(password);
};

export const hasSpecialChar = (password: string): boolean => {
  return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
};

export const hasNoRepeatingChars = (password: string): boolean => {
  return !/(.)\1{2,}/.test(password);
};

// 조합 검증 함수
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!hasMinPasswordLength(password)) {
    errors.push('비밀번호는 최소 8자 이상이어야 합니다');
  }
  
  if (!hasUppercase(password)) {
    errors.push('대문자를 최소 1개 포함해야 합니다');
  }
  
  if (!hasLowercase(password)) {
    errors.push('소문자를 최소 1개 포함해야 합니다');
  }
  
  if (!hasNumber(password)) {
    errors.push('숫자를 최소 1개 포함해야 합니다');
  }
  
  if (!hasSpecialChar(password)) {
    errors.push('특수문자를 최소 1개 포함해야 합니다');
  }
  
  if (!hasNoRepeatingChars(password)) {
    errors.push('3개 이상 연속된 동일한 문자는 사용할 수 없습니다');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!isNotEmpty(email)) {
    errors.push('이메일을 입력해주세요');
  } else if (!isValidEmail(email)) {
    errors.push('올바른 이메일 형식이 아닙니다');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePhoneNumber = (phone: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!isNotEmpty(phone)) {
    errors.push('전화번호를 입력해주세요');
  } else if (!isValidPhoneNumber(phone)) {
    errors.push('올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateDateRange = (startDate: string, endDate: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!isValidDate(startDate)) {
    errors.push('시작 날짜가 유효하지 않습니다');
  }
  
  if (!isValidDate(endDate)) {
    errors.push('종료 날짜가 유효하지 않습니다');
  }
  
  if (isValidDate(startDate) && isValidDate(endDate)) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      errors.push('시작 날짜는 종료 날짜보다 이전이어야 합니다');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateNumberRange = (
  value: string,
  min: number,
  max: number,
  fieldName: string = '값'
): ValidationResult => {
  const errors: string[] = [];
  
  if (!isValidNumber(value)) {
    errors.push(`${fieldName}은(는) 유효한 숫자여야 합니다`);
  } else {
    const num = Number(value);
    if (!isInRange(num, min, max)) {
      errors.push(`${fieldName}은(는) ${min}부터 ${max} 사이의 값이어야 합니다`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// 디바운스된 검증을 위한 유틸리티
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};