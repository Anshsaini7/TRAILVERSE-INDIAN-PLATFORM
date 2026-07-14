'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { treks, Trek } from '../../data/mockData';
import TrekCard from '../../components/TrekCard';
import { Filter, SlidersHorizontal, RefreshCcw, Compass, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ExploreClient() {
  const searchParams = useSearchParams();

  // 1. Initial State from Search Params
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [selectedBudget, setSelectedBudget] = useState<string>('');
  const [snowTrek, setSnowTrek] = useState(false);
  const [familyFriendly, setFamilyFriendly] = useState(false);
  const [soloFriendly, setSoloFriendly] = useState(false);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync with search queries when landing
  useEffect(() => {
    const nameParam = searchParams.get('name');
    const stateParam = searchParams.get('state');
    const diffParam = searchParams.get('difficulty');
    const durParam = searchParams.get('duration');
    const budParam = searchParams.get('budget');

    setTimeout(() => {
      if (nameParam) setSearchTerm(nameParam);
      if (stateParam) setSelectedStates([stateParam]);
      if (diffParam) setSelectedDifficulties([diffParam]);
      if (durParam) setSelectedDuration(durParam);
      if (budParam) setSelectedBudget(budParam);
    }, 0);
  }, [searchParams]);

  // Toggle handlers
  const handleStateToggle = (stateName: string) => {
    setSelectedStates(prev => 
      prev.includes(stateName) ? prev.filter(s => s !== stateName) : [...prev, stateName]
    );
  };

  const handleDifficultyToggle = (diff: string) => {
    setSelectedDifficulties(prev => 
      prev.includes(diff) ? prev.filter(d => d !== diff) : [...prev, diff]
    );
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStates([]);
    setSelectedDifficulties([]);
    setSelectedDuration('');
    setSelectedBudget('');
    setSnowTrek(false);
    setFamilyFriendly(false);
    setSoloFriendly(false);
  };

  // 2. Filtration Logic
  const filteredTreks = useMemo(() => {
    return treks.filter(trek => {
      // Search text match
      if (searchTerm && !trek.name.toLowerCase().includes(searchTerm.toLowerCase()) && !trek.state.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      // State matches
      if (selectedStates.length > 0 && !selectedStates.includes(trek.state)) {
        return false;
      }
      // Difficulty matches
      if (selectedDifficulties.length > 0) {
        const matches = selectedDifficulties.some(selDiff => {
          if (selDiff === 'Easy') return trek.difficulty === 'Easy' || trek.difficulty.includes('Easy');
          if (selDiff === 'Medium') return trek.difficulty === 'Medium' || trek.difficulty === 'Moderate' || trek.difficulty.includes('Moderate');
          if (selDiff === 'Hard') return trek.difficulty === 'Hard' || trek.difficulty.includes('Hard');
          if (selDiff === 'Extreme') return trek.difficulty === 'Extreme';
          return trek.difficulty === selDiff;
        });
        if (!matches) return false;
      }
      // Duration match
      if (selectedDuration) {
        if (selectedDuration === 'short' && trek.duration > 4) return false;
        if (selectedDuration === 'medium' && (trek.duration < 5 || trek.duration > 7)) return false;
        if (selectedDuration === 'long' && trek.duration < 8) return false;
      }
      // Budget match
      if (selectedBudget) {
        if (selectedBudget === 'low' && trek.startingPrice > 5000) return false;
        if (selectedBudget === 'mid' && (trek.startingPrice < 5000 || trek.startingPrice > 12000)) return false;
        if (selectedBudget === 'high' && trek.startingPrice < 12000) return false;
      }
      // Special tags
      if (snowTrek && !trek.snowTrek) return false;
      if (familyFriendly && !trek.familyFriendly) return false;
      if (soloFriendly && !trek.soloFriendly) return false;

      return true;
    });
  }, [searchTerm, selectedStates, selectedDifficulties, selectedDuration, selectedBudget, snowTrek, familyFriendly, soloFriendly]);

  // List of states present in database
  const statesList = ['Uttarakhand', 'Himachal Pradesh', 'Jammu & Kashmir', 'Ladakh', 'Sikkim', 'West Bengal', 'Meghalaya', 'Arunachal Pradesh', 'Karnataka', 'Maharashtra'];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Search Bar & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>Explore Treks</h1>
          <p className="text-xs text-slate-500 mt-1">Found {filteredTreks.length} treks matching your adventure profiles.</p>
        </div>

        {/* Input Name Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-3 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search trek by name or key terms..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Main Grid: Sidebar + Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* DESKTOP FILTER SIDEBAR — Redesigned */}
        <aside className="hidden lg:flex flex-col gap-7 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 pr-4 rounded-3xl h-fit shadow-sm sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-2 font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>
              <SlidersHorizontal className="h-4 w-4 text-emerald-500" />
              Filters
            </span>
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all hover:scale-105 px-2.5 py-1 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>

          {/* 1. State Filter — Pill chips */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-[0.12em]">State</h4>
            <div className="flex flex-col gap-2">
              {statesList.map(st => {
                const isActive = selectedStates.includes(st);
                return (
                  <button
                    key={st}
                    onClick={() => handleStateToggle(st)}
                    className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/30 scale-[1.01]'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 hover:scale-[1.01]'
                    }`}
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-white' : 'bg-slate-300 dark:bg-slate-600'}`} />
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Difficulty Filter — Colored pill chips */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-[0.12em]">Difficulty</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Easy', color: 'emerald', emoji: '🟢' },
                { label: 'Medium', color: 'amber', emoji: '🟡' },
                { label: 'Hard', color: 'orange', emoji: '🟠' },
                { label: 'Extreme', color: 'red', emoji: '🔴' },
              ].map(({ label, emoji }) => {
                const isActive = selectedDifficulties.includes(label);
                return (
                  <button
                    key={label}
                    onClick={() => handleDifficultyToggle(label)}
                    className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/30 scale-[1.01]'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 hover:scale-[1.01]'
                    }`}
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    <span className="text-sm">{emoji}</span>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Duration Filter — Pill buttons */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-[0.12em]">Duration</h4>
            <div className="flex flex-col gap-2">
              {[
                { value: '', label: 'Any Duration', icon: '📅' },
                { value: 'short', label: '1 – 4 Days', icon: '⚡' },
                { value: 'medium', label: '5 – 7 Days', icon: '🏕️' },
                { value: 'long', label: '8+ Days', icon: '🗺️' },
              ].map(({ value, label, icon }) => {
                const isActive = selectedDuration === value;
                return (
                  <button
                    key={value}
                    onClick={() => setSelectedDuration(value)}
                    className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/30 scale-[1.01]'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 hover:scale-[1.01]'
                    }`}
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    <span className="text-sm">{icon}</span>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Budget Filter — Pill buttons */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-[0.12em]">Starting Price</h4>
            <div className="flex flex-col gap-2">
              {[
                { value: '', label: 'Any Budget', icon: '💰' },
                { value: 'low', label: 'Under ₹5,000', icon: '🤑' },
                { value: 'mid', label: '₹5K – ₹12K', icon: '💳' },
                { value: 'high', label: '₹12,000+', icon: '🏆' },
              ].map(({ value, label, icon }) => {
                const isActive = selectedBudget === value;
                return (
                  <button
                    key={value}
                    onClick={() => setSelectedBudget(value)}
                    className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/30 scale-[1.01]'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 hover:scale-[1.01]'
                    }`}
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    <span className="text-sm">{icon}</span>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Special Tags — Toggle pills */}
          <div className="border-t border-slate-100 dark:border-slate-800/60 pt-5">
            <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-[0.12em]">Special Tags</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Snow Trek', icon: '❄️', value: snowTrek, setter: () => setSnowTrek(!snowTrek) },
                { label: 'Family Friendly', icon: '👪', value: familyFriendly, setter: () => setFamilyFriendly(!familyFriendly) },
                { label: 'Solo Friendly', icon: '🎒', value: soloFriendly, setter: () => setSoloFriendly(!soloFriendly) },
              ].map(({ label, icon, value, setter }) => (
                <button
                  key={label}
                  onClick={setter}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-200 ${
                    value
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/30 scale-[1.01]'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 hover:scale-[1.01]'
                  }`}
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  <span className="text-base">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* MOBILE FILTERS TOGGLE BUTTON */}
        <div className="lg:hidden flex justify-between items-center">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md"
          >
            <Filter className="h-4 w-4" />
            <span>Show Filters</span>
          </button>
          <button
            onClick={resetFilters}
            className="text-xs text-slate-500 font-bold border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl"
          >
            Reset
          </button>
        </div>

        {/* TREK CARDS GRID */}
        <div className="lg:col-span-3">
          {filteredTreks.length > 0 ? (
            <motion.div
              key="grid"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredTreks.map((trek, i) => (
                  <motion.div
                    key={trek.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -8 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      delay: Math.min(i * 0.04, 0.25),
                    }}
                  >
                    <TrekCard trek={trek} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="h-96 border-2 border-dashed border-slate-250 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-450 dark:text-slate-550 text-xs p-6 text-center"
            >
              <Compass className="h-12 w-12 text-slate-300 dark:text-slate-700 stroke-1 animate-pulse mb-3" />
              <span className="font-extrabold text-sm text-slate-750 dark:text-slate-300">No treks found</span>
              <p className="mt-1 text-slate-400 max-w-xs">We couldn't locate treks fitting your current active filters. Reset filters to start fresh.</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="w-80 bg-white dark:bg-slate-900 h-full p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">Filters</h3>
                  <button onClick={() => setMobileFiltersOpen(false)} className="text-xs font-bold text-slate-400">Close</button>
                </div>

                {/* State */}
                <div>
                  <h4 className="text-xs font-bold mb-2 uppercase">State</h4>
                  <div className="flex flex-col gap-2">
                    {statesList.map(st => (
                      <label key={st} className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={selectedStates.includes(st)}
                          onChange={() => handleStateToggle(st)}
                          className="h-4 w-4 rounded text-emerald-500 focus:ring-emerald-500"
                        />
                        <span>{st}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <h4 className="text-xs font-bold mb-2 uppercase">Difficulty</h4>
                  <div className="flex flex-col gap-2">
                    {['Easy', 'Medium', 'Hard', 'Extreme'].map(diff => (
                      <label key={diff} className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={selectedDifficulties.includes(diff)}
                          onChange={() => handleDifficultyToggle(diff)}
                          className="h-4 w-4 rounded text-emerald-500 focus:ring-emerald-500"
                        />
                        <span>{diff}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <h4 className="text-xs font-bold mb-2 uppercase">Duration</h4>
                  <select
                    value={selectedDuration}
                    onChange={e => setSelectedDuration(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-xs"
                  >
                    <option value="">Duration (All)</option>
                    <option value="short">1 - 4 Days</option>
                    <option value="medium">5 - 7 Days</option>
                    <option value="long">8+ Days</option>
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <h4 className="text-xs font-bold mb-2 uppercase">Budget</h4>
                  <select
                    value={selectedBudget}
                    onChange={e => setSelectedBudget(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-xs"
                  >
                    <option value="">Price (All)</option>
                    <option value="low">Under ₹5,000</option>
                    <option value="mid">₹5,000 - ₹12,000</option>
                    <option value="high">₹12,000+</option>
                  </select>
                </div>

                {/* Special Tags */}
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={snowTrek}
                      onChange={e => setSnowTrek(e.target.checked)}
                      className="h-4 w-4 rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span>❄️ Snow Trek</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={familyFriendly}
                      onChange={e => setFamilyFriendly(e.target.checked)}
                      className="h-4 w-4 rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span>👪 Family Friendly</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={soloFriendly}
                      onChange={e => setSoloFriendly(e.target.checked)}
                      className="h-4 w-4 rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span>🎒 Solo Friendly</span>
                  </label>
                </div>
              </div>

              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-xs mt-6"
              >
                Apply Filters
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Wrap inside Suspense to prevent build-time bailouts
export default function ExploreTreks() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-xs text-slate-400">
        <Compass className="h-10 w-10 animate-spin text-emerald-500 mb-2" />
        <span>Syncing trek collections...</span>
      </div>
    }>
      <ExploreClient />
    </Suspense>
  );
}
