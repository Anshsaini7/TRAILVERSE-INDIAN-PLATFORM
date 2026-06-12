'use client';
import React from 'react';
import { useWeather, HourlyPoint } from '../../context/WeatherContext';

interface TempTrendChartProps {
  hourly: HourlyPoint[];
  hours?: number;
  className?: string;
}

export default function TempTrendChart({ hourly, hours = 24, className = '' }: TempTrendChartProps) {
  const { convertTemp, unit } = useWeather();
  const data = hourly.slice(0, hours);
  if (data.length < 2) return null;

  const W = 600, H = 140, PAD = { top: 28, bottom: 28, left: 32, right: 16 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const rawTemps = data.map(h => convertTemp(h.temp));
  const minT = Math.min(...rawTemps);
  const maxT = Math.max(...rawTemps);
  const range = maxT - minT || 1;

  const toX = (i: number) => PAD.left + (i / (data.length - 1)) * chartW;
  const toY = (t: number) => PAD.top + chartH - ((t - minT) / range) * chartH;

  // Build smooth cubic bezier path
  const points = data.map((h, i) => ({ x: toX(i), y: toY(convertTemp(h.temp)) }));

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const cp1x = (points[i - 1].x + points[i].x) / 2;
    const cp1y = points[i - 1].y;
    const cp2x = (points[i - 1].x + points[i].x) / 2;
    const cp2y = points[i].y;
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i].x} ${points[i].y}`;
  }

  // Filled area path
  let areaPath = path;
  areaPath += ` L ${points[points.length - 1].x} ${H - PAD.bottom}`;
  areaPath += ` L ${points[0].x} ${H - PAD.bottom} Z`;

  // Tick labels (every 3 hours or so)
  const tickEvery = Math.max(1, Math.floor(data.length / 8));

  return (
    <div className={className}>
      <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
        🌡️ Temperature Trend — Next {hours}h
      </div>
      <div className="overflow-x-auto">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ minWidth: W }}>
          <defs>
            <linearGradient id="ttc-area-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="ttc-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0,0.33,0.67,1].map((t,i) => (
            <line key={i}
              x1={PAD.left} y1={PAD.top + t * chartH}
              x2={W - PAD.right} y2={PAD.top + t * chartH}
              stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />
          ))}

          {/* Area fill */}
          <path d={areaPath} fill="url(#ttc-area-fill)" />

          {/* Line */}
          <path d={path} fill="none" stroke="url(#ttc-line)" strokeWidth="2.5" strokeLinecap="round" />

          {/* Data points + labels */}
          {data.map((h, i) => {
            if (i % tickEvery !== 0) return null;
            const x = toX(i);
            const y = toY(convertTemp(h.temp));
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="3.5" fill="#f59e0b" stroke="#0f172a" strokeWidth="1.5" />
                <text x={x} y={y - 8} textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="900">
                  {convertTemp(h.temp)}°
                </text>
                <text x={x} y={H - PAD.bottom + 12} textAnchor="middle" fontSize="8" fill="#64748b">
                  {h.time.replace(':00','').toLowerCase()}
                </text>
              </g>
            );
          })}

          {/* Y-axis labels */}
          <text x={PAD.left - 4} y={PAD.top + 4} textAnchor="end" fontSize="9" fill="#94a3b8">{maxT}°{unit}</text>
          <text x={PAD.left - 4} y={H - PAD.bottom} textAnchor="end" fontSize="9" fill="#94a3b8">{minT}°{unit}</text>
        </svg>
      </div>
    </div>
  );
}
