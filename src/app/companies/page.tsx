'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { trekkingCompanies, treks } from '../../data/mockData';
import { Star, ShieldCheck, Mail, Phone, MapPin, Globe, Compass, ArrowUpRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CompaniesDirectory() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering operators list
  const filteredCompanies = useMemo(() => {
    return trekkingCompanies.filter(company => 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.about.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-wider block">TRAILVERSE COMPANIONS</span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Adventure Operators</h1>
          <p className="text-xs text-slate-500 mt-1">Directly connect with IMF-verified local guides and trekking operators across India.</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-4 top-3 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search operators..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
          />
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredCompanies.map((company, index) => {
          // Count active treks by this operator
          const totalTreks = treks.filter(t => t.companyId === company.id).length;

          return (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between card-glow"
            >
              <div>
                {/* Brand Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 flex items-center justify-center text-2xl shadow-sm">
                      {company.logo}
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
                        {company.name}
                        {company.verified && (
                          <ShieldCheck className="h-4.5 w-4.5 fill-emerald-500 text-white" />
                        )}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-semibold mt-1 block uppercase">IMF Registered Partner</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20 text-amber-550 dark:text-amber-400 text-xs font-bold shadow-sm">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{company.rating}</span>
                  </div>
                </div>

                {/* About Paragraph */}
                <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-medium mb-6 line-clamp-3">
                  {company.about}
                </p>

                {/* Details list */}
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-4 mb-6">
                  <div className="flex items-center gap-1.5">
                    <Compass className="h-4 w-4 text-slate-450" />
                    <span>Active packages: <strong className="text-slate-800 dark:text-slate-200 font-bold">{totalTreks}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-slate-450 truncate" />
                    <span className="truncate">HQ: <strong className="text-slate-805 dark:text-slate-200 font-bold">{company.address.split(',')[company.address.split(',').length - 2]?.trim() || 'India'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-slate-450" />
                    <span className="truncate">{company.contact}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-slate-450" />
                    <span className="truncate">{company.email}</span>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex gap-4 border-t border-slate-100 dark:border-slate-800/60 pt-4">
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 px-3 border border-slate-200 dark:border-slate-800 rounded-xl text-center text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1"
                >
                  <Globe className="h-3.5 w-3.5" />
                  Website
                </a>
                <Link
                  href={`/companies/${company.id}`}
                  className="flex-1 py-2 px-3 bg-slate-900 dark:bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-center text-xs shadow-md transition-colors flex items-center justify-center gap-1"
                >
                  <span>Operator Profile</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
