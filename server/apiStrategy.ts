// Intelligent API selection strategy for optimal weather data retrieval
import { isKoreanLocation } from './koreanLocationMap';

export type RequestType = 'current' | 'forecast' | 'air_quality' | 'warning' | 'uv_index' | 'historical' | 'extended_forecast';
export type WeatherAPI = 'WeatherAPI' | 'KMA_API' | 'OpenWeatherMap' | 'AccuWeather';

export const apiUsageStrategy = {
  WeatherAPI: { purpose: "메인 소스", cacheTTL: 30 }, // 30 minutes
  KMA: { purpose: "한국 지역", cacheTTL: 60 }, // 1 hour
  OpenWeatherMap: { purpose: "특수 데이터", cacheTTL: 120 }, // 2 hours
  AccuWeather: { purpose: "프리미엄만", cacheTTL: 240 } // 4 hours
};

export function selectWeatherAPI(location: string, requestType: RequestType, isPremiumUser: boolean = false): WeatherAPI[] {
  const apiPriority: WeatherAPI[] = [];
  
  // Korean location priority
  if (isKoreanLocation(location)) {
    if (requestType === 'air_quality' || requestType === 'warning') {
      apiPriority.push('KMA_API'); // Korean Meteorological Administration
    }
    
    // For Korean locations, prefer OpenWeatherMap due to coordinate accuracy
    apiPriority.push('OpenWeatherMap');
    apiPriority.push('AccuWeather');
    return apiPriority;
  }
  
  // General request routing
  switch (requestType) {
    case 'current':
    case 'forecast':
      apiPriority.push('WeatherAPI'); // Main source with 1M calls/month
      apiPriority.push('OpenWeatherMap');
      apiPriority.push('AccuWeather');
      break;
      
    case 'uv_index':
    case 'historical':
      apiPriority.push('OpenWeatherMap'); // Specialized features
      apiPriority.push('AccuWeather');
      break;
      
    case 'extended_forecast':
      if (isPremiumUser) {
        apiPriority.push('AccuWeather'); // 10+ day forecasts
      }
      apiPriority.push('WeatherAPI');
      apiPriority.push('OpenWeatherMap');
      break;
      
    case 'air_quality':
      apiPriority.push('OpenWeatherMap'); // Air pollution API
      apiPriority.push('AccuWeather');
      break;
      
    default:
      // Default fallback order
      apiPriority.push('OpenWeatherMap');
      apiPriority.push('AccuWeather');
  }
  
  return apiPriority;
}

export function getCacheTTL(apiName: WeatherAPI): number {
  switch (apiName) {
    case 'WeatherAPI': return 30; // minutes
    case 'KMA_API': return 60;
    case 'OpenWeatherMap': return 120;
    case 'AccuWeather': return 240;
    default: return 30;
  }
}

export function shouldUseCoordinates(location: string): boolean {
  // Use coordinates for Korean cities to avoid geocoding issues
  return isKoreanLocation(location);
}