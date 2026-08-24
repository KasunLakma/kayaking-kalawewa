'use client';

import React, { Suspense } from 'react';
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

