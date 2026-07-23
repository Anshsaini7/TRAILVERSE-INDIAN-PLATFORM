'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { treks, trekkingCompanies, Trek } from '../../data/mockData';
import TrekCard from '../../components/TrekCard';
import { 
  User, Award, Heart, Calendar, MapPin, Star, ShieldCheck, Compass, CheckCircle2, 
  ArrowUpRight, AwardIcon, HelpCircle, FileText, X, Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import DashboardWeatherWidget from '../../components/weather/DashboardWeatherWidget';
import { useWeather } from '../../context/WeatherContext';
import { useAuth } from '../../context/AuthContext';

interface DashboardCertificate {
  id: string;
  trekId: string;
  trek: Trek;
  completionDate: string;
  maxAltitude: number;
  leader: string;
}

interface DashboardSession {
  id: string;
  trekId: string;
  trekName: string;
  points: number;
  startTime: number;
  endTime: number;
  elapsedSeconds: number;
  completedKm?: number;
  maxAltitude?: number;
  state?: string;
}

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'certificates' | 'wishlist' | 'weather'>('bookings');
  const { unit, setUnit, timeFormat, setTimeFormat, forecastDays, setForecastDays } = useWeather();
  
  // Selected certificate for details popup
  const [selectedCert, setSelectedCert] = useState<DashboardCertificate | null>(null);

  // Load live tracker sessions for adventure stats
  const [sessions, setSessions] = useState<DashboardSession[]>([]);
  useEffect(() => {
    try {
      const stored = localStorage.getItem('tv_sessions');
      if (stored) {
        setTimeout(() => {
          setSessions(JSON.parse(stored));
        }, 0);
      }
    } catch {}
  }, []);

  const totalKm = sessions.reduce((s, sess) => s + (sess.completedKm ?? (sess.elapsedSeconds / 3600) * 3.5), 0);
  const highestAlt = sessions.reduce((max, sess) => Math.max(max, sess.maxAltitude ?? 0), 0);
  const statesExplored = new Set(sessions.map(s => s.state).filter((st): st is string => !!st && st !== 'Unknown')).size;

  const { user } = useAuth();
  
  // Load bookings from localStorage linked to logged-in user
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    try {
      const email = user?.email || 'abhinav@gmail.com';
      const stored = localStorage.getItem('tv_bookings');
      let userBookings = [];
      if (stored) {
        const allBookings = JSON.parse(stored);
        userBookings = allBookings.filter((b: any) => b.userEmail === email);
      }
      
      // If it is the default user and no bookings exist yet, seed a default booking
      if (userBookings.length === 0 && email === 'abhinav@gmail.com') {
        userBookings = [
          {
            id: 'b-991',
            trekId: 'hampta-pass',
            trekName: 'Hampta Pass',
            trek: treks[2], // Hampta Pass
            departureDate: '2026-07-15',
            persons: 2,
            price: 19800,
            status: 'Confirmed',
            company: trekkingCompanies[2], // Bikat Adventures
            userEmail: 'abhinav@gmail.com'
          }
        ];
      } else {
        // Resolve trek objects for any dynamic user bookings
        userBookings = userBookings.map((b: any) => ({
          ...b,
          trek: treks.find(t => t.id === b.trekId) || treks[0],
          company: trekkingCompanies.find(c => c.id === (treks.find(t => t.id === b.trekId)?.companyId || 'bikat'))
        }));
      }
      setBookings(userBookings);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  const userProfile = {
    name: user?.name || 'Abhinav Sharma',
    avatar: user?.role === 'ADMIN' ? '👑' : user?.role === 'GUIDE' ? '🏕️' : '🥾',
    badge: user?.role === 'ADMIN' ? 'Site Administrator' : user?.role === 'GUIDE' ? 'Certified Guide' : 'Peak Conqueror',
    altitudeGained: user?.email === 'abhinav@gmail.com' || !user ? 8839 : highestAlt || 0,
    points: user?.email === 'abhinav@gmail.com' || !user ? 3400 : Math.round(totalKm * 100),
    completedCount: user?.email === 'abhinav@gmail.com' || !user ? 2 : sessions.length,
    bookingsCount: bookings.length,
    savedCount: user?.email === 'abhinav@gmail.com' || !user ? 2 : (user?.saved_treks?.length || 0)
  };

  // Dynamic completed adventures (certificates)
  const completions = useMemo(() => {
    const email = user?.email || 'abhinav@gmail.com';
    if (email === 'abhinav@gmail.com') {
      return [
        {
          id: 'cert-101',
          trekId: 'roopkund',
          trek: treks[0], // Roopkund
          completionDate: '2025-10-10',
          maxAltitude: 5029,
          leader: 'Swathi Chatrapathy'
        },
        {
          id: 'cert-102',
          trekId: 'kedarkantha',
          trek: treks[1], // Kedarkantha
          completionDate: '2026-01-20',
          maxAltitude: 3810,
          leader: 'Arjun Majumdar'
        }
      ];
    }
    return sessions.map((s) => ({
      id: `cert-${s.id}`,
      trekId: s.trekId,
      trek: treks.find(t => t.id === s.trekId) || treks[0],
      completionDate: new Date(s.endTime).toLocaleDateString(),
      maxAltitude: s.maxAltitude || 3000,
      leader: 'Self Guided / Tracker Verified'
    }));
  }, [user, sessions]);

  // Dynamic wishlist (saved treks)
  const wishlist = useMemo(() => {
    const email = user?.email || 'abhinav@gmail.com';
    if (email === 'abhinav@gmail.com') {
      return [treks[3], treks[4]]; // Chadar, Goechala
    }
    if (user?.saved_treks) {
      return treks.filter(t => user.saved_treks?.includes(t.id));
    }
    return [];
  }, [user]);

  // Handle Certificate Click
  const handleCertClick = (cert: DashboardCertificate) => {
    setSelectedCert(cert);
    // Shoot celebratory confetti!
    confetti({
      particleCount: 120,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* 1. Profile Dashboard Banner */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-sm relative overflow-hidden mb-10">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-3xl border border-emerald-500/30 shrink-0">
              {userProfile.avatar}
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">{userProfile.name}</h1>
              <div className="flex items-center gap-1.5 justify-center md:justify-start mt-1 text-emerald-400 font-bold text-xs">
                <Award className="h-4 w-4" />
                <span>{userProfile.badge}</span>
                <span className="text-slate-500 font-medium">&bull;</span>
                <span className="text-slate-300 font-medium">{userProfile.points.toLocaleString()} pts</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 text-center border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-8 shrink-0 font-bold text-xs">
            <div>
              <span className="text-slate-500 block uppercase text-[9px] mb-0.5">Alt Gained</span>
              <span className="text-emerald-400 text-lg font-black">{userProfile.altitudeGained.toLocaleString()}m</span>
            </div>
            <div className="border-l border-slate-850 px-6">
              <span className="text-slate-500 block uppercase text-[9px] mb-0.5">Completed</span>
              <span className="text-slate-200 text-lg font-black">{userProfile.completedCount} Trails</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[9px] mb-0.5">Bookings</span>
              <span className="text-slate-200 text-lg font-black">{userProfile.bookingsCount} Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Dashboard Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-850 gap-6 text-sm font-bold mb-8">
        {([
          { id: 'bookings', label: '🎫 My Bookings' },
          { id: 'certificates', label: '🏆 Achievements' },
          { id: 'wishlist', label: '❤️ Wishlist' },
          { id: 'weather', label: '🌤️ Live Weather' }
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-500'
                : 'border-transparent text-slate-550 dark:text-slate-400 hover:text-emerald-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Tab Contents */}
      <div className="min-h-[300px]">
        <AnimatePresence mode="wait">

          {/* Weather Tab */}
          {activeTab === 'weather' && (
            <motion.div
              key="weather"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-6"
            >
              {/* Settings strip */}
              <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 rounded-2xl px-4 py-3 border border-slate-800">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">Preferences</span>
                {/* Temp unit */}
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-slate-400 font-semibold">Temp:</span>
                  {(['C','F'] as const).map(u => (
                    <button key={u} onClick={() => setUnit(u)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        unit === u ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
                      }`}>°{u}</button>
                  ))}
                </div>
                {/* Time format */}
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-slate-400 font-semibold">Clock:</span>
                  {(['12h','24h'] as const).map(f => (
                    <button key={f} onClick={() => setTimeFormat(f)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        timeFormat === f ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
                      }`}>{f}</button>
                  ))}
                </div>
                {/* Forecast days */}
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-slate-400 font-semibold">Forecast:</span>
                  {([7,14] as const).map(d => (
                    <button key={d} onClick={() => setForecastDays(d)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        forecastDays === d ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
                      }`}>{d} Days</button>
                  ))}
                </div>
              </div>
              <DashboardWeatherWidget />

              {/* Adventure Stats Section */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 mt-6 card-glow">
                <div className="flex items-center gap-2 mb-6">
                  <Compass className="h-5 w-5 text-emerald-500" />
                  <h3 className="text-lg font-black text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    🗺️ Adventure Stats
                  </h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl p-5 text-center">
                    <span className="text-2xl mb-2 block">📏</span>
                    <strong className="text-xl md:text-2xl font-black text-slate-900 dark:text-white block">
                      {totalKm.toFixed(2)} km
                    </strong>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mt-1">
                      Total Distance Trekked
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl p-5 text-center">
                    <span className="text-2xl mb-2 block">🏔️</span>
                    <strong className="text-xl md:text-2xl font-black text-slate-900 dark:text-white block">
                      {highestAlt > 0 ? `${highestAlt.toLocaleString()}m` : '-- m'}
                    </strong>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mt-1">
                      Highest Altitude Reached
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl p-5 text-center">
                    <span className="text-2xl mb-2 block">🏕️</span>
                    <strong className="text-xl md:text-2xl font-black text-slate-900 dark:text-white block">
                      {sessions.length} Treks
                    </strong>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mt-1">
                      Total Treks Logged
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl p-5 text-center">
                    <span className="text-2xl mb-2 block">🗺️</span>
                    <strong className="text-xl md:text-2xl font-black text-slate-900 dark:text-white block">
                      {statesExplored} State{statesExplored !== 1 ? 's' : ''}
                    </strong>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mt-1">
                      States Explored
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Active Bookings list */}
          {activeTab === 'bookings' && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-6"
            >
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div key={booking.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 card-glow font-medium">
                    <div className="flex gap-4">
                      {/* Image Thumbnail */}
                      <div className="relative h-20 w-32 rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800">
                        <img src={booking.trek ? booking.trek.image : ''} alt={booking.trek ? booking.trek.name : 'Trek'} className="object-cover h-full w-full" />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider block">Trip Ticket</span>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">{booking.trek ? booking.trek.name : booking.trekName}</h3>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500 font-bold">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Departure: {booking.departureDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            Operator: {booking.company ? booking.company.name : 'Verified Operator'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-end justify-between w-full md:w-auto border-t md:border-t-0 border-slate-100 dark:border-slate-800/60 pt-4 md:pt-0">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase text-right">Fare Paid</span>
                        <strong className="text-slate-800 dark:text-slate-200 text-sm font-black">₹{booking.price.toLocaleString()}</strong>
                      </div>
                      <span className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/15">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Confirmed
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 text-xs">
                  No active bookings found. Visit Explore page to start planning.
                </div>
              )}
            </motion.div>
          )}

          {/* Certificates completed list */}
          {activeTab === 'certificates' && (
            <motion.div
              key="certificates"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {completions.map((cert) => (
                <div
                  key={cert.id}
                  onClick={() => handleCertClick(cert)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center gap-4 cursor-pointer card-glow"
                >
                  <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-550 dark:text-amber-400 border border-amber-500/20 shadow-sm shrink-0">
                    <Award className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider block">Summit Certificate</span>
                    <h3 className="text-sm font-extrabold text-slate-905 dark:text-slate-100 mt-0.5">{cert.trek.name}</h3>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">Completed on {cert.completionDate} at {cert.maxAltitude}m altitude.</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-slate-400 shrink-0" />
                </div>
              ))}
            </motion.div>
          )}

          {/* Wishlist grid list */}
          {activeTab === 'wishlist' && (
            <motion.div
              key="wishlist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {wishlist.map(trek => (
                <div key={trek.id} className="relative group">
                  <TrekCard trek={trek} />
                  {/* Floating Heart indicator */}
                  <div className="absolute right-4 bottom-[230px] z-10">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/70 backdrop-blur-md text-rose-500 shadow-md">
                      <Heart className="h-4.5 w-4.5 fill-rose-500 text-rose-500 animate-pulse" />
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* 4. CERTIFICATE DETAIL MODAL */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
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

              {/* Award Certificate Layout */}
              <div className="border-4 border-double border-amber-500/30 p-8 rounded-2xl text-center relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-350">
                {/* Background decorative watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none scale-150">
                  <Compass className="h-40 w-40 stroke-[1]" />
                </div>

                <div className="flex justify-center mb-4 text-amber-500">
                  <Award className="h-16 w-16 stroke-[1.5]" />
                </div>
                
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block mb-2">TRAILVERSE INDIA OFFICIAL SUMMIT RECORD</span>
                <h2 className="text-xl font-serif font-black text-slate-900 dark:text-white leading-tight">Certificate of Achievement</h2>
                
                <p className="text-xs italic text-slate-400 mt-6 mb-4">This document certifies that</p>
                <strong className="text-lg font-bold text-slate-950 dark:text-white underline decoration-emerald-500 decoration-2 underline-offset-4">{userProfile.name}</strong>
                
                <p className="text-xs text-slate-500 mt-6 leading-relaxed max-w-sm mx-auto">
                  has successfully summited the high-altitude pass of <strong className="font-extrabold text-slate-850 dark:text-slate-200">{selectedCert.trek.name}</strong>, crossing an elevation of <strong className="text-emerald-500 font-black">{selectedCert.maxAltitude} meters</strong> above sea level on <strong className="font-extrabold text-slate-850 dark:text-slate-200">{selectedCert.completionDate}</strong>.
                </p>

                {/* Signatures */}
                <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-850 flex justify-between items-center text-[10px] text-slate-400">
                  <div>
                    <span className="font-serif italic text-slate-800 dark:text-slate-300 font-bold block mb-1">{userProfile.name.split(' ')[0]}</span>
                    <span>SUMMITEER RECORD</span>
                  </div>
                  <div>
                    <span className="font-serif italic text-slate-800 dark:text-slate-300 font-bold block mb-1">{selectedCert.leader}</span>
                    <span>EXPEDITION LEADER</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  setSelectedCert(null);
                  // Shoot another round!
                  confetti({
                    particleCount: 50,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 }
                  });
                  confetti({
                    particleCount: 50,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 }
                  });
                }}
                className="w-full bg-gradient-premium hover:bg-emerald-600 text-white font-bold py-3 rounded-2xl text-xs shadow-md transition-colors"
              >
                Close &amp; Keep Exploring
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
