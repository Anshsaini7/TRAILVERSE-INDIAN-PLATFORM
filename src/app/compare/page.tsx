'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { treks, Trek } from '../../data/mockData';
import { Scale, ArrowRight, X, Trash2, ArrowUpDown, ChevronRight, Activity, Calendar, Compass, Thermometer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrekCompare() {
  const [selectedTrekIds, setSelectedTrekIds] = useState<string[]>([
    treks[0]?.id || '',
    treks[1]?.id || '',
    treks[2]?.id || ''
  ].filter(Boolean));

  const selectedTreks = useMemo(() => {
    return selectedTrekIds.map(id => treks.find(t => t.id === id)).filter(Boolean) as Trek[];
  }, [selectedTrekIds]);

  const availableTreks = useMemo(() => {
    return treks.filter(t => !selectedTrekIds.includes(t.id));
  }, [selectedTrekIds]);

  const addTrekSlot = (id: string) => {
    if (selectedTrekIds.length >= 3) return;
    setSelectedTrekIds(prev => [...prev, id]);
  };

  const removeTrekSlot = (idx: number) => {
    setSelectedTrekIds(prev => prev.filter((_, i) => i !== idx));
  };

  const changeTrekSlot = (idx: number, newId: string) => {
    setSelectedTrekIds(prev => {
      const copy = [...prev];
      copy[idx] = newId;
      return copy;
    });
  };

  // Find max values for visual scale comparisons
  const maxAltitude = 6500; // Reference peak limit
  const maxDistance = 70;   // Reference distance limit
  const maxDuration = 15;   // Reference duration limit

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500 font-extrabold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-3">
          <Scale className="h-3.5 w-3.5" />
          Comparison Portal
        </span>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Compare Trekking Routes
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          Analyse altitude climbs, distances, difficulty, package costs, and season details side-by-side to make the right choice.
        </p>
      </div>

      {/* Selector slots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, idx) => {
          const matchedTrek = selectedTreks[idx];
          
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between gap-4 relative min-h-[140px]">
              
              {/* Slot Header */}
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  SLOT {idx + 1}
                </span>
                {matchedTrek && selectedTrekIds.length > 1 && (
                  <button
                    onClick={() => removeTrekSlot(idx)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors cursor-pointer"
                    title="Remove trek from slot"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {matchedTrek ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={matchedTrek.image}
                      alt={matchedTrek.name}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                        {matchedTrek.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-semibold">{matchedTrek.state}</span>
                    </div>
                  </div>

                  {/* Dropdown switch */}
                  <select
                    value={matchedTrek.id}
                    onChange={(e) => changeTrekSlot(idx, e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-2 text-[10px] focus:outline-none font-bold text-slate-750 dark:text-slate-200 cursor-pointer"
                  >
                    <option value={matchedTrek.id}>{matchedTrek.name}</option>
                    {availableTreks.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.state})</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center h-full gap-2">
                  <span className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold text-center">Add another trek to compare</span>
                  <select
                    onChange={(e) => addTrekSlot(e.target.value)}
                    value=""
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-2.5 text-[10px] focus:outline-none font-bold text-slate-500 cursor-pointer"
                  >
                    <option value="" disabled>-- Select Trek --</option>
                    {treks.filter(t => !selectedTrekIds.includes(t.id)).map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Comparison Grid Table */}
      {selectedTreks.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-x-auto flex flex-col gap-6">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80">
                <th className="py-4 text-left font-black text-slate-400 uppercase tracking-widest w-1/4">Metric</th>
                {selectedTreks.map(t => (
                  <th key={t.id} className="py-4 px-6 text-left font-extrabold text-slate-900 dark:text-white w-1/4">
                    {t.name}
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-350">
              
              {/* Difficulty */}
              <tr>
                <td className="py-4 font-black text-slate-400 uppercase tracking-wider text-[9px]">Difficulty</td>
                {selectedTreks.map(t => (
                  <td key={t.id} className="py-4 px-6">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      t.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500' :
                      t.difficulty.includes('Moderate') ? 'bg-amber-500/10 text-amber-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {t.difficulty}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Price */}
              <tr>
                <td className="py-4 font-black text-slate-400 uppercase tracking-wider text-[9px]">Average Cost</td>
                {selectedTreks.map(t => (
                  <td key={t.id} className="py-4 px-6 text-emerald-500 font-extrabold text-sm">
                    ₹{t.startingPrice.toLocaleString()}
                  </td>
                ))}
              </tr>

              {/* Altitude climb */}
              <tr>
                <td className="py-4 font-black text-slate-400 uppercase tracking-wider text-[9px]">Max Altitude</td>
                {selectedTreks.map(t => (
                  <td key={t.id} className="py-4 px-6">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-slate-800 dark:text-slate-200 font-extrabold">{t.altitude}m / {(t.altitude * 3.28084).toFixed(0).toLocaleString()} ft</span>
                      <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${(t.altitude / maxAltitude) * 100}%` }} />
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Distance */}
              <tr>
                <td className="py-4 font-black text-slate-400 uppercase tracking-wider text-[9px]">Distance One-Way</td>
                {selectedTreks.map(t => (
                  <td key={t.id} className="py-4 px-6">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-slate-800 dark:text-slate-200 font-extrabold">{t.distance} km</span>
                      <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full" style={{ width: `${(t.distance / maxDistance) * 100}%` }} />
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Duration */}
              <tr>
                <td className="py-4 font-black text-slate-400 uppercase tracking-wider text-[9px]">Duration</td>
                {selectedTreks.map(t => (
                  <td key={t.id} className="py-4 px-6">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-slate-800 dark:text-slate-200 font-extrabold">{t.duration} Days</span>
                      <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full" style={{ width: `${(t.duration / maxDuration) * 100}%` }} />
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Season */}
              <tr>
                <td className="py-4 font-black text-slate-400 uppercase tracking-wider text-[9px]">Best Season</td>
                {selectedTreks.map(t => (
                  <td key={t.id} className="py-4 px-6 font-medium text-slate-800 dark:text-slate-250">
                    {t.bestSeason}
                  </td>
                ))}
              </tr>

              {/* Base Camp */}
              <tr>
                <td className="py-4 font-black text-slate-400 uppercase tracking-wider text-[9px]">Base Camp</td>
                {selectedTreks.map(t => (
                  <td key={t.id} className="py-4 px-6">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{t.baseCamp}</span>
                      <span className="text-[10px] text-slate-400 leading-tight block mt-0.5 max-w-[180px]">{t.baseCampDetails.substring(0, 75)}...</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Snow Trek */}
              <tr>
                <td className="py-4 font-black text-slate-400 uppercase tracking-wider text-[9px]">Snow availability</td>
                {selectedTreks.map(t => (
                  <td key={t.id} className="py-4 px-6 font-bold">
                    {t.snowTrek ? (
                      <span className="text-cyan-500">❄️ Yes (High Snow)</span>
                    ) : (
                      <span className="text-slate-400">🍂 Seasonal/Minimal</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Fitness */}
              <tr>
                <td className="py-4 font-black text-slate-400 uppercase tracking-wider text-[9px]">Fitness Level</td>
                {selectedTreks.map(t => (
                  <td key={t.id} className="py-4 px-6 text-[10px] text-slate-500 leading-relaxed max-w-[180px]">
                    {t.fitnessRequirement}
                  </td>
                ))}
              </tr>

              {/* Booking CTAs */}
              <tr className="border-t border-slate-100 dark:border-slate-800">
                <td className="py-4 font-black text-slate-400 uppercase tracking-wider text-[9px]">Action</td>
                {selectedTreks.map(t => (
                  <td key={t.id} className="py-4 px-6">
                    <Link
                      href={`/trek/${t.id}`}
                      className="inline-flex items-center gap-1 bg-gradient-premium hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl text-[10px] shadow-sm transition-colors text-center cursor-pointer"
                    >
                      <span>Details &amp; Book</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
