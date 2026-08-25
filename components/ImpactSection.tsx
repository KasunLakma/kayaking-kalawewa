'use client';

import React from 'react';
import Image from 'next/image';

export default function ImpactSection() {
  return (
    <section id="impact" className="relative overflow-hidden py-28 bg-[#07120e] text-white">
      {/* Ambient Heritage Image */}
      <div className="absolute inset-0 z-0">
        <Image
          alt="Ancient 5th-Century Hydraulic Sanctuary"
          className="object-cover object-center opacity-60 filter saturate-90"
          fill
          priority
          src="/images/heritage-legacy.jpg"
        />
        {/* Balanced Luxury Vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07120e] via-[#07120e]/75 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1914] via-transparent to-[#0B1914]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-[#c8b8a6]/30 pb-12">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] block mb-3 font-semibold">
              Wilderness Conservation & Heritage
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-[#f3efe6] leading-tight drop-shadow-md">
              Protecting King Dhatusena&apos;s <br className="hidden md:inline" />
              5th Century Legacy
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#f3efe6]/90 leading-relaxed font-light drop-shadow-sm">
            Every expedition directly funds indigenous wetland naturalists, zero-plastic non-motorized paddling charters, and real-time wild Asian elephant corridor monitoring across Kalawewa Reservoir.
          </p>
        </div>

        {/* 4 Stat Metrics with solid backing */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-[#0B1914]/70 backdrop-blur-md p-6 rounded-xl border border-white/10">
            <div className="font-serif text-3xl md:text-4xl text-[#d4af37] mb-1">100%</div>
            <div className="text-xs uppercase tracking-wider text-[#f3efe6] font-medium mb-2">Silent & Non-Motorized</div>
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              Zero carbon emissions preserving pristine aquatic bird colonies.
            </p>
          </div>
          <div className="bg-[#0B1914]/70 backdrop-blur-md p-6 rounded-xl border border-white/10">
            <div className="font-serif text-3xl md:text-4xl text-[#d4af37] mb-1">5th C.</div>
            <div className="text-xs uppercase tracking-wider text-[#f3efe6] font-medium mb-2">Hydraulic Heritage</div>
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              Custodians of King Dhatusena&apos;s 15-century-old freshwater reservoir.
            </p>
          </div>
          <div className="bg-[#0B1914]/70 backdrop-blur-md p-6 rounded-xl border border-white/10">
            <div className="font-serif text-3xl md:text-4xl text-[#d4af37] mb-1">Native</div>
            <div className="text-xs uppercase tracking-wider text-[#f3efe6] font-medium mb-2">Indigenous Naturalists</div>
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              Escorted by Kalawewa villagers trained in hydrology & tracking.
            </p>
          </div>
          <div className="bg-[#0B1914]/70 backdrop-blur-md p-6 rounded-xl border border-white/10">
            <div className="font-serif text-3xl md:text-4xl text-[#d4af37] mb-1">Zero</div>
            <div className="text-xs uppercase tracking-wider text-[#f3efe6] font-medium mb-2">Single-Use Plastics</div>
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              Strict leave-no-trace standards with reusable canteens.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
