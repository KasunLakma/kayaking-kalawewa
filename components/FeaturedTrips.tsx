'use client';

import React from 'react';
import Image from 'next/image';
import { packages, Package } from '@/data/packages';

export default function FeaturedTrips() {
  return (
    <section id="featured-trips" className="w-full bg-gradient-to-b from-[#071410] via-[#0D231C] to-[#071410] py-32 px-4 sm:px-6 lg:px-12 text-white relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Requirement 3: Refined Gold Separator Line & Botanical Iconography at top of section */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="flex items-center justify-center gap-4">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
          <div className="w-8 h-8 rounded-full bg-[#071410] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-lg">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header with Luxury Serif Hierarchy */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold tracking-widest uppercase shadow-sm">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            CURATED CATALOG • 5-STAR RESORT STANDARD
          </div>

          <h2 className="text-4xl sm:text-6xl font-bold text-white tracking-tight font-serif">
            Iconic Journeys on Kalawewa Waters
          </h2>

          <p className="text-base text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Handcrafted kayaking itineraries designed for wildlife enthusiasts, sunrise photographers, and luxury adventure seekers. Every expedition includes certified naturalists & private escort.
          </p>
        </div>

        {/* Requirement 2: Ultra-Premium Card & Grid Layouts with micro-interactions & floating badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map((pkg: Package) => (
            <div
              key={pkg.id}
              className="group relative bg-[#071410]/80 rounded-3xl overflow-hidden border border-[#D4AF37]/20 hover:border-[#D4AF37]/80 transition-all duration-500 ease-out flex flex-col justify-between hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] backdrop-blur-md"
            >
              {/* High-res Image Container */}
              <div className="relative h-64 w-full overflow-hidden bg-slate-950">
                <Image
                  src={pkg.imageUrl}
                  alt={pkg.title}
                  fill
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#071410] via-[#071410]/30 to-transparent" />

                {/* Floating Luxury Badges on Image (Requirement 2) */}
                <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-1.5 z-10">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#D4AF37]/40 text-[11px] font-bold text-[#D4AF37] shadow-lg">
                    {pkg.rating}
                  </span>
                  
                  {pkg.badge && (
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-amber-500 text-[#071410] text-[10px] font-bold uppercase tracking-wider shadow-lg">
                      {pkg.badge}
                    </span>
                  )}
                </div>

                {/* Second Floating Badges Layer (Requirement 2: "Certified Naturalist Included", "Private & Small Groups") */}
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-1.5 z-10">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/90 backdrop-blur-md border border-emerald-500/40 text-[10px] font-semibold text-emerald-300">
                    🌿 Certified Naturalist
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-medium text-slate-200">
                    {pkg.groupType}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-widest">⏱ {pkg.duration}</span>
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Level: {pkg.difficulty}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug font-serif mb-2">
                    {pkg.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 font-light">
                    {pkg.description}
                  </p>
                </div>

                {/* Card Action & Price Row Requirement 2: Pill-shaped buttons with gold glowing hover state */}
                <div className="pt-4 border-t border-[#D4AF37]/20 flex flex-col space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Starting Rate</span>
                    <span className="text-xl font-bold text-[#D4AF37] tracking-tight">{pkg.price} <span className="text-xs font-normal text-slate-400">{pkg.unit}</span></span>
                  </div>

                  <a
                    href="#packages"
                    className="w-full py-2.5 px-4 rounded-full bg-[#071410] border border-[#D4AF37]/50 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#071410] text-[#D4AF37] text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group/link cursor-pointer hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                  >
                    <span>VIEW EXPEDITION</span>
                    <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
