'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { treks, Trek } from '../../data/mockData';
import { 
  Calculator, Sparkles, Scale, Info, Check, Printer, AlertTriangle, 
  RefreshCw, Plus, Trash2, ShieldCheck, ArrowRight, Backpack, Compass,
  MapPin, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Category details
const CATEGORIES = {
  shelter: { label: 'Shelter & Sleep', color: 'from-blue-500 to-indigo-600', icon: '⛺' },
  clothing: { label: 'Clothing & Layers', color: 'from-teal-500 to-emerald-600', icon: '🧥' },
  gear: { label: 'Footwear & Carry', color: 'from-amber-500 to-orange-600', icon: '🎒' },
  kitchen: { label: 'Cook & Hydrate', color: 'from-cyan-500 to-sky-600', icon: '🍳' },
  safety: { label: 'Safety & Essentials', color: 'from-rose-500 to-pink-600', icon: '🩹' }
};

interface GearItem {
  id: string;
  name: string;
  category: keyof typeof CATEGORIES;
  standardWeight: number; // in grams
  ultralightWeight: number; // in grams
  quantity: number;
  isUltralight: boolean;
  checked: boolean;
  customWeight?: number; // custom weight in grams if entered
}

const DEFAULT_GEAR: GearItem[] = [
  // 1. Shelter & Sleep
  { id: 'tent', name: 'Double-Wall Tent (2-Person)', category: 'shelter', standardWeight: 2200, ultralightWeight: 1100, quantity: 1, isUltralight: false, checked: true },
  { id: 'sleeping-bag', name: 'Sleeping Bag (0°F / -18°C)', category: 'shelter', standardWeight: 1450, ultralightWeight: 850, quantity: 1, isUltralight: false, checked: true },
  { id: 'sleeping-pad', name: 'Insulated Sleeping Pad', category: 'shelter', standardWeight: 650, ultralightWeight: 380, quantity: 1, isUltralight: false, checked: true },
  { id: 'pillow', name: 'Inflatable Camp Pillow', category: 'shelter', standardWeight: 110, ultralightWeight: 60, quantity: 1, isUltralight: false, checked: false },

  // 2. Clothing & Layers
  { id: 'down-jacket', name: 'Heavy Down Jacket', category: 'clothing', standardWeight: 750, ultralightWeight: 350, quantity: 1, isUltralight: false, checked: true },
  { id: 'rain-shell', name: 'Hardshell Rain Jacket', category: 'clothing', standardWeight: 450, ultralightWeight: 220, quantity: 1, isUltralight: false, checked: true },
  { id: 'fleece', name: 'Midlayer Fleece Sweater', category: 'clothing', standardWeight: 500, ultralightWeight: 280, quantity: 1, isUltralight: false, checked: true },
  { id: 'trek-pants', name: 'Quick-Dry Trekking Pants', category: 'clothing', standardWeight: 380, ultralightWeight: 240, quantity: 2, isUltralight: false, checked: true },
  { id: 'thermals', name: 'Merino Wool Thermal Set', category: 'clothing', standardWeight: 400, ultralightWeight: 250, quantity: 1, isUltralight: false, checked: true },
  { id: 'socks', name: 'Cushioned Merino Wool Socks', category: 'clothing', standardWeight: 80, ultralightWeight: 45, quantity: 3, isUltralight: false, checked: true },
  { id: 'gloves', name: 'Waterproof Thermal Gloves', category: 'clothing', standardWeight: 150, ultralightWeight: 70, quantity: 1, isUltralight: false, checked: true },

  // 3. Footwear & Carry
  { id: 'backpack', name: '65L Trail Backpack', category: 'gear', standardWeight: 2100, ultralightWeight: 1050, quantity: 1, isUltralight: false, checked: true },
  { id: 'poles', name: 'Telescopic Trekking Poles', category: 'gear', standardWeight: 550, ultralightWeight: 310, quantity: 1, isUltralight: false, checked: true },
  { id: 'boots', name: 'High-Ankle Waterproof Boots', category: 'gear', standardWeight: 1300, ultralightWeight: 850, quantity: 1, isUltralight: false, checked: true },
  { id: 'headlamp', name: 'LED Headlamp + Rechargeable Battery', category: 'gear', standardWeight: 120, ultralightWeight: 65, quantity: 1, isUltralight: false, checked: true },

  // 4. Cook & Hydrate
  { id: 'stove', name: 'Canister Backpacking Stove', category: 'kitchen', standardWeight: 120, ultralightWeight: 45, quantity: 1, isUltralight: false, checked: true },
  { id: 'pot', name: 'Anodized Cook Pot + Lid', category: 'kitchen', standardWeight: 320, ultralightWeight: 140, quantity: 1, isUltralight: false, checked: true },
  { id: 'fuel', name: 'Isobutane Fuel Canister (230g)', category: 'kitchen', standardWeight: 380, ultralightWeight: 380, quantity: 1, isUltralight: false, checked: true },
  { id: 'water-bladder', name: '3L Hydration Water Bladder', category: 'kitchen', standardWeight: 180, ultralightWeight: 110, quantity: 1, isUltralight: false, checked: true },
  { id: 'filter', name: 'Hollow Fiber Water Filter', category: 'kitchen', standardWeight: 90, ultralightWeight: 55, quantity: 1, isUltralight: false, checked: true },

  // 5. Safety & Essentials
  { id: 'first-aid', name: 'Group First Aid Kit', category: 'safety', standardWeight: 450, ultralightWeight: 200, quantity: 1, isUltralight: false, checked: true },
  { id: 'powerbank', name: '20,000mAh Rugged Powerbank', category: 'safety', standardWeight: 380, ultralightWeight: 380, quantity: 1, isUltralight: false, checked: true },
  { id: 'toiletries', name: 'Biodegradable Hygiene Kit', category: 'safety', standardWeight: 250, ultralightWeight: 120, quantity: 1, isUltralight: false, checked: true },
  { id: 'sunscreen', name: 'Sun & Bug Protection Tube', category: 'safety', standardWeight: 120, ultralightWeight: 60, quantity: 1, isUltralight: false, checked: true },
];

export default function WeightCalculator() {
  const [selectedTrekId, setSelectedTrekId] = useState(treks[0]?.id || '');
  const [items, setItems] = useState<GearItem[]>(DEFAULT_GEAR);
  
  // Custom Gear Adding State
  const [newGearName, setNewGearName] = useState('');
  const [newGearCat, setNewGearCat] = useState<keyof typeof CATEGORIES>('shelter');
  const [newGearWeight, setNewGearWeight] = useState(250);

  const selectedTrek = useMemo(() => {
    return treks.find(t => t.id === selectedTrekId) || treks[0];
  }, [selectedTrekId]);

  // Handle Gear Property Toggles
  const handleItemToggleChecked = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleItemToggleProfile = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, isUltralight: !item.isUltralight } : item));
  };

  const handleItemQtyChange = (id: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: nextQty };
      }
      return item;
    }));
  };

  const handleItemWeightOverride = (id: string, customWeightStr: string) => {
    const customWeightVal = parseInt(customWeightStr);
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, customWeight: isNaN(customWeightVal) ? undefined : customWeightVal };
      }
      return item;
    }));
  };

  const handleAddCustomGear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGearName.trim()) return;

    const newId = `custom_${Date.now()}`;
    const newGearItem: GearItem = {
      id: newId,
      name: newGearName.trim(),
      category: newGearCat,
      standardWeight: newGearWeight,
      ultralightWeight: newGearWeight,
      quantity: 1,
      isUltralight: false,
      checked: true,
      customWeight: newGearWeight
    };

    setItems(prev => [...prev, newGearItem]);
    setNewGearName('');
    setNewGearWeight(250);
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleResetChecklist = () => {
    setItems(DEFAULT_GEAR.map(i => ({ ...i })));
  };

  // Calculations
  const calculations = useMemo(() => {
    let totalWeightGrams = 0;
    const catWeights: Record<keyof typeof CATEGORIES, number> = {
      shelter: 0,
      clothing: 0,
      gear: 0,
      kitchen: 0,
      safety: 0
    };

    items.forEach(item => {
      if (!item.checked) return;
      const weight = item.customWeight !== undefined
        ? item.customWeight
        : (item.isUltralight ? item.ultralightWeight : item.standardWeight);
      const itemWeight = weight * item.quantity;
      totalWeightGrams += itemWeight;
      catWeights[item.category] += itemWeight;
    });

    const totalWeightKg = totalWeightGrams / 1000;
    
    // High-altitude Relative Effort Index
    // Formula: Effort multiplier = 1 + (Altitude / 6000)
    const altitude = selectedTrek ? Number(selectedTrek.altitude) || 3000 : 3000;
    const effortMultiplier = 1 + (altitude / 6000);
    const relativeEffortWeight = totalWeightKg * effortMultiplier;

    // Classification
    let classification: 'Ultralight' | 'Lightweight' | 'Moderate' | 'Heavy' = 'Moderate';
    let classColor = 'text-amber-500';
    let bgClass = 'bg-amber-500/10 border-amber-500/30';
    let progressColor = 'bg-amber-500';
    
    if (totalWeightKg < 8) {
      classification = 'Ultralight';
      classColor = 'text-emerald-500';
      bgClass = 'bg-emerald-500/10 border-emerald-500/30';
      progressColor = 'bg-emerald-500';
    } else if (totalWeightKg < 13) {
      classification = 'Lightweight';
      classColor = 'text-teal-500';
      bgClass = 'bg-teal-500/10 border-teal-500/30';
      progressColor = 'bg-teal-500';
    } else if (totalWeightKg < 18) {
      classification = 'Moderate';
      classColor = 'text-orange-500';
      bgClass = 'bg-orange-500/10 border-orange-500/30';
      progressColor = 'bg-orange-500';
    } else {
      classification = 'Heavy';
      classColor = 'text-rose-500';
      bgClass = 'bg-rose-500/10 border-rose-500/30';
      progressColor = 'bg-rose-500';
    }

    return {
      totalWeightKg,
      catWeights,
      relativeEffortWeight,
      effortMultiplier,
      altitude,
      classification,
      classColor,
      bgClass,
      progressColor
    };
  }, [items, selectedTrek]);

  // SVG Gauge calculations
  // Angle starts at -180 deg (left) and sweeps 180 deg to 0 deg (right)
  const maxLimit = 25; // max scale in kg
  const needleAngle = -180 + Math.min(180, (calculations.totalWeightKg / maxLimit) * 180);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8 print:p-0">
      
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto print:hidden">
        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500 font-extrabold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-3">
          <Scale className="h-3.5 w-3.5 animate-pulse" />
          Gear Optimization Engine
        </span>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Expedition Weight Budget
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          Add trail gear, switch to ultralight configurations, and calculate your pack load's high-altitude effort multiplier dynamically.
        </p>
      </div>

      {/* Grid Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side Checklist (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-6 print:w-full print:col-span-12">
          
          {/* Trek Context Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between print:hidden">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                <Backpack className="w-6 h-6" />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Active Expedition</label>
                <select
                  value={selectedTrekId}
                  onChange={(e) => setSelectedTrekId(e.target.value)}
                  className="bg-transparent text-sm font-black text-slate-950 dark:text-white focus:outline-none border-none cursor-pointer pr-4"
                >
                  {treks.map(t => (
                    <option key={t.id} value={t.id} className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">
                      {t.name} ({t.state})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-850">
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Summit Altitude</div>
                <div className="font-extrabold text-slate-800 dark:text-white mt-0.5">{selectedTrek.altitude} m</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-850">
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Pass Difficulty</div>
                <div className="font-extrabold text-slate-800 dark:text-white mt-0.5">{selectedTrek.difficulty}</div>
              </div>
            </div>
          </div>

          {/* Checklist Categories Container */}
          <div className="flex flex-col gap-5">
            {Object.entries(CATEGORIES).map(([catKey, catMeta]) => {
              const catItems = items.filter(i => i.category === catKey);
              const catTotalGrams = calculations.catWeights[catKey as keyof typeof CATEGORIES];
              const catTotalKg = (catTotalGrams / 1000).toFixed(2);

              return (
                <div key={catKey} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                  {/* Category Header */}
                  <div className={`bg-gradient-to-r ${catMeta.color} px-5 py-4 text-white flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{catMeta.icon}</span>
                      <h2 className="text-xs font-black uppercase tracking-widest">{catMeta.label}</h2>
                    </div>
                    <span className="text-xs font-black bg-white/10 px-3 py-1 rounded-full">{catTotalKg} kg</span>
                  </div>

                  {/* Category Items List */}
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60 p-2">
                    {catItems.map((item) => {
                      const weight = item.customWeight !== undefined
                        ? item.customWeight
                        : (item.isUltralight ? item.ultralightWeight : item.standardWeight);

                      return (
                        <div key={item.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-3 py-3 rounded-2xl transition-colors ${item.checked ? 'bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01]' : 'opacity-50'}`}>
                          
                          {/* Checkbox + Title */}
                          <div className="flex items-center gap-3 min-w-0">
                            <button
                              onClick={() => handleItemToggleChecked(item.id)}
                              className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                                item.checked 
                                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                                  : 'border-slate-300 dark:border-slate-700 hover:border-slate-400'
                              }`}
                            >
                              {item.checked && <Check className="w-3.5 h-3.5" />}
                            </button>
                            <span className={`text-xs font-bold truncate leading-tight ${item.checked ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500 line-through'}`}>
                              {item.name}
                            </span>
                          </div>

                          {/* Controls (Weight Override, Ultralight switch, Quantity) */}
                          <div className="flex flex-wrap items-center gap-3 justify-end">
                            {/* Custom Weight Input */}
                            {item.checked && (
                              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                <input
                                  type="text"
                                  placeholder={String(weight)}
                                  value={item.customWeight !== undefined ? item.customWeight : ''}
                                  onChange={(e) => handleItemWeightOverride(item.id, e.target.value)}
                                  className="w-12 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:border-emerald-500 text-right"
                                />
                                <span>g</span>
                              </div>
                            )}

                            {/* Ultralight Toggle */}
                            {item.checked && item.standardWeight !== item.ultralightWeight && (
                              <button
                                onClick={() => handleItemToggleProfile(item.id)}
                                className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                                  item.isUltralight
                                    ? 'bg-gradient-to-r from-teal-500/10 to-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                    : 'bg-slate-100 dark:bg-slate-950 text-slate-400 border-slate-200 dark:border-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-500'
                                }`}
                              >
                                {item.isUltralight ? '🍃 Ultralight' : 'Standard'}
                              </button>
                            )}

                            {/* Quantity Multiplier */}
                            {item.checked && (
                              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded-xl border border-slate-100 dark:border-slate-850">
                                <button
                                  onClick={() => handleItemQtyChange(item.id, -1)}
                                  className="w-4 h-4 flex items-center justify-center text-xs font-bold text-slate-400 hover:text-slate-650 cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="text-[10px] font-bold text-slate-800 dark:text-white min-w-[12px] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleItemQtyChange(item.id, 1)}
                                  className="w-4 h-4 flex items-center justify-center text-xs font-bold text-slate-400 hover:text-slate-650 cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            )}

                            {/* Trash button (for custom added items) */}
                            {item.id.startsWith('custom_') && (
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-50 dark:hover:bg-slate-950 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Custom Item Form */}
          <form onSubmit={handleAddCustomGear} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm flex flex-col gap-4 print:hidden">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-500" />
              Add Custom Equipment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Item name (e.g. GoPro, Extra Sock)..."
                value={newGearName}
                onChange={(e) => setNewGearName(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
              />
              <select
                value={newGearCat}
                onChange={(e) => setNewGearCat(e.target.value as keyof typeof CATEGORIES)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none"
              >
                {Object.entries(CATEGORIES).map(([key, val]) => (
                  <option key={key} value={key} className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">
                    {val.icon} {val.label}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Weight (g)..."
                  value={newGearWeight || ''}
                  onChange={(e) => setNewGearWeight(Math.max(0, parseInt(e.target.value) || 0))}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 w-full"
                />
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 px-4 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Side Dashboard Statistics (lg:col-span-5) */}
        <div className="lg:col-span-5 sticky top-24 flex flex-col gap-6 print:col-span-12 print:relative print:top-0 print:w-full">
          
          {/* Main Weight Summary Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col items-center gap-6 relative">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Weight Distribution</h3>

            {/* SVG Needle Gauge */}
            <div className="relative w-full max-w-[240px] flex justify-center mt-2">
              <svg width="220" height="120" viewBox="0 0 200 110">
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" />    {/* Green */}
                    <stop offset="40%" stopColor="#14B8A6" />   {/* Teal */}
                    <stop offset="75%" stopColor="#F59E0B" />   {/* Orange */}
                    <stop offset="100%" stopColor="#EF4444" />  {/* Red */}
                  </linearGradient>
                </defs>
                {/* Arc Track */}
                <path 
                  d="M 20 100 A 80 80 0 0 1 180 100" 
                  fill="none" 
                  stroke="#E2E8F0" 
                  strokeWidth="16" 
                  strokeLinecap="round" 
                  className="stroke-slate-100 dark:stroke-slate-800"
                />
                <path 
                  d="M 20 100 A 80 80 0 0 1 180 100" 
                  fill="none" 
                  stroke="url(#gaugeGradient)" 
                  strokeWidth="16" 
                  strokeLinecap="round" 
                />
                
                {/* Scale Ticks */}
                <text x="18" y="107" fontSize="7" fontWeight="bold" className="fill-slate-400 dark:fill-slate-500 text-center">0</text>
                <text x="50" y="45" fontSize="7" fontWeight="bold" className="fill-slate-400 dark:fill-slate-500 text-center">8</text>
                <text x="96" y="15" fontSize="7" fontWeight="bold" className="fill-slate-400 dark:fill-slate-500 text-center">13</text>
                <text x="146" y="45" fontSize="7" fontWeight="bold" className="fill-slate-400 dark:fill-slate-500 text-center">18</text>
                <text x="175" y="107" fontSize="7" fontWeight="bold" className="fill-slate-400 dark:fill-slate-500 text-center">25+</text>
                
                {/* Center Pivot */}
                <circle cx="100" cy="100" r="7" className="fill-slate-800 dark:fill-white" />
                
                {/* Needle */}
                <g transform={`rotate(${needleAngle} 100 100)`}>
                  <line 
                    x1="100" 
                    y1="100" 
                    x2="100" 
                    y2="25" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                    className="stroke-slate-800 dark:stroke-white"
                  />
                </g>
              </svg>
              
              {/* Text Overlay inside Gauge */}
              <div className="absolute bottom-0 text-center">
                <div className="text-4xl font-black text-slate-900 dark:text-white leading-none">
                  {calculations.totalWeightKg.toFixed(2)}
                  <span className="text-sm font-bold text-slate-400 dark:text-slate-500 ml-1">kg</span>
                </div>
                <div className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mt-2 border ${calculations.bgClass} ${calculations.classColor}`}>
                  {calculations.classification}
                </div>
              </div>
            </div>

            {/* Category Contributions */}
            <div className="w-full flex flex-col gap-3.5 border-t border-slate-100 dark:border-slate-850 pt-5 text-xs">
              <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Weight by Category</h4>
              <div className="flex flex-col gap-2">
                {Object.entries(CATEGORIES).map(([catKey, catMeta]) => {
                  const weight = calculations.catWeights[catKey as keyof typeof CATEGORIES];
                  const percentage = calculations.totalWeightKg > 0 ? (weight / 1000 / calculations.totalWeightKg) * 100 : 0;
                  
                  return (
                    <div key={catKey} className="flex flex-col gap-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-slate-650 dark:text-slate-400 flex items-center gap-1">
                          <span>{catMeta.icon}</span>
                          {catMeta.label}
                        </span>
                        <span className="text-slate-900 dark:text-white">
                          {(weight / 1000).toFixed(2)} kg ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${catMeta.color}`} 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* High Altitude Advisory Card */}
          <div className="bg-gradient-premium p-6 rounded-3xl text-white shadow-lg flex flex-col gap-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-1.5">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
                High Altitude Effort Index
              </h3>
              <span className="text-[9px] font-black uppercase bg-white/20 px-2 py-0.5 rounded-lg border border-white/20">
                {selectedTrek.altitude} m
              </span>
            </div>
            
            <p className="text-[11px] text-slate-200 leading-relaxed font-semibold">
              Because oxygen density decreases with elevation, carrying weights at high altitude requires significantly higher energy output.
            </p>

            <div className="flex items-center justify-between border-y border-white/10 py-4 my-1">
              <div>
                <div className="text-[9px] text-slate-350 font-bold uppercase tracking-wider">True Weight</div>
                <div className="text-2xl font-black">{calculations.totalWeightKg.toFixed(2)} kg</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] text-amber-350 font-bold uppercase tracking-wider">Feels Like (At Summit)</div>
                <div className="text-2xl font-black text-amber-300">
                  {calculations.relativeEffortWeight.toFixed(2)} kg
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-white/5 border border-white/10 rounded-2xl p-3 text-[10px] leading-relaxed text-slate-200 font-medium">
              <Info className="w-4 h-4 flex-shrink-0 text-amber-300 mt-0.5" />
              <div>
                Your backpack load will feel <span className="text-amber-300 font-extrabold">{((calculations.effortMultiplier - 1) * 100).toFixed(0)}% heavier</span> at the summit of <span className="font-extrabold">{selectedTrek.name}</span> ({selectedTrek.altitude}m) due to a <span className="text-amber-300 font-extrabold">{~~(calculations.altitude / 100)}hPa</span> pressure drop!
              </div>
            </div>
          </div>

          {/* Action Tools (Reset, Print, Back to Explore) */}
          <div className="flex gap-3 print:hidden">
            <button
              onClick={handleResetChecklist}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-950 py-3.5 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Checklist
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 py-3.5 text-xs font-bold text-white transition-colors cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              Print Manifest
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
