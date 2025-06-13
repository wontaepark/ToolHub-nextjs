import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Demo weather data generator
function getAccuWeatherIcon(accuIcon: number): string {
  const iconMap: { [key: number]: string } = {
    1: '01d', 2: '02d', 3: '02d', 4: '03d', 5: '03d', 6: '04d', 7: '04d', 8: '04d',
    11: '50d', 12: '09d', 13: '10d', 14: '10d', 15: '11d', 16: '11d', 17: '11d', 18: '09d',
    19: '13d', 20: '13d', 21: '13d', 22: '13d', 23: '13d', 24: '50d', 25: '13d',
    26: '09d', 29: '09d', 30: '01d', 31: '01d', 32: '02d', 33: '01n', 34: '02n',
    35: '03n', 36: '04n', 37: '50n', 38: '04n', 39: '09n', 40: '10n', 41: '11n',
    42: '11n', 43: '13n', 44: '13n'
  };
  return iconMap[accuIcon] || '01d';
}

function generateDemoWeatherData(lat: number, lon: number, cityName: string) {
  const weatherTypes = [
    { main: "Clear", description: "clear sky", icon: "01d" },
    { main: "Clouds", description: "few clouds", icon: "02d" },
    { main: "Clouds", description: "scattered clouds", icon: "03d" },
    { main: "Rain", description: "light rain", icon: "10d" }
  ];
  
  const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
  const baseTemp = 15 + Math.random() * 20; // 15-35°C
  
  const dailyForecasts = [];
  for (let i = 0; i < 5; i++) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + i);
    const dayWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    const dayTemp = baseTemp + Math.random() * 10 - 5;
    
    dailyForecasts.push({
      date: futureDate.toISOString().split('T')[0],
      temp_max: Math.round(dayTemp + 3),
      temp_min: Math.round(dayTemp - 3),
      weather: dayWeather
    });
  }

  return {
    location: {
      name: cityName,
      country: "Demo",
      lat: lat,
      lon: lon
    },
    current: {
      temp: Math.round(baseTemp),
      feels_like: Math.round(baseTemp + Math.random() * 4 - 2),
      humidity: Math.round(40 + Math.random() * 40),
      pressure: Math.round(1000 + Math.random() * 50),
      visibility: 10000,
      uv_index: Math.round(Math.random() * 10),
      wind_speed: Math.round(Math.random() * 15),
      wind_deg: Math.round(Math.random() * 360),
      weather: randomWeather
    },
    forecast: dailyForecasts,
    sunrise: Math.floor(Date.now() / 1000) - 3600,
    sunset: Math.floor(Date.now() / 1000) + 3600
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files for SEO
  app.get('/sitemap.xml', (req, res) => {
    res.setHeader('Content-Type', 'application/xml');
    res.sendFile('sitemap.xml', { root: 'client/public' });
  });

  app.get('/robots.txt', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile('robots.txt', { root: 'client/public' });
  });

  // AccuWeather API routes
  app.get("/api/weather/coordinates", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
      }

      const API_KEY = process.env.ACCUWEATHER_API_KEY;
      
      if (!API_KEY) {
        console.log("No AccuWeather API key found, returning demo weather data for coordinates:", lat, lon);
        return res.json(generateDemoWeatherData(Number(lat), Number(lon), "Current Location"));
      }

      console.log("Fetching AccuWeather data for coordinates:", lat, lon);
      
      try {
        // Get location key from coordinates
        const locationUrl = `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${API_KEY}&q=${lat},${lon}&language=ko-kr`;
        const locationResponse = await fetch(locationUrl);
        
        if (!locationResponse.ok) {
          console.log("AccuWeather location lookup failed, using demo data");
          return res.json(generateDemoWeatherData(Number(lat), Number(lon), "Current Location"));
        }
        
        const locationData = await locationResponse.json();
        const locationKey = locationData.Key;
        console.log("Location found:", locationData.LocalizedName);

        // Get current weather
        const currentUrl = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${API_KEY}&details=true&language=ko-kr`;
        const currentResponse = await fetch(currentUrl);
        
        if (!currentResponse.ok) {
          console.log("AccuWeather current conditions failed, using demo data");
          return res.json(generateDemoWeatherData(Number(lat), Number(lon), locationData.LocalizedName));
        }
        
        const currentData = await currentResponse.json();
        const current = currentData[0];

        // Get 5-day forecast
        const forecastUrl = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${API_KEY}&details=true&metric=true&language=ko-kr`;
        const forecastResponse = await fetch(forecastUrl);
        
        if (!forecastResponse.ok) {
          console.log("AccuWeather forecast failed, using demo data");
          return res.json(generateDemoWeatherData(Number(lat), Number(lon), locationData.LocalizedName));
        }
        
        const forecastData = await forecastResponse.json();

        // Process forecast data
        const dailyForecasts = forecastData.DailyForecasts.map((day: any) => ({
          date: new Date(day.Date).toISOString().split('T')[0],
          temp_max: day.Temperature.Maximum.Value,
          temp_min: day.Temperature.Minimum.Value,
          weather: {
            main: day.Day.IconPhrase,
            description: day.Day.ShortPhrase || day.Day.IconPhrase,
            icon: getAccuWeatherIcon(day.Day.Icon)
          }
        }));

        const weatherData = {
          location: {
            name: locationData.LocalizedName,
            country: locationData.Country.ID,
            lat: locationData.GeoPosition.Latitude,
            lon: locationData.GeoPosition.Longitude
          },
          current: {
            temp: current.Temperature.Metric.Value,
            feels_like: current.RealFeelTemperature.Metric.Value,
            humidity: current.RelativeHumidity,
            pressure: current.Pressure.Metric.Value,
            visibility: current.Visibility.Metric.Value,
            uv_index: current.UVIndex || 0,
            wind_speed: current.Wind.Speed.Metric.Value / 3.6, // Convert km/h to m/s
            wind_deg: current.Wind.Direction.Degrees,
            weather: {
              main: current.WeatherText,
              description: current.WeatherText,
              icon: getAccuWeatherIcon(current.WeatherIcon)
            }
          },
          forecast: dailyForecasts,
          sunrise: Date.now() / 1000 + 6 * 3600, // Placeholder
          sunset: Date.now() / 1000 + 18 * 3600  // Placeholder
        };

        console.log("AccuWeather data received for:", weatherData.location.name);
        res.json(weatherData);
      } catch (apiError) {
        console.log("AccuWeather API request failed:", apiError);
        res.json(generateDemoWeatherData(Number(lat), Number(lon), "Current Location"));
      }
    } catch (error) {
      console.error("AccuWeather API error:", error);
      res.status(500).json({ 
        error: "Failed to fetch weather data"
      });
    }
  });

  app.get("/api/weather/city", async (req, res) => {
    try {
      console.log("City weather request query:", req.query);
      const { q } = req.query;
      
      if (!q) {
        console.log("No city name provided in query");
        return res.status(400).json({ error: "City name is required" });
      }

      const API_KEY = process.env.ACCUWEATHER_API_KEY;
      const cityName = q as string;
      
      // If no API key, return demo data
      if (!API_KEY) {
        console.log("No API key found, returning demo weather data for city:", cityName);
        // Generate demo coordinates based on city name
        const demoCoords = getCityCoordinates(cityName);
        return res.json(generateDemoWeatherData(demoCoords.lat, demoCoords.lon, cityName));
      }

      console.log("Searching for city:", cityName);

      try {
        // Search for location using AccuWeather
        const locationUrl = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${API_KEY}&q=${encodeURIComponent(cityName)}&language=ko-kr`;
        const locationResponse = await fetch(locationUrl);
        
        if (!locationResponse.ok) {
          console.log("AccuWeather location search failed, using demo data");
          const demoCoords = getCityCoordinates(cityName);
          return res.json(generateDemoWeatherData(demoCoords.lat, demoCoords.lon, cityName));
        }
        
        const locationData = await locationResponse.json();
        
        if (!locationData || locationData.length === 0) {
          console.log("City not found in AccuWeather, using demo data");
          const demoCoords = getCityCoordinates(cityName);
          return res.json(generateDemoWeatherData(demoCoords.lat, demoCoords.lon, cityName));
        }

        const location = locationData[0];
        const locationKey = location.Key;
        console.log("AccuWeather location found:", location.LocalizedName);

        // Get current weather
        const currentUrl = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${API_KEY}&details=true&language=ko-kr`;
        const currentResponse = await fetch(currentUrl);
        
        if (!currentResponse.ok) {
          console.log("AccuWeather current conditions failed, using demo data");
          return res.json(generateDemoWeatherData(location.GeoPosition.Latitude, location.GeoPosition.Longitude, cityName));
        }
        
        const currentData = await currentResponse.json();
        const current = currentData[0];

        // Get 5-day forecast
        const forecastUrl = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${API_KEY}&details=true&metric=true&language=ko-kr`;
        const forecastResponse = await fetch(forecastUrl);
        
        if (!forecastResponse.ok) {
          console.log("AccuWeather forecast failed, using demo data");
          return res.json(generateDemoWeatherData(location.GeoPosition.Latitude, location.GeoPosition.Longitude, cityName));
        }
        
        const forecastData = await forecastResponse.json();

        // Process forecast data
        const dailyForecasts = forecastData.DailyForecasts.map((day: any) => ({
          date: new Date(day.Date).toISOString().split('T')[0],
          temp_max: day.Temperature.Maximum.Value,
          temp_min: day.Temperature.Minimum.Value,
          weather: {
            main: day.Day.IconPhrase,
            description: day.Day.ShortPhrase || day.Day.IconPhrase,
            icon: getAccuWeatherIcon(day.Day.Icon)
          }
        }));

        const weatherData = {
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
            wind_speed: current.Wind.Speed.Metric.Value / 3.6, // Convert km/h to m/s
            wind_deg: current.Wind.Direction.Degrees,
            weather: {
              main: current.WeatherText,
              description: current.WeatherText,
              icon: getAccuWeatherIcon(current.WeatherIcon)
            }
          },
          forecast: dailyForecasts,
          sunrise: Date.now() / 1000 + 6 * 3600, // Placeholder
          sunset: Date.now() / 1000 + 18 * 3600  // Placeholder
        };

        res.json(weatherData);
      } catch (apiError) {
        console.log("API request failed, using demo data");
        const demoCoords = getCityCoordinates(cityName);
        res.json(generateDemoWeatherData(demoCoords.lat, demoCoords.lon, cityName));
      }
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ 
        error: "Failed to fetch weather data"
      });
    }
  });

  // Helper function to get demo coordinates for cities
  function getCityCoordinates(cityName: string) {
    const cityCoords: { [key: string]: { lat: number; lon: number } } = {
      'seoul': { lat: 37.5665, lon: 126.9780 },
      'tokyo': { lat: 35.6762, lon: 139.6503 },
      'new york': { lat: 40.7128, lon: -74.0060 },
      'london': { lat: 51.5074, lon: -0.1278 },
      'paris': { lat: 48.8566, lon: 2.3522 },
      'berlin': { lat: 52.5200, lon: 13.4050 },
      'madrid': { lat: 40.4168, lon: -3.7038 },
      'rome': { lat: 41.9028, lon: 12.4964 },
      'moscow': { lat: 55.7558, lon: 37.6176 },
      'beijing': { lat: 39.9042, lon: 116.4074 },
      'busan': { lat: 35.1796, lon: 129.0756 },
      'incheon': { lat: 37.4563, lon: 126.7052 }
    };
    
    const normalizedCity = cityName.toLowerCase().trim();
    return cityCoords[normalizedCity] || { lat: 37.5665, lon: 126.9780 }; // Default to Seoul
  }

  const httpServer = createServer(app);

  return httpServer;
}
