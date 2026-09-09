import React from 'react';

export default function PackagesLoading() {
  return (
    <div className="min-h-screen bg-[#0B1914] text-[#F4F1EA] font-sans flex flex-col justify-between overflow-x-hidden">
      {/* Top spacing mimicking navigation header */}
      <div className="w-full pt-24 sm:pt-28">
        
        {/* Back Link Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
          <div className="w-36 h-8 rounded-lg bg-white/[0.03] border border-white/5 animate-pulse" />
        </div>

        {/* Editorial Page Header Skeleton Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 pb-12 border-b border-white/10 overflow-hidden">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Category Tag Badge Skeleton */}
            <div className="w-44 h-7 rounded-sm bg-white/[0.03] border border-white/5 animate-pulse" />

            {/* Page Title Skeleton */}
            <div className="w-full max-w-xl h-14 sm:h-16 rounded-xl bg-white/[0.03] border border-white/5 animate-pulse" />

            {/* Paragraph Subtitle Skeleton */}
            <div className="space-y-2 max-w-2xl">
              <div className="w-full h-4 rounded bg-white/[0.03] border border-white/5 animate-pulse" />
              <div className="w-5/6 h-4 rounded bg-white/[0.03] border border-white/5 animate-pulse" />
            </div>

            {/* Trust Badges Row Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 animate-pulse flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="w-3/4 h-3.5 rounded bg-white/5" />
                    <div className="w-full h-3 rounded bg-white/[0.02]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filter Categories Bar Skeleton */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4].map((cat) => (
              <div
                key={cat}
                className="w-32 h-10 rounded-full bg-white/[0.03] border border-white/5 animate-pulse"
              />
            ))}
          </div>
        </section>

        {/* Packages Skeleton Cards Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((card) => (
              <div
                key={card}
                className="bg-white/[0.03] animate-pulse border border-white/5 rounded-2xl p-6 overflow-hidden space-y-5"
              >
                {/* Image Placeholder Skeleton */}
                <div className="h-52 w-full rounded-xl bg-white/[0.04] border border-white/5 relative overflow-hidden">
                  <div className="absolute top-3 left-3 w-24 h-6 rounded-full bg-white/5" />
                  <div className="absolute top-3 right-3 w-16 h-6 rounded-full bg-white/5" />
                </div>

                {/* Card Title & Subheading Skeleton */}
                <div className="space-y-2">
                  <div className="w-4/5 h-6 rounded-lg bg-white/[0.05]" />
                  <div className="w-full h-3.5 rounded bg-white/[0.03]" />
                  <div className="w-2/3 h-3.5 rounded bg-white/[0.03]" />
                </div>

                {/* Feature Specs Badges Skeleton */}
                <div className="flex items-center gap-2 pt-2">
                  <div className="w-20 h-6 rounded-md bg-white/[0.03]" />
                  <div className="w-24 h-6 rounded-md bg-white/[0.03]" />
                  <div className="w-16 h-6 rounded-md bg-white/[0.03]" />
                </div>

                {/* Card Footer (Price + Action Button Skeleton) */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="space-y-1">
                    <div className="w-12 h-3 rounded bg-white/[0.02]" />
                    <div className="w-24 h-5 rounded bg-white/[0.05]" />
                  </div>
                  <div className="w-28 h-10 rounded-full bg-white/[0.06]" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
