'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import BookingModal from './BookingModal';

interface ExpeditionSlide {
  id: string;
  category: string;
  displayTitle: string;
  fullTitle: string;
  duration: string;
  price: string;
  unit: string;
  imageUrl: string;
  fallbackUrl: string;
  description: string;
}

const expeditions: ExpeditionSlide[] = [
  {
    id: 'sunrise-expedition',
    category: 'SUNRISE EXPEDITION',
    displayTitle: 'S U N R I S E  E X P E D I T I O N',
    fullTitle: 'Early Morning Mist & Lotus Lagoons Kayak',
    duration: '2 Hours',
    price: 'LKR 4,500',
    unit: '/ person',
    imageUrl: '/images/sunrise-drift.jpg',
    fallbackUrl: '/images/sunrise-drift.jpg',
    description: 'Early morning mist & lotus lagoons on King Dhatusena’s ancient 5th-century reservoir. Includes single/double kayak, life jacket & certified guide.',
  },
  {
    id: 'sunset-romance',
    category: 'SUNSET ROMANCE & COUPLES',
    displayTitle: 'S U N S E T  R O M A N C E',
    fullTitle: 'Golden Hour Tranquility & Scenic Vistas',
    duration: '2 Hours',
    price: 'LKR 7,500',
    unit: '/ couple',
    imageUrl: '/images/sunset-romance.jpg',
    fallbackUrl: '/images/sunset-romance.jpg',
    description: 'Golden hour tranquility & scenic vistas over calm waters. Private cushioned tandem kayak with chilled fruit refresh and sunset photo stops.',
  },
  {
    id: 'full-lake-exploration',
    category: 'FULL LAKE EXPLORATION',
    displayTitle: 'F U L L  L A K E  E X P L O R A T I O N',
    fullTitle: 'Full Day Island Exploration & Wetlands',
    duration: 'Full Day Expedition',
    price: 'LKR 14,000',
    unit: '/ person',
    imageUrl: '/images/lake-exploration.jpg',
    fallbackUrl: '/images/lake-exploration.jpg',
    description: 'Island exploration, historic wetlands & endemic waterfowl on King Dhatusena’s reservoir with traditional island refreshment stop.',
  },
  {
    id: 'wildlife-corridor-trail',
    category: 'WILDLIFE CORRIDOR TRAIL',
    displayTitle: 'W I L D L I F E  C O R R I D O R',
    fullTitle: 'Wild Elephant Corridor & Ancient Canals',
    duration: '3 Hours',
    price: 'LKR 8,500',
    unit: '/ person',
    imageUrl: '/images/wildlife-elephant.jpg',
    fallbackUrl: '/images/wildlife-elephant.jpg',
    description: 'Shoreline paddling near wild Asian elephant corridors & ancient canal paths accompanied by certified safety instructors and real-time monitoring.',
  },
];

const tabs = [
  'SUNRISE EXPEDITION',
  'SUNSET ROMANCE & COUPLES',
  'FULL LAKE EXPLORATION',
  'WILDLIFE CORRIDOR TRAIL',
];

interface DestinationsSliderProps {
  onSelectPackage?: (packageId: string) => void;
}

export default function DestinationsSlider({ onSelectPackage }: DestinationsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [bookingPackageId, setBookingPackageId] = useState<string | null>(null);

  // 1. INFINITE LOOP AUTO-PLAY LOGIC (3500ms cycle time, paused on hover)
  useEffect(() => {
    if (isHovered || bookingPackageId) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % expeditions.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [isHovered, bookingPackageId]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + expeditions.length) % expeditions.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % expeditions.length);
  };

  const handleImageError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  const handleBookClick = (pkgId: string) => {
    if (onSelectPackage) {
      onSelectPackage(pkgId);
    } else {
      setBookingPackageId(pkgId);
    }
  };

  return (
    <section className="w-full bg-[#C8B8A6] text-[#0E1B17] py-24 md:py-32 relative overflow-hidden">
      
      {/* Category Pills Header */}
      <div className="max-w-7xl mx-auto px-6 mb-12 sm:mb-16 text-center">
        <span className="tracking-[0.35em] text-xs font-semibold text-[#0E1B17]/70 uppercase block mb-6">
          KALAWEWA PACKAGES &amp; EXPEDITIONS
        </span>

        {/* 3. SYNCHRONIZED TOP CATEGORY TABS */}
        <div className="w-full flex justify-center overflow-x-auto no-scrollbar py-2">
          <div className="bg-black/5 rounded-full px-6 py-2.5 inline-flex gap-6 sm:gap-8 max-w-full items-center shadow-inner border border-black/5 shrink-0">
            {tabs.map((tab, idx) => {
              const isActive = currentIndex === idx;
              return (
                <button
                  key={tab}
                  onClick={() => setCurrentIndex(idx)}
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

      {/* 2. INFINITE LOOP STAGE CONTAINER */}
      <div
        className="relative w-full h-[400px] sm:h-[460px] md:h-[500px] flex justify-center items-center overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        {/* Navigation Arrow Controls */}
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

        {/* Dynamic Cyclic Slides Track */}
        {expeditions.map((item, idx) => {
          let diff = idx - currentIndex;
          const total = expeditions.length;
          if (diff > Math.floor(total / 2)) diff -= total;
          if (diff < -Math.floor(total / 2)) diff += total;

          const isFailed = imgErrors[item.id];
          const currentImgSrc = isFailed ? item.fallbackUrl : item.imageUrl;

          let stateClasses = '';
          if (diff === 0) {
            stateClasses = 'z-20 opacity-100 scale-100 translate-x-0 pointer-events-auto shadow-2xl';
          } else if (diff === 1) {
            stateClasses = 'z-10 opacity-50 scale-90 translate-x-[70%] sm:translate-x-[72%] md:translate-x-[75%] pointer-events-none filter blur-[0.5px]';
          } else if (diff === -1) {
            stateClasses = 'z-10 opacity-50 scale-90 -translate-x-[70%] sm:-translate-x-[72%] md:-translate-x-[75%] pointer-events-none filter blur-[0.5px]';
          } else if (diff > 1) {
            stateClasses = 'z-0 opacity-0 scale-75 translate-x-[150%] pointer-events-none';
          } else {
            stateClasses = 'z-0 opacity-0 scale-75 -translate-x-[150%] pointer-events-none';
          }

          return (
            <div
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              className={`absolute transition-all duration-700 ease-in-out w-[88vw] sm:w-[650px] md:w-[780px] h-[360px] sm:h-[400px] md:h-[460px] rounded-sm overflow-hidden border border-black/10 cursor-pointer ${stateClasses}`}
            >
              <Image
                src={currentImgSrc}
                alt={item.fullTitle}
                fill
                sizes="(max-width: 768px) 88vw, 780px"
                onError={() => handleImageError(item.id)}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0E1B17]/90 via-[#0E1B17]/35 to-black/30" />

              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-center z-10">
                <span className="tracking-[0.3em] text-[10px] sm:text-xs font-semibold text-gray-300 uppercase mb-2 block drop-shadow">
                  KALAWEWA ADVENTURES &amp; EXPEDITIONS
                </span>
                <h3 className="font-serif text-lg sm:text-2xl md:text-3xl lg:text-4xl font-normal tracking-[0.12em] sm:tracking-[0.2em] text-white uppercase drop-shadow-lg leading-tight whitespace-nowrap max-w-full px-2 overflow-hidden text-ellipsis">
                  {item.displayTitle}
                </h3>
              </div>

              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3 z-20 bg-gradient-to-t from-[#0E1B17] via-[#0E1B17]/70 to-transparent">
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] sm:text-xs font-medium tracking-[0.15em] sm:tracking-[0.2em] text-[#C8B8A6] uppercase block whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.duration} • {item.category}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-lg sm:text-2xl text-white font-normal">
                      {item.price}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-300 font-light">{item.unit}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookClick(item.id);
                  }}
                  className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-medium uppercase tracking-[0.25em] text-[#0E1B17] bg-[#C8A97E] hover:bg-[#b5966c] px-5 sm:px-6 py-2 sm:py-2.5 rounded-none shadow-md transition-all duration-300 group/btn self-start sm:self-auto cursor-pointer font-bold"
                >
                  <span>BOOK PACKAGE</span>
                  <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                </button>
              </div>
            </div>
          );
        })}

      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-2.5 mt-10 sm:mt-12">
        {expeditions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
              currentIndex === idx
                ? 'w-8 bg-[#0E1B17]'
                : 'w-2 bg-[#0E1B17]/30 hover:bg-[#0E1B17]/60'
            }`}
          />
        ))}
      </div>

      {/* Fallback Booking Modal */}
      {bookingPackageId && (
        <BookingModal
          isOpen={true}
          selectedPackageId={bookingPackageId}
          onClose={() => setBookingPackageId(null)}
        />
      )}

    </section>
  );
}
