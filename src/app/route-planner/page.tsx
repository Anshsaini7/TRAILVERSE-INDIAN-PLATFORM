'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { treks, Trek } from '../../data/mockData';
import { Plane, Train as TrainIcon, Bus, Car, ArrowRight, MapPin, DollarSign, Clock, HelpCircle, Compass, Sparkles, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Starting cities list
const STARTING_CITIES = [
  'Delhi',
  'Mumbai',
  'Bengaluru',
  'Kolkata',
  'Chandigarh',
  'Dehradun',
  'Leh',
  'Guwahati'
];

interface RouteSegment {
  from: string;
  to: string;
  mode: 'flight' | 'train' | 'bus' | 'taxi' | 'trek';
  details: string;
  duration: string;
  cost: number;
}

interface TravelOption {
  type: 'Flight' | 'Train' | 'Bus' | 'Taxi';
  icon: any;
  totalCost: number;
  totalTime: string;
  segments: RouteSegment[];
}

export default function RoutePlanner() {
  const [startCity, setStartCity] = useState('Delhi');
  const [selectedTrekId, setSelectedTrekId] = useState(treks[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'Flight' | 'Train' | 'Bus' | 'Taxi'>('Flight');

  const selectedTrek = useMemo(() => {
    return treks.find(t => t.id === selectedTrekId) || treks[0];
  }, [selectedTrekId]);

  // Compute travel routes dynamically based on trek state and district
  const travelOptions = useMemo<TravelOption[]>(() => {
    if (!selectedTrek) return [];

    const state = selectedTrek.state;
    const destName = selectedTrek.name;
    const baseCamp = selectedTrek.baseCamp;
    const airport = selectedTrek.nearestAirport || 'Local Airport';
    const railway = selectedTrek.nearestRailway || 'Local Station';

    // 1. Setup location details based on region
    let stateCategory: 'UK' | 'HP' | 'LADAKH' | 'SIKKIM_WB' | 'NE' | 'SOUTH_WEST' = 'UK';
    if (state === 'Himachal Pradesh') stateCategory = 'HP';
    else if (state === 'Ladakh') stateCategory = 'LADAKH';
    else if (state === 'Sikkim' || state === 'West Bengal') stateCategory = 'SIKKIM_WB';
    else if (state === 'Meghalaya' || state === 'Arunachal Pradesh') stateCategory = 'NE';
    else if (state === 'Karnataka' || state === 'Maharashtra') stateCategory = 'SOUTH_WEST';

    // Helper functions for options
    const options: TravelOption[] = [];

    // --- FLIGHT ROUTE ---
    const flightSegments: RouteSegment[] = [];
    let flightCost = 0;
    let flightTimeHours = 0;

    if (startCity === 'Leh' && stateCategory === 'LADAKH') {
      flightSegments.push({
        from: startCity,
        to: baseCamp,
        mode: 'taxi',
        details: `Local cab direct from Leh city to ${baseCamp} trailhead.`,
        duration: '2-3 hrs',
        cost: 2500
      });
      flightCost = 2500;
      flightTimeHours = 2.5;
    } else {
      // General Flight Segment
      const isDirect = (startCity === 'Delhi' || startCity === 'Mumbai') && (stateCategory === 'UK' || stateCategory === 'SIKKIM_WB');
      const fCost = isDirect ? 4500 : 7500;
      const fDuration = isDirect ? '1.5 hrs' : '3.5 hrs (incl. layover)';
      flightTimeHours += isDirect ? 1.5 : 3.5;

      flightSegments.push({
        from: `${startCity} Airport`,
        to: airport,
        mode: 'flight',
        details: `Commercial airlines via ${startCity} terminal to ${airport}.`,
        duration: fDuration,
        cost: fCost
      });
      flightCost += fCost;

      // Base camp transit from Airport
      let transitCost = 3000;
      let transitDuration = '6 hrs';
      let transitDesc = `Private taxi via state highway to ${baseCamp}.`;
      if (stateCategory === 'LADAKH') {
        transitCost = 1500;
        transitDuration = '1.5 hrs';
        transitDesc = `Cab pickup from Leh airport directly to ${baseCamp}.`;
      } else if (stateCategory === 'NE') {
        transitCost = 5550;
        transitDuration = '10 hrs';
        transitDesc = `Shared/private Sumo through mountain terrain to ${baseCamp}.`;
      }

      flightSegments.push({
        from: airport,
        to: baseCamp,
        mode: 'taxi',
        details: transitDesc,
        duration: transitDuration,
        cost: transitCost
      });
      flightCost += transitCost;
      flightTimeHours += parseFloat(transitDuration);
    }

    // Final foot leg
    flightSegments.push({
      from: baseCamp,
      to: `${destName} Summit`,
      mode: 'trek',
      details: `High-altitude trail ascent via designated camp routes.`,
      duration: `${selectedTrek.duration} Days`,
      cost: selectedTrek.startingPrice
    });
    flightCost += selectedTrek.startingPrice;

    options.push({
      type: 'Flight',
      icon: Plane,
      totalCost: flightCost,
      totalTime: `${flightTimeHours.toFixed(1)} hrs transit + ${selectedTrek.duration} Days trekking`,
      segments: flightSegments
    });

    // --- TRAIN ROUTE ---
    const trainSegments: RouteSegment[] = [];
    let trainCost = 0;
    let trainTimeHours = 0;

    if (stateCategory === 'LADAKH') {
      // No train directly to Leh
      trainSegments.push({
        from: startCity,
        to: 'Jammu Tawi Railway Station',
        mode: 'train',
        details: `Superfast express train from ${startCity} station.`,
        duration: '14-22 hrs',
        cost: 1500
      });
      trainSegments.push({
        from: 'Jammu Tawi',
        to: 'Leh',
        mode: 'bus',
        details: `Overnight JKSRTC bus or shared Sumo travel.`,
        duration: '18 hrs',
        cost: 1800
      });
      trainSegments.push({
        from: 'Leh',
        to: baseCamp,
        mode: 'taxi',
        details: `Local link transit cab.`,
        duration: '2 hrs',
        cost: 1200
      });
      trainCost = 1500 + 1800 + 1200;
      trainTimeHours = 38;
    } else {
      // General Train route
      let tCost = 800;
      let tDuration = '6 hrs';
      if (startCity === 'Mumbai' || startCity === 'Bengaluru') {
        tCost = 2200;
        tDuration = '24-32 hrs';
      }
      trainSegments.push({
        from: startCity,
        to: railway,
        mode: 'train',
        details: `Indian Railways express (AC 3-Tier recommended).`,
        duration: tDuration,
        cost: tCost
      });
      trainCost += tCost;
      trainTimeHours += parseInt(tDuration) || 12;

      // Bus from railway station to basecamp
      let roadCost = 450;
      let roadDuration = '7 hrs';
      trainSegments.push({
        from: railway,
        to: baseCamp,
        mode: 'bus',
        details: `Local state transport bus (HRTC/UTC) or shared traveler.`,
        duration: roadDuration,
        cost: roadCost
      });
      trainCost += roadCost;
      trainTimeHours += parseFloat(roadDuration);
    }

    trainSegments.push({
      from: baseCamp,
      to: `${destName} Summit`,
      mode: 'trek',
      details: `Mountain climbing pathway.`,
      duration: `${selectedTrek.duration} Days`,
      cost: selectedTrek.startingPrice
    });
    trainCost += selectedTrek.startingPrice;

    options.push({
      type: 'Train',
      icon: TrainIcon,
      totalCost: trainCost,
      totalTime: `${trainTimeHours.toFixed(0)} hrs transit + ${selectedTrek.duration} Days trekking`,
      segments: trainSegments
    });

    // --- BUS/ROAD ROUTE ---
    const busSegments: RouteSegment[] = [];
    let busCost = 0;
    let busTimeHours = 0;

    let bCost = 650;
    let bDuration = '8 hrs';
    if (startCity === 'Mumbai' || startCity === 'Bengaluru') {
      bCost = 2500;
      bDuration = '36 hrs (Multi-stage)';
    }

    busSegments.push({
      from: startCity,
      to: stateCategory === 'LADAKH' ? 'Srinagar/Leh' : stateCategory === 'SIKKIM_WB' ? 'Siliguri' : 'Dehradun/Chandigarh',
      mode: 'bus',
      details: `Volvo AC Sleeper bus or equivalent state transport.`,
      duration: bDuration,
      cost: bCost
    });
    busCost += bCost;
    busTimeHours += parseInt(bDuration) || 12;

    let bSubCost = 350;
    let bSubDuration = '6 hrs';
    busSegments.push({
      from: stateCategory === 'LADAKH' ? 'Leh' : stateCategory === 'SIKKIM_WB' ? 'Siliguri' : 'Dehradun/Chandigarh',
      to: baseCamp,
      mode: 'bus',
      details: `Local connection bus or shared Sumo crossing passes.`,
      duration: bSubDuration,
      cost: bSubCost
    });
    busCost += bSubCost;
    busTimeHours += parseFloat(bSubDuration);

    busSegments.push({
      from: baseCamp,
      to: `${destName} Summit`,
      mode: 'trek',
      details: `Foot travel ascension logs.`,
      duration: `${selectedTrek.duration} Days`,
      cost: selectedTrek.startingPrice
    });
    busCost += selectedTrek.startingPrice;

    options.push({
      type: 'Bus',
      icon: Bus,
      totalCost: busCost,
      totalTime: `${busTimeHours.toFixed(0)} hrs transit + ${selectedTrek.duration} Days trekking`,
      segments: busSegments
    });

    // --- TAXI ROUTE ---
    const taxiSegments: RouteSegment[] = [];
    let taxiCost = 0;
    let taxiTimeHours = 0;

    let cabCost = 7500;
    let cabDuration = '10 hrs';
    if (startCity === 'Mumbai' || startCity === 'Bengaluru') {
      cabCost = 25000;
      cabDuration = '40 hrs (Overnight halts required)';
    } else if (startCity === 'Chandigarh' || startCity === 'Dehradun') {
      cabCost = 4500;
      cabDuration = '5 hrs';
    }

    taxiSegments.push({
      from: startCity,
      to: baseCamp,
      mode: 'taxi',
      details: `Private outstation cab (Sedan/SUV recommended for mountain terrain).`,
      duration: cabDuration,
      cost: cabCost
    });
    taxiCost += cabCost;
    taxiTimeHours += parseInt(cabDuration) || 8;

    taxiSegments.push({
      from: baseCamp,
      to: `${destName} Summit`,
      mode: 'trek',
      details: `Ascent track to summit altitude of ${selectedTrek.altitude}m.`,
      duration: `${selectedTrek.duration} Days`,
      cost: selectedTrek.startingPrice
    });
    taxiCost += selectedTrek.startingPrice;

    options.push({
      type: 'Taxi',
      icon: Car,
      totalCost: taxiCost,
      totalTime: `${taxiTimeHours.toFixed(0)} hrs transit + ${selectedTrek.duration} Days trekking`,
      segments: taxiSegments
    });

    return options;
  }, [startCity, selectedTrek]);

  const activeOption = useMemo(() => {
    return travelOptions.find(o => o.type === activeTab) || travelOptions[0];
  }, [travelOptions, activeTab]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500 font-extrabold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-3">
          <Navigation className="h-3.5 w-3.5" />
          Smart Route Planner
        </span>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Plot Your Journey Route
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          Calculate multi-modal transit pathways (train, flight, outstation bus, and taxi options) directly from major starting hubs to any base camp in India.
        </p>
      </div>

      {/* Selectors and Main Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Selectors */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-emerald-500" />
              Route Parameters
            </h2>

            {/* Starting City */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Starting Hub</label>
              <div className="relative">
                <select
                  value={startCity}
                  onChange={(e) => setStartCity(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer font-semibold text-slate-850 dark:text-slate-200"
                >
                  {STARTING_CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Trek Destination */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Destination Trek</label>
              <select
                value={selectedTrekId}
                onChange={(e) => setSelectedTrekId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer font-semibold text-slate-850 dark:text-slate-200"
              >
                {treks.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.state})</option>
                ))}
              </select>
            </div>

            {/* General Info Card */}
            {selectedTrek && (
              <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-900 p-4 rounded-2xl flex flex-col gap-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold text-[9px] uppercase">State</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTrek.state}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold text-[9px] uppercase">Base Camp</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTrek.baseCamp}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold text-[9px] uppercase">Nearest Airport</span>
                  <span className="font-semibold text-slate-850 dark:text-slate-200">{selectedTrek.nearestAirport || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold text-[9px] uppercase">Nearest Railway</span>
                  <span className="font-semibold text-slate-850 dark:text-slate-200">{selectedTrek.nearestRailway || 'N/A'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Timeline Display */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Mode Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-950/60 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-900 gap-1 overflow-x-auto">
            {travelOptions.map((opt) => {
              const Icon = opt.icon;
              const isActive = activeTab === opt.type;
              return (
                <button
                  key={opt.type}
                  onClick={() => setActiveTab(opt.type)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold transition-all min-w-[90px] cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-emerald-500 shadow-sm border border-slate-200/50 dark:border-slate-800/40'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{opt.type}</span>
                </button>
              );
            })}
          </div>

          {/* Detailed Output panel */}
          <AnimatePresence mode="wait">
            {activeOption && (
              <motion.div
                key={activeOption.type}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col gap-6"
              >
                
                {/* Visual Summary Card */}
                <div className="bg-gradient-premium p-6 rounded-3xl text-white shadow-md flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <span className="text-[10px] text-emerald-200 font-extrabold uppercase tracking-widest block">JOURNEY PLAN SUMMARY</span>
                    <h2 className="text-2xl font-black mt-0.5">{startCity} → {selectedTrek.name}</h2>
                    <span className="text-xs text-emerald-100 block mt-1">Via {activeOption.type} transit lines</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <span className="text-[9px] text-emerald-100 font-bold block uppercase">Est. Total Cost</span>
                      <strong className="text-xl font-black leading-none">₹{activeOption.totalCost.toLocaleString()}</strong>
                    </div>
                    <div className="w-[1px] h-8 bg-white/20" />
                    <div className="text-center">
                      <span className="text-[9px] text-emerald-100 font-bold block uppercase">Travel Time</span>
                      <strong className="text-sm font-black leading-none">{activeOption.totalTime}</strong>
                    </div>
                  </div>
                </div>

                {/* Travel Timeline visual stepper */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Visual Route Timeline</h3>

                  <div className="border-l-2 border-slate-100 dark:border-slate-800 ml-4 pl-6 space-y-8 relative">
                    
                    {activeOption.segments.map((seg, idx) => {
                      let segmentIcon = MapPin;
                      let iconBgColor = 'bg-slate-100 dark:bg-slate-950 text-slate-500';

                      if (seg.mode === 'flight') {
                        segmentIcon = Plane;
                        iconBgColor = 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20';
                      } else if (seg.mode === 'train') {
                        segmentIcon = TrainIcon;
                        iconBgColor = 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
                      } else if (seg.mode === 'bus') {
                        segmentIcon = Bus;
                        iconBgColor = 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
                      } else if (seg.mode === 'taxi') {
                        segmentIcon = Car;
                        iconBgColor = 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
                      } else if (seg.mode === 'trek') {
                        segmentIcon = Compass;
                        iconBgColor = 'bg-emerald-500 text-white shadow-sm';
                      }

                      const SegmentIcon = segmentIcon;

                      return (
                        <div key={idx} className="relative group">
                          {/* Left dot icon */}
                          <div className={`absolute -left-[37px] top-0 h-7 w-7 rounded-full flex items-center justify-center text-xs ${iconBgColor}`}>
                            <SegmentIcon className="h-4 w-4" />
                          </div>

                          {/* Node info */}
                          <div>
                            <span className="text-[9px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                              <span>STEP {idx + 1}</span>
                              <span>•</span>
                              <span className="capitalize">{seg.mode} segment</span>
                            </span>
                            
                            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                              <span>{seg.from}</span>
                              <ArrowRight className="h-3 w-3 text-slate-400" />
                              <span>{seg.to}</span>
                            </h4>

                            <p className="text-xs text-slate-500 mt-1 max-w-xl font-medium leading-relaxed">
                              {seg.details}
                            </p>

                            <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {seg.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                Est. ₹{seg.cost.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  </div>
                </div>

                {/* Final Booking Call-to-action */}
                <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-850 p-6 rounded-3xl flex justify-between items-center gap-6 flex-wrap">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Ready for your adventure?</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Contact verified operators and secure permits for {selectedTrek.name}.</p>
                  </div>
                  <Link
                    href={`/trek/${selectedTrek.id}`}
                    className="bg-gradient-premium hover:bg-emerald-600 text-white font-bold py-3 px-5 rounded-2xl text-xs shadow-md transition-colors flex items-center gap-1 text-center"
                  >
                    <span>Visit Trek &amp; Book Details</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
