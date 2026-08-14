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
    <section id="packages" className="w-full bg-[#0F2C23] py-20 px-4 sm:px-6 lg:px-12 text-slate-100 relative overflow-hidden">
      {/* Subtle Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs sm:text-sm font-bold tracking-widest uppercase mb-4 shadow-sm">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            Eco-Tourism Expeditions
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Kayaking Packages & Expeditions
          </h2>
          
          <p className="text-base sm:text-lg text-emerald-100/80 font-light leading-relaxed">
            Discover the ancient beauty of Kalawewa Reservoir. From dawn mist paddles to island wilderness camping, select your ideal water tour led by certified eco-guides.
          </p>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#D4AF37] text-[#0F2C23] shadow-lg shadow-[#D4AF37]/20 font-bold'
                  : 'bg-emerald-950/70 text-emerald-200/80 hover:bg-emerald-900/80 hover:text-white border border-emerald-800/40'
              }`}
            >
              All Tours ({packages.length})
            </button>
            <button
              onClick={() => setSelectedCategory('easy')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === 'easy'
                  ? 'bg-[#D4AF37] text-[#0F2C23] shadow-lg shadow-[#D4AF37]/20 font-bold'
                  : 'bg-emerald-950/70 text-emerald-200/80 hover:bg-emerald-900/80 hover:text-white border border-emerald-800/40'
              }`}
            >
              Easy & Leisure
            </button>
            <button
              onClick={() => setSelectedCategory('moderate')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === 'moderate'
                  ? 'bg-[#D4AF37] text-[#0F2C23] shadow-lg shadow-[#D4AF37]/20 font-bold'
                  : 'bg-emerald-950/70 text-emerald-200/80 hover:bg-emerald-900/80 hover:text-white border border-emerald-800/40'
              }`}
            >
              Moderate Exploration
            </button>
            <button
              onClick={() => setSelectedCategory('challenging')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === 'challenging'
                  ? 'bg-[#D4AF37] text-[#0F2C23] shadow-lg shadow-[#D4AF37]/20 font-bold'
                  : 'bg-emerald-950/70 text-emerald-200/80 hover:bg-emerald-900/80 hover:text-white border border-emerald-800/40'
              }`}
            >
              Challenging Expeditions
            </button>
          </div>
        </div>

        {/* 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {filteredPackages.map((pkg: Package) => (
            <div
              key={pkg.id}
              className={`group relative bg-[#13352B] rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] ${
                pkg.popular
                  ? 'border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.25)]'
                  : 'border-emerald-800/50 hover:border-[#D4AF37]/60'
              }`}
            >
              {/* Top Banner Tag for Popular items */}
              {pkg.popular && (
                <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-[#0F2C23] text-xs font-extrabold uppercase px-3 py-1 rounded-full shadow-lg tracking-wider flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Most Popular
                </div>
              )}

              {/* Package Image & Badges */}
              <div className="relative h-64 w-full overflow-hidden bg-slate-900">
                <Image
                  src={pkg.imageUrl}
                  alt={pkg.title}
                  fill
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Image Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#13352B] via-[#13352B]/30 to-transparent" />
                
                {/* Duration & Difficulty Badges on Image bottom */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium text-emerald-200">
                    <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {pkg.duration}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border ${
                      pkg.difficulty === 'Easy'
                        ? 'bg-emerald-900/80 border-emerald-500/50 text-emerald-300'
                        : pkg.difficulty === 'Moderate'
                        ? 'bg-amber-950/80 border-[#D4AF37]/60 text-[#D4AF37]'
                        : 'bg-rose-950/80 border-rose-500/50 text-rose-300'
                    }`}
                  >
                    ● {pkg.difficulty}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Title & Price Header */}
                  <div className="flex flex-col gap-2 mb-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                      {pkg.title}
                    </h3>
                    
                    {/* Gold Price Badge */}
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#D4AF37] tracking-tight">
                        {pkg.price}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-emerald-300/80">
                        {pkg.unit}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-emerald-100/75 leading-relaxed mb-6 font-light">
                    {pkg.description}
                  </p>

                  {/* Highlights List */}
                  <div className="border-t border-emerald-800/50 pt-4 mb-6">
                    <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-3">
                      Tour Highlights:
                    </h4>
                    <ul className="space-y-2.5">
                      {pkg.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-emerald-50/90">
                          <svg className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Book This Tour CTA Button */}
                <div className="pt-2">
                  <a
                    href="#booking"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm sm:text-base font-extrabold text-[#0F2C23] bg-gradient-to-r from-[#D4AF37] via-amber-400 to-yellow-500 hover:from-amber-300 hover:to-amber-400 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-[#D4AF37]/30 active:scale-95 group/btn cursor-pointer"
                  >
                    <span>Book This Tour</span>
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
