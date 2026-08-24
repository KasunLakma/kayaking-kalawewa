'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function CustomJourneys() {
  const [isImageVisible, setIsImageVisible] = useState<boolean>(false);
  const [isTextVisible, setIsTextVisible] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string>(
    '/images/wildlife-elephant.jpg'
  );
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsImageVisible(true);
          const textTimer = setTimeout(() => {
            setIsTextVisible(true);
          }, 400);
          return () => clearTimeout(textTimer);
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="custom-journeys"
      className="min-h-[90vh] md:min-h-screen relative flex items-center justify-center text-center overflow-hidden bg-[#0B1914] text-white"
    >
      {/* Full-Bleed Background Photography */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={imgSrc}
          onError={() => {
            setImgSrc('/images/wildlife-elephant.jpg');
          }}
          alt="Bespoke Kalawewa Kayaking Expedition"
          className={`w-full h-full object-cover object-center transition-all duration-1000 ease-out ${
            isImageVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />
        
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            isTextVisible
              ? 'bg-gradient-to-t from-black/80 via-black/50 to-black/70 opacity-100'
              : 'bg-gradient-to-t from-black/60 via-black/30 to-black/50 opacity-80'
          }`}
        />
      </div>

      {/* Centered Staggered Scroll-Reveal Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        
        <span
          className={`tracking-[0.35em] text-xs font-semibold text-[#D4AF37] uppercase mb-4 block transition-all duration-1000 ease-out ${
            isTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          SAFETY &amp; BESPOKE EXPEDITIONS
        </span>

        <h2
          className={`font-serif text-4xl md:text-6xl text-white font-normal leading-tight max-w-3xl mx-auto mb-6 transition-all duration-1000 ease-out delay-150 ${
            isTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          Tailor-made eco-adventures with uncompromised safety
        </h2>

        <p
          className={`text-sm md:text-base text-gray-200 font-light leading-relaxed max-w-xl mx-auto mb-8 transition-all duration-1000 ease-out delay-300 ${
            isTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          Every expedition is equipped with international-grade life jackets, certified safety instructors, and real-time lake condition monitoring. From solo paddlers to family expeditions, we guarantee seamless adventure.
        </p>

        {/* Action Buttons */}
        <div
          className={`flex flex-wrap items-center justify-center gap-4 transition-all duration-1000 ease-out delay-450 ${
            isTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <Link
            href="/booking"
            className="px-8 py-3.5 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-lg rounded-none"
          >
            BOOK NOW
          </Link>
          <Link
            href="/packages"
            className="px-8 py-3.5 bg-black/60 hover:bg-black/90 border border-[#C8A97E]/50 text-[#C8A97E] hover:text-white text-xs font-medium uppercase tracking-[0.2em] transition-all rounded-none"
          >
            EXPLORE ALL EXPEDITIONS
          </Link>
        </div>

      </div>
    </section>
  );
}
