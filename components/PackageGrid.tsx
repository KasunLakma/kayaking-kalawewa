'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { packages, Package } from '@/data/packages';
import BookingModal from './BookingModal';

interface PackageGridProps {
  onSelectPackage?: (pkgId: string) => void;
}

export default function PackageGrid({ onSelectPackage }: PackageGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);

  const filteredPackages = selectedCategory === 'all' 
    ? packages 
    : packages.filter(pkg => pkg.difficulty.toLowerCase() === selectedCategory.toLowerCase());

  const handleBook = (id: string) => {
    if (onSelectPackage) {
      onSelectPackage(id);
    } else {
      setActiveBookingId(id);
    }
  };

  return (
    <section id="packages" className="w-full bg-[#0B1914] py-28 sm:py-36 px-6 lg:px-12 text-[#F4F1EA] relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C8A97E]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="tracking-[0.3em] text-xs font-medium text-[#C8A97E] uppercase block">
            FULL EXPEDITION PORTFOLIO
          </span>
          
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#F4F1EA] tracking-tight">
            Kayaking Packages &amp; Expeditions
          </h2>
          
          <p className="text-base text-[#F4F1EA]/80 font-light leading-relaxed pt-2">
            Discover the ancient beauty of Kalawewa Reservoir. Select your ideal water tour led by certified eco-guides with instant online reservation.
          </p>

          {/* Filter Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2 rounded-none text-xs font-medium uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#C8A97E] text-[#0B1914] border border-[#C8A97E]'
                  : 'bg-[#13241E] text-[#F4F1EA] hover:text-[#C8A97E] border border-white/10 hover:border-[#C8A97E]/60'
              }`}
            >
              All Tours ({packages.length})
            </button>
            <button
              onClick={() => setSelectedCategory('easy')}
              className={`px-5 py-2 rounded-none text-xs font-medium uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer ${
                selectedCategory === 'easy'
                  ? 'bg-[#C8A97E] text-[#0B1914] border border-[#C8A97E]'
                  : 'bg-[#13241E] text-[#F4F1EA] hover:text-[#C8A97E] border border-white/10 hover:border-[#C8A97E]/60'
              }`}
            >
              Easy &amp; Leisure
            </button>
            <button
              onClick={() => setSelectedCategory('moderate')}
              className={`px-5 py-2 rounded-none text-xs font-medium uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer ${
                selectedCategory === 'moderate'
                  ? 'bg-[#C8A97E] text-[#0B1914] border border-[#C8A97E]'
                  : 'bg-[#13241E] text-[#F4F1EA] hover:text-[#C8A97E] border border-white/10 hover:border-[#C8A97E]/60'
              }`}
            >
              Moderate Exploration
            </button>
            <button
              onClick={() => setSelectedCategory('challenging')}
              className={`px-5 py-2 rounded-none text-xs font-medium uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer ${
                selectedCategory === 'challenging'
                  ? 'bg-[#C8A97E] text-[#0B1914] border border-[#C8A97E]'
                  : 'bg-[#13241E] text-[#F4F1EA] hover:text-[#C8A97E] border border-white/10 hover:border-[#C8A97E]/60'
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
              className="group relative bg-[#13241E] rounded-none overflow-hidden border border-white/10 hover:border-[#C8A97E]/60 transition-all duration-500 flex flex-col justify-between"
            >
              {/* Package Image */}
              <div className="relative h-64 w-full overflow-hidden bg-slate-950">
                <Image
                  src={pkg.imageUrl}
                  alt={pkg.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#13241E] via-[#13241E]/40 to-transparent" />
                
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="px-3 py-1 bg-[#0B1914]/80 backdrop-blur-md border border-[#C8A97E]/30 text-[10px] font-medium text-[#C8A97E] uppercase tracking-wider">
                    {pkg.rating}
                  </span>

                  {pkg.popular && (
                    <span className="px-3 py-1 bg-[#C8A97E] text-[#0B1914] text-[10px] font-medium uppercase tracking-[0.2em]">
                      Signature
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="px-3 py-1 bg-[#0B1914]/80 backdrop-blur-md text-xs font-light text-[#F4F1EA]">
                    ⏱ {pkg.duration}
                  </span>

                  <span className="px-3 py-1 text-xs font-medium backdrop-blur-md bg-[#0B1914]/80 border border-[#C8A97E]/30 text-[#C8A97E]">
                    {pkg.difficulty}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col gap-2 mb-4">
                    <h3 className="font-serif text-2xl font-normal text-[#F4F1EA] group-hover:text-[#C8A97E] transition-colors leading-snug">
                      {pkg.title}
                    </h3>
                    
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="font-serif text-2xl font-normal text-[#C8A97E]">
                        {pkg.price}
                      </span>
                      <span className="text-xs font-light text-slate-400">
                        {pkg.unit}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#F4F1EA]/80 leading-relaxed mb-6 font-light">
                    {pkg.description}
                  </p>

                  <div className="border-t border-white/10 pt-4 mb-6">
                    <h4 className="text-[10px] font-medium text-[#C8A97E] uppercase tracking-[0.2em] mb-3">
                      Expedition Inclusions:
                    </h4>
                    <ul className="space-y-2">
                      {pkg.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#F4F1EA]/75 font-light">
                          <span className="text-[#C8A97E]">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => handleBook(pkg.id)}
                    className="w-full py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#0B1914] bg-[#C8A97E] hover:bg-[#b5966c] transition-all duration-300 flex items-center justify-center gap-2 group/btn cursor-pointer font-bold"
                  >
                    <span>Reserve Expedition</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeBookingId && (
        <BookingModal
          isOpen={true}
          selectedPackageId={activeBookingId}
          onClose={() => setActiveBookingId(null)}
        />
      )}
    </section>
  );
}
