'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function CustomJourneys() {
  const [isImageVisible, setIsImageVisible] = useState<boolean>(false);
  const [isTextVisible, setIsTextVisible] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string>(
    'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1920&q=80'
  );
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stage 1: Reveal background image first
          setIsImageVisible(true);

          // Stage 2: Delayed text entrance reveal (400ms)
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
      {/* Full-Bleed Background Photography (Stage 1 Reveal) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={imgSrc}
          onError={() => {
            setImgSrc(
              'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1920&q=80'
            );
          }}
          alt="Bespoke Kalawewa Kayaking Expedition"
          className={`w-full h-full object-cover object-center transition-all duration-1000 ease-out ${
            isImageVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />
        
        {/* Dark Vignette / Gradient Overlay that deepens when text appears */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            isTextVisible
              ? 'bg-gradient-to-t from-black/80 via-black/50 to-black/70 opacity-100'
              : 'bg-gradient-to-t from-black/60 via-black/30 to-black/50 opacity-80'
          }`}
        />
      </div>

      {/* Centered Staggered Scroll-Reveal Content (Stage 2 Reveal) */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        
        {/* 1. Overline (Animates first, delay-0) */}
        <span
          className={`tracking-[0.35em] text-xs font-semibold text-[#D4AF37] uppercase mb-4 block transition-all duration-1000 ease-out ${
            isTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          OUR BESPOKE EXPEDITIONS
        </span>

        {/* 2. Large Serif Title (Animates second, delay-150) */}
        <h2
          className={`font-serif text-4xl md:text-6xl text-white font-normal leading-tight max-w-3xl mx-auto mb-6 transition-all duration-1000 ease-out delay-150 ${
            isTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          Tailor-made journeys for every explorer
        </h2>

        {/* 3. Story Paragraph (Animates third, delay-300) */}
        <p
          className={`text-sm md:text-base text-gray-200 font-light leading-relaxed max-w-xl mx-auto mb-8 transition-all duration-1000 ease-out delay-300 ${
            isTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          We invite you on a private expedition across King Dhatusena&apos;s historic reservoir. From tranquil sunrise paddles among misty lotus lagoons to sunset wildlife encounters along elephant corridors, every journey is handcrafted to your rhythm.
        </p>

        {/* 4. Interactive CTA Button (Animates last, delay-450) */}
        <a
          href="#about"
          className={`tracking-[0.25em] text-xs font-bold text-white hover:text-[#D4AF37] transition-all duration-1000 ease-out delay-450 inline-flex items-center gap-3 group cursor-pointer ${
            isTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <span>EXPLORE OUR PRIVATE EXPEDITIONS</span>
          <span className="w-8 h-8 rounded-full border border-white/40 group-hover:border-[#D4AF37] flex items-center justify-center transition-colors">
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </span>
        </a>

      </div>
    </section>
  );
}
