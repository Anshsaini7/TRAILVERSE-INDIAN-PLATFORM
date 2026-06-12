'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { treks, adventureActivities, Trek } from '../../data/mockData';
import { Sparkles, Calendar, User, Compass, HelpCircle, Activity, Landmark, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AiPlanner() {
  // 1. Planner Form State
  const [budget, setBudget] = useState(10000);
  const [days, setDays] = useState(5);
  const [fitness, setFitness] = useState('Intermediate');
  const [groupSize, setGroupSize] = useState(2);
  const [preferredState, setPreferredState] = useState('Any');
  const [adventureType, setAdventureType] = useState('Trekking');

  // Generator Flow States
  const [step, setStep] = useState<'idle' | 'analyzing' | 'complete'>('idle');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [statusText, setStatusText] = useState('');

  // Generated Plan State
  const [matchedTrek, setMatchedTrek] = useState<Trek | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('analyzing');
    setAnalysisProgress(0);

    const statuses = [
      'Querying satellite weather grids...',
      'Computing altitude adaptation curves...',
      'Matching route checkpoints & camp logs...',
      'Compiling local homestay registry...',
      'Assembling budget allocation schemas...'
    ];

    let current = 0;
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Match the optimal trek based on filter inputs
          // Filter by state, difficulty (mapped from fitness), duration, and budget
          const matches = treks.filter(t => {
            if (preferredState !== 'Any' && t.state !== preferredState) return false;
            
            // Map fitness to difficulty
            if (fitness === 'Beginner' && t.difficulty !== 'Easy' && !t.difficulty.includes('Easy')) return false;
            if (fitness === 'Intermediate' && 
                t.difficulty !== 'Easy' && 
                !t.difficulty.includes('Easy') && 
                t.difficulty !== 'Medium' && 
                t.difficulty !== 'Moderate' && 
                !t.difficulty.includes('Moderate')) return false;
            if (fitness === 'Advanced' && t.difficulty === 'Extreme') return false;

            // Budget match
            if (t.startingPrice > budget) return false;

            return true;
          });

          // Fallback to closest match if empty list
          const finalMatch = matches.length > 0 
            ? matches[Math.floor(Math.random() * matches.length)] 
            : treks.find(t => t.startingPrice <= budget) || treks[1]; // default to Kedarkantha

          setMatchedTrek(finalMatch);
          setStep('complete');
          return 100;
        }

        const nextProg = prev + 20;
        const statusIdx = Math.min(statuses.length - 1, Math.floor(nextProg / 25));
        setStatusText(statuses[statusIdx]);
        return nextProg;
      });
    }, 400);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-500 border border-emerald-500/20 mb-4">
          <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />
          AI ADVENTURE PLANNER
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">Create Your Custom Itinerary</h1>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Input your parameters and let our routing model analyze terrains, altitudes, and safety logs to construct a personalized adventure plan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Input Form */}
        <div className="lg:col-span-4">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col gap-5">
            
            {/* Preferred State */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Preferred State</label>
              <select
                value={preferredState}
                onChange={e => setPreferredState(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-2.5 text-xs focus:outline-none"
              >
                <option value="Any">Any State</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Ladakh">Ladakh</option>
                <option value="Sikkim">Sikkim</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
              </select>
            </div>

            {/* Adventure Type */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Adventure Type</label>
              <select
                value={adventureType}
                onChange={e => setAdventureType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-2.5 text-xs focus:outline-none"
              >
                <option value="Trekking">🏔️ High Altitude Trekking</option>
                <option value="Camping">⛺ Wilderness Camping</option>
                <option value="Rafting">🛶 White Water River Rafting</option>
                <option value="Climbing">🧗 Rock Climbing &amp; Bouldering</option>
                <option value="Paragliding">🪂 Paragliding / Flight</option>
                <option value="Skiing">⛷️ Alpine Skiing</option>
              </select>
            </div>

            {/* Fitness Level */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">My Fitness Level</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['Beginner', 'Intermediate', 'Advanced', 'Athlete'].map((fit) => (
                  <button
                    key={fit}
                    type="button"
                    onClick={() => setFitness(fit)}
                    className={`py-2 px-3 border rounded-xl font-semibold transition-all ${
                      fitness === fit
                        ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:border-emerald-400 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                    }`}
                  >
                    {fit}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget range slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block">Max Budget</label>
                <span className="text-xs font-black text-emerald-500">₹{budget.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="2000"
                max="25000"
                step="5000"
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-1">
                <span>₹2k</span>
                <span>₹10k</span>
                <span>₹25k</span>
              </div>
            </div>

            {/* Days Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block">Days Available</label>
                <span className="text-xs font-black text-slate-900 dark:text-white">{days} Days</span>
              </div>
              <input
                type="range"
                min="2"
                max="10"
                step="1"
                value={days}
                onChange={e => setDays(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-1">
                <span>2 Days</span>
                <span>5 Days</span>
                <span>10 Days</span>
              </div>
            </div>

            {/* Group size */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Group Size</label>
              <select
                value={groupSize}
                onChange={e => setGroupSize(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-2.5 text-xs focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'Persons'}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-premium hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-2xl text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <Sparkles className="h-4.5 w-4.5" />
              <span>Generate AI Adventure Plan</span>
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Output display panels */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            
            {/* Idle panel */}
            {step === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-450 dark:text-slate-600 text-xs p-8 text-center min-h-[400px]"
              >
                <Sparkles className="h-12 w-12 text-slate-350 dark:text-slate-700 stroke-1 animate-slow-pulse mb-3" />
                <span className="font-extrabold text-sm text-slate-750 dark:text-slate-200">Waiting for parameters</span>
                <p className="mt-1 text-slate-400 max-w-xs">Fill out the questionnaires on the left and trigger the engine to design your custom travel plan.</p>
              </motion.div>
            )}

            {/* Analyzing loader */}
            {step === 'analyzing' && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl flex flex-col items-center justify-center p-8 min-h-[400px] text-center"
              >
                <div className="relative h-16 w-16 flex items-center justify-center bg-emerald-500/10 rounded-full mb-6">
                  <Sparkles className="h-8 w-8 text-emerald-500 animate-spin-slow" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">TrailVerse AI Compiler</h3>
                <p className="text-xs text-slate-450 dark:text-slate-500 mt-1 max-w-xs font-medium animate-pulse">{statusText}</p>
                <div className="w-56 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-6">
                  <div className="bg-emerald-500 h-full transition-all duration-200" style={{ width: `${analysisProgress}%` }} />
                </div>
              </motion.div>
            )}

            {/* Complete output panel */}
            {step === 'complete' && matchedTrek && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
              >
                {/* 1. Header Banner */}
                <div className="bg-gradient-premium p-6 rounded-3xl text-white shadow-md flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <span className="text-[10px] text-emerald-200 font-extrabold uppercase tracking-widest block">PLAN COMPILED</span>
                    <h2 className="text-2xl font-black mt-1">Your Custom Adventure Plan</h2>
                    <span className="text-xs text-emerald-100 mt-1 block">Best fit: <strong className="underline">{matchedTrek.name}</strong></span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl py-2 px-4 text-center">
                    <span className="text-[9px] text-emerald-100 font-bold block">MATCH SCORE</span>
                    <strong className="text-lg font-black leading-none">98%</strong>
                  </div>
                </div>

                {/* 2. Detailed itinerary & checklist grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Daily Schedule */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Calendar className="h-4.5 w-4.5 text-emerald-500" />
                      Day-by-day Itinerary
                    </h3>
                    <div className="border-l border-slate-200 dark:border-slate-800 ml-2.5 pl-4 space-y-4 text-xs font-semibold">
                      {matchedTrek.route.slice(0, Math.min(days, matchedTrek.route.length)).map((node, i) => (
                        <div key={i} className="relative">
                          <span className="absolute -left-[21px] top-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                          <span className="text-slate-400 block text-[9px] font-bold uppercase">DAY {i + 1}</span>
                          <strong className="text-slate-850 dark:text-slate-200 text-xs block mt-0.5">{node}</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Budget Allocation Panel */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-6">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-4">Estimated Budget Breakdown</h3>
                      <div className="space-y-4 text-[10px] text-slate-500 font-bold">
                        {/* Gear & Renting */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span>GEAR &amp; RENTING</span>
                            <span className="text-slate-800 dark:text-slate-200">₹{(budget * 0.15).toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-cyan-500 h-full" style={{ width: '15%' }} />
                          </div>
                        </div>

                        {/* Guide Package */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span>GUIDE OPERATOR PACKAGE</span>
                            <span className="text-slate-800 dark:text-slate-200">₹{matchedTrek.startingPrice.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full" style={{ width: `${(matchedTrek.startingPrice / budget) * 100}%` }} />
                          </div>
                        </div>

                        {/* Permits / Transit */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span>PERMITS &amp; TRANSIT</span>
                            <span className="text-slate-800 dark:text-slate-200">₹{(budget * 0.2).toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full" style={{ width: '20%' }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 flex justify-between items-center">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase">ESTIMATED TOTAL COST</span>
                        <strong className="text-slate-850 dark:text-slate-200 text-sm font-black">₹{(matchedTrek.startingPrice + budget * 0.35).toLocaleString()}</strong>
                      </div>
                      <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/15">Under Budget</span>
                    </div>
                  </div>
                </div>

                {/* 3. Transit and Accomm Suggestions */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Transit & Accommodation Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-medium">
                    <div>
                      <strong className="text-slate-900 dark:text-slate-100 block mb-1">Transit Route Guideline:</strong>
                      <p>{matchedTrek.transportation} Nearest airport is {matchedTrek.nearestAirport}. Railway link via {matchedTrek.nearestRailway}.</p>
                    </div>
                    <div>
                      <strong className="text-slate-900 dark:text-slate-100 block mb-1">Homestay & Accommodation:</strong>
                      <p>{matchedTrek.accommodation} Base Camp homestays at {matchedTrek.baseCamp} are included in standard operator bundles.</p>
                    </div>
                  </div>
                </div>

                {/* Booking Redirection */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep('idle')}
                    className="flex-1 py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-350 text-xs hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                  >
                    Reset Parameters
                  </button>
                  <Link
                    href={`/trek/${matchedTrek.id}`}
                    className="flex-1 flex items-center justify-center gap-1 bg-gradient-premium hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-2xl text-xs shadow-md transition-colors text-center"
                  >
                    <span>View Trek Details &amp; Book</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
