'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface UserLocation {
  city: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
}

export interface WeatherCurrent {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  uvIndex: number;
  conditionCode: number;
  conditionText: string;
  conditionIcon: string;
  aqi: number;
  aqiLabel: string;
  sunrise: string;
  sunset: string;
}

export interface ForecastDay {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  rainProb: number;
  snowDepth: number;
  windSpeed: number;
  conditionCode: number;
  conditionText: string;
  conditionIcon: string;
}

export interface HourlyPoint {
  time: string;
  hour: number;
  temp: number;
  precipProb: number;
  snowDepth: number;
  windSpeed: number;
  uvIndex: number;
}

export type TempUnit = 'C' | 'F';
export type TimeFormat = '12h' | '24h';
export type ForecastDays = 7 | 14;

interface WeatherContextType {
  userLocation: UserLocation | null;
  userWeather: WeatherCurrent | null;
  userForecast: ForecastDay[];
  userHourly: HourlyPoint[];
  unit: TempUnit;
  timeFormat: TimeFormat;
  forecastDays: ForecastDays;
  loading: boolean;
  locationLoading: boolean;
  setUnit: (u: TempUnit) => void;
  setTimeFormat: (f: TimeFormat) => void;
  setForecastDays: (d: ForecastDays) => void;
  convertTemp: (celsius: number) => number;
  formatTemp: (celsius: number) => string;
  getConditionFromCode: (code: number) => { text: string; icon: string };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getConditionFromCode(code: number): { text: string; icon: string } {
  if (code === 0) return { text: 'Clear Sky', icon: 'Sun' };
  if (code <= 3) return { text: 'Partly Cloudy', icon: 'CloudSun' };
  if (code <= 48) return { text: 'Foggy', icon: 'Cloud' };
  if (code <= 55) return { text: 'Light Drizzle', icon: 'CloudDrizzle' };
  if (code <= 65) return { text: 'Rain', icon: 'CloudRain' };
  if (code <= 67) return { text: 'Freezing Rain', icon: 'CloudRain' };
  if (code <= 77) return { text: 'Snowfall', icon: 'Snowflake' };
  if (code <= 82) return { text: 'Rain Showers', icon: 'CloudRain' };
  if (code <= 86) return { text: 'Snow Showers', icon: 'Snowflake' };
  if (code <= 99) return { text: 'Thunderstorm', icon: 'CloudLightning' };
  return { text: 'Overcast', icon: 'Cloud' };
}

function getAqiLabel(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

function formatSunTime(isoString: string): string {
  if (!isoString) return '--:--';
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ─── Context ──────────────────────────────────────────────────────────────────
const WeatherContext = createContext<WeatherContextType | null>(null);

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [userWeather, setUserWeather] = useState<WeatherCurrent | null>(null);
  const [userForecast, setUserForecast] = useState<ForecastDay[]>([]);
  const [userHourly, setUserHourly] = useState<HourlyPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [unit, setUnitState] = useState<TempUnit>(() => {
    if (typeof window === 'undefined') return 'C';
    const saved = localStorage.getItem('tv_unit');
    return (saved === 'C' || saved === 'F') ? (saved as TempUnit) : 'C';
  });
  const [timeFormat, setTimeFormatState] = useState<TimeFormat>(() => {
    if (typeof window === 'undefined') return '12h';
    const saved = localStorage.getItem('tv_timefmt');
    return (saved === '12h' || saved === '24h') ? (saved as TimeFormat) : '12h';
  });
  const [forecastDays, setForecastDaysState] = useState<ForecastDays>(() => {
    if (typeof window === 'undefined') return 7;
    const saved = localStorage.getItem('tv_forecastdays');
    return saved === '14' ? 14 : 7;
  });
  const coordsRef = useRef<{ lat: number; lon: number } | null>(null);

  const setUnit = useCallback((u: TempUnit) => {
    setUnitState(u);
    localStorage.setItem('tv_unit', u);
  }, []);
  const setTimeFormat = useCallback((f: TimeFormat) => {
    setTimeFormatState(f);
    localStorage.setItem('tv_timefmt', f);
  }, []);
  const setForecastDays = useCallback((d: ForecastDays) => {
    setForecastDaysState(d);
    localStorage.setItem('tv_forecastdays', String(d));
  }, []);

  const convertTemp = useCallback((celsius: number) => {
    return unit === 'F' ? Math.round(celsius * 9 / 5 + 32) : Math.round(celsius);
  }, [unit]);

  const formatTemp = useCallback((celsius: number) => {
    return `${convertTemp(celsius)}°${unit}`;
  }, [convertTemp, unit]);

  // Fetch full weather for given coords
  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const [weatherRes, aqiRes] = await Promise.all([
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,visibility` +
          `&hourly=temperature_2m,precipitation_probability,snow_depth,wind_speed_10m,uv_index` +
          `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,snowfall_sum,wind_speed_10m_max,sunrise,sunset` +
          `&forecast_days=14&timezone=auto`
        ),
        fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi&timezone=auto`
        ).catch(() => null)
      ]);

      const weatherData = await weatherRes.json();
      const aqiData = aqiRes ? await aqiRes.json().catch(() => null) : null;

      if (!weatherData?.current) return;

      const code = weatherData.current.weather_code ?? 0;
      const cond = getConditionFromCode(code);

      // Current UV from hourly (current hour)
      const nowHour = new Date().getHours();
      const uvNow = weatherData.hourly?.uv_index?.[nowHour] ?? 0;

      const aqi = aqiData?.current?.us_aqi ?? 0;

      const weather: WeatherCurrent = {
        temp: Math.round(weatherData.current.temperature_2m),
        feelsLike: Math.round(weatherData.current.apparent_temperature),
        humidity: Math.round(weatherData.current.relative_humidity_2m),
        windSpeed: Math.round(weatherData.current.wind_speed_10m),
        visibility: Math.round((weatherData.current.visibility ?? 10000) / 1000),
        uvIndex: Math.round(uvNow),
        conditionCode: code,
        conditionText: cond.text,
        conditionIcon: cond.icon,
        aqi,
        aqiLabel: getAqiLabel(aqi),
        sunrise: formatSunTime(weatherData.daily?.sunrise?.[0]),
        sunset: formatSunTime(weatherData.daily?.sunset?.[0]),
      };

      setUserWeather(weather);

      // Build 14-day forecast
      const forecast: ForecastDay[] = [];
      if (weatherData.daily?.time) {
        for (let i = 0; i < weatherData.daily.time.length; i++) {
          const d = new Date(weatherData.daily.time[i]);
          const dCode = weatherData.daily.weather_code[i] ?? 0;
          const dCond = getConditionFromCode(dCode);
          forecast.push({
            date: `${String(d.getDate()).padStart(2,'0')} ${MONTH_NAMES[d.getMonth()]}`,
            dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : DAY_NAMES[d.getDay()],
            tempMax: Math.round(weatherData.daily.temperature_2m_max[i]),
            tempMin: Math.round(weatherData.daily.temperature_2m_min[i]),
            rainProb: Math.round(weatherData.daily.precipitation_probability_max[i] ?? 0),
            snowDepth: Math.round(weatherData.daily.snowfall_sum[i] ?? 0),
            windSpeed: Math.round(weatherData.daily.wind_speed_10m_max[i] ?? 0),
            conditionCode: dCode,
            conditionText: dCond.text,
            conditionIcon: dCond.icon,
          });
        }
      }
      setUserForecast(forecast);

      // Build 48-hour hourly
      const hourly: HourlyPoint[] = [];
      if (weatherData.hourly?.time) {
        for (let i = 0; i < Math.min(48, weatherData.hourly.time.length); i++) {
          const d = new Date(weatherData.hourly.time[i]);
          hourly.push({
            time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
            hour: d.getHours(),
            temp: Math.round(weatherData.hourly.temperature_2m[i]),
            precipProb: Math.round(weatherData.hourly.precipitation_probability[i] ?? 0),
            snowDepth: Math.round((weatherData.hourly.snow_depth?.[i] ?? 0) * 100),
            windSpeed: Math.round(weatherData.hourly.wind_speed_10m[i] ?? 0),
            uvIndex: Math.round(weatherData.hourly.uv_index?.[i] ?? 0),
          });
        }
      }
      setUserHourly(hourly);

    } catch (e) {
      console.warn('WeatherContext fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reverse geocode
  const reverseGeocode = useCallback(async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      const addr = data.address ?? {};
      setUserLocation({
        city: addr.city || addr.town || addr.village || addr.county || 'Unknown',
        state: addr.state || '',
        country: addr.country || 'India',
        lat,
        lon,
      });
    } catch {
      setUserLocation({ city: 'Delhi', state: 'Delhi', country: 'India', lat, lon });
    }
  }, []);

  // Init: get geolocation → weather + geocode
  useEffect(() => {
    const init = async (lat: number, lon: number) => {
      coordsRef.current = { lat, lon };
      setLocationLoading(false);
      await Promise.all([fetchWeather(lat, lon), reverseGeocode(lat, lon)]);
    };

    if (typeof window === 'undefined') return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => init(pos.coords.latitude, pos.coords.longitude),
        () => init(28.61, 77.20) // fallback Delhi
      );
    } else {
      init(28.61, 77.20);
    }
  }, [fetchWeather, reverseGeocode]);

  // Refresh weather every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (coordsRef.current) {
        fetchWeather(coordsRef.current.lat, coordsRef.current.lon);
      }
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  return (
    <WeatherContext.Provider value={{
      userLocation, userWeather, userForecast, userHourly,
      unit, timeFormat, forecastDays,
      loading, locationLoading,
      setUnit, setTimeFormat, setForecastDays,
      convertTemp, formatTemp, getConditionFromCode,
    }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeather must be used within WeatherProvider');
  return ctx;
}
