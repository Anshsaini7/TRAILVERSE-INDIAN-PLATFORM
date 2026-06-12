'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { trekkingCompanies, treks } from '../../../data/mockData';
import TrekCard from '../../../components/TrekCard';
import { ShieldCheck, Mail, Phone, MapPin, Star, Globe, ArrowLeft, Award, Users, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

interface CompanyProfileProps {
  params: Promise<{ id: string }>;
}

export default function CompanyProfile({ params }: CompanyProfileProps) {
  const { id } = use(params);

  // Find operator
  const company = trekkingCompanies.find(c => c.id === id);
  // Find treks operated by this company
  const companyTreks = treks.filter(t => t.companyId === id);

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-4">
        <Compass className="h-12 w-12 text-slate-350 dark:text-slate-700 animate-spin mb-4" />
        <h2 className="text-xl font-bold">Operator profile not found</h2>
        <p className="text-xs text-slate-400 mt-1 mb-6">We could not locate this operator ID in the TrailVerse database.</p>
        <Link href="/companies" className="bg-gradient-premium px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md">
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 pb-20">
      
      {/* 1. Header Banner Panel */}
      <section className="bg-slate-900 text-white py-12 border-b border-slate-850 relative overflow-hidden">
        {/* Glow blur element */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/companies" className="inline-flex items-center gap-1 text-xs text-slate-450 hover:text-white transition-colors mb-6 font-bold">
            <ArrowLeft className="h-4 w-4" />
            Back to operators directory
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white dark:bg-slate-950 flex items-center justify-center text-4xl shadow-md border border-slate-800 shrink-0">
                {company.logo}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-white leading-none sm:text-3xl">
                    {company.name}
                  </h1>
                  {company.verified && (
                    <ShieldCheck className="h-5.5 w-5.5 fill-emerald-500 text-slate-900" />
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-2 font-medium">IMF Safety Audited &amp; Eco-sustainable Trek Partner</p>
              </div>
            </div>

            <div className="flex gap-6 text-center text-xs border-l border-slate-800 pl-6 shrink-0 font-bold">
              <div>
                <span className="text-slate-500 block uppercase text-[9px] mb-0.5">Rating</span>
                <span className="text-emerald-400 text-lg font-black flex items-center gap-0.5 justify-center">
                  <Star className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />
                  {company.rating}
                </span>
              </div>
              <div className="border-l border-slate-850 pl-6">
                <span className="text-slate-500 block uppercase text-[9px] mb-0.5">Trek Guides</span>
                <span className="text-slate-200 text-lg font-black">{company.team.length} Active leads</span>
              </div>
              <div className="border-l border-slate-850 pl-6">
                <span className="text-slate-500 block uppercase text-[9px] mb-0.5">Active Packages</span>
                <span className="text-slate-200 text-lg font-black">{companyTreks.length} courses</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Page Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: About, safety, team */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* About */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-3">About {company.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {company.about}
              </p>
            </div>

            {/* Trek Packages Grid */}
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-6">Trek Packages ({companyTreks.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {companyTreks.map(trek => (
                  <TrekCard key={trek.id} trek={trek} />
                ))}
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-500" />
                Wilderness Expedition Guides
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {company.team.map((member, i) => (
                  <div key={i} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0">
                      <img src={member.image} alt={member.name} className="object-cover h-full w-full" />
                    </div>
                    <div>
                      <strong className="text-xs text-slate-900 dark:text-slate-100 font-extrabold block">{member.name}</strong>
                      <span className="text-[10px] text-slate-450 font-semibold uppercase tracking-wider block mt-0.5">{member.role}</span>
                      <span className="text-[9px] text-emerald-500 font-bold block mt-1">IMF Registered Leader</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: Safety Certs & Contact details */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Safety Certifications */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-1.5">
                <Award className="h-5 w-5 text-emerald-500" />
                Safety Certifications
              </h3>
              <div className="flex flex-col gap-2.5">
                {company.safetyCertifications.map((cert, i) => (
                  <div key={i} className="flex gap-2 items-start text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Contact details */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Operator Contacts</h3>
              <div className="space-y-4 text-xs font-medium text-slate-550 dark:text-slate-400">
                <div className="flex gap-3 items-start">
                  <MapPin className="h-5 w-5 text-slate-450 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[9px] font-bold uppercase mb-0.5">Headquarters</span>
                    <strong className="text-slate-800 dark:text-slate-200">{company.address}</strong>
                  </div>
                </div>
                <div className="flex gap-3 items-start border-t border-slate-100 dark:border-slate-800/60 pt-4">
                  <Phone className="h-5 w-5 text-slate-450 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[9px] font-bold uppercase mb-0.5">Contact Number</span>
                    <strong className="text-slate-800 dark:text-slate-200">{company.contact}</strong>
                  </div>
                </div>
                <div className="flex gap-3 items-start border-t border-slate-100 dark:border-slate-800/60 pt-4">
                  <Mail className="h-5 w-5 text-slate-450 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[9px] font-bold uppercase mb-0.5">Email Address</span>
                    <strong className="text-slate-800 dark:text-slate-200">{company.email}</strong>
                  </div>
                </div>
                <div className="flex gap-3 items-start border-t border-slate-100 dark:border-slate-800/60 pt-4">
                  <Globe className="h-5 w-5 text-slate-450 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[9px] font-bold uppercase mb-0.5">Website URL</span>
                    <a href={company.website} target="_blank" rel="noreferrer" className="text-emerald-500 hover:text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
                      {company.website}
                      <Globe className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
