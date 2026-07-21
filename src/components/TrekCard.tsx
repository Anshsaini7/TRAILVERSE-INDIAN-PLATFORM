'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trek, trekkingCompanies } from '../data/mockData';
import { Star, MapPin, Calendar, Clock, ArrowUpRight, Thermometer, Mountain } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrekCardProps {
  trek: Trek;
}

export default function TrekCard({ trek }: TrekCardProps) {
  const company = trekkingCompanies.find(c => c.id === trek.companyId);

  const [userRating, setUserRating] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`user_rating_${trek.id}`);
      setTimeout(() => {
        setUserRating(saved ? Number(saved).toFixed(1) : null);
      }, 0);
    }
  }, [trek.id]);

  // Difficulty badge coloring
  const getDifficultyColor = (diff: Trek['difficulty']) => {
    switch (diff) {
      case 'Easy':
      case 'Easy–Moderate':
      case 'Easy-Moderate':
        return 'bg-emerald-600 text-white border-emerald-500/30';
      case 'Medium':
      case 'Moderate':
        return 'bg-amber-500 text-white border-amber-400/30';
      case 'Hard':
      case 'Moderate–Hard':
      case 'Moderate-Hard':
        return 'bg-orange-500 text-white border-orange-400/30';
      case 'Extreme':
        return 'bg-rose-600 text-white border-rose-500/30';
      default:
        return 'bg-slate-700 text-white border-slate-600/30';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2, ease: 'easeOut' } }}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 card-glow shadow-sm h-full"
    >
      {/* Image Panel */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={trek.image}
          alt={trek.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 brightness-[0.93] contrast-[1.06]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* State Tag & Difficulty Badge */}
        <div className="absolute left-4 top-4 flex flex-col gap-1.5 items-start">
          <span className="rounded-full bg-slate-950/75 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white shadow-sm uppercase tracking-wide">
            {trek.state}
          </span>
          <span className={`rounded-full border px-3 py-1 text-[10px] font-black shadow-sm uppercase tracking-wider ${getDifficultyColor(trek.difficulty)}`}>
            {trek.difficulty}
          </span>
        </div>

        {/* Rating Floating Badge */}
        {userRating && (
          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-slate-100 shadow-md">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{userRating}</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
      </div>

      {/* Content Panel */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
          {trek.name}
        </h3>

        {/* Quick Parameters */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 my-4 text-xs font-medium text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Mountain className="h-4 w-4 text-slate-400" />
            <span>Alt: <strong className="text-slate-800 dark:text-slate-200">{trek.altitude}m</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-slate-400" />
            <span>Time: <strong className="text-slate-800 dark:text-slate-200">{trek.duration} Days</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span>Dist: <strong className="text-slate-800 dark:text-slate-200">{trek.distance} km</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Thermometer className="h-4 w-4 text-slate-400" />
            <span>Temp: <strong className="text-slate-800 dark:text-slate-200">{trek.tempRange.split(' ')[0]}</strong></span>
          </div>
        </div>

        {/* Base Camp Indicator */}
        <div className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-3 mb-4">
          Base Camp: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{trek.baseCamp}</strong>
        </div>

        {/* Operator Tag & Starting Price Row */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-4">
          {company && (
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-sm">
                {company.logo}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-medium">OPERATED BY</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{company.name}</span>
              </div>
            </div>
          )}
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-medium">STARTING FROM</span>
            <span className="text-base font-black text-emerald-500 dark:text-emerald-400">₹{trek.startingPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Link Button */}
        <Link href={`/trek/${trek.id}`} className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 dark:hover:bg-emerald-600 hover:text-white py-2.5 text-center text-sm font-bold text-slate-800 dark:text-slate-200 transition-all">
          <span>View Details</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}
