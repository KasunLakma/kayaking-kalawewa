'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { packages, Package } from '@/data/packages';

export default function PackageGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredPackages = selectedCategory === 'all' 
    ? packages 
    : packages.filter(pkg => pkg.difficulty.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="packages" className="w-full bg-[#071410] py-32 px-4 sm:px-6 lg:px-12 text-slate-100 relative overflow-hidden">
      {/* Subtle Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

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
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold tracking-widest uppercase shadow-sm">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            FULL EXPEDITION PORTFOLIO
          </div>
          
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight font-serif">
            Kayaking Packages & Expeditions
          </h2>
          
          <p className="text-base text-slate-300 font-light leading-relaxed">
            Discover the ancient beauty of Kalawewa Reservoir. From dawn mist paddles to island wilderness camping, select your ideal water tour led by certified eco-guides.
          </p>

          {/* Requirement 2: Refined Pill-Shaped Filter Buttons with Gold Borders & Glowing States */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#D4AF37] text-[#071410] shadow-[0_0_20px_rgba(212,175,55,0.4)] border border-[#D4AF37]'
                  : 'bg-[#040d0a]/90 text-slate-300 hover:text-[#D4AF37] border border-[#D4AF37]/25 hover:border-[#D4AF37]/60'
              }`}
            >
              All Tours ({packages.length})
            </button>
            <button
              onClick={() => setSelectedCategory('easy')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                selectedCategory === 'easy'
                  ? 'bg-[#D4AF37] text-[#071410] shadow-[0_0_20px_rgba(212,175,55,0.4)] border border-[#D4AF37]'
                  : 'bg-[#040d0a]/90 text-slate-300 hover:text-[#D4AF37] border border-[#D4AF37]/25 hover:border-[#D4AF37]/60'
              }`}
            >
              Easy & Leisure
            </button>
            <button
              onClick={() => setSelectedCategory('moderate')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                selectedCategory === 'moderate'
                  ? 'bg-[#D4AF37] text-[#071410] shadow-[0_0_20px_rgba(212,175,55,0.4)] border border-[#D4AF37]'
                  : 'bg-[#040d0a]/90 text-slate-300 hover:text-[#D4AF37] border border-[#D4AF37]/25 hover:border-[#D4AF37]/60'
              }`}
            >
              Moderate Exploration
            </button>
            <button
              onClick={() => setSelectedCategory('challenging')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                selectedCategory === 'challenging'
                  ? 'bg-[#D4AF37] text-[#071410] shadow-[0_0_20px_rgba(212,175,55,0.4)] border border-[#D4AF37]'
                  : 'bg-[#040d0a]/90 text-slate-300 hover:text-[#D4AF37] border border-[#D4AF37]/25 hover:border-[#D4AF37]/60'
              }`}
            >
              Challenging Expeditions
            </button>
          </div>
        </div>

        {/* Requirement 2: 3-Column Responsive Grid with Luxury Micro-Interactions & Floating Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {filteredPackages.map((pkg: Package) => (
            <div
              key={pkg.id}
              className={`group relative bg-[#0D231C]/80 backdrop-blur-md rounded-3xl overflow-hidden border transition-all duration-500 flex flex-col justify-between hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] ${
                pkg.popular
                  ? 'border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.25)]'
                  : 'border-[#D4AF37]/25 hover:border-[#D4AF37]/80'
              }`}
            >
              {/* Package Image & Floating Luxury Badges */}
              <div className="relative h-64 w-full overflow-hidden bg-slate-950">
                <Image
                  src={pkg.imageUrl}
                  alt={pkg.title}
                  fill
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Image Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D231C] via-[#0D231C]/30 to-transparent" />
                
                {/* Floating Luxury Badges Top Row */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#D4AF37]/40 text-[11px] font-bold text-[#D4AF37] shadow-lg">
                    {pkg.rating}
                  </span>

                  {pkg.popular && (
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-amber-500 text-[#071410] text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Signature
                    </span>
                  )}
                </div>

                {/* Floating Badges Bottom Row */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-xs font-semibold text-slate-200">
                    ⏱ {pkg.duration}
                  </span>

                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md bg-[#071410]/80 border border-[#D4AF37]/40 text-[#D4AF37]">
                    ● {pkg.difficulty}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Title & Price Header */}
                  <div className="flex flex-col gap-2 mb-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug font-serif">
                      {pkg.title}
                    </h3>
                    
                    {/* Gold Price Badge */}
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#D4AF37] tracking-tight">
                        {pkg.price}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-400">
                        {pkg.unit}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed mb-6 font-light">
                    {pkg.description}
                  </p>

                  {/* Highlights List */}
                  <div className="border-t border-[#D4AF37]/20 pt-4 mb-6">
                    <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-3">
                      Expedition Inclusions:
                    </h4>
                    <ul className="space-y-2.5">
                      {pkg.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 font-light">
                          <svg className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Requirement 2: Pill-shaped glowing CTA Button */}
                <div className="pt-3 border-t border-[#D4AF37]/20">
                  <a
                    href="#safety"
                    className="w-full py-3.5 px-6 rounded-full text-xs font-bold uppercase tracking-widest text-[#071410] bg-gradient-to-r from-[#D4AF37] via-amber-300 to-[#D4AF37] hover:from-amber-300 hover:to-[#D4AF37] transition-all duration-300 shadow-md hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] active:scale-95 flex items-center justify-center gap-2 group/btn cursor-pointer border border-[#D4AF37]/50"
                  >
                    <span>Reserve Expedition</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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
