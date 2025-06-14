import { weatherCache, CacheKeys, CacheTTL, cacheUtils } from './cache';
import { isKoreanLocation, normalizeKoreanCity, getKoreanCityCoordinates } from './koreanLocationMap';

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

interface WeatherData {
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
        name: 'AccuWeather',
        priority: 1,
        dailyLimit: 50,
        baseUrl: 'https://dataservice.accuweather.com',
        apiKey: process.env.ACCUWEATHER_API_KEY || null
      },
      {
        name: 'OpenWeatherMap',
        priority: 2,
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
        if (provider.name === 'AccuWeather') {
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

  public getProviderStatus() {
    return this.providers.map(provider => ({
      name: provider.name,
      available: this.canUseProvider(provider.name),
      rateLimit: this.rateLimits.get(provider.name)
    }));
  }
}

export const weatherProviderManager = new WeatherProviderManager();