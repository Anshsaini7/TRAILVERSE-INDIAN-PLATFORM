'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { adventureActivities } from '../../data/mockData';
import { Calendar, Compass, ShieldAlert, Award, ArrowRight, Star, Thermometer, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

function ActivitiesClient() {
  const searchParams = useSearchParams();
  const [activeActivity, setActiveActivity] = useState<string>(adventureActivities[0].id);

  useEffect(() => {
    const activeId = searchParams.get('id');
    if (activeId && adventureActivities.some(a => a.id === activeId)) {
      setTimeout(() => {
        setActiveActivity(activeId);
        // Smooth scroll to the content details
        const el = document.getElementById('activity-details-panel');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  }, [searchParams]);

  const selectedActivity = adventureActivities.find(a => a.id === activeActivity) || adventureActivities[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-wider block">TRAILVERSE EXPERIENCES</span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Adventure Activities</h1>
        <p className="text-xs text-slate-500 mt-1">Find extreme sports and wilderness courses in India, comparing gear checklists and regional guidelines.</p>
      </div>

      {/* Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-9 gap-3 mb-10">
        {adventureActivities.map((act) => (
          <button
            key={act.id}
            onClick={() => setActiveActivity(act.id)}
            className={`py-3 px-2 border rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
              activeActivity === act.id
                ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:border-emerald-400 shadow-md scale-95'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-605 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span className="text-2xl">{act.icon}</span>
            <span className="text-[10px] font-black tracking-tight leading-none truncate max-w-[80px]">{act.category}</span>
          </button>
        ))}
      </div>

      {/* Detail Showcase Panel */}
      <div id="activity-details-panel" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 card-glow">
        
        {/* Left column details */}
        <div className="lg:col-span-8 flex flex-col gap-6 font-medium">
          <div>
            <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-wider block">CATEGORY GUIDE</span>
            <h2 className="text-2xl font-black text-slate-905 dark:text-white mt-1 flex items-center gap-2">
              <span>{selectedActivity.name}</span>
              <span className="text-xl">{selectedActivity.icon}</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed font-semibold">
              {selectedActivity.description}
            </p>
          </div>

          {/* Locations */}
          <div className="border-t border-slate-100 dark:border-slate-800/60 pt-6">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="h-4 w-4 text-emerald-500" />
              Best Locations in India
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedActivity.bestLocations.map((loc, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-2xl border border-slate-100 dark:border-slate-850">
                  <span className="text-xs font-extrabold text-slate-850 dark:text-slate-200">{loc.name}</span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">{loc.state}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Quick Specs */}
          <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col gap-4 text-xs font-semibold text-slate-500">
            <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-2">
              <div>
                <span className="text-[9px] uppercase tracking-wider block text-slate-400">STARTING PRICE</span>
                <strong className="text-lg font-black text-emerald-500">₹{selectedActivity.startingPrice.toLocaleString()}</strong>
              </div>
              <span className="text-[10px] font-bold">Estimated</span>
            </div>

            <div className="flex justify-between">
              <span>Difficulty Rank:</span>
              <span className="text-slate-850 dark:text-slate-200 font-bold">{selectedActivity.difficulty}</span>
            </div>
            <div className="flex justify-between">
              <span>Best Season:</span>
              <span className="text-slate-850 dark:text-slate-200 font-bold">{selectedActivity.season}</span>
            </div>
          </div>

          {/* Gear checklist */}
          <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-850">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Required Gear Checklist</h3>
            <div className="flex flex-col gap-2.5">
              {selectedActivity.gearRequired.map((gear, i) => (
                <div key={i} className="flex gap-2 items-start text-xs font-semibold text-slate-650 dark:text-slate-400">
                  <div className="h-4 w-4 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-3 w-3 fill-emerald-500 text-white" />
                  </div>
                  <span>{gear}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

// Global Activities wrap
export default function AdventureActivitiesPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-xs text-slate-400">
        <Compass className="h-10 w-10 animate-spin text-emerald-500 mb-2" />
        <span>Loading adventure courses...</span>
      </div>
    }>
      <ActivitiesClient />
    </Suspense>
  );
}

// Tiny check helper
function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
