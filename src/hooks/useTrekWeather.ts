'use client';

import { useState, useEffect, useCallback } from 'react';
import { getConditionFromCode, ForecastDay, HourlyPoint, WeatherCurrent } from '../context/WeatherContext';

// ─── Types ────────────────────────────────────────────────────────────────────
export type AlertLevel = 'safe' | 'caution' | 'danger';

export interface WeatherAlert {
  id: string;
  level: AlertLevel;
  title: string;
  description: string;
  icon: string;
}

export interface TrekWeatherData {
  current: WeatherCurrent | null;
  forecast: ForecastDay[];
  hourly: HourlyPoint[];
  alerts: WeatherAlert[];
  loading: boolean;
  error: string | null;
}

// ─── Alert Evaluation ─────────────────────────────────────────────────────────
function evaluateAlerts(current: WeatherCurrent | null, forecast: ForecastDay[]): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];
  if (!current && forecast.length === 0) return alerts;

  const todayForecast = forecast[0];

  // Heavy Rain
  if ((todayForecast?.rainProb ?? 0) >= 80 || [61,63,65,82].includes(current?.conditionCode ?? -1)) {
    alerts.push({
      id: 'heavy-rain',
      level: 'danger',
      title: 'Heavy Rain Warning',
      description: 'Severe rainfall expected. Trail may be slippery and flooded. Reconsider trek plans.',
      icon: '🌧️',
    });
  } else if ((todayForecast?.rainProb ?? 0) >= 40) {
    alerts.push({
      id: 'light-rain',
      level: 'caution',
      title: 'Rain Expected',
      description: `Rain probability is ${todayForecast?.rainProb}%. Carry waterproof gear.`,
      icon: '🌦️',
    });
  }

  // Snow
  if ((todayForecast?.snowDepth ?? 0) > 5 || [71,73,75,77,85,86].includes(current?.conditionCode ?? -1)) {
    alerts.push({
      id: 'snowfall',
      level: 'danger',
      title: 'Snowfall Warning',
      description: 'Heavy snowfall expected at higher altitudes. Avalanche risk elevated. Expert guides required.',
      icon: '❄️',
    });
  } else if ((todayForecast?.snowDepth ?? 0) > 0) {
    alerts.push({
      id: 'light-snow',
      level: 'caution',
      title: 'Light Snow Possible',
      description: 'Some snowfall expected. Carry microspikes and warm layers.',
      icon: '🌨️',
    });
  }

  // High Winds
  if ((current?.windSpeed ?? 0) > 60 || (todayForecast?.windSpeed ?? 0) > 60) {
    alerts.push({
      id: 'high-wind',
      level: 'danger',
      title: 'High Wind Alert',
      description: `Wind speeds exceeding ${Math.max(current?.windSpeed ?? 0, todayForecast?.windSpeed ?? 0)} km/h. Dangerous conditions at exposed ridges.`,
      icon: '💨',
    });
  } else if ((current?.windSpeed ?? 0) > 40 || (todayForecast?.windSpeed ?? 0) > 40) {
    alerts.push({
      id: 'moderate-wind',
      level: 'caution',
      title: 'Strong Winds',
      description: 'Strong winds forecast. Secure tents and pack extra windproof layers.',
      icon: '🌬️',
    });
  }

  // Thunderstorm
  if ((current?.conditionCode ?? 0) >= 95) {
    alerts.push({
      id: 'thunderstorm',
      level: 'danger',
      title: 'Thunderstorm Warning',
      description: 'Active thunderstorm in the area. Do not trek on open ridges or summits. Seek shelter immediately.',
      icon: '⛈️',
    });
  }

  // UV
  if ((current?.uvIndex ?? 0) >= 11) {
    alerts.push({
      id: 'extreme-uv',
      level: 'danger',
      title: 'Extreme UV Index',
      description: `UV Index is ${current?.uvIndex} (Extreme). Apply SPF 50+ sunscreen every 2 hours and cover exposed skin.`,
      icon: '☀️',
    });
  } else if ((current?.uvIndex ?? 0) >= 8) {
    alerts.push({
      id: 'high-uv',
      level: 'caution',
      title: 'High UV Levels',
      description: `UV Index is ${current?.uvIndex}. Wear UV-protective clothing and apply sunscreen.`,
      icon: '🔆',
    });
  }

  // AQI
  if ((current?.aqi ?? 0) > 200) {
    alerts.push({
      id: 'poor-aqi',
      level: 'danger',
      title: 'Poor Air Quality',
      description: `AQI is ${current?.aqi} (${current?.aqiLabel}). Avoid strenuous outdoor activity.`,
      icon: '😷',
    });
  } else if ((current?.aqi ?? 0) > 100) {
    alerts.push({
      id: 'moderate-aqi',
      level: 'caution',
      title: 'Moderate Air Quality',
      description: `AQI is ${current?.aqi} (${current?.aqiLabel}). Sensitive individuals should limit exertion.`,
      icon: '🫁',
    });
  }

  // If no alerts → add safe
  if (alerts.length === 0) {
    alerts.push({
      id: 'safe',
      level: 'safe',
      title: 'Conditions Look Good',
      description: 'No weather warnings for this trek today. Always carry emergency gear and check conditions on the day.',
      icon: '✅',
    });
  }

  return alerts;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useTrekWeather(lat: number | null, lon: number | null): TrekWeatherData {
  const [current, setCurrent] = useState<WeatherCurrent | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [hourly, setHourly] = useState<HourlyPoint[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const fetchTrekWeather = useCallback(async (latitude: number, longitude: number) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherRes, aqiRes] = await Promise.all([
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
          `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,visibility` +
          `&hourly=temperature_2m,precipitation_probability,snow_depth,wind_speed_10m,uv_index` +
          `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,snowfall_sum,wind_speed_10m_max,sunrise,sunset` +
          `&forecast_days=14&timezone=auto`
        ),
        fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi&timezone=auto`
        ).catch(() => null)
      ]);

      const weatherData = await weatherRes.json();
      const aqiData = aqiRes ? await aqiRes.json().catch(() => null) : null;

      if (!weatherData?.current) {
        setError('Weather data unavailable for this location.');
        return;
      }

      const code = weatherData.current.weather_code ?? 0;
      const cond = getConditionFromCode(code);
      const nowHour = new Date().getHours();
      const uvNow = weatherData.hourly?.uv_index?.[nowHour] ?? 0;
      const aqi = aqiData?.current?.us_aqi ?? 0;
      const aqiLabels = ['Good','Moderate','Unhealthy for Sensitive','Unhealthy','Very Unhealthy','Hazardous'];
      const aqiLabel = aqi <= 50 ? 'Good' : aqi <= 100 ? 'Moderate' : aqi <= 150 ? 'Unhealthy for Sensitive' : aqi <= 200 ? 'Unhealthy' : aqi <= 300 ? 'Very Unhealthy' : 'Hazardous';

      function fmtSun(iso: string) {
        if (!iso) return '--:--';
        const d = new Date(iso);
        return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
      }

      const cur: WeatherCurrent = {
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
        aqiLabel,
        sunrise: fmtSun(weatherData.daily?.sunrise?.[0]),
        sunset: fmtSun(weatherData.daily?.sunset?.[0]),
      };
      setCurrent(cur);

      // 14-day forecast
      const fc: ForecastDay[] = [];
      if (weatherData.daily?.time) {
        for (let i = 0; i < weatherData.daily.time.length; i++) {
          const d = new Date(weatherData.daily.time[i]);
          const dCode = weatherData.daily.weather_code[i] ?? 0;
          const dCond = getConditionFromCode(dCode);
          fc.push({
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
      setForecast(fc);

      // 48-hour hourly
      const hr: HourlyPoint[] = [];
      if (weatherData.hourly?.time) {
        for (let i = 0; i < Math.min(48, weatherData.hourly.time.length); i++) {
          const d = new Date(weatherData.hourly.time[i]);
          hr.push({
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
      setHourly(hr);

      // Compute alerts
      setAlerts(evaluateAlerts(cur, fc));

    } catch (e) {
      setError('Failed to load weather. Check your connection.');
      console.warn('useTrekWeather error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (lat !== null && lon !== null) {
      const timer = setTimeout(() => {
        fetchTrekWeather(lat, lon);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [lat, lon, fetchTrekWeather]);

  return { current, forecast, hourly, alerts, loading, error };
}
