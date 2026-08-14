'use client';

import React from 'react';
import Image from 'next/image';
import { packages, Package } from '@/data/packages';

export default function FeaturedTrips() {
  return (
    <section id="featured-trips" className="w-full bg-[#0D231C] py-24 px-4 sm:px-6 lg:px-12 text-white relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header with Hierarchy */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-black tracking-widest uppercase shadow-sm">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            FEATURED EXPEDITIONS
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-serif">
            Iconic Journeys on Kalawewa Waters
          </h2>

          <p className="text-sm sm:text-base text-emerald-100/80 font-light max-w-2xl mx-auto leading-relaxed">
            Handcrafted kayaking itineraries designed for wildlife enthusiasts, sunrise photographers, and adventure seekers. All packages led by certified naturalists.
          </p>
        </div>

        {/* Wilderness Travel Card Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map((pkg: Package) => (
            <div
              key={pkg.id}
              className="group relative bg-[#121816] rounded-2xl overflow-hidden border border-emerald-900/60 hover:border-[#D4AF37] transition-all duration-300 flex flex-col justify-between hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            >
              {/* High-res Image Container */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-900">
                <Image
                  src={pkg.imageUrl}
                  alt={pkg.title}
                  fill
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121816] via-[#121816]/30 to-transparent" />

                {/* Top Duration Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-bold text-emerald-200">
                    ⏱ {pkg.duration}
                  </span>
                </div>

                {/* Top Badge (if available) */}
                {pkg.badge && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2.5 py-1 rounded-md bg-[#D4AF37] text-[#0D231C] text-[10px] font-black uppercase tracking-wider shadow">
                      {pkg.badge}
                    </span>
                  </div>
                )}

                {/* Price tag on image bottom */}
                <div className="absolute bottom-3 left-4 z-10">
                  <span className="text-xs text-emerald-200/80 uppercase font-semibold block">Starting From</span>
                  <span className="text-xl font-black text-[#D4AF37] tracking-tight">{pkg.price}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug font-serif mb-2">
                    {pkg.title}
                  </h3>

                  <p className="text-xs text-emerald-100/75 leading-relaxed line-clamp-3 font-light">
                    {pkg.description}
                  </p>
                </div>

                {/* Card Action Link */}
                <div className="pt-3 border-t border-emerald-900/60 flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-emerald-300/80">
                    Difficulty: <strong className="text-white">{pkg.difficulty}</strong>
                  </span>

                  <a
                    href="#booking"
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#D4AF37] hover:text-amber-300 transition-colors group/link"
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
