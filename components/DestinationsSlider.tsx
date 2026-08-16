'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ExpeditionSlide {
  id: string;
  category: string;
  displayTitle: string;
  fullTitle: string;
  duration: string;
  price: string;
  imageUrl: string;
  fallbackUrl: string;
  description: string;
}

const expeditions: ExpeditionSlide[] = [
  {
    id: 'sunrise-expedition',
    category: 'SUNRISE EXPEDITION',
    displayTitle: 'S U N R I S E  P A D D L E',
    fullTitle: 'Golden Mist Dawn Kayak Charter',
    duration: '2 Hours',
    price: 'LKR 3,500',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80',
    fallbackUrl: '/images/sunrise-paddle.jpg',
    description: 'Paddle through morning lake mist, lotus sanctuaries, and roosting waterbird colonies as dawn breaks over King Dhatusena’s reservoir.',
  },
  {
    id: 'sunset-romance',
    category: 'SUNSET ROMANCE',
    displayTitle: 'S U N S E T  R O M A N C E',
    fullTitle: 'Twilight Lake Photography & Sunset Cruise',
    duration: '2.5 Hours',
    price: 'LKR 6,500',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    fallbackUrl: '/images/sunset-romance.jpg',
    description: 'Glide into crimson horizon views as distant mountain silhouettes reflect on tranquil waters. Includes fresh tropical juice.',
  },
  {
    id: 'island-heritage',
    category: 'ISLAND HERITAGE',
    displayTitle: 'I S L A N D  H E R I T A G E',
    fullTitle: '5th Century Kalawewa Island Tour',
    duration: '3 Hours',
    price: 'LKR 5,000',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    fallbackUrl: '/images/island-tour.jpg',
    description: 'Island hopping across ancient submerged coves guided by native naturalists detailing 5th-century hydraulic engineering.',
  },
  {
    id: 'wildlife-corridor',
    category: 'WILDLIFE CORRIDOR',
    displayTitle: 'W I L D L I F E  C O R R I D O R',
    fullTitle: 'Wild Asian Elephant Wetland Safari',
    duration: '4 Hours',
    price: 'LKR 8,500',
    imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1600&q=80',
    fallbackUrl: '/images/full-day.jpg',
    description: 'Silent non-motorized paddling along quiet elephant drinking trails and flooded forest channels with safety escort.',
  },
  {
    id: 'night-expedition',
    category: 'NIGHT EXPEDITION',
    displayTitle: 'N I G H T  E X P E D I T I O N',
    fullTitle: 'Starlight & Bioluminescent Waters Charter',
    duration: '2 Hours',
    price: 'LKR 7,000',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1600&q=80',
    fallbackUrl: '/images/hero-night-moon.jpg',
    description: 'An ethereal nocturnal journey under clear tropical stars with specialized night-vision scopes and low-impact navigation.',
  },
];

const tabs = [
  'SUNRISE EXPEDITION',
  'SUNSET ROMANCE',
  'ISLAND HERITAGE',
  'WILDLIFE CORRIDOR',
  'NIGHT EXPEDITION',
];

export default function DestinationsSlider() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const sliderRef = useRef<HTMLDivElement>(null);

  // Auto-play interval timer (4500ms), paused on hover
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % expeditions.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isHovered]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? expeditions.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === expeditions.length - 1 ? 0 : prev + 1));
  };

  const handleImageError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="w-full bg-[#C8B8A6] text-[#0E1B17] py-24 md:py-32 relative overflow-hidden">
      
      {/* Category Pills Header */}
      <div className="max-w-7xl mx-auto px-6 mb-12 sm:mb-16 text-center">
        <span className="tracking-[0.35em] text-xs font-semibold text-[#0E1B17]/70 uppercase block mb-6">
          WILDERNESS DESTINATIONS
        </span>

        {/* Centered horizontal tab list at the top with subtle glass/capsule backing */}
        <div className="w-full flex justify-center overflow-x-auto no-scrollbar py-2">
          <div className="bg-black/5 rounded-full px-6 py-2.5 inline-flex gap-6 sm:gap-8 max-w-full items-center shadow-inner border border-black/5 shrink-0">
            {tabs.map((tab, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveIndex(idx)}
                  className={`tracking-[0.2em] text-xs font-semibold uppercase transition-all duration-500 whitespace-nowrap cursor-pointer relative py-1 ${
                    isActive
                      ? 'text-[#0E1B17]'
                      : 'text-[#0E1B17]/50 hover:text-[#0E1B17]/80'
                  }`}
                >
                  {tab}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0E1B17] rounded-full transition-all duration-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Full Interactive Expedition Slider Container with Pause-on-Hover */}
      <div
        className="relative w-full overflow-hidden"
        ref={sliderRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        {/* Navigation Arrow Controls (Left & Right) */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-4 sm:left-8 md:left-16 top-1/2 -translate-y-1/2 z-30 p-3.5 sm:p-4 rounded-full bg-[#0E1B17]/85 border border-white/20 text-white hover:bg-[#0E1B17] hover:scale-105 transition-all shadow-2xl cursor-pointer"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-4 sm:right-8 md:right-16 top-1/2 -translate-y-1/2 z-30 p-3.5 sm:p-4 rounded-full bg-[#0E1B17]/85 border border-white/20 text-white hover:bg-[#0E1B17] hover:scale-105 transition-all shadow-2xl cursor-pointer"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dynamic Centered Slides Flex Track */}
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] items-center"
          style={{
            transform: `translateX(calc(50vw - ${(activeIndex * 76) + 38}vw))`,
          }}
        >
          {expeditions.map((item, idx) => {
            const isActive = idx === activeIndex;
            const isFailed = imgErrors[item.id];
            const currentImgSrc = isFailed ? item.fallbackUrl : item.imageUrl;

            return (
              <div
                key={item.id}
                onClick={() => setActiveIndex(idx)}
                className={`w-[76vw] md:w-[70vw] lg:w-[64vw] shrink-0 px-3 sm:px-4 transition-all duration-700 cursor-pointer ${
                  isActive
                    ? 'scale-100 opacity-100 z-20'
                    : 'scale-[0.92] opacity-50 hover:opacity-75 z-10 filter blur-[0.5px]'
                }`}
              >
                {/* Wide landscape card (aspect ratio 16:9 or 21:9) */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] rounded-sm overflow-hidden shadow-2xl group border border-black/10">
                  <img
                    src={currentImgSrc}
                    onError={() => handleImageError(item.id)}
                    alt={item.fullTitle}
                    className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                  />

                  {/* Gradient Overlay for Cinematic Depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E1B17]/90 via-[#0E1B17]/35 to-black/30" />

                  {/* Central Overlay: Elegant Serif Title with wide tracking & single horizontal line */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-center z-10">
                    <span className="tracking-[0.3em] text-[10px] sm:text-xs font-semibold text-gray-300 uppercase mb-2 block drop-shadow">
                      KALAW EWA EXPEDITION
                    </span>
                    <h3 className="font-serif text-xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tracking-[0.15em] sm:tracking-[0.25em] md:tracking-[0.3em] text-white uppercase drop-shadow-lg leading-none whitespace-nowrap max-w-full px-2">
                      {item.displayTitle}
                    </h3>
                  </div>

                  {/* Subtle bottom details */}
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3 z-20 bg-gradient-to-t from-[#0E1B17] via-[#0E1B17]/70 to-transparent">
                    <div>
                      <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] text-[#C8B8A6] uppercase block">
                        {item.duration} • {item.category}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-lg sm:text-2xl text-white font-normal">
                          {item.price}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-300 font-light">/ person</span>
                      </div>
                    </div>

                    <a
                      href="#featured-trips"
                      className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-medium uppercase tracking-[0.25em] text-white hover:text-[#C8B8A6] bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-white/20 transition-all duration-300 group/btn self-start sm:self-auto"
                    >
                      <span>EXPLORE EXPEDITION</span>
                      <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-2.5 mt-10 sm:mt-12">
        {expeditions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
              activeIndex === idx
                ? 'w-8 bg-[#0E1B17]'
                : 'w-2 bg-[#0E1B17]/30 hover:bg-[#0E1B17]/60'
            }`}
          />
        ))}
      </div>

    </section>
  );
}
