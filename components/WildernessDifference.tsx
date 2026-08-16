'use client';

import React from 'react';

const pillars = [
  {
    id: 'naturalists',
    title: 'Expert Local Naturalists & Guides',
    description: 'Every expedition is led by indigenous Kalawewa naturalists who possess deep knowledge of reservoir channels, bird habitats, and elephant corridors.',
    badge: 'Certified Naturalists',
    icon: (
      <svg className="w-7 h-7 text-[#C8A97E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    id: 'safety-gear',
    title: 'Certified Safety Gear & Floatation Aids',
    description: 'We provide ISO-certified life jackets, ergonomic composite paddles, waterproof dry bags, and backrest support seats tailored for all age groups.',
    badge: '100% Safety Verified',
    icon: (
      <svg className="w-7 h-7 text-[#C8A97E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: 'sustainable-eco',
    title: 'Sustainable & Leave-No-Trace Eco Tourism',
    description: 'Zero-plastic pledge and non-motorized paddling protect the pristine water quality of King Dhatusena’s reservoir and its wildlife.',
    badge: 'Zero-Plastic Standard',
    icon: (
      <svg className="w-7 h-7 text-[#C8A97E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    id: 'weather-monitoring',
    title: 'Real-time Weather & Water Level Monitoring',
    description: 'Pre-departure water level evaluations and wind forecast checks ensure every kayak launch takes place in optimal, safe conditions.',
    badge: 'Daily Hydrology Checks',
    icon: (
      <svg className="w-7 h-7 text-[#C8A97E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 001-9.9 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
  },
];

export default function WildernessDifference() {
  return (
    <section id="why-kalawewa" className="w-full bg-[#13241E] py-28 sm:py-36 px-6 lg:px-12 text-[#F4F1EA] relative overflow-hidden">
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#C8A97E]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
          <span className="tracking-[0.3em] text-xs font-medium text-[#C8A97E] uppercase block">
            THE KALAWEWA DIFFERENCE
          </span>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#F4F1EA] tracking-tight">
            Unrivaled Expertise, Uncompromised Safety
          </h2>

          <p className="text-base text-[#F4F1EA]/80 font-light max-w-2xl mx-auto leading-relaxed pt-2">
            Modeled after global luxury wilderness travel standards (Wilderness Destinations &amp; Resplendent Ceylon), our operations prioritize eco-preservation, safety guarantees, and authentic local immersion.
          </p>
        </div>

        {/* 4-Column Feature Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="group relative bg-[#0B1914]/80 backdrop-blur-md rounded-none p-8 border border-white/10 hover:border-[#C8A97E]/60 transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                {/* Icon & Badge */}
                <div className="flex items-center justify-between mb-8">
                  <div className="p-3 rounded-none bg-[#13241E] border border-[#C8A97E]/30 group-hover:border-[#C8A97E] transition-colors">
                    {pillar.icon}
                  </div>
                  <span className="px-2.5 py-1 bg-[#13241E] border border-[#C8A97E]/30 text-[#C8A97E] text-[10px] font-medium uppercase tracking-[0.2em]">
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-normal text-[#F4F1EA] mb-3 group-hover:text-[#C8A97E] transition-colors leading-snug">
                  {pillar.title}
                </h3>

                <p className="text-xs text-[#F4F1EA]/75 leading-relaxed font-light">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 text-[10px] font-medium text-[#C8A97E] uppercase tracking-[0.2em] flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Resort Charter Standard
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
