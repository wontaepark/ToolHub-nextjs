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
      if (!API_KEY) {
        console.error("OpenWeather API key not found in environment variables");
        return res.status(500).json({ error: "Weather API key not configured" });
      }

      console.log("Searching for city:", city);

      // Get coordinates for city
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city as string)}&limit=1&appid=${API_KEY}`;
      console.log("Making geocoding request to:", geoUrl.replace(API_KEY, 'HIDDEN'));
      
      const geoResponse = await fetch(geoUrl);
      
      if (!geoResponse.ok) {
        const errorText = await geoResponse.text();
        console.error("Geocoding API error:", geoResponse.status, errorText);
        return res.status(500).json({ 
          error: `Geocoding API error: ${geoResponse.status}`,
          details: errorText
        });
      }
      
      const geoData = await geoResponse.json();
      console.log("Geocoding response:", geoData);
      
      if (geoData.length === 0) {
        return res.status(404).json({ error: "City not found" });
      }

      const { lat, lon } = geoData[0];
      console.log("Found coordinates for", city, ":", lat, lon);

      // Current weather
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      console.log("Making weather request to:", currentWeatherUrl.replace(API_KEY, 'HIDDEN'));
      
      const currentResponse = await fetch(currentWeatherUrl);
      
      if (!currentResponse.ok) {
        const errorText = await currentResponse.text();
        console.error("Current weather API error:", currentResponse.status, errorText);
        return res.status(500).json({ 
          error: `Weather API error: ${currentResponse.status}`,
          details: errorText
        });
      }
      
      const currentData = await currentResponse.json();
      console.log("Weather data received for:", currentData.name);

      // Create simple forecast data from current weather
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
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ 
        error: "Failed to fetch weather data",
        message: error.message
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
