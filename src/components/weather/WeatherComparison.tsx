'use client';
import React from 'react';
import WeatherIcon from './WeatherIcon';
import { useWeather, WeatherCurrent } from '../../context/WeatherContext';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface WeatherComparisonProps {
  cityWeather: WeatherCurrent | null;
  cityName: string;
  trekWeather: WeatherCurrent | null;
  trekName: string;
  className?: string;
}

function DiffBadge({ diff, unit }: { diff: number; unit: string }) {
  if (Math.abs(diff) < 0.5) return <span className="text-[9px] text-slate-400 flex items-center gap-0.5"><Minus className="w-3 h-3"/>Same</span>;
  if (diff > 0) return <span className="text-[9px] text-emerald-400 flex items-center gap-0.5"><TrendingUp className="w-3 h-3"/>+{Math.round(diff)}{unit}</span>;
  return <span className="text-[9px] text-blue-400 flex items-center gap-0.5"><TrendingDown className="w-3 h-3"/>{Math.round(diff)}{unit}</span>;
}

export default function WeatherComparison({ cityWeather, cityName, trekWeather, trekName, className = '' }: WeatherComparisonProps) {
  const { formatTemp, convertTemp } = useWeather();

  const rows = [
    { label: 'Temperature', cityVal: cityWeather ? formatTemp(cityWeather.temp) : '--', trekVal: trekWeather ? formatTemp(trekWeather.temp) : '--', diff: cityWeather && trekWeather ? convertTemp(trekWeather.temp) - convertTemp(cityWeather.temp) : null, unit: '°' },
    { label: 'Feels Like', cityVal: cityWeather ? formatTemp(cityWeather.feelsLike) : '--', trekVal: trekWeather ? formatTemp(trekWeather.feelsLike) : '--', diff: cityWeather && trekWeather ? convertTemp(trekWeather.feelsLike) - convertTemp(cityWeather.feelsLike) : null, unit: '°' },
    { label: 'Humidity', cityVal: cityWeather ? `${cityWeather.humidity}%` : '--', trekVal: trekWeather ? `${trekWeather.humidity}%` : '--', diff: cityWeather && trekWeather ? trekWeather.humidity - cityWeather.humidity : null, unit: '%' },
    { label: 'Wind Speed', cityVal: cityWeather ? `${cityWeather.windSpeed} km/h` : '--', trekVal: trekWeather ? `${trekWeather.windSpeed} km/h` : '--', diff: cityWeather && trekWeather ? trekWeather.windSpeed - cityWeather.windSpeed : null, unit: ' km/h' },
    { label: 'UV Index', cityVal: cityWeather ? `${cityWeather.uvIndex}` : '--', trekVal: trekWeather ? `${trekWeather.uvIndex}` : '--', diff: cityWeather && trekWeather ? trekWeather.uvIndex - cityWeather.uvIndex : null, unit: '' },
  ];

  return (
    <div className={`rounded-2xl overflow-hidden ${className}`}
      style={{ background: 'linear-gradient(135deg,rgba(15,23,42,0.97) 0%,rgba(30,41,59,0.97) 100%)', border: '1px solid rgba(100,116,139,0.15)' }}>
      <div className="px-5 pt-4 pb-3 border-b border-white/5">
        <div className="text-xs font-black text-slate-400 uppercase tracking-widest">⚖️ Weather Comparison</div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-3 px-5 pt-3 pb-2 border-b border-white/5">
        <div className="text-center">
          {cityWeather && <WeatherIcon name={cityWeather.conditionIcon} size="sm" className="mx-auto mb-1" />}
          <div className="text-[10px] font-black text-emerald-400 truncate">{cityName}</div>
          <div className="text-[9px] text-slate-500">{cityWeather?.conditionText ?? '—'}</div>
        </div>
        <div className="text-center flex items-center justify-center">
          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">VS</span>
        </div>
        <div className="text-center">
          {trekWeather && <WeatherIcon name={trekWeather.conditionIcon} size="sm" className="mx-auto mb-1" />}
          <div className="text-[10px] font-black text-blue-400 truncate">{trekName}</div>
          <div className="text-[9px] text-slate-500">{trekWeather?.conditionText ?? '—'}</div>
        </div>
      </div>

      {/* Comparison rows */}
      <div className="px-4 py-2 divide-y divide-white/5">
        {rows.map(row => (
          <div key={row.label} className="grid grid-cols-3 py-2 items-center">
            <div className="text-xs font-black text-amber-300 tabular-nums text-center">{row.cityVal}</div>
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-wider">{row.label}</span>
              {row.diff !== null && <DiffBadge diff={row.diff} unit={row.unit} />}
            </div>
            <div className="text-xs font-black text-blue-300 tabular-nums text-center">{row.trekVal}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
