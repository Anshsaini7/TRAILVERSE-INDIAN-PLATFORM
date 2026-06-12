'use client';

import React, { useState, useEffect } from 'react';
import { Trek, trekkingCompanies } from '../data/mockData';
import { FileText, Download, CheckCircle, ShieldAlert, FileCheck, PhoneCall, Printer, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrekGuidePdfProps {
  trek: Trek;
  isOpen: boolean;
  onClose: () => void;
}

export default function TrekGuidePdf({ trek, isOpen, onClose }: TrekGuidePdfProps) {
  const [step, setStep] = useState<'idle' | 'generating' | 'ready'>('idle');
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');

  const company = trekkingCompanies.find(c => c.id === trek.companyId);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('idle');
        setProgress(0);
      }, 0);
      return;
    }

    setTimeout(() => {
      setStep('generating');
      setProgress(0);
    }, 0);

    const statuses = [
      'Assembling topographic routes...',
      'Compiling packing list schemas...',
      'Fetching emergency hospital grids...',
      'Compiling operator safety certificates...',
      'Finalizing print formats...'
    ];

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStep('ready');
          return 100;
        }
        
        // Progressively increment status message
        const nextProgress = prev + 10;
        const statusIdx = Math.min(statuses.length - 1, Math.floor(nextProgress / 20));
        setStatusText(statuses[statusIdx]);
        return nextProgress;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handlePrint = () => {
    // Standard high-fidelity printable view
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-black text-slate-800 dark:text-slate-200">Trail Guide Compiler</span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              {step === 'generating' && (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 mb-6">
                    <FileText className="h-10 w-10 text-emerald-500 animate-pulse" />
                    <svg className="absolute inset-0 h-full w-full -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="rgba(16, 185, 129, 0.1)"
                        strokeWidth="4"
                        fill="transparent"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#10b981"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={226}
                        strokeDashoffset={226 - (226 * progress) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-200"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Generating Guide PDF</h3>
                  <p className="text-xs text-slate-400 mt-2 font-medium animate-pulse">{statusText}</p>
                </div>
              )}

              {step === 'ready' && (
                <div className="flex flex-col gap-6">
                  {/* Ready Header */}
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-3">
                      <FileCheck className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Guide Compiled Successfully!</h3>
                    <p className="text-xs text-slate-400 mt-1">TrailVerse adventure bundle is packaged and ready to print.</p>
                  </div>

                  {/* Document Preview Card */}
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 text-xs text-slate-600 dark:text-slate-400 flex flex-col gap-3 font-medium">
                    <div className="flex justify-between font-extrabold text-slate-950 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span>DOCUMENT SUMMARY</span>
                      <span className="text-emerald-500 uppercase tracking-widest text-[9px]">4 Pages</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Trek Name:</span>
                      <span className="text-slate-900 dark:text-slate-200 font-bold">{trek.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Altitude / Distance:</span>
                      <span className="text-slate-900 dark:text-slate-200 font-bold">{trek.altitude}m / {trek.distance}km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Acclimatization Base Camps:</span>
                      <span className="text-slate-900 dark:text-slate-200 font-bold">{trek.baseCampsCount} Camp Locations</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Primary Operator:</span>
                      <span className="text-slate-900 dark:text-slate-200 font-bold">{company?.name} (Verified)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>First Aid & Medical Support:</span>
                      <span className="text-slate-900 dark:text-slate-200 font-bold truncate max-w-[320px]">{trek.medicalFacilities}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <button
                      onClick={onClose}
                      className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Close Window
                    </button>
                    <button
                      onClick={handlePrint}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-premium hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-colors"
                    >
                      <Printer className="h-4 w-4" />
                      <span>Print / Save PDF</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Print Layout Hidden on Screen */}
            <div className="hidden print:block p-8 text-black bg-white font-sans text-sm">
              <div className="border-b-4 border-emerald-500 pb-4 mb-6 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black">{trek.name} Guide</h1>
                  <p className="text-xs text-gray-500">Compiled by TrailVerse India &copy; {new Date().getFullYear()}</p>
                </div>
                {company && (
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400">OPERATOR</p>
                    <p className="font-bold">{company.name}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-bold border-b pb-1 text-emerald-600 mb-2">Trail Parameters</h3>
                  <p><strong>State:</strong> {trek.state}</p>
                  <p><strong>Difficulty:</strong> {trek.difficulty}</p>
                  <p><strong>Altitude:</strong> {trek.altitude}m</p>
                  <p><strong>Distance:</strong> {trek.distance}km</p>
                  <p><strong>Duration:</strong> {trek.duration} Days</p>
                  <p><strong>Best Time:</strong> {trek.bestTime}</p>
                </div>
                <div>
                  <h3 className="font-bold border-b pb-1 text-emerald-600 mb-2">Transit Guidelines</h3>
                  <p><strong>Nearest Airport:</strong> {trek.nearestAirport}</p>
                  <p><strong>Nearest Railway:</strong> {trek.nearestRailway}</p>
                  <p><strong>Nearest Bus Stand:</strong> {trek.nearestBusStand}</p>
                  <p><strong>Base Camp Address:</strong> {trek.baseCampDetails}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold border-b pb-1 text-emerald-600 mb-2">Itinerary Route Checklist</h3>
                <ol className="list-decimal list-inside space-y-1">
                  {trek.route.map((node, i) => (
                    <li key={i}>{node}</li>
                  ))}
                </ol>
              </div>

              <div className="mb-6">
                <h3 className="font-bold border-b pb-1 text-emerald-600 mb-2">Emergency & Medical Protocols</h3>
                <p className="mb-2"><strong>First Aid Facilities:</strong> {trek.medicalFacilities}</p>
                <p><strong>Emergency Contacts:</strong> {trek.emergencyContacts.join(', ')}</p>
              </div>

              <div className="border-t pt-4 text-center text-xs text-gray-400">
                This guide was dynamically compiled on TrailVerse India. Standard safety procedures apply. Check weather before summit push.
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
