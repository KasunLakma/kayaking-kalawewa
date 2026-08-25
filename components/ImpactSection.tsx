'use client';

import React from 'react';
import Image from 'next/image';

const impactStats = [
  {
    number: '100%',
    label: 'Silent & Non-Motorized',
    description: 'Zero carbon emissions preserving pristine aquatic bird colonies and elephant drinking corridors.',
  },
  {
    number: '5th C.',
    label: 'Ancient Hydraulic Heritage',
    description: 'Custodians of King Dhatusena’s historic 15-century-old freshwater reservoir system.',
  },
  {
    number: 'Native',
    label: 'Indigenous Naturalists',
    description: 'Every charter is escorted by local Kalawewa villagers trained in hydrology & wildlife tracking.',
  },
  {
    number: 'Zero',
    label: 'Single-Use Plastics',
    description: 'Strict leave-no-trace charter standards with reusable canteens and organic refreshes.',
  },
];

export default function ImpactSection() {
  return (
    <section id="impact" className="relative overflow-hidden py-24 sm:py-28 md:py-36 bg-[#07120e] text-white border-t border-white/10">
      {/* Ambient Heritage Imagery */}
      <div className="absolute inset-0 z-0 opacity-25">
        <Image
          alt="Ancient 5th-Century Hydraulic Sanctuary"
          className="object-cover object-center filter saturate-50"
          fill
          priority={false}
          src="/images/heritage-legacy.jpg"
        />
        {/* Dual Vignette Gradients for Editorial Luxury Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07120e] via-[#07120e]/90 to-[#07120e]/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1914] via-transparent to-[#0B1914]" />
      </div>

      {/* Existing Text & 4-Stat Metric Cards remain crisp & fully legible on top */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Split Top Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-20">
          <div className="lg:col-span-7">
            <span className="tracking-[0.35em] text-xs font-semibold text-[#C8A97E] uppercase block mb-4">
              WILDERNESS CONSERVATION &amp; HERITAGE
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-white leading-tight">
              Protecting King Dhatusena&apos;s 5th Century Legacy
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm md:text-base text-gray-300 font-light leading-relaxed">
              Every expedition directly funds indigenous wetland naturalists, zero-plastic non-motorized paddling charters, and real-time wild Asian elephant corridor monitoring across Kalawewa Reservoir.
            </p>
          </div>
        </div>

        {/* 4 Impact Stat Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 border-t border-white/10 pt-16">
          {impactStats.map((stat, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <span className="font-serif text-4xl sm:text-5xl font-normal text-[#C8A97E]">
                {stat.number}
              </span>
              <h3 className="font-serif text-xl text-white font-normal">
                {stat.label}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
