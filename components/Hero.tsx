'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  return (
    <section className="relative w-full min-h-[750px] lg:h-screen flex flex-col justify-between overflow-hidden bg-[#0B1914] text-white">
      
      {/* Fullscreen 100vh Edge-to-Edge Cinematic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/images/kalawewa-hero.jpeg"
          alt="Kayaking Kalawewa Sunset"
          fill
          priority
          unoptimized
          className={`object-cover object-center -z-10 transition-all duration-1000 ${
            isPlaying ? 'animate-slow-zoom' : 'scale-105'
          }`}
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />
      </div>

      {/* Top Spacer for Header */}
      <div className="relative z-10 pt-20 md:pt-24" />

      {/* Central Immersive Title Hierarchy */}
      <div className="relative z-10 max-w-5xl mx-auto w-full px-6 my-auto text-center flex flex-col items-center justify-center py-6">
        {/* Overline */}
        <span className="tracking-[0.35em] text-xs font-semibold text-[#C8A97E] uppercase mb-4 block">
          KALAWEWA ADVENTURES &amp; EXPEDITIONS
        </span>

        {/* Main Title */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-[0.08em] sm:tracking-[0.15em] text-white leading-tight drop-shadow-lg uppercase">
          Experience the Untamed Beauty of Kalawewa
        </h1>

        <p className="text-xs sm:text-sm font-light tracking-[0.2em] text-slate-200 uppercase mt-6 max-w-2xl leading-relaxed">
          Guided kayak expeditions through Sri Lanka&apos;s ancient reservoir — where wilderness meets wonder.
        </p>

        {/* Hero Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#packages"
            className="px-8 py-3.5 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-lg rounded-none cursor-pointer"
          >
            EXPLORE EXPEDITIONS
          </Link>
          <Link
            href="/packages"
            className="px-8 py-3.5 bg-[#0B1914]/80 hover:bg-[#13241E] border border-[#C8A97E]/50 text-[#C8A97E] hover:text-white text-xs font-medium uppercase tracking-[0.2em] transition-all rounded-none cursor-pointer"
          >
            VIEW ALL PACKAGES
          </Link>
        </div>
      </div>

      {/* Wilderness Bottom HUD & Controls */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-12 pb-16 md:pb-24">
        
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
