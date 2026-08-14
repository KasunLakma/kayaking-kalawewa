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
    <section className="relative w-full min-h-[90vh] flex flex-col justify-between overflow-hidden bg-[#0D231C] text-white">
      {/* Background Image Layer with Dynamic Time Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={imgSrc}
          onError={() => {
            // Fallback URL if local image fails to load
            setImgSrc(
              isNightMode
                ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80"
                : "/images/hero-day.jpg"
            );
          }}
          alt="Kalawewa Lake Kayaking Expedition"
          className="w-full h-full object-cover object-center transition-all duration-1000 transform scale-105"
        />
        
        {/* Wilderness Dark Vignette Overlays designed for golden amber contrast */}
        <div
          className={`absolute inset-0 transition-colors duration-1000 ${
            isNightMode
              ? 'bg-gradient-to-t from-[#0D231C] via-[#0D231C]/65 to-black/50'
              : 'bg-gradient-to-t from-[#0D231C] via-[#0D231C]/60 to-black/40'
          }`}
        />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0D231C]/40 to-[#0D231C]" />
      </div>

      {/* Top Banner: Day/Night Mode Manual Toggle Indicator */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 flex justify-end">
        <button
          onClick={() => setIsNightMode(!isNightMode)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-[#D4AF37]/60 text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D231C] transition-all duration-300 shadow-xl cursor-pointer"
          title="Toggle Day/Night Mode Preview"
        >
          <span>{isNightMode ? '🌙 Night/Twilight Mode' : '☀️ Sunlit Expedition Mode'}</span>
          <span className="underline font-mono text-[10px] opacity-80">(Switch)</span>
        </button>
      </div>

      {/* Main Hero Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-auto py-12">
        <div className="max-w-3xl space-y-6">
          
          {/* Over-title / Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-extrabold tracking-widest uppercase shadow-sm">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            EXPEDITIONS ON ANCIENT RESERVOIRS • SRI LANKA
          </div>

          {/* Structured Main H1 Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] font-serif drop-shadow-lg">
            {isNightMode ? (
              <span>
                Night Expeditions & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-amber-200 to-yellow-400">
                  Starry Kalawewa
                </span>
              </span>
            ) : (
              <span>
                Explore Kalawewa Lake <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-amber-200 to-yellow-400">
                  on Water
                </span>
              </span>
            )}
          </h1>

          {/* Subtitle / Description */}
          <p className="text-base sm:text-xl text-emerald-100/90 font-light leading-relaxed max-w-2xl drop-shadow-md">
            Award-winning guided kayaking tours through historic waterways, rich wildlife sanctuaries, and serene sunsets on King Dhatusena&apos;s ancient 5th-century reservoir.
          </p>

          {/* Trust Badges under text */}
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-emerald-200/90">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/40 backdrop-blur-sm border border-emerald-800/40">
              <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              Wilderness Travel Approved
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/40 backdrop-blur-sm border border-emerald-800/40">
              <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              Certified Rescue Naturalists
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/40 backdrop-blur-sm border border-emerald-800/40">
              <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              Zero-Plastic Eco-Tours
            </span>
          </div>

        </div>
      </div>

      {/* Anchored Quick Search / Filter Bar */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mb-10 pb-8">
        <form
          onSubmit={handleSearch}
          className="bg-[#121816]/95 backdrop-blur-xl border border-[#D4AF37]/40 rounded-2xl p-4 sm:p-6 shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
        >
          {/* Dropdown 1: Select Trip Style */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              Select Trip Style
            </label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full bg-[#081712] border border-emerald-800/70 rounded-xl px-3.5 py-3 text-xs font-medium text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
            >
              <option value="">All Trip Styles</option>
              <option value="sunrise">Sunrise Mist Paddle</option>
              <option value="island">Classic Island Tour</option>
              <option value="sunset">Sunset Romance</option>
              <option value="camping">Full-Day Wilderness Camping</option>
            </select>
          </div>

          {/* Dropdown 2: Select Time Slot */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Select Time Slot
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full bg-[#081712] border border-emerald-800/70 rounded-xl px-3.5 py-3 text-xs font-medium text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
            >
              <option value="">Any Time Slot</option>
              <option value="morning">Morning (6:00 AM - 9:00 AM)</option>
              <option value="afternoon">Afternoon (2:00 PM - 5:00 PM)</option>
              <option value="night">Night Expedition (6:00 PM - 9:00 PM)</option>
            </select>
          </div>

          {/* Dropdown 3: Guests Count */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Guests Count
            </label>
            <select
              value={selectedGuests}
              onChange={(e) => setSelectedGuests(e.target.value)}
              className="w-full bg-[#081712] border border-emerald-800/70 rounded-xl px-3.5 py-3 text-xs font-medium text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
            >
              <option value="">1 - 2 Paddlers</option>
              <option value="small">Small Group (3 - 5 Guests)</option>
              <option value="large">Private Expedition (6+ Guests)</option>
            </select>
          </div>

          {/* CTA Action Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#0D231C] text-xs font-black uppercase tracking-widest transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-[#D4AF37]/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>FIND ADVENTURE</span>
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
