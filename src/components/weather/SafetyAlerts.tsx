'use client';
import React from 'react';
import { WeatherAlert } from '../../hooks/useTrekWeather';

interface SafetyAlertsProps {
  alerts: WeatherAlert[];
  className?: string;
}

const LEVEL_STYLES = {
  safe: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-700/50',
    badge: 'bg-emerald-500',
    dot: 'bg-emerald-400',
    text: 'text-emerald-700 dark:text-emerald-300',
    sub: 'text-emerald-600/80 dark:text-emerald-400/70',
    label: 'SAFE',
  },
  caution: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-700/50',
    badge: 'bg-amber-500',
    dot: 'bg-amber-400',
    text: 'text-amber-800 dark:text-amber-200',
    sub: 'text-amber-700/80 dark:text-amber-400/70',
    label: 'CAUTION',
  },
  danger: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-700/50',
    badge: 'bg-red-500',
    dot: 'bg-red-400 animate-pulse',
    text: 'text-red-800 dark:text-red-200',
    sub: 'text-red-700/80 dark:text-red-400/70',
    label: 'DANGER',
  },
};

export default function SafetyAlerts({ alerts, className = '' }: SafetyAlertsProps) {
  if (alerts.length === 0) return null;

  const highestLevel = alerts.some(a => a.level === 'danger') ? 'danger'
    : alerts.some(a => a.level === 'caution') ? 'caution' : 'safe';

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          🛡️ Trek Safety Alerts
        </span>
        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full text-white uppercase tracking-wider ${LEVEL_STYLES[highestLevel].badge}`}>
          {LEVEL_STYLES[highestLevel].label}
        </span>
      </div>

      {/* Alert Cards */}
      <div className="flex flex-col gap-2">
        {alerts.map(alert => {
          const s = LEVEL_STYLES[alert.level];
          return (
            <div key={alert.id}
              className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${s.bg} ${s.border}`}>
              {/* Dot indicator */}
              <div className="flex items-center pt-0.5">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.dot}`} />
              </div>
              {/* Icon */}
              <span className="text-lg flex-shrink-0 leading-none mt-0.5">{alert.icon}</span>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black ${s.text}`}>{alert.title}</span>
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider text-white ${s.badge}`}>
                    {s.label}
                  </span>
                </div>
                <p className={`text-[10px] leading-relaxed mt-0.5 ${s.sub}`}>{alert.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 px-1">
        {(['safe','caution','danger'] as const).map(level => (
          <div key={level} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${LEVEL_STYLES[level].badge}`} />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{LEVEL_STYLES[level].label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
