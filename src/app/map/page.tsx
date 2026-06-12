'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const IndiaMap = dynamic(() => import('../../components/IndiaMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl animate-pulse gap-2">
      <div className="text-xs font-black uppercase tracking-wider text-slate-400">Initializing TrailVerse Google Map Engine...</div>
      <div className="text-[10px] text-slate-500">Loading satellite terrain coordinates</div>
    </div>
  )
});

export default function TrekMapPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-6">
      <div>
        <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-wider block">GEOGRAPHICAL EXPLORER</span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Adventure Map of India</h1>
        <p className="text-xs text-slate-500 mt-1">Locate high-altitude trails, base camps, operator headquarters, and paragliding/rafting sites on a live Google Map.</p>
      </div>

      <IndiaMap />
    </div>
  );
}
