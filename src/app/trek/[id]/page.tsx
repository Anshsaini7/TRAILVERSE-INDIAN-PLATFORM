'use client';

import React, { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { treks, trekkingCompanies } from '../../../data/mockData';
import ElevationProfile from '../../../components/ElevationProfile';
import TrekGuidePdf from '../../../components/TrekGuidePdf';
import { 
  Star, MapPin, Calendar, Clock, ChevronRight, Check, Play, ShieldCheck, 
  Thermometer, Activity, Compass, Info, Heart, ArrowLeft, HeartOff, Phone, 
  Map, Download, FileText, CheckSquare, Square, CreditCard, Cross 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useTrekWeather } from '../../../hooks/useTrekWeather';
import { useWeather } from '../../../context/WeatherContext';
import { useAuth } from '../../../context/AuthContext';
import CurrentWeatherCard from '../../../components/weather/CurrentWeatherCard';
import ForecastStrip from '../../../components/weather/ForecastStrip';
import TempTrendChart from '../../../components/weather/TempTrendChart';
import RainForecastChart from '../../../components/weather/RainForecastChart';
import SafetyAlerts from '../../../components/weather/SafetyAlerts';
import WeatherComparison from '../../../components/weather/WeatherComparison';

interface TrekDetailsProps {
  params: Promise<{ id: string }>;
}

export default function TrekDetailsPage({ params }: TrekDetailsProps) {
  const router = useRouter();
  const { id } = use(params);
  const { user } = useAuth();
  
  // Locate Trek and Operator
  const trek = treks.find(t => t.id === id);
  const company = trek ? trekkingCompanies.find(c => c.id === trek.companyId) : null;

  // Interface States
  const [activeTab, setActiveTab] = useState<'overview' | 'route' | 'logistics' | 'faq' | 'weather'>('overview');
  const [activeImage, setActiveImage] = useState(0);
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({});
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Weather data for this trek
  const trekWeather = useTrekWeather(
    trek ? trek.coordinates.lat : null,
    trek ? trek.coordinates.lon : null
  );
  const { userWeather, userLocation, forecastDays } = useWeather();
  
  // Booking / PDF Guide States
  const [pdfOpen, setPdfOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingPersons, setBookingPersons] = useState(1);

  // Offline Sync & GPX States
  const [isDownloadingOffline, setIsDownloadingOffline] = useState(false);
  const [offlineProgress, setOfflineProgress] = useState(0);
  const [isOfflineSaved, setIsOfflineSaved] = useState(false);

  // User Review & Rating States
  const [localReviews, setLocalReviews] = useState<any[]>([]);
  const [userRating, setUserRating] = useState<string | null>(null);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Load local reviews & user rating on client side mount
  React.useEffect(() => {
    if (!trek) return;
    if (typeof window !== 'undefined') {
      const cachedReviews = localStorage.getItem(`local_reviews_${trek.id}`);
      if (cachedReviews) {
        setLocalReviews(JSON.parse(cachedReviews));
      } else {
        setLocalReviews([]);
      }

      const savedRating = localStorage.getItem(`user_rating_${trek.id}`);
      if (savedRating) {
        setUserRating(Number(savedRating).toFixed(1));
      }
    }
  }, [trek?.id]);

  // Handle Review Submission
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trek) return;
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    const newRevObj = {
      id: `usr_${Date.now()}`,
      user: newReviewName.trim(),
      avatar: '🧑',
      rating: newReviewRating,
      date: new Date().toISOString().split('T')[0],
      comment: newReviewComment.trim()
    };

    const updatedReviews = [newRevObj, ...localReviews];
    setLocalReviews(updatedReviews);
    localStorage.setItem(`local_reviews_${trek.id}`, JSON.stringify(updatedReviews));

    // Calculate new average rating based on user-submitted ratings
    const sum = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = sum / updatedReviews.length;
    
    setUserRating(avg.toFixed(1));
    localStorage.setItem(`user_rating_${trek.id}`, avg.toString());

    setReviewSuccess(true);
    setNewReviewName('');
    setNewReviewComment('');
    setNewReviewRating(5);

    setTimeout(() => {
      setReviewSuccess(false);
    }, 4000);
  };

  // Handle GPX Route Download
  const handleDownloadGpx = () => {
    if (!trek) return;
    const gpxHeader = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="TrailVerse India" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${trek.name} Route</name>
    <desc>GPS coordinates route for ${trek.name} in ${trek.state}</desc>
  </metadata>
  <trk>
    <name>${trek.name}</name>
    <trkseg>`;
    
    const coordsList = trek.routeCoordinates && trek.routeCoordinates.length > 0
      ? trek.routeCoordinates
      : [trek.coordinates];

    const gpxPoints = coordsList.map(pt => `      <trkpt lat="${pt.lat}" lon="${pt.lon}">
        <ele>${trek.altitude}</ele>
      </trkpt>`).join('\n');
      
    const gpxFooter = `    </trkseg>
  </trk>
</gpx>`;
    
    const gpxContent = gpxHeader + '\n' + gpxPoints + '\n' + gpxFooter;
    const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${trek.id}-route.gpx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Offline Cache Download
  const handleOfflineSync = () => {
    if (!trek) return;
    if (isOfflineSaved) {
      setIsOfflineSaved(false);
      setOfflineProgress(0);
      localStorage.removeItem(`offline_trek_${trek.id}`);
      return;
    }
    
    setIsDownloadingOffline(true);
    setOfflineProgress(0);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setOfflineProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsDownloadingOffline(false);
        setIsOfflineSaved(true);
        localStorage.setItem(`offline_trek_${trek.id}`, JSON.stringify(trek));
      }
    }, 250);
  };

  if (!trek) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-4">
        <Compass className="h-12 w-12 text-slate-300 dark:text-slate-700 animate-spin mb-4" />
        <h2 className="text-xl font-bold">Trek profile not found</h2>
        <p className="text-xs text-slate-400 mt-1 mb-6">We could not locate this trek ID in the TrailVerse database.</p>
        <Link href="/explore" className="bg-gradient-premium px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md">
          Return to Explorer
        </Link>
      </div>
    );
  }

  // Handle Packing Checklist Toggling
  const toggleChecklistItem = (item: string) => {
    setChecklist(prev => ({ ...prev, [item]: !prev[item] }));
  };

  // Handle Booking Trigger
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate || !trek) return;

    try {
      const stored = localStorage.getItem('tv_bookings');
      const allBookings = stored ? JSON.parse(stored) : [];
      const newBooking = {
        id: 'b-' + Math.floor(Math.random() * 10000),
        trekId: trek.id,
        trekName: trek.name,
        departureDate: bookingDate,
        persons: bookingPersons,
        price: (trek.startingPrice || 10000) * bookingPersons,
        status: 'Confirmed',
        userEmail: user?.email || 'guest@gmail.com',
        bookingDate: new Date().toISOString()
      };
      allBookings.push(newBooking);
      localStorage.setItem('tv_bookings', JSON.stringify(allBookings));
    } catch (err) {
      console.error('Failed to save booking:', err);
    }

    setBookingSuccess(true);
    // Trigger canvas confetti on successful booking simulation!
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Difficulty colors
  const getDiffLabel = (diff: string) => {
    switch (diff) {
      case 'Easy':
      case 'Easy–Moderate':
      case 'Easy-Moderate':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Medium':
      case 'Moderate':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Hard':
      case 'Moderate–Hard':
      case 'Moderate-Hard':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Extreme':
        return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10';
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 pb-20">
      
      {/* 1. HERO BANNER PORTAL */}
      <section className="relative h-[55vh] min-h-[400px] w-full overflow-hidden">
        <Image
          src={trek.images[activeImage] || trek.image}
          alt={trek.name}
          fill
          priority
          className="object-cover transition-all duration-500 brightness-[0.4]"
        />

        {/* Floating Top controls */}
        <div className="absolute inset-x-0 top-6 z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/explore" className="flex items-center gap-1.5 rounded-full bg-slate-950/60 backdrop-blur-md text-white font-bold py-2 px-4 text-xs hover:bg-slate-950/80 transition-all border border-white/10">
            <ArrowLeft className="h-4 w-4" />
            Back to Explore
          </Link>
          <button 
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/60 backdrop-blur-md text-white hover:bg-slate-950/80 transition-all border border-white/10"
            aria-label="Bookmark trek"
          >
            <Heart className={`h-4.5 w-4.5 ${isBookmarked ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Hero Meta Panel */}
        <div className="absolute inset-x-0 bottom-12 z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start gap-4">
            <span className="rounded-full bg-emerald-500 px-3.5 py-1 text-xs font-bold text-white shadow-md">
              {trek.state}
            </span>
            <h1 className="text-3xl font-black text-white sm:text-5xl tracking-tight leading-none drop-shadow-md">
              {trek.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-300 font-medium">
              {userRating ? (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <strong className="text-white">{userRating}</strong> ({localReviews.length} review{localReviews.length !== 1 ? 's' : ''})
                </span>
              ) : (
                <span className="text-slate-350 dark:text-slate-400 text-xs font-bold bg-slate-900/40 backdrop-blur-md px-3 py-1 rounded-full">
                  No ratings yet
                </span>
              )}
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-slate-400" />
                Base Camp: <strong className="text-white">{trek.baseCamp}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Gradient shadow overlay */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent" />
      </section>

      {/* 2. IMAGE THUMBNAIL CAROUSEL */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {trek.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={`relative h-20 w-32 shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
                activeImage === idx ? 'border-emerald-500 scale-95 shadow-md' : 'border-transparent hover:border-slate-300'
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* 3. TECHNICAL METRICS BAR */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm text-center">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase">Difficulty</span>
            <span className={`mt-1.5 block mx-auto w-fit rounded-full px-3 py-0.5 text-xs font-bold border ${getDiffLabel(trek.difficulty)}`}>
              {trek.difficulty}
            </span>
          </div>
          <div className="border-l border-slate-100 dark:border-slate-800/60 md:pl-2">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase">Max Altitude</span>
            <strong className="mt-1 block text-lg font-black text-slate-800 dark:text-white">{trek.altitude}m</strong>
          </div>
          <div className="border-l border-slate-100 dark:border-slate-800/60 md:pl-2">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase">Trail Distance</span>
            <strong className="mt-1 block text-lg font-black text-slate-800 dark:text-white">{trek.distance} km</strong>
          </div>
          <div className="border-l border-slate-100 dark:border-slate-800/60 md:pl-2">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase">Duration</span>
            <strong className="mt-1 block text-lg font-black text-slate-800 dark:text-white">{trek.duration} Days</strong>
          </div>
          <div className="border-l border-slate-100 dark:border-slate-800/60 md:pl-2">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase">Temp Range</span>
            <strong className="mt-1 block text-lg font-black text-slate-800 dark:text-white">{trek.tempRange.split(' ')[0]}</strong>
          </div>
          <div className="border-l border-slate-100 dark:border-slate-800/60 md:pl-2">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase">Oxygen Level</span>
            <strong className="mt-1 block text-sm font-black text-rose-500 dark:text-rose-400">{trek.oxygenLevel.split(' ')[0]} Oxygen</strong>
          </div>
        </div>
      </div>

      {/* 4. MAIN DETAILS SECTION (Double Column layout) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Content tabs and charts */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Tabs Header */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-bold overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'route', label: 'Trail Route' },
                { id: 'logistics', label: 'Transit & Safety' },
                { id: 'weather', label: '🌤️ Weather' },
                { id: 'faq', label: 'FAQs' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
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

            {/* Tab content wrappers */}
            <div className="min-h-[300px]">
              
              {/* Tab 0: Weather Dashboard */}
              {activeTab === 'weather' && trek && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 py-4">

                  {/* Safety Alerts */}
                  <SafetyAlerts alerts={trekWeather.alerts} />

                  {/* Current Conditions */}
                  {trekWeather.loading && (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                      <span className="ml-3 text-xs text-slate-400">Loading live weather for {trek.name}…</span>
                    </div>
                  )}

                  {trekWeather.current && (
                    <CurrentWeatherCard
                      weather={trekWeather.current}
                      location={{ city: trek.baseCamp, state: trek.state }}
                      title={`Current Conditions — ${trek.name}`}
                    />
                  )}

                  {/* City vs Trek Comparison */}
                  {userWeather && trekWeather.current && (
                    <WeatherComparison
                      cityWeather={userWeather}
                      cityName={userLocation?.city ?? 'Your City'}
                      trekWeather={trekWeather.current}
                      trekName={trek.name}
                    />
                  )}

                  {/* 7-day / 14-day Forecast */}
                  {trekWeather.forecast.length > 0 && (
                    <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800">
                      <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">📅 {forecastDays}-Day Forecast</div>
                      <ForecastStrip forecast={trekWeather.forecast} maxDays={forecastDays} />
                    </div>
                  )}

                  {/* Temperature Trend Chart */}
                  {trekWeather.hourly.length > 0 && (
                    <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800">
                      <TempTrendChart hourly={trekWeather.hourly} hours={48} />
                    </div>
                  )}

                  {/* Rain Forecast */}
                  {trekWeather.hourly.length > 0 && (
                    <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800">
                      <RainForecastChart hourly={trekWeather.hourly} showSnow={false} hours={48} />
                    </div>
                  )}

                  {/* Snow Forecast */}
                  {trekWeather.hourly.some(h => h.snowDepth > 0) && (
                    <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800">
                      <RainForecastChart hourly={trekWeather.hourly} showSnow hours={48} />
                    </div>
                  )}

                  {/* Altitude Info */}
                  <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">⛰️ Altitude & Temperature</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'Max Altitude', value: `${trek.altitude.toLocaleString()} m` },
                        { label: 'Temp Range', value: trek.tempRange },
                        { label: 'Best Season', value: trek.bestSeason },
                        { label: 'Oxygen at Summit', value: trek.oxygenLevel }
                      ].map(item => (
                        <div key={item.label} className="bg-white/5 rounded-xl p-3 text-center">
                          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">{item.label}</div>
                          <div className="text-xs font-black text-emerald-400">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                </motion.div>
              )}

              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-3">Trek Overview</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      {trek.overview}
                    </p>
                  </div>

                  {/* Elevation Profile */}
                  <ElevationProfile profile={trek.elevationProfile} trekName={trek.name} />

                  {/* Packing Checklist */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">Interactive Packing Checklist</h3>
                    <p className="text-xs text-slate-400 mb-6 font-medium">Mark off items as you pack them in your rucksack.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {trek.packingChecklist.map((cat) => (
                        <div key={cat.category}>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-800 pb-1.5 uppercase tracking-wider">{cat.category}</h4>
                          <div className="flex flex-col gap-2.5">
                            {cat.items.map((item) => {
                              const isChecked = !!checklist[item];
                              return (
                                <button
                                  key={item}
                                  onClick={() => toggleChecklistItem(item)}
                                  className="flex items-center gap-2.5 text-xs text-left cursor-pointer hover:text-emerald-500 transition-colors"
                                >
                                  {isChecked ? (
                                    <div className="flex h-4 w-4 items-center justify-center rounded bg-emerald-500 text-white shrink-0">
                                      <Check className="h-3 w-3 stroke-[3]" />
                                    </div>
                                  ) : (
                                    <div className="h-4 w-4 rounded border border-slate-300 dark:border-slate-700 shrink-0" />
                                  )}
                                  <span className={isChecked ? 'line-through text-slate-400 dark:text-slate-600' : 'text-slate-600 dark:text-slate-400 font-medium'}>{item}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 2: Route Nodes */}
              {activeTab === 'route' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                  {/* Route Outline Steps */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-6">Complete Trek Route</h3>
                    <div className="relative border-l border-slate-250 dark:border-slate-800 ml-3 pl-6 space-y-8">
                      {trek.route.map((node, i) => {
                        const isSummit = node.toLowerCase().includes('summit') || node.toLowerCase().includes('peak');
                        const isBase = i === 1;

                        return (
                          <div key={i} className="relative">
                            {/* Dot node */}
                            <span className={`absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white dark:border-slate-900 ${
                              isSummit ? 'bg-rose-500 scale-125' : isBase ? 'bg-cyan-500' : 'bg-emerald-500'
                            }`} />
                            <div>
                              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                                Day {i + 1}: {node}
                                {isSummit && <span className="text-[9px] bg-rose-500/10 text-rose-600 px-1.5 rounded uppercase font-black">Summit Push</span>}
                                {isBase && <span className="text-[9px] bg-cyan-500/10 text-cyan-600 px-1.5 rounded uppercase font-black">Base Camp</span>}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                                Navigate trail markings and pitch alpine camps at {node}. Acclimatization instructions apply.
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 3: Logistics */}
              {activeTab === 'logistics' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Transit guidelines */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Transportation Guide</h3>
                    <div className="space-y-3.5 text-xs text-slate-650 dark:text-slate-400 font-medium">
                      <div>
                        <span className="text-slate-400 block text-[9px] font-bold uppercase mb-0.5">Nearest Railway</span>
                        <strong className="text-slate-950 dark:text-slate-200 font-bold">{trek.nearestRailway}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] font-bold uppercase mb-0.5">Nearest Airport</span>
                        <strong className="text-slate-950 dark:text-slate-200 font-bold">{trek.nearestAirport}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] font-bold uppercase mb-0.5">Nearest Bus Stand</span>
                        <strong className="text-slate-950 dark:text-slate-200 font-bold">{trek.nearestBusStand}</strong>
                      </div>
                      <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3">
                        <span className="text-slate-400 block text-[9px] font-bold uppercase mb-0.5">Transit Details</span>
                        <p className="text-slate-500 leading-relaxed mt-1">{trek.transportation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Medical / Emergency */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Medical & Emergency Support</h3>
                    <div className="space-y-4 text-xs text-slate-650 dark:text-slate-400 font-medium">
                      <div className="flex gap-2.5 items-start">
                        <Activity className="h-5 w-5 text-rose-500 shrink-0" />
                        <div>
                          <span className="text-slate-400 block text-[9px] font-bold uppercase">First Aid Protocols</span>
                          <p className="text-slate-500 mt-1 leading-relaxed">{trek.medicalFacilities}</p>
                        </div>
                      </div>
                      <div className="flex gap-2.5 items-start border-t border-slate-100 dark:border-slate-800/60 pt-4">
                        <Phone className="h-5 w-5 text-rose-500 shrink-0" />
                        <div>
                          <span className="text-slate-400 block text-[9px] font-bold uppercase">Emergency Hotlines</span>
                          <div className="mt-1.5 flex flex-col gap-1.5">
                            {trek.emergencyContacts.map((c, i) => (
                              <span key={i} className="font-bold text-slate-800 dark:text-slate-200">{c}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 4: FAQ list */}
              {activeTab === 'faq' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    {trek.faqs.map((faq, i) => (
                      <div key={i} className="border-b border-slate-100 dark:border-slate-855/60 pb-3">
                        <h4 className="text-xs font-bold text-slate-950 dark:text-white mb-1">Q: {faq.question}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">A: {faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            </div>

            {/* Weather Forecast Widget */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">Weather Forecast Widget</h3>
              <p className="text-xs text-slate-400 mb-6 font-medium">Average local trail weather forecast over the next few days.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {trek.weatherForecast.map((day, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 text-center flex flex-col gap-1.5 font-bold">
                    <span className="text-xs text-slate-400 font-bold uppercase">{day.day}</span>
                    <span className="text-base text-slate-800 dark:text-slate-100">{day.temp}</span>
                    <span className="text-[10px] text-emerald-500 bg-emerald-500/10 py-0.5 rounded border border-emerald-500/10 uppercase">{day.condition}</span>
                    <span className="text-[9px] text-slate-450 font-medium">{day.wind} winds</span>
                  </div>
                ))}
              </div>
            </div>

            {/* User Reviews */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                User Reviews ({localReviews.length})
              </h3>
              
              {localReviews.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {localReviews.map((rev) => (
                    <div key={rev.id} className="border-b border-slate-100 dark:border-slate-800/80 pb-4 flex gap-4 text-xs font-medium">
                      <div className="h-10 w-10 rounded-full bg-slate-150 dark:bg-slate-800 flex items-center justify-center text-lg shrink-0">
                        {rev.avatar || '🧑'}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="text-slate-900 dark:text-slate-100 font-extrabold text-sm">{rev.user}</strong>
                            <span className="text-[9px] text-slate-450 block uppercase mt-0.5">{rev.date}</span>
                          </div>
                          <div className="flex items-center gap-0.5 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-amber-500 font-bold">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span>{rev.rating}</span>
                          </div>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed font-medium">
                          {rev.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-medium">No reviews submitted yet for this trek. Be the first to rate your experience!</p>
              )}

              {/* Write a Review Section */}
              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">Write a Review</h4>
                <p className="text-xs text-slate-400 mb-4 font-medium">Share your adventure experience and rate this trek trail.</p>

                {reviewSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-250/30 dark:border-emerald-800/50 rounded-2xl text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2"
                  >
                    <Check className="h-4 w-4 stroke-[3]" />
                    Review submitted successfully! Thank you for sharing your feedback.
                  </motion.div>
                )}

                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                  {/* Star Rating Selector */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] block mb-1.5">Your Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((starVal) => {
                        const isFilled = starVal <= (hoverRating || newReviewRating);
                        return (
                          <button
                            type="button"
                            key={starVal}
                            onClick={() => setNewReviewRating(starVal)}
                            onMouseEnter={() => setHoverRating(starVal)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-0.5 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star 
                              className={`h-6 w-6 transition-all duration-150 ${
                                isFilled 
                                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.3)]' 
                                  : 'text-slate-350 dark:text-slate-700'
                              }`} 
                            />
                          </button>
                        );
                      })}
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-2.5">
                        {newReviewRating} Star{newReviewRating > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] block mb-1.5">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-450/40 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  {/* Comment Textarea */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] block mb-1.5">Your Review Comment</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe the trail conditions, campsites, views, and overall difficulty of the hike..."
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-450/40 focus:border-emerald-500 transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full md:w-auto self-start flex items-center justify-center gap-2 bg-gradient-premium hover:opacity-95 active:scale-[0.98] text-white font-bold py-3.5 px-6 rounded-2xl text-xs shadow-md shadow-emerald-200/50 dark:shadow-emerald-900/20 transition-all duration-200 cursor-pointer"
                  >
                    <span>Submit Review & Rating</span>
                  </button>
                </form>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Checkout Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 flex flex-col gap-6">
              
              {/* Primary checkout panel — Redesigned */}
              <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                
                {/* Price Header */}
                <div className="flex justify-between items-end mb-6 pb-5 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.12em] block mb-1">Starting Price</span>
                    <span className="text-3xl font-black text-emerald-500 dark:text-emerald-400" style={{ fontFamily: 'var(--font-display)' }}>
                      ₹{trek.startingPrice.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl">GST &amp; Permits included</span>
                </div>

                {/* Operator Details */}
                {company && (
                  <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
                      {company.logo}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em] block">Official Guide Operator</span>
                      <strong className="text-slate-900 dark:text-slate-100 font-bold text-sm block" style={{ fontFamily: 'var(--font-display)' }}>{company.name}</strong>
                      <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-semibold mt-0.5">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        IMF-Certified Operator
                      </span>
                    </div>
                  </div>
                )}

                {/* Booking Form */}
                <form onSubmit={handleBookingSubmit} className="flex flex-col gap-5">
                  
                  {/* Departure Date */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.12em] block mb-2">Departure Date</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={e => setBookingDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    />
                  </div>

                  {/* Number of Persons — pill buttons */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.12em] block mb-2">Number of Persons</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                        <button
                          type="button"
                          key={n}
                          onClick={() => setBookingPersons(n)}
                          className={`py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                            bookingPersons === n
                              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/30 scale-105'
                              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 hover:scale-105'
                          }`}
                          style={{ fontFamily: 'var(--font-sans)' }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-2 text-center">{bookingPersons} {bookingPersons === 1 ? 'Person' : 'Persons'} selected</p>
                  </div>

                  {/* Pricing breakdown */}
                  <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 flex flex-col gap-2.5">
                    <div className="flex justify-between text-sm font-medium text-slate-500">
                      <span>Base Fare (₹{trek.startingPrice.toLocaleString()} × {bookingPersons})</span>
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">₹{(trek.startingPrice * bookingPersons).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium text-slate-500">
                      <span>Local Forest Permits</span>
                      <span className="text-emerald-500 font-semibold">Included ✓</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800/60 pt-3 mt-1" style={{ fontFamily: 'var(--font-display)' }}>
                      <span>Total Price</span>
                      <span className="text-emerald-500">₹{(trek.startingPrice * bookingPersons).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:scale-[0.98] text-white font-bold py-4 px-6 rounded-2xl text-sm shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40 transition-all duration-200 cursor-pointer mt-1"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    <CreditCard className="h-5 w-5" />
                    Book Expedition Package
                  </button>
                </form>

                {/* Download Actions Panel */}
                <div className="flex flex-col gap-2 mt-3 font-semibold text-xs text-slate-650 dark:text-slate-300">
                  {/* PDF Guide trigger */}
                  <button
                    onClick={() => setPdfOpen(true)}
                    className="w-full flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 py-3.5 px-4 rounded-2xl transition-all duration-200 cursor-pointer"
                  >
                    <FileText className="h-4 w-4 text-emerald-500" />
                    <span>Download Trail PDF Guide</span>
                  </button>

                  {/* GPX Route Download */}
                  <button
                    onClick={handleDownloadGpx}
                    className="w-full flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 py-3.5 px-4 rounded-2xl transition-all duration-200 cursor-pointer"
                  >
                    <Map className="h-4 w-4 text-cyan-500" />
                    <span>Download GPX Route File</span>
                  </button>

                  {/* Offline Cache Toggle */}
                  <button
                    onClick={handleOfflineSync}
                    disabled={isDownloadingOffline}
                    className="w-full flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 py-3.5 px-4 rounded-2xl transition-all duration-200 cursor-pointer disabled:opacity-60 relative overflow-hidden"
                  >
                    {isDownloadingOffline ? (
                      <div className="flex items-center gap-2">
                        <Compass className="h-4 w-4 animate-spin text-emerald-500" />
                        <span>Downloading offline: {offlineProgress}%</span>
                        <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-200" style={{ width: `${offlineProgress}%` }} />
                      </div>
                    ) : isOfflineSaved ? (
                      <div className="flex items-center gap-2 text-emerald-500 font-extrabold">
                        <Check className="h-4 w-4 text-emerald-500" />
                        <span>Saved Offline (Click to remove)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-slate-400" />
                        <span>Enable Offline Access</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Safety notice info card — Redesigned */}
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/40 p-5 rounded-3xl shadow-sm">
                <div className="flex gap-3 items-start">
                  <div className="h-9 w-9 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Info className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white block mb-1" style={{ fontFamily: 'var(--font-display)' }}>Medical Auditing</span>
                    <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">High altitude sickness is a serious medical contingency. All operators carry emergency oxygen kits and maintain mandatory satellite emergency links.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. SIMULATED PDF VIEW MODAL */}
      <TrekGuidePdf
        trek={trek}
        isOpen={pdfOpen}
        onClose={() => setPdfOpen(false)}
      />

      {/* 6. SIMULATED BOOKING SUCCESS OVERLAY */}
      <AnimatePresence>
        {bookingSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl text-center"
            >
              <div className="mx-auto h-14 w-14 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-500 mb-4">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Expedition Booked!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Your booking request has been successfully generated. Representative from <strong className="font-bold text-slate-750 dark:text-slate-200">{company?.name}</strong> will contact you via email and phone shortly with health guidelines.
              </p>
              
              {/* Show ticket details */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl p-4 my-6 text-xs text-left flex flex-col gap-2 font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-400">TREK:</span>
                  <span>{trek.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">DEPARTURE:</span>
                  <span>{bookingDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PERSONS:</span>
                  <span>{bookingPersons} Explorer{bookingPersons > 1 ? 's' : ''}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setBookingSuccess(false);
                  router.push('/dashboard');
                }}
                className="w-full bg-slate-900 dark:bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-2xl text-xs transition-colors"
              >
                Go to Dashboard
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Start Trek button */}
      {trek && (
        <div className="fixed bottom-6 right-6 z-40">
          <Link
            href={`/tracker?trek=${trek.id}`}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:scale-95 text-white font-extrabold px-6 py-4 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all duration-200 cursor-pointer"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <Play className="h-5 w-5 fill-current" />
            <span>Start Live Tracker</span>
          </Link>
        </div>
      )}

    </div>
  );
}

