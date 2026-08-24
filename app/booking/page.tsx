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

      <main className="flex-1 w-full pt-24 sm:pt-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-4">
          <Link
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#112620] hover:text-[#1a382f] transition-colors duration-200 py-2 px-4 rounded-full bg-white/80 border border-stone-300 backdrop-blur-sm shadow-sm"
            href="/"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Return to Sanctuary / Back to Home</span>
          </Link>
        </div>

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


