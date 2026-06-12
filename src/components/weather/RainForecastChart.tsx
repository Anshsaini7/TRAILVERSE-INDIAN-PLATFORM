'use client';
import React from 'react';
import { HourlyPoint } from '../../context/WeatherContext';

interface RainForecastChartProps {
  hourly: HourlyPoint[];
  showSnow?: boolean;
  hours?: number;
  className?: string;
}

export default function RainForecastChart({ hourly, showSnow = false, hours = 24, className = '' }: RainForecastChartProps) {
  const data = hourly.slice(0, hours);
  if (data.length === 0) return null;

  const W = 600, H = 110, PAD = { top: 20, bottom: 28, left: 32, right: 16 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const barW = chartW / data.length * 0.65;
  const tickEvery = Math.max(1, Math.floor(data.length / 8));

  const values = showSnow ? data.map(h => h.snowDepth) : data.map(h => h.precipProb);
  const maxVal = Math.max(...values, 1);

  const barColor = showSnow
    ? (v: number) => v > 0 ? '#93c5fd' : '#1e3a5f'
    : (v: number) => v >= 70 ? '#2563eb' : v >= 40 ? '#3b82f6' : '#bfdbfe';

  return (
    <div className={className}>
      <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
        {showSnow ? '❄️ Snow Depth — Next ' : '🌧️ Rain Probability — Next '}{hours}h
      </div>
      <div className="overflow-x-auto">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ minWidth: W }}>
          {/* Grid */}
          {[0, 0.5, 1].map((t, i) => (
            <g key={i}>
              <line x1={PAD.left} y1={PAD.top + t * chartH} x2={W - PAD.right} y2={PAD.top + t * chartH}
                stroke="#334155" strokeWidth="1" strokeDasharray="3,5" />
              <text x={PAD.left - 4} y={PAD.top + t * chartH + 4} textAnchor="end" fontSize="8" fill="#475569">
                {Math.round(maxVal * (1 - t))}{showSnow ? 'cm' : '%'}
              </text>
            </g>
          ))}

          {/* Bars */}
          {data.map((h, i) => {
            const val = values[i];
            const barH = (val / maxVal) * chartH;
            const x = PAD.left + (i / data.length) * chartW + (chartW / data.length - barW) / 2;
            const y = PAD.top + chartH - barH;
            return (
              <g key={i}>
                <rect x={x} y={y} width={barW} height={barH}
                  fill={barColor(val)} rx="2"
                  opacity={val > 0 ? 1 : 0.15} />
                {i % tickEvery === 0 && (
                  <text x={x + barW / 2} y={H - PAD.bottom + 12} textAnchor="middle" fontSize="8" fill="#64748b">
                    {h.time.replace(':00','').toLowerCase()}
                  </text>
                )}
                {val >= 30 && (
                  <text x={x + barW / 2} y={y - 3} textAnchor="middle" fontSize="8" fill={showSnow ? '#93c5fd' : '#60a5fa'} fontWeight="bold">
                    {val}{showSnow ? '' : '%'}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
