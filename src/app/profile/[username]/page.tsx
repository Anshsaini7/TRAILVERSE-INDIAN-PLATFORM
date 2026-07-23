'use client';

import React, { use, useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { treks } from '../../../data/mockData';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, MapPin, Heart, Compass, Check, X, Grid, Bookmark, 
  Users, ShieldCheck, Mail, ArrowLeft 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProfileParams {
  params: Promise<{ username: string }>;
}

export default function OtherTravelerProfilePage({ params }: ProfileParams) {
  const { username } = use(params);
  const { user: currentUser } = useAuth();
  const decodedUsername = decodeURIComponent(username);

  // Connection states
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(142);
  const [selectedCert, setSelectedCert] = useState<any>(null);

  // Mock matching target user
  const travelerData = {
    name: decodedUsername.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    username: decodedUsername,
    avatar: '🧗',
    city: 'Mumbai',
    bio: 'High altitude climber and adventure sports enthusiast. Traveled across Zanskar and West Sikkim.',
    completed_treks: ['goechala', 'roopkund'],
    points: 2800,
    altitudeGained: 9636,
  };

  const completedTrekObjects = treks.filter(t => 
    travelerData.completed_treks.includes(t.id)
  );

  const postsGallery = [
    { id: 'post-1', url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80', likes: 180, caption: 'Bedni Bugyal ridge.' },
    { id: 'post-2', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80', likes: 92, caption: 'At Goechala viewpoint.' },
    { id: 'post-3', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80', likes: 231, caption: 'Camp 1 pitching.' }
  ];

  const handleFollowToggle = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowersCount(prev => prev - 1);
    } else {
      setIsFollowing(true);
      setFollowersCount(prev => prev + 1);
      confetti({ particleCount: 40, spread: 30 });
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 font-medium text-xs text-slate-700 dark:text-slate-300">
      
      {/* Back link */}
      <Link href="/community" className="inline-flex items-center gap-1 text-emerald-500 font-extrabold hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Community
      </Link>

      {/* 1. INSTAGRAM PROFILE HEADER */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start relative card-glow">
        
        {/* Avatar */}
        <div className="h-28 w-28 rounded-full bg-emerald-500/10 border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center text-5xl shadow-md select-none">
          {travelerData.avatar}
        </div>

        {/* Profile Info */}
        <div className="flex-1 flex flex-col gap-4 text-center md:text-left w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
                {travelerData.name}
              </h1>
              <span className="text-slate-450 font-bold block text-xs mt-0.5">@{travelerData.username}</span>
            </div>
            
            {/* Follow/Unfollow action */}
            {currentUser?.username !== travelerData.username && (
              <button
                onClick={handleFollowToggle}
                className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-md cursor-pointer ${
                  isFollowing 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200' 
                    : 'bg-gradient-premium text-white hover:opacity-95'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow Explorer'}
              </button>
            )}
          </div>

          {/* Social Stats count strip */}
          <div className="flex justify-center md:justify-start gap-8 border-y border-slate-100 dark:border-slate-800/60 py-3 text-center">
            <div>
              <span className="text-slate-900 dark:text-white font-black text-base block">{postsGallery.length}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Posts</span>
            </div>
            <div>
              <span className="text-slate-900 dark:text-white font-black text-base block">{followersCount}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Followers</span>
            </div>
            <div>
              <span className="text-slate-900 dark:text-white font-black text-base block">120</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Following</span>
            </div>
          </div>

          {/* Bio details */}
          <div className="flex flex-col gap-1 text-slate-500 dark:text-slate-405">
            <span className="flex items-center justify-center md:justify-start gap-1 font-bold text-xs">
              <MapPin className="h-4 w-4 text-emerald-500" />
              {travelerData.city}
            </span>
            <p className="leading-relaxed mt-2 text-xs font-semibold">
              {travelerData.bio}
            </p>
          </div>
        </div>
      </section>

      {/* 2. ADVENTURE POST GRID */}
      <div className="mt-10 flex flex-col gap-6">
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Grid className="h-5 w-5 text-emerald-500" />
            Adventure Grid
          </h2>
          <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase">
            Completed: {completedTrekObjects.length} treks
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {postsGallery.map((post) => (
            <div 
              key={post.id} 
              className="group relative h-56 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer card-glow"
            >
              <img src={post.url} alt="" className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-500" />
              
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-extrabold">
                <span className="flex items-center gap-1 text-sm">
                  <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
                  {post.likes}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SUMMIT CERTIFICATES */}
      <div className="mt-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          Verified Summit Certificates ({completedTrekObjects.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-bold text-slate-800 dark:text-slate-250">
          {completedTrekObjects.map(trek => (
            <button
              key={trek.id}
              onClick={() => {
                setSelectedCert({
                  trek,
                  completionDate: '2026-02-12',
                  maxAltitude: trek.altitude,
                  leader: 'Arjun Majumdar'
                });
                confetti({ particleCount: 80, spread: 50 });
              }}
              className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-850 hover:border-amber-400 text-left transition-colors cursor-pointer"
            >
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-black truncate">{trek.name}</h4>
                <p className="text-[10px] text-slate-450 mt-0.5">{trek.altitude}m elevation &bull; verified</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. SUMMIT CERTIFICATE MODAL */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm font-semibold">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-8 relative flex flex-col gap-6"
            >
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute right-6 top-6 p-1 rounded-lg text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="border-4 border-double border-amber-500/30 p-8 rounded-2xl text-center relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-350">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none scale-150">
                  <Compass className="h-40 w-40 stroke-[1]" />
                </div>

                <div className="flex justify-center mb-4 text-amber-500">
                  <Award className="h-16 w-16 stroke-[1.5]" />
                </div>
                
                <span className="text-[10px] font-bold text-amber-500 tracking-widest block mb-2">TRAILVERSE INDIA OFFICIAL SUMMIT RECORD</span>
                <h2 className="text-xl font-serif font-black text-slate-900 dark:text-white leading-tight">Certificate of Achievement</h2>
                
                <p className="text-xs italic text-slate-400 mt-6 mb-4">This document certifies that</p>
                <strong className="text-lg font-bold text-slate-950 dark:text-white underline decoration-emerald-500 decoration-2 underline-offset-4">{travelerData.name}</strong>
                
                <p className="text-xs text-slate-500 mt-6 leading-relaxed max-w-sm mx-auto">
                  has successfully summited the high-altitude pass of <strong className="font-extrabold text-slate-850 dark:text-slate-200">{selectedCert.trek.name}</strong>, crossing an elevation of <strong className="text-emerald-500 font-black">{selectedCert.maxAltitude} meters</strong> above sea level on <strong className="font-extrabold text-slate-850 dark:text-slate-200">{selectedCert.completionDate}</strong>.
                </p>

                <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-850 flex justify-between items-center text-[10px] text-slate-450">
                  <div>
                    <span className="font-serif italic text-slate-800 dark:text-slate-300 block mb-1">{travelerData?.name ? travelerData.name.split(' ')[0] : 'Summiteer'}</span>
                    <span>SUMMITEER RECORD</span>
                  </div>
                  <div>
                    <span className="font-serif italic text-slate-800 dark:text-slate-300 block mb-1">{selectedCert.leader}</span>
                    <span>EXPEDITION LEADER</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCert(null)}
                className="w-full bg-gradient-premium hover:bg-emerald-600 text-white font-bold py-3.5 rounded-2xl text-xs shadow-md transition-colors"
              >
                Close Certificate
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
