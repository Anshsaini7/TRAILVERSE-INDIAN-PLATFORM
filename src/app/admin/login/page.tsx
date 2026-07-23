'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { Lock, Mail, ShieldAlert, Check, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in as Admin, auto-redirect to admin panel
  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      router.push('/admin');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (!email.toLowerCase().includes('admin')) {
        throw new Error('Invalid Admin Portal Email address.');
      }
      
      const res = await login(email, password);
      if (res && res.data && res.data.role === 'ADMIN') {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        setSuccessMsg('Admin Verification Succeeded! Directing to command center...');
        setTimeout(() => {
          router.push('/admin');
        }, 1200);
      } else {
        throw new Error('Access Denied: Insufficient authorization role.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification Failed: Invalid Admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden select-none">
      
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl relative z-10">
        
        {/* Glowing Top line */}
        <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/80 to-transparent" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <Lock className="h-5 w-5 stroke-[2.5]" />
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">Admin Portal Gate</h1>
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-1.5 flex items-center justify-center gap-1">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
            Classified Access Area
          </p>
        </div>

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div className="mb-5 bg-rose-500/10 border border-rose-500/25 rounded-2xl p-4 text-xs font-bold text-rose-500 animate-fadeIn">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              {errorMsg}
            </span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 text-xs font-bold text-emerald-400 animate-fadeIn">
            <span className="flex items-center gap-1.5">
              <Check className="h-4.5 w-4.5 stroke-[3]" />
              {successMsg}
            </span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-xs font-semibold text-slate-400">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Admin Security ID</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-550" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@trailverse.in"
                disabled={loading}
                className="w-full bg-slate-950/70 border border-slate-850 rounded-2xl pl-10.5 pr-4 py-3.5 text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Portal Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-550" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                disabled={loading}
                className="w-full bg-slate-950/70 border border-slate-850 rounded-2xl pl-10.5 pr-4 py-3.5 text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all font-semibold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-premium hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating Credentials...' : 'Verify Identity →'}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-8 text-center text-[9px] text-slate-600 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border-t border-slate-800/40 pt-6">
          <HelpCircle className="h-3.5 w-3.5 text-slate-550" />
          <span>Unauthorized login attempts are strictly logged</span>
        </div>
      </div>
    </div>
  );
}
