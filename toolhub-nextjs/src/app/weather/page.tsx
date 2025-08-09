'use client';

import React, { useState } from 'react';
import { Seo } from '@/components/Seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudDrizzle, 
  Zap,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Gauge,
  Search,
  RefreshCw,
  Clock
} from 'lucide-react';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  feelsLike: number;
  uvIndex: number;
  lastUpdated: string;
}

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 날씨 아이콘 가져오기
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'cloudy':
      case 'overcast':
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'rainy':
      case 'rain':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'snowy':
      case 'snow':
        return <Cloud className="w-8 h-8 text-blue-200" />;
      case 'drizzle':
        return <CloudDrizzle className="w-8 h-8 text-blue-400" />;
      case 'thunderstorm':
        return <Zap className="w-8 h-8 text-purple-500" />;
      default:
        return <Cloud className="w-8 h-8 text-gray-500" />;
    }
  };

  // 현재 위치 가져오기
  const getCurrentLocation = () => {
    setIsLoading(true);
    setError('');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          fetchWeatherByCoords();
        },
        () => {
          setError('위치 정보를 가져올 수 없습니다. 도시명으로 검색해주세요.');
          setIsLoading(false);
        }
      );
    } else {
      setError('브라우저가 위치 서비스를 지원하지 않습니다.');
      setIsLoading(false);
    }
  };

  // 좌표로 날씨 정보 가져오기 (시뮬레이션)
  const fetchWeatherByCoords = async () => {
    try {
      // 실제 API 호출 대신 시뮬레이션 데이터
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData: WeatherData = {
        location: '현재 위치',
        temperature: 22,
        condition: 'Sunny',
        description: '맑음',
        humidity: 65,
        windSpeed: 12,
        pressure: 1013,
        visibility: 10,
        feelsLike: 24,
        uvIndex: 6,
        lastUpdated: new Date().toLocaleString('ko-KR')
      };
      
      setWeatherData(mockData);
    } catch {
      setError('날씨 정보를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 도시명으로 날씨 검색
  const searchWeather = async (cityName: string) => {
    if (!cityName.trim()) {
      setError('도시명을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 실제 API 호출 대신 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData: WeatherData = {
        location: cityName,
        temperature: 18,
        condition: 'Cloudy',
        description: '흐림',
        humidity: 75,
        windSpeed: 8,
        pressure: 1008,
        visibility: 8,
        feelsLike: 19,
        uvIndex: 3,
        lastUpdated: new Date().toLocaleString('ko-KR')
      };
      
      setWeatherData(mockData);
    } catch {
      setError('날씨 정보를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 새로고침
  const refreshWeather = () => {
    if (weatherData?.location === '현재 위치') {
      getCurrentLocation();
    } else if (weatherData?.location) {
      searchWeather(weatherData.location);
    }
  };

  // UV 지수 레벨
  const getUVLevel = (uvIndex: number) => {
    if (uvIndex <= 2) return { level: '낮음', color: 'text-green-600' };
    if (uvIndex <= 5) return { level: '보통', color: 'text-yellow-600' };
    if (uvIndex <= 7) return { level: '높음', color: 'text-orange-600' };
    if (uvIndex <= 10) return { level: '매우 높음', color: 'text-red-600' };
    return { level: '위험', color: 'text-purple-600' };
  };

  return (
    <>
      <Seo 
        title="실시간 날씨 정보 | ToolHub.tools"
        description="현재 위치 및 전 세계 도시의 실시간 날씨 정보를 확인하세요"
        keywords="날씨,기상정보,온도,습도,현재날씨,날씨예보"
        canonicalUrl="https://toolhub.tools/weather"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
              <Cloud className="w-8 h-8 mr-3 text-blue-600" />
              실시간 날씨 정보
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              현재 위치나 원하는 도시의 실시간 날씨 정보를 확인해보세요
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* 검색 섹션 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  날씨 검색
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="도시명을 입력하세요 (예: 서울, 부산, Tokyo)"
                      onKeyPress={(e) => e.key === 'Enter' && searchWeather(location)}
                      className="text-base"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => searchWeather(location)}
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      검색
                    </Button>
                    <Button 
                      onClick={getCurrentLocation}
                      disabled={isLoading}
                      variant="outline"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      현재 위치
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 로딩 상태 */}
            {isLoading && (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">날씨 정보를 가져오는 중...</p>
                </CardContent>
              </Card>
            )}

            {/* 날씨 정보 */}
            {weatherData && !isLoading && (
              <div className="space-y-6">
                {/* 현재 날씨 */}
                <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        <CardTitle className="text-white">{weatherData.location}</CardTitle>
                      </div>
                      <Button 
                        onClick={refreshWeather}
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getWeatherIcon(weatherData.condition)}
                        <div>
                          <div className="text-4xl font-bold">{weatherData.temperature}°C</div>
                          <div className="text-lg opacity-90">{weatherData.description}</div>
                          <div className="text-sm opacity-75">
                            체감온도 {weatherData.feelsLike}°C
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm opacity-75">
                          <Clock className="w-4 h-4 mr-1" />
                          {weatherData.lastUpdated}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 상세 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Droplets className="w-5 h-5 text-blue-500 mr-2" />
                          <span className="text-sm font-medium">습도</span>
                        </div>
                        <span className="text-lg font-semibold">{weatherData.humidity}%</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Wind className="w-5 h-5 text-green-500 mr-2" />
                          <span className="text-sm font-medium">풍속</span>
                        </div>
                        <span className="text-lg font-semibold">{weatherData.windSpeed} km/h</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Gauge className="w-5 h-5 text-purple-500 mr-2" />
                          <span className="text-sm font-medium">기압</span>
                        </div>
                        <span className="text-lg font-semibold">{weatherData.pressure} hPa</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Eye className="w-5 h-5 text-gray-500 mr-2" />
                          <span className="text-sm font-medium">가시거리</span>
                        </div>
                        <span className="text-lg font-semibold">{weatherData.visibility} km</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Thermometer className="w-5 h-5 text-red-500 mr-2" />
                          <span className="text-sm font-medium">체감온도</span>
                        </div>
                        <span className="text-lg font-semibold">{weatherData.feelsLike}°C</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Sun className="w-5 h-5 text-yellow-500 mr-2" />
                          <span className="text-sm font-medium">UV 지수</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-semibold">{weatherData.uvIndex}</span>
                          <Badge 
                            variant="outline" 
                            className={`ml-2 ${getUVLevel(weatherData.uvIndex).color}`}
                          >
                            {getUVLevel(weatherData.uvIndex).level}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 안내사항 */}
                <Card>
                  <CardHeader>
                    <CardTitle>💡 날씨 정보 안내</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                      <p>
                        <strong>데모 서비스:</strong> 현재는 시뮬레이션 데이터를 제공합니다. 
                        실제 서비스에서는 OpenWeatherMap 등의 API를 통해 실시간 날씨 정보를 제공합니다.
                      </p>
                      <p>
                        <strong>위치 서비스:</strong> 현재 위치 기능을 사용하면 GPS를 통해 자동으로 
                        해당 지역의 날씨 정보를 가져옵니다.
                      </p>
                      <p>
                        <strong>검색 팁:</strong> 한국어(서울, 부산) 또는 영어(Seoul, Tokyo) 도시명으로 
                        검색할 수 있습니다.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 인기 도시 */}
            {!weatherData && !isLoading && (
              <Card>
                <CardHeader>
                  <CardTitle>🌍 인기 도시 날씨</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['서울', '부산', '제주', '도쿄', '오사카', '베이징', '상하이', '뉴욕'].map((city) => (
                      <Button
                        key={city}
                        variant="outline"
                        onClick={() => {
                          setLocation(city);
                          searchWeather(city);
                        }}
                        className="h-auto py-3"
                      >
                        <div className="text-center">
                          <div className="font-medium">{city}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}