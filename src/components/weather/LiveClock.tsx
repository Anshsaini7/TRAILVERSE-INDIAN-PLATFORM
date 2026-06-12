'use client';
import React, { useState, useEffect } from 'react';
import { useWeather } from '../../context/WeatherContext';

interface LiveClockProps {
  compact?: boolean;
  showDate?: boolean;
  showTimezone?: boolean;
  className?: string;
  textColorClass?: string;
  dateColorClass?: string;
  timezoneColorClass?: string;
}

export default function LiveClock({ 
  compact = false, 
  showDate = true, 
  showTimezone = true, 
  className = '',
  textColorClass = '',
  dateColorClass = '',
  timezoneColorClass = ''
}: LiveClockProps) {
  const { timeFormat } = useWeather();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setNow(new Date());
    }, 0);
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!now) return null;

  const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const dayName = DAY_NAMES[now.getDay()];
  const date = now.getDate();
  const month = MONTH_NAMES[now.getMonth()];
  const year = now.getFullYear();

  const h24 = now.getHours();
  const min = String(now.getMinutes()).padStart(2,'0');
  const sec = String(now.getSeconds()).padStart(2,'0');

  let timeStr: string;
  if (timeFormat === '12h') {
    const h12 = h24 % 12 || 12;
    const ampm = h24 >= 12 ? 'PM' : 'AM';
    timeStr = `${String(h12).padStart(2,'0')}:${min}:${sec} ${ampm}`;
  } else {
    timeStr = `${String(h24).padStart(2,'0')}:${min}:${sec}`;
  }

  // Attempt timezone abbreviation
  let tz = '';
  if (showTimezone) {
    try {
      tz = Intl.DateTimeFormat('en-IN', { timeZoneName: 'short' })
        .formatToParts(now)
        .find(p => p.type === 'timeZoneName')?.value ?? '';
    } catch {}
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="text-center">
          <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '20px', letterSpacing: '0.04em' }}
            className={textColorClass || 'text-slate-800 dark:text-white'}>{timeStr}</div>
          {showDate && (
            <div className={`text-[10px] font-semibold mt-0.5 ${dateColorClass || 'text-slate-400 dark:text-slate-500'}`}>
              {dayName.slice(0,3)}, {date} {month.slice(0,3)} {year}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {showDate && (
        <div className={`text-sm font-bold tracking-wide mb-1 ${dateColorClass || 'text-slate-500 dark:text-slate-400'}`}>
          {dayName}, {date} {month} {year}
        </div>
      )}
      <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '36px', letterSpacing: '0.06em', lineHeight: 1 }}
        className={`tabular-nums ${textColorClass || 'text-slate-800 dark:text-white'}`}>
        {timeStr}
      </div>
      {showTimezone && tz && (
        <div className={`text-[10px] font-semibold uppercase tracking-widest mt-1 ${timezoneColorClass || 'text-emerald-500'}`}>{tz}</div>
      )}
    </div>
  );
}
