'use client';

import React from 'react';

const heritagePillars = [
  {
    number: '01',
    title: 'Indigenous Naturalists & Wilderness Escort',
    description: 'Every expedition is guided by native Kalawewa naturalists possessing deep knowledge of reservoir channels, bird habitats, and wild Asian elephant corridors.',
  },
  {
    number: '02',
    title: 'ISO-Certified Safety & Floatation Standards',
    description: 'Standardized life jackets, composite paddles, waterproof gear, and swift-water rescue trained personnel accompany all water charter launches.',
  },
  {
    number: '03',
    title: 'Zero-Plastic & Leave-No-Trace Conservation',
    description: 'Our non-motorized silent paddling charter preserves the pristine aquatic ecology of King Dhatusena’s reservoir and its migratory bird colonies.',
  },
  {
    number: '04',
    title: 'Real-Time Hydrology & Weather Monitoring',
    description: 'Pre-departure water level evaluations and wind forecast checks ensure every kayak launch takes place in optimal, tranquil conditions.',
  },
];

export default function WildernessDifference() {
  return (
    <section id="why-kalawewa" className="w-full bg-[#08120E] text-[#F4F1EA] relative overflow-hidden">
      
      {/* 100vw Edge-to-Edge Full-Bleed Panoramic Visual Banner */}
      <div className="relative w-full min-h-[650px] lg:h-[750px] flex items-center justify-center overflow-hidden py-24 px-6">
        {/* Background Panoramic Lake Sunset Photography */}
        <img
          src="/images/hero-night-moon.jpg"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80";
          }}
          alt="Kalawewa Lake Sunset Elephant Sanctuary"
          className="absolute inset-0 w-full h-full object-cover object-center animate-slow-zoom"
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08120E] via-[#08120E]/60 to-[#08120E]/80" />

        {/* Centered Luxury Editorial Typography */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 px-4">
          <span className="tracking-[0.35em] text-xs md:text-sm font-medium text-[#C8A97E] uppercase block">
            KING DHATUSENA&apos;S 5TH CENTURY WATERS
          </span>

          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#F4F1EA] leading-[1.15] tracking-tight">
            A Sanctuary Where Wild Asian Elephants Meet Ancient Hydraulic Grandeur.
          </h2>

          <p className="text-base sm:text-lg text-[#F4F1EA]/85 font-light max-w-2xl mx-auto leading-relaxed pt-2">
            Constructed in the 5th Century AD, Kalawewa Reservoir stands as an ancient engineering triumph. Today, it remains Sri Lanka&apos;s premier undisturbed wetland for wild elephant herds, endemic waterbirds, and tranquil lotus coves.
          </p>

          <div className="pt-6">
            <a
              href="#safety"
              className="inline-block px-8 py-4 border border-[#C8A97E] text-[#F4F1EA] hover:bg-[#C8A97E] hover:text-[#0B1914] text-xs font-medium uppercase tracking-[0.25em] transition-all duration-300 bg-transparent"
            >
              EXPLORE THE HERITAGE
            </a>
          </div>
        </div>
      </div>

      {/* Minimalist Editorial Story Columns (No dark boxed grids) */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-28 sm:py-36 border-t border-white/10">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <span className="tracking-[0.35em] text-xs font-medium text-[#C8A97E] uppercase block mb-3">
            HERITAGE &amp; CONSERVATION PILLARS
          </span>
          <h3 className="font-serif text-3xl sm:text-5xl font-normal text-[#F4F1EA]">
            The Kalawewa Wilderness Charter
          </h3>
        </div>

        {/* Minimalist 4-Column Narrative Blocks with Pure Whitespace */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
          {heritagePillars.map((pillar) => (
            <div key={pillar.number} className="flex flex-col space-y-4">
              <span className="font-serif text-3xl text-[#C8A97E] font-normal">
                {pillar.number}
              </span>
              <h4 className="font-serif text-2xl font-normal text-[#F4F1EA] leading-snug">
                {pillar.title}
              </h4>
              <p className="text-xs sm:text-sm text-[#F4F1EA]/75 font-light leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
