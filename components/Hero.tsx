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
    <section className="relative w-full min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#071410] text-white">
      {/* Background Image Layer with Dynamic Time Overlay */}
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
          alt="Kalawewa Lake Luxury Kayaking Expedition"
          className="w-full h-full object-cover object-center transition-all duration-1000 transform scale-105"
        />
        
        {/* Obsidian Dark Vignette Overlays designed for high-contrast Champagne Gold */}
        <div
          className={`absolute inset-0 transition-colors duration-1000 ${
            isNightMode
              ? 'bg-gradient-to-t from-[#071410] via-[#071410]/70 to-black/60'
              : 'bg-gradient-to-t from-[#071410] via-[#071410]/65 to-black/45'
          }`}
        />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#071410]/40 to-[#071410]" />
      </div>

      {/* Top Banner: Day/Night Mode Manual Toggle & Floating Naturalist Badge */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 flex flex-wrap items-center justify-between gap-4">
        {/* Requirement 4: Floating "Curated by Local Naturalists" badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#071410]/80 backdrop-blur-xl border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest shadow-xl">
          <svg className="w-4 h-4 text-[#D4AF37] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <span>Curated by Certified Local Naturalists</span>
        </div>

        <button
          onClick={() => setIsNightMode(!isNightMode)}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#D4AF37]/50 text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#071410] transition-all duration-300 shadow-xl cursor-pointer"
          title="Toggle Day/Night Mode Preview"
        >
          <span>{isNightMode ? '🌙 Twilight Expedition' : '☀️ Sunlit Sanctuary'}</span>
          <span className="underline font-mono text-[10px] opacity-80">(Toggle)</span>
        </button>
      </div>

      {/* Main Hero Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-auto py-12">
        <div className="max-w-3xl space-y-6">
          
          {/* Eyebrow Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold tracking-widest uppercase shadow-sm">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            5TH-CENTURY ANCIENT RESERVOIR • SRI LANKA
          </div>

          {/* Requirement 1: Serif font styling with Champagne Gold accents */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] font-serif drop-shadow-2xl">
            {isNightMode ? (
              <span>
                Starry Night Waters & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-amber-200 to-amber-400">
                  Kalawewa Twilight
                </span>
              </span>
            ) : (
              <span>
                Private Water Safaris & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-amber-200 to-amber-400">
                  Eco-Resort Expeditions
                </span>
              </span>
            )}
          </h1>

          {/* Body Requirement 1: Clean, ultra-legible modern font with refined line heights */}
          <p className="text-base sm:text-xl text-slate-300 font-light leading-relaxed max-w-2xl drop-shadow-md">
            Handcrafted guided kayaking itineraries through tranquil lotus bays, elephant corridors, and ancient hydraulic channels on King Dhatusena&apos;s historic 5th-century reservoir.
          </p>

          {/* Luxury Badges */}
          <div className="pt-2 flex flex-wrap gap-3 text-xs font-medium text-slate-300">
            <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#071410]/70 backdrop-blur-md border border-[#D4AF37]/30 shadow-md">
              <span className="text-[#D4AF37]">★</span> 5.0 Exceptional Rating
            </span>
            <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#071410]/70 backdrop-blur-md border border-[#D4AF37]/30 shadow-md">
              <span className="text-[#D4AF37]">✦</span> Wilderness Safaris Standard
            </span>
            <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#071410]/70 backdrop-blur-md border border-[#D4AF37]/30 shadow-md">
              <span className="text-[#D4AF37]">🌿</span> 100% Zero-Plastic Eco-Tours
            </span>
          </div>

        </div>
      </div>

      {/* Requirement 4: Anchored Quick Search / Filter Bar styled as a floating glass capsule */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mb-10 pb-8">
        <form
          onSubmit={handleSearch}
          className="bg-[#071410]/85 backdrop-blur-2xl border border-[#D4AF37]/30 rounded-3xl lg:rounded-full p-4 lg:px-8 lg:py-5 shadow-[0_20px_60px_rgba(0,0,0,0.8)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center hover:border-[#D4AF37]/60 transition-all duration-500"
        >
          {/* Dropdown 1: Select Trip Style */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5 pl-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              Expedition Type
            </label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full bg-[#040d0a]/90 border border-[#D4AF37]/25 rounded-full px-4 py-3 text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#D4AF37] transition-all cursor-pointer"
            >
              <option value="" className="bg-[#071410] text-slate-200">All Expedition Types</option>
              <option value="sunrise" className="bg-[#071410] text-slate-200">Sunrise Mist Paddle</option>
              <option value="island" className="bg-[#071410] text-slate-200">Classic Island Tour</option>
              <option value="sunset" className="bg-[#071410] text-slate-200">Sunset Romance & Photography</option>
              <option value="camping" className="bg-[#071410] text-slate-200">Full-Day Wilderness Camping</option>
            </select>
          </div>

          {/* Dropdown 2: Select Time Slot */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5 pl-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Preferred Time Slot
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full bg-[#040d0a]/90 border border-[#D4AF37]/25 rounded-full px-4 py-3 text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#D4AF37] transition-all cursor-pointer"
            >
              <option value="" className="bg-[#071410] text-slate-200">Any Time Slot</option>
              <option value="morning" className="bg-[#071410] text-slate-200">Dawn Golden Hour (6:00 AM)</option>
              <option value="afternoon" className="bg-[#071410] text-slate-200">Afternoon Safari (2:00 PM)</option>
              <option value="night" className="bg-[#071410] text-slate-200">Starlight Twilight (6:00 PM)</option>
            </select>
          </div>

          {/* Dropdown 3: Guests Count */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5 pl-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Party Size
            </label>
            <select
              value={selectedGuests}
              onChange={(e) => setSelectedGuests(e.target.value)}
              className="w-full bg-[#040d0a]/90 border border-[#D4AF37]/25 rounded-full px-4 py-3 text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#D4AF37] transition-all cursor-pointer"
            >
              <option value="" className="bg-[#071410] text-slate-200">1 - 2 Paddlers (Tandem / Solo)</option>
              <option value="small" className="bg-[#071410] text-slate-200">Small Group (3 - 5 Guests)</option>
              <option value="large" className="bg-[#071410] text-slate-200">Private Resort Charter (6+ Guests)</option>
            </select>
          </div>

          {/* CTA Action Button Requirement 2 & 4: Pill shaped with gold glowing hover state */}
          <div className="pt-2 sm:pt-0">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#D4AF37] via-amber-300 to-[#D4AF37] hover:from-amber-300 hover:to-[#D4AF37] text-[#071410] text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-[#D4AF37]/50"
            >
              <span>DISCOVER EXPEDITIONS</span>
              <svg className="w-4 h-4 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
