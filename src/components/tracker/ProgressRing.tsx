'use client';
import React from 'react';

interface ProgressRingProps {
  percent: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}

export default function ProgressRing({ percent, size = 160, stroke = 12, label, sublabel }: ProgressRingProps) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(100, percent) / 100) * circ;

  const color = percent >= 90 ? '#10b981' : percent >= 60 ? '#f59e0b' : percent >= 30 ? '#3b82f6' : '#6366f1';
  const glowColor = color;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        {/* Progress */}
        <circle cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 0.6s ease, stroke 0.4s ease',
            filter: `drop-shadow(0 0 8px ${glowColor}88)`,
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span style={{ fontSize: size * 0.2, fontWeight: 900, color, lineHeight: 1, fontFamily: 'monospace' }}>
          {Math.round(percent)}%
        </span>
        {label && (
          <span style={{ fontSize: size * 0.1, color: '#94a3b8', fontWeight: 700, marginTop: 2 }}>{label}</span>
        )}
        {sublabel && (
          <span style={{ fontSize: size * 0.085, color: '#64748b', fontWeight: 600, marginTop: 1 }}>{sublabel}</span>
        )}
      </div>
    </div>
  );
}
