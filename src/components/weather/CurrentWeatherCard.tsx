'use client';
import React from 'react';
import WeatherIcon from './WeatherIcon';
import { useWeather, WeatherCurrent, UserLocation } from '../../context/WeatherContext';
import { Droplets, Wind, Eye, Sun, Sunrise, Sunset, Gauge } from 'lucide-react';

interface CurrentWeatherCardProps {
  weather: WeatherCurrent;
  location?: UserLocation | { city: string; state?: string; country?: string } | null;
  title?: string;
  compact?: boolean;
  className?: string;
}

const AQI_COLORS: Record<string, string> = {
  'Good': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'Moderate': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  'Unhealthy for Sensitive': 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  'Unhealthy': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  'Very Unhealthy': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  'Hazardous': 'bg-rose-900 text-rose-100 dark:bg-rose-900 dark:text-rose-100',
};

export default function CurrentWeatherCard({ weather, location, title, compact = false, className = '' }: CurrentWeatherCardProps) {
  const { formatTemp } = useWeather();

  const aqiClass = AQI_COLORS[weather.aqiLabel] || AQI_COLORS['Good'];

  const uvColor = weather.uvIndex >= 11 ? 'text-red-500' : weather.uvIndex >= 8 ? 'text-orange-500' : weather.uvIndex >= 6 ? 'text-yellow-500' : 'text-emerald-500';

  if (compact) {
    return (
      <div className={`rounded-2xl overflow-hidden ${className}`}
        style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 60%,#0f2e1e 100%)' }}>
        <div className="p-4 flex items-center gap-4">
          <WeatherIcon name={weather.conditionIcon} size="md" />
          <div className="flex-1 min-w-0">
            {location && (
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 truncate">
                {'city' in (location as any) ? (location as any).city : ''}{(location as any).state ? `, ${(location as any).state}` : ''}
              </div>
            )}
            <div className="text-3xl font-black text-white">{formatTemp(weather.temp)}</div>
            <div className="text-xs text-slate-300 mt-0.5">{weather.conditionText} · Feels {formatTemp(weather.feelsLike)}</div>
          </div>
          <div className="text-right">
            <div className={`inline-block text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${aqiClass}`}>
              AQI {weather.aqiLabel}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">💧 {weather.humidity}%</div>
            <div className="text-[10px] text-slate-400">💨 {weather.windSpeed} km/h</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl overflow-hidden ${className}`}
      style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0d2b1e 100%)' }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-start justify-between">
        <div>
          {title && <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">{title}</div>}
          {location && (
            <div className="text-sm font-bold text-white/80">
              {'city' in (location as any) ? (location as any).city : ''}
              {(location as any).state ? <span className="text-white/50">, {(location as any).state}</span> : ''}
            </div>
          )}
        </div>
        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${aqiClass}`}>
          AQI · {weather.aqiLabel}
        </span>
      </div>

      {/* Main Temp + Icon */}
      <div className="px-5 pb-4 flex items-center gap-4">
        <WeatherIcon name={weather.conditionIcon} size="lg" />
        <div>
          <div className="text-6xl font-black text-white leading-none">{formatTemp(weather.temp)}</div>
          <div className="text-base font-semibold text-slate-300 mt-1">{weather.conditionText}</div>
          <div className="text-xs text-slate-400 mt-0.5">Feels like {formatTemp(weather.feelsLike)}</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mx-4 mb-4 grid grid-cols-3 gap-2">
        {[
          { icon: <Droplets className="w-3.5 h-3.5" />, label: 'Humidity', value: `${weather.humidity}%`, color: 'text-blue-300' },
          { icon: <Wind className="w-3.5 h-3.5" />, label: 'Wind', value: `${weather.windSpeed} km/h`, color: 'text-slate-300' },
          { icon: <Eye className="w-3.5 h-3.5" />, label: 'Visibility', value: `${weather.visibility} km`, color: 'text-slate-300' },
          { icon: <Sun className="w-3.5 h-3.5" />, label: 'UV Index', value: `${weather.uvIndex}`, color: uvColor },
          { icon: <span className="text-xs">🌅</span>, label: 'Sunrise', value: weather.sunrise, color: 'text-amber-300' },
          { icon: <span className="text-xs">🌇</span>, label: 'Sunset', value: weather.sunset, color: 'text-orange-300' },
        ].map(stat => (
          <div key={stat.label} className="bg-white/5 rounded-xl p-2.5 text-center">
            <div className={`flex items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1`}>
              <span className={stat.color}>{stat.icon}</span>{stat.label}
            </div>
            <div className={`text-xs font-black ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
