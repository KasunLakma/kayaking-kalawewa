'use client';

import React from 'react';

const pillars = [
  {
    id: 'naturalists',
    title: 'Expert Local Naturalists & Guides',
    description: 'Every expedition is led by indigenous Kalawewa naturalists who possess deep knowledge of reservoir channels, bird habitats, and elephant corridors.',
    badge: 'Certified Naturalists',
    icon: (
      <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    id: 'safety-gear',
    title: 'Certified Safety Gear & Floatation Aids',
    description: 'We provide ISO-certified life jackets, ergonomic composite paddles, waterproof dry bags, and backrest support seats tailored for all age groups.',
    badge: '100% Safety Verified',
    icon: (
      <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: 'sustainable-eco',
    title: 'Sustainable & Leave-No-Trace Eco Tourism',
    description: 'Zero-plastic pledge and non-motorized paddling protect the pristine water quality of King Dhatusena’s reservoir and its wildlife.',
    badge: 'Zero-Plastic Standard',
    icon: (
      <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    id: 'weather-monitoring',
    title: 'Real-time Weather & Water Level Monitoring',
    description: 'Pre-departure water level evaluations and wind forecast checks ensure every kayak launch takes place in optimal, safe conditions.',
    badge: 'Daily Hydrology Checks',
    icon: (
      <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 15a4 4 0 004 4h9a5 5 0 001-9.9 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
  },
];

export default function WildernessDifference() {
  return (
    <section id="why-kalawewa" className="w-full bg-[#121816] py-24 px-4 sm:px-6 lg:px-12 text-white relative overflow-hidden border-t border-b border-emerald-950">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-black tracking-widest uppercase shadow-sm">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            THE KALAWEWA DIFFERENCE
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-serif">
            Unrivaled Expertise, Uncompromised Safety
          </h2>

          <p className="text-sm sm:text-base text-emerald-100/80 font-light max-w-2xl mx-auto leading-relaxed">
            Modeled after global wilderness travel standards, our operations prioritize eco-preservation, safety guarantees, and authentic local immersion.
          </p>
        </div>

        {/* 4-Column Feature Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="group relative bg-[#0D231C] rounded-2xl p-6 border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
            >
              {/* Subtle top gold accent glow on hover */}
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div>
                {/* Icon Container */}
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3.5 rounded-xl bg-[#121816] border border-[#D4AF37]/30 shadow-inner group-hover:border-[#D4AF37] transition-all duration-300">
                    {pillar.icon}
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider">
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors leading-snug font-serif">
                  {pillar.title}
                </h3>

                <p className="text-xs sm:text-sm text-emerald-100/75 leading-relaxed font-light">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-900/60 text-[11px] font-bold text-[#D4AF37]/90 uppercase tracking-wider flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                Wilderness Travel Promise
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
