'use client';

import React from 'react';

interface AssuranceItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
}

const assuranceCards: AssuranceItem[] = [
  {
    id: 'life-jackets',
    title: 'Certified Life Jackets & Buoyancy Aids',
    description: 'Standard safety gear provided for all ages, sanitized and fitted by certified safety instructors prior to launch.',
    badge: 'ISO Certified',
    icon: (
      <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v4m0 4h.01" />
      </svg>
    ),
  },
  {
    id: 'guides',
    title: 'Experienced Local Guides & Rescue Ready',
    description: 'Trained local guides accompany every expedition, equipped with wilderness first aid and swift-water rescue certification.',
    badge: 'Wilderness Trained',
    icon: (
      <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 'eco-friendly',
    title: 'Eco-Friendly & Leave No Trace',
    description: 'Strict zero-plastic policy preserving Kalawewa wildlife habitats, migratory bird nests, and tranquil waters.',
    badge: 'Zero-Plastic Policy',
    icon: (
      <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    id: 'weather-monitoring',
    title: 'Weather & Water Level Monitoring',
    description: 'Daily safety checks and real-time hydrological evaluations before launching any kayak into the reservoir.',
    badge: 'Real-Time Monitoring',
    icon: (
      <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 15a4 4 0 004 4h9a5 5 0 001-9.9 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
  },
];

export default function SafetySection() {
  return (
    <section id="safety" className="w-full bg-[#0A1F18] py-20 px-4 sm:px-6 lg:px-12 text-slate-100 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs sm:text-sm font-bold tracking-widest uppercase mb-4 shadow-sm">
            <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Uncompromised Safety & Stewardship
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Safety Assurance & Eco Guidelines
          </h2>
          
          <p className="text-base sm:text-lg text-emerald-100/80 font-light leading-relaxed">
            Inspired by world-class wilderness travel standards, your security and the conservation of Kalawewa&apos;s natural ecosystem are our highest priorities on every paddle expedition.
          </p>
        </div>

        {/* 4 Key Assurance Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {assuranceCards.map((card) => (
            <div
              key={card.id}
              className="group relative bg-[#0F2A21]/90 rounded-2xl p-6 border border-emerald-800/40 hover:border-[#D4AF37]/60 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
            >
              {/* Gold Top Accent Line on Hover */}
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div>
                {/* Icon & Badge Container */}
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3.5 rounded-xl bg-[#0A1F18] border border-[#D4AF37]/30 shadow-inner group-hover:border-[#D4AF37] group-hover:scale-105 transition-all duration-300">
                    {card.icon}
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-semibold tracking-wide">
                    {card.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors leading-snug">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-emerald-100/75 leading-relaxed font-light">
                  {card.description}
                </p>
              </div>

              {/* Bottom Assurance Indicator */}
              <div className="mt-6 pt-4 border-t border-emerald-900/60 flex items-center gap-2 text-xs font-semibold text-[#D4AF37]/90">
                <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Wilderness Standard Guarantee</span>
              </div>
            </div>
          ))}
        </div>

        {/* Kalawewa Cultural & Ecological Significance Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0E281F] via-[#123328] to-[#0E281F] border border-[#D4AF37]/40 p-8 sm:p-10 shadow-2xl">
          {/* Subtle decorative glow line */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-3">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                Living Heritage & Wildlife Sanctuary
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
                Preserving Kalawewa&apos;s Ancient Legacy
              </h3>
              <p className="text-sm sm:text-base text-emerald-100/85 leading-relaxed font-light">
                Constructed in the 5th Century AD by King Dhatusena, Kalawewa Reservoir is an ancient hydraulic marvel and a vital wetland sanctuary. Home to majestic wild Asian elephant herds, rare waterbirds, and serene lotus bays, our eco-tours follow strict leave-no-trace protocols to ensure this historic ecosystem remains untamed and pristine for generations.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
              <div className="px-5 py-3 rounded-xl bg-[#0A1F18]/80 border border-[#D4AF37]/30 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-emerald-200/60 uppercase font-semibold">Established</div>
                  <div className="text-sm font-bold text-white">5th Century AD (King Dhatusena)</div>
                </div>
              </div>

              <div className="px-5 py-3 rounded-xl bg-[#0A1F18]/80 border border-[#D4AF37]/30 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-emerald-200/60 uppercase font-semibold">Conservation</div>
                  <div className="text-sm font-bold text-white">100% Eco-Guided & Plastic-Free</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
