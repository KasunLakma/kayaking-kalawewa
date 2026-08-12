'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Hero() {
  const [isDay, setIsDay] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);
  const [overrideMode, setOverrideMode] = useState<'auto' | 'day' | 'night'>('auto');
  const [currentHour, setCurrentHour] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    setCurrentHour(hour);
    // Daytime is 6 AM (6) to 6 PM (18)
    const daytime = hour >= 6 && hour < 18;
    setIsDay(daytime);

    // Set up an interval to update the hour periodically
    const timer = setInterval(() => {
      const h = new Date().getHours();
      setCurrentHour(h);
      if (overrideMode === 'auto') {
        setIsDay(h >= 6 && h < 18);
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [overrideMode]);

  const activeIsDay = overrideMode === 'auto' ? isDay : overrideMode === 'day';

  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950 text-white">
      {/* Daytime Image Layer */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          activeIsDay ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
        }`}
      >
        <Image
          src="/images/hero-day.png"
          alt="Kayaking Kalawewa Daytime Lake"
          fill
          priority
          className="object-cover object-center scale-105 transition-transform duration-10000 ease-out"
        />
        {/* Subtle Daytime Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-slate-950/40" />
      </div>

      {/* Nighttime Image Layer */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          !activeIsDay ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
        }`}
      >
        <Image
          src="/images/hero-night.png"
          alt="Kayaking Kalawewa Nighttime Starry Sky"
          fill
          priority
          className="object-cover object-center scale-105 transition-transform duration-10000 ease-out"
        />
        {/* Subtle Nighttime Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-indigo-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/50" />
      </div>

      {/* Controls & Time Indicator Bar (Top Right Glassmorphism Pill) */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-3 bg-slate-900/70 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-2xl text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                activeIsDay ? 'bg-amber-400' : 'bg-indigo-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                activeIsDay ? 'bg-amber-500' : 'bg-indigo-500'
              }`}
            />
          </span>
          <span className="font-medium text-slate-200">
            {mounted ? (
              <>
                {activeIsDay ? '☀️ Daytime' : '🌙 Nighttime'} Mode
                {currentHour !== null && (
                  <span className="text-slate-400 text-xs ml-1">
                    ({currentHour.toString().padStart(2, '0')}:00)
                  </span>
                )}
              </>
            ) : (
              'Loading...'
            )}
          </span>
        </div>

        <div className="h-4 w-[1px] bg-white/20" />

        {/* Toggle controls */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/5">
          <button
            onClick={() => setOverrideMode('auto')}
            title="Auto (Based on 6 AM - 6 PM local time)"
            className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${
              overrideMode === 'auto'
                ? 'bg-amber-500/90 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Auto
          </button>
          <button
            onClick={() => setOverrideMode('day')}
            title="Force Daytime Preview"
            className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${
              overrideMode === 'day'
                ? 'bg-amber-500/90 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setOverrideMode('night')}
            title="Force Nighttime Preview"
            className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${
              overrideMode === 'night'
                ? 'bg-indigo-500/90 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Night
          </button>
        </div>
      </div>

      {/* Main Content Hero Card */}
      <div className="relative z-20 max-w-5xl px-6 sm:px-12 py-20 text-center flex flex-col items-center justify-center">
        {/* Location Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-6 shadow-xl animate-fade-in">
          <svg className="w-4 h-4 fill-current text-amber-400" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          Kayaking Kalawewa • Sri Lanka
        </div>

        {/* Dynamic Heading based on Day/Night */}
        <div className="relative overflow-hidden min-h-[140px] sm:min-h-[180px] flex items-center justify-center w-full">
          <h1
            className={`text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${
              activeIsDay
                ? 'from-amber-200 via-amber-400 to-yellow-500 drop-shadow-[0_4px_12px_rgba(251,191,36,0.3)]'
                : 'from-blue-200 via-indigo-300 to-amber-200 drop-shadow-[0_4px_12px_rgba(129,140,248,0.3)]'
            } transition-all duration-700 ease-in-out leading-tight sm:leading-none`}
          >
            {activeIsDay ? 'EXPLORE KALAWEWA LAKE ON WATER' : 'NIGHT EXPEDITIONS & STARRY KALAWEWA'}
          </h1>
        </div>

        {/* Subtitle */}
        <p className="mt-4 text-lg sm:text-xl md:text-2xl text-slate-200 max-w-3xl font-light leading-relaxed drop-shadow-md">
          {activeIsDay
            ? 'Paddle through golden waters, serene ancient reservoir flora, and breathtaking Sri Lankan wildlife.'
            : 'Experience the magic of bioluminescent waters under a sparkling canopy of nocturnal constellations.'}
        </p>

        {/* CTA Gold Button */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <button className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-slate-950 transition-all duration-300 ease-out bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-full shadow-[0_0_25px_rgba(251,191,36,0.5)] hover:shadow-[0_0_35px_rgba(251,191,36,0.8)] hover:scale-105 active:scale-95 cursor-pointer">
            <span className="flex items-center gap-3 text-base sm:text-lg tracking-wide uppercase font-extrabold">
              {activeIsDay ? 'BOOK YOUR ADVENTURE' : 'RESERVE NIGHT SLOT'}
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </button>
        </div>

        {/* Quick Features / Stats Bar */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl w-full border-t border-white/15 pt-8 text-slate-300">
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">14 km²</span>
            <span className="text-xs sm:text-sm font-medium text-slate-400">Reservoir Span</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">100%</span>
            <span className="text-xs sm:text-sm font-medium text-slate-400">Guided Safety</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">4.9 ★</span>
            <span className="text-xs sm:text-sm font-medium text-slate-400">Adventurer Rating</span>
          </div>
        </div>
      </div>
    </section>
  );
}
