// Korean weather translation mappings
export const weatherTranslations = {
  ko: {
    // Weather conditions
    'Clear': '맑음',
    'Clouds': '흐림',
    'Rain': '비',
    'Snow': '눈',
    'Thunderstorm': '뇌우',
    'Drizzle': '이슬비',
    'Mist': '안개',
    'Fog': '짙은 안개',
    'Haze': '실안개',
    'Dust': '먼지',
    'Sand': '모래바람',
    'Ash': '화산재',
    'Squall': '스콜',
    'Tornado': '토네이도',
    
    // Detailed descriptions
    'clear sky': '맑음',
    'few clouds': '구름 조금',
    'scattered clouds': '구름 많음',
    'broken clouds': '흐림',
    'overcast clouds': '구름 많이 낀',
    'light rain': '가벼운 비',
    'moderate rain': '비',
    'heavy intensity rain': '강한 비',
    'very heavy rain': '매우 강한 비',
    'extreme rain': '극한 폭우',
    'freezing rain': '얼어붙는 비',
    'light intensity shower rain': '가벼운 소나기',
    'shower rain': '소나기',
    'heavy intensity shower rain': '강한 소나기',
    'ragged shower rain': '불규칙한 소나기',
    'light snow': '가벼운 눈',
    'snow': '눈',
    'heavy snow': '폭설',
    'sleet': '진눈깨비',
    'light shower sleet': '가벼운 진눈깨비',
    'shower sleet': '진눈깨비',
    'light rain and snow': '비와 눈',
    'rain and snow': '비와 눈',
    'light shower snow': '가벼운 눈보라',
    'shower snow': '눈보라',
    'heavy shower snow': '강한 눈보라',
    'mist': '안개',
    'smoke': '연기',
    'haze': '실안개',
    'sand/dust whirls': '모래/먼지 소용돌이',
    'fog': '짙은 안개',
    'sand': '모래바람',
    'dust': '먼지',
    'volcanic ash': '화산재',
    'squalls': '스콜',
    'tornado': '토네이도',
    'thunderstorm with light rain': '가벼운 비를 동반한 뇌우',
    'thunderstorm with rain': '비를 동반한 뇌우',
    'thunderstorm with heavy rain': '강한 비를 동반한 뇌우',
    'light thunderstorm': '가벼운 뇌우',
    'thunderstorm': '뇌우',
    'heavy thunderstorm': '강한 뇌우',
    'ragged thunderstorm': '불규칙한 뇌우',
    'thunderstorm with light drizzle': '가벼운 이슬비를 동반한 뇌우',
    'thunderstorm with drizzle': '이슬비를 동반한 뇌우',
    'thunderstorm with heavy drizzle': '강한 이슬비를 동반한 뇌우',
    'light intensity drizzle': '가벼운 이슬비',
    'drizzle': '이슬비',
    'heavy intensity drizzle': '강한 이슬비',
    'light intensity drizzle rain': '가벼운 이슬비',
    'drizzle rain': '이슬비',
    'heavy intensity drizzle rain': '강한 이슬비',
    'shower rain and drizzle': '소나기와 이슬비',
    'heavy shower rain and drizzle': '강한 소나기와 이슬비',
    'shower drizzle': '소나기성 이슬비',
    
    // Weather UI terms
    'Scattered Clouds': '구름 많음',
    'Few Clouds': '구름 조금',
    'Light Rain': '가벼운 비',
    'Today': '오늘',
    '5-Day Weather Forecast': '5일 날씨 예보',
    'Check the weather forecast for the next 5 days.': '향후 5일간의 날씨 예보를 확인하세요.',
    
    // Temperature and units
    '°C': '°C',
    '°F': '°F',
    'Temperature': '온도',
    'Feels like': '체감온도',
    'Humidity': '습도',
    'Pressure': '기압',
    'Wind': '바람',
    'Visibility': '가시거리',
    'UV Index': '자외선 지수',
    'Sunrise': '일출',
    'Sunset': '일몰'
  },
  
  en: {
    // Keep English as-is for reference
    'Clear': 'Clear',
    'Clouds': 'Clouds',
    'Rain': 'Rain',
    'Snow': 'Snow',
    'Thunderstorm': 'Thunderstorm',
    'Drizzle': 'Drizzle',
    'Mist': 'Mist',
    'Fog': 'Fog',
    'Scattered Clouds': 'Scattered Clouds',
    'Few Clouds': 'Few Clouds',
    'Light Rain': 'Light Rain',
    'Today': 'Today',
    '5-Day Weather Forecast': '5-Day Weather Forecast',
    'Check the weather forecast for the next 5 days.': 'Check the weather forecast for the next 5 days.'
  }
};

export function translateWeatherCondition(condition: string, targetLang: string = 'ko'): string {
  const translations = weatherTranslations[targetLang as keyof typeof weatherTranslations];
  if (!translations) return condition;
  
  // Try exact match first
  if (translations[condition as keyof typeof translations]) {
    return translations[condition as keyof typeof translations];
  }
  
  // Try case-insensitive match
  const lowerCondition = condition.toLowerCase();
  for (const [key, value] of Object.entries(translations)) {
    if (key.toLowerCase() === lowerCondition) {
      return value;
    }
  }
  
  return condition; // Return original if no translation found
}

export function translateWeatherData(weatherData: any, targetLang: string = 'ko'): any {
  if (targetLang === 'en' || !weatherData) return weatherData;
  
  const translated = { ...weatherData };
  
  // Translate current weather
  if (translated.current?.weather) {
    translated.current.weather = {
      ...translated.current.weather,
      main: translateWeatherCondition(translated.current.weather.main, targetLang),
      description: translateWeatherCondition(translated.current.weather.description, targetLang)
    };
  }
  
  // Translate forecast
  if (translated.forecast && Array.isArray(translated.forecast)) {
    translated.forecast = translated.forecast.map((day: any) => ({
      ...day,
      weather: {
        ...day.weather,
        main: translateWeatherCondition(day.weather.main, targetLang),
        description: translateWeatherCondition(day.weather.description, targetLang)
      }
    }));
  }
  
  return translated;
}