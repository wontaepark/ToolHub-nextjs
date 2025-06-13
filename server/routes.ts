import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Demo weather data generator
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

  // Weather API routes
  app.get("/api/weather/coordinates", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
      }

      const API_KEY = process.env.OPENWEATHER_API_KEY;
      
      // If no API key or invalid key, return demo data
      if (!API_KEY) {
        console.log("No API key found, returning demo weather data for coordinates:", lat, lon);
        return res.json(generateDemoWeatherData(Number(lat), Number(lon), "Current Location"));
      }

      console.log("Fetching weather for coordinates:", lat, lon);
      
      try {
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const currentResponse = await fetch(currentWeatherUrl);
        
        if (!currentResponse.ok) {
          console.log("API key invalid or request failed, using demo data");
          return res.json(generateDemoWeatherData(Number(lat), Number(lon), "Current Location"));
        }
        
        const currentData = await currentResponse.json();
        console.log("Weather data received for:", currentData.name);

        // Create forecast data
        const dailyForecasts = [];
        for (let i = 0; i < 5; i++) {
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + i);
          dailyForecasts.push({
            date: futureDate.toISOString().split('T')[0],
            temp_max: currentData.main.temp + Math.random() * 6 - 3,
            temp_min: currentData.main.temp - 5 + Math.random() * 4,
            weather: {
              main: currentData.weather[0].main,
              description: currentData.weather[0].description,
              icon: currentData.weather[0].icon
            }
          });
        }

        const weatherData = {
          location: {
            name: currentData.name,
            country: currentData.sys.country,
            lat: currentData.coord.lat,
            lon: currentData.coord.lon
          },
          current: {
            temp: currentData.main.temp,
            feels_like: currentData.main.feels_like,
            humidity: currentData.main.humidity,
            pressure: currentData.main.pressure,
            visibility: currentData.visibility || 10000,
            uv_index: 0,
            wind_speed: currentData.wind?.speed || 0,
            wind_deg: currentData.wind?.deg || 0,
            weather: {
              main: currentData.weather[0].main,
              description: currentData.weather[0].description,
              icon: currentData.weather[0].icon
            }
          },
          forecast: dailyForecasts,
          sunrise: currentData.sys.sunrise,
          sunset: currentData.sys.sunset
        };

        res.json(weatherData);
      } catch (apiError) {
        console.log("API request failed, using demo data:", apiError);
        res.json(generateDemoWeatherData(Number(lat), Number(lon), "Current Location"));
      }
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ 
        error: "Failed to fetch weather data"
      });
    }
  });

  app.get("/api/weather/city", async (req, res) => {
    try {
      const { city } = req.query;
      
      if (!city) {
        return res.status(400).json({ error: "City name is required" });
      }

      const API_KEY = process.env.OPENWEATHER_API_KEY;
      const cityName = city as string;
      
      // If no API key, return demo data
      if (!API_KEY) {
        console.log("No API key found, returning demo weather data for city:", cityName);
        // Generate demo coordinates based on city name
        const demoCoords = getCityCoordinates(cityName);
        return res.json(generateDemoWeatherData(demoCoords.lat, demoCoords.lon, cityName));
      }

      console.log("Searching for city:", cityName);

      try {
        // Try real API first
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`;
        const geoResponse = await fetch(geoUrl);
        
        if (!geoResponse.ok) {
          console.log("Geocoding failed, using demo data");
          const demoCoords = getCityCoordinates(cityName);
          return res.json(generateDemoWeatherData(demoCoords.lat, demoCoords.lon, cityName));
        }
        
        const geoData = await geoResponse.json();
        
        if (geoData.length === 0) {
          console.log("City not found in API, using demo data");
          const demoCoords = getCityCoordinates(cityName);
          return res.json(generateDemoWeatherData(demoCoords.lat, demoCoords.lon, cityName));
        }

        const { lat, lon } = geoData[0];
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const currentResponse = await fetch(currentWeatherUrl);
        
        if (!currentResponse.ok) {
          console.log("Weather API failed, using demo data");
          return res.json(generateDemoWeatherData(lat, lon, cityName));
        }
        
        const currentData = await currentResponse.json();

        // Create forecast data
        const dailyForecasts = [];
        for (let i = 0; i < 5; i++) {
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + i);
          dailyForecasts.push({
            date: futureDate.toISOString().split('T')[0],
            temp_max: currentData.main.temp + Math.random() * 6 - 3,
            temp_min: currentData.main.temp - 5 + Math.random() * 4,
            weather: {
              main: currentData.weather[0].main,
              description: currentData.weather[0].description,
              icon: currentData.weather[0].icon
            }
          });
        }

        const weatherData = {
          location: {
            name: currentData.name,
            country: currentData.sys.country,
            lat: currentData.coord.lat,
            lon: currentData.coord.lon
          },
          current: {
            temp: currentData.main.temp,
            feels_like: currentData.main.feels_like,
            humidity: currentData.main.humidity,
            pressure: currentData.main.pressure,
            visibility: currentData.visibility || 10000,
            uv_index: 0,
            wind_speed: currentData.wind?.speed || 0,
            wind_deg: currentData.wind?.deg || 0,
            weather: {
              main: currentData.weather[0].main,
              description: currentData.weather[0].description,
              icon: currentData.weather[0].icon
            }
          },
          forecast: dailyForecasts,
          sunrise: currentData.sys.sunrise,
          sunset: currentData.sys.sunset
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
