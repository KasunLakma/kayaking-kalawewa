'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function CustomJourneys() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string>(
    'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1920&q=80'
  );
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.25 }
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
            setImgSrc(
              'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1920&q=80'
            );
          }}
          alt="Bespoke Kalawewa Kayaking Expedition"
          className={`w-full h-full object-cover object-center transition-transform duration-1000 ease-out ${
            isVisible ? 'scale-100' : 'scale-105'
          }`}
        />
        
        {/* Subtle Dark Vignette / Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1914] via-black/50 to-[#0B1914]/80" />
      </div>

      {/* Centered Scroll-Reveal Content */}
      <div
        className={`relative z-10 max-w-4xl mx-auto px-6 py-20 transition-all duration-1000 ease-out transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        {/* Overline */}
        <span className="tracking-[0.35em] text-xs font-semibold text-[#D4AF37] uppercase mb-4 block">
          OUR BESPOKE EXPEDITIONS
        </span>

        {/* Large Serif Title */}
        <h2 className="font-serif text-4xl md:text-6xl text-white font-normal leading-tight max-w-3xl mx-auto mb-6">
          Tailor-made journeys for every explorer
        </h2>

        {/* Story Paragraph */}
        <p className="text-sm md:text-base text-gray-200 font-light leading-relaxed max-w-xl mx-auto mb-8">
          We invite you on a private expedition across King Dhatusena&apos;s historic reservoir. From tranquil sunrise paddles among misty lotus lagoons to sunset wildlife encounters along elephant corridors, every journey is handcrafted to your rhythm.
        </p>

        {/* Interactive CTA Link / Button */}
        <a
          href="#featured-trips"
          className="tracking-[0.25em] text-xs font-bold text-white hover:text-[#D4AF37] transition inline-flex items-center gap-3 group cursor-pointer"
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
