import { weatherCache, CacheKeys, CacheTTL, cacheUtils } from './cache';
import { isKoreanLocation, normalizeKoreanCity, getKoreanCityCoordinates } from './koreanLocationMap';
import { selectWeatherAPI, getCacheTTL, shouldUseCoordinates } from './apiStrategy';
import { WeatherVerification } from './crossVerification';

// Weather provider configuration
interface WeatherProvider {
  name: string;
  priority: number;
  dailyLimit: number;
  baseUrl: string;
  apiKey: string | null;
}

interface RateLimitInfo {
  used: number;
  limit: number;
  resetTime: number;
}

export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    visibility: number;
    uv_index: number;
    wind_speed: number;
    wind_deg: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    };
  };
  forecast: Array<{
    date: string;
    temp_max: number;
    temp_min: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    };
  }>;
  hourly?: Array<{
    time: string;
    temp: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    };
    pop: number; // probability of precipitation
  }>;
  sunrise: number;
  sunset: number;
  source?: string;
  cached_at?: number;
}

class WeatherProviderManager {
  private providers: WeatherProvider[] = [];
  private rateLimits: Map<string, RateLimitInfo> = new Map();

  constructor() {
    this.initializeProviders();
    this.loadRateLimits();
  }

  private initializeProviders() {
    // Initialize providers in priority order
    this.providers = [
      {
        name: 'KMA_API',
        priority: 1,
        dailyLimit: 2000,
        baseUrl: 'https://apihub.kma.go.kr/api/typ01/cgi-bin/url/nph-dfs_shrt_grd',
        apiKey: 'MYnN23N7SuiJzdtze3ro8Q'
      },
      {
        name: 'AccuWeather',
        priority: 2,
        dailyLimit: 50,
        baseUrl: 'https://dataservice.accuweather.com',
        apiKey: process.env.ACCUWEATHER_API_KEY || null
      },
      {
        name: 'OpenWeatherMap',
        priority: 3,
        dailyLimit: 1000,
        baseUrl: 'https://api.openweathermap.org',
        apiKey: process.env.OPENWEATHER_API_KEY || null
      }
    ].filter(provider => provider.apiKey); // Only include providers with valid API keys
  }

  private async loadRateLimits() {
    for (const provider of this.providers) {
      const cacheKey = CacheKeys.rateLimit(provider.name.toLowerCase());
      const cached = await weatherCache.get(cacheKey);
      
      if (cached) {
        this.rateLimits.set(provider.name, cached);
      } else {
        // Initialize rate limit tracking
        this.rateLimits.set(provider.name, {
          used: 0,
          limit: provider.dailyLimit,
          resetTime: this.getNextMidnight()
        });
      }
    }
  }

  private getNextMidnight(): number {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime();
  }

  private async updateRateLimit(providerName: string) {
    const rateLimit = this.rateLimits.get(providerName);
    if (!rateLimit) return;

    // Check if rate limit should reset
    if (Date.now() > rateLimit.resetTime) {
      rateLimit.used = 0;
      rateLimit.resetTime = this.getNextMidnight();
    }

    rateLimit.used++;
    this.rateLimits.set(providerName, rateLimit);

    // Save to cache
    const cacheKey = CacheKeys.rateLimit(providerName.toLowerCase());
    await weatherCache.set(cacheKey, rateLimit, CacheTTL.RATE_LIMIT);
  }

  private canUseProvider(providerName: string): boolean {
    const rateLimit = this.rateLimits.get(providerName);
    if (!rateLimit) return false;

    // Check if rate limit should reset
    if (Date.now() > rateLimit.resetTime) {
      rateLimit.used = 0;
      rateLimit.resetTime = this.getNextMidnight();
      this.rateLimits.set(providerName, rateLimit);
    }

    return rateLimit.used < rateLimit.limit;
  }

  private async callKMARadar(dateTime?: string): Promise<any> {
    const apiKey = process.env.KMA_API_KEY;
    if (!apiKey) {
      throw new Error('KMA API key not configured');
    }

    let formattedTime: string;
    
    try {
      if (dateTime) {
        // If dateTime is already in YYYYMMDDHHMM format, use it directly
        if (/^\d{12}$/.test(dateTime)) {
          formattedTime = dateTime;
        } else if (/^\d{14}$/.test(dateTime)) {
          // If it's YYYYMMDDHHMMSS format, truncate to YYYYMMDDHHMM
          formattedTime = dateTime.slice(0, 12);
        } else {
          // Try to parse as ISO string or construct from parts
          let targetTime: Date;
          
          if (dateTime.includes('-') || dateTime.includes('T')) {
            // ISO format
            targetTime = new Date(dateTime);
          } else if (/^\d{8}$/.test(dateTime)) {
            // YYYYMMDD format - add current hour/minute
            const year = parseInt(dateTime.slice(0, 4));
            const month = parseInt(dateTime.slice(4, 6)) - 1;
            const day = parseInt(dateTime.slice(6, 8));
            const now = new Date();
            targetTime = new Date(year, month, day, now.getHours(), now.getMinutes());
          } else {
            throw new Error('Unsupported date format');
          }
          
          if (isNaN(targetTime.getTime())) {
            throw new Error('Invalid date value');
          }
          
          formattedTime = targetTime.toISOString().replace(/[-:T]/g, '').slice(0, 12);
        }
      } else {
        // Use current time minus 1 hour if no dateTime provided
        const now = new Date();
        const targetTime = new Date(now.getTime() - 60 * 60 * 1000);
        formattedTime = targetTime.toISOString().replace(/[-:T]/g, '').slice(0, 12);
      }
    } catch (error) {
      console.error('Date parsing error:', error, 'dateTime:', dateTime);
      // Fallback to current time minus 1 hour
      const now = new Date();
      const fallbackTime = new Date(now.getTime() - 60 * 60 * 1000);
      formattedTime = fallbackTime.toISOString().replace(/[-:T]/g, '').slice(0, 12);
    }

    const radarUrl = `https://apihub.kma.go.kr/api/typ02/openApi/WthrRadarInfoService/getCompCappiQcdAll`;
    const params = new URLSearchParams({
      pageNo: '1',
      numOfRows: '1',
      dataType: 'JSON',
      dateTime: formattedTime,
      compType: 'CPP', // 합성 CAPPI
      dataTypeCd: 'CZ', // 반사도
      authKey: apiKey
    });

    // Try multiple recent times to find available radar data
    const timeAttempts = [formattedTime];
    
    // Generate additional timestamps going back in 10-minute intervals
    for (let i = 1; i <= 12; i++) {
      const pastTime = new Date();
      pastTime.setTime(pastTime.getTime() - (60 + i * 10) * 60 * 1000);
      const pastTimeFormatted = pastTime.toISOString().replace(/[-:T]/g, '').slice(0, 12);
      timeAttempts.push(pastTimeFormatted);
    }

    for (const timeToTry of timeAttempts) {
      try {
        const tryParams = new URLSearchParams({
          pageNo: '1',
          numOfRows: '1',
          dataType: 'JSON',
          dateTime: timeToTry,
          compType: 'CPP',
          dataTypeCd: 'CZ',
          authKey: apiKey
        });

        const response = await fetch(`${radarUrl}?${tryParams.toString()}`, {
          headers: {
            'User-Agent': 'ToolHub-Weather/1.0',
            'Accept': 'application/json'
          },
          timeout: 10000
        });

        if (!response.ok) {
          console.warn(`KMA Radar API HTTP error for ${timeToTry}: ${response.status}`);
          continue;
        }

        const data = await response.json();
        
        // Check if we got actual data
        if (data.response?.header?.resultCode === '00' && data.response?.body?.items?.item) {
          console.log(`KMA Radar data found for time: ${timeToTry}`);
          return data;
        } else {
          console.log(`No radar data for time: ${timeToTry}, trying earlier time...`);
          continue;
        }

      } catch (error) {
        console.warn(`Error trying time ${timeToTry}:`, error);
        continue;
      }
    }

    // If no data found for any time, return a structured "no data" response
    console.log('No radar data available for recent times');
    return {
      response: {
        header: {
          resultCode: '03',
          resultMsg: 'NO_DATA_AVAILABLE'
        }
      }
    };
  }

  private async callKMA(query: string, isCoordinate: boolean = false): Promise<WeatherData> {
    const provider = this.providers.find(p => p.name === 'KMA_API');
    if (!provider?.apiKey) throw new Error('KMA API key not available');

    // Get Korean location coordinates
    let lat: number, lon: number;
    let cityName = query;
    
    if (isCoordinate) {
      [lat, lon] = query.split(',').map(parseFloat);
      cityName = `${lat},${lon}`;
    } else {
      const koreanCity = normalizeKoreanCity(query);
      if (koreanCity) {
        lat = koreanCity.coords.lat;
        lon = koreanCity.coords.lon;
        cityName = koreanCity.en;
      } else {
        throw new Error('Location not supported by KMA API');
      }
    }

    // Get forecast times in KMA format
    const now = new Date();
    const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000)); // UTC+9
    const currentHour = koreaTime.getHours();
    
    // Calculate tmfc (forecast creation time) and tmef (forecast effective time)
    let tmfc, tmef;
    const dateStr = koreaTime.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Find the most recent forecast time (2, 5, 8, 11, 14, 17, 20, 23)
    const forecastHours = [2, 5, 8, 11, 14, 17, 20, 23];
    let fcHour = forecastHours.filter(h => h <= currentHour).pop() || 23;
    
    if (fcHour === 23 && currentHour < 2) {
      // Use previous day's 23:00 forecast
      const yesterday = new Date(koreaTime.getTime() - 24 * 60 * 60 * 1000);
      tmfc = yesterday.toISOString().slice(0, 10).replace(/-/g, '') + String(fcHour).padStart(2, '0');
    } else {
      tmfc = dateStr + String(fcHour).padStart(2, '0');
    }
    
    // Effective time is usually 1 hour after forecast time
    tmef = dateStr + String(Math.min(fcHour + 1, 23)).padStart(2, '0');

    try {
      // Use the KMA API hub endpoint with multiple variables
      const vars = 'TMP,SKY,PTY,REH,WSD,PCP'; // Temperature, Sky condition, Precipitation type, Humidity, Wind speed, Precipitation
      const url = `${provider.baseUrl}?tmfc=${tmfc}&tmef=${tmef}&vars=${vars}&authKey=${provider.apiKey}&lat=${lat}&lon=${lon}`;
      
      console.log('KMA API request for:', cityName, 'tmfc:', tmfc, 'tmef:', tmef, 'coords:', lat, lon);
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`KMA API request failed: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('KMA API response length:', responseText.length);
      
      // KMA API returns space-separated data, not JSON
      return this.parseKMAGridData(responseText, cityName, lat, lon);
    } catch (error) {
      console.error('KMA API call failed:', error);
      throw error;
    }
  }

  private convertToKMAGrid(lat: number, lon: number): { nx: number, ny: number } {
    // Korean Meteorological Administration grid conversion
    const RE = 6371.00877; // Earth radius
    const GRID = 5.0; // Grid spacing
    const SLAT1 = 30.0; // Standard latitude 1
    const SLAT2 = 60.0; // Standard latitude 2
    const OLON = 126.0; // Reference longitude
    const OLAT = 38.0; // Reference latitude
    const XO = 43; // X offset
    const YO = 136; // Y offset

    const DEGRAD = Math.PI / 180.0;
    const re = RE / GRID;
    const slat1 = SLAT1 * DEGRAD;
    const slat2 = SLAT2 * DEGRAD;
    const olon = OLON * DEGRAD;
    const olat = OLAT * DEGRAD;

    let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);

    let ra = Math.tan(Math.PI * 0.25 + (lat) * DEGRAD * 0.5);
    ra = re * sf / Math.pow(ra, sn);
    let theta = lon * DEGRAD - olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;

    const nx = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    const ny = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

    return { nx, ny };
  }

  private formatKMAData(items: any[], cityName: string, nx: number, ny: number): WeatherData {
    // KMA data formatting logic
    const currentTemp = items.find(item => item.category === 'TMP')?.fcstValue || 0;
    const humidity = items.find(item => item.category === 'REH')?.fcstValue || 0;
    const windSpeed = items.find(item => item.category === 'WSD')?.fcstValue || 0;
    const precipitation = items.find(item => item.category === 'PCP')?.fcstValue || '0';
    const skyCondition = items.find(item => item.category === 'SKY')?.fcstValue || '1';

    // Convert KMA sky condition to weather description
    let weatherMain = 'Clear';
    let weatherDescription = '맑음';
    if (skyCondition === '3') {
      weatherMain = 'Clouds';
      weatherDescription = '구름많음';
    } else if (skyCondition === '4') {
      weatherMain = 'Clouds';
      weatherDescription = '흐림';
    }

    if (precipitation !== '0' && precipitation !== '강수없음') {
      weatherMain = 'Rain';
      weatherDescription = '비';
    }

    return {
      location: {
        name: cityName,
        country: 'KR',
        lat: 37.5665, // Default to Seoul for grid coordinates
        lon: 126.978
      },
      current: {
        temp: parseFloat(currentTemp),
        feels_like: parseFloat(currentTemp),
        humidity: parseFloat(humidity),
        pressure: 1013, // Default value
        visibility: 10000,
        uv_index: 5,
        wind_speed: parseFloat(windSpeed),
        wind_deg: 0,
        weather: {
          main: weatherMain,
          description: weatherDescription,
          icon: this.getKMAWeatherIcon(skyCondition, precipitation)
        }
      },
      forecast: [],
      sunrise: Date.now() / 1000,
      sunset: Date.now() / 1000 + 12 * 3600,
      source: 'KMA_API'
    };
  }

  private parseKMAGridData(responseText: string, cityName: string, lat: number, lon: number): WeatherData {
    // KMA grid data is comma-separated values in a grid format
    const lines = responseText.trim().split('\n').filter(line => line.length > 0);
    
    // Extract valid temperature values (non -99.00)
    let validTemps: number[] = [];
    let gridSize = 0;
    
    for (const line of lines) {
      const values = line.split(',').map(val => parseFloat(val.trim()));
      gridSize = Math.max(gridSize, values.length);
      
      for (const val of values) {
        if (val > -90 && val < 50) { // Valid temperature range
          validTemps.push(val);
        }
      }
    }
    
    // Calculate average temperature from valid grid points
    let temperature = 20; // fallback
    if (validTemps.length > 0) {
      temperature = validTemps.reduce((sum, temp) => sum + temp, 0) / validTemps.length;
    }
    
    // Determine weather conditions based on temperature
    let weatherMain, weatherDescription, skyCondition;
    if (temperature > 25) {
      weatherMain = '맑음';
      weatherDescription = '맑고 따뜻함';
      skyCondition = '1';
    } else if (temperature > 15) {
      weatherMain = '구름 조금';
      weatherDescription = '구름 조금, 쾌적함';
      skyCondition = '3';
    } else {
      weatherMain = '흐림';
      weatherDescription = '흐리고 서늘함';
      skyCondition = '4';
    }
    
    return {
      location: {
        name: cityName,
        country: 'KR',
        lat: lat,
        lon: lon
      },
      current: {
        temp: Math.round(temperature * 10) / 10,
        feels_like: Math.round(temperature * 10) / 10,
        humidity: 65,
        pressure: 1013,
        visibility: 10000,
        uv_index: temperature > 20 ? 6 : 3,
        wind_speed: 2.5,
        wind_deg: 180,
        weather: {
          main: weatherMain,
          description: `${weatherDescription} (기상청)`,
          icon: this.getKMAWeatherIcon(skyCondition, '0')
        }
      },
      forecast: [],
      sunrise: Date.now() / 1000,
      sunset: Date.now() / 1000 + 12 * 3600,
      source: 'KMA_API'
    };
  }

  private getKMAWeatherIcon(skyCondition: string, precipitation: string): string {
    if (precipitation !== '0' && precipitation !== '강수없음') {
      return '10d'; // Rain icon
    }
    
    switch (skyCondition) {
      case '1': return '01d'; // Clear
      case '3': return '03d'; // Partly cloudy
      case '4': return '04d'; // Cloudy
      default: return '01d';
    }
  }

  private async callAccuWeather(query: string, isCoordinate: boolean = false): Promise<WeatherData> {
    const provider = this.providers.find(p => p.name === 'AccuWeather');
    if (!provider?.apiKey) throw new Error('AccuWeather API key not available');

    let locationKey: string;
    let locationData: any;

    // Get location key
    if (isCoordinate) {
      const [lat, lon] = query.split(',').map(Number);
      const locationUrl = `${provider.baseUrl}/locations/v1/cities/geoposition/search?apikey=${provider.apiKey}&q=${lat},${lon}&language=ko-kr`;
      const locationResponse = await fetch(locationUrl);
      
      if (!locationResponse.ok) {
        throw new Error(`AccuWeather location lookup failed: ${locationResponse.status}`);
      }
      
      locationData = await locationResponse.json();
      locationKey = locationData.Key;
    } else {
      // Korean location intelligence for AccuWeather
      if (isKoreanLocation(query)) {
        const koreanCity = normalizeKoreanCity(query);
        if (koreanCity) {
          // Use coordinates for Korean cities to ensure accuracy
          const locationUrl = `${provider.baseUrl}/locations/v1/cities/geoposition/search?apikey=${provider.apiKey}&q=${koreanCity.coords.lat},${koreanCity.coords.lon}&language=ko-kr`;
          console.log(`Using Korean city coordinates for AccuWeather ${query}: ${koreanCity.coords.lat}, ${koreanCity.coords.lon} -> ${koreanCity.en}`);
          const locationResponse = await fetch(locationUrl);
          
          if (!locationResponse.ok) {
            throw new Error(`AccuWeather location lookup failed: ${locationResponse.status}`);
          }
          
          locationData = await locationResponse.json();
          locationKey = locationData.Key;
        } else {
          throw new Error(`Korean city not found in database: ${query}`);
        }
      } else {
        // Standard city search for non-Korean locations
        const locationUrl = `${provider.baseUrl}/locations/v1/cities/search?apikey=${provider.apiKey}&q=${encodeURIComponent(query)}&language=ko-kr`;
        const locationResponse = await fetch(locationUrl);
        
        if (!locationResponse.ok) {
          throw new Error(`AccuWeather location search failed: ${locationResponse.status}`);
        }
        
        const locationResults = await locationResponse.json();
        if (!locationResults || locationResults.length === 0) {
          throw new Error('Location not found in AccuWeather');
        }
        
        locationData = locationResults[0];
        locationKey = locationData.Key;
      }
    }

    // Get current weather
    const currentUrl = `${provider.baseUrl}/currentconditions/v1/${locationKey}?apikey=${provider.apiKey}&details=true&language=ko-kr`;
    const currentResponse = await fetch(currentUrl);
    
    if (!currentResponse.ok) {
      throw new Error(`AccuWeather current conditions failed: ${currentResponse.status}`);
    }
    
    const currentData = await currentResponse.json();
    const current = currentData[0];

    // Get 5-day forecast
    const forecastUrl = `${provider.baseUrl}/forecasts/v1/daily/5day/${locationKey}?apikey=${provider.apiKey}&details=true&metric=true&language=ko-kr`;
    const forecastResponse = await fetch(forecastUrl);
    
    if (!forecastResponse.ok) {
      throw new Error(`AccuWeather forecast failed: ${forecastResponse.status}`);
    }
    
    const forecastData = await forecastResponse.json();

    // Convert to standard format
    return this.formatAccuWeatherData(locationData, current, forecastData);
  }

  private async callOpenWeatherMap(query: string, isCoordinate: boolean = false): Promise<WeatherData> {
    const provider = this.providers.find(p => p.name === 'OpenWeatherMap');
    if (!provider?.apiKey) throw new Error('OpenWeatherMap API key not available');

    let lat: number, lon: number, locationName: string;

    if (isCoordinate) {
      [lat, lon] = query.split(',').map(Number);
      locationName = 'Current Location';
    } else {
      // Korean location intelligence - use coordinates for accurate Korean cities
      if (isKoreanLocation(query)) {
        const koreanCity = normalizeKoreanCity(query);
        if (koreanCity) {
          lat = koreanCity.coords.lat;
          lon = koreanCity.coords.lon;
          locationName = koreanCity.en;
          console.log(`Using Korean city coordinates for ${query}: ${lat}, ${lon} -> ${locationName}`);
        } else {
          throw new Error(`Korean city not found in database: ${query}`);
        }
      } else {
        // Standard geocoding for non-Korean locations
        const geoUrl = `${provider.baseUrl}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${provider.apiKey}`;
        const geoResponse = await fetch(geoUrl);
        
        if (!geoResponse.ok) {
          throw new Error(`OpenWeatherMap geocoding failed: ${geoResponse.status}`);
        }
        
        const geoData = await geoResponse.json();
        if (!geoData || geoData.length === 0) {
          throw new Error('Location not found in OpenWeatherMap');
        }
        
        lat = geoData[0].lat;
        lon = geoData[0].lon;
        locationName = geoData[0].name;
      }
    }

    // Get current weather
    const weatherUrl = `${provider.baseUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${provider.apiKey}&units=metric`;
    const weatherResponse = await fetch(weatherUrl);
    
    if (!weatherResponse.ok) {
      throw new Error(`OpenWeatherMap weather failed: ${weatherResponse.status}`);
    }
    
    const weatherData = await weatherResponse.json();

    // Get 5-day forecast
    const forecastUrl = `${provider.baseUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${provider.apiKey}&units=metric`;
    const forecastResponse = await fetch(forecastUrl);
    
    if (!forecastResponse.ok) {
      throw new Error(`OpenWeatherMap forecast failed: ${forecastResponse.status}`);
    }
    
    const forecastData = await forecastResponse.json();

    return this.formatOpenWeatherMapData(weatherData, forecastData);
  }

  private formatAccuWeatherData(location: any, current: any, forecast: any): WeatherData {
    const getAccuWeatherIcon = (accuIcon: number): string => {
      const iconMap: { [key: number]: string } = {
        1: '01d', 2: '02d', 3: '02d', 4: '03d', 5: '03d', 6: '04d', 7: '04d', 8: '04d',
        11: '50d', 12: '09d', 13: '10d', 14: '10d', 15: '11d', 16: '11d', 17: '11d', 18: '09d',
        19: '13d', 20: '13d', 21: '13d', 22: '13d', 23: '13d', 24: '50d', 25: '13d',
        26: '09d', 29: '09d', 30: '01d', 31: '01d', 32: '02d', 33: '01n', 34: '02n',
        35: '03n', 36: '04n', 37: '50n', 38: '04n', 39: '09n', 40: '10n', 41: '11n',
        42: '11n', 43: '13n', 44: '13n'
      };
      return iconMap[accuIcon] || '01d';
    };

    const dailyForecasts = forecast.DailyForecasts.map((day: any) => ({
      date: new Date(day.Date).toISOString().split('T')[0],
      temp_max: day.Temperature.Maximum.Value,
      temp_min: day.Temperature.Minimum.Value,
      weather: {
        main: day.Day.IconPhrase,
        description: day.Day.ShortPhrase || day.Day.IconPhrase,
        icon: getAccuWeatherIcon(day.Day.Icon)
      }
    }));

    return {
      location: {
        name: location.LocalizedName,
        country: location.Country.ID,
        lat: location.GeoPosition.Latitude,
        lon: location.GeoPosition.Longitude
      },
      current: {
        temp: current.Temperature.Metric.Value,
        feels_like: current.RealFeelTemperature.Metric.Value,
        humidity: current.RelativeHumidity,
        pressure: current.Pressure.Metric.Value,
        visibility: current.Visibility.Metric.Value,
        uv_index: current.UVIndex || 0,
        wind_speed: current.Wind.Speed.Metric.Value / 3.6,
        wind_deg: current.Wind.Direction.Degrees,
        weather: {
          main: current.WeatherText,
          description: current.WeatherText,
          icon: getAccuWeatherIcon(current.WeatherIcon)
        }
      },
      forecast: dailyForecasts,
      sunrise: Date.now() / 1000 + 6 * 3600,
      sunset: Date.now() / 1000 + 18 * 3600,
      source: 'AccuWeather'
    };
  }

  private formatOpenWeatherMapData(weather: any, forecast: any): WeatherData {
    const dailyForecasts = [];
    const today = new Date().toDateString();
    
    for (let i = 0; i < forecast.list.length; i += 8) {
      const item = forecast.list[i];
      const date = new Date(item.dt * 1000);
      
      if (date.toDateString() !== today && dailyForecasts.length < 5) {
        dailyForecasts.push({
          date: date.toISOString().split('T')[0],
          temp_max: item.main.temp_max,
          temp_min: item.main.temp_min,
          weather: {
            main: item.weather[0].main,
            description: item.weather[0].description,
            icon: item.weather[0].icon
          }
        });
      }
    }

    return {
      location: {
        name: weather.name,
        country: weather.sys.country,
        lat: weather.coord.lat,
        lon: weather.coord.lon
      },
      current: {
        temp: weather.main.temp,
        feels_like: weather.main.feels_like,
        humidity: weather.main.humidity,
        pressure: weather.main.pressure,
        visibility: weather.visibility / 1000,
        uv_index: 0,
        wind_speed: weather.wind?.speed || 0,
        wind_deg: weather.wind?.deg || 0,
        weather: {
          main: weather.weather[0].main,
          description: weather.weather[0].description,
          icon: weather.weather[0].icon
        }
      },
      forecast: dailyForecasts,
      hourly: forecast.list.slice(0, 8).map((item: any) => ({
        time: new Date(item.dt * 1000).toISOString(),
        temp: item.main.temp,
        weather: {
          main: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon
        },
        pop: item.pop || 0
      })),
      sunrise: weather.sys.sunrise,
      sunset: weather.sys.sunset,
      source: 'OpenWeatherMap'
    };
  }

  public async getWeatherWithFallback(query: string, isCoordinate: boolean = false): Promise<WeatherData> {
    const cacheKey = isCoordinate ? 
      CacheKeys.coordinates(Number(query.split(',')[0]), Number(query.split(',')[1])) :
      CacheKeys.locationKey(query);

    // Check cache first
    const cached = await weatherCache.get(cacheKey);
    if (cached && cacheUtils.isFresh(cached, CacheTTL.CURRENT_WEATHER)) {
      console.log(`Returning cached weather data for: ${query}`);
      return cached;
    }

    // Try providers in priority order
    const availableProviders = this.providers
      .filter(p => this.canUseProvider(p.name))
      .sort((a, b) => a.priority - b.priority);

    for (const provider of availableProviders) {
      try {
        console.log(`Trying ${provider.name} for: ${query}`);
        
        let weatherData: WeatherData;
        if (provider.name === 'KMA_API') {
          weatherData = await this.callKMA(query, isCoordinate);
        } else if (provider.name === 'AccuWeather') {
          weatherData = await this.callAccuWeather(query, isCoordinate);
        } else if (provider.name === 'OpenWeatherMap') {
          weatherData = await this.callOpenWeatherMap(query, isCoordinate);
        } else {
          continue;
        }

        // Update rate limit
        await this.updateRateLimit(provider.name);

        // Cache the result
        const timestampedData = cacheUtils.withTimestamp(weatherData);
        await weatherCache.set(cacheKey, timestampedData, CacheTTL.CURRENT_WEATHER);
        await weatherCache.setStale(cacheKey, timestampedData);

        console.log(`${provider.name} weather data retrieved for: ${query}`);
        return weatherData;

      } catch (error) {
        console.log(`${provider.name} failed for ${query}:`, error);
        continue;
      }
    }

    // All providers failed, try stale cache
    const staleData = await weatherCache.getStale(cacheKey);
    if (staleData) {
      console.log(`Returning stale cached data for: ${query}`);
      staleData.source = 'stale_cache';
      return staleData;
    }

    throw new Error('All weather providers failed and no cached data available');
  }

  public async getRadarData(dateTime?: string): Promise<any> {
    try {
      return await this.callKMARadar(dateTime);
    } catch (error) {
      console.error('Error getting radar data:', error);
      throw error;
    }
  }

  public getProviderStatus() {
    return this.providers.map(provider => ({
      name: provider.name,
      available: this.canUseProvider(provider.name),
      rateLimit: this.rateLimits.get(provider.name)
    }));
  }
}

export const weatherProviderManager = new WeatherProviderManager();