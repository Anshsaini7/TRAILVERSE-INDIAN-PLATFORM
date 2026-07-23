'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, Check, ShieldCheck, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactModule() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Safety Question');
  const [message, setMessage] = useState('');
  
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSent(true);
    setName('');
    setEmail('');
    setMessage('');
    setTimeout(() => setIsSent(false), 5000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-wider block">SUPPORT CORE</span>
        <h1 className="text-3xl font-black text-slate-905 dark:text-white mt-1">Get In Touch</h1>
        <p className="text-xs text-slate-500 mt-1">Contact our expedition coordination desk for safety inquiries, permits, or operator verification audits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Contact Form */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm card-glow">
          <AnimatePresence mode="wait">
            {!isSent ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 text-xs font-semibold"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-2.5 text-xs text-slate-905 dark:text-slate-100 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl p-2.5 text-xs text-slate-905 dark:text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-2.5 text-xs focus:outline-none"
                  >
                    <option value="Safety Question">🏔️ Safety &amp; Medical Inquiries</option>
                    <option value="Operator Partnership">💼 Outfitter &amp; Partner Registries</option>
                    <option value="Booking Help">🎫 Booking &amp; Permits Assistance</option>
                    <option value="Feedback">✍️ General Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Your Message</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="How can our adventure desk assist you? Detail your high-altitude requirements..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-2.5 text-xs text-slate-905 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-gradient-premium hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2 w-fit"
                >
                  <Send className="h-4 w-4" />
                  Send Support Ticket
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 text-center flex flex-col items-center justify-center gap-4"
              >
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Check className="h-6 w-6 stroke-[3]" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Message Transmitted!</h3>
                <p className="text-xs text-slate-400 max-w-sm font-medium">Your support ticket has been queued. An adventure coordinator from the Dehradun safety desk will email you within 12 hours.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: Contact Details */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Operations base */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
            <h3 className="text-base font-extrabold text-slate-905 dark:text-white">Operations Desk</h3>
            <div className="space-y-4 text-xs font-medium text-slate-550 dark:text-slate-400">
              <div className="flex gap-3 items-start">
                <MapPin className="h-5 w-5 text-slate-450 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold uppercase mb-0.5 font-sans">Main Safety Base</span>
                  <strong className="text-slate-800 dark:text-slate-200">12, Rajpur Road, Tapovan Complex, Dehradun, Uttarakhand 248001</strong>
                </div>
              </div>
              <div className="flex gap-3 items-start border-t border-slate-100 dark:border-slate-800/60 pt-4">
                <Phone className="h-5 w-5 text-slate-450 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold uppercase mb-0.5">Hotline Support</span>
                  <strong className="text-slate-800 dark:text-slate-200">+91 135-272-9900</strong>
                </div>
              </div>
              <div className="flex gap-3 items-start border-t border-slate-100 dark:border-slate-800/60 pt-4">
                <Mail className="h-5 w-5 text-slate-450 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold uppercase mb-0.5">Email Support Desk</span>
                  <strong className="text-slate-800 dark:text-slate-200">safety@trailverse.in</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Warning Info */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm text-xs font-medium text-slate-500 flex flex-col gap-3">
            <div className="flex gap-2 items-start">
              <Compass className="h-5 w-5 text-emerald-500 shrink-0" />
              <div>
                <span className="font-extrabold text-slate-905 dark:text-white block">Immediate Evacuation Help</span>
                <p className="mt-0.5 leading-relaxed text-slate-400">If you are currently on trail and require urgent helicopter rescue coord, bypass email ticketing and call our 24/7 emergency dispatch line directly at +91 90000-00000.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
