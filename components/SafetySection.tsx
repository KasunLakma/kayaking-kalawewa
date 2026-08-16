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
      <svg className="w-7 h-7 text-[#C8A97E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01" />
      </svg>
    ),
  },
  {
    id: 'guides',
    title: 'Experienced Local Guides & Rescue Ready',
    description: 'Trained local guides accompany every expedition, equipped with wilderness first aid and swift-water rescue certification.',
    badge: 'Wilderness Trained',
    icon: (
      <svg className="w-7 h-7 text-[#C8A97E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 'eco-friendly',
    title: 'Eco-Friendly & Leave No Trace',
    description: 'Strict zero-plastic policy preserving Kalawewa wildlife habitats, migratory bird nests, and tranquil waters.',
    badge: 'Zero-Plastic Policy',
    icon: (
      <svg className="w-7 h-7 text-[#C8A97E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    id: 'weather-monitoring',
    title: 'Weather & Water Level Monitoring',
    description: 'Daily safety checks and real-time hydrological evaluations before launching any kayak into the reservoir.',
    badge: 'Real-Time Monitoring',
    icon: (
      <svg className="w-7 h-7 text-[#C8A97E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 001-9.9 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
  },
];

export default function SafetySection() {
  return (
    <section id="safety" className="w-full bg-[#0B1914] py-28 sm:py-36 px-6 lg:px-12 text-[#F4F1EA] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#C8A97E]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
          <span className="tracking-[0.3em] text-xs font-medium text-[#C8A97E] uppercase block">
            SAFETY &amp; ECOLOGICAL CHARTER
          </span>
          
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#F4F1EA]">
            Safety Assurance &amp; Eco Guidelines
          </h2>
          
          <p className="text-base text-[#F4F1EA]/80 font-light leading-relaxed pt-2">
            Inspired by world-class wilderness travel standards, your security and the conservation of Kalawewa&apos;s natural ecosystem are our highest priorities on every paddle expedition.
          </p>
        </div>

        {/* 4 Key Assurance Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {assuranceCards.map((card) => (
            <div
              key={card.id}
              className="group relative bg-[#13241E]/80 backdrop-blur-md rounded-none p-8 border border-white/10 hover:border-[#C8A97E]/60 transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                {/* Icon & Badge Container */}
                <div className="flex items-center justify-between mb-8">
                  <div className="p-3 rounded-none bg-[#0B1914] border border-[#C8A97E]/30 group-hover:border-[#C8A97E] transition-colors">
                    {card.icon}
                  </div>
                  <span className="px-2.5 py-1 bg-[#0B1914] border border-[#C8A97E]/30 text-[#C8A97E] text-[10px] font-medium tracking-[0.2em] uppercase">
                    {card.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-2xl font-normal text-[#F4F1EA] mb-3 group-hover:text-[#C8A97E] transition-colors leading-snug">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#F4F1EA]/75 leading-relaxed font-light">
                  {card.description}
                </p>
              </div>

              {/* Bottom Assurance Indicator */}
              <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2 text-[10px] font-medium text-[#C8A97E] tracking-[0.2em] uppercase">
                <svg className="w-3.5 h-3.5 text-[#C8A97E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Wilderness Safety Standard</span>
              </div>
            </div>
          ))}
        </div>

        {/* Heritage Banner */}
        <div className="relative rounded-none overflow-hidden bg-[#13241E] border border-[#C8A97E]/30 p-8 sm:p-14 shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-3xl space-y-4">
              <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#C8A97E] block">
                Living Heritage &amp; Wildlife Sanctuary
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#F4F1EA] tracking-tight">
                Preserving Kalawewa&apos;s Ancient Legacy
              </h3>
              <p className="text-sm text-[#F4F1EA]/80 leading-relaxed font-light">
                Constructed in the 5th Century AD by King Dhatusena, Kalawewa Reservoir is an ancient hydraulic marvel and a vital wetland sanctuary. Home to majestic wild Asian elephant herds, rare waterbirds, and serene lotus bays, our eco-tours follow strict leave-no-trace protocols to ensure this historic ecosystem remains untamed and pristine for generations.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-4 w-full lg:w-auto">
              <div className="px-6 py-4 rounded-none bg-[#0B1914] border border-[#C8A97E]/30 flex items-center gap-4">
                <div className="text-[#C8A97E]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[9px] text-[#C8A97E] uppercase font-medium tracking-[0.2em]">Established</div>
                  <div className="text-sm font-normal text-[#F4F1EA] font-serif">5th Century AD (King Dhatusena)</div>
                </div>
              </div>

              <div className="px-6 py-4 rounded-none bg-[#0B1914] border border-[#C8A97E]/30 flex items-center gap-4">
                <div className="text-[#C8A97E]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div>
                  <div className="text-[9px] text-[#C8A97E] uppercase font-medium tracking-[0.2em]">Conservation</div>
                  <div className="text-sm font-normal text-[#F4F1EA] font-serif">100% Eco-Guided &amp; Plastic-Free</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
