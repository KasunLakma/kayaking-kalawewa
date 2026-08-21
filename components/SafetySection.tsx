'use client';

import React from 'react';
import Image from 'next/image';

const photoPanels = [
  {
    number: '01',
    category: 'EXPERT GUIDANCE',
    title: '01. Indigenous Naturalists',
    description: 'Trained local guides accompany every expedition, equipped with swift-water rescue and wilderness first-aid certification.',
    image: '/images/sunrise-paddle.jpg',
    fallbackImg: '/images/sunrise-paddle.jpg',
  },
  {
    number: '02',
    category: 'EQUIPMENT & GEAR',
    title: '02. ISO-Grade Safety',
    description: 'ISO-certified buoyancy aids, ergonomic composite paddles, and waterproof dry bags sanitized and fitted prior to launch.',
    image: '/images/island-heritage.jpg',
    fallbackImg: '/images/island-heritage.jpg',
  },
  {
    number: '03',
    category: 'CONSERVATION',
    title: '03. Zero-Plastic Pledge',
    description: 'Non-motorized silent paddling and strict leave-no-trace protocols protect Kalawewa reservoir and its migratory bird sanctuary.',
    image: '/images/sunset-romance.jpg',
    fallbackImg: '/images/sunset-romance.jpg',
  },
];

export default function SafetySection() {
  return (
    <section id="safety" className="w-full bg-[#0B1914] py-28 sm:py-36 px-6 lg:px-12 text-[#F4F1EA] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
          <span className="tracking-[0.35em] text-xs font-medium text-[#C8A97E] uppercase block">
            SAFETY &amp; ECOLOGICAL CHARTER
          </span>
          
          <h2 className="font-serif text-4xl sm:text-6xl font-normal text-[#F4F1EA] tracking-tight">
            Uncompromised Safety, Pristine Wilderness
          </h2>
          
          <p className="text-base sm:text-lg text-[#F4F1EA]/75 font-light leading-relaxed pt-2">
            Modeled after world-class luxury wilderness travel standards, your security and the conservation of Kalawewa are guaranteed on every water charter.
          </p>
        </div>

        {/* 3 Tall Portrait Photographic Panels (Aspect 3:4 / h-[520px] to h-[580px]) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {photoPanels.map((panel) => (
            <div
              key={panel.number}
              className="group relative h-[520px] sm:h-[580px] w-full overflow-hidden flex flex-col justify-between p-8 text-[#F4F1EA] shadow-2xl cursor-pointer"
            >
              {/* Photo Background */}
              <Image
                src={panel.image}
                alt={panel.title}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                sizes="(max-width: 768px) 100vw, 33vw"
              />

              {/* Dark Vignette Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1914] via-[#0B1914]/50 to-black/30 z-10 pointer-events-none" />

              {/* Top Category Badge */}
              <div className="relative z-20 flex items-center justify-between w-full">
                <span className="px-3 py-1 bg-[#0B1914]/80 backdrop-blur-md border border-[#C8A97E]/30 text-[10px] font-medium tracking-[0.25em] uppercase text-[#C8A97E]">
                  {panel.category}
                </span>
                <span className="font-serif text-2xl text-[#C8A97E]">
                  {panel.number}
                </span>
              </div>

              {/* Bottom Details Overlay */}
              <div className="relative z-20 mt-auto space-y-3">
                <h3 className="font-serif text-3xl font-normal text-[#F4F1EA] group-hover:text-[#C8A97E] transition-colors leading-snug">
                  {panel.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#F4F1EA]/80 font-light leading-relaxed">
                  {panel.description}
                </p>
                <div className="pt-2 flex items-center gap-2 text-[10px] font-medium text-[#C8A97E] tracking-[0.25em] uppercase">
                  <span>WILDERNESS CHARTER PLEDGE</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
