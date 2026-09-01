'use client';

import React from 'react';
import Image from 'next/image';

export default function AboutSection() {
  return (
    <section id="about" className="w-full bg-[#142D28] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto pt-28 md:pt-36 pb-24 md:pb-32 px-8 md:px-16">
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
              
              <div className="relative aspect-[4/5] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-[#c8b8a6]/20">
                <Image
                  alt="Majestic Sri Lankan Tusker crossing Kalawewa wetlands"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  src="/images/about-elephant.jpg"
                />
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
