'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { packages } from '@/data/packages';

interface QuickBookingBarProps {
  onCheckAvailability?: (packageId: string, date: string, timeSlot: string, guests: number) => void;
}

export default function QuickBookingBar({ onCheckAvailability }: QuickBookingBarProps) {
  const router = useRouter();
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const todayStr = new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(tomorrowStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('Morning | 6:00 AM');
  const [guestCount, setGuestCount] = useState<number>(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCheckAvailability) {
      onCheckAvailability(packages[0].id, selectedDate, selectedTimeSlot, guestCount);
    } else {
      const query = new URLSearchParams({
        date: selectedDate,
        slot: selectedTimeSlot,
        guests: guestCount.toString(),
      }).toString();
      router.push(`/booking?${query}`);
    }
  };

  return (
    <section className="relative z-30 max-w-5xl mx-auto px-4 md:px-6 -mt-12 md:-mt-14 mb-16">
      <div className="bg-white text-gray-800 rounded-2xl shadow-2xl px-6 py-4 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 border border-gray-100">
        <form onSubmit={handleSubmit} className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Field 1: SELECT DATE */}
          <div className="flex items-center gap-3 w-full md:w-auto flex-1 min-w-[200px] border-b md:border-b-0 md:border-r border-gray-100 pb-3 md:pb-0 md:pr-4">
            <div className="p-2.5 rounded-xl bg-stone-100 text-stone-700 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                SELECT DATE
              </label>
              <input
                type="date"
                min={todayStr}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-gray-800 focus:outline-none cursor-pointer"
                aria-label="Select Date"
              />
            </div>
          </div>

          {/* Field 2: PREFERRED TIME SLOT */}
          <div className="flex items-center gap-3 w-full md:w-auto flex-1 min-w-[200px] border-b md:border-b-0 md:border-r border-gray-100 pb-3 md:pb-0 md:pr-4">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="1" x2="12" y2="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="21" x2="12" y2="23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="1" y1="12" x2="3" y2="12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="21" y1="12" x2="23" y2="12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                PREFERRED TIME SLOT
              </label>
              <select
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-gray-800 focus:outline-none cursor-pointer"
                aria-label="Preferred Time Slot"
              >
                <option value="Morning | 6:00 AM">Morning | 6:00 AM</option>
                <option value="Evening | 4:30 PM">Evening | 4:30 PM</option>
                <option value="Late Morning | 9:00 AM">Late Morning | 9:00 AM</option>
                <option value="Afternoon | 3:30 PM">Afternoon | 3:30 PM</option>
              </select>
            </div>
          </div>

          {/* Field 3: GUESTS COUNT */}
          <div className="flex items-center gap-3 w-full md:w-auto flex-1 min-w-[180px]">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                GUESTS COUNT
              </label>
              <select
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value) || 2)}
                className="w-full bg-transparent text-sm font-semibold text-gray-800 focus:outline-none cursor-pointer"
                aria-label="Guests Count"
              >
                <option value={1}>1 Adventurer</option>
                <option value={2}>2 Adventurers</option>
                <option value={3}>3 Adventurers</option>
                <option value={4}>4 Adventurers</option>
                <option value={5}>5+ Adventurers</option>
              </select>
            </div>
          </div>

          {/* CTA Button */}
          <div className="w-full md:w-auto shrink-0 pt-2 md:pt-0">
            <button
              type="submit"
              className="w-full md:w-auto bg-[#112620] hover:bg-[#1f3d34] text-white px-8 py-3.5 rounded-xl font-medium tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span>Check Availability</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}

