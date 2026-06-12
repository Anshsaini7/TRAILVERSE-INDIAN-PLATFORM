'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Trek } from '../data/mockData';

// ─── Types ─────────────────────────────────────────────────────────────────
export interface TrackPoint {
  lat: number;
  lon: number;
  altitude: number;
  speed: number;
  accuracy: number;
  timestamp: number;
}

export interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  lat: number;
  lon: number;
  altitude: number;
  speed: number;
  lastSeen: number;
  isLost: boolean;
  distanceFromCenter: number;
}

export interface RawGroupMember {
  id: string;
  name: string;
  avatar: string;
  lat: number;
  lon: number;
  altitude: number;
  speed: number;
  lastSeen: number;
}

export type PrivacyMode = 'private' | 'group' | 'friends' | 'public';
export type TrackingStatus = 'idle' | 'active' | 'paused' | 'stopped';

interface TrekTrackerContextType {
  // State
  status: TrackingStatus;
  selectedTrek: Trek | null;
  currentPosition: TrackPoint | null;
  trackHistory: TrackPoint[];
  elapsedSeconds: number;
  groupId: string | null;
  groupMembers: GroupMember[];
  privacyMode: PrivacyMode;
  sosTriggered: boolean;
  userName: string;
  userAvatar: string;

  // Actions
  setSelectedTrek: (t: Trek | null) => void;
  startTracking: () => void;
  pauseTracking: () => void;
  stopTracking: () => void;
  resetTracking: () => void;
  createGroup: (name: string) => string;
  joinGroup: (code: string, name: string) => boolean;
  leaveGroup: () => void;
  setPrivacyMode: (m: PrivacyMode) => void;
  triggerSOS: () => void;
  cancelSOS: () => void;
  setUserName: (n: string) => void;
  setUserAvatar: (a: string) => void;
}

// ─── Haversine ─────────────────────────────────────────────────────────────
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── IndexedDB helpers ─────────────────────────────────────────────────────
const DB_NAME = 'tv_tracker';
const STORE_NAME = 'track_points';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME, { autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function savePointToDB(point: TrackPoint & { sessionId: string }) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).add(point);
  } catch {}
}

async function getSessionPoints(sessionId: string): Promise<TrackPoint[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    return new Promise((resolve) => {
      const req = tx.objectStore(STORE_NAME).getAll();
      req.onsuccess = () => {
        const all = req.result as (TrackPoint & { sessionId: string })[];
        resolve(all.filter(p => p.sessionId === sessionId));
      };
      req.onerror = () => resolve([]);
    });
  } catch { return []; }
}

// ─── Context ───────────────────────────────────────────────────────────────
const TrekTrackerContext = createContext<TrekTrackerContextType | null>(null);

export function TrekTrackerProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<TrackingStatus>('idle');
  const [selectedTrek, setSelectedTrek] = useState<Trek | null>(null);
  const [currentPosition, setCurrentPosition] = useState<TrackPoint | null>(null);
  const [trackHistory, setTrackHistory] = useState<TrackPoint[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [privacyMode, setPrivacyModeState] = useState<PrivacyMode>('private');
  const [sosTriggered, setSosTriggered] = useState(false);
  const [userName, setUserNameState] = useState('Trekker');
  const [userAvatar, setUserAvatarState] = useState('🧗');

  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const groupPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionIdRef = useRef<string>('');
  const startTimeRef = useRef<number>(0);

  // Load preferences
  useEffect(() => {
    sessionIdRef.current = `session_${Date.now()}`;
    if (typeof window === 'undefined') return;
    const name = localStorage.getItem('tv_tracker_name');
    const avatar = localStorage.getItem('tv_tracker_avatar');
    const privacy = localStorage.getItem('tv_privacy') as PrivacyMode | null;
    setTimeout(() => {
      if (name) setUserNameState(name);
      if (avatar) setUserAvatarState(avatar);
      if (privacy) setPrivacyModeState(privacy);
    }, 0);
  }, []);

  const setUserName = useCallback((n: string) => {
    setUserNameState(n);
    localStorage.setItem('tv_tracker_name', n);
  }, []);

  const setUserAvatar = useCallback((a: string) => {
    setUserAvatarState(a);
    localStorage.setItem('tv_tracker_avatar', a);
  }, []);

  const setPrivacyMode = useCallback((m: PrivacyMode) => {
    setPrivacyModeState(m);
    localStorage.setItem('tv_privacy', m);
  }, []);

  // Broadcast own position to localStorage for group members
  const broadcastPosition = useCallback((pos: TrackPoint, gid: string | null, name: string, avatar: string) => {
    if (!gid || typeof window === 'undefined') return;
    const myId = `member_${sessionIdRef.current}`;
    const key = `tv_group_${gid}`;
    const existing = JSON.parse(localStorage.getItem(key) || '{}');
    existing[myId] = { id: myId, name, avatar, lat: pos.lat, lon: pos.lon, altitude: pos.altitude, speed: pos.speed, lastSeen: Date.now() };
    localStorage.setItem(key, JSON.stringify(existing));
  }, []);

  // Poll group members from localStorage
  const pollGroupMembers = useCallback((gid: string) => {
    if (typeof window === 'undefined') return;
    const key = `tv_group_${gid}`;
    const raw = JSON.parse(localStorage.getItem(key) || '{}');
    const myId = `member_${sessionIdRef.current}`;
    const now = Date.now();

    // Compute center (average of all active members)
    const activeVals = Object.values(raw) as RawGroupMember[];
    const active = activeVals.filter((m) => now - m.lastSeen < 60000); // seen in last 60s
    const centerLat = active.reduce((s: number, m) => s + m.lat, 0) / (active.length || 1);
    const centerLon = active.reduce((s: number, m) => s + m.lon, 0) / (active.length || 1);

    const members: GroupMember[] = active
      .filter((m) => m.id !== myId)
      .map((m) => {
        const dist = haversine(m.lat, m.lon, centerLat, centerLon);
        return { ...m, isLost: dist > 500, distanceFromCenter: Math.round(dist) };
      });

    setGroupMembers(members);
  }, []);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    sessionIdRef.current = `session_${Date.now()}`;
    startTimeRef.current = Date.now();
    setStatus('active');
    setTrackHistory([]);
    setElapsedSeconds(0);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const point: TrackPoint = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          altitude: pos.coords.altitude ?? 0,
          speed: pos.coords.speed ?? 0,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        };
        setCurrentPosition(point);
        setTrackHistory(prev => {
          const last = prev[prev.length - 1];
          if (last && haversine(last.lat, last.lon, point.lat, point.lon) < 5) return prev; // debounce 5m
          return [...prev, point];
        });
        savePointToDB({ ...point, sessionId: sessionIdRef.current });
        broadcastPosition(point, groupId, userName, userAvatar);
      },
      (err) => console.warn('GPS error:', err.message),
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 }
    );

    // Timer
    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.round((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  }, [groupId, userName, userAvatar, broadcastPosition]);

  const pauseTracking = useCallback(() => {
    if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus('paused');
  }, []);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus('stopped');
    // Save session summary to localStorage
    if (typeof window !== 'undefined') {
      let dist = 0;
      for (let i = 1; i < trackHistory.length; i++) {
        dist += haversine(
          trackHistory[i - 1].lat, trackHistory[i - 1].lon,
          trackHistory[i].lat, trackHistory[i].lon
        );
      }
      const completedKm = Math.round((dist / 1000) * 100) / 100;
      const alts = trackHistory.map(p => p.altitude).filter(a => a > 0);
      const maxAltitude = alts.length > 0 ? Math.round(Math.max(...alts)) : Math.round(currentPosition?.altitude ?? 0);

      const sessions = JSON.parse(localStorage.getItem('tv_sessions') || '[]');
      sessions.push({
        id: sessionIdRef.current,
        trekId: selectedTrek?.id ?? 'free',
        trekName: selectedTrek?.name ?? 'Free Roam',
        points: trackHistory.length,
        startTime: startTimeRef.current,
        endTime: Date.now(),
        elapsedSeconds,
        completedKm,
        maxAltitude,
        state: selectedTrek?.state ?? 'Unknown',
      });
      localStorage.setItem('tv_sessions', JSON.stringify(sessions.slice(-50)));
    }
  }, [selectedTrek, trackHistory, currentPosition, elapsedSeconds]);

  const resetTracking = useCallback(() => {
    if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus('idle');
    setCurrentPosition(null);
    setTrackHistory([]);
    setElapsedSeconds(0);
  }, []);

  // Group
  const createGroup = useCallback((name: string): string => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGroupId(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`tv_group_${code}`, JSON.stringify({}));
      localStorage.setItem('tv_my_group', code);
    }
    return code;
  }, []);

  const joinGroup = useCallback((code: string, name: string): boolean => {
    const key = `tv_group_${code}`;
    if (typeof window === 'undefined') return false;
    // Group must exist OR we create it fresh
    const existing = localStorage.getItem(key);
    if (!existing) {
      // Create it so others can join
      localStorage.setItem(key, JSON.stringify({}));
    }
    setGroupId(code);
    setUserName(name);
    localStorage.setItem('tv_my_group', code);
    return true;
  }, [setUserName]);

  const leaveGroup = useCallback(() => {
    if (groupId && typeof window !== 'undefined') {
      const key = `tv_group_${groupId}`;
      const myId = `member_${sessionIdRef.current}`;
      const raw = JSON.parse(localStorage.getItem(key) || '{}');
      delete raw[myId];
      localStorage.setItem(key, JSON.stringify(raw));
      localStorage.removeItem('tv_my_group');
    }
    setGroupId(null);
    setGroupMembers([]);
  }, [groupId]);

  // Poll group members
  useEffect(() => {
    if (groupId) {
      groupPollRef.current = setInterval(() => pollGroupMembers(groupId), 3000);
    } else {
      if (groupPollRef.current) clearInterval(groupPollRef.current);
    }
    return () => { if (groupPollRef.current) clearInterval(groupPollRef.current); };
  }, [groupId, pollGroupMembers]);

  const triggerSOS = useCallback(() => setSosTriggered(true), []);
  const cancelSOS = useCallback(() => setSosTriggered(false), []);

  return (
    <TrekTrackerContext.Provider value={{
      status, selectedTrek, currentPosition, trackHistory, elapsedSeconds,
      groupId, groupMembers, privacyMode, sosTriggered, userName, userAvatar,
      setSelectedTrek, startTracking, pauseTracking, stopTracking, resetTracking,
      createGroup, joinGroup, leaveGroup, setPrivacyMode,
      triggerSOS, cancelSOS, setUserName, setUserAvatar,
    }}>
      {children}
    </TrekTrackerContext.Provider>
  );
}

export function useTrekTracker() {
  const ctx = useContext(TrekTrackerContext);
  if (!ctx) throw new Error('useTrekTracker must be used within TrekTrackerProvider');
  return ctx;
}
