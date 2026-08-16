'use client';

import React from 'react';
import Image from 'next/image';
import { packages, Package } from '@/data/packages';

export default function FeaturedTrips() {
  return (
    <section id="featured-trips" className="w-full bg-[#0B1914] py-28 sm:py-36 px-6 lg:px-12 text-[#F4F1EA] relative overflow-hidden">
      {/* Decorative subtle ambient background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C8A97E]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="tracking-[0.3em] text-xs font-medium text-[#C8A97E] uppercase block">
            CURATED EXPEDITIONS
          </span>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#F4F1EA] tracking-tight">
            Handcrafted Itineraries on Kalawewa Waters
          </h2>

          <p className="text-base text-[#F4F1EA]/80 font-light max-w-2xl mx-auto leading-relaxed pt-2">
            Privately guided eco-kayaking journeys designed for wildlife enthusiasts, photographers, and luxury adventurers. Every expedition includes certified naturalists &amp; private escort.
          </p>
        </div>

        {/* 4:5 Portrait Luxury Wilderness Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {packages.map((pkg: Package) => (
            <a
              key={pkg.id}
              href="#why-kalawewa"
              className="group relative aspect-[4/5] rounded-none overflow-hidden border border-white/10 hover:border-[#C8A97E]/60 transition-all duration-500 bg-[#13241E] flex flex-col justify-between p-6 sm:p-7 text-[#F4F1EA] cursor-pointer shadow-2xl"
            >
              {/* Full-bleed Portrait Image with hover zoom */}
              <Image
                src={pkg.imageUrl}
                alt={pkg.title}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />

              {/* Dark Gradient Text Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1914] via-[#0B1914]/60 to-black/30 z-10 pointer-events-none" />

              {/* Top Overlay Header Badges */}
              <div className="relative z-20 flex items-center justify-between w-full">
                <span className="px-2.5 py-1 bg-[#0B1914]/80 backdrop-blur-md border border-[#C8A97E]/40 text-[9px] font-medium tracking-[0.2em] uppercase text-[#C8A97E]">
                  🌿 NATURALIST GUIDED
                </span>

                {pkg.badge && (
                  <span className="px-2.5 py-1 bg-[#C8A97E] text-[#0B1914] text-[9px] font-semibold tracking-[0.2em] uppercase shadow-md">
                    {pkg.badge}
                  </span>
                )}
              </div>

              {/* Bottom Gradient Text Overlay Details */}
              <div className="relative z-20 mt-auto space-y-3 pt-6">
                <div className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#C8A97E]">
                  {pkg.duration} • {pkg.groupType}
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#F4F1EA] group-hover:text-[#C8A97E] transition-colors leading-snug">
                  {pkg.title}
                </h3>

                <p className="text-xs text-[#F4F1EA]/75 font-light line-clamp-2 leading-relaxed">
                  {pkg.description}
                </p>

                {/* Price Displayed in Refined Gold Serif Typography */}
                <div className="pt-4 border-t border-white/15 flex items-end justify-between">
                  <div>
                    <span className="text-[9px] text-slate-400 font-medium tracking-[0.2em] uppercase block">
                      FROM
                    </span>
                    <span className="font-serif text-2xl font-normal text-[#C8A97E]">
                      {pkg.price}
                    </span>{' '}
                    <span className="text-xs text-slate-400 font-light">{pkg.unit}</span>
                  </div>

                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#F4F1EA] group-hover:text-[#C8A97E] flex items-center gap-1 transition-colors pb-1">
                    EXPLORE →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
