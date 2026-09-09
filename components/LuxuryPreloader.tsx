'use client';

import React, { useState, useEffect } from 'react';

export default function LuxuryPreloader() {
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Trigger smooth fade-out once hydrated / mounted
    const timer = setTimeout(() => {
      setMounted(true);
    }, 700);

    // Completely remove pointer interactions and DOM footprint after transition
    const cleanupTimer = setTimeout(() => {
      setHidden(true);
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearTimeout(cleanupTimer);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#07130E] transition-opacity duration-700 select-none ${
        mounted ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Loading Kalawewa Expeditions"
      role="status"
    >
      {/* Ambient Gold Halo Glow */}
      <div className="absolute w-32 h-32 rounded-full bg-[#d4af37]/10 blur-2xl animate-pulse pointer-events-none" />

      {/* Animated Brand Mark & Progress Ring */}
      <div className="relative flex items-center justify-center">
        {/* Elegant Gold Circular Progress Ring */}
        <div className="border-t-2 border-[#d4af37] border-white/10 rounded-full w-16 h-16 animate-spin" />

        {/* Pulsing Kayak Paddle Silhouette Emblem */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-[#d4af37] animate-pulse"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {/* Upper Paddle Blade */}
            <path
              d="M12 3C9.5 5.5 9.5 8.5 12 11.5C14.5 8.5 14.5 5.5 12 3Z"
              fill="#d4af37"
              fillOpacity="0.25"
              stroke="#d4af37"
              strokeWidth="1.5"
            />
            {/* Lower Paddle Blade */}
            <path
              d="M12 12.5C9.5 15.5 9.5 18.5 12 21C14.5 18.5 14.5 15.5 12 12.5Z"
              fill="#d4af37"
              fillOpacity="0.25"
              stroke="#d4af37"
              strokeWidth="1.5"
            />
            {/* Paddle Shaft */}
            <line x1="12" y1="2" x2="12" y2="22" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" />
            {/* Center Pivot Accent */}
            <circle cx="12" cy="12" r="1.5" fill="#d4af37" />
          </svg>
        </div>
      </div>

      {/* Monogram / Wordmark */}
      <span className="font-serif tracking-[0.3em] text-xs text-[#d4af37] animate-pulse mt-4 uppercase font-medium">
        KALAWEWA EXPEDITIONS
      </span>

      {/* Subtle Luxury Subtext */}
      <span className="text-[9px] tracking-[0.3em] text-stone-400/60 uppercase mt-1 font-light">
        HYDRAULIC HERITAGE &bull; ANCIENT WATERS
      </span>
    </div>
  );
}
