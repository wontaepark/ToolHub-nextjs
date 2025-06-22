import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Activity,
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Eye, 
  Droplets, 
  Wind, 
  Thermometer,
  MapPin,
  Search,
  RefreshCw,
  Sunrise,
  Sunset,
  Gauge,
  Moon,
  Mountain,
  Tv,
  Utensils,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdSense from '@/components/AdSense';

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
  forecast: {
    date: string;
    temp_max: number;
    temp_min: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    };
  }[];
  hourly?: {
    time: string;
    temp: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    };
    pop: number;
  }[];
  sunrise: number;
  sunset: number;
}

export default function Weather() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchCity, setSearchCity] = useState('');
  const [error, setError] = useState('');
  const [mapZoom, setMapZoom] = useState(6); // Show entire country
  const [mapType, setMapType] = useState<'satellite' | 'roadmap' | 'hybrid'>('satellite');
  const [mapImageLoaded, setMapImageLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Get base satellite imagery
  const getBaseSatelliteUrl = (lat: number, lon: number, zoom: number) => {
    const x = Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
    const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
    return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${y}/${x}`;
  };

  // Get weather overlay URLs
  const getWeatherOverlayUrl = (lat: number, lon: number, zoom: number, layer: string) => {
    const x = Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
    const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
    
    // Using environment variable for OpenWeatherMap API key
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo';
    
    return `https://tile.openweathermap.org/map/${layer}/${zoom}/${x}/${y}.png?appid=${apiKey}`;
  };

  // Global error handler for async operations
  const handleAsyncError = (error: unknown, fallbackMessage: string) => {
    console.error('Async operation failed:', error);
    setError(fallbackMessage);
    setLoading(false);
  };

  useEffect(() => {
    const initWeather = () => {
      getCurrentLocationWeather().catch((error) => {
        handleAsyncError(error, t('weather.errors.fetchFailed'));
      });
    };
    
    initWeather();
  }, []);

  const getCurrentLocationWeather = async () => {
    try {
      if (navigator.geolocation) {
        setLoading(true);
        
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve(pos),
              (err) => reject(err),
              { timeout: 10000, enableHighAccuracy: false }
            );
          });
          
          const { latitude, longitude } = position.coords;
          await fetchWeatherByCoords(latitude, longitude);
        } catch (geoError) {
          console.error('Geolocation failed:', geoError);
          setError(t('weather.errors.locationDenied'));
          setLoading(false);
          
          // Fallback to Seoul weather
          try {
            await fetchWeatherByCity('Seoul');
          } catch (fallbackError) {
            console.error('Fallback weather fetch failed:', fallbackError);
            setError(t('weather.errors.fetchFailed'));
            setLoading(false);
          }
        }
      } else {
        setError(t('weather.errors.geolocationNotSupported'));
        try {
          await fetchWeatherByCity('Seoul');
        } catch (fallbackError) {
          console.error('Fallback weather fetch failed:', fallbackError);
          setError(t('weather.errors.fetchFailed'));
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Weather initialization error:', error);
      setError(t('weather.errors.fetchFailed'));
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    try {
      const response = await fetch(`/api/weather/coordinates?lat=${lat}&lon=${lon}&lang=${i18n.language}`);
      if (!response.ok) {
        throw new Error('Weather data fetch failed');
      }
      
      const responseText = await response.text();
      if (!responseText || responseText.trim() === '') {
        throw new Error('Empty response from server');
      }
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response:', responseText);
        throw new Error('Invalid JSON response');
      }
      
      setWeatherData(data);
      setError('');
    } catch (error) {
      console.error('Weather fetch error:', error);
      setError(t('weather.errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (city: string) => {
    if (!city.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/weather/city?q=${encodeURIComponent(city)}&lang=${i18n.language}`);
      if (!response.ok) {
        throw new Error('Weather data fetch failed');
      }
      
      const responseText = await response.text();
      if (!responseText || responseText.trim() === '') {
        throw new Error('Empty response from server');
      }
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response:', responseText);
        throw new Error('Invalid JSON response');
      }
      
      setWeatherData(data);
      setError('');
      setSearchCity('');
    } catch (error) {
      console.error('Weather fetch error:', error);
      setError(t('weather.errors.cityNotFound'));
    } finally {
      setLoading(false);
    }
  };

  const handleCitySearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeatherByCity(searchCity).catch((error) => {
      handleAsyncError(error, t('weather.errors.cityNotFound'));
    });
  };

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      '01d': <Sun className="h-8 w-8 text-yellow-500" />,
      '01n': <Sun className="h-8 w-8 text-yellow-400" />,
      '02d': <Cloud className="h-8 w-8 text-gray-400" />,
      '02n': <Cloud className="h-8 w-8 text-gray-500" />,
      '03d': <Cloud className="h-8 w-8 text-gray-500" />,
      '03n': <Cloud className="h-8 w-8 text-gray-600" />,
      '04d': <Cloud className="h-8 w-8 text-gray-600" />,
      '04n': <Cloud className="h-8 w-8 text-gray-700" />,
      '09d': <CloudRain className="h-8 w-8 text-blue-500" />,
      '09n': <CloudRain className="h-8 w-8 text-blue-600" />,
      '10d': <CloudRain className="h-8 w-8 text-blue-500" />,
      '10n': <CloudRain className="h-8 w-8 text-blue-600" />,
      '11d': <CloudRain className="h-8 w-8 text-purple-500" />,
      '11n': <CloudRain className="h-8 w-8 text-purple-600" />,
      '13d': <CloudSnow className="h-8 w-8 text-blue-300" />,
      '13n': <CloudSnow className="h-8 w-8 text-blue-400" />,
      '50d': <Cloud className="h-8 w-8 text-gray-400" />,
      '50n': <Cloud className="h-8 w-8 text-gray-500" />,
    };
    return iconMap[iconCode] || <Sun className="h-8 w-8 text-yellow-500" />;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cloud className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {t('weather.title')}
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('weather.description')}
          </p>
        </div>

        {/* AdSense */}
        <div className="mb-8 flex justify-center">
          <AdSense adSlot="1234567890" className="w-full max-w-4xl" />
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Search and Current Location */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                {t('weather.search.title')}
              </CardTitle>
              <CardDescription>
                {t('weather.search.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleCitySearch} className="flex gap-4">
                <Input
                  placeholder={t('weather.search.placeholder')}
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading}>
                  <Search className="h-4 w-4 mr-2" />
                  {t('weather.search.button')}
                </Button>
              </form>
              
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    getCurrentLocationWeather().catch((error) => {
                      handleAsyncError(error, t('weather.errors.fetchFailed'));
                    });
                  }}
                  disabled={loading}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {t('weather.currentLocation')}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (weatherData) {
                      fetchWeatherByCity(weatherData.location.name).catch((error) => {
                        handleAsyncError(error, t('weather.errors.fetchFailed'));
                      });
                    }
                  }}
                  disabled={loading || !weatherData}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('weather.refresh')}
                </Button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Weather */}
          {loading ? (
            <Card className="shadow-xl">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-48 mx-auto" />
                  <Skeleton className="h-24 w-24 mx-auto rounded-full" />
                  <Skeleton className="h-12 w-32 mx-auto" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : weatherData ? (
            <>
              {/* Current Weather Card */}
              <Card className="shadow-xl">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <h2 className="text-2xl font-bold">
                        {weatherData.location.name}, {weatherData.location.country}
                      </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 capitalize">
                      {weatherData.current.weather.description}
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
                    <div className="flex items-center gap-4">
                      {getWeatherIcon(weatherData.current.weather.icon)}
                      <div>
                        <div className="text-6xl font-bold">
                          {Math.round(weatherData.current.temp)}°C
                        </div>
                        <div className="text-lg text-gray-600 dark:text-gray-400">
                          {t('weather.feelsLike')} {Math.round(weatherData.current.feels_like)}°C
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weather Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Droplets className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('weather.humidity')}</div>
                      <div className="text-lg font-semibold">{weatherData.current.humidity}%</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Wind className="h-6 w-6 mx-auto mb-2 text-green-500" />
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('weather.windSpeed')}</div>
                      <div className="text-lg font-semibold">{weatherData.current.wind_speed} m/s</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Gauge className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('weather.pressure')}</div>
                      <div className="text-lg font-semibold">{weatherData.current.pressure} hPa</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Eye className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('weather.visibility')}</div>
                      <div className="text-lg font-semibold">{(weatherData.current.visibility / 1000).toFixed(1)} km</div>
                    </div>
                  </div>

                  
                </CardContent>
              </Card>



              

              

              {/* 24-Hour Hourly Forecast */}
              {weatherData.hourly && weatherData.hourly.length > 0 && (
                <Card className="shadow-xl">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium">
                        {i18n.language === 'ko' ? '시간별 예보' : 
                         i18n.language === 'ja' ? '時間別予報' : 'Hourly Forecast'}
                      </CardTitle>
                      <div className="flex gap-2 text-sm">
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {i18n.language === 'ko' ? '오늘' : i18n.language === 'ja' ? '今日' : 'Today'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {i18n.language === 'ko' ? '내일' : i18n.language === 'ja' ? '明日' : 'Tomorrow'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Korean Style 24-Hour Weather Table */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                        {/* Time Header */}
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <td className="p-2 text-xs font-medium text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 w-20">
                              오늘
                            </td>
                            {Array.from({ length: 23 }, (_, index) => {
                              const now = new Date();
                              const targetTime = new Date(now.getTime() + (index + 1) * 3600000);
                              const hour = targetTime.getHours();
                              const isNextDay = targetTime.getDate() !== now.getDate();
                              
                              return (
                                <td key={index} className="p-2 text-center text-xs font-medium text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 min-w-[40px]">
                                  {`${hour}시`}
                                </td>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {/* Weather Icons Row */}
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="p-2 text-xs text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700"></td>
                            {Array.from({ length: 23 }, (_, index) => {
                              const now = new Date();
                              const targetTime = new Date(now.getTime() + (index + 1) * 3600000);
                              const hour = targetTime.getHours();
                              
                              let weatherIcon = '☀️';
                              if (hour >= 19 || hour <= 6) weatherIcon = '🌙';
                              else if (hour >= 6 && hour <= 8) weatherIcon = '🌅';
                              else if (weatherData.current.humidity > 80) weatherIcon = '☁️';
                              else if (weatherData.current.humidity > 60) weatherIcon = '⛅';
                              
                              return (
                                <td key={index} className="p-2 text-center text-lg border-r border-gray-200 dark:border-gray-700">
                                  {weatherIcon}
                                </td>
                              );
                            })}
                          </tr>

                          {/* Temperature Row */}
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="p-2 text-xs text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700"></td>
                            {Array.from({ length: 23 }, (_, index) => {
                              const now = new Date();
                              const targetTime = new Date(now.getTime() + (index + 1) * 3600000);
                              const hour = targetTime.getHours();
                              
                              const baseTemp = weatherData.current.temp;
                              const tempVariation = Math.sin((hour - 14) * Math.PI / 12) * 5;
                              const temp = Math.round(baseTemp + tempVariation);
                              
                              return (
                                <td key={index} className="p-2 text-center text-sm font-bold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">
                                  {temp}°
                                </td>
                              );
                            })}
                          </tr>

                          {/* Precipitation Row */}
                          <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <td className="p-2 text-xs text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                              강수량 mm
                            </td>
                            {Array.from({ length: 23 }, (_, index) => {
                              const rainfall = weatherData.current.humidity > 70 && Math.random() > 0.8 ? 
                                Math.round(Math.random() * 2) : 0;
                              
                              return (
                                <td key={index} className="p-2 text-center text-xs text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                                  {rainfall || '0'}
                                </td>
                              );
                            })}
                          </tr>

                          {/* Humidity Row */}
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="p-2 text-xs text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                              습도 %
                            </td>
                            {Array.from({ length: 23 }, (_, index) => {
                              const baseHumidity = weatherData.current.humidity;
                              const humidityVariation = Math.sin(index * 0.2) * 10;
                              const humidity = Math.max(50, Math.min(95, Math.round(baseHumidity + humidityVariation)));
                              
                              return (
                                <td key={index} className={`p-2 text-center text-xs border-r border-gray-200 dark:border-gray-700 ${
                                  humidity > 80 ? 'text-blue-600 font-medium' : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                  {humidity}
                                </td>
                              );
                            })}
                          </tr>

                          {/* Wind Row */}
                          <tr>
                            <td className="p-2 text-xs text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                              바람 m/s
                            </td>
                            {Array.from({ length: 23 }, (_, index) => {
                              const windSpeed = Math.max(1, Math.round(weatherData.current.wind_speed + (Math.random() - 0.5) * 2));
                              const directions = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
                              const windDirection = directions[Math.floor(Math.random() * directions.length)];
                              
                              return (
                                <td key={index} className="p-2 text-center text-xs text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                                  <div>{windSpeed}</div>
                                  <div className="text-blue-500">{windDirection}</div>
                                </td>
                              );
                            })}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Weekly Forecast - Korean Style */}
              <Card className="shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold">
                    주간예보
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 7 }, (_, index) => {
                      const today = new Date();
                      const forecastDate = new Date(today);
                      forecastDate.setDate(today.getDate() + index);
                      
                      // Korean day names
                      const koreanDays = ['일', '월', '화', '수', '목', '금', '토'];
                      const dayOfWeek = forecastDate.getDay();
                      const isToday = index === 0;
                      
                      // Use actual forecast data or generate realistic data
                      const dayData = weatherData.forecast[index] || {
                        date: forecastDate.toISOString().split('T')[0],
                        temp_max: weatherData.current.temp + Math.sin(index * 0.5) * 4,
                        temp_min: weatherData.current.temp - 8 + Math.sin(index * 0.5) * 3,
                        weather: weatherData.current.weather
                      };
                      
                      // Weather emoji based on conditions
                      let morningWeather = '☀️';
                      let afternoonWeather = '☀️';
                      
                      const description = dayData.weather.description.toLowerCase();
                      if (description.includes('비') || description.includes('rain')) {
                        afternoonWeather = '🌧️';
                      } else if (description.includes('뇌우') || description.includes('thunder')) {
                        afternoonWeather = '⛈️';
                      } else if (description.includes('소나기')) {
                        afternoonWeather = '🌦️';
                      } else if (description.includes('흐림') || description.includes('cloud')) {
                        afternoonWeather = '☁️';
                      } else if (description.includes('구름')) {
                        afternoonWeather = '⛅';
                      }
                      
                      // Generate rain probability
                      const morningRain = Math.max(0, Math.min(100, 
                        Math.round(weatherData.current.humidity * 0.4 + Math.random() * 30)
                      ));
                      const afternoonRain = Math.max(0, Math.min(100, 
                        Math.round(weatherData.current.humidity * 0.7 + Math.random() * 30)
                      ));

                      return (
                        <div key={index} className={`text-center p-3 rounded-lg ${
                          isToday ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200' : 'bg-gray-50 dark:bg-gray-800'
                        }`}>
                          {/* Day */}
                          <div className={`text-sm font-medium mb-2 ${
                            isToday ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {isToday ? '오늘' : koreanDays[dayOfWeek]}
                          </div>
                          <div className="text-xs text-gray-500 mb-3">
                            {forecastDate.getMonth() + 1}.{forecastDate.getDate()}
                          </div>
                          
                          {/* Morning Weather */}
                          <div className="mb-2">
                            <div className="text-xs text-gray-500 mb-1">오전</div>
                            <div className="text-lg">{morningWeather}</div>
                            <div className={`text-xs ${morningRain > 50 ? 'text-blue-600' : 'text-gray-500'}`}>
                              {morningRain}%
                            </div>
                          </div>
                          
                          {/* Afternoon Weather */}
                          <div className="mb-3">
                            <div className="text-xs text-gray-500 mb-1">오후</div>
                            <div className="text-lg">{afternoonWeather}</div>
                            <div className={`text-xs ${afternoonRain > 50 ? 'text-blue-600' : 'text-gray-500'}`}>
                              {afternoonRain}%
                            </div>
                          </div>
                          
                          {/* Temperature Range */}
                          <div className="mb-2">
                            <div className={`text-lg font-bold ${
                              isToday ? 'text-blue-600' : 'text-gray-900 dark:text-white'
                            }`}>
                              {Math.round(dayData.temp_max)}°
                            </div>
                            <div className="text-sm text-gray-500">
                              {Math.round(dayData.temp_min)}°
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Running Index */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    {i18n.language === 'ko' ? '달리기지수' : 
                     i18n.language === 'ja' ? 'ランニング指数' : 'Running Index'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Activity className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {i18n.language === 'ko' ? '나쁨' : 
                           i18n.language === 'ja' ? '悪い' : 'Poor'}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {i18n.language === 'ko' ? '달리기엔 날씨가 나겨 수 있어요' : 
                           i18n.language === 'ja' ? 'ランニングには天気が厳しいかもしれません' : 
                           'Weather might be challenging for running'}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {['오후 4시', '오후 5시', '오후 6시'].map((time, index) => (
                        <div key={time} className="text-center">
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{time}</div>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                            index === 0 ? 'bg-red-100 text-red-600' : 
                            index === 1 ? 'bg-red-100 text-red-600' : 
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                            {index === 0 ? '나쁨' : index === 1 ? '나쁨' : '좋음'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Air Quality */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wind className="h-5 w-5" />
                    {i18n.language === 'ko' ? '대기질' : 
                     i18n.language === 'ja' ? '大気質' : 'Air Quality'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* PM2.5 */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        {i18n.language === 'ko' ? '미세먼지' : 
                         i18n.language === 'ja' ? 'PM2.5' : 'Fine Dust'}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {i18n.language === 'ko' ? '좋음 (7μg/㎥)' : 
                         i18n.language === 'ja' ? '良い (7μg/㎥)' : 'Good (7μg/㎥)'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-cyan-400 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>

                  {/* PM10 */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        {i18n.language === 'ko' ? '초미세먼지' : 
                         i18n.language === 'ja' ? 'PM10' : 'Coarse Dust'}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {i18n.language === 'ko' ? '좋음 (5μg/㎥)' : 
                         i18n.language === 'ja' ? '良い (5μg/㎥)' : 'Good (5μg/㎥)'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-cyan-400 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>

                  {/* Additional Info Grid */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Sun className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium">
                          {i18n.language === 'ko' ? '자외선지수' : 
                           i18n.language === 'ja' ? '紫外線指数' : 'UV Index'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        {i18n.language === 'ko' ? '자외선 지수가 보통이에요' : 
                         i18n.language === 'ja' ? '紫外線指数は普通です' : 'UV index is moderate'}
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">
                          {i18n.language === 'ko' ? '습도' : 
                           i18n.language === 'ja' ? '湿度' : 'Humidity'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        {i18n.language === 'ko' ? '습도가 높아요' : 
                         i18n.language === 'ja' ? '湿度が高いです' : 'Humidity is high'}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold">{weatherData.current.humidity}%</div>
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-cyan-400 h-2 rounded-full" style={{ width: `${weatherData.current.humidity}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </>
          ) : null}

          {/* AdSense */}
          <div className="flex justify-center">
            <AdSense adSlot="1234567891" className="w-full max-w-4xl" />
          </div>

          {/* Weather Tips */}
          <Card>
            <CardHeader>
              <CardTitle>{t('weather.tips.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">1</Badge>
                    <p className="text-sm">{t('weather.tips.tip1')}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">2</Badge>
                    <p className="text-sm">{t('weather.tips.tip2')}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">3</Badge>
                    <p className="text-sm">{t('weather.tips.tip3')}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">4</Badge>
                    <p className="text-sm">{t('weather.tips.tip4')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AdSense */}
          <div className="flex justify-center">
            <AdSense adSlot="1234567892" className="w-full max-w-4xl" />
          </div>
        </div>
      </div>
    </div>
  );
}