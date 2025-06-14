import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { weatherProviderManager } from "./weatherProviders";
import { weatherCache } from "./cache";

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

  // Weather API routes with caching and multiple providers
  app.get("/api/weather/coordinates", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
      }

      console.log("Fetching weather data for coordinates:", lat, lon);
      
      const query = `${lat},${lon}`;
      const weatherData = await weatherProviderManager.getWeatherWithFallback(query, true);
      
      console.log(`Weather data retrieved from ${weatherData.source} for coordinates:`, lat, lon);
      res.json(weatherData);

    } catch (error) {
      console.error("Weather API error:", error);
      
      // Final fallback to demo data only if no cached data is available
      res.json(generateDemoWeatherData(Number(req.query.lat), Number(req.query.lon), "Current Location"));
    }
  });

  app.get("/api/weather/city", async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({ error: "City name is required" });
      }

      // Proper UTF-8 decoding for Korean characters
      let cityName = q as string;
      try {
        // Handle double-encoded UTF-8 Korean characters
        if (cityName.includes('%')) {
          cityName = decodeURIComponent(cityName);
        }
        // Fix garbled Korean characters from encoding issues
        if (cityName.includes('ë') || cityName.includes('ì') || cityName.includes('ì°')) {
          cityName = Buffer.from(cityName, 'latin1').toString('utf8');
        }
      } catch (e) {
        // Fallback to original if decoding fails
        cityName = q as string;
      }
      console.log("Fetching weather data for city:", cityName);
      
      const weatherData = await weatherProviderManager.getWeatherWithFallback(cityName, false);
      
      console.log(`Weather data retrieved from ${weatherData.source} for city:`, cityName);
      res.json(weatherData);

    } catch (error) {
      console.error("Weather API error:", error);
      
      // Final fallback to demo data only if no cached data is available
      const demoCoords = getCityCoordinates(req.query.q as string);
      res.json(generateDemoWeatherData(demoCoords.lat, demoCoords.lon, req.query.q as string));
    }
  });

  // Weather provider status endpoint
  app.get("/api/weather/status", (req, res) => {
    try {
      const providerStatus = weatherProviderManager.getProviderStatus();
      res.json({
        providers: providerStatus,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Provider status error:", error);
      res.status(500).json({ error: "Failed to get provider status" });
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
