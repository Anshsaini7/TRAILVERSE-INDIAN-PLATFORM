'use client';
import React from 'react';

type IconName = 'Sun' | 'CloudSun' | 'Cloud' | 'CloudDrizzle' | 'CloudRain' | 'Snowflake' | 'CloudLightning' | string;
type IconSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<IconSize, string> = {
  sm: '28',
  md: '48',
  lg: '72',
  xl: '96',
};

export default function WeatherIcon({ name, size = 'md', className = '' }: { name: IconName; size?: IconSize; className?: string }) {
  const s = SIZE_MAP[size] || '48';

  switch (name) {
    case 'Sun':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" className={className}>
          <defs>
            <radialGradient id="wicon-sun-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="wicon-sun-body" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill="url(#wicon-sun-glow)" />
          <circle cx="50" cy="50" r="27" fill="url(#wicon-sun-body)" />
          {[0,45,90,135,180,225,270,315].map(a => (
            <line key={a} x1="50" y1="50"
              x2={50 + 42 * Math.sin(a * Math.PI/180)}
              y2={50 - 42 * Math.cos(a * Math.PI/180)}
              stroke="#fbbf24" strokeWidth="4" strokeLinecap="round"
              strokeDasharray="6,14"
            />
          ))}
        </svg>
      );

    case 'CloudSun':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" className={className}>
          <defs>
            <linearGradient id="wicon-cs-sun" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="wicon-cs-cloud" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
          </defs>
          <circle cx="65" cy="32" r="18" fill="url(#wicon-cs-sun)" />
          <path d="M20 70 c-6 0 -12 -5 -12 -12 c0 -6 4 -11 10 -12 c1 -8 8 -16 18 -16 c8 0 14 5 17 11 c3 -2 7 -3 11 -3 c10 0 18 8 18 18 c0 10 -8 14 -18 14 z"
            fill="url(#wicon-cs-cloud)" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.15))" />
        </svg>
      );

    case 'Cloud':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" className={className}>
          <defs>
            <linearGradient id="wicon-cloud" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>
          <path d="M18 65 c-8 0 -14 -6 -14 -14 c0 -7 5 -13 12 -14 c1 -10 9 -18 20 -18 c9 0 16 5 19 13 c4 -2 8 -3 12 -3 c12 0 22 10 22 22 c0 12 -10 14 -22 14 z"
            fill="url(#wicon-cloud)" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.12))" />
        </svg>
      );

    case 'CloudDrizzle':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" className={className}>
          <defs>
            <linearGradient id="wicon-drizzle-cloud" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </linearGradient>
          </defs>
          <path d="M15 55 c-7 0 -12 -5 -12 -12 c0 -6 4 -11 10 -12 c1 -8 8 -14 17 -14 c8 0 14 4 17 10 c3 -1 6 -2 10 -2 c10 0 18 8 18 18 c0 9 -8 12 -18 12 z"
            fill="url(#wicon-drizzle-cloud)" filter="drop-shadow(0 3px 5px rgba(0,0,0,0.1))" />
          {[[30,72],[45,78],[60,72],[75,78]].map(([cx,cy],i) => (
            <ellipse key={i} cx={cx} cy={cy} rx="3" ry="5" fill="#38bdf8" opacity="0.8" />
          ))}
        </svg>
      );

    case 'CloudRain':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" className={className}>
          <defs>
            <linearGradient id="wicon-rain-cloud" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#bfdbfe" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
          <path d="M15 52 c-7 0 -12 -5 -12 -12 c0 -6 4 -11 10 -12 c1 -8 8 -14 17 -14 c8 0 14 4 17 10 c3 -1 6 -2 10 -2 c10 0 18 8 18 18 c0 9 -8 12 -18 12 z"
            fill="url(#wicon-rain-cloud)" filter="drop-shadow(0 3px 8px rgba(0,0,0,0.15))" />
          {[[25,70],[40,78],[55,70],[70,78],[82,68]].map(([x1,y1],i) => (
            <line key={i} x1={x1} y1={y1} x2={x1-4} y2={y1+14} stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
          ))}
        </svg>
      );

    case 'Snowflake':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" className={className}>
          <defs>
            <linearGradient id="wicon-snow-cloud" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#bae6fd" />
            </linearGradient>
          </defs>
          <path d="M12 50 c-6 0 -10 -4 -10 -10 c0 -5 3 -9 8 -10 c1 -7 7 -12 14 -12 c7 0 12 4 14 9 c3 -1 5 -2 8 -2 c9 0 15 7 15 15 c0 8 -6 10 -15 10 z"
            fill="url(#wicon-snow-cloud)" filter="drop-shadow(0 2px 5px rgba(0,0,0,0.1))" />
          {[[30,75],[50,70],[70,75],[40,85],[60,85]].map(([cx,cy],i) => (
            <g key={i} transform={`translate(${cx},${cy})`}>
              {[0,60,120].map(a => (
                <line key={a} x1="0" y1="-6" x2="0" y2="6"
                  transform={`rotate(${a})`}
                  stroke="#7dd3fc" strokeWidth="2.5" strokeLinecap="round" />
              ))}
              <circle cx="0" cy="0" r="2" fill="#38bdf8" />
            </g>
          ))}
        </svg>
      );

    case 'CloudLightning':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" className={className}>
          <defs>
            <linearGradient id="wicon-lightning-cloud" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ddd6fe" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          <path d="M15 52 c-7 0 -12 -5 -12 -12 c0 -6 4 -11 10 -12 c1 -8 8 -14 17 -14 c8 0 14 4 17 10 c3 -1 6 -2 10 -2 c10 0 18 8 18 18 c0 9 -8 12 -18 12 z"
            fill="url(#wicon-lightning-cloud)" filter="drop-shadow(0 3px 8px rgba(0,0,0,0.15))" />
          <polygon points="48,56 38,72 47,72 42,88 62,66 51,66 58,56"
            fill="#fbbf24" filter="drop-shadow(0 0 6px #fbbf24)" />
        </svg>
      );

    default:
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="40" fill="#94a3b8" opacity="0.4" />
          <text x="50" y="58" textAnchor="middle" fontSize="32" fill="#64748b">?</text>
        </svg>
      );
  }
}
