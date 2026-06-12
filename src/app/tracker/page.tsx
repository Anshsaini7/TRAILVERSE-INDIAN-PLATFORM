'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { treks, Trek } from '../../data/mockData';
import { useTrekTracker } from '../../context/TrekTrackerContext';
import { useTrekProgress } from '../../hooks/useTrekProgress';
import ProgressRing from '../../components/tracker/ProgressRing';
import AltitudeGraph from '../../components/tracker/AltitudeGraph';
import SOSPanel from '../../components/tracker/SOSPanel';
import MemberCard from '../../components/tracker/MemberCard';
import {
  Play, Pause, Square, RefreshCw, MapPin, Navigation, Zap, Clock,
  Users, UserPlus, LogOut, Share2, Copy, BarChart2, Activity,
  Flame, Mountain, ArrowLeft, ChevronRight, Shield, Lock,
  Globe, UserCheck, Eye, EyeOff, AlertTriangle, CheckCircle, Loader2
} from 'lucide-react';

// Dynamic Leaflet map (SSR disabled)
const GroupMap = dynamic(() => import('../../components/tracker/GroupMap'), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl bg-slate-900/80 flex items-center justify-center border border-slate-800" style={{ height: 380 }}>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        <span className="text-xs font-bold text-slate-400">Loading map…</span>
      </div>
    </div>
  ),
});

// ─── Session history helpers ────────────────────────────────────────────────
interface Session {
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

function loadSessions(): Session[] {
  try { return JSON.parse(localStorage.getItem('tv_sessions') || '[]'); } catch { return []; }
}

function fmtDur(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// ─── Sub-component: TrekSelector ───────────────────────────────────────────
function TrekSelector({ selected, onChange }: { selected: Trek | null; onChange: (t: Trek | null) => void }) {
  return (
    <div>
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
        Select Trek
      </label>
      <select
        value={selected?.id ?? ''}
        onChange={e => {
          const t = treks.find(x => x.id === e.target.value) ?? null;
          onChange(t);
        }}
        className="w-full bg-slate-800 text-white rounded-xl px-3 py-2.5 text-xs font-bold border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
      >
        <option value="">— Free Roam (no route) —</option>
        {treks.map(t => (
          <option key={t.id} value={t.id}>{t.name} — {t.state} ({t.distance} km)</option>
        ))}
      </select>
    </div>
  );
}

// ─── Sub-component: StatCard ───────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color = 'text-white' }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div className="bg-white/4 rounded-2xl p-3.5 flex flex-col gap-1 border border-white/6">
      <div className="flex items-center gap-1.5 text-slate-500">
        <span className="w-3.5 h-3.5">{icon}</span>
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <div className={`text-xl font-black ${color} leading-none tabular-nums`}>{value}</div>
      {sub && <div className="text-[9px] text-slate-500 font-semibold">{sub}</div>}
    </div>
  );
}

// ─── Inner page (uses search params) ───────────────────────────────────────
function TrackerPageInner() {
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get('trek');

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    status, selectedTrek, currentPosition, trackHistory, elapsedSeconds, groupId,
    groupMembers, privacyMode, userName, userAvatar,
    setSelectedTrek, startTracking, pauseTracking, stopTracking, resetTracking,
    createGroup, joinGroup, leaveGroup, setPrivacyMode, setUserName, setUserAvatar,
  } = useTrekTracker();

  const progress = useTrekProgress();

  const [activeTab, setActiveTab] = useState<'trek' | 'group' | 'sos' | 'analytics'>('trek');
  const [groupCode, setGroupCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [joinName, setJoinName] = useState('');
  const [createName, setCreateName] = useState('');
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [joinError, setJoinError] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [shareLink, setShareLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  // Preselect trek from URL param
  useEffect(() => {
    if (preselectedId && !selectedTrek) {
      const t = treks.find(x => x.id === preselectedId);
      if (t) {
        setTimeout(() => {
          setSelectedTrek(t);
        }, 0);
      }
    }
  }, [preselectedId, selectedTrek, setSelectedTrek]);

  // Load sessions
  useEffect(() => {
    setTimeout(() => {
      setSessions(loadSessions());
    }, 0);
  }, [status]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
          <span className="text-sm font-bold text-slate-400">Loading Trek Tracker…</span>
        </div>
      </div>
    );
  }

  // Lost member alerts
  const lostMembers = groupMembers.filter(m => m.isLost);

  const handleCreateGroup = () => {
    if (!createName.trim()) return;
    setUserName(createName);
    const code = createGroup(createName);
    setCreatedCode(code);
    setGroupCode(code);
    const link = `${window.location.origin}/tracker?group=${code}`;
    setShareLink(link);
  };

  const handleJoinGroup = () => {
    if (!joinCode.trim() || !joinName.trim()) { setJoinError('Enter both name and group code'); return; }
    const ok = joinGroup(joinCode.trim().toUpperCase(), joinName);
    if (!ok) { setJoinError('Group not found'); return; }
    setJoinError('');
    setGroupCode(joinCode.trim().toUpperCase());
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink).catch(() => {});
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  // Total adventure stats from sessions
  const totalKm = sessions.reduce((s, sess: Session) => {
    return s + (sess.completedKm ?? (sess.elapsedSeconds / 3600) * 3.5);
  }, 0);
  const totalDays = sessions.reduce((s, sess: Session) => s + sess.elapsedSeconds / 86400, 0);
  const highestAlt = sessions.reduce((max, sess: Session) => {
    return Math.max(max, sess.maxAltitude ?? 0);
  }, 0);
  const statesExplored = new Set(
    sessions.map((s: Session) => s.state).filter(st => st && st !== 'Unknown')
  ).size;

  // Safe zones from selected trek
  const safeCamps = selectedTrek ? [
    { lat: selectedTrek.coordinates.lat, lon: selectedTrek.coordinates.lon, name: selectedTrek.baseCamp, type: 'camp' as const },
    ...(selectedTrek.routeCoordinates?.length > 1 ? [{
      lat: selectedTrek.routeCoordinates[0].lat,
      lon: selectedTrek.routeCoordinates[0].lon,
      name: 'Start Point',
      type: 'rescue' as const,
    }] : []),
  ] : [];

  const TABS = [
    { id: 'trek' as const, label: '🏃 My Trek', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'group' as const, label: '👥 Group', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'sos' as const, label: '🆘 SOS', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'analytics' as const, label: '📊 Analytics', icon: <BarChart2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg,#0a0f1e 0%,#0d1a0f 60%,#0a0f1e 100%)' }}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 pb-12">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Link href="/" className="text-slate-500 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Trek Tracker</span>
            </div>
            <h1 className="text-2xl font-black text-white">Live Trek Tracking</h1>
            <p className="text-xs text-slate-400 mt-0.5">Real-time GPS • Group Safety • SOS</p>
          </div>

          {/* Status badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
            status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
            status === 'paused' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
            'bg-slate-800 text-slate-400 border border-slate-700'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              status === 'active' ? 'bg-emerald-400 animate-pulse' :
              status === 'paused' ? 'bg-amber-400' : 'bg-slate-500'
            }`} />
            {status === 'active' ? 'Tracking' : status === 'paused' ? 'Paused' : status === 'stopped' ? 'Stopped' : 'Idle'}
          </div>
        </div>

        {/* ── Lost Member Alert Banner ── */}
        <AnimatePresence>
          {lostMembers.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-4 rounded-2xl border border-red-500/60 p-4 flex items-start gap-3"
              style={{ background: 'rgba(220,38,38,0.15)' }}>
              <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-black text-red-300">⚠️ MEMBER SEPARATED</div>
                {lostMembers.map(m => (
                  <div key={m.id} className="text-xs text-red-400 mt-0.5">
                    {m.avatar} {m.name} is {(m.distanceFromCenter / 1000).toFixed(2)}km from group centre
                    · Last seen {new Date(m.lastSeen).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Tabs ── */}
        <div className="flex border-b border-white/8 gap-1 mb-6 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white/8 text-white border-b-2 border-emerald-500'
                  : 'text-slate-400 hover:text-white'
              }`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ═══ TAB 1: MY TREK ═══ */}
          {activeTab === 'trek' && (
            <motion.div key="trek" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col gap-5">

              {/* Trek Selector + Controls */}
              <div className="rounded-2xl p-5 border border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <TrekSelector selected={selectedTrek} onChange={setSelectedTrek} />

                {selectedTrek && (
                  <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold text-slate-400">
                    <span className="bg-white/5 px-2 py-1 rounded-lg">📍 {selectedTrek.baseCamp}</span>
                    <span className="bg-white/5 px-2 py-1 rounded-lg">⛰️ {selectedTrek.altitude.toLocaleString()}m</span>
                    <span className="bg-white/5 px-2 py-1 rounded-lg">📏 {selectedTrek.distance}km</span>
                    <span className="bg-white/5 px-2 py-1 rounded-lg">🌡️ {selectedTrek.tempRange}</span>
                  </div>
                )}

                {/* Control Buttons */}
                <div className="flex gap-3 mt-4">
                  {status === 'idle' || status === 'stopped' ? (
                    <button onClick={startTracking}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm text-white cursor-pointer transition-all hover:scale-105 active:scale-95"
                      style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 4px 20px rgba(16,185,129,0.4)' }}>
                      <Play className="w-4 h-4 fill-white" />
                      {status === 'stopped' ? 'Restart Trek' : 'Start Tracking'}
                    </button>
                  ) : status === 'active' ? (
                    <>
                      <button onClick={pauseTracking}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-white cursor-pointer bg-amber-600 hover:bg-amber-500 transition-all">
                        <Pause className="w-4 h-4" /> Pause
                      </button>
                      <button onClick={stopTracking}
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm text-white cursor-pointer bg-red-700 hover:bg-red-600 transition-all">
                        <Square className="w-4 h-4" /> Stop
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={startTracking}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-white cursor-pointer bg-emerald-600 hover:bg-emerald-500 transition-all">
                        <Play className="w-4 h-4 fill-white" /> Resume
                      </button>
                      <button onClick={stopTracking}
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm text-white cursor-pointer bg-red-700 hover:bg-red-600 transition-all">
                        <Square className="w-4 h-4" /> Stop
                      </button>
                    </>
                  )}
                  {(status === 'stopped' || status === 'idle') && trackHistory.length > 0 && (
                    <button onClick={resetTracking}
                      className="flex items-center justify-center p-3 rounded-2xl text-slate-400 hover:text-white bg-white/5 cursor-pointer transition-all">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Ring + Stats */}
              <div className="rounded-2xl p-5 border border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0">
                    <ProgressRing
                      percent={progress.progressPercent}
                      size={140}
                      label="complete"
                      sublabel={`${progress.completedKm}/${progress.totalDistanceKm}km`}
                    />
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-2.5">
                    <StatCard icon={<Navigation className="w-3.5 h-3.5 text-blue-400" />} label="Completed" value={`${progress.completedKm} km`} sub={`${progress.remainingKm} km remaining`} color="text-blue-300" />
                    <StatCard icon={<Mountain className="w-3.5 h-3.5 text-emerald-400" />} label="Altitude" value={`${progress.currentAltitudeM > 0 ? progress.currentAltitudeM.toLocaleString() : '--'} m`} sub={`Max: ${progress.highestAltitudeM > 0 ? progress.highestAltitudeM.toLocaleString() : '--'}m`} color="text-emerald-300" />
                    <StatCard icon={<Zap className="w-3.5 h-3.5 text-amber-400" />} label="Speed" value={`${progress.currentSpeedKmh} km/h`} sub={`Avg: ${progress.avgSpeedKmh} km/h`} color="text-amber-300" />
                    <StatCard icon={<Flame className="w-3.5 h-3.5 text-orange-400" />} label="Calories" value={`${progress.caloriesBurned}`} sub="kcal burned" color="text-orange-300" />
                  </div>
                </div>

                {/* Time row */}
                <div className="grid grid-cols-3 gap-2.5 mt-3">
                  <StatCard icon={<Clock className="w-3.5 h-3.5 text-slate-400" />} label="Elapsed" value={progress.elapsedFormatted} color="text-white" />
                  <StatCard icon={<Clock className="w-3.5 h-3.5 text-purple-400" />} label="ETA" value={progress.etaFormatted} color="text-purple-300" />
                  <StatCard icon={<Activity className="w-3.5 h-3.5 text-cyan-400" />} label="Track Points" value={`${trackHistory.length}`} sub="GPS fixes" color="text-cyan-300" />
                </div>

                {/* Altitude Gain / Loss */}
                {(progress.altitudeGainM > 0 || progress.altitudeLossM > 0) && (
                  <div className="flex gap-3 mt-3">
                    <div className="flex-1 bg-emerald-500/10 rounded-xl px-3 py-2 border border-emerald-500/20">
                      <div className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">↑ Altitude Gain</div>
                      <div className="text-sm font-black text-emerald-300">+{progress.altitudeGainM} m</div>
                    </div>
                    <div className="flex-1 bg-blue-500/10 rounded-xl px-3 py-2 border border-blue-500/20">
                      <div className="text-[9px] font-bold text-blue-400 uppercase tracking-wider">↓ Altitude Loss</div>
                      <div className="text-sm font-black text-blue-300">-{progress.altitudeLossM} m</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Current GPS Position */}
              {currentPosition && (
                <div className="rounded-2xl p-4 border border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live GPS Position
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: 'Latitude', val: `${currentPosition.lat.toFixed(6)}°` },
                      { label: 'Longitude', val: `${currentPosition.lon.toFixed(6)}°` },
                      { label: 'Accuracy', val: `±${Math.round(currentPosition.accuracy)}m` },
                      { label: 'Altitude', val: `${Math.round(currentPosition.altitude)}m` },
                    ].map(item => (
                      <div key={item.label} className="bg-white/5 rounded-xl p-2.5 text-center">
                        <div className="text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">{item.label}</div>
                        <div className="text-xs font-black text-emerald-300 font-mono">{item.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Altitude Graph */}
              <div className="rounded-2xl p-4 border border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <AltitudeGraph points={trackHistory} height={140} />
              </div>

              {/* Distance progress bar */}
              <div className="rounded-2xl p-4 border border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">📏 Distance Progress</span>
                  <span className="text-[10px] font-black text-blue-300">{progress.completedKm} / {progress.totalDistanceKm} km</span>
                </div>
                <div className="w-full bg-white/8 rounded-full h-3 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress.progressPercent}%`,
                      background: 'linear-gradient(90deg,#6366f1,#10b981,#f59e0b)',
                      boxShadow: '0 0 12px rgba(16,185,129,0.6)'
                    }} />
                </div>
                <div className="flex justify-between mt-1.5 text-[9px] font-bold text-slate-500">
                  <span>Start</span>
                  <span>{progress.remainingKm} km left</span>
                  <span>Summit</span>
                </div>
              </div>

              {/* Live Map */}
              <div className="rounded-2xl overflow-hidden border border-white/8">
                <div className="px-4 pt-4 pb-2">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    Live Map
                  </div>
                </div>
                <GroupMap
                  currentPosition={currentPosition}
                  trackHistory={trackHistory}
                  groupMembers={groupMembers}
                  userName={userName}
                  userAvatar={userAvatar}
                  safeCamps={safeCamps}
                />
              </div>
            </motion.div>
          )}

          {/* ═══ TAB 2: GROUP MODE ═══ */}
          {activeTab === 'group' && (
            <motion.div key="group" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col gap-5">

              {/* Your identity */}
              <div className="rounded-2xl p-5 border border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Your Identity</div>
                <div className="flex items-center gap-4">
                  {/* Avatar selector */}
                  <div className="flex gap-2 flex-wrap">
                    {['🧗','🏕️','⛰️','🧭','🌲','🦊','🏂','🧑'].map(a => (
                      <button key={a} onClick={() => setUserAvatar(a)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg cursor-pointer transition-all ${
                          userAvatar === a ? 'bg-emerald-500/30 ring-2 ring-emerald-500 scale-110' : 'bg-white/5 hover:bg-white/10'
                        }`}>{a}</button>
                    ))}
                  </div>
                  <input
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    placeholder="Your name"
                    className="flex-1 bg-slate-800 text-white rounded-xl px-3 py-2 text-sm font-bold border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Privacy settings */}
              <div className="rounded-2xl p-5 border border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />Location Privacy
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { id: 'private', label: 'Private', desc: 'Only you can see', icon: <EyeOff className="w-3.5 h-3.5" /> },
                    { id: 'group', label: 'Group Only', desc: 'Group members only', icon: <Users className="w-3.5 h-3.5" /> },
                    { id: 'friends', label: 'Friends', desc: 'Followers only', icon: <UserCheck className="w-3.5 h-3.5" /> },
                    { id: 'public', label: 'Public', desc: 'Anyone with link', icon: <Globe className="w-3.5 h-3.5" /> },
                  ] as const).map(p => (
                    <button key={p.id} onClick={() => setPrivacyMode(p.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl text-left cursor-pointer transition-all border text-xs ${
                        privacyMode === p.id
                          ? 'border-emerald-500/60 bg-emerald-500/15 text-white'
                          : 'border-white/8 bg-white/3 text-slate-400 hover:border-white/20'
                      }`}>
                      <span className={privacyMode === p.id ? 'text-emerald-400' : ''}>{p.icon}</span>
                      <div>
                        <div className="font-black">{p.label}</div>
                        <div className="text-[9px] text-slate-500 mt-0.5">{p.desc}</div>
                      </div>
                      {privacyMode === p.id && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Group management */}
              {!groupId ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Create group */}
                  <div className="rounded-2xl p-5 border border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">Create Group</div>
                    <input value={createName} onChange={e => setCreateName(e.target.value)}
                      placeholder="Your name / Group leader name"
                      className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 text-xs font-bold border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-3" />
                    <button onClick={handleCreateGroup}
                      className="w-full py-2.5 rounded-xl font-black text-xs text-white cursor-pointer transition-all hover:scale-105"
                      style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
                      <UserPlus className="w-3.5 h-3.5 inline mr-1.5" />
                      Create Trekking Group
                    </button>
                  </div>

                  {/* Join group */}
                  <div className="rounded-2xl p-5 border border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">Join Group</div>
                    <input value={joinName} onChange={e => setJoinName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 text-xs font-bold border border-slate-700 focus:outline-none mb-2" />
                    <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
                      placeholder="Group code (e.g. A1B2C3)"
                      className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 text-xs font-bold border border-slate-700 focus:outline-none mb-3 font-mono tracking-widest" />
                    {joinError && <p className="text-[10px] text-red-400 font-bold mb-2">{joinError}</p>}
                    <button onClick={handleJoinGroup}
                      className="w-full py-2.5 rounded-xl font-black text-xs text-white cursor-pointer transition-all hover:scale-105"
                      style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}>
                      <ChevronRight className="w-3.5 h-3.5 inline mr-1.5" />
                      Join Group
                    </button>
                  </div>
                </div>
              ) : (
                /* Active group view */
                <div className="flex flex-col gap-4">
                  {/* Group header */}
                  <div className="rounded-2xl p-5 border border-emerald-500/30"
                    style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.1),rgba(5,150,105,0.05))' }}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Active Group</div>
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-black text-white font-mono tracking-widest">{groupId}</span>
                          <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-lg">
                            {groupMembers.length + 1} members
                          </span>
                        </div>
                      </div>
                      <button onClick={leaveGroup}
                        className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 px-3 py-2 rounded-xl cursor-pointer transition-all">
                        <LogOut className="w-3.5 h-3.5" /> Leave
                      </button>
                    </div>

                    {/* Share link */}
                    {shareLink && (
                      <div className="mt-4 flex gap-2">
                        <div className="flex-1 bg-white/5 rounded-xl px-3 py-2 text-[10px] text-slate-400 font-mono truncate border border-white/8">
                          {shareLink}
                        </div>
                        <button onClick={copyShareLink}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                            linkCopied ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                          }`}>
                          {linkCopied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {linkCopied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* My card (self) */}
                  {currentPosition && (
                    <MemberCard
                      member={{
                        id: 'me',
                        name: userName,
                        avatar: userAvatar,
                        lat: currentPosition.lat,
                        lon: currentPosition.lon,
                        altitude: currentPosition.altitude,
                        speed: currentPosition.speed,
                        lastSeen: currentPosition.timestamp,
                        isLost: false,
                        distanceFromCenter: 0,
                      }}
                      isMe
                    />
                  )}

                  {/* Other members */}
                  {groupMembers.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500 font-semibold">
                      Share the group code <span className="font-black text-white">{groupId}</span> with fellow trekkers to see them here.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {groupMembers.map(m => <MemberCard key={m.id} member={m} />)}
                    </div>
                  )}

                  {/* Group map */}
                  <div className="rounded-2xl overflow-hidden border border-white/8">
                    <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Group Live Map</span>
                      {lostMembers.length > 0 && (
                        <span className="text-[9px] font-black text-red-400 animate-pulse">⚠️ {lostMembers.length} SEPARATED</span>
                      )}
                    </div>
                    <GroupMap
                      currentPosition={currentPosition}
                      trackHistory={trackHistory}
                      groupMembers={groupMembers}
                      userName={userName}
                      userAvatar={userAvatar}
                      safeCamps={safeCamps}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ═══ TAB 3: SOS ═══ */}
          {activeTab === 'sos' && (
            <motion.div key="sos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SOSPanel />
            </motion.div>
          )}

          {/* ═══ TAB 4: ANALYTICS ═══ */}
          {activeTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col gap-5">

              {/* Adventure Profile Totals */}
              <div className="rounded-2xl p-5 border border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">🏆 Adventure Profile</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Total Distance', val: `${totalKm.toFixed(2)} km`, icon: '📏', color: 'text-blue-300' },
                    { label: 'Highest Altitude', val: highestAlt > 0 ? `${highestAlt.toLocaleString()} m` : '-- m', icon: '🏔️', color: 'text-emerald-300' },
                    { label: 'States Explored', val: `${statesExplored}`, icon: '🗺️', color: 'text-cyan-300' },
                    { label: 'Treks Logged', val: `${sessions.length}`, icon: '🏕️', color: 'text-orange-300' },
                    { label: 'Unique Trails', val: `${new Set(sessions.map(s => s.trekId)).size}`, icon: '⛰️', color: 'text-amber-300' },
                    { label: 'Adventure Days', val: `${totalDays.toFixed(1)}`, icon: '📅', color: 'text-purple-300' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white/5 rounded-2xl p-3.5 border border-white/6">
                      <div className="text-lg mb-1">{stat.icon}</div>
                      <div className={`text-2xl font-black leading-none ${stat.color}`}>{stat.val}</div>
                      <div className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Session History */}
              <div className="rounded-2xl p-5 border border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">📋 Trek Session History</div>
                {sessions.length === 0 ? (
                  <div className="text-center py-10 text-xs text-slate-500 font-semibold">
                    No sessions yet. Start a trek to record your first adventure!
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {[...sessions].reverse().map((sess, i) => {
                      const dur = fmtDur(sess.elapsedSeconds);
                      const date = new Date(sess.startTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
                      const trek = treks.find(t => t.id === sess.trekId);
                      return (
                        <div key={sess.id} className="flex items-center gap-4 p-4 rounded-2xl border border-white/6 bg-white/3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-xl flex-shrink-0">
                            {trek ? '⛰️' : '🧭'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-black text-white truncate">{sess.trekName}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{date} · {dur} · {sess.points} GPS points</div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-xs font-black text-emerald-300">{dur}</div>
                            <div className="text-[9px] text-slate-500">{sess.points} pts</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Current session live stats */}
              {status === 'active' && (
                <div className="rounded-2xl p-5 border border-emerald-500/30"
                  style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.08),rgba(5,150,105,0.04))' }}>
                  <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Session Stats
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Distance', val: `${progress.completedKm} km`, color: 'text-blue-300' },
                      { label: 'Duration', val: progress.elapsedFormatted, color: 'text-white' },
                      { label: 'Altitude', val: `${progress.currentAltitudeM}m`, color: 'text-emerald-300' },
                      { label: 'Calories', val: `${progress.caloriesBurned} kcal`, color: 'text-orange-300' },
                    ].map(s => (
                      <div key={s.label} className="bg-white/5 rounded-xl p-2.5 text-center">
                        <div className="text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">{s.label}</div>
                        <div className={`text-sm font-black ${s.color}`}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Wrap with Suspense for useSearchParams
export default function TrackerPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#0a0f1e' }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
          <span className="text-sm font-bold text-slate-400">Loading Trek Tracker…</span>
        </div>
      </div>
    }>
      <TrackerPageInner />
    </Suspense>
  );
}
