'use client';
import React from 'react';
import { TrackPoint } from '../../context/TrekTrackerContext';

interface AltitudeGraphProps {
  points: TrackPoint[];
  height?: number;
  className?: string;
  showGain?: boolean;
}

export default function AltitudeGraph({ points, height = 120, className = '', showGain = true }: AltitudeGraphProps) {
  const W = 560;
  const PAD = { top: 20, bottom: 24, left: 44, right: 12 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = height - PAD.top - PAD.bottom;

  // Filter valid altitude points
  const valid = points.filter(p => p.altitude > 0);
  if (valid.length < 2) {
    return (
      <div className={`flex items-center justify-center text-xs text-slate-500 font-semibold ${className}`} style={{ height }}>
        Altitude data will appear once tracking starts and GPS altitude is available…
      </div>
    );
  }

  const altitudes = valid.map(p => p.altitude);
  const minAlt = Math.min(...altitudes);
  const maxAlt = Math.max(...altitudes);
  const range = maxAlt - minAlt || 1;

  const toX = (i: number) => PAD.left + (i / (valid.length - 1)) * chartW;
  const toY = (a: number) => PAD.top + chartH - ((a - minAlt) / range) * chartH;

  // Bezier path
  const pts = valid.map((p, i) => ({ x: toX(i), y: toY(p.altitude) }));
  let path = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cpx = (pts[i - 1].x + pts[i].x) / 2;
    path += ` C ${cpx} ${pts[i - 1].y}, ${cpx} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`;
  }
  let areaPath = path;
  areaPath += ` L ${pts[pts.length - 1].x} ${PAD.top + chartH}`;
  areaPath += ` L ${pts[0].x} ${PAD.top + chartH} Z`;

  // Gain label
  let gainM = 0;
  for (let i = 1; i < valid.length; i++) {
    const diff = valid[i].altitude - valid[i - 1].altitude;
    if (diff > 0) gainM += diff;
  }

  const tickEvery = Math.max(1, Math.floor(valid.length / 5));
  const altTicks = [minAlt, minAlt + range * 0.5, maxAlt];

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">⛰️ Altitude Profile</span>
        {showGain && gainM > 0 && (
          <span className="text-[10px] font-black text-emerald-400">+{Math.round(gainM)}m gain</span>
        )}
      </div>
      <div className="overflow-x-auto">
        <svg width={W} height={height} viewBox={`0 0 ${W} ${height}`} style={{ minWidth: Math.min(W, 320) }}>
          <defs>
            <linearGradient id="alt-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="alt-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Grid */}
          {altTicks.map((a, i) => {
            const y = toY(a);
            return (
              <g key={i}>
                <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
                  stroke="#1e293b" strokeWidth="1" strokeDasharray="3,6" />
                <text x={PAD.left - 4} y={y + 4} textAnchor="end" fontSize="8" fill="#475569" fontWeight="700">
                  {Math.round(a)}m
                </text>
              </g>
            );
          })}

          {/* Area */}
          <path d={areaPath} fill="url(#alt-fill)" />
          {/* Line */}
          <path d={path} fill="none" stroke="url(#alt-line)" strokeWidth="2.5" strokeLinecap="round" />

          {/* Points */}
          {valid.map((p, i) => {
            if (i % tickEvery !== 0) return null;
            const x = toX(i);
            const y = toY(p.altitude);
            const timeStr = new Date(p.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="3" fill="#10b981" stroke="#0f172a" strokeWidth="1.5" />
                <text x={x} y={height - PAD.bottom + 12} textAnchor="middle" fontSize="7" fill="#475569">{timeStr}</text>
              </g>
            );
          })}

          {/* Current position dot */}
          {pts.length > 0 && (
            <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="5"
              fill="#f59e0b" stroke="#0f172a" strokeWidth="2"
              style={{ filter: 'drop-shadow(0 0 4px #f59e0b)' }} />
          )}
        </svg>
      </div>
    </div>
  );
}
