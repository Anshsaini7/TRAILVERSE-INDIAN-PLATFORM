'use client';
import React from 'react';
import WeatherIcon from './WeatherIcon';
import { useWeather, ForecastDay } from '../../context/WeatherContext';
import { Droplets, Wind } from 'lucide-react';

interface ForecastStripProps {
  forecast: ForecastDay[];
  maxDays?: 7 | 14;
  className?: string;
}

export default function ForecastStrip({ forecast, maxDays = 7, className = '' }: ForecastStripProps) {
  const { formatTemp } = useWeather();
  const days = forecast.slice(0, maxDays);

  if (days.length === 0) return null;

  const allMaxes = days.map(d => d.tempMax);
  const allMins = days.map(d => d.tempMin);
  const absMax = Math.max(...allMaxes);
  const absMin = Math.min(...allMins);
  const range = absMax - absMin || 1;

  return (
    <div className={`overflow-x-auto pb-1 ${className}`} style={{ scrollbarWidth: 'thin' }}>
      <div className="flex gap-2 min-w-max px-1">
        {days.map((day, i) => {
          const barTop = ((absMax - day.tempMax) / range) * 40;
          const barHeight = ((day.tempMax - day.tempMin) / range) * 40 + 10;
          const rainColor = day.rainProb >= 70 ? '#3b82f6' : day.rainProb >= 40 ? '#60a5fa' : '#bfdbfe';

          return (
            <div key={i}
              className="flex flex-col items-center rounded-2xl px-3 py-3 min-w-[90px] border border-white/10"
              style={{
                background: i === 0
                  ? 'linear-gradient(160deg,rgba(16,185,129,0.18) 0%,rgba(59,130,246,0.10) 100%)'
                  : 'rgba(255,255,255,0.04)',
                boxShadow: i === 0 ? '0 0 0 1px rgba(16,185,129,0.3)' : 'none'
              }}>
              {/* Day name */}
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{day.dayName}</div>
              <div className="text-[9px] text-slate-500 dark:text-slate-600 mb-1">{day.date}</div>

              {/* Icon */}
              <WeatherIcon name={day.conditionIcon} size="sm" />

              {/* Condition */}
              <div className="text-[9px] font-semibold text-slate-400 text-center mt-1 leading-tight max-w-[72px]">{day.conditionText}</div>

              {/* Temperature bar */}
              <div className="relative w-2 mx-auto my-2" style={{ height: '60px' }}>
                <div className="absolute inset-0 rounded-full bg-slate-700/30" />
                <div className="absolute left-0 right-0 rounded-full"
                  style={{
                    top: `${barTop + 10}px`,
                    height: `${barHeight}px`,
                    background: 'linear-gradient(to bottom, #f59e0b, #3b82f6)',
                    borderRadius: '4px'
                  }} />
              </div>

              {/* Max / Min */}
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[11px] font-black text-amber-400">{formatTemp(day.tempMax)}</span>
                <span className="text-[10px] font-bold text-blue-400">{formatTemp(day.tempMin)}</span>
              </div>

              {/* Rain + Wind */}
              <div className="flex items-center gap-1 mt-2">
                <Droplets className="w-2.5 h-2.5" style={{ color: rainColor }} />
                <span className="text-[9px] font-bold" style={{ color: rainColor }}>{day.rainProb}%</span>
              </div>
              {day.snowDepth > 0 && (
                <div className="text-[9px] font-bold text-blue-300 mt-0.5">❄️ {day.snowDepth}cm</div>
              )}
              <div className="flex items-center gap-1 mt-0.5">
                <Wind className="w-2.5 h-2.5 text-slate-500" />
                <span className="text-[9px] text-slate-500">{day.windSpeed}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
