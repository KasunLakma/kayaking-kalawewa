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
    <section className="relative w-full h-screen min-h-[720px] pt-28 pb-6 flex flex-col justify-between overflow-hidden bg-[#0B1914] text-[#F4F1EA]">
      {/* Full-bleed 100vh height background with slow zoom transition */}
      <div className="absolute inset-0 z-0 overflow-hidden">
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
          className="w-full h-full object-cover object-center animate-slow-zoom transition-all duration-1000"
        />
        
        {/* Dark Vignette Gradient Overlays */}
        <div
          className={`absolute inset-0 transition-colors duration-1000 ${
            isNightMode
              ? 'bg-gradient-to-b from-[#0B1914]/85 via-[#0B1914]/60 to-[#0B1914]'
              : 'bg-gradient-to-b from-[#0B1914]/75 via-[#0B1914]/40 to-[#0B1914]'
          }`}
        />
      </div>

      {/* Top Utility Bar: Dusk/Day Toggle */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-2 flex justify-end">
        <button
          onClick={() => setIsNightMode(!isNightMode)}
          className="inline-flex items-center gap-2 px-4 py-1.5 border border-[#C8A97E]/30 bg-[#0B1914]/60 backdrop-blur-md text-[10px] font-medium uppercase tracking-[0.2em] text-[#C8A97E] hover:bg-[#C8A97E] hover:text-[#0B1914] transition-all duration-300 cursor-pointer"
          title="Toggle Day/Twilight Atmosphere"
        >
          <span>{isNightMode ? '🌙 Twilight View' : '☀️ Daylight View'}</span>
        </button>
      </div>

      {/* Central Editorial Typography Hierarchy */}
      <div className="relative z-10 max-w-5xl mx-auto w-full px-6 my-auto text-center flex flex-col items-center py-6">
        {/* Overline */}
        <span className="tracking-[0.3em] text-xs font-medium text-[#C8A97E] uppercase mb-4 block">
          ANCIENT WATERS • SRI LANKA
        </span>

        {/* H1 Headline */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal leading-[1.15] text-[#F4F1EA] max-w-4xl drop-shadow-lg">
          Untamed Beauty on King Dhatusena&apos;s Historic Waters
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#F4F1EA]/80 font-light max-w-2xl leading-relaxed mt-6">
          Privately guided eco-kayaking, twilight expeditions, and undisturbed bird sanctuaries in the cultural triangle.
        </p>
      </div>

      {/* Wilderness-style Minimalist Trip Finder at bottom */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 mb-4 sm:mb-8">
        <form
          onSubmit={handleSearch}
          className="bg-[#0B1914]/70 backdrop-blur-md border border-white/10 p-3 sm:p-4 shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center"
        >
          {/* Field 1: Journey Type */}
          <div className="px-3 py-2 flex flex-col gap-1 border-b sm:border-b-0 sm:border-r border-white/10">
            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C8A97E]">
              Journey Type
            </label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full bg-transparent text-xs font-light text-[#F4F1EA] focus:outline-none cursor-pointer appearance-none pr-4"
            >
              <option value="" className="bg-[#0B1914] text-[#F4F1EA]">Select Expedition</option>
              <option value="sunrise" className="bg-[#0B1914] text-[#F4F1EA]">Sunrise Mist Paddle</option>
              <option value="island" className="bg-[#0B1914] text-[#F4F1EA]">Classic Island Tour</option>
              <option value="sunset" className="bg-[#0B1914] text-[#F4F1EA]">Sunset Romance &amp; Photo</option>
              <option value="camping" className="bg-[#0B1914] text-[#F4F1EA]">Full-Day Wilderness</option>
            </select>
          </div>

          {/* Field 2: Season / Time */}
          <div className="px-3 py-2 flex flex-col gap-1 border-b sm:border-b-0 lg:border-r border-white/10">
            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C8A97E]">
              Season / Time
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full bg-transparent text-xs font-light text-[#F4F1EA] focus:outline-none cursor-pointer appearance-none pr-4"
            >
              <option value="" className="bg-[#0B1914] text-[#F4F1EA]">Select Time Slot</option>
              <option value="morning" className="bg-[#0B1914] text-[#F4F1EA]">Dawn Golden Hour (6:00 AM)</option>
              <option value="afternoon" className="bg-[#0B1914] text-[#F4F1EA]">Afternoon Safari (2:00 PM)</option>
              <option value="night" className="bg-[#0B1914] text-[#F4F1EA]">Starlight Twilight (6:00 PM)</option>
            </select>
          </div>

          {/* Field 3: Group Size */}
          <div className="px-3 py-2 flex flex-col gap-1 border-b sm:border-b-0 sm:border-r lg:border-r border-white/10">
            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C8A97E]">
              Group Size
            </label>
            <select
              value={selectedGuests}
              onChange={(e) => setSelectedGuests(e.target.value)}
              className="w-full bg-transparent text-xs font-light text-[#F4F1EA] focus:outline-none cursor-pointer appearance-none pr-4"
            >
              <option value="" className="bg-[#0B1914] text-[#F4F1EA]">Select Group Size</option>
              <option value="1-2" className="bg-[#0B1914] text-[#F4F1EA]">1 - 2 Guests (Private Tandem)</option>
              <option value="3-5" className="bg-[#0B1914] text-[#F4F1EA]">3 - 5 Guests (Small Party)</option>
              <option value="6+" className="bg-[#0B1914] text-[#F4F1EA]">6+ Guests (Private Charter)</option>
            </select>
          </div>

          {/* Field 4: Action Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-[#C8A97E] hover:bg-[#b5966c] text-[#0B1914] text-xs font-medium uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer text-center"
            >
              EXPLORE EXPEDITIONS
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
