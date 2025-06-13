import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
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
  Gauge
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
  sunrise: number;
  sunset: number;
}

export default function Weather() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchCity, setSearchCity] = useState('');
  const [error, setError] = useState('');

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
      const response = await fetch(`/api/weather/coordinates?lat=${lat}&lon=${lon}`);
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
      const response = await fetch(`/api/weather/city?q=${encodeURIComponent(city)}`);
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

                  {/* Sun Times */}
                  <div className="flex justify-center gap-8 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <Sunrise className="h-5 w-5 text-orange-500" />
                      <span className="text-sm">{t('weather.sunrise')}: {formatTime(weatherData.sunrise)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sunset className="h-5 w-5 text-orange-600" />
                      <span className="text-sm">{t('weather.sunset')}: {formatTime(weatherData.sunset)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 5-Day Forecast */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle>{t('weather.forecast.title')}</CardTitle>
                  <CardDescription>{t('weather.forecast.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {weatherData.forecast.map((day, index) => (
                      <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-sm font-medium mb-2">
                          {index === 0 ? t('weather.today') : formatDate(day.date)}
                        </div>
                        <div className="flex justify-center mb-2">
                          {getWeatherIcon(day.weather.icon)}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 capitalize">
                          {day.weather.description}
                        </div>
                        <div className="space-y-1">
                          <div className="text-lg font-semibold">{Math.round(day.temp_max)}°</div>
                          <div className="text-sm text-gray-500">{Math.round(day.temp_min)}°</div>
                        </div>
                      </div>
                    ))}
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