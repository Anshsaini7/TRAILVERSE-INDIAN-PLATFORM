'use client';

import React, { useState } from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, User, Phone, MapPin, Sparkles, Check, HelpCircle, Star, Compass, ArrowRight, Eye, EyeOff } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuthPage() {
  const router = useRouter();
  const { login, signup, sendOTP, verifyOTP, googleLogin } = useAuth();

  // Mode states: 'login' | 'signup' | 'otp' | 'forgot'
  const [mode, setMode] = useState<'login' | 'signup' | 'otp' | 'forgot'>('login');
  const [role, setRole] = useState<UserRole>('USER');

  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Action feedback states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [otpDispatched, setOtpDispatched] = useState(false);
  const [otpSentCode, setOtpSentCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (email.toLowerCase().includes('admin')) {
          throw new Error('Access Denied: Admins must use the secure Admin Login Portal.');
        }
        const res = await login(email, password);
        confetti({ particleCount: 80, spread: 50 });
        setSuccessMsg('Logged in successfully!');
        setTimeout(() => {
          if (res.data.role === 'ADMIN') router.push('/admin');
          else if (res.data.role === 'GUIDE') router.push('/company-dashboard');
          else router.push('/dashboard');
        }, 1000);
      } else if (mode === 'signup') {
        const res = await signup(name, email, password, role);
        confetti({ particleCount: 100, spread: 60 });
        setSuccessMsg('Account created successfully!');
        setTimeout(() => {
          if (res.data.role === 'GUIDE') router.push('/company-dashboard');
          else router.push('/dashboard');
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  // OTP triggers
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      const code = await sendOTP(phone);
      setOtpSentCode(code);
      setOtpDispatched(true);
      setSuccessMsg(`OTP sent successfully! (Demo OTP is ${code})`);
    } catch (err: any) {
      setErrorMsg('Failed to dispatch OTP. Please check parameters.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setErrorMsg('OTP must be exactly 6 digits.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      await verifyOTP(phone, otpCode);
      confetti({ particleCount: 100, spread: 60 });
      setSuccessMsg('Phone verified successfully! Account created.');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Incorrect OTP code entered.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth triggers
  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      // Simulate Google Auth
      await googleLogin('Google Explorer', 'google.explorer@gmail.com');
      confetti({ particleCount: 120, spread: 70 });
      setSuccessMsg('Google authentication successful!');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err: any) {
      setErrorMsg('Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  // Reset password triggers
  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg(`A password reset link has been dispatched to ${email}. Please check your inbox.`);
    setTimeout(() => {
      setMode('login');
      setSuccessMsg('');
    }, 4000);
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Visual background details */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center flex flex-col items-center">
        <div className="h-12 w-12 rounded-2xl bg-gradient-premium text-white flex items-center justify-center shadow-lg mb-4">
          <Compass className="h-6 w-6 animate-pulse" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-display)' }}>
          {mode === 'login' && 'Welcome Back'}
          {mode === 'signup' && 'Start Your Adventure'}
          {mode === 'otp' && 'SMS Secure Verification'}
          {mode === 'forgot' && 'Reset Access Password'}
        </h2>
        <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          {mode === 'login' && 'Access traveler profile, buddy lists, and booking tickets.'}
          {mode === 'signup' && 'Join India\'s most comprehensive trekking ecosystem.'}
          {mode === 'otp' && 'One-Time-Password sent directly to your mobile number.'}
          {mode === 'forgot' && 'Provide your email to generate a secure reset link.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-6">
          
          {/* Status alerts */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-250/30 rounded-2xl text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250/30 rounded-2xl text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2">
              <Check className="h-4 w-4 stroke-[3]" />
              {successMsg}
            </div>
          )}

          <AnimatePresence mode="wait">
            
            {/* 1. LOGIN MODE */}
            {mode === 'login' && (
              <motion.div key="login" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="name@domain.com"
                        className="w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Password</label>
                      <button type="button" onClick={() => setMode('forgot')} className="text-[10px] font-extrabold text-emerald-500 hover:underline">Forgot?</button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-10 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-650 dark:hover:text-slate-300 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-premium text-white font-bold py-3.5 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2 disabled:opacity-60"
                  >
                    {loading ? 'Authenticating...' : 'Sign In'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>

                 {/* Switch tab option */}
                <div className="mt-6 text-center text-xs font-bold text-slate-500 flex flex-col gap-3">
                  <div>
                    New to TrailVerse?{' '}
                    <button onClick={() => setMode('signup')} className="text-emerald-500 hover:underline cursor-pointer">Create an Account</button>
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-850">
                    <Link href="/admin/login" className="inline-flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-emerald-500 font-extrabold uppercase tracking-wider transition-colors cursor-pointer">
                      <Lock className="h-3 w-3" />
                      Secure Admin Portal Login
                    </Link>
                  </div>
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
                  <div className="relative flex justify-center text-xs font-extrabold uppercase"><span className="bg-white dark:bg-slate-900 px-3 text-slate-400">Or connect via</span></div>
                </div>

                <div className="grid grid-cols-2 gap-3 font-bold text-xs">
                  <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                    <span>Google Login</span>
                  </button>
                  <button onClick={() => setMode('otp')} className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                    <Phone className="h-4 w-4 text-emerald-500" />
                    <span>OTP Login</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* 2. SIGNUP MODE */}
            {mode === 'signup' && (
              <motion.div key="signup" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-5">
                {/* Role Toggle Selector */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Account Type</label>
                  <div className="grid grid-cols-2 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setRole('USER')}
                      className={`py-2 px-3 rounded-xl transition-all cursor-pointer ${role === 'USER' ? 'bg-white dark:bg-slate-850 text-emerald-500 shadow-sm' : 'text-slate-500'}`}
                    >
                      Traveler User
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('GUIDE')}
                      className={`py-2 px-3 rounded-xl transition-all cursor-pointer ${role === 'GUIDE' ? 'bg-white dark:bg-slate-850 text-emerald-500 shadow-sm' : 'text-slate-500'}`}
                    >
                      Trek Operator
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Your Full Name"
                        className="w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="e.g. name@domain.com"
                        className="w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">Secure Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                        className="w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-10 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-650 dark:hover:text-slate-300 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-premium text-white font-bold py-3.5 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-3 disabled:opacity-60"
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>

                <div className="text-center text-xs font-bold text-slate-500">
                  Already have an account?{' '}
                  <button onClick={() => setMode('login')} className="text-emerald-500 hover:underline">Sign In</button>
                </div>
              </motion.div>
            )}

            {/* 3. OTP VERIFICATION MODE */}
            {mode === 'otp' && (
              <motion.div key="otp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {!otpDispatched ? (
                  <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">Phone Number (10 digits)</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                        <span className="absolute left-9 top-3.5 text-xs font-bold text-slate-500">+91</span>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={e => setPhone(e.target.value.replace(/\D/g, '').substring(0, 10))}
                          placeholder="9876543210"
                          className="w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl pl-16 pr-4 py-3 text-xs font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-premium text-white font-bold py-3.5 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2 disabled:opacity-60"
                    >
                      {loading ? 'Dispatching...' : 'Send OTP verification'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">Enter 6-digit OTP code</label>
                      <input
                        type="text"
                        required
                        value={otpCode}
                        onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                        placeholder="••••••"
                        className="w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 text-center text-sm font-extrabold tracking-[0.6em] focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                      />
                      <p className="text-[10px] text-slate-400 mt-2 text-center">Verify code sent to +91 {phone}</p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-premium text-white font-bold py-3.5 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2 disabled:opacity-60"
                    >
                      {loading ? 'Verifying...' : 'Verify & Continue'}
                    </button>

                    <button type="button" onClick={() => setOtpDispatched(false)} className="text-[10px] font-extrabold text-slate-400 hover:text-slate-605 text-center mt-2">Change Phone Number</button>
                  </form>
                )}

                <button onClick={() => setMode('login')} className="w-full text-center text-xs font-bold text-emerald-500 hover:underline mt-6">Return to Password Login</button>
              </motion.div>
            )}

            {/* 4. FORGOT PASSWORD MODE */}
            {mode === 'forgot' && (
              <motion.div key="forgot" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <form onSubmit={handleForgotPasswordSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">Account Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="name@domain.com"
                        className="w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-premium text-white font-bold py-3.5 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    Send Recovery Link
                  </button>
                </form>

                <button onClick={() => setMode('login')} className="w-full text-center text-xs font-bold text-emerald-500 hover:underline mt-6">Return to Sign In</button>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
