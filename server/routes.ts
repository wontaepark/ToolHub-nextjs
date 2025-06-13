import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

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
      if (!API_KEY) {
        return res.status(500).json({ error: "Weather API key not configured" });
      }

      // Current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!currentResponse.ok) {
        throw new Error("Failed to fetch current weather");
      }
      
      const currentData = await currentResponse.json();

      // 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!forecastResponse.ok) {
        throw new Error("Failed to fetch weather forecast");
      }
      
      const forecastData = await forecastResponse.json();

      // Process forecast data to get daily forecasts
      const dailyForecasts = [];
      const processedDates = new Set();
      
      for (const item of forecastData.list) {
        const date = new Date(item.dt * 1000).toDateString();
        if (!processedDates.has(date) && dailyForecasts.length < 5) {
          processedDates.add(date);
          dailyForecasts.push({
            date: item.dt_txt.split(' ')[0],
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
          visibility: currentData.visibility,
          uv_index: 0, // UV index not available in free tier
          wind_speed: currentData.wind.speed,
          wind_deg: currentData.wind.deg || 0,
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
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  });

  app.get("/api/weather/city", async (req, res) => {
    try {
      const { city } = req.query;
      
      if (!city) {
        return res.status(400).json({ error: "City name is required" });
      }

      const API_KEY = process.env.OPENWEATHER_API_KEY;
      if (!API_KEY) {
        return res.status(500).json({ error: "Weather API key not configured" });
      }

      // Get coordinates for city
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city as string)}&limit=1&appid=${API_KEY}`
      );
      
      if (!geoResponse.ok) {
        throw new Error("Failed to fetch city coordinates");
      }
      
      const geoData = await geoResponse.json();
      
      if (geoData.length === 0) {
        return res.status(404).json({ error: "City not found" });
      }

      const { lat, lon } = geoData[0];

      // Current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!currentResponse.ok) {
        throw new Error("Failed to fetch current weather");
      }
      
      const currentData = await currentResponse.json();

      // 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!forecastResponse.ok) {
        throw new Error("Failed to fetch weather forecast");
      }
      
      const forecastData = await forecastResponse.json();

      // Process forecast data to get daily forecasts
      const dailyForecasts = [];
      const processedDates = new Set();
      
      for (const item of forecastData.list) {
        const date = new Date(item.dt * 1000).toDateString();
        if (!processedDates.has(date) && dailyForecasts.length < 5) {
          processedDates.add(date);
          dailyForecasts.push({
            date: item.dt_txt.split(' ')[0],
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
          visibility: currentData.visibility,
          uv_index: 0, // UV index not available in free tier
          wind_speed: currentData.wind.speed,
          wind_deg: currentData.wind.deg || 0,
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
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
