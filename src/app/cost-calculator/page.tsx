'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { treks, Trek } from '../../data/mockData';
import { Calculator, Plane, Train, Bus, Shield, User, ArrowRight, Check, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CostCalculator() {
  const [selectedTrekId, setSelectedTrekId] = useState(treks[0]?.id || '');
  const [groupSize, setGroupSize] = useState(2);
  const [transitType, setTransitType] = useState<'flight' | 'train' | 'bus' | 'none'>('train');
  const [accommTier, setAccommTier] = useState<'standard' | 'luxury'>('standard');
  
  // Gear Rental checkboxes
  const [rentWarmGear, setRentWarmGear] = useState(false);
  const [rentShoesPoles, setRentShoesPoles] = useState(false);
  
  // Support services
  const [needPorter, setNeedPorter] = useState(false);
  const [personalGuide, setPersonalGuide] = useState(false);

  const selectedTrek = useMemo(() => {
    return treks.find(t => t.id === selectedTrekId) || treks[0];
  }, [selectedTrekId]);

  // Compute budget breakdown dynamically
  const budget = useMemo(() => {
    if (!selectedTrek) return { transport: 0, package: 0, stay: 0, gear: 0, support: 0, total: 0, perPerson: 0 };

    const days = selectedTrek.duration;

    // 1. Transport Cost
    let baseTransitPerPerson = 0;
    if (transitType === 'flight') baseTransitPerPerson = 7500;
    else if (transitType === 'train') baseTransitPerPerson = 1200;
    else if (transitType === 'bus') baseTransitPerPerson = 750;
    const transportTotal = baseTransitPerPerson * groupSize;

    // 2. Base Package Cost
    const packageTotal = selectedTrek.startingPrice * groupSize;

    // 3. Stay Upgrade
    const stayUpgradeRate = accommTier === 'luxury' ? 1200 : 0;
    const stayTotal = stayUpgradeRate * days * groupSize;

    // 4. Gear Rental
    let gearRate = 0;
    if (rentWarmGear) gearRate += 600;
    if (rentShoesPoles) gearRate += 350;
    const gearTotal = gearRate * groupSize;

    // 5. Support Services
    // 1 porter per 2 people
    const porterRate = needPorter ? Math.ceil(groupSize / 2) * 1000 * days : 0;
    const guideRate = personalGuide ? 1500 * days : 0;
    const supportTotal = porterRate + guideRate;

    // Total calculations
    const total = transportTotal + packageTotal + stayTotal + gearTotal + supportTotal;
    const perPerson = total / groupSize;

    return {
      transport: transportTotal,
      package: packageTotal,
      stay: stayTotal,
      gear: gearTotal,
      support: supportTotal,
      total,
      perPerson
    };
  }, [selectedTrek, groupSize, transitType, accommTier, rentWarmGear, rentShoesPoles, needPorter, personalGuide]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500 font-extrabold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-3">
          <Calculator className="h-3.5 w-3.5" />
          Interactive Budget Calculator
        </span>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Calculate Adventure Expenses
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          Customise transit routes, gear rentals, porter support, and group sizes to estimate complete expedition expenditures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Parameters Form */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col gap-5">
            
            {/* Trek Select */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Expedition Trek</label>
              <select
                value={selectedTrekId}
                onChange={(e) => setSelectedTrekId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-3 text-xs focus:outline-none font-bold text-slate-850 dark:text-slate-200 cursor-pointer"
              >
                {treks.map(t => (
                  <option key={t.id} value={t.id}>{t.name} (₹{t.startingPrice.toLocaleString()} / person)</option>
                ))}
              </select>
            </div>

            {/* Group Size Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Group Size</label>
                <span className="text-xs font-black text-emerald-500 flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {groupSize} {groupSize === 1 ? 'Explorer' : 'Explorers'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={groupSize}
                onChange={(e) => setGroupSize(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-1">
                <span>1 Person</span>
                <span>8 Persons</span>
                <span>15 Persons</span>
              </div>
            </div>

            {/* Transit Route Selector */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-2">Transit Options</label>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                {[
                  { key: 'flight', label: 'Flight', icon: Plane, cost: '₹7.5k' },
                  { key: 'train', label: 'Train', icon: Train, cost: '₹1.2k' },
                  { key: 'bus', label: 'Bus', icon: Bus, cost: '₹750' },
                  { key: 'none', label: 'None (Local)', icon: Shield, cost: '₹0' }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = transitType === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setTransitType(item.key as any)}
                      className={`flex items-center justify-between p-3 border rounded-xl transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 border-slate-900 text-white dark:bg-emerald-500 dark:border-emerald-400 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </span>
                      <span className={`text-[9px] font-extrabold ${isSelected ? 'text-emerald-250' : 'text-slate-400'}`}>{item.cost}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stay Tier Option */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1.5">Stay Category</label>
              <div className="grid grid-cols-2 gap-2.5 text-xs font-bold">
                {[
                  { key: 'standard', label: 'Standard Alpine', details: 'Basic tents / homestays' },
                  { key: 'luxury', label: 'Luxury Glamping', details: 'Add ₹1.2k/day' }
                ].map(item => {
                  const isSelected = accommTier === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setAccommTier(item.key as any)}
                      className={`p-3 border rounded-xl flex flex-col text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 border-slate-900 text-white dark:bg-emerald-500 dark:border-emerald-400 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                      }`}
                    >
                      <span className="text-xs">{item.label}</span>
                      <span className={`text-[9px] mt-0.5 font-medium ${isSelected ? 'text-slate-300 dark:text-emerald-100' : 'text-slate-400'}`}>{item.details}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Extras Section */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Equipment & Support Staff</label>
              
              {/* Gear Warm Bundle */}
              <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={rentWarmGear}
                  onChange={(e) => setRentWarmGear(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-800 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-850 dark:text-slate-250 block">Warm Wear Rental (₹600)</span>
                  <span className="text-[9px] text-slate-400">Insulated down jacket, base thermal set, and heavy gloves.</span>
                </div>
              </label>

              {/* Gear Shoes Poles */}
              <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={rentShoesPoles}
                  onChange={(e) => setRentShoesPoles(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-800 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-850 dark:text-slate-250 block">Shoes & Trekking Poles (₹350)</span>
                  <span className="text-[9px] text-slate-400">High traction water-resistant boots & dual shock-absorbent poles.</span>
                </div>
              </label>

              {/* Porter service */}
              <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={needPorter}
                  onChange={(e) => setNeedPorter(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-800 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-850 dark:text-slate-250 block">Mule/Porter Bag Carriage (₹1,000/day per mule)</span>
                  <span className="text-[9px] text-slate-400">Carries personal luggage up to 12kg on the trail (1 porter per 2 people).</span>
                </div>
              </label>

              {/* Personal Guide */}
              <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={personalGuide}
                  onChange={(e) => setPersonalGuide(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-800 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-850 dark:text-slate-250 block">Dedicated Personal Guide (₹1,500/day)</span>
                  <span className="text-[9px] text-slate-400">Private certified expert guide for navigation and emergency safety.</span>
                </div>
              </label>
            </div>

          </div>
        </div>

        {/* Right Side: Cost Breakdown Display */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Main Visual Display */}
          <div className="bg-gradient-premium p-6 rounded-3xl text-white shadow-md flex justify-between items-center flex-wrap gap-4">
            <div>
              <span className="text-[10px] text-emerald-200 font-extrabold uppercase tracking-widest block">BUDGET ESTIMATION</span>
              <h2 className="text-2xl font-black mt-0.5">{selectedTrek.name}</h2>
              <span className="text-xs text-emerald-100 block mt-1">For {groupSize} {groupSize === 1 ? 'person' : 'people'} ({selectedTrek.duration} Days)</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <span className="text-[9px] text-emerald-100 font-bold block uppercase">Est. Total Cost</span>
                <strong className="text-2xl font-black leading-none">₹{budget.total.toLocaleString()}</strong>
              </div>
              <div className="w-[1px] h-8 bg-white/20" />
              <div className="text-center">
                <span className="text-[9px] text-emerald-100 font-bold block uppercase">Cost / Person</span>
                <strong className="text-base font-black leading-none">₹{Math.round(budget.perPerson).toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* Breakdown progress bar chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Expense Allocation Breakdown</h3>
            
            <div className="space-y-5 text-[10px] text-slate-500 font-bold">
              {/* Transit Cost */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span>TRANSIT &amp; TRANSPORTATION</span>
                  <span className="text-slate-800 dark:text-slate-200">₹{budget.transport.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full" style={{ width: `${(budget.transport / budget.total) * 100}%` }} />
                </div>
              </div>

              {/* Base Operator Package Cost */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span>BASE OPERATOR TREK BUNDLE</span>
                  <span className="text-slate-800 dark:text-slate-200">₹{budget.package.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${(budget.package / budget.total) * 100}%` }} />
                </div>
              </div>

              {/* Luxury Stay Upgrades */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span>STAY / CAMPING UPGRADES</span>
                  <span className="text-slate-800 dark:text-slate-200">₹{budget.stay.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full" style={{ width: `${(budget.stay / budget.total) * 100 || 0}%` }} />
                </div>
              </div>

              {/* Equipment Rental Cost */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span>EQUIPMENT &amp; APPAREL RENTALS</span>
                  <span className="text-slate-800 dark:text-slate-200">₹{budget.gear.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full" style={{ width: `${(budget.gear / budget.total) * 100 || 0}%` }} />
                </div>
              </div>

              {/* Support Staff Cost */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span>SUPPORT STAFF (PORTER / GUIDE)</span>
                  <span className="text-slate-800 dark:text-slate-200">₹{budget.support.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-pink-500 h-full" style={{ width: `${(budget.support / budget.total) * 100 || 0}%` }} />
                </div>
              </div>
            </div>

            {/* Note alert */}
            <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 rounded-2xl p-4 flex gap-3 text-xs text-slate-500 leading-relaxed font-medium">
              <AlertCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 dark:text-slate-250 block">Pricing Disclaimer:</strong>
                These are estimated calculations based on average operator tariffs, standard flight index rates, and local gear lists. Actual booking tariffs may vary depending on season windows and seat occupancy states.
              </div>
            </div>
          </div>

          {/* Action redirects */}
          <div className="flex gap-4">
            <Link
              href="/explore"
              className="flex-1 py-3 px-4 text-center rounded-2xl border border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300 text-xs hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
            >
              Back to Explorer
            </Link>
            <Link
              href={`/trek/${selectedTrek.id}`}
              className="flex-1 flex items-center justify-center gap-1 bg-gradient-premium hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-2xl text-xs shadow-md transition-colors text-center cursor-pointer"
            >
              <span>Verify Open Dates &amp; Book</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
