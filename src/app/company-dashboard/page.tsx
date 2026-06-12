'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { treks } from '../../data/mockData';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Check, X, ShieldAlert, Award, FileText, ChevronRight, 
  Star, DollarSign, Calendar, Users, Eye, ShieldCheck, HelpCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OperatorDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Redirect to login if not authenticated or not GUIDE/operator
  useEffect(() => {
    if (!user) {
      router.push('/auth');
    } else if (user.role !== 'GUIDE' && user.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Dashboard state tabs: 'overview' | 'packages' | 'leads' | 'verify'
  const [activeTab, setActiveTab] = useState<'overview' | 'packages' | 'leads' | 'verify'>('overview');

  // Package creation states
  const [createdPackages, setCreatedPackages] = useState([
    { id: 'ct-1', trek: treks[0], price: 15500, dates: '2026-06-15 to 2026-06-22' },
    { id: 'ct-2', trek: treks[1], price: 9200, dates: '2026-07-01 to 2026-07-06' }
  ]);
  const [selectedTrekId, setSelectedTrekId] = useState(treks[0].id);
  const [newPackagePrice, setNewPackagePrice] = useState('');
  const [newPackageDates, setNewPackageDates] = useState('');
  const [addPackageOpen, setAddPackageOpen] = useState(false);

  // Document verification states
  const [gstNumber, setGstNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [docFileUrl, setDocFileUrl] = useState('');
  const [verificationSubmitted, setVerificationSubmitted] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'UNVERIFIED' | 'PENDING' | 'VERIFIED'>('UNVERIFIED');

  // Mock inquiries leads
  const [leads, setLeads] = useState([
    { id: 'l-1', name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', phone: '+91 9876543210', trek: treks[0], dates: '2026-06-15', persons: 3, status: 'PENDING' },
    { id: 'l-2', name: 'Priya Patel', email: 'priya.p@gmail.com', phone: '+91 8765432109', trek: treks[1], dates: '2026-07-01', persons: 2, status: 'CONFIRMED' }
  ]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <HelpCircle className="h-10 w-10 animate-spin text-emerald-500 mb-4" />
        <h2 className="text-sm font-bold text-slate-400">Loading operator dashboard...</h2>
      </div>
    );
  }

  // Handle Add Package
  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackagePrice || !newPackageDates) return;

    const selectedTrek = treks.find(t => t.id === selectedTrekId) || treks[0];
    const newPkg = {
      id: `ct-${Date.now()}`,
      trek: selectedTrek,
      price: Number(newPackagePrice),
      dates: newPackageDates
    };

    setCreatedPackages([newPkg, ...createdPackages]);
    setNewPackagePrice('');
    setNewPackageDates('');
    setAddPackageOpen(false);
    confetti({ particleCount: 50, spread: 30 });
  };

  // Handle document verification submission
  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gstNumber || !licenseNumber || !docFileUrl) return;

    setVerificationStatus('PENDING');
    setVerificationSubmitted(true);
    confetti({ particleCount: 40, spread: 25 });
  };

  // Accept / Confirm Lead
  const handleConfirmLead = (leadId: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'CONFIRMED' } : l));
    confetti({ particleCount: 40, spread: 30 });
  };

  // Reject / Cancel Lead
  const handleCancelLead = (leadId: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'CANCELLED' } : l));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 font-medium text-xs text-slate-700 dark:text-slate-350">
      
      {/* 1. Header Banner */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-sm relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-2xl border border-emerald-500/30">
              🏢
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-xl font-black text-white">{user.name} Portal</h1>
                {verificationStatus === 'VERIFIED' ? (
                  <span className="flex items-center gap-0.5 text-[9px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </span>
                ) : verificationStatus === 'PENDING' ? (
                  <span className="text-[9px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">
                    Pending Approval
                  </span>
                ) : (
                  <span className="text-[9px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-bold">
                    Not Verified
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Manage adventure travel packages, view traveler leads, and view revenue analytics.</p>
            </div>
          </div>

          {/* Quick tab controls */}
          <div className="flex bg-slate-950/50 p-1 rounded-2xl border border-slate-800 text-[10px] font-bold">
            {[
              { id: 'overview', label: '📊 Overview' },
              { id: 'packages', label: '⛰️ Packages' },
              { id: 'leads', label: '🎒 Leads (' + leads.filter(l => l.status === 'PENDING').length + ')' },
              { id: 'verify', label: '🛡️ Verify Document' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-1.5 px-3.5 rounded-xl transition-all cursor-pointer ${activeTab === tab.id ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Switch Tab contents */}
      <div className="min-h-[350px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-8">
              
              {/* Stat grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm card-glow">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase">Total Packages</span>
                  <strong className="block text-2xl font-black text-slate-900 dark:text-white mt-1.5">{createdPackages.length} listings</strong>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm card-glow">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase">Total Leads Received</span>
                  <strong className="block text-2xl font-black text-slate-900 dark:text-white mt-1.5">{leads.length}</strong>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm card-glow">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase">Confirmed Bookings</span>
                  <strong className="block text-2xl font-black text-emerald-500 mt-1.5">{leads.filter(l => l.status === 'CONFIRMED').length} leads</strong>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm card-glow">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase">Estimated Revenue</span>
                  <strong className="block text-2xl font-black text-emerald-500 mt-1.5">
                    ₹{leads.filter(l => l.status === 'CONFIRMED').reduce((acc, l) => acc + (createdPackages.find(p => p.trek.id === l.trek.id)?.price || 10000) * l.persons, 0).toLocaleString()}
                  </strong>
                </div>
              </div>

              {/* Warnings if unverified */}
              {verificationStatus !== 'VERIFIED' && (
                <div className="bg-amber-500/10 border border-amber-500/25 p-5 rounded-3xl flex gap-4 items-start text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <ShieldAlert className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-sm block mb-1">Company Listing Pending Verification</span>
                    <p className="leading-relaxed">To list packages on the search explorer and accept payments directly, please upload your GST certificate and Business License document. Admin verification takes approximately 24 hours.</p>
                    <button onClick={() => setActiveTab('verify')} className="text-emerald-500 font-black hover:underline mt-2 inline-flex items-center gap-0.5">Verify Document now <ChevronRight className="h-4 w-4" /></button>
                  </div>
                </div>
              )}

              {/* Chart simulation / leads list overview */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-4">Leads Performance</h3>
                <div className="h-40 flex items-end justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                  {[35, 45, 60, 20, 75, 40, 95].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-emerald-500/20 rounded-t-xl hover:bg-emerald-500 transition-colors" style={{ height: `${val}%` }} />
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Day {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 2: TREK PACKAGES LISTINGS */}
          {activeTab === 'packages' && (
            <motion.div key="packages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Active Trek Listings</h3>
                <button
                  onClick={() => setAddPackageOpen(true)}
                  className="bg-slate-900 dark:bg-emerald-500 hover:bg-emerald-650 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Add Package Listing
                </button>
              </div>

              {/* Packages List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {createdPackages.map(pkg => (
                  <div key={pkg.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between card-glow font-bold">
                    <div className="relative h-44 w-full">
                      <img src={pkg.trek.image} alt={pkg.trek.name} className="object-cover h-full w-full" />
                      <div className="absolute left-4 top-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white">
                        {pkg.trek.state}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col gap-3">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">{pkg.trek.name} Package</h4>
                      
                      <div className="flex flex-col gap-1.5 text-xs text-slate-500 font-semibold border-y border-slate-50 dark:border-slate-800/40 py-2.5">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-emerald-500" />
                          Dates: <strong className="text-slate-850 dark:text-slate-200">{pkg.dates}</strong>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="h-4 w-4 text-emerald-500" />
                          Price: <strong className="text-emerald-500">₹{pkg.price.toLocaleString()}</strong>
                        </span>
                      </div>
                      
                      <div className="flex gap-2.5 mt-2">
                        <button onClick={() => setCreatedPackages(prev => prev.filter(p => p.id !== pkg.id))} className="flex-1 border border-rose-500/30 text-rose-500 py-2 rounded-xl hover:bg-rose-500 hover:text-white transition-colors cursor-pointer text-center">Delete Listing</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: LEADS INQUIRIES */}
          {activeTab === 'leads' && (
            <motion.div key="leads" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white mb-2">Customer Booking Leads</h3>

              {leads.length > 0 ? (
                <div className="flex flex-col gap-4 font-bold text-slate-800 dark:text-slate-200">
                  {leads.map(lead => (
                    <div key={lead.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 card-glow">
                      <div>
                        <span className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 px-2 py-0.5 rounded uppercase block w-fit">
                          {lead.trek.name} Lead
                        </span>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white mt-2">{lead.name}</h4>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-1.5 gap-x-4 mt-3 text-xs text-slate-500 font-semibold">
                          <span>Phone: <strong>{lead.phone}</strong></span>
                          <span>Email: <strong>{lead.email}</strong></span>
                          <span>Group: <strong>{lead.persons} Persons</strong></span>
                          <span>Dates: <strong>{lead.dates}</strong></span>
                        </div>
                      </div>

                      <div className="flex gap-2.5 shrink-0 border-t md:border-t-0 border-slate-50 dark:border-slate-800/40 pt-4 md:pt-0 w-full md:w-auto">
                        {lead.status === 'PENDING' ? (
                          <>
                            <button onClick={() => handleConfirmLead(lead.id)} className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-xl shadow-md transition-colors cursor-pointer text-center">Confirm Booking</button>
                            <button onClick={() => handleCancelLead(lead.id)} className="flex-1 md:flex-none border border-slate-200 dark:border-slate-800 py-2 px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-center text-slate-400">Cancel</button>
                          </>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black ${lead.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'}`}>
                            {lead.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 text-xs">
                  No leads received yet. Make sure your packages are verified.
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: VERIFICATION PROCESS */}
          {activeTab === 'verify' && (
            <motion.div key="verify" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 dark:text-white mb-2">Upload Verification Documents</h3>
              <p className="text-xs text-slate-400 mb-6 font-medium">Please submit credentials to achieve IMF-Certified verification badges.</p>

              {verificationSubmitted ? (
                <div className="text-center py-12 flex flex-col items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 text-2xl">⏳</div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">Documents Awaiting Admin Approval</h4>
                  <p className="text-xs text-slate-400 max-w-sm leading-relaxed">Your Business registration license and GST records have been uploaded. Administrators will audit details shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleVerifySubmit} className="flex flex-col gap-4 font-bold text-slate-850 dark:text-slate-300">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">GST Registration Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 05AAAAA1111A1Z1"
                      value={gstNumber}
                      onChange={e => setGstNumber(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">Business License Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. LIC/UK/2026/0991"
                      value={licenseNumber}
                      onChange={e => setLicenseNumber(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">Upload Certificate Document File URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/file/..."
                      value={docFileUrl}
                      onChange={e => setDocFileUrl(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-premium text-white py-3.5 rounded-2xl text-xs shadow-md transition-colors cursor-pointer mt-2"
                  >
                    Submit Verification Documents
                  </button>
                </form>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* 3. ADD PACKAGE MODAL DIALOG */}
      <AnimatePresence>
        {addPackageOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm font-bold">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl shadow-2xl relative"
            >
              <button onClick={() => setAddPackageOpen(false)} className="absolute right-4 top-4 p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-base font-extrabold text-slate-955 dark:text-white mb-4">Add Trek Package Listing</h3>
              
              <form onSubmit={handleAddPackage} className="flex flex-col gap-4 text-slate-855 dark:text-slate-300">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">Select Trek Destination</label>
                  <select
                    value={selectedTrekId}
                    onChange={e => setSelectedTrekId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:outline-none"
                  >
                    {treks.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.state})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">Package Price (INR per head)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 12500"
                    value={newPackagePrice}
                    onChange={e => setNewPackagePrice(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">Expedition Dates / Batch details</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026-06-15 to 2026-06-22"
                    value={newPackageDates}
                    onChange={e => setNewPackageDates(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-premium text-white py-3.5 rounded-2xl text-xs shadow-md transition-colors cursor-pointer mt-2"
                >
                  Create Listing Package
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
