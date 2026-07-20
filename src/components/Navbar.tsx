'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Menu, X, Compass, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live Location Weather & Clock
  const [navWeather, setNavWeather] = useState<{ temp: number; icon: string } | null>(null);
  const [clockVal, setClockVal] = useState({ date: '', time: '' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let isMounted = true;
    let weatherFetched = false;
    
    // Default coordinates: Delhi
    const defaultLat = 28.61;
    const defaultLon = 77.20;
    
    const fetchWeather = (latitude: number, longitude: number) => {
      if (weatherFetched) return;
      weatherFetched = true;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`;
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error("HTTP error " + res.status);
          return res.json();
        })
        .then(data => {
          if (!isMounted) return;
          if (data && data.current) {
            const code = data.current.weather_code;
            let iconStr = '☀️';
            if (code >= 1 && code <= 3) iconStr = '⛅';
            else if (code === 45 || code === 48) iconStr = '🌫️';
            else if (code >= 51 && code <= 65) iconStr = '🌧️';
            else if (code >= 71 && code <= 77) iconStr = '❄️';
            else if (code >= 80 && code <= 82) iconStr = '🌦️';
            else if (code >= 95 && code <= 99) iconStr = '⛈️';
            
            setNavWeather({
              temp: Math.round(data.current.temperature_2m),
              icon: iconStr
            });
          } else {
            setNavWeather({ temp: 24, icon: '☀️' });
          }
        })
        .catch(err => {
          console.warn("Navbar weather fetch failed:", err);
          if (isMounted) {
            setNavWeather({ temp: 24, icon: '☀️' });
          }
        });
    };

    // Geolocation prompt timeout fallback (e.g. if prompt is ignored)
    const fallbackTimer = setTimeout(() => {
      if (!weatherFetched && isMounted) {
        console.log("Geolocation timed out, falling back to default coordinates");
        fetchWeather(defaultLat, defaultLon);
      }
    }, 3000);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(fallbackTimer);
          fetchWeather(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          clearTimeout(fallbackTimer);
          console.warn("Geolocation error:", err);
          fetchWeather(defaultLat, defaultLon);
        },
        { timeout: 2500 }
      );
    } else {
      clearTimeout(fallbackTimer);
      fetchWeather(defaultLat, defaultLon);
    }

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      
      const hours24 = now.getHours();
      const hours12 = hours24 % 12 || 12;
      const ampm = hours24 >= 12 ? 'PM' : 'AM';
      
      const hStr = String(hours12).padStart(2, '0');
      const mStr = String(now.getMinutes()).padStart(2, '0');
      const sStr = String(now.getSeconds()).padStart(2, '0');
      
      setClockVal({
        date: `${day}-${month}-${year}`,
        time: `(${hStr}:${mStr}:${sStr})${ampm}`
      });
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const mobileLinks = [
    { label: 'Home', path: '/' },
    { label: 'Explore', path: '/explore' },
    { label: 'Map', path: '/map' },
    { label: 'AI Planner', path: '/ai-planner' },
    { label: 'Routes', path: '/route-planner' },
    { label: 'Live Tracker', path: '/tracker' },
    { label: 'Compare', path: '/compare' },
    { label: 'Calculator', path: '/cost-calculator' },
    { label: 'Weight Planner', path: '/weight-calculator' },
    { label: 'Community', path: '/community' },
    ...((mounted && user?.role === 'ADMIN') ? [{ label: 'Admin', path: '/admin' }] : []),
    ...((mounted && user?.role === 'GUIDE') ? [{ label: 'Operator Portal', path: '/company-dashboard' }] : []),
    ...((mounted && user) ? [{ label: 'Profile', path: '/profile' }] : [])
  ];

  const desktopLinks = [
    { label: 'Home', path: '/' },
    { label: 'Explore', path: '/explore' },
    { label: 'Map', path: '/map' },
    { label: 'Live Tracker', path: '/tracker' },
    { label: 'Community', path: '/community' },
    ...((mounted && user?.role === 'ADMIN') ? [{ label: 'Admin', path: '/admin' }] : []),
    ...((mounted && user?.role === 'GUIDE') ? [{ label: 'Operator Portal', path: '/company-dashboard' }] : [])
  ];

  return (
    <header className="sticky top-0 z-[1010] w-full glass-nav transition-all duration-300">
      <div className="mx-auto w-full max-w-[1536px] px-6 md:px-12">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.div 
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-premium text-white shadow-md"
            >
              <Compass className="h-6 w-6" />
            </motion.div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Trail<span className="text-emerald-500">Verse</span>
              <span className="text-xs font-semibold text-emerald-400 align-super ml-1">IN</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {/* Regular Links before Tools */}
            {desktopLinks.slice(0, 3).map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.path} 
                  href={link.path}
                  className={`relative text-sm font-semibold transition-colors hover:text-emerald-500 ${
                    isActive ? 'text-emerald-500 font-bold' : 'text-slate-600 dark:text-slate-350'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div 
                      layoutId="activeNavLine"
                      className="absolute -bottom-1 left-0 h-[2px] w-full bg-emerald-500"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Tools Dropdown */}
            <div className="relative group py-2">
              <button className="flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-350 hover:text-emerald-500 transition-colors cursor-pointer focus:outline-none">
                <span>Tools</span>
                <svg className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180 text-slate-400 group-hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2 flex flex-col gap-1">
                {[
                  { label: '🤖 AI Planner', path: '/ai-planner' },
                  { label: '🗺️ Route Planner', path: '/route-planner' },
                  { label: '📊 Compare Treks', path: '/compare' },
                  { label: '💰 Cost Calculator', path: '/cost-calculator' },
                  { label: '🎒 Weight Calculator', path: '/weight-calculator' }
                ].map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link 
                      key={item.path} 
                      href={item.path}
                      className={`block px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
                        isActive 
                          ? 'bg-emerald-500/10 text-emerald-500 font-extrabold' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-500'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Regular Links after Tools */}
            {desktopLinks.slice(3).map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.path} 
                  href={link.path}
                  className={`relative text-sm font-semibold transition-colors hover:text-emerald-500 ${
                    isActive ? 'text-emerald-500 font-bold' : 'text-slate-600 dark:text-slate-350'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div 
                      layoutId="activeNavLine"
                      className="absolute -bottom-1 left-0 h-[2px] w-full bg-emerald-500"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Session Actions */}
            {mounted && user ? (
              <div className="flex items-center gap-3">
                <Link 
                  href={user.role === 'GUIDE' ? '/company-dashboard' : user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-md transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="border border-slate-200 dark:border-slate-800 hover:border-rose-500 hover:text-rose-550 dark:hover:border-rose-500 dark:hover:text-rose-400 px-3.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer text-slate-600 dark:text-slate-300"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                href="/auth"
                className="flex items-center gap-2 rounded-xl bg-gradient-premium px-4.5 py-2 text-sm font-bold text-white shadow-md hover:opacity-95 transition-all"
              >
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Buttons */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-6 absolute left-0 right-0 top-16 shadow-lg"
          >
            <div className="flex flex-col gap-4 font-bold text-xs">
              {mobileLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-base font-semibold py-1 border-b border-slate-100 dark:border-slate-800/50 ${
                      isActive ? 'text-emerald-500 font-semibold' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {mounted && user ? (
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    href={user.role === 'GUIDE' ? '/company-dashboard' : user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-emerald-500 py-2.5 text-center font-bold text-white shadow-md"
                  >
                    <User className="h-5 w-5" />
                    <span>My Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl border border-rose-500 text-rose-500 py-2.5 text-center font-bold"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-premium py-2.5 text-center font-bold text-white shadow-md"
                >
                  <span>Sign In Portal</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Fixed Bottom-Left Weather + Clock Widget ── */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 9999,
          background: theme === 'dark'
            ? 'linear-gradient(135deg,rgba(15,23,42,0.92) 0%,rgba(30,41,59,0.95) 100%)'
            : 'linear-gradient(135deg,rgba(255,255,255,0.92) 0%,rgba(241,245,249,0.95) 100%)',
          border: theme === 'dark' ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(16,185,129,0.30)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 0 0 1px rgba(16,185,129,0.08)',
          backdropFilter: 'blur(16px)',
          borderRadius: '16px',
          padding: '10px 14px',
          minWidth: '140px',
          userSelect: 'none'
        }}
      >
        {/* Weather row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '28px', lineHeight: 1 }}>
            {navWeather ? navWeather.icon : '🌡️'}
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: '2px' }}>
            <span style={{
              fontSize: '20px',
              fontWeight: 900,
              color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
              letterSpacing: '-0.5px'
            }}>
              {navWeather ? `${navWeather.temp}°C` : '—°C'}
            </span>
            <span style={{
              fontSize: '9px',
              fontWeight: 600,
              color: '#10b981',
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}>
              Live Weather
            </span>
          </div>
        </div>
        {/* Divider */}
        <div style={{ height: '1px', background: theme === 'dark' ? 'rgba(100,116,139,0.3)' : 'rgba(148,163,184,0.4)', margin: '0 0 6px 0' }} />
        {/* Date */}
        <div style={{
          fontFamily: 'sans-serif',
          fontSize: '15px',
          fontWeight: 800,
          color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
          letterSpacing: '0.05em',
          marginBottom: '4px'
        }}>
          {mounted ? (clockVal.date || '11-06-2026') : '11-06-2026'}
        </div>
        {/* Time (hh:mm:ss)AM/PM */}
        <div style={{
          fontFamily: 'monospace',
          fontSize: '15px',
          fontWeight: 900,
          letterSpacing: '0.05em',
          background: 'linear-gradient(90deg,#10b981,#3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {mounted ? (clockVal.time || '(04:12:00)PM') : '(04:12:00)PM'}
        </div>
      </div>
    </header>
  );
}
