'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingEngine from '@/components/BookingEngine';

function BookingPageContent() {
  const searchParams = useSearchParams();
  const packageParam = searchParams.get('package') || 'sunrise-lotus-drift';
  const dateParam = searchParams.get('date') || undefined;
  const slotParam = searchParams.get('slot') || undefined;
  const guestsParam = searchParams.get('guests') ? parseInt(searchParams.get('guests')!) : undefined;

  return (
    <BookingEngine
      initialPackageId={packageParam}
      initialDate={dateParam}
      initialTimeSlot={slotParam}
      initialGuestCount={guestsParam}
      isModal={false}
    />
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-[#f4efe8] text-stone-800 font-sans flex flex-col justify-between overflow-x-hidden">
      <Header />

      {/* Sticky/Fixed High-Contrast Top Navigation Bar for Dedicated Page */}
      <div className="sticky top-16 md:top-20 z-40 w-full bg-[#0B1914] backdrop-blur-md border-b border-white/10 py-3.5 px-4 sm:px-8 shadow-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-stone-300 hover:text-[#d4af37] text-xs font-semibold tracking-[0.2em] uppercase transition-colors"
          >
            <span>←</span>
            <span>BACK TO HOME</span>
          </Link>

          <span className="text-[10px] font-mono tracking-[0.2em] text-[#d4af37] uppercase">
            SANCTUARY RESERVATION
          </span>
        </div>
      </div>

      <main className="flex-1 w-full pt-4">
        <Suspense
          fallback={
            <div className="py-20 text-center text-xs text-stone-500 tracking-widest uppercase font-semibold">
              Loading Kalawewa booking engine...
            </div>
          }
        >
          <BookingPageContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}


