'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingEngine from '@/components/BookingEngine';

function BookingPageContent() {
  const searchParams = useSearchParams();
  const packageParam = searchParams.get('package') || 'sunrise-lotus-drift';

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-[#0B1914] border border-[#C8A97E]/40 p-6 sm:p-12 shadow-2xl">
        <BookingEngine initialPackageId={packageParam} isModal={false} />
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-[#0B1914] text-[#F4F1EA] font-sans flex flex-col justify-between overflow-x-hidden">
      <Header />

      <main className="flex-1 w-full pt-28 sm:pt-36 pb-20">
        <Suspense
          fallback={
            <div className="py-20 text-center text-xs text-[#C8A97E] tracking-widest uppercase">
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
