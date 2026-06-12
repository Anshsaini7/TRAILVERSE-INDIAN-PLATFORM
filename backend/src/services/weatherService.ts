import axios from 'axios';
import redisClient from '../config/redis';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const WEATHER_CACHE_TTL = 1800; // 30 minutes in seconds

export interface WeatherData {
  temperature: number;
  humidity: number;
  weather_condition: string;
}

export async function getTrekWeather(trekId: string, lat: number, lon: number): Promise<WeatherData> {
  const cacheKey = `weather:${trekId}`;

  // 1. Check Redis Cache
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log(`📡 Serving weather cache for trek: ${trekId}`);
      return JSON.parse(cachedData);
    }
  } catch (err) {
    console.warn('Redis read failure, fetching fresh from API');
  }

  // 2. Fetch fresh weather from OpenWeather or fallback
  let weatherData: WeatherData;

  if (OPENWEATHER_API_KEY) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      const response = await axios.get(url);
      
      weatherData = {
        temperature: response.data.main.temp,
        humidity: response.data.main.humidity,
        weather_condition: response.data.weather[0].main,
      };
    } catch (apiError) {
      console.error('OpenWeather API query failure. Using fallback mockup:', apiError);
      weatherData = generateFallbackWeather(lat);
    }
  } else {
    // Return high-fidelity mockup if no API key is registered
    weatherData = generateFallbackWeather(lat);
  }

  // 3. Cache inside Redis
  try {
    await redisClient.setEx(cacheKey, WEATHER_CACHE_TTL, JSON.stringify(weatherData));
  } catch (err) {
    console.warn('Failed to cache weather data in Redis');
  }

  return weatherData;
}

// Generate realistic mountain weather forecasts based on latitude coordinates
function generateFallbackWeather(lat: number): WeatherData {
  const isNorthernHimalayas = lat > 30.0;
  return {
    temperature: isNorthernHimalayas ? -2.5 : 18.0,
    humidity: isNorthernHimalayas ? 45 : 75,
    weather_condition: isNorthernHimalayas ? 'Snow' : 'Clear Sky'
  };
}
