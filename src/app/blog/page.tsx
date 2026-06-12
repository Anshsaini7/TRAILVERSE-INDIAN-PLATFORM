'use client';

import React, { useState, useMemo } from 'react';
import { blogPosts } from '../../data/mockData';
import { Calendar, User, Clock, ArrowRight, BookOpen, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BlogHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter posts
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      if (selectedCategory !== 'All' && post.category !== selectedCategory) return false;
      if (searchTerm && !post.title.toLowerCase().includes(searchTerm.toLowerCase()) && !post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [searchTerm, selectedCategory]);

  const categories = ['All', 'Gear Guide', 'Eco Travel'];

  // Identify featured post
  const featuredPost = blogPosts[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-200 dark:border-slate-850 pb-6">
        <div>
          <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-wider block">TRAILVERSE BLOG</span>
          <h1 className="text-3xl font-black text-slate-905 dark:text-white mt-1">Adventure Journal</h1>
          <p className="text-xs text-slate-500 mt-1">Himalayan technical gear reviews, mountain adaptation plans, and eco-sustainable guides.</p>
        </div>

        {/* Filter bar and search */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl text-xs font-bold shadow-sm">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white dark:bg-emerald-500 shadow-sm'
                    : 'text-slate-650 dark:text-slate-400 hover:text-emerald-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search journals..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Featured Article (Hero Layout) */}
      {selectedCategory === 'All' && !searchTerm && featuredPost && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8 card-glow mb-12"
        >
          <div className="relative h-64 lg:h-auto lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <img src={featuredPost.image} alt="" className="object-cover h-full w-full hover:scale-105 transition-transform duration-700" />
            <span className="absolute top-4 left-4 bg-slate-950/70 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10">
              FEATURED ARCTICLE
            </span>
          </div>
          
          <div className="lg:col-span-6 flex flex-col justify-between py-2 font-medium">
            <div>
              <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">{featuredPost.category}</span>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-3 leading-snug hover:text-emerald-500 cursor-pointer transition-colors">{featuredPost.title}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">{featuredPost.excerpt}</p>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-6 flex justify-between items-center text-[10px] text-slate-400">
              <div className="flex gap-4">
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {featuredPost.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {featuredPost.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {featuredPost.readTime}
                </span>
              </div>
              <span className="flex items-center gap-1 text-emerald-500 hover:text-emerald-650 cursor-pointer font-bold uppercase tracking-wider text-[9px]">
                Read Article
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between p-5 card-glow font-medium"
          >
            <div>
              <div className="relative h-48 w-full rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-850 mb-4">
                <img src={post.image} alt="" className="object-cover h-full w-full hover:scale-105 transition-transform duration-700" />
                <span className="absolute bottom-3 left-3 bg-slate-950/70 text-white px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm border border-white/5">
                  {post.category}
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-905 dark:text-white leading-snug hover:text-emerald-500 cursor-pointer transition-colors">
                {post.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-6 flex justify-between items-center text-[9px] text-slate-450">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime} read
              </span>
              <span className="flex items-center gap-0.5 text-emerald-500 hover:text-emerald-600 cursor-pointer font-bold">
                Open Article
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
