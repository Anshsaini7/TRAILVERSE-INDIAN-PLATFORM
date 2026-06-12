'use client';

import React, { useState, useMemo } from 'react';
import { AreaChart, TrendingUp, Compass, ArrowUp, Milestone } from 'lucide-react';
import { motion } from 'framer-motion';

interface ElevationPoint {
  distance: number;
  elevation: number;
  label: string;
}

interface ElevationProfileProps {
  profile: ElevationPoint[];
  trekName: string;
}

export default function ElevationProfile({ profile, trekName }: ElevationProfileProps) {
  const [hoveredPoint, setHoveredPoint] = useState<ElevationPoint | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // SVG Dimension Constants
  const width = 600;
  const height = 250;
  const padding = { top: 30, right: 30, bottom: 40, left: 50 };

  // Calculate boundary ranges
  const minElev = useMemo(() => Math.min(...profile.map(p => p.elevation)), [profile]);
  const maxElev = useMemo(() => Math.max(...profile.map(p => p.elevation)), [profile]);
  const maxDist = useMemo(() => Math.max(...profile.map(p => p.distance)), [profile]);
  const totalGain = useMemo(() => {
    let gain = 0;
    for (let i = 1; i < profile.length; i++) {
      const diff = profile[i].elevation - profile[i - 1].elevation;
      if (diff > 0) gain += diff;
    }
    return gain;
  }, [profile]);

  // Project data points to SVG coordinates
  const points = useMemo(() => {
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Use minElev - 200 as base coordinate to make graph look dynamic
    const baseElev = Math.max(0, minElev - 200);
    const elevRange = maxElev - baseElev;

    return profile.map((p, index) => {
      const x = padding.left + (p.distance / maxDist) * chartWidth;
      const y = padding.top + chartHeight - ((p.elevation - baseElev) / elevRange) * chartHeight;
      return { x, y, raw: p, index };
    });
  }, [profile, minElev, maxElev, maxDist]);

  // Generate SVG path string for area fill and boundary line
  const { linePath, areaPath } = useMemo(() => {
    if (points.length === 0) return { linePath: '', areaPath: '' };

    let lPath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      // Use bezier curves or linear steps. Linear matches Strava style beautifully.
      lPath += ` L ${points[i].x} ${points[i].y}`;
    }

    const chartHeight = height - padding.bottom;
    const aPath = `${lPath} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

    return { linePath: lPath, areaPath: aPath };
  }, [points]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
      
      {/* Stats Bar */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-wider block">TRAIL GRADIENT</span>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">Elevation Profile</h3>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-800/80">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            <div>
              <span className="text-[9px] text-slate-400 font-bold block uppercase">Net Climb</span>
              <span className="text-xs font-black text-slate-800 dark:text-white">+{totalGain} meters</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-800/80">
            <ArrowUp className="h-5 w-5 text-emerald-500" />
            <div>
              <span className="text-[9px] text-slate-400 font-bold block uppercase">Peak Alt</span>
              <span className="text-xs font-black text-slate-800 dark:text-white">{maxElev} meters</span>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Elevation Drawing */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
        >
          {/* Y Axis Grid Lines */}
          {[0, 0.5, 1].map((ratio, i) => {
            const chartHeight = height - padding.top - padding.bottom;
            const y = padding.top + chartHeight * ratio;
            const baseElev = Math.max(0, minElev - 200);
            const value = Math.round(maxElev - ratio * (maxElev - baseElev));

            return (
              <g key={i} className="opacity-30 dark:opacity-20">
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  className="text-slate-400"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={9}
                  className="fill-slate-500 font-bold"
                >
                  {value}m
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            d={areaPath}
            fill="url(#elevation-gradient)"
          />

          {/* Stroke Outline */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            d={linePath}
            fill="none"
            stroke="#10b981"
            strokeWidth={3}
            strokeLinecap="round"
          />

          {/* Dotted checkpoints */}
          {points.map((pt) => {
            const isCheckpoint = pt.raw.label !== '' && pt.raw.label !== trekName;
            if (!isCheckpoint) return null;

            return (
              <g key={pt.index}>
                <line
                  x1={pt.x}
                  y1={pt.y}
                  x2={pt.x}
                  y2={height - padding.bottom}
                  stroke="rgba(148, 163, 184, 0.4)"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={5}
                  fill="#ffffff"
                  stroke="#10b981"
                  strokeWidth={2}
                  className="cursor-pointer hover:r-7 transition-all"
                  onMouseEnter={() => {
                    setHoveredPoint(pt.raw);
                    setHoverIndex(pt.index);
                  }}
                  onMouseLeave={() => {
                    setHoveredPoint(null);
                    setHoverIndex(null);
                  }}
                />
              </g>
            );
          })}

          {/* Highlight cursor marker */}
          {hoverIndex !== null && points[hoverIndex] && (
            <g>
              <line
                x1={points[hoverIndex].x}
                y1={padding.top}
                x2={points[hoverIndex].x}
                y2={height - padding.bottom}
                stroke="#10b981"
                strokeWidth={1.5}
                strokeDasharray="2 2"
              />
              <circle
                cx={points[hoverIndex].x}
                cy={points[hoverIndex].y}
                r={7}
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth={2}
              />
            </g>
          )}

          {/* X Axis distance marks */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const chartWidth = width - padding.left - padding.right;
            const x = padding.left + chartWidth * ratio;
            const dist = Math.round(maxDist * ratio);

            return (
              <text
                key={i}
                x={x}
                y={height - padding.bottom + 20}
                textAnchor="middle"
                fontSize={9}
                className="fill-slate-400 dark:fill-slate-500 font-bold"
              >
                {dist} km
              </text>
            );
          })}

          {/* Gradients */}
          <defs>
            <linearGradient id="elevation-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Checkpoint Detail Drawer */}
      <div className="mt-4">
        {hoveredPoint ? (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-4 py-3 rounded-2xl"
          >
            <Milestone className="h-5 w-5 text-emerald-500 shrink-0 animate-bounce" />
            <div className="text-xs">
              Checkpoint: <strong className="font-extrabold text-sm">{hoveredPoint.label}</strong> at <strong className="font-bold">{hoveredPoint.distance} km</strong> | Altitude: <strong className="font-extrabold text-sm">{hoveredPoint.elevation}m</strong>
            </div>
          </motion.div>
        ) : (
          <div className="text-center text-xs text-slate-400 py-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/50">
            Hover over the circular checkpoint nodes to inspect altitude details.
          </div>
        )}
      </div>

    </div>
  );
}
