'use client';

import React, { useState } from 'react';

interface Experience {
  id: string;
  number: string;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  fallbackUrl: string;
}

const experiences: Experience[] = [
  {
    id: 'sunrise-lotus-drift',
    number: '01',
    title: 'Sunrise Lotus Drift',
    description: 'Drift through early morning mist and blooming lotus bays as the 5th-century reservoir awakens to dawn calls of endemic waterbirds.',
    location: 'Kalawewa Lotus Lagoons, Sri Lanka',
    imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1000&q=80',
    fallbackUrl: '/images/sunrise-paddle.jpg',
  },
  {
    id: 'sunset-golden-hour',
    number: '02',
    title: 'Sunset Golden Hour',
    description: 'Tranquil evening paddles with reflection photography as amber sunset hues cast golden light across quiet reservoir waters.',
    location: 'Kalawewa Western Coves, Sri Lanka',
    imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1000&q=80',
    fallbackUrl: '/images/sunset-romance.jpg',
  },
  {
    id: 'wild-elephant-corridor',
    number: '03',
    title: 'Wild Elephant Corridor',
    description: 'Safe distance observation of wildlife along lake banks and elephant drinking trails under guided safety supervision.',
    location: 'Elephant Sanctuary Corridor, Kalawewa',
    imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1000&q=80',
    fallbackUrl: '/images/wildlife-elephant.jpg',
  },
  {
    id: 'island-camp-refreshment',
    number: '04',
    title: 'Island Camp Refreshment',
    description: 'Traditional herbal tea stop on secluded rocky islets, stepping ashore to enjoy fresh island teas and king coconuts.',
    location: 'King Dhatusena Islets, Sri Lanka',
    imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1000&q=80',
    fallbackUrl: '/images/island-heritage.jpg',
  },
];

export default function ExperiencePortals() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + experiences.length) % experiences.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % experiences.length);
  };

  const handleImageError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="w-full bg-[#0E1110] text-white py-28 md:py-36 relative overflow-hidden">
      
      {/* Section Title Header */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <span className="tracking-[0.35em] text-xs font-semibold text-[#C8A97E] uppercase block mb-3">
          EXCLUSIVE RESORT PORTALS
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white tracking-tight">
          Sacred Waters &amp; Wilderness Sanctuary
        </h2>
      </div>

      {/* Portal Slider Stage Container */}
      <div className="relative w-full min-h-[460px] md:min-h-[520px] flex items-center justify-center overflow-hidden px-4">
        
        {/* Render all experiences in cyclic positions */}
        {experiences.map((item, idx) => {
          let diff = idx - currentIndex;
          const total = experiences.length;
          if (diff > Math.floor(total / 2)) diff -= total;
          if (diff < -Math.floor(total / 2)) diff += total;

          const isFailed = imgErrors[item.id];
          const currentImgSrc = isFailed ? item.fallbackUrl : item.imageUrl;

          if (diff === 0) {
            // Active Center Portal (Circular Image Portal + Deep Teal Box)
            return (
              <div
                key={item.id}
                className="z-20 transition-all duration-700 ease-in-out flex flex-col md:flex-row items-center justify-center max-w-4xl w-full"
              >
                {/* LEFT: Large Circular Image Portal */}
                <div className="relative w-[290px] sm:w-[370px] md:w-[450px] h-[290px] sm:h-[370px] md:h-[450px] rounded-full overflow-hidden shadow-2xl border-2 border-white/10 shrink-0 z-20 group">
                  <img
                    src={currentImgSrc}
                    onError={() => handleImageError(item.id)}
                    alt={item.title}
                    className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* RIGHT: Sleek Deep Teal Box */}
                <div className="bg-[#122B25] p-8 sm:p-10 md:p-12 flex flex-col justify-between rounded-r-lg max-w-md w-full md:-ml-12 z-10 -mt-10 md:mt-0 h-[290px] sm:h-[330px] md:h-[360px] border border-white/5 shadow-2xl">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal mb-3 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed mb-6">
                      {item.description}
                    </p>
                  </div>

                  <div>
                    <a
                      href="#custom-journeys"
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A97E] hover:text-white transition-colors group mb-4 cursor-pointer"
                    >
                      <span>→ EXPLORE EXPERIENCE</span>
                    </a>
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-400 font-light pt-3 border-t border-white/10">
                      <span>📍 {item.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          if (diff === 1 || diff === -1) {
            // Adjacent Side Circular Portals (Scaled-down preview on edges)
            const isNext = diff === 1;
            return (
              <div
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`hidden lg:block absolute transition-all duration-700 ease-in-out cursor-pointer z-10 ${
                  isNext
                    ? 'right-[-120px] xl:right-[-60px] translate-x-0'
                    : 'left-[-120px] xl:left-[-60px] translate-x-0'
                }`}
              >
                <div className="relative w-[280px] h-[280px] rounded-full overflow-hidden border border-white/10 opacity-30 hover:opacity-60 transition-opacity scale-90 shadow-xl">
                  <img
                    src={currentImgSrc}
                    onError={() => handleImageError(item.id)}
                    alt={item.title}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              </div>
            );
          }

          return null;
        })}

      </div>

      {/* Slider Controls & Numbering (Bottom Right) */}
      <div className="max-w-7xl mx-auto px-6 mt-12 flex items-center justify-center md:justify-end gap-6 z-30 relative">
        <span className="font-mono text-xs text-gray-400 tracking-widest">
          0{currentIndex + 1} / 0{experiences.length}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            aria-label="Previous Experience"
            className="w-10 h-10 rounded-full border border-white/20 text-white hover:border-[#C8A97E] hover:text-[#C8A97E] transition-all flex items-center justify-center cursor-pointer bg-white/5 hover:bg-white/10"
          >
            ←
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Experience"
            className="w-10 h-10 rounded-full border border-white/20 text-white hover:border-[#C8A97E] hover:text-[#C8A97E] transition-all flex items-center justify-center cursor-pointer bg-white/5 hover:bg-white/10"
          >
            →
          </button>
        </div>
      </div>

    </section>
  );
}
