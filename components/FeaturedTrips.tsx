'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { packages, Package } from '@/data/packages';
import BookingModal from './BookingModal';

interface FeaturedTripsProps {
  onSelectPackage?: (pkgId: string) => void;
}

export default function FeaturedTrips({ onSelectPackage }: FeaturedTripsProps) {
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);

  const handleBook = (id: string) => {
    const pkg = packages.find((p) => p.id === id);
    if (pkg && typeof window !== "undefined") {
      if ((window as any).fbq) {
        (window as any).fbq("track", "ViewContent", {
          content_name: pkg.title,
          content_category: pkg.category,
          value: pkg.priceAmount,
          currency: "LKR",
        });
      }
      if ((window as any).ttq) {
        (window as any).ttq.track("ViewContent", {
          content_name: pkg.title,
          content_category: pkg.category,
          value: pkg.priceAmount,
          currency: "LKR",
        });
      }
    }
    if (onSelectPackage) {
      onSelectPackage(id);
    } else {
      setActiveBookingId(id);
    }
  };

  return (
    <section id="featured-trips" className="w-full bg-[#0B1914] py-28 sm:py-36 text-[#F4F1EA] relative overflow-hidden">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-20 sm:mb-28 text-center">
        <span className="tracking-[0.35em] text-xs font-medium text-[#C8A97E] uppercase block mb-4">
          CURATED EXPEDITIONS
        </span>

        <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#F4F1EA] tracking-tight leading-tight max-w-4xl mx-auto">
          Signature Journeys on Kalawewa Waters
        </h2>

        <p className="text-base sm:text-lg text-[#F4F1EA]/75 font-light max-w-2xl mx-auto leading-relaxed pt-4">
          Privately guided eco-kayaking photo stories on King Dhatusena&apos;s 5th-century reservoir. Every expedition is escorted by indigenous naturalists.
        </p>
      </div>

      {/* Large Alternating 50/50 Split-Screen Photo Stories */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-28 sm:space-y-36">
        {packages.map((pkg: Package, index: number) => {
          const isEven = index % 2 === 0;
          const storyNumber = `0${index + 1}`;

          return (
            <div
              key={pkg.id}
              className={`flex flex-col ${
                isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center gap-12 lg:gap-20`}
            >
              {/* Giant High-Resolution Lake/Kayak Photography */}
              <div className="w-full lg:w-1/2 relative h-[450px] sm:h-[550px] lg:h-[600px] overflow-hidden group">
                <Image
                  src={pkg.imageUrl}
                  alt={pkg.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1914]/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-6 left-6 z-10">
                  <span className="px-3.5 py-1.5 bg-[#0B1914]/80 backdrop-blur-md border border-[#C8A97E]/40 text-[10px] font-medium tracking-[0.25em] uppercase text-[#C8A97E]">
                    {pkg.groupType}
                  </span>
                </div>
              </div>

              {/* Text column */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-6 lg:px-4">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-xl sm:text-2xl text-[#C8A97E]">
                    {storyNumber}
                  </span>
                  <span className="h-[1px] w-12 bg-[#C8A97E]/40" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#C8A97E]">
                    {pkg.badge || 'SIGNATURE EXPEDITION'}
                  </span>
                </div>

                <h3 className="font-serif text-3xl sm:text-5xl font-normal text-[#F4F1EA] leading-tight">
                  {pkg.title}
                </h3>

                <p className="text-sm sm:text-base text-[#F4F1EA]/80 font-light leading-relaxed max-w-xl">
                  {pkg.description}
                </p>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#C8A97E]">
                    EXPEDITION HIGHLIGHTS
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#F4F1EA]/75 font-light">
                    {pkg.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-[#C8A97E]">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium tracking-[0.2em] uppercase block">
                      STARTING RATE
                    </span>
                    <span className="font-serif text-2xl sm:text-3xl font-normal text-[#C8A97E]">
                      {pkg.price}
                    </span>{' '}
                    <span className="text-xs text-slate-400 font-light">{pkg.unit}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBook(pkg.id)}
                    className="text-xs font-bold uppercase tracking-[0.25em] text-[#0B1914] bg-[#C8A97E] hover:bg-[#b5966c] px-5 py-2.5 transition-colors flex items-center gap-2 group/link cursor-pointer shadow-md"
                  >
                    <span>BOOK THIS EXPEDITION</span>
                    <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activeBookingId && (
        <BookingModal
          isOpen={true}
          selectedPackageId={activeBookingId}
          onClose={() => setActiveBookingId(null)}
        />
      )}
    </section>
  );
}
