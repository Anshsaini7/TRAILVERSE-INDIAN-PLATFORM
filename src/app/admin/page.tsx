'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { treks as initialTreks, Trek } from '../../data/mockData';
import { 
  ShieldCheck, Plus, Trash2, Search, Building2, User, Activity, 
  CheckCircle, AlertTriangle, Compass, Check, X, BarChart2, Star, 
  Lock, Unlock, MessageSquare, ShieldAlert 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function AdminDashboard() {
  const [treks, setTreks] = useState<Trek[]>(initialTreks);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Tab states: 'treks' | 'users' | 'documents' | 'reviews' | 'analytics' | 'inquiries'
  const [activeTab, setActiveTab] = useState<'treks' | 'users' | 'documents' | 'reviews' | 'analytics' | 'inquiries'>('treks');
  const [supportTickets, setSupportTickets] = useState<any[]>([]);

  // User Accounts State
  const [usersList, setUsersList] = useState([
    { id: 'u-1', name: 'Abhinav Sharma', email: 'abhinav@gmail.com', role: 'USER', username: 'abhinav_conquers', suspended: false, joined: '2026-01-10' },
    { id: 'u-2', name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', role: 'USER', username: 'rahul_trek', suspended: false, joined: '2026-03-15' },
    { id: 'u-3', name: 'Bikat Adventures Guide', email: 'bikat@gmail.com', role: 'GUIDE', username: 'bikat_guide', suspended: false, joined: '2026-04-20' },
    { id: 'u-4', name: 'Spam Bot', email: 'spammer99@spam.com', role: 'USER', username: 'spammer_99', suspended: true, joined: '2026-06-01' }
  ]);
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Load custom users and support tickets from localStorage on client-side mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load registered users
    try {
      const storedUsers = localStorage.getItem('tv_registered_users');
      if (storedUsers) {
        const registeredUsers = JSON.parse(storedUsers);
        const customUsers = Object.keys(registeredUsers).map((email, idx) => {
          const u = registeredUsers[email];
          return {
            id: u.id || `u-custom-${idx}`,
            name: u.name,
            email: u.email,
            role: u.role || 'USER',
            username: u.username || email.split('@')[0],
            suspended: false,
            joined: new Date().toLocaleDateString()
          };
        });
        
        // Merge without duplicates
        setUsersList(prev => {
          const existingEmails = prev.map(u => u.email);
          const filteredCustom = customUsers.filter(u => !existingEmails.includes(u.email));
          return [...prev, ...filteredCustom];
        });
      }
    } catch (e) {
      console.error(e);
    }

    // Load support tickets
    try {
      const storedTickets = localStorage.getItem('tv_support_tickets');
      if (storedTickets) {
        setSupportTickets(JSON.parse(storedTickets));
      } else {
        // Seed default tickets if empty
        const defaultTickets = [
          { id: 'tkt-9012', name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', subject: 'Booking Help', message: 'I want to book Hampta Pass but my payment page is reloading. Can you guide me?', date: '2026-07-21', status: 'OPEN' },
          { id: 'tkt-9013', name: 'Bikat Adventures Guide', email: 'bikat@gmail.com', subject: 'Operator Partnership', message: 'Hello Admin, we uploaded our new Roopkund winter package, please verify our documents.', date: '2026-07-22', status: 'OPEN' }
        ];
        localStorage.setItem('tv_support_tickets', JSON.stringify(defaultTickets));
        setSupportTickets(defaultTickets);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Modal forms states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTrek, setNewTrek] = useState({
    name: '',
    state: 'Uttarakhand',
    difficulty: 'Moderate' as any,
    altitude: 3000,
    distance: 15,
    duration: 4,
    baseCamp: '',
    startingPrice: 8500
  });

  // Operators List
  const [operators, setOperators] = useState([
    { id: 'indiahikes', name: 'IndiaHikes', verified: true, rating: 4.9, bookings: 420, contact: '+91 9876543210' },
    { id: 'thrillophilia', name: 'Thrillophilia', verified: true, rating: 4.7, bookings: 880, contact: '+91 8765432109' },
    { id: 'bikat-adventures', name: 'Bikat Adventures', verified: true, rating: 4.8, bookings: 310, contact: '+91 7654321098' },
    { id: 'himalayan-cabs', name: 'Himalayan Local Operators', verified: false, rating: 4.2, bookings: 45, contact: '+91 6543210987' }
  ]);

  // Verification documents State
  const [docQueue, setDocQueue] = useState([
    { id: 'doc-1', companyName: 'Bikat Adventures', type: 'GST Certificate', value: '05AAAAA1111A1Z1', file: 'gst_bikat.pdf', status: 'PENDING' },
    { id: 'doc-2', companyName: 'Himalayan Local Operators', type: 'Business License', value: 'LIC/HP/2026/0881', file: 'license_himalayan.pdf', status: 'PENDING' },
    { id: 'doc-3', companyName: 'IndiaHikes', type: 'GST Certificate', value: '05BBBBB2222B2Z2', file: 'gst_indiahikes.pdf', status: 'APPROVED' }
  ]);

  // Review moderation list
  const [moderationReviews, setModerationReviews] = useState([
    { id: 'rev-1', user: 'Spam Bot', rating: 1, comment: '🚨 CLICK HERE TO BUY BITCOIN ON WWW.SPAM-SITE.COM !!! CHEAP OFFERS 🚨', trekName: 'Roopkund Trek', date: '2026-06-05' },
    { id: 'rev-2', user: 'Rahul Sharma', rating: 5, comment: 'Juda ka Talab freezing was a visual I will never forget. Climbing the peak was surreal!', trekName: 'Kedarkantha Trek', date: '2026-05-12' },
    { id: 'rev-3', user: 'Ananya Roy', rating: 4, comment: 'Very physically demanding. Make sure you do your cardio preparation seriously.', trekName: 'Roopkund Trek', date: '2026-05-15' }
  ]);

  // Statistics calculation
  const stats = useMemo(() => {
    const totalTreks = treks.length;
    const verifiedOps = operators.filter(o => o.verified).length;
    const avgPrice = Math.round(treks.reduce((acc, t) => acc + t.startingPrice, 0) / totalTreks);
    const avgDuration = (treks.reduce((acc, t) => acc + t.duration, 0) / totalTreks).toFixed(1);
    
    return {
      totalTreks,
      verifiedOps,
      avgPrice,
      avgDuration
    };
  }, [treks, operators]);

  // Filtered Treks list
  const filteredTreks = useMemo(() => {
    return treks.filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.state.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [treks, searchTerm]);

  // Filtered Users list
  const filteredUsers = useMemo(() => {
    return usersList.filter(u => 
      u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearchTerm.toLowerCase())
    );
  }, [usersList, userSearchTerm]);

  // Handle Delete Trek
  const handleDeleteTrek = (id: string) => {
    if (confirm("Are you sure you want to delete this trek?")) {
      setTreks(prev => prev.filter(t => t.id !== id));
      confetti({ particleCount: 30, spread: 20 });
    }
  };

  // Handle Add Trek
  const handleAddTrekSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockNewTrek: Trek = {
      id: newTrek.name.toLowerCase().replace(/\s+/g, '-'),
      name: newTrek.name,
      state: newTrek.state,
      difficulty: newTrek.difficulty,
      altitude: Number(newTrek.altitude),
      distance: Number(newTrek.distance),
      duration: Number(newTrek.duration),
      bestSeason: 'Spring / Autumn',
      bestTime: 'May to October',
      tempRange: '10°C to 20°C',
      baseCamp: newTrek.baseCamp || 'Local Base',
      baseCampDetails: 'A high altitude staging village with local homestays.',
      rating: 4.5,
      startingPrice: Number(newTrek.startingPrice),
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'],
      overview: 'A newly updated high altitude Himalayan route for trekking explorers.',
      coordinates: { lat: 30.5, lon: 78.5 },
      route: [newTrek.baseCamp || 'Base Camp', 'Mid Camp', 'Summit Peak'],
      routeCoordinates: [{ lat: 30.5, lon: 78.5 }],
      elevationProfile: [
        { distance: 0, elevation: 1500, label: 'Base' },
        { distance: newTrek.distance, elevation: newTrek.altitude, label: 'Summit' }
      ],
      familyFriendly: true,
      soloFriendly: true,
      snowTrek: false,
      oxygenLevel: '80% at Summit',
      fitnessRequirement: 'Good cardiovascular strength and stamina.',
      baseCampsCount: 2,
      accommodation: 'Tents / Local Guesthouses',
      transportation: 'Taxis from transit hubs',
      nearestRailway: 'Haridwar / Dehradun',
      nearestAirport: 'Jolly Grant Airport',
      nearestBusStand: 'Local Stand',
      medicalFacilities: 'First aid kits with guides; local hospital 30km away',
      emergencyContacts: ['Rescue Team: 108'],
      faqs: [],
      packingChecklist: [],
      weatherForecast: [],
      companyId: 'thrillophilia',
      reviews: []
    };

    setTreks(prev => [mockNewTrek, ...prev]);
    setShowAddModal(false);
    setNewTrek({
      name: '',
      state: 'Uttarakhand',
      difficulty: 'Moderate',
      altitude: 3000,
      distance: 15,
      duration: 4,
      baseCamp: '',
      startingPrice: 8500
    });
    confetti({ particleCount: 80, spread: 50 });
  };

  // Toggle Operator verification status
  const toggleOperatorVerify = (id: string) => {
    setOperators(prev => prev.map(op => {
      if (op.id === id) {
        return { ...op, verified: !op.verified };
      }
      return op;
    }));
    confetti({ particleCount: 40, spread: 25 });
  };

  // Toggle User suspension
  const handleToggleSuspendUser = (userId: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, suspended: !u.suspended };
      }
      return u;
    }));
    confetti({ particleCount: 30, spread: 20 });
  };

  // Delete user account
  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to permanently delete this user account?")) {
      setUsersList(prev => prev.filter(u => u.id !== userId));
      confetti({ particleCount: 30, spread: 20 });
    }
  };

  // Verify / Approve document
  const handleApproveDoc = (docId: string, companyName: string) => {
    setDocQueue(prev => prev.map(d => d.id === docId ? { ...d, status: 'APPROVED' } : d));
    // Verify target operator company
    setOperators(prev => prev.map(op => op.name === companyName ? { ...op, verified: true } : op));
    confetti({ particleCount: 80, spread: 50 });
  };

  // Reject Verification document
  const handleRejectDoc = (docId: string) => {
    setDocQueue(prev => prev.map(d => d.id === docId ? { ...d, status: 'REJECTED' } : d));
  };

  // Delete review
  const handleDeleteReview = (revId: string) => {
    if (confirm("Are you sure you want to remove this review post from trail listing?")) {
      setModerationReviews(prev => prev.filter(r => r.id !== revId));
      confetti({ particleCount: 30, spread: 20 });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8 text-xs font-semibold text-slate-700 dark:text-slate-350">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500 font-extrabold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Administration Center
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1" style={{ fontFamily: 'var(--font-display)' }}>
            Ecosystem Admin Portal
          </h1>
          <p className="text-xs text-slate-550 mt-1 font-medium">Manage database treks, suspend accounts, verify documents, and moderate user content reviews.</p>
        </div>

        {/* Add Trek Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-premium hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add New Trek</span>
        </button>
      </div>

      {/* Analytics stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Treks in Database', val: stats.totalTreks, desc: 'Active routes', icon: Compass, color: 'text-emerald-500 bg-emerald-500/10' },
          { label: 'Active User Accounts', val: usersList.length, desc: 'Registered hikers', icon: User, color: 'text-purple-500 bg-purple-500/10' },
          { label: 'Open Inquiries', val: supportTickets.filter(t => t.status === 'OPEN').length, desc: 'Support tickets', icon: ShieldAlert, color: 'text-amber-500 bg-amber-500/10' },
          { label: 'Verified Agencies', val: stats.verifiedOps, desc: 'Safety certified', icon: Building2, color: 'text-cyan-500 bg-cyan-500/10' }
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4 card-glow">
              <div className={`p-3 rounded-2xl ${item.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">{item.label}</span>
                <strong className="text-xl font-black text-slate-955 dark:text-white mt-0.5 block">{item.val}</strong>
                <span className="text-[9px] text-slate-400 font-medium block mt-0.5">{item.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-bold overflow-x-auto whitespace-nowrap scrollbar-none pb-0.5">
        {[
          { key: 'treks', label: 'Trek Inventory' },
          { key: 'users', label: 'User Accounts' },
          { key: 'inquiries', label: 'User Tickets / Needs' },
          { key: 'documents', label: 'Verification Queue' },
          { key: 'reviews', label: 'Content Moderation' },
          { key: 'analytics', label: 'Platform Metrics' }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`pb-3 border-b-2 px-1 transition-all cursor-pointer ${
              activeTab === t.key
                ? 'border-emerald-500 text-emerald-500 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Panels Display */}
      <div className="min-h-[400px]">
        
        {/* TAB 1: Treks Inventory Grid */}
        {activeTab === 'treks' && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            {/* Search Input filter */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by trek name or state..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* Treks Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm card-glow">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 font-black text-slate-405 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850">
                  <tr>
                    <th className="py-3.5 px-6">Trek Profile</th>
                    <th className="py-3.5 px-4">State</th>
                    <th className="py-3.5 px-4">Difficulty</th>
                    <th className="py-3.5 px-4 text-right">Altitude</th>
                    <th className="py-3.5 px-4 text-right">Distance</th>
                    <th className="py-3.5 px-4 text-right">Duration</th>
                    <th className="py-3.5 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850/80 font-bold text-slate-750 dark:text-slate-300">
                  {filteredTreks.slice(0, 15).map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <img src={t.image} alt={t.name} className="h-10 w-10 object-cover rounded-lg" />
                        <div>
                          <strong className="text-slate-900 dark:text-white text-xs">{t.name}</strong>
                          <span className="text-[9px] text-slate-400 block font-bold mt-0.5">₹{t.startingPrice.toLocaleString()} base price</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold">{t.state}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${
                          t.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500' :
                          t.difficulty.includes('Moderate') ? 'bg-amber-500/10 text-amber-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {t.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">{t.altitude}m</td>
                      <td className="py-4 px-4 text-right">{t.distance} km</td>
                      <td className="py-4 px-4 text-right">{t.duration} Days</td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleDeleteTrek(t.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-805 transition-colors cursor-pointer"
                          title="Delete trek route"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: User Accounts */}
        {activeTab === 'users' && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search user by name, email, or role..."
                value={userSearchTerm}
                onChange={e => setUserSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm card-glow">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 font-black text-slate-405 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850">
                  <tr>
                    <th className="py-3.5 px-6">Name</th>
                    <th className="py-3.5 px-4">Username</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4 text-center">Suspended</th>
                    <th className="py-3.5 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850/80 font-bold text-slate-750 dark:text-slate-300">
                  {filteredUsers.map(usr => (
                    <tr key={usr.id}>
                      <td className="py-4 px-6">
                        <strong className="text-slate-900 dark:text-white">{usr.name}</strong>
                        <span className="text-[9px] text-slate-400 block font-bold mt-0.5">Joined: {usr.joined}</span>
                      </td>
                      <td className="py-4 px-4 font-semibold">@{usr.username}</td>
                      <td className="py-4 px-4 font-semibold">{usr.email}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold ${usr.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-500' : usr.role === 'GUIDE' ? 'bg-cyan-500/10 text-cyan-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                          {usr.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {usr.suspended ? (
                          <span className="text-[9px] bg-red-500/15 text-red-500 px-2 py-0.5 rounded border border-red-500/15">Yes</span>
                        ) : (
                          <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-400 px-2 py-0.5 rounded">No</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleToggleSuspendUser(usr.id)}
                            className={`p-1.5 rounded-lg hover:bg-slate-105 transition-colors cursor-pointer ${usr.suspended ? 'text-emerald-500' : 'text-amber-500'}`}
                            title={usr.suspended ? 'Unsuspend account' : 'Suspend account'}
                          >
                            {usr.suspended ? <Unlock className="h-4.5 w-4.5" /> : <Lock className="h-4.5 w-4.5" />}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(usr.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-105 transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Verification Queue */}
        {activeTab === 'documents' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden card-glow animate-fadeIn">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-950 font-black text-slate-405 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850">
                <tr>
                  <th className="py-3.5 px-6">Company Name</th>
                  <th className="py-3.5 px-4">Credential Type</th>
                  <th className="py-3.5 px-4">Document Value</th>
                  <th className="py-3.5 px-4">Attached File</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850/80 font-bold text-slate-750 dark:text-slate-300">
                {docQueue.map(doc => (
                  <tr key={doc.id}>
                    <td className="py-4 px-6">
                      <strong className="text-slate-900 dark:text-white">{doc.companyName}</strong>
                    </td>
                    <td className="py-4 px-4 font-semibold">{doc.type}</td>
                    <td className="py-4 px-4 font-mono font-bold">{doc.value}</td>
                    <td className="py-4 px-4 font-semibold text-emerald-500 hover:underline cursor-pointer">{doc.file}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold ${
                        doc.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/15' :
                        doc.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-600 border border-rose-500/15' :
                        'bg-amber-500/10 text-amber-600 border border-amber-500/15'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {doc.status === 'PENDING' ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleApproveDoc(doc.id, doc.companyName)}
                            className="bg-emerald-500 text-white font-bold py-1 px-3 rounded-lg text-[10px] shadow-sm hover:bg-emerald-600 transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectDoc(doc.id)}
                            className="border border-slate-200 dark:border-slate-800 py-1 px-3 rounded-lg text-[10px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Processed ✓</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: Content Moderation reviews */}
        {activeTab === 'reviews' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden card-glow animate-fadeIn">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-950 font-black text-slate-405 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850">
                <tr>
                  <th className="py-3.5 px-6">User / Date</th>
                  <th className="py-3.5 px-4">Trek</th>
                  <th className="py-3.5 px-4">Comment Review</th>
                  <th className="py-3.5 px-4 text-center">Rating</th>
                  <th className="py-3.5 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850/80 font-bold text-slate-750 dark:text-slate-300">
                {moderationReviews.map(rev => (
                  <tr key={rev.id}>
                    <td className="py-4 px-6">
                      <strong className="text-slate-900 dark:text-white block">{rev.user}</strong>
                      <span className="text-[9px] text-slate-450 block font-bold mt-0.5">{rev.date}</span>
                    </td>
                    <td className="py-4 px-4 font-semibold">{rev.trekName}</td>
                    <td className="py-4 px-4 font-medium text-slate-550 dark:text-slate-400 max-w-xs truncate" title={rev.comment}>
                      {rev.comment}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star className="h-3.5 w-3.5 fill-amber-500" />
                        {rev.rating}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="p-1.5 text-slate-405 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Delete Review"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: Platform Metrics Charts */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-bold animate-fadeIn">
            
            {/* Bookings by State (Pure CSS Bar Chart) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-4 card-glow">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Bookings Distribution by State</h3>
              
              <div className="space-y-4 text-[10px] text-slate-500">
                {[
                  { state: 'Uttarakhand', bookings: 540, percent: '85%', color: 'bg-emerald-500' },
                  { state: 'Himachal Pradesh', bookings: 430, percent: '68%', color: 'bg-cyan-500' },
                  { state: 'Jammu & Kashmir', bookings: 210, percent: '33%', color: 'bg-blue-500' },
                  { state: 'Ladakh', bookings: 180, percent: '28%', color: 'bg-purple-500' },
                  { state: 'Sikkim', bookings: 95, percent: '15%', color: 'bg-pink-500' }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-1">
                      <span>{item.state.toUpperCase()}</span>
                      <span className="text-slate-800 dark:text-slate-200">{item.bookings} bookings</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: item.percent }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Activities Chart */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-4 card-glow">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Buddy Requests Category</h3>
              
              <div className="space-y-4 text-[10px] text-slate-500">
                {[
                  { cat: 'High Altitude Trekking', count: 18, percent: '90%', color: 'bg-emerald-500' },
                  { cat: 'Wilderness Camping', count: 8, percent: '40%', color: 'bg-amber-500' },
                  { cat: 'Alpine Skiing', count: 5, percent: '25%', color: 'bg-blue-500' },
                  { cat: 'River Rafting', count: 3, percent: '15%', color: 'bg-cyan-500' }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-1">
                      <span>{item.cat.toUpperCase()}</span>
                      <span className="text-slate-800 dark:text-slate-200">{item.count} groups</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-855 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: item.percent }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 6: User inquiries / Support Tickets */}
        {activeTab === 'inquiries' && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Active User Tickets & Needs</h3>
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm card-glow">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 font-black text-slate-405 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850">
                  <tr>
                    <th className="py-3.5 px-6">User</th>
                    <th className="py-3.5 px-4">Subject</th>
                    <th className="py-3.5 px-4">Message</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850/80 font-bold text-slate-750 dark:text-slate-300">
                  {supportTickets.length > 0 ? (
                    supportTickets.map((tkt) => (
                      <tr key={tkt.id}>
                        <td className="py-4 px-6 shrink-0">
                          <strong className="text-slate-900 dark:text-white block">{tkt.name}</strong>
                          <span className="text-[10px] text-slate-400 font-semibold">{tkt.email}</span>
                          <span className="text-[9px] text-slate-455 block font-semibold mt-0.5">{tkt.date}</span>
                        </td>
                        <td className="py-4 px-4 font-extrabold text-emerald-500">{tkt.subject}</td>
                        <td className="py-4 px-4 max-w-sm">
                          <p className="text-[11px] text-slate-650 dark:text-slate-400 font-semibold leading-relaxed break-words">{tkt.message}</p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            tkt.status === 'OPEN'
                              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/15'
                              : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/15'
                          }`}>
                            {tkt.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {tkt.status === 'OPEN' && (
                              <button
                                onClick={() => {
                                  const updated = supportTickets.map(x => x.id === tkt.id ? { ...x, status: 'RESOLVED' } : x);
                                  setSupportTickets(updated);
                                  localStorage.setItem('tv_support_tickets', JSON.stringify(updated));
                                  confetti({ particleCount: 30, spread: 20 });
                                }}
                                className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500/25 p-1 rounded-lg transition-colors cursor-pointer"
                                title="Mark as Resolved"
                              >
                                <Check className="h-4 w-4 stroke-[3]" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (confirm("Delete this support ticket?")) {
                                  const updated = supportTickets.filter(x => x.id !== tkt.id);
                                  setSupportTickets(updated);
                                  localStorage.setItem('tv_support_tickets', JSON.stringify(updated));
                                }
                              }}
                              className="bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/25 p-1 rounded-lg transition-colors cursor-pointer"
                              title="Delete Ticket"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400">
                        No support tickets found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ADD TREK MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-sm p-4 font-bold">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-md w-full flex flex-col gap-5 text-xs"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="h-4.5 w-4.5 text-emerald-500" />
                  Add Trek Route
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddTrekSubmit} className="flex flex-col gap-4 text-slate-800 dark:text-slate-350">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase block mb-1">Trek Name</label>
                  <input
                    type="text"
                    required
                    value={newTrek.name}
                    onChange={e => setNewTrek(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Stok Kangri"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase block mb-1">State</label>
                    <select
                      value={newTrek.state}
                      onChange={e => setNewTrek(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:outline-none font-bold cursor-pointer"
                    >
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="Himachal Pradesh">Himachal Pradesh</option>
                      <option value="Jammu & Kashmir">Jammu &amp; Kashmir</option>
                      <option value="Ladakh">Ladakh</option>
                      <option value="Sikkim">Sikkim</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Meghalaya">Meghalaya</option>
                      <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase block mb-1">Difficulty</label>
                    <select
                      value={newTrek.difficulty}
                      onChange={e => setNewTrek(prev => ({ ...prev, difficulty: e.target.value as any }))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:outline-none font-bold cursor-pointer"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Easy-Moderate">Easy-Moderate</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Moderate-Hard">Moderate-Hard</option>
                      <option value="Hard">Hard</option>
                      <option value="Extreme">Extreme</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase block mb-1">Altitude (meters)</label>
                    <input
                      type="number"
                      required
                      value={newTrek.altitude}
                      onChange={e => setNewTrek(prev => ({ ...prev, altitude: Number(e.target.value) }))}
                      className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase block mb-1">Distance (km)</label>
                    <input
                      type="number"
                      required
                      value={newTrek.distance}
                      onChange={e => setNewTrek(prev => ({ ...prev, distance: Number(e.target.value) }))}
                      className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase block mb-1">Duration (days)</label>
                    <input
                      type="number"
                      required
                      value={newTrek.duration}
                      onChange={e => setNewTrek(prev => ({ ...prev, duration: Number(e.target.value) }))}
                      className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase block mb-1">Base Price (INR)</label>
                    <input
                      type="number"
                      required
                      value={newTrek.startingPrice}
                      onChange={e => setNewTrek(prev => ({ ...prev, startingPrice: Number(e.target.value) }))}
                      className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase block mb-1">Base Camp Town</label>
                  <input
                    type="text"
                    required
                    value={newTrek.baseCamp}
                    onChange={e => setNewTrek(prev => ({ ...prev, baseCamp: e.target.value }))}
                    placeholder="e.g. Chilling"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:outline-none font-semibold"
                  />
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 px-4 text-center rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-premium text-white font-bold py-2.5 px-4 rounded-xl shadow-md text-center cursor-pointer"
                  >
                    Save Trek
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
