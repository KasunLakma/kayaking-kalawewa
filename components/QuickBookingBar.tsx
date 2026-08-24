'use client';

import React, { useState } from 'react';
import { packages } from '@/data/packages';

interface QuickBookingBarProps {
  onCheckAvailability: (packageId: string, date: string, timeSlot: string) => void;
}

const TIME_SLOTS = [
  'Morning / Sunrise (06:00 AM)',
  'Late Morning (09:00 AM)',
  'Afternoon / Wildlife (03:30 PM)',
  'Sunset Romance (05:00 PM)',
];

export default function QuickBookingBar({ onCheckAvailability }: QuickBookingBarProps) {
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const todayStr = new Date().toISOString().split('T')[0];

  const [selectedPackageId, setSelectedPackageId] = useState<string>(packages[0].id);
  const [selectedDate, setSelectedDate] = useState<string>(tomorrowStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(TIME_SLOTS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCheckAvailability(selectedPackageId, selectedDate, selectedTimeSlot);
  };

  return (
    <section className="relative z-30 max-w-6xl mx-auto px-6 -mt-10 sm:-mt-14 mb-12">
      <div className="bg-[#13241E]/95 backdrop-blur-xl border border-[#C8A97E]/40 p-4 sm:p-6 shadow-2xl rounded-none">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          
          {/* 1. Select Package Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C8A97E]">
              Select Package
            </label>
            <select
              value={selectedPackageId}
              onChange={(e) => setSelectedPackageId(e.target.value)}
              className="w-full px-3.5 py-3 bg-[#0B1914] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] cursor-pointer rounded-none"
            >
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.title} ({pkg.price})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Select Date */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C8A97E]">
              Select Date
            </label>
            <input
              type="date"
              min={todayStr}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3.5 py-3 bg-[#0B1914] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] cursor-pointer rounded-none"
            />
          </div>

          {/* 3. Select Time Slot */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C8A97E]">
              Select Time Slot
            </label>
            <select
              value={selectedTimeSlot}
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
              className="w-full px-3.5 py-3 bg-[#0B1914] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] cursor-pointer rounded-none"
            >
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Check Availability CTA */}
          <div>
            <button
              type="submit"
              className="w-full py-3.5 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-none shadow-lg cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>CHECK AVAILABILITY</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}
