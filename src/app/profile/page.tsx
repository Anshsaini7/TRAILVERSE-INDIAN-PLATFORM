'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { treks } from '../../data/mockData';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, MapPin, Heart, Compass, Check, X, Camera, Grid, Bookmark, 
  Settings, Users, Edit3, ShieldCheck, Mail, Phone, Calendar 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TravelerProfilePage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  // Redirect to Auth if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('🏕️');

  // Popup lists
  const [showFollowers, setShowFollowers] = useState(false);
  const [selectedCert, setSelectedCert] = useState<any>(null);

  // Sync edits on load
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        setEditName(user.name || '');
        setEditUsername(user.username || '');
        setEditCity(user.city || '');
        setEditBio(user.bio || '');
        setEditAvatar(user.profile_image || '🏕️');
      }, 0);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Compass className="h-10 w-10 animate-spin text-emerald-500 mb-4" />
        <h2 className="text-sm font-bold text-slate-400">Loading profile data...</h2>
      </div>
    );
  }

  // Completed treks mapping
  const completedTrekObjects = treks.filter(t => 
    user.completed_treks?.includes(t.id) || ['roopkund', 'kedarkantha'].includes(t.id)
  );

  // Mock post gallery (Instagram style)
  const postsGallery = [
    { id: 'post-1', url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80', likes: 142, comments: 24, caption: 'Sunrise over Bedni Bugyal! Breathtaking view.' },
    { id: 'post-2', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80', likes: 98, comments: 12, caption: 'At Kedarkantha base camp under freezing temperature.' },
    { id: 'post-3', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80', likes: 210, comments: 45, caption: 'Setting up alpine dome tents before summit push.' },
    { id: 'post-4', url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=600&q=80', likes: 165, comments: 18, caption: 'Roopkund lake frozen skeleton views.' },
    { id: 'post-5', url: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=600&q=80', likes: 112, comments: 9, caption: 'Paragliding high over Solang Valley!' },
    { id: 'post-6', url: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=600&q=80', likes: 230, comments: 38, caption: 'Walking across Chadar frozen Zanskar river.' }
  ];

  // Save changes handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: editName,
      username: editUsername,
      city: editCity,
      bio: editBio,
      profile_image: editAvatar
    });
    setIsEditing(false);
    confetti({ particleCount: 50, spread: 40 });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 font-medium text-xs text-slate-700 dark:text-slate-300">
      
      {/* 1. INSTAGRAM PROFILE HEADER */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start relative card-glow">
        
        {/* Profile Avatar / Photo */}
        <div className="relative group shrink-0">
          <div className="h-28 w-28 rounded-full bg-emerald-500/10 border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center text-5xl shadow-md select-none">
            {editAvatar}
          </div>
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900 cursor-pointer"
            aria-label="Edit Profile Avatar"
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>

        {/* Profile stats & Bio */}
        <div className="flex-1 flex flex-col gap-4 text-center md:text-left w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
                {user.name}
                {user.role === 'ADMIN' && <ShieldCheck className="h-5 w-5 text-emerald-500" />}
              </h1>
              <span className="text-slate-450 font-bold block text-xs mt-0.5">@{user.username || 'traveler_explorer'}</span>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white px-4.5 py-2 rounded-xl font-bold transition-all cursor-pointer"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Social Stats count strip */}
          <div className="flex justify-center md:justify-start gap-8 border-y border-slate-100 dark:border-slate-800/60 py-3 text-center">
            <div>
              <span className="text-slate-900 dark:text-white font-black text-base block">{postsGallery.length}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Posts</span>
            </div>
            <button onClick={() => setShowFollowers(true)} className="hover:text-emerald-500 transition-colors cursor-pointer">
              <span className="text-slate-900 dark:text-white font-black text-base block">1.2k</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Followers</span>
            </button>
            <div>
              <span className="text-slate-900 dark:text-white font-black text-base block">342</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Following</span>
            </div>
          </div>

          {/* Bio details */}
          <div className="flex flex-col gap-1 text-slate-500 dark:text-slate-400">
            {user.city && (
              <span className="flex items-center justify-center md:justify-start gap-1 font-bold text-xs">
                <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                {user.city}
              </span>
            )}
            <p className="leading-relaxed mt-2 text-xs font-semibold">
              {user.bio || 'Bio not written yet. Add details about your outdoor trail experience.'}
            </p>
          </div>
        </div>
      </section>

      {/* 2. PHOTO GALLERY GRID / CERTIFICATES ACCORDION */}
      <div className="mt-10 flex flex-col gap-6">
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Grid className="h-5 w-5 text-emerald-500" />
            Adventure Grid
          </h2>
          <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase">
            Completed: {completedTrekObjects.length} treks
          </span>
        </div>

        {/* Instagram Grid of Shared images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {postsGallery.map((post) => (
            <div 
              key={post.id} 
              className="group relative h-56 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer card-glow"
            >
              <img src={post.url} alt="" className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-500" />
              
              {/* Overlay likes count on hover */}
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-extrabold">
                <span className="flex items-center gap-1 text-sm">
                  <Heart className="h-5 w-5 fill-rose-500 text-rose-500 animate-pulse" />
                  {post.likes}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. VERIFIED SUMMIT CERTIFICATES */}
      <div className="mt-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          Verified Summit Certificates ({completedTrekObjects.length})
        </h3>
        <p className="text-xs text-slate-400 mb-6 font-medium">Click on any certificate to view/download the official summit record.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-bold text-slate-800 dark:text-slate-200">
          {completedTrekObjects.map(trek => (
            <button
              key={trek.id}
              onClick={() => {
                setSelectedCert({
                  trek,
                  completionDate: '2026-01-20',
                  maxAltitude: trek.altitude,
                  leader: 'Arjun Majumdar'
                });
                confetti({ particleCount: 80, spread: 50 });
              }}
              className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:border-amber-400 text-left transition-colors cursor-pointer"
            >
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-black truncate">{trek.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{trek.altitude}m elevation &bull; verified</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. EDIT PROFILE DRAWER MODAL */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl shadow-2xl relative"
            >
              <button 
                onClick={() => setIsEditing(false)}
                className="absolute right-4 top-4 p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-base font-extrabold text-slate-950 dark:text-white mb-4">Edit Profile Settings</h3>
              
              <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 font-bold">
                {/* Avatar selection strip */}
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-2">Select Avatar Emoji</label>
                  <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-2xl">
                    {['🏕️', '🧗', '⛰️', '🧭', '🌲', '🦊', '🏂'].map((emoji) => (
                      <button
                        type="button"
                        key={emoji}
                        onClick={() => setEditAvatar(emoji)}
                        className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${editAvatar === emoji ? 'bg-emerald-500/20 border-2 border-emerald-500 scale-110 shadow-sm' : 'hover:scale-105'}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={editUsername}
                    onChange={e => setEditUsername(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">Current City</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={e => setEditCity(e.target.value)}
                    placeholder="e.g. Dehradun"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">Biography / Bio</label>
                  <textarea
                    rows={3}
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                    placeholder="Tell other travelers about your climbing/hiking experiences..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-premium text-white font-bold py-3.5 rounded-2xl text-xs shadow-md transition-colors cursor-pointer mt-2"
                >
                  Save Profile Settings
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. FOLLOWERS LIST DIALOG POPUP */}
      <AnimatePresence>
        {showFollowers && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl shadow-2xl relative"
            >
              <button 
                onClick={() => setShowFollowers(false)}
                className="absolute right-4 top-4 p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-base font-extrabold text-slate-950 dark:text-white mb-4">Followers List</h3>
              
              <div className="flex flex-col gap-4 font-bold max-h-80 overflow-y-auto">
                {[
                  { name: 'Ananya Roy', username: 'ananya_expeditions', avatar: '🧗' },
                  { name: 'Kabir Mehta', username: 'k_mehta', avatar: '🏕️' },
                  { name: 'Swathi Chatrapathy', username: 'swathi_leader', avatar: '🦊' }
                ].map((f, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg">{f.avatar}</div>
                      <div>
                        <span className="text-slate-900 dark:text-white block">{f.name}</span>
                        <span className="text-[10px] text-slate-400 block font-semibold">@{f.username}</span>
                      </div>
                    </div>
                    <button className="bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-xl hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer">Follow</button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. SUMMIT CERTIFICATE MODAL */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm font-semibold">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-8 relative flex flex-col gap-6"
            >
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute right-6 top-6 p-1 rounded-lg text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="border-4 border-double border-amber-500/30 p-8 rounded-2xl text-center relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-350">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none scale-150">
                  <Compass className="h-40 w-40 stroke-[1]" />
                </div>

                <div className="flex justify-center mb-4 text-amber-500">
                  <Award className="h-16 w-16 stroke-[1.5]" />
                </div>
                
                <span className="text-[10px] font-bold text-amber-500 tracking-widest block mb-2">TRAILVERSE INDIA OFFICIAL SUMMIT RECORD</span>
                <h2 className="text-xl font-serif font-black text-slate-900 dark:text-white leading-tight">Certificate of Achievement</h2>
                
                <p className="text-xs italic text-slate-400 mt-6 mb-4">This document certifies that</p>
                <strong className="text-lg font-bold text-slate-950 dark:text-white underline decoration-emerald-500 decoration-2 underline-offset-4">{user.name}</strong>
                
                <p className="text-xs text-slate-500 mt-6 leading-relaxed max-w-sm mx-auto">
                  has successfully summited the high-altitude pass of <strong className="font-extrabold text-slate-850 dark:text-slate-200">{selectedCert.trek.name}</strong>, crossing an elevation of <strong className="text-emerald-500 font-black">{selectedCert.maxAltitude} meters</strong> above sea level on <strong className="font-extrabold text-slate-850 dark:text-slate-200">{selectedCert.completionDate}</strong>.
                </p>

                <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-850 flex justify-between items-center text-[10px] text-slate-450">
                  <div>
                    <span className="font-serif italic text-slate-800 dark:text-slate-300 font-bold block mb-1">Abhinav</span>
                    <span>SUMMITEER RECORD</span>
                  </div>
                  <div>
                    <span className="font-serif italic text-slate-800 dark:text-slate-300 font-bold block mb-1">{selectedCert.leader}</span>
                    <span>EXPEDITION LEADER</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCert(null)}
                className="w-full bg-gradient-premium hover:bg-emerald-600 text-white font-bold py-3.5 rounded-2xl text-xs shadow-md transition-colors"
              >
                Close Certificate
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
