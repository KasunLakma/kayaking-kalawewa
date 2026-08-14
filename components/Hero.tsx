'use client';

import React, { useState, useEffect } from 'react';

export default function Hero() {
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedGuests, setSelectedGuests] = useState<string>('');
  const [imgSrc, setImgSrc] = useState<string>('/images/hero-day.jpg');

  // Auto-detect local time on client side (6 AM - 6 PM = Day, 6 PM - 6 AM = Night)
  useEffect(() => {
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 18 || currentHour < 6;
    setIsNightMode(isNight);
  }, []);

  // Update image source when mode changes
  useEffect(() => {
    if (isNightMode) {
      setImgSrc('/images/hero-night-moon.jpg');
    } else {
      setImgSrc('/images/hero-day.jpg');
    }
  }, [isNightMode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const tripsSection = document.getElementById('featured-trips');
    if (tripsSection) {
      tripsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-screen pt-24 sm:pt-28 pb-12 flex flex-col justify-between overflow-hidden bg-[#071410] text-white">
      {/* Edge-to-edge Day/Night Dynamic Lake Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={imgSrc}
          onError={() => {
            setImgSrc(
              isNightMode
                ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80"
                : "/images/hero-day.jpg"
            );
          }}
          alt="Kalawewa Ancient Lake Kayaking Expedition"
          className="w-full h-full object-cover object-center transition-all duration-1000 transform scale-105"
        />
        
        {/* Obsidian Dark Vignette Gradient Overlays */}
        <div
          className={`absolute inset-0 transition-colors duration-1000 ${
            isNightMode
              ? 'bg-gradient-to-b from-black/80 via-black/50 to-[#071410]'
              : 'bg-gradient-to-b from-black/70 via-black/40 to-[#071410]'
          }`}
        />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#071410]/30 to-[#071410]" />
      </div>

      {/* Top Utility Bar: Day/Night Mode Manual Toggle */}
      <div className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 pt-2 flex justify-end">
        <button
          onClick={() => setIsNightMode(!isNightMode)}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#071410] transition-all duration-300 shadow-xl cursor-pointer"
          title="Toggle Day/Night Sanctuary Mode"
        >
          <span>{isNightMode ? '🌙 Twilight View' : '☀️ Daylight View'}</span>
          <span className="text-[10px] opacity-70 underline">(Toggle)</span>
        </button>
      </div>

      {/* Central Pinterest-Style Luxury Typography */}
      <div className="relative z-10 max-w-4xl mx-auto w-full px-4 sm:px-6 my-auto text-center flex flex-col items-center space-y-6 py-8">
        {/* Floating Category Tag */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.25)]">
          <span>★ SRI LANKA&apos;S PREMIER ANCIENT LAKE EXPEDITIONS</span>
        </div>

        {/* Main H1 */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.15] font-serif drop-shadow-2xl">
          Experience{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-amber-200 to-amber-400">
            Ancient Waters
          </span>{' '}
          in Pure Serenity
        </h1>

        {/* Subtext */}
        <p className="text-base sm:text-xl text-slate-200/90 font-light leading-relaxed max-w-2xl drop-shadow-md">
          Private guided kayaking, sunset expeditions, and untamed nature trails on King Dhatusena&apos;s historic reservoir.
        </p>
      </div>

      {/* Floating Trust Glass Cards (Positioned Floating over Hero Section) */}
      <div className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 my-4 hidden md:flex items-center justify-between pointer-events-none">
        {/* Card 1 (Bottom/Mid Left) */}
        <div className="pointer-events-auto bg-black/30 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-3.5 hover:border-[#D4AF37]/40 transition-all duration-300 max-w-xs">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white tracking-wide">4.9/5 Rating</span>
              <div className="flex text-[#D4AF37] text-xs">★★★★★</div>
            </div>
            <p className="text-xs text-slate-300 font-light">Over 500+ Thrilled Paddlers</p>
          </div>
        </div>

        {/* Card 2 (Bottom/Mid Right) */}
        <div className="pointer-events-auto bg-black/30 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-3.5 hover:border-[#D4AF37]/40 transition-all duration-300 max-w-xs">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
            {/* Lifejacket / Water Rescue Icon */}
            <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="4" />
              <path strokeLinecap="round" d="M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M4.93 19.07l4.24-4.24" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-bold text-white block tracking-wide">100% Safe Expeditions</span>
            <p className="text-xs text-slate-300 font-light">Certified Water Rescue Naturalists</p>
          </div>
        </div>
      </div>

      {/* Mobile Floating Trust Cards (Visible on Small Screens) */}
      <div className="relative z-10 max-w-6xl mx-auto w-full px-4 mb-6 md:hidden grid grid-cols-1 gap-3">
        <div className="bg-black/30 backdrop-blur-xl border border-white/10 p-3.5 rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">4.9/5 Rating</span>
              <div className="flex text-[#D4AF37] text-[10px]">★★★★★</div>
            </div>
            <p className="text-[11px] text-slate-300 font-light">Over 500+ Thrilled Paddlers</p>
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-xl border border-white/10 p-3.5 rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
            <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="4" />
              <path strokeLinecap="round" d="M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M4.93 19.07l4.24-4.24" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-bold text-white block">100% Safe Expeditions</span>
            <p className="text-[11px] text-slate-300 font-light">Certified Water Rescue Naturalists</p>
          </div>
        </div>
      </div>

      {/* Floating Capsule Search & Booking Bar (Requirement 4) */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6">
        <form
          onSubmit={handleSearch}
          className="bg-black/40 backdrop-blur-2xl border border-[#D4AF37]/30 rounded-2xl md:rounded-full p-2 md:p-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 items-center hover:border-[#D4AF37]/60 transition-all duration-500"
        >
          {/* Field 1: Trip Style Dropdown */}
          <div className="px-3 py-1.5 flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              Trip Style
            </label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-slate-100 focus:outline-none cursor-pointer appearance-none pr-4"
            >
              <option value="" className="bg-[#071410] text-slate-200">Trip Style Dropdown</option>
              <option value="sunrise" className="bg-[#071410] text-slate-200">Sunrise Mist Paddle</option>
              <option value="island" className="bg-[#071410] text-slate-200">Classic Island Tour</option>
              <option value="sunset" className="bg-[#071410] text-slate-200">Sunset Romance & Photography</option>
              <option value="camping" className="bg-[#071410] text-slate-200">Full-Day Wilderness Camping</option>
            </select>
          </div>

          {/* Field 2: Preferred Time Slot */}
          <div className="px-3 py-1.5 flex flex-col gap-1 sm:border-l border-white/10">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Time Slot
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-slate-100 focus:outline-none cursor-pointer appearance-none pr-4"
            >
              <option value="" className="bg-[#071410] text-slate-200">Preferred Time Slot</option>
              <option value="morning" className="bg-[#071410] text-slate-200">Dawn Golden Hour (6:00 AM)</option>
              <option value="afternoon" className="bg-[#071410] text-slate-200">Afternoon Safari (2:00 PM)</option>
              <option value="night" className="bg-[#071410] text-slate-200">Starlight Twilight (6:00 PM)</option>
            </select>
          </div>

          {/* Field 3: Guests Count */}
          <div className="px-3 py-1.5 flex flex-col gap-1 lg:border-l border-white/10">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Party Size
            </label>
            <select
              value={selectedGuests}
              onChange={(e) => setSelectedGuests(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-slate-100 focus:outline-none cursor-pointer appearance-none pr-4"
            >
              <option value="" className="bg-[#071410] text-slate-200">Guests Count</option>
              <option value="1-2" className="bg-[#071410] text-slate-200">1 - 2 Paddlers (Tandem / Solo)</option>
              <option value="3-5" className="bg-[#071410] text-slate-200">Small Group (3 - 5 Guests)</option>
              <option value="6+" className="bg-[#071410] text-slate-200">Private Resort Charter (6+ Guests)</option>
            </select>
          </div>

          {/* Action Button: Explore Slots → */}
          <div>
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#D4AF37] via-amber-300 to-[#D4AF37] hover:from-amber-300 hover:to-[#D4AF37] text-[#071410] text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-[#D4AF37]/50"
            >
              <span>Explore Slots →</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

