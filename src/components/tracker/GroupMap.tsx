/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
'use client';

import React, { useEffect, useRef } from 'react';
import { TrackPoint, GroupMember } from '../../context/TrekTrackerContext';
import 'leaflet/dist/leaflet.css';

interface GroupMapProps {
  currentPosition: TrackPoint | null;
  trackHistory: TrackPoint[];
  groupMembers: GroupMember[];
  userName?: string;
  userAvatar?: string;
  safeCamps?: { lat: number; lon: number; name: string; type: 'camp' | 'water' | 'medical' | 'rescue' }[];
}

declare global {
  interface Window { L: any; }
}

const SAFE_ZONE_ICONS: Record<string, string> = {
  camp: '🏕️',
  water: '💧',
  medical: '🏥',
  rescue: '🚁',
};

export default function GroupMap({
  currentPosition, trackHistory, groupMembers, userName = 'You', userAvatar = '🧗', safeCamps = []
}: GroupMapProps) {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const myMarkerRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const memberMarkersRef = useRef<Map<string, any>>(new Map());

  // Init Leaflet
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;
    if (mapRef.current) return;

    const L = require('leaflet');

    // Fix default icons
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const center: [number, number] = currentPosition
      ? [currentPosition.lat, currentPosition.lon]
      : [30.0668, 79.0193]; // default: Kedarnath area

    const map = L.map(containerRef.current, {
      center,
      zoom: 14,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Satellite toggle option
    const satellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { attribution: '© Esri', maxZoom: 18 }
    );

    L.control.layers({
      'Trail Map': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }),
      'Satellite': satellite,
    }).addTo(map);

    mapRef.current = map;

    // Add safe zone markers
    safeCamps.forEach(zone => {
      const icon = L.divIcon({
        html: `<div style="font-size:20px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.6))">${SAFE_ZONE_ICONS[zone.type]}</div>`,
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      L.marker([zone.lat, zone.lon], { icon })
        .addTo(map)
        .bindPopup(`<b>${SAFE_ZONE_ICONS[zone.type]} ${zone.name}</b><br><small>${zone.type.toUpperCase()}</small>`);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, []); // eslint-disable-line

  // Update my marker and polyline
  useEffect(() => {
    if (!mapRef.current || !currentPosition) return;
    const L = require('leaflet');

    const myIcon = L.divIcon({
      html: `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);border:3px solid white;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 0 12px rgba(16,185,129,0.7);">${userAvatar}</div>`,
      className: '',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    if (myMarkerRef.current) {
      myMarkerRef.current.setLatLng([currentPosition.lat, currentPosition.lon]);
    } else {
      myMarkerRef.current = L.marker([currentPosition.lat, currentPosition.lon], { icon: myIcon })
        .addTo(mapRef.current)
        .bindPopup(`<b>${userAvatar} ${userName}</b><br>${currentPosition.lat.toFixed(5)}, ${currentPosition.lon.toFixed(5)}<br>Alt: ${Math.round(currentPosition.altitude)}m`);
    }
    mapRef.current.panTo([currentPosition.lat, currentPosition.lon], { animate: true, duration: 1 });

    // Polyline
    if (trackHistory.length > 1) {
      const latlngs = trackHistory.map(p => [p.lat, p.lon] as [number, number]);
      if (polylineRef.current) {
        polylineRef.current.setLatLngs(latlngs);
      } else {
        polylineRef.current = L.polyline(latlngs, {
          color: '#10b981',
          weight: 4,
          opacity: 0.85,
          dashArray: undefined,
        }).addTo(mapRef.current);
      }
    }
  }, [currentPosition, trackHistory, userName, userAvatar]);

  // Update group member markers
  useEffect(() => {
    if (!mapRef.current) return;
    const L = require('leaflet');

    groupMembers.forEach(member => {
      const color = member.isLost ? '#ef4444' : '#f59e0b';
      const icon = L.divIcon({
        html: `<div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,${color},${color}dd);border:3px solid white;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 0 10px ${color}88;">${member.avatar || '🧗'}</div>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const existing = memberMarkersRef.current.get(member.id);
      if (existing) {
        existing.setLatLng([member.lat, member.lon]);
      } else {
        const marker = L.marker([member.lat, member.lon], { icon })
          .addTo(mapRef.current)
          .bindPopup(`<b>${member.avatar} ${member.name}</b><br>Alt: ${Math.round(member.altitude)}m<br>${member.isLost ? '⚠️ SEPARATED' : '✅ In Group'}`);
        memberMarkersRef.current.set(member.id, marker);
      }
    });
  }, [groupMembers]);

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ height: 380 }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-slate-950/90 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/10">
        <div className="flex flex-col gap-1">
          {[
            { color: '#10b981', label: 'You' },
            { color: '#f59e0b', label: 'Group Member' },
            { color: '#ef4444', label: 'Separated' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }} />
              <span className="text-[9px] font-bold text-slate-300">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* GPS update indicator */}
      {currentPosition && (
        <div className="absolute top-3 right-3 z-[1000] bg-emerald-500/90 text-white text-[9px] font-black px-2 py-1 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          GPS LIVE
        </div>
      )}
    </div>
  );
}
