'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { buddyRequests, forumPosts, leaderboardUsers, treks } from '../../data/mockData';
import { 
  Users, MessagesSquare, Trophy, Plus, Star, MapPin, Calendar, 
  Heart, Search, MessageSquare, Compass, X, Share2, Award, ArrowUpRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function CommunityModule() {
  const [activeTab, setActiveTab] = useState<'feed' | 'buddies' | 'forum' | 'leaderboard'>('feed');
  
  // Instagram Stories state
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [newStoryMedia, setNewStoryMedia] = useState('');
  const [newStoryCaption, setNewStoryCaption] = useState('');
  const [createStoryOpen, setCreateStoryOpen] = useState(false);
  const [storiesList, setStoriesList] = useState<any[]>([]);

  // Social Feed state
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostMedia, setNewPostMedia] = useState('');
  const [selectedCommentsPostId, setSelectedCommentsPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [feedPosts, setFeedPosts] = useState<any[]>([]);

  // Buddy Finder states
  const [buddiesData, setBuddiesData] = useState(buddyRequests);
  const [requestedBuddies, setRequestedBuddies] = useState<{ [key: string]: boolean }>({});

  // Forum states
  const [forumThreads, setForumThreads] = useState(forumPosts);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadCategory, setNewThreadCategory] = useState('General Discussion');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [createThreadOpen, setCreateThreadOpen] = useState(false);

  // Story autoplay effect
  useEffect(() => {
    if (activeStoryIdx !== null) {
      const timer = setTimeout(() => {
        if (activeStoryIdx < storiesList.length - 1) {
          setActiveStoryIdx(activeStoryIdx + 1);
        } else {
          setActiveStoryIdx(null);
        }
      }, 5000); // 5 seconds autoplay per story
      return () => clearTimeout(timer);
    }
  }, [activeStoryIdx, storiesList.length]);

  // Handle Likes
  const handleLikePost = (postId: string) => {
    setFeedPosts(prev => prev.map(post => {
      if (post.id === postId) {
        if (!post.likedByMe) {
          // Trigger a minor confetti pop!
          confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
        }
        return {
          ...post,
          likes: post.likedByMe ? post.likes - 1 : post.likes + 1,
          likedByMe: !post.likedByMe
        };
      }
      return post;
    }));
  };

  // Handle Comments
  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim()) return;
    setFeedPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            { id: `c-${Date.now()}`, user: 'You (Explorer)', text: newCommentText.trim() }
          ]
        };
      }
      return post;
    }));
    setNewCommentText('');
  };

  // Handle Post Creation
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost = {
      id: `fp-${Date.now()}`,
      author: 'You (Explorer)',
      username: 'you_explorer',
      avatar: '🧗',
      media: newPostMedia.trim() || 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=80',
      likes: 0,
      likedByMe: false,
      caption: newPostContent.trim(),
      comments: []
    };

    setFeedPosts([newPost, ...feedPosts]);
    setNewPostContent('');
    setNewPostMedia('');
    setCreatePostOpen(false);
    confetti({ particleCount: 50, spread: 30 });
  };

  // Handle Story Creation
  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryMedia.trim()) return;

    const newStory = {
      id: `s-${Date.now()}`,
      user: 'You (Explorer)',
      username: 'you_explorer',
      avatar: '🧗',
      media: newStoryMedia.trim(),
      caption: newStoryCaption.trim()
    };

    setStoriesList([newStory, ...storiesList]);
    setNewStoryMedia('');
    setNewStoryCaption('');
    setCreateStoryOpen(false);
    confetti({ particleCount: 40, spread: 25 });
  };

  // Handle Buddy Join Request
  const handleJoinRequest = (reqId: string) => {
    if (requestedBuddies[reqId]) return;
    setRequestedBuddies(prev => ({ ...prev, [reqId]: true }));
    setBuddiesData(prev => 
      prev.map(b => b.id === reqId ? { ...b, currentBuddies: b.currentBuddies + 1 } : b)
    );
    confetti({ particleCount: 30, spread: 20 });
  };

  // Handle Forum Thread creation
  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;

    const newThread = {
      id: `f-${Date.now()}`,
      title: newThreadTitle.trim(),
      author: 'You (Explorer)',
      avatar: '🧗',
      date: new Date().toISOString().split('T')[0],
      category: newThreadCategory,
      replies: 0,
      likes: 0,
      content: newThreadContent.trim()
    };

    setForumThreads([newThread, ...forumThreads]);
    setNewThreadTitle('');
    setNewThreadContent('');
    setCreateThreadOpen(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 font-medium text-xs text-slate-700 dark:text-slate-350">
      
      {/* 1. PAGE TITLE & TABS CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-wider block">TRAILVERSE SOCIAL</span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Adventure Community</h1>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl shadow-sm font-bold shrink-0">
          {[
            { id: 'feed', label: '📸 Social Feed' },
            { id: 'buddies', label: '🎒 Buddies' },
            { id: 'forum', label: '💬 Forums' },
            { id: 'leaderboard', label: '🏆 Ranks' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-4 rounded-xl transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:border-emerald-450 shadow-sm'
                  : 'text-slate-500 hover:text-emerald-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. INSTAGRAM STORY bubbles */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm mb-6 flex gap-4 overflow-x-auto scrollbar-none items-center relative card-glow">
        {/* Upload Story Bubble */}
        <button
          onClick={() => setCreateStoryOpen(true)}
          className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0"
        >
          <div className="h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-emerald-500 text-2xl hover:border-emerald-500 transition-colors">
            <Plus className="h-6 w-6" />
          </div>
          <span className="text-[10px] font-bold text-slate-400">Add Story</span>
        </button>

        {/* Stories row */}
        {storiesList.map((story, idx) => (
          <button
            key={story.id}
            onClick={() => setActiveStoryIdx(idx)}
            className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0"
          >
            <div className="h-16 w-16 rounded-full p-[3px] bg-gradient-to-tr from-amber-400 to-emerald-500 flex items-center justify-center">
              <div className="h-full w-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-2xl border-2 border-transparent">
                {story.avatar}
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-450 truncate w-16 text-center">{story.user}</span>
          </button>
        ))}
      </section>

      {/* 3. MAIN SECTION SWITCHES */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: INSTAGRAM FEED */}
          {activeTab === 'feed' && (
            <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-8">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-905 dark:text-white">Recent Adventures</h3>
                <button
                  onClick={() => setCreatePostOpen(true)}
                  className="bg-slate-900 dark:bg-emerald-500 hover:bg-emerald-650 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Share Photo
                </button>
              </div>

              {/* Feed Card Posts */}
              <div className="flex flex-col gap-6">
                {feedPosts.length > 0 ? (
                  feedPosts.map((post) => (
                    <div key={post.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm card-glow">
                      {/* Post Header */}
                      <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Link href={`/profile/${post.username}`} className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg shrink-0 hover:scale-105 transition-transform">
                            {post.avatar}
                          </Link>
                          <div>
                            <Link href={`/profile/${post.username}`} className="font-extrabold text-slate-900 dark:text-white text-xs hover:text-emerald-500 transition-colors">
                              {post.author}
                            </Link>
                            <span className="text-[9px] text-slate-400 block font-semibold">@{post.username}</span>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-400 font-extrabold uppercase">Expedition Post</span>
                      </div>

                      {/* Post Image Media */}
                      <div className="relative h-96 w-full overflow-hidden bg-slate-950/20 border-y border-slate-100 dark:border-slate-800/60">
                        <img src={post.media} alt="" className="object-cover h-full w-full" />
                      </div>

                      {/* Post Reactions Actions bar */}
                      <div className="p-5 flex flex-col gap-3 font-semibold">
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => handleLikePost(post.id)}
                              className="flex items-center gap-1 cursor-pointer hover:scale-110 transition-transform"
                            >
                              <Heart className={`h-5 w-5 ${post.likedByMe ? 'fill-rose-500 text-rose-500 animate-pulse' : 'text-slate-400'}`} />
                              <strong className="text-slate-850 dark:text-slate-200">{post.likes} Likes</strong>
                            </button>
                            <button 
                              onClick={() => setSelectedCommentsPostId(post.id)}
                              className="flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform"
                            >
                              <MessageSquare className="h-5 w-5 text-slate-400" />
                              <strong className="text-slate-850 dark:text-slate-200">{post.comments.length} Comments</strong>
                            </button>
                          </div>
                          <span className="text-[9px] text-slate-455 block uppercase">Just now</span>
                        </div>

                        {/* Post description caption */}
                        <p className="text-xs leading-relaxed text-slate-550 dark:text-slate-400 mt-1">
                          <Link href={`/profile/${post.username}`} className="font-black text-slate-900 dark:text-white mr-1.5">
                            @{post.username}
                          </Link>
                          {post.caption}
                        </p>

                        {/* Snippet of comments */}
                        {post.comments.length > 0 && (
                          <div className="mt-2 border-t border-slate-50 dark:border-slate-800/40 pt-2 flex flex-col gap-1.5">
                            {post.comments.slice(0, 2).map((c: any, i: number) => (
                              <p key={i} className="text-[11px] text-slate-450">
                                <span className="font-bold text-slate-800 dark:text-slate-200 mr-1.5">{c.user}:</span>
                                {c.text}
                              </p>
                            ))}
                            {post.comments.length > 2 && (
                              <button onClick={() => setSelectedCommentsPostId(post.id)} className="text-[10px] font-black text-emerald-500 self-start mt-0.5">View all comments...</button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-64 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-650 text-xs p-6 text-center">
                    <Compass className="h-10 w-10 text-slate-300 dark:text-slate-705 stroke-1 animate-pulse mb-3" />
                    <span className="font-extrabold text-sm text-slate-750 dark:text-slate-300">No adventure posts shared yet</span>
                    <p className="mt-1 text-slate-400 dark:text-slate-500 max-w-xs">Be the first to share a moment from your climb by clicking "Share Photo".</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 2: Buddy Finder */}
          {activeTab === 'buddies' && (
            <motion.div key="buddies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {buddiesData.length > 0 ? (
                buddiesData.map((req) => {
                  const hasJoined = requestedBuddies[req.id];
                  const cleanUsername = req.name.toLowerCase().replace(/\s+/g, '_');
                  return (
                    <div key={req.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between card-glow">
                      <div>
                        {/* Request Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <Link href={`/profile/${cleanUsername}`} className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg shrink-0 hover:scale-105 transition-transform">
                              {req.avatar}
                            </Link>
                            <div>
                              <Link href={`/profile/${cleanUsername}`} className="text-sm font-extrabold text-slate-900 dark:text-white hover:text-emerald-500 transition-colors">
                                {req.name}
                              </Link>
                              <span className="text-[10px] text-slate-400 block font-semibold">GENDER PREF: {req.genderPref.toUpperCase()}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded border border-emerald-500/20">
                            {req.currentBuddies} / {req.groupSize} Joined
                          </span>
                        </div>

                        {/* Travel details */}
                        <div className="bg-slate-50 dark:bg-slate-955 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 text-xs font-semibold text-slate-550 dark:text-slate-400 flex flex-col gap-2 mb-4">
                          <div className="flex items-center gap-2">
                            <Compass className="h-4 w-4 text-emerald-500" />
                            <span>Trek: <strong className="text-slate-850 dark:text-slate-200">{req.trekName}</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-emerald-500" />
                            <span>Start Date: <strong className="text-slate-855 dark:text-slate-200">{req.startDate}</strong></span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-405 leading-relaxed font-medium mb-6">
                          "{req.description}"
                        </p>
                      </div>

                      <button
                        onClick={() => handleJoinRequest(req.id)}
                        disabled={hasJoined}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer ${
                          hasJoined
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-slate-700/50'
                            : 'bg-slate-900 text-white dark:bg-emerald-500 hover:bg-emerald-650'
                        }`}
                      >
                        {hasJoined ? 'Request Sent ✓' : 'Request to Join Group'}
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full h-64 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 text-xs p-6 text-center">
                  <Users className="h-10 w-10 text-slate-350 dark:text-slate-700 stroke-1 animate-pulse mb-3" />
                  <span className="font-extrabold text-sm text-slate-750 dark:text-slate-300">No buddy requests active</span>
                  <p className="mt-1 text-slate-450 dark:text-slate-500 max-w-xs">Looking for trail companions? Post a request or start your own!</p>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: Discussion Forums */}
          {activeTab === 'forum' && (
            <motion.div key="forum" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Recent Forum Threads</h3>
                <button
                  onClick={() => setCreateThreadOpen(true)}
                  className="bg-slate-900 dark:bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Ask Question
                </button>
              </div>

              {/* Forum post rows */}
              <div className="flex flex-col gap-4">
                {forumThreads.length > 0 ? (
                  forumThreads.map((post) => (
                    <div key={post.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col gap-3 font-medium">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-450 px-2 py-0.5 rounded uppercase tracking-wider">
                            {post.category}
                          </span>
                          <h4 className="text-sm font-extrabold text-slate-955 dark:text-white mt-2 hover:text-emerald-500 cursor-pointer transition-colors">
                            {post.title}
                          </h4>
                        </div>
                        <div className="flex gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {post.replies}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {post.likes}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        {post.content}
                      </p>

                      <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-855/50 pt-3 text-[10px] text-slate-400">
                        <span>Posted by <strong className="text-slate-800 dark:text-slate-250 font-bold">{post.author}</strong></span>
                        <span>&bull;</span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-64 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-450 dark:text-slate-550 text-xs p-6 text-center">
                    <MessagesSquare className="h-10 w-10 text-slate-300 dark:text-slate-700 stroke-1 animate-pulse mb-3" />
                    <span className="font-extrabold text-sm text-slate-750 dark:text-slate-300">No active forum threads</span>
                    <p className="mt-1 text-slate-400 dark:text-slate-500 max-w-xs">Have a question about trails, gear, or safety? Click "Ask Question" to start a discussion.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 4: Leaderboard */}
          {activeTab === 'leaderboard' && (
            <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-hidden">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-6">India Adventure Leaderboards</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 pb-3 text-slate-450 uppercase text-[9px] tracking-wider font-extrabold">
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Explorer</th>
                      <th className="py-3 px-4">Altitude Gained</th>
                      <th className="py-3 px-4">Completed Trails</th>
                      <th className="py-3 px-4">Points</th>
                      <th className="py-3 px-4">Achievements</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardUsers.map((user, i) => {
                      const isTop3 = user.rank <= 3;
                      const medal = user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉';
                      const cleanUsername = user.name.toLowerCase().replace(/\s+/g, '_');
                      return (
                        <tr key={user.rank} className="border-b border-slate-100/50 dark:border-slate-850/50 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-950/20 font-medium">
                          <td className="py-4 px-4 font-black">
                            {isTop3 ? <span className="text-base mr-1">{medal}</span> : `${user.rank}`}
                          </td>
                          <td className="py-4 px-4 flex items-center gap-2">
                            <Link href={`/profile/${cleanUsername}`} className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm hover:scale-105 transition-transform">
                              {user.avatar}
                            </Link>
                            <Link href={`/profile/${cleanUsername}`} className="font-extrabold text-slate-850 dark:text-slate-150 hover:text-emerald-500 transition-colors">
                              {user.name}
                            </Link>
                          </td>
                          <td className="py-4 px-4 text-emerald-500 font-bold">{user.altitudeGained.toLocaleString()} meters</td>
                          <td className="py-4 px-4 text-slate-800 dark:text-slate-200">{user.completedTreks} trails</td>
                          <td className="py-4 px-4 text-slate-800 dark:text-slate-200">{user.points.toLocaleString()} pts</td>
                          <td className="py-4 px-4">
                            <span className="bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-500/20 shadow-sm">
                              {user.badge}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* 4. ACTIVE STORY VIEWER SCREEN OVERLAY */}
      <AnimatePresence>
        {activeStoryIdx !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-md">
            <button 
              onClick={() => setActiveStoryIdx(null)}
              className="absolute right-6 top-6 p-1 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="w-full max-w-sm h-[80vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between border border-white/10">
              
              {/* Autoplay progress line */}
              <div className="absolute top-4 inset-x-4 flex gap-1 z-20">
                {storiesList.map((story, i) => (
                  <div key={story.id} className="h-1 flex-1 bg-white/20 rounded overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-[5000ms] ease-linear"
                      style={{ 
                        width: i < activeStoryIdx ? '100%' : i === activeStoryIdx ? '100%' : '0%',
                        transitionDuration: i === activeStoryIdx ? '5000ms' : '0s'
                      }} 
                    />
                  </div>
                ))}
              </div>

              {/* Story Header */}
              <div className="p-6 pt-8 bg-gradient-to-b from-slate-950/80 to-transparent absolute inset-x-0 top-0 z-10 flex items-center gap-3">
                <span className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-lg">{storiesList[activeStoryIdx].avatar}</span>
                <div>
                  <strong className="text-white block text-sm">{storiesList[activeStoryIdx].user}</strong>
                  <span className="text-[10px] text-slate-350 block">@{storiesList[activeStoryIdx].username}</span>
                </div>
              </div>

              {/* Story Image */}
              <img src={storiesList[activeStoryIdx].media} alt="" className="object-cover h-full w-full" />

              {/* Story Caption footer */}
              <div className="p-6 bg-gradient-to-t from-slate-950/90 via-slate-955/40 to-transparent absolute inset-x-0 bottom-0 z-10 text-center">
                <p className="text-white text-sm font-extrabold tracking-wide drop-shadow-md">{storiesList[activeStoryIdx].caption}</p>
              </div>

              {/* Controls */}
              <div className="absolute inset-y-0 left-0 w-1/4 cursor-pointer" onClick={() => activeStoryIdx > 0 && setActiveStoryIdx(activeStoryIdx - 1)} />
              <div className="absolute inset-y-0 right-0 w-1/4 cursor-pointer" onClick={() => activeStoryIdx < storiesList.length - 1 ? setActiveStoryIdx(activeStoryIdx + 1) : setActiveStoryIdx(null)} />

            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. SHARE PHOTO POST MODAL */}
      <AnimatePresence>
        {createPostOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-850 shadow-2xl relative font-bold"
            >
              <button onClick={() => setCreatePostOpen(false)} className="absolute right-4 top-4 p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-base font-extrabold text-slate-950 dark:text-white mb-4">Share Trek Photo Post</h3>
              
              <form onSubmit={handleCreatePost} className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newPostMedia}
                    onChange={e => setNewPostMedia(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">Caption / Description</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your climb or trail view details..."
                    value={newPostContent}
                    onChange={e => setNewPostContent(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-premium text-white py-3.5 rounded-2xl text-xs shadow-md transition-colors cursor-pointer mt-2"
                >
                  Publish Post to Social Feed
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. UPLOAD DAILY STORY MODAL */}
      <AnimatePresence>
        {createStoryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-850 shadow-2xl relative font-bold"
            >
              <button onClick={() => setCreateStoryOpen(false)} className="absolute right-4 top-4 p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-base font-extrabold text-slate-950 dark:text-white mb-4">Create Daily Story</h3>
              
              <form onSubmit={handleCreateStory} className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">Media / Image URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newStoryMedia}
                    onChange={e => setNewStoryMedia(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">Story Caption (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Freezing sunrise at pass top!"
                    value={newStoryCaption}
                    onChange={e => setNewStoryCaption(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-premium text-white py-3.5 rounded-2xl text-xs shadow-md transition-colors cursor-pointer mt-2"
                >
                  Publish Story (Expires in 24h)
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. COMMENTS DRAWER MODAL OVERLAY */}
      <AnimatePresence>
        {selectedCommentsPostId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm font-semibold">
            {(() => {
              const currentPost = feedPosts.find(p => p.id === selectedCommentsPostId);
              if (!currentPost) return null;
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-md bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-250 dark:border-slate-850 shadow-2xl relative flex flex-col gap-4"
                >
                  <button onClick={() => setSelectedCommentsPostId(null)} className="absolute right-4 top-4 p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <X className="h-5 w-5" />
                  </button>

                  <h3 className="text-base font-extrabold text-slate-950 dark:text-white">Comments ({currentPost.comments.length})</h3>
                  
                  {/* Comments lists */}
                  <div className="flex flex-col gap-3.5 overflow-y-auto max-h-60 mt-2 pr-1 scrollbar-thin">
                    {currentPost.comments.length > 0 ? (
                      currentPost.comments.map((c: any, i: number) => (
                        <div key={i} className="flex gap-2.5 items-start text-xs border-b border-slate-50 dark:border-slate-800/40 pb-2.5">
                          <span className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm shrink-0">🧗</span>
                          <div>
                            <span className="font-extrabold text-slate-800 dark:text-slate-150 block">{c.user}</span>
                            <p className="text-slate-550 dark:text-slate-400 mt-0.5 leading-relaxed font-medium">{c.text}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-6 font-medium">No comments yet. Be the first to share your thoughts!</p>
                    )}
                  </div>

                  {/* Comment input form */}
                  <div className="border-t border-slate-105 dark:border-slate-800/60 pt-4 flex gap-2">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={newCommentText}
                      onChange={e => setNewCommentText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleAddComment(currentPost.id);
                      }}
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                    <button
                      onClick={() => handleAddComment(currentPost.id)}
                      className="bg-emerald-500 text-white font-bold px-4 rounded-xl text-xs shadow-sm hover:bg-emerald-600 transition-colors cursor-pointer"
                    >
                      Post
                    </button>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        )}
      </AnimatePresence>

      {/* 8. CREATE FORUM THREAD MODAL */}
      <AnimatePresence>
        {createThreadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm font-bold">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-850 shadow-2xl relative"
            >
              <button onClick={() => setCreateThreadOpen(false)} className="absolute right-4 top-4 p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-base font-extrabold text-slate-950 dark:text-white mb-4">Create Discussion Thread</h3>
              <form onSubmit={handleCreateThread} className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">Topic Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. How to prevent high altitude sickness on Roopkund?"
                    value={newThreadTitle}
                    onChange={e => setNewThreadTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">Category</label>
                  <select
                    value={newThreadCategory}
                    onChange={e => setNewThreadCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:outline-none"
                  >
                    <option value="Safety &amp; Health">Safety &amp; Health</option>
                    <option value="Gear Discussion">Gear Discussion</option>
                    <option value="General Discussion">General Discussion</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">Details Context</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide details about your query or share your experiences..."
                    value={newThreadContent}
                    onChange={e => setNewThreadContent(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setCreateThreadOpen(false)}
                    className="flex-1 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-655 dark:text-slate-350 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-premium text-white rounded-xl text-xs shadow-md transition-colors"
                  >
                    Publish Thread
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
