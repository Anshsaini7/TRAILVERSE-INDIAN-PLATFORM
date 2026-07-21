'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { treks, adventureActivities } from '../data/mockData';
import TrekCard from '../components/TrekCard';
import { Search, MapPin, Compass, ShieldCheck, ArrowRight, Star, Heart, CompassIcon, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '../context/WeatherContext';
import LiveClock from '../components/weather/LiveClock';
import CurrentWeatherCard from '../components/weather/CurrentWeatherCard';
import ForecastStrip from '../components/weather/ForecastStrip';
import WeatherIcon from '../components/weather/WeatherIcon';

function TypingEffect({ words }: { words: string[] }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullWord = words[currentWordIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        setCurrentText((prev) => fullWord.substring(0, prev.length + 1));
        if (currentText === fullWord) {
          timer = setTimeout(() => setIsDeleting(true), 2200);
          return;
        }
      } else {
        setCurrentText((prev) => fullWord.substring(0, prev.length - 1));
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          return;
        }
      }
    };

    const speed = isDeleting ? 40 : 100;
    timer = setTimeout(handleTyping, speed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words]);

  return (
    <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-400 font-black text-4xl sm:text-6xl md:text-7xl tracking-tight py-2 relative select-none whitespace-nowrap">
      {currentText || '\u200b'}
      <span className="inline-block w-[3px] md:w-[6px] h-[0.8em] bg-gradient-to-b from-emerald-400 to-cyan-400 ml-2 animate-blink align-middle" />
    </span>
  );
}

export default function Home() {
  const router = useRouter();
  const { userLocation, userWeather, userForecast, formatTemp, forecastDays } = useWeather();

  const adventureWords = [
    "Himalayas",
    "Western Ghats",
    "River Rapids",
    "Granite Cliffs",
    "Alpine Meadows",
    "Billing Skies",
    "Snow Slopes",
    "Coral Reefs",
    "Desert Dunes"
  ];

  // Search form state variables
  const [searchTerm, setSearchTerm] = useState('');
  const [state, setState] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [duration, setDuration] = useState('');
  const [budget, setBudget] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Build query strings and forward to explorer page
    const params = new URLSearchParams();
    if (searchTerm) params.append('name', searchTerm);
    if (state) params.append('state', state);
    if (difficulty) params.append('difficulty', difficulty);
    if (duration) params.append('duration', duration);
    if (budget) params.append('budget', budget);

    router.push(`/explore?${params.toString()}`);
  };

  // Select first 3 top rated treks for trending list
  const trendingTreks = treks.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Parallax Mountain Image Backdrop */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80"
            alt="Mountain backdrop"
            className="w-full h-full object-cover opacity-25 dark:opacity-100 brightness-[1.1] dark:brightness-40 transform scale-105 transition-transform duration-10000"
          />
          {/* Animated SVG Wind Particles Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/30 to-background dark:from-slate-950/20 dark:via-slate-950/45 dark:to-background z-10" />
        </div>

        {/* Hero Content Panel */}
        <div className="relative z-20 mx-auto w-full max-w-5xl px-4 text-center sm:px-6 lg:px-8 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 px-4 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30 mb-6 backdrop-blur-md"
          >
            <Compass className="h-4 w-4 animate-spin-slow text-emerald-600 dark:text-emerald-400" />
            INDIA'S ULTIMATE ADVENTURE PLATFORM
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-6xl md:text-7xl leading-tight"
          >
            Explore India's Wildest <br />
            <span className="inline-block mt-2 min-h-[1.2em] leading-none whitespace-nowrap">
              <TypingEffect words={adventureWords} />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-semibold"
          >
            Discover routes, compare IMF-certified operators, plan trails with AI, and book safety-verified treks.
          </motion.p>

          {/* Smart Search Form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            onSubmit={handleSearch}
            className="mt-10 w-full max-w-4xl glass p-4 md:p-6 rounded-3xl border border-white/10 dark:border-slate-800 shadow-2xl flex flex-col gap-4 text-left"
          >
            {/* Row 1: Trek Name Input */}
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search trek by name (e.g. Roopkund, Kedarkantha)..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100/85 dark:bg-slate-950/50 text-slate-800 dark:text-white rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-slate-200 dark:border-white/5 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
              />
            </div>

            {/* Row 2: Select Filters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {/* State Dropdown */}
              <select
                value={state}
                onChange={e => setState(e.target.value)}
                className="bg-slate-100/85 dark:bg-slate-950/50 text-slate-800 dark:text-white rounded-xl px-3 py-2.5 focus:outline-none border border-slate-200 dark:border-white/5 cursor-pointer font-semibold"
              >
                <option value="" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">State (All)</option>
                <option value="Uttarakhand" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">Uttarakhand</option>
                <option value="Himachal Pradesh" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">Himachal Pradesh</option>
                <option value="Ladakh" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">Ladakh</option>
                <option value="Sikkim" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">Sikkim</option>
                <option value="West Bengal" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">West Bengal</option>
                <option value="Karnataka" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">Karnataka</option>
                <option value="Maharashtra" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">Maharashtra</option>
              </select>

              {/* Difficulty Dropdown */}
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
                className="bg-slate-100/85 dark:bg-slate-950/50 text-slate-800 dark:text-white rounded-xl px-3 py-2.5 focus:outline-none border border-slate-200 dark:border-white/5 cursor-pointer font-semibold"
              >
                <option value="" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">Difficulty (All)</option>
                <option value="Easy" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">Easy</option>
                <option value="Medium" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">Medium</option>
                <option value="Hard" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">Hard</option>
                <option value="Extreme" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">Extreme</option>
              </select>

              {/* Duration Dropdown */}
              <select
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="bg-slate-100/85 dark:bg-slate-950/50 text-slate-800 dark:text-white rounded-xl px-3 py-2.5 focus:outline-none border border-slate-200 dark:border-white/5 cursor-pointer font-semibold"
              >
                <option value="" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">Duration (All)</option>
                <option value="short" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">1 - 4 Days</option>
                <option value="medium" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">5 - 7 Days</option>
                <option value="long" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">8+ Days</option>
              </select>

              {/* Budget Dropdown */}
              <select
                value={budget}
                onChange={e => setBudget(e.target.value)}
                className="bg-slate-100/85 dark:bg-slate-950/50 text-slate-800 dark:text-white rounded-xl px-3 py-2.5 focus:outline-none border border-slate-200 dark:border-white/5 cursor-pointer font-semibold"
              >
                <option value="" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">Budget (All)</option>
                <option value="low" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">Under ₹5,000</option>
                <option value="mid" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">₹5,000 - ₹12,000</option>
                <option value="high" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">₹12,000+</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-gradient-premium hover:bg-emerald-600 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Search className="h-4.5 w-4.5" />
              Search Adventures
            </button>
          </motion.form>
        </div>
      </section>

      {/* ── LIVE CONDITIONS SECTION ── */}
      <section className="py-6 bg-white dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Mobile Only: Compact Ticker */}
            <div className="flex sm:hidden items-center justify-between w-full bg-slate-50 dark:bg-slate-900/30 rounded-xl px-3 py-2 border border-slate-200/50 dark:border-white/5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{userWeather ? `${formatTemp(userWeather.temp)} · ${userWeather.conditionText}` : 'Live weather'}</span>
              </div>
              <LiveClock 
                compact
                showDate={false}
                showTimezone={false}
                fontSize="11px"
                textColorClass="text-slate-500 dark:text-slate-450 font-mono font-bold"
              />
              {userLocation && (
                <div className="flex items-center gap-0.5 text-slate-400 dark:text-slate-500 max-w-[120px] truncate">
                  <MapPin className="w-3 h-3 text-slate-400/80" />
                  <span>{userLocation.city}</span>
                </div>
              )}
            </div>

            {/* Desktop/Tablet Only: Location + Clock + Current Weather in a unified compact row */}
            <div className="hidden sm:block flex-1 min-w-0 w-full lg:w-auto">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Conditions
                </span>
                {userLocation && (
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {userLocation.city}, {userLocation.state}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-3.5 border border-slate-200 dark:border-white/5 w-full sm:w-fit">
                <LiveClock 
                  compact
                  showDate 
                  showTimezone={false}
                  className="flex-shrink-0" 
                  textColorClass="text-slate-900 dark:text-slate-100 font-mono text-lg font-black tracking-tight"
                  dateColorClass="text-slate-500 dark:text-slate-400 text-[10px] font-semibold"
                />
                
                {/* Vertical Separator */}
                <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-slate-800" />

                {userWeather && (
                  <div className="flex items-center gap-3">
                    <WeatherIcon name={userWeather.conditionIcon} size="sm" />
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-black text-slate-900 dark:text-white leading-none">{formatTemp(userWeather.temp)}</span>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{userWeather.conditionText}</span>
                      </div>
                      <div className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5">Feels {formatTemp(userWeather.feelsLike)} · 💧{userWeather.humidity}% · 💨{userWeather.windSpeed} km/h</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Right: Forecast Strip (Hidden on mobile) */}
            {userForecast.length > 0 && (
              <div className="hidden sm:block w-full lg:w-auto lg:max-w-xl">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">{forecastDays}-Day Forecast</div>
                <ForecastStrip forecast={userForecast} maxDays={forecastDays} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES SECTION */}
      <section className="py-20 relative overflow-hidden bg-slate-100 dark:bg-slate-950">
        {/* Realistic Mountain & Waterfall Backdrop Image with Ken Burns zoom */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1432406776043-6c76db4f6768?auto=format&fit=crop&w=1920&q=80"
            alt="Majestic mountain waterfall background"
            className="w-full h-full object-cover brightness-[1.02] dark:brightness-[0.3] transform scale-105 animate-ken-burns"
          />
          {/* Glassmorphic Mist Overlay */}
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/85 backdrop-blur-[1.5px] z-10" />
          
          {/* Drifting Waterfall Mist Effects */}
          <div className="absolute inset-0 z-20 overflow-hidden mix-blend-screen opacity-60 dark:opacity-30">
            {/* Mist Cloud 1 */}
            <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-slate-100/30 dark:bg-emerald-500/10 blur-3xl animate-mist-slow" />
            {/* Mist Cloud 2 */}
            <div className="absolute top-1/3 left-1/2 w-[500px] h-[500px] rounded-full bg-cyan-200/25 dark:bg-cyan-500/10 blur-3xl animate-mist-fast" />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest block">ADVENTURE CORNER</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Featured Categories</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              From alpine climbing and white water river rapids to deep powder skiing, experience the diverse Indian terrain.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {adventureActivities.slice(0, 8).map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="group relative flex flex-col justify-between overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm cursor-pointer"
              >
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                    {activity.icon}
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">{activity.name}</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed">{activity.tagline}</p>
                </div>
                <Link href={`/activities?id=${activity.id}`} className="mt-4 flex items-center gap-1 text-[11px] font-bold text-emerald-500 hover:text-emerald-600 transition-colors">
                  <span>Explore Locations</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRENDING TREKS SECTION */}
      <section className="py-20 bg-white dark:bg-slate-900 relative overflow-hidden">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest block">EXPLORER SELECTION</span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Trending Expeditions</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Join thousands of hikers currently planning treks across famous Himalayan corridors.
              </p>
            </div>
            <Link
              href="/explore"
              className="flex items-center gap-1.5 text-sm font-bold text-emerald-500 hover:text-emerald-600 border-b-2 border-emerald-500/20 pb-0.5 hover:border-emerald-500 transition-all"
            >
              <span>Explore All Treks</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trendingTreks.map((trek) => (
              <TrekCard key={trek.id} trek={trek} />
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM ACHIEVEMENTS & ECO-STATISTICS */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 border-y border-slate-150/40 dark:border-slate-850/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest block">TRAILVERSE IMPACT</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Empowering Indian Trekking</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              We connect adventure seekers with verified operators, promoting safety, community, and responsible eco-tourism.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat 1 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-3xl text-center hover:shadow-md transition-all group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto text-xl mb-4 group-hover:scale-110 transition-transform">
                🏔️
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-display)' }}>80+</div>
              <div className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">Himalayan Trails</div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-3xl text-center hover:shadow-md transition-all group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mx-auto text-xl mb-4 group-hover:scale-110 transition-transform">
                🪪
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-display)' }}>100%</div>
              <div className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">Certified Guides</div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-3xl text-center hover:shadow-md transition-all group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto text-xl mb-4 group-hover:scale-110 transition-transform">
                👥
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-display)' }}>12,000+</div>
              <div className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">Active Explorers</div>
            </div>

            {/* Stat 4 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-3xl text-center hover:shadow-md transition-all group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto text-xl mb-4 group-hover:scale-110 transition-transform">
                🌱
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-display)' }}>Zero</div>
              <div className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">Waste Initiative</div>
            </div>
          </div>
        </div>
      </section>

      {/* VERIFIED SAFETY / OPERATOR BANNER */}
      <section className="py-20 bg-gradient-premium text-white relative overflow-hidden">
        {/* Decorative background glow circles */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-400/20 blur-3xl" />

        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
          <ShieldCheck className="h-16 w-16 mb-6 text-emerald-300" />
          <h2 className="text-3xl font-black sm:text-4xl md:text-5xl leading-none">
            Verified safety guidelines. <br />
            IMF-Certified Outfitters.
          </h2>
          <p className="mt-6 text-slate-100 max-w-xl text-sm leading-relaxed">
            All operator agencies listed on TrailVerse undergo strict documentation auditing. From medical search-and-rescue configurations to certified mountaineering guides, we ensure you explore safely.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/companies" className="bg-slate-950 hover:bg-slate-900 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-md transition-all">
              Verify Operators Directory
            </Link>
            <Link href="/contact" className="border border-white/30 hover:border-white text-white font-bold px-6 py-3 rounded-xl text-xs transition-all">
              Partner With Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
