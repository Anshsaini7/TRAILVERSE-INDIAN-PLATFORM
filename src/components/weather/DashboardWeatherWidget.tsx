'use client';
import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import WeatherIcon from './WeatherIcon';
import LiveClock from './LiveClock';
import ForecastStrip from './ForecastStrip';
import { MapPin, Loader2 } from 'lucide-react';

export default function DashboardWeatherWidget({ className = '' }: { className?: string }) {
  const { userLocation, userWeather, userForecast, loading, locationLoading, formatTemp, forecastDays } = useWeather();

  if (locationLoading || loading) {
    return (
      <div className={`rounded-2xl flex items-center justify-center p-10 ${className}`}
        style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a5f)' }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <span className="text-xs font-bold text-slate-400">Detecting your location & fetching live weather…</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl overflow-hidden ${className}`}
      style={{ background: 'linear-gradient(155deg,#0f172a 0%,#1a2e4a 50%,#0d1f17 100%)' }}>

      {/* Top: Location + Clock */}
      <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-4 border-b border-white/5">
        <div className="flex-1 min-w-0">
          {userLocation ? (
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="text-sm font-black text-white truncate">{userLocation.city}</span>
              </div>
              <div className="text-[10px] text-slate-400 ml-5">{userLocation.state}{userLocation.state && userLocation.country ? ', ' : ''}{userLocation.country}</div>
              <div className="text-[9px] text-slate-600 ml-5 mt-0.5">
                {userLocation.lat.toFixed(4)}°N · {userLocation.lon.toFixed(4)}°E
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500">Location unavailable</div>
          )}
        </div>
        <LiveClock compact showDate showTimezone={false} className="flex-shrink-0" />
      </div>

      {/* Current Weather */}
      {userWeather ? (
        <div className="px-5 py-4 flex items-center gap-4 border-b border-white/5">
          <WeatherIcon name={userWeather.conditionIcon} size="lg" />
          <div className="flex-1">
            <div className="text-5xl font-black text-white leading-none">{formatTemp(userWeather.temp)}</div>
            <div className="text-sm text-slate-300 mt-1">{userWeather.conditionText}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Feels {formatTemp(userWeather.feelsLike)} · 💧{userWeather.humidity}% · 💨{userWeather.windSpeed} km/h
            </div>
          </div>
          <div className="text-right flex flex-col gap-1.5">
            <div className="text-[9px] font-black px-2 py-0.5 rounded-full text-white uppercase tracking-wider"
              style={{ background: userWeather.aqi <= 50 ? '#10b981' : userWeather.aqi <= 100 ? '#f59e0b' : '#ef4444' }}>
              AQI {userWeather.aqiLabel}
            </div>
            <div className="text-[10px] text-slate-400">☀️ UV {userWeather.uvIndex}</div>
            <div className="text-[10px] text-slate-400">🌅 {userWeather.sunrise}</div>
            <div className="text-[10px] text-slate-400">🌇 {userWeather.sunset}</div>
          </div>
        </div>
      ) : (
        <div className="px-5 py-6 text-center text-xs text-slate-500">Weather data unavailable</div>
      )}

      {/* Forecast Strip */}
      {userForecast.length > 0 && (
        <div className="px-3 py-4">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 mb-2">
            {forecastDays}-Day Forecast
          </div>
          <ForecastStrip forecast={userForecast} maxDays={forecastDays} />
        </div>
      )}
    </div>
  );
}
