'use client';
import React, { useState } from 'react';
import { useTrekTracker } from '../../context/TrekTrackerContext';
import { AlertTriangle, Phone, Mail, Copy, MessageCircle, X, Shield } from 'lucide-react';

export default function SOSPanel() {
  const { currentPosition, selectedTrek, userName, triggerSOS, cancelSOS, sosTriggered } = useTrekTracker();
  const [countdown, setCountdown] = useState(0);
  const [countdownActive, setCountdownActive] = useState(false);

  const lat = currentPosition?.lat ?? 0;
  const lon = currentPosition?.lon ?? 0;
  const alt = currentPosition?.altitude ?? 0;
  const trekName = selectedTrek?.name ?? 'Unknown Trek';
  const coords = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  const mapsLink = `https://maps.google.com/?q=${lat},${lon}`;
  const now = new Date().toLocaleString('en-IN');

  const sosMessage = `🆘 SOS EMERGENCY ALERT
Name: ${userName}
Trek: ${trekName}
Location: ${coords}
Altitude: ${Math.round(alt)}m
Time: ${now}
Google Maps: ${mapsLink}
Please send help immediately!`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(sosMessage)}`;
  const mailtoUrl = `mailto:?subject=SOS%20Emergency%20Alert&body=${encodeURIComponent(sosMessage)}`;
  const copyCoords = () => {
    navigator.clipboard.writeText(coords).catch(() => {});
    alert(`📋 Coordinates copied!\n${coords}`);
  };

  const handleBigSOS = () => {
    triggerSOS();
    setCountdownActive(true);
    let c = 3;
    setCountdown(c);
    const iv = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(iv);
        setCountdownActive(false);
        window.open(whatsappUrl, '_blank');
      }
    }, 1000);
  };

  const cancelBigSOS = () => {
    cancelSOS();
    setCountdownActive(false);
    setCountdown(0);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-red-500" />
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Emergency SOS System</span>
      </div>

      {/* Current Position */}
      <div className="rounded-2xl p-4 border border-slate-700/50" style={{ background: 'rgba(239,68,68,0.07)' }}>
        <div className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">Your Current Position</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Latitude', value: lat.toFixed(6) + '°' },
            { label: 'Longitude', value: lon.toFixed(6) + '°' },
            { label: 'Altitude', value: `${Math.round(alt)} m` },
            { label: 'Trek', value: trekName },
          ].map(item => (
            <div key={item.label} className="bg-white/5 rounded-xl p-2.5">
              <div className="text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">{item.label}</div>
              <div className="text-xs font-black text-white truncate">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Big SOS Button */}
      {!countdownActive ? (
        <button
          onClick={handleBigSOS}
          className="w-full py-5 rounded-2xl font-black text-xl text-white uppercase tracking-widest cursor-pointer transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
            boxShadow: '0 0 30px rgba(220,38,38,0.5), 0 4px 20px rgba(0,0,0,0.3)',
            animation: 'sos-pulse 2s ease-in-out infinite',
          }}>
          <div className="flex items-center justify-center gap-3">
            <AlertTriangle className="w-7 h-7" />
            🆘 SEND SOS
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="text-xs font-semibold mt-1 opacity-70">Tap to alert emergency contacts</div>
        </button>
      ) : (
        <div className="rounded-2xl p-5 text-center border-2 border-red-500"
          style={{ background: 'rgba(220,38,38,0.15)' }}>
          <div className="text-6xl font-black text-red-400 mb-2">{countdown}</div>
          <div className="text-xs font-bold text-red-300 mb-4">SOS sending in {countdown} second{countdown !== 1 ? 's' : ''}…</div>
          <button onClick={cancelBigSOS}
            className="flex items-center gap-2 mx-auto bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-all">
            <X className="w-4 h-4" /> Cancel SOS
          </button>
        </div>
      )}

      {/* Individual action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <a href={whatsappUrl} target="_blank" rel="noreferrer"
          className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs cursor-pointer transition-all hover:scale-105 active:scale-95 text-white"
          style={{ background: 'linear-gradient(135deg,#25d366,#128c7e)' }}>
          <MessageCircle className="w-4 h-4" />
          WhatsApp SOS
        </a>
        <a href={mailtoUrl}
          className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs cursor-pointer transition-all hover:scale-105 active:scale-95 text-white"
          style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}>
          <Mail className="w-4 h-4" />
          Email SOS
        </a>
        <a href="tel:112"
          className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs cursor-pointer transition-all hover:scale-105 active:scale-95 text-white"
          style={{ background: 'linear-gradient(135deg,#dc2626,#991b1b)' }}>
          <Phone className="w-4 h-4" />
          Call 112
        </a>
        <button onClick={copyCoords}
          className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs cursor-pointer transition-all hover:scale-105 active:scale-95 text-white"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#4c1d95)' }}>
          <Copy className="w-4 h-4" />
          Copy Coords
        </button>
      </div>

      {/* Safe rescue contacts */}
      <div className="rounded-2xl p-4 border border-slate-700/40 bg-white/3">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">🏥 Emergency Contacts</div>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Mountain Rescue (India)', num: '112' },
            { label: 'SDRF (Uttarakhand)', num: '9410107908' },
            { label: 'HIMACHAL Rescue', num: '01772622340' },
            { label: 'Sikkim Tourism', num: '03592202634' },
          ].map(c => (
            <div key={c.label} className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-400">{c.label}</span>
              <a href={`tel:${c.num}`} className="text-[10px] font-black text-emerald-400 hover:text-emerald-300 transition-colors">
                📞 {c.num}
              </a>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes sos-pulse {
          0%, 100% { box-shadow: 0 0 30px rgba(220,38,38,0.5); }
          50% { box-shadow: 0 0 50px rgba(220,38,38,0.9), 0 0 80px rgba(220,38,38,0.3); }
        }
      `}</style>
    </div>
  );
}
