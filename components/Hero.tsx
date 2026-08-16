'use client';

import React, { useState, useEffect } from 'react';

export default function Hero() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
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

  return (
    <section className="relative w-full h-screen min-h-[700px] flex flex-col justify-between overflow-hidden bg-[#0B1914] text-white">
      
      {/* Fullscreen 100vh Edge-to-Edge Cinematic Background */}
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
          className={`w-full h-full object-cover object-center transition-all duration-1000 ${
            isPlaying ? 'animate-slow-zoom' : 'scale-105'
          }`}
        />
        
        {/* Soft Vignette Overlay */}
        <div
          className={`absolute inset-0 transition-colors duration-1000 ${
            isNightMode
              ? 'bg-gradient-to-b from-[#0B1914]/85 via-black/40 to-[#0B1914]/90'
              : 'bg-gradient-to-b from-[#0B1914]/70 via-black/30 to-[#0B1914]/85'
          }`}
        />
      </div>

      {/* Top Spacer for Header */}
      <div className="relative z-10 pt-24" />

      {/* Central Immersive Title Hierarchy */}
      <div className="relative z-10 max-w-5xl mx-auto w-full px-6 my-auto text-center flex flex-col items-center justify-center">
        {/* Overline */}
        <span className="tracking-[0.35em] text-xs font-semibold text-gray-300 uppercase mb-4 block">
          WELCOME TO
        </span>

        {/* Main Title: K A L A W E W A */}
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-[0.25em] text-white leading-none drop-shadow-lg uppercase">
          KALAWEWA
        </h1>
      </div>

      {/* Wilderness Bottom HUD & Controls */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-12 pb-10">
        
        {/* Thin Horizontal Separator Line */}
        <div className="relative w-full flex items-center justify-center mb-6">
          <div className="w-full h-[1px] bg-white/20" />

          {/* Centered Circular Pause/Play Toggle Button with Dynamic Ring */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute p-3 rounded-full bg-[#0B1914]/80 border border-white/30 text-white hover:border-[#C8A97E] hover:text-[#C8A97E] transition-all cursor-pointer group shadow-2xl flex items-center justify-center"
            title={isPlaying ? 'Pause Background Animation' : 'Play Background Animation'}
            aria-label="Toggle Animation"
          >
            {/* Spinning Circular Progress Ring */}
            {isPlaying && (
              <svg className="absolute w-10 h-10 animate-spin text-[#C8A97E]/60 pointer-events-none" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="25 75" />
              </svg>
            )}

            <span className="text-sm font-medium relative z-10">
              {isPlaying ? '⏸' : '▶'}
            </span>
          </button>
        </div>

        {/* HUD Bottom Bar: Coordinates (Left) & Editorial Snippet (Right) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          {/* Left Bottom: Geographic Coordinates */}
          <div className="font-mono tracking-widest text-xs text-gray-300 uppercase">
            8.0264° N, 80.5284° E
          </div>

          {/* Right Bottom: Elegant Short Editorial Snippet */}
          <p className="max-w-xs text-center sm:text-right text-xs text-gray-300 leading-relaxed font-light">
            Kalawewa takes you on an unhurried journey through ancient waters and the untamed wildlife of Sri Lanka.
          </p>

        </div>
      </div>

    </section>
  );
}
