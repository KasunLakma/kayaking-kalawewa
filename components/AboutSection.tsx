'use client';

import React, { useState } from 'react';

export default function AboutSection() {
  const [imgSrc, setImgSrc] = useState<string>(
    'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80'
  );

  return (
    <section id="about" className="w-full bg-[#142D28] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto py-28 md:py-36 px-8 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* A. LEFT COLUMN (Typography & Narrative) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Category Overline */}
            <span className="tracking-[0.3em] text-xs font-semibold text-gray-300 uppercase mb-6 block">
              WE ARE KALAWEWA ADVENTURES
            </span>

            {/* Big Editorial Serif H2 */}
            <h2 className="font-serif text-4xl md:text-6xl font-normal leading-[1.15] text-white max-w-xl mb-12">
              Discover Sri Lanka&apos;s ultimate, untamed waters
            </h2>

            {/* Two Narrative Paragraphs */}
            <div className="text-sm md:text-base text-gray-300 font-light leading-relaxed space-y-6 max-w-lg">
              <p>
                As premier custodians of ancient freshwater kayaking expeditions, we guide you across King Dhatusena’s historic 5th-century reservoir. Every charter is escorted by certified local instructors equipped with international-grade life jackets, safety gear, and strict eco-tourism guidelines to protect pristine wetland ecosystems.
              </p>
              <p>
                To elevate your experience, we have transitioned from scattered social messaging across Messenger and WhatsApp to an official automated booking experience. Reserve your slot seamlessly online with Pay on Arrival (COD) options and real-time confirmation.
              </p>
            </div>
          </div>

          {/* B. RIGHT COLUMN (Tall Portrait Wildlife / Nature Showcase) */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <div className="relative flex items-center gap-4 w-full max-w-md lg:max-w-none">
              
              {/* Large portrait image container (aspect ratio 3:4, rounded-sm overflow-hidden shadow-2xl relative) */}
              <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden shadow-2xl group border border-white/10">
                <img
                  src={imgSrc}
                  onError={() => {
                    setImgSrc(
                      'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80'
                    );
                  }}
                  alt="Sri Lanka Untamed Wildlife & Waters of Kalawewa"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#142D28]/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />
              </div>

              {/* Micro Detail: Subtle vertical rotated text next to the image */}
              <div
                style={{ writingMode: 'vertical-rl' }}
                className="hidden sm:block [writing-mode:vertical-rl] tracking-widest text-[10px] text-gray-400 uppercase select-none opacity-70 hover:opacity-100 transition-opacity shrink-0"
              >
                #KALAWEWAADVENTURES
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
