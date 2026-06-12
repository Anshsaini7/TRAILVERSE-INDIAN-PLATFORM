'use client';

import { useMemo } from 'react';
import { useTrekTracker, TrackPoint } from '../context/TrekTrackerContext';

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface TrekProgressStats {
  totalDistanceKm: number;       // full trek route length
  completedKm: number;           // GPS distance walked so far
  remainingKm: number;
  progressPercent: number;
  currentAltitudeM: number;
  highestAltitudeM: number;
  altitudeGainM: number;
  altitudeLossM: number;
  currentSpeedKmh: number;
  avgSpeedKmh: number;
  elapsedFormatted: string;      // HH:MM:SS
  etaFormatted: string;          // estimated finish time
  caloriesBurned: number;
  trackPoints: TrackPoint[];
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}

export function useTrekProgress(): TrekProgressStats {
  const { selectedTrek, currentPosition, trackHistory, elapsedSeconds, status } = useTrekTracker();

  return useMemo(() => {
    // Total trek distance from route data
    const totalDistanceKm = selectedTrek?.distance ?? 10;

    // Distance covered from GPS track
    let completedKm = 0;
    for (let i = 1; i < trackHistory.length; i++) {
      completedKm += haversine(
        trackHistory[i - 1].lat, trackHistory[i - 1].lon,
        trackHistory[i].lat, trackHistory[i].lon
      );
    }
    completedKm = Math.round(completedKm * 100) / 100;
    const remainingKm = Math.max(0, Math.round((totalDistanceKm - completedKm) * 100) / 100);
    const progressPercent = Math.min(100, Math.round((completedKm / totalDistanceKm) * 100));

    // Altitude
    const currentAltitudeM = currentPosition?.altitude ?? 0;
    const allAltitudes = trackHistory.map(p => p.altitude).filter(a => a > 0);
    const highestAltitudeM = allAltitudes.length > 0 ? Math.round(Math.max(...allAltitudes)) : currentAltitudeM;

    let altitudeGainM = 0;
    let altitudeLossM = 0;
    for (let i = 1; i < trackHistory.length; i++) {
      const diff = trackHistory[i].altitude - trackHistory[i - 1].altitude;
      if (diff > 0) altitudeGainM += diff;
      else altitudeLossM += Math.abs(diff);
    }

    // Speed
    const currentSpeedKmh = currentPosition ? Math.round((currentPosition.speed ?? 0) * 3.6 * 10) / 10 : 0;
    const avgSpeedKmh = elapsedSeconds > 0
      ? Math.round((completedKm / (elapsedSeconds / 3600)) * 10) / 10
      : 0;

    // ETA
    let etaFormatted = '--:--:--';
    if (avgSpeedKmh > 0 && remainingKm > 0) {
      const etaSeconds = Math.round((remainingKm / avgSpeedKmh) * 3600);
      etaFormatted = formatDuration(etaSeconds);
    }

    // Calories: MET × weight(70kg) × hours
    // Trekking MET ≈ 6.0, uphill ≈ 8.0
    const met = altitudeGainM > 100 ? 8.0 : 6.0;
    const caloriesBurned = Math.round(met * 70 * (elapsedSeconds / 3600));

    return {
      totalDistanceKm,
      completedKm,
      remainingKm,
      progressPercent,
      currentAltitudeM: Math.round(currentAltitudeM),
      highestAltitudeM,
      altitudeGainM: Math.round(altitudeGainM),
      altitudeLossM: Math.round(altitudeLossM),
      currentSpeedKmh,
      avgSpeedKmh,
      elapsedFormatted: formatDuration(elapsedSeconds),
      etaFormatted,
      caloriesBurned,
      trackPoints: trackHistory,
    };
  }, [selectedTrek, currentPosition, trackHistory, elapsedSeconds, status]);
}
