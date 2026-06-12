'use client';
import React from 'react';
import { GroupMember } from '../../context/TrekTrackerContext';
import { MapPin, Clock, AlertTriangle, Navigation } from 'lucide-react';

interface MemberCardProps {
  member: GroupMember;
  isMe?: boolean;
}

function fmtDist(m: number): string {
  if (m < 1000) return `${m}m`;
  return `${(m / 1000).toFixed(1)}km`;
}

export default function MemberCard({ member, isMe = false }: MemberCardProps) {
  const isLost = member.isLost && !isMe;
  const [isOffline, setIsOffline] = React.useState(false);
  const [lastSeenStr, setLastSeenStr] = React.useState('Just now');

  React.useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diffMs = now - member.lastSeen;
      setIsOffline(diffMs > 120000);

      if (diffMs < 60000) {
        setLastSeenStr('Just now');
      } else if (diffMs < 3600000) {
        setLastSeenStr(`${Math.floor(diffMs / 60000)}m ago`);
      } else {
        setLastSeenStr(`${Math.floor(diffMs / 3600000)}h ago`);
      }
    };

    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, [member.lastSeen]);

  return (
    <div className={`relative rounded-2xl p-4 border transition-all ${
      isLost
        ? 'border-red-500/60 bg-red-950/30'
        : isMe
        ? 'border-emerald-500/40 bg-emerald-950/20'
        : isOffline
        ? 'border-slate-700/40 bg-slate-900/40 opacity-60'
        : 'border-slate-700/30 bg-slate-900/40'
    }`}>
      {/* Lost alert banner */}
      {isLost && (
        <div className="flex items-center gap-1.5 mb-2 text-[9px] font-black text-red-400 uppercase tracking-widest">
          <AlertTriangle className="w-3 h-3 animate-pulse" />
          SEPARATED — {fmtDist(member.distanceFromCenter)} FROM GROUP
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${
          isMe ? 'bg-emerald-500/20 ring-2 ring-emerald-500' :
          isLost ? 'bg-red-500/20 ring-2 ring-red-500 animate-pulse' :
          'bg-slate-800'
        }`}>
          {member.avatar || '🧗'}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-white truncate">
              {member.name}{isMe ? ' (You)' : ''}
            </span>
            {/* Status dot */}
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
              isOffline ? 'bg-slate-500' :
              isLost ? 'bg-red-400 animate-pulse' :
              'bg-emerald-400'
            }`} />
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1.5">
            {/* Altitude */}
            <div className="flex items-center gap-1">
              <Navigation className="w-3 h-3 text-blue-400 flex-shrink-0" />
              <span className="text-[10px] font-bold text-slate-300">
                {member.altitude > 0 ? `${Math.round(member.altitude).toLocaleString()} m` : '-- m'}
              </span>
            </div>

            {/* Speed */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-400">
                {member.speed > 0 ? `${(member.speed * 3.6).toFixed(1)} km/h` : 'Stationary'}
              </span>
            </div>

            {/* Last seen */}
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500 flex-shrink-0" />
              <span className="text-[10px] text-slate-400">{lastSeenStr}</span>
            </div>

            {/* Distance from group */}
            {!isMe && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                <span className={`text-[10px] font-bold ${isLost ? 'text-red-400' : 'text-slate-400'}`}>
                  {fmtDist(member.distanceFromCenter)}
                </span>
              </div>
            )}
          </div>

          {/* Coordinates */}
          <div className="text-[9px] text-slate-600 font-mono mt-1">
            {member.lat.toFixed(4)}°, {member.lon.toFixed(4)}°
          </div>
        </div>
      </div>
    </div>
  );
}
