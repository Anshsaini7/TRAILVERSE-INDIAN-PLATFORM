'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Send, ShieldAlert, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-900 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-premium text-white">
                <Compass className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Trail<span className="text-emerald-400">Verse</span> India
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
              Discover, compare, plan, and book the most epic treks and outdoor adventures across India. TrailVerse connects you with IMF-certified local guides and sustainable operators.
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-9 w-9 flex items-center justify-center rounded-lg bg-slate-900 hover:bg-emerald-500 hover:text-white transition-colors" aria-label="Facebook">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
              </a>
              <a href="#" className="h-9 w-9 flex items-center justify-center rounded-lg bg-slate-900 hover:bg-emerald-500 hover:text-white transition-colors" aria-label="Twitter">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="h-9 w-9 flex items-center justify-center rounded-lg bg-slate-900 hover:bg-emerald-500 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="h-4 w-4 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="h-9 w-9 flex items-center justify-center rounded-lg bg-slate-900 hover:bg-emerald-500 hover:text-white transition-colors" aria-label="Youtube">
                <svg className="h-4 w-4 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>

          {/* Column 1: Explore */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Explore</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/explore" className="hover:text-emerald-400 transition-colors">Trek Finder</Link></li>
              <li><Link href="/map" className="hover:text-emerald-400 transition-colors">Interactive India Map</Link></li>
              <li><Link href="/activities" className="hover:text-emerald-400 transition-colors">Adventure Sports</Link></li>
              <li><Link href="/companies" className="hover:text-emerald-400 transition-colors">Verified Operators</Link></li>
            </ul>
          </div>

          {/* Column 2: Tools & Comm */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Ecosystem</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/ai-planner" className="hover:text-emerald-400 transition-colors">AI Adventure Planner</Link></li>
              <li><Link href="/community" className="hover:text-emerald-400 transition-colors">Trek Buddy Matcher</Link></li>
              <li><Link href="/community" className="hover:text-emerald-400 transition-colors">Discussion Forums</Link></li>
              <li><Link href="/blog" className="hover:text-emerald-400 transition-colors">Gear & Health Blog</Link></li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Newsletter</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Get monthly gear reviews, safety updates, and exclusive trek packages.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full bg-slate-900 rounded-lg px-3 py-1.5 text-sm text-white border border-slate-800 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg p-2 transition-colors"
                aria-label="Subscribe"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            {subscribed && (
              <motion.p 
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-emerald-400 text-xs mt-2"
              >
                Thanks for subscribing! Check your inbox.
              </motion.p>
            )}
          </div>
        </div>

        <hr className="border-slate-900 my-8" />

        {/* Bottom Panel */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} TrailVerse India. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="/contact" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-slate-400 transition-colors">Eco Agreement</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
