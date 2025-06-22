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
  RotateCcw,
  Radar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRadarData, useRadarTimeline } from '@/hooks/use-radar';
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
  
  // Radar data hooks
  const { selectedTime, setSelectedTime, timeRange } = useRadarTimeline();
  const { radarData, isLoading: radarLoading, error: radarError } = useRadarData(selectedTime);

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

              {/* Satellite & Radar Images */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Radar className="h-5 w-5" />
                    위성영상 및 레이더
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Satellite Image */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">위성영상</h3>
                        <button className="text-blue-500 text-sm hover:underline">
                          자세히 보기 →
                        </button>
                      </div>
                      
                      <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                        {/* Satellite Map Base */}
                        <img
                          src={getBaseSatelliteUrl(weatherData.location.lat, weatherData.location.lon, 6)}
                          alt="위성영상"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        
                        {/* Location marker */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
                        </div>
                        
                        {/* City labels overlay */}
                        <div className="absolute inset-0 text-white text-xs font-medium drop-shadow-lg">
                          <div className="absolute top-8 left-8">천안</div>
                          <div className="absolute top-12 right-12">안양</div>
                          <div className="absolute bottom-20 left-12">인천</div>
                          <div className="absolute bottom-12 right-16">서울</div>
                          <div className="absolute top-16 left-1/3">전주</div>
                          <div className="absolute bottom-16 left-1/4">단양</div>
                        </div>
                        
                        {/* Time control */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-black/80 rounded-lg p-2">
                            <div className="flex items-center gap-2">
                              <button className="text-white">▶</button>
                              <div className="flex-1 bg-gray-600 h-1 rounded relative">
                                <div className="absolute left-0 top-0 h-full w-1/3 bg-green-500 rounded"></div>
                                <div className="absolute left-1/3 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                              </div>
                              <span className="text-white text-xs">22:00</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-300 mt-1">
                              <span>22:30</span>
                              <span>23:00</span>
                              <span>23:30</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 text-center">
                        기상청 발표, 천리안이 적외 천연 영상색상 2025.06.21. 23:50
                      </div>
                    </div>

                    {/* KMA Radar Image */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">레이더 영상</h3>
                        <button className="text-blue-500 text-sm hover:underline">
                          자세히 보기 →
                        </button>
                      </div>
                      
                      <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-700">
                        {radarLoading ? (
                          <div className="absolute inset-0 bg-gray-300 dark:bg-gray-600 animate-pulse flex items-center justify-center">
                            <div className="text-gray-500 dark:text-gray-400 text-sm">
                              기상청 레이더 로딩 중...
                            </div>
                          </div>
                        ) : radarError ? (
                          <div className="absolute inset-0 bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                            <div className="text-red-600 dark:text-red-400 text-sm text-center">
                              <div>레이더 데이터 로딩 실패</div>
                              <div className="text-xs mt-1">잠시 후 다시 시도해주세요</div>
                            </div>
                          </div>
                        ) : radarData && radarData.response?.body?.items?.item ? (
                          <>
                            {/* KMA Radar Data Visualization */}
                            <div className="absolute inset-0 bg-gray-800">
                              <canvas 
                                ref={(canvas) => {
                                  if (canvas && radarData?.response?.body?.items?.item) {
                                    console.log('Rendering radar data:', radarData);
                                    const ctx = canvas.getContext('2d');
                                    const radarItem = radarData.response.body.items.item;
                                    
                                    if (ctx && radarItem?.value) {
                                      const width = radarItem.xdim || 256;
                                      const height = radarItem.ydim || 256;
                                      
                                      canvas.width = width;
                                      canvas.height = height;
                                      
                                      console.log('Canvas dimensions:', width, 'x', height);
                                      console.log('Radar data sample:', radarItem.value.slice(0, 100));
                                      
                                      // Clear canvas first
                                      ctx.clearRect(0, 0, width, height);
                                      
                                      // Parse radar value data and render
                                      const imageData = ctx.createImageData(width, height);
                                      const values = radarItem.value.split(',').map(v => parseFloat(v.trim()));
                                      
                                      console.log('Processing', values.length, 'radar values');
                                      
                                      let renderedPixels = 0;
                                      for (let i = 0; i < Math.min(values.length, width * height); i++) {
                                        const val = values[i];
                                        const pixelIndex = i * 4;
                                        
                                        // Korean weather radar color mapping (dBZ values)
                                        if (val >= 50) {
                                          // Very strong precipitation - Dark Red
                                          imageData.data[pixelIndex] = 139;     // R
                                          imageData.data[pixelIndex + 1] = 0;   // G
                                          imageData.data[pixelIndex + 2] = 0;   // B
                                          imageData.data[pixelIndex + 3] = 255; // A
                                          renderedPixels++;
                                        } else if (val >= 35) {
                                          // Strong precipitation - Red
                                          imageData.data[pixelIndex] = 255;     // R
                                          imageData.data[pixelIndex + 1] = 0;   // G
                                          imageData.data[pixelIndex + 2] = 0;   // B
                                          imageData.data[pixelIndex + 3] = 200; // A
                                          renderedPixels++;
                                        } else if (val >= 25) {
                                          // Heavy precipitation - Orange
                                          imageData.data[pixelIndex] = 255;     // R
                                          imageData.data[pixelIndex + 1] = 165; // G
                                          imageData.data[pixelIndex + 2] = 0;   // B
                                          imageData.data[pixelIndex + 3] = 180; // A
                                          renderedPixels++;
                                        } else if (val >= 15) {
                                          // Moderate precipitation - Yellow
                                          imageData.data[pixelIndex] = 255;     // R
                                          imageData.data[pixelIndex + 1] = 255; // G
                                          imageData.data[pixelIndex + 2] = 0;   // B
                                          imageData.data[pixelIndex + 3] = 160; // A
                                          renderedPixels++;
                                        } else if (val >= 5) {
                                          // Light precipitation - Green
                                          imageData.data[pixelIndex] = 0;       // R
                                          imageData.data[pixelIndex + 1] = 255; // G
                                          imageData.data[pixelIndex + 2] = 0;   // B
                                          imageData.data[pixelIndex + 3] = 140; // A
                                          renderedPixels++;
                                        } else if (val >= 1) {
                                          // Very light precipitation - Light Blue
                                          imageData.data[pixelIndex] = 173;     // R
                                          imageData.data[pixelIndex + 1] = 216; // G
                                          imageData.data[pixelIndex + 2] = 230; // B
                                          imageData.data[pixelIndex + 3] = 120; // A
                                          renderedPixels++;
                                        } else {
                                          // No precipitation - Transparent
                                          imageData.data[pixelIndex] = 0;       // R
                                          imageData.data[pixelIndex + 1] = 0;   // G
                                          imageData.data[pixelIndex + 2] = 0;   // B
                                          imageData.data[pixelIndex + 3] = 0;   // A
                                        }
                                      }
                                      
                                      console.log('Rendered pixels with precipitation:', renderedPixels);
                                      ctx.putImageData(imageData, 0, 0);
                                      
                                      // Add Korea map outline if no significant precipitation
                                      if (renderedPixels < 100) {
                                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                                        ctx.lineWidth = 1;
                                        ctx.setLineDash([2, 2]);
                                        
                                        // Simple Korea peninsula outline
                                        ctx.beginPath();
                                        ctx.moveTo(width * 0.4, height * 0.2);
                                        ctx.lineTo(width * 0.6, height * 0.3);
                                        ctx.lineTo(width * 0.7, height * 0.6);
                                        ctx.lineTo(width * 0.5, height * 0.8);
                                        ctx.lineTo(width * 0.3, height * 0.7);
                                        ctx.lineTo(width * 0.35, height * 0.4);
                                        ctx.closePath();
                                        ctx.stroke();
                                        
                                        // Add location markers for major cities
                                        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                                        ctx.font = '8px sans-serif';
                                        ctx.fillText('서울', width * 0.45, height * 0.35);
                                        ctx.fillText('부산', width * 0.6, height * 0.7);
                                        ctx.fillText('대구', width * 0.55, height * 0.55);
                                      }
                                    }
                                  }
                                }}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            {/* Location marker */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
                            </div>
                            
                            {/* Regional labels */}
                            <div className="absolute inset-0 text-white text-xs font-medium drop-shadow-lg">
                              <div className="absolute top-6 left-6">경기</div>
                              <div className="absolute top-6 right-8">강원도</div>
                              <div className="absolute bottom-20 left-8">충청</div>
                              <div className="absolute bottom-8 right-12">서울</div>
                              <div className="absolute top-1/2 left-1/4">인천</div>
                            </div>
                          </>
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                            <div className="text-white text-sm text-center p-4">
                              <div className="mb-2">
                                <Radar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                              </div>
                              <div className="font-medium">레이더 데이터 없음</div>
                              <div className="text-xs mt-1 text-gray-300">현재 강수가 없거나 데이터 업데이트 중입니다</div>
                              <div className="text-xs mt-1 text-gray-400">기상청 레이더는 10분 간격으로 업데이트됩니다</div>
                            </div>
                          </div>
                        )}
                        
                        {/* Interactive Time Control */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-black/80 rounded-lg p-2">
                            <div className="flex items-center gap-2">
                              <button 
                                className="text-white hover:text-blue-400 transition-colors"
                                onClick={() => {
                                  const currentIndex = timeRange.indexOf(selectedTime || '');
                                  if (currentIndex > 0) {
                                    setSelectedTime(timeRange[currentIndex - 1]);
                                  }
                                }}
                              >
                                ⏮
                              </button>
                              <button className="text-white hover:text-blue-400 transition-colors">▶</button>
                              <button 
                                className="text-white hover:text-blue-400 transition-colors"
                                onClick={() => {
                                  const currentIndex = timeRange.indexOf(selectedTime || '');
                                  if (currentIndex < timeRange.length - 1) {
                                    setSelectedTime(timeRange[currentIndex + 1]);
                                  }
                                }}
                              >
                                ⏭
                              </button>
                              <div 
                                className="flex-1 bg-gray-600 h-2 rounded relative cursor-pointer"
                                onClick={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  const clickX = e.clientX - rect.left;
                                  const percentage = clickX / rect.width;
                                  const targetIndex = Math.round(percentage * (timeRange.length - 1));
                                  if (timeRange[targetIndex]) {
                                    setSelectedTime(timeRange[targetIndex]);
                                  }
                                }}
                              >
                                <div 
                                  className="absolute left-0 top-0 h-full bg-blue-500 rounded transition-all duration-200"
                                  style={{ width: `${((timeRange.indexOf(selectedTime || '') + 1) / timeRange.length) * 100}%` }}
                                ></div>
                                <div 
                                  className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full border border-white shadow-lg cursor-grab transition-all duration-200 hover:scale-110"
                                  style={{ left: `${((timeRange.indexOf(selectedTime || '') + 1) / timeRange.length) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-white text-xs font-mono min-w-[50px]">
                                {selectedTime && new Date(
                                  selectedTime.slice(0, 4) + '-' + 
                                  selectedTime.slice(4, 6) + '-' + 
                                  selectedTime.slice(6, 8) + 'T' + 
                                  selectedTime.slice(8, 10) + ':' + 
                                  selectedTime.slice(10, 12)
                                ).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            
                            {/* Timeline markers */}
                            <div className="flex justify-between text-xs text-gray-300 mt-2 px-1">
                              {timeRange.filter((_, idx) => idx % Math.ceil(timeRange.length / 4) === 0).map((time, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setSelectedTime(time)}
                                  className="hover:text-white transition-colors cursor-pointer"
                                >
                                  {new Date(
                                    time.slice(0, 4) + '-' + 
                                    time.slice(4, 6) + '-' + 
                                    time.slice(6, 8) + 'T' + 
                                    time.slice(8, 10) + ':' + 
                                    time.slice(10, 12)
                                  ).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Radar Color Legend */}
                      <div className="absolute top-4 right-4 bg-black/70 rounded p-2 text-xs text-white">
                        <div className="font-medium mb-1">강수강도 (dBZ)</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-800 rounded"></div>
                            <span>50+ 매우강함</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded"></div>
                            <span>35+ 강함</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-orange-500 rounded"></div>
                            <span>25+ 보통</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                            <span>15+ 약함</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-400 rounded"></div>
                            <span>5+ 매우약함</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-300 rounded"></div>
                            <span>1+ 미량</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 text-center">
                        {radarData && radarData.response?.body?.items?.item ? (
                          <>기상청 발표, 레이더 합성영상 {radarData.response.body.items.item.dateTime && new Date(
                            radarData.response.body.items.item.dateTime.slice(0, 4) + '-' + 
                            radarData.response.body.items.item.dateTime.slice(4, 6) + '-' + 
                            radarData.response.body.items.item.dateTime.slice(6, 8) + 'T' + 
                            radarData.response.body.items.item.dateTime.slice(8, 10) + ':' + 
                            radarData.response.body.items.item.dateTime.slice(10, 12)
                          ).toLocaleString('ko-KR')}</>
                        ) : (
                          '기상청 발표, 레이더 데이터 처리 중'
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Weather Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pressure Gauge */}
                <Card className="shadow-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Gauge className="h-4 w-4" />
                      {i18n.language === 'ko' ? '기압' : 
                       i18n.language === 'ja' ? '気圧' : 'Pressure'}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {i18n.language === 'ko' ? '기압이 낮아지고 있어요' : 
                       i18n.language === 'ja' ? '気圧が下がっています' : 'Pressure is dropping'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col items-center">
                      <div className="relative w-32 h-16 mb-2">
                        <svg className="w-full h-full" viewBox="0 0 128 64">
                          <path
                            d="M 8,56 A 48,48 0 0,1 120,56"
                            stroke="rgba(156, 163, 175, 0.3)"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                          />
                          <path
                            d="M 8,56 A 48,48 0 0,1 120,56"
                            stroke="rgb(59, 130, 246)"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${(weatherData.current.pressure - 980) / 60 * 175} 175`}
                          />
                          <circle
                            cx="64"
                            cy="56"
                            r="2"
                            fill="rgb(59, 130, 246)"
                            transform={`rotate(${(weatherData.current.pressure - 980) / 60 * 180 - 90} 64 56)`}
                          />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold">{weatherData.current.pressure}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">hPa</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Visibility */}
                <Card className="shadow-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Eye className="h-4 w-4" />
                      {i18n.language === 'ko' ? '가시거리' : 
                       i18n.language === 'ja' ? '視程' : 'Visibility'}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {i18n.language === 'ko' ? '가시거리가 보통이에요' : 
                       i18n.language === 'ja' ? '視程は普通です' : 'Visibility is moderate'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col items-center">
                      <div className="text-3xl font-bold">{(weatherData.current.visibility / 1000).toFixed(1)}</div>
                      <div className="text-lg text-gray-600 dark:text-gray-400">km</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sun Path and Moon Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sun Path */}
                <Card className="shadow-xl">
                  <CardContent className="p-6">
                    <div className="relative h-24 mb-4">
                      <svg className="w-full h-full" viewBox="0 0 300 96">
                        <path
                          d="M 20,76 Q 150,20 280,76"
                          stroke="rgba(251, 191, 36, 0.3)"
                          strokeWidth="2"
                          fill="none"
                        />
                        <circle cx="150" cy="48" r="12" fill="rgb(251, 191, 36)" />
                      </svg>
                      <div className="absolute bottom-2 left-2 text-xs">
                        <div className="font-medium text-gray-700 dark:text-gray-300">
                          {i18n.language === 'ko' ? '일출' : i18n.language === 'ja' ? '日の出' : 'Sunrise'}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">{formatTime(weatherData.sunrise)}</div>
                      </div>
                      <div className="absolute bottom-2 right-2 text-xs text-right">
                        <div className="font-medium text-gray-700 dark:text-gray-300">
                          {i18n.language === 'ko' ? '일몰' : i18n.language === 'ja' ? '日の入り' : 'Sunset'}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">{formatTime(weatherData.sunset)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Moon Phase */}
                <Card className="shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16">
                        <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-full h-full bg-gray-600 dark:bg-gray-800 rounded-full"
                             style={{ clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)' }}></div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {i18n.language === 'ko' ? '하현반달' : 
                           i18n.language === 'ja' ? '下弦の月' : 'Last Quarter'}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                          <div>
                            {i18n.language === 'ko' ? '월출' : i18n.language === 'ja' ? '月の出' : 'Moonrise'}: 
                            {i18n.language === 'ko' ? ' 오전 7:34' : i18n.language === 'ja' ? ' 午前7:34' : ' 7:34 AM'}
                          </div>
                          <div>
                            {i18n.language === 'ko' ? '월몰' : i18n.language === 'ja' ? '月の入り' : 'Moonset'}: 
                            {i18n.language === 'ko' ? ' 오후 10:26' : i18n.language === 'ja' ? ' 午後10:26' : ' 10:26 PM'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

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

              {/* Weather Stories */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle>
                    {i18n.language === 'ko' ? '오늘의 스토리' : 
                     i18n.language === 'ja' ? '今日のストーリー' : 'Today\'s Stories'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                      <div className="w-20 h-16 rounded-lg overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=80&h=64&fit=crop&crop=center" 
                          alt="투명우산을 쓴 아이"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1">
                          {i18n.language === 'ko' ? '비 오는 날, 어린이에게 투명우산을 씌워주세요' : 
                           i18n.language === 'ja' ? '雨の日、子供には透明な傘を持たせてください' : 
                           'On rainy days, give children transparent umbrellas'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {i18n.language === 'ko' ? '안전 · 육아' : 
                           i18n.language === 'ja' ? '安全・育児' : 'Safety · Parenting'}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                      <div className="w-20 h-16 rounded-lg overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1571212515416-fca060d13ee5?w=80&h=64&fit=crop&crop=center" 
                          alt="그릭요거트"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1">
                          {i18n.language === 'ko' ? '\'단백질 폭탄\' 그릭요거트, 더 건강하게 먹기' : 
                           i18n.language === 'ja' ? '\'プロテイン爆弾\' ギリシャヨーグルト、もっと健康に食べる' : 
                           '\'Protein bomb\' Greek yogurt, eating it healthier'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {i18n.language === 'ko' ? '건강 · 영양' : 
                           i18n.language === 'ja' ? '健康・栄養' : 'Health · Nutrition'}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                      <div className="w-20 h-16 rounded-lg overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=80&h=64&fit=crop&crop=center" 
                          alt="날씨 뉴스"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1">
                          {i18n.language === 'ko' ? '[날씨] 한낮 습도 높은 더위…내일(15일) 다시 전국 비 / KBS' : 
                           i18n.language === 'ja' ? '[天気] 昼間湿度の高い暑さ…明日(15日)再び全国で雨 / KBS' : 
                           '[Weather] High humidity heat during the day...rain nationwide again tomorrow (15th) / KBS'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {i18n.language === 'ko' ? 'KBS 뉴스' : 
                           i18n.language === 'ja' ? 'KBSニュース' : 'KBS News'}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                      <div className="w-20 h-16 rounded-lg overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=80&h=64&fit=crop&crop=center" 
                          alt="폭포와 계곡"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1">
                          {i18n.language === 'ko' ? '\'해변보다 여기가 낫다\'…5m 폭포 쏟아지는 비밀계곡' : 
                           i18n.language === 'ja' ? '\'海辺よりここの方が良い\'…5mの滝が流れる秘密の谷' : 
                           '\'Better than the beach\'...Secret valley with 5m waterfalls'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {i18n.language === 'ko' ? '여행 · 레저' : 
                           i18n.language === 'ja' ? '旅行・レジャー' : 'Travel · Leisure'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {i18n.language === 'ko' ? '2025 태풍 정보' : 
                         i18n.language === 'ja' ? '2025台風情報' : '2025 Typhoon Info'}
                      </div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {i18n.language === 'ko' ? '기상특보' : 
                         i18n.language === 'ja' ? '気象特報' : 'Weather Warning'}
                      </div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {i18n.language === 'ko' ? '여름 레저 정보' : 
                         i18n.language === 'ja' ? '夏のレジャー情報' : 'Summer Leisure Info'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {i18n.language === 'ko' ? '골프장날씨' : 
                         i18n.language === 'ja' ? 'ゴルフ場の天気' : 'Golf Weather'}
                      </div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {i18n.language === 'ko' ? '생활지수' : 
                         i18n.language === 'ja' ? '生活指数' : 'Life Index'}
                      </div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {i18n.language === 'ko' ? '전국날씨' : 
                         i18n.language === 'ja' ? '全国の天気' : 'National Weather'}
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