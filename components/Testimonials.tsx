'use client';

import React from 'react';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  tourTag: string;
  rating: number;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote: "Paddling into the golden morning mist of Kalawewa with our naturalist guide was the highlight of our entire trip to Sri Lanka. Seeing wild Asian elephants grazing along the distant shore from our kayaks was breathtaking!",
    author: "Elena & Marcus Vance",
    location: "Zurich, Switzerland",
    tourTag: "Sunrise Paddle Expedition",
    rating: 5,
    date: "July 2026",
  },
  {
    id: 't2',
    quote: "As an avid outdoors photographer, the twilight colors across the reservoir were unbelievable. The tandem kayak was incredibly stable, high quality, and the local fresh coconut break on the island was pure luxury.",
    author: "David Chen",
    location: "Singapore",
    tourTag: "Sunset Romance & Photography",
    rating: 5,
    date: "August 2026",
  },
  {
    id: 't3',
    quote: "Top-tier wilderness safety standards! As a family travelling with teenagers, we were thoroughly impressed by the safety orientation, ISO life jackets, and the guide’s knowledge of King Dhatusena's ancient history.",
    author: "Sarah & Thomas Brody",
    location: "Melbourne, Australia",
    tourTag: "Classic Kalawewa Island Tour",
    rating: 5,
    date: "June 2026",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="w-full bg-[#071410] py-32 px-4 sm:px-6 lg:px-12 text-white relative overflow-hidden">
      {/* Subtle Glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Requirement 3: Refined Gold Separator Line & Botanical Iconography at top of section */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="flex items-center justify-center gap-4">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
          <div className="w-8 h-8 rounded-full bg-[#071410] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-lg">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold tracking-widest uppercase shadow-sm">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            GUEST REVIEWS & STORIES
          </div>

          <h2 className="text-4xl sm:text-6xl font-bold text-white tracking-tight font-serif">
            What Our Adventurers Say
          </h2>

          <p className="text-base text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Read verified reviews from global travelers and wilderness enthusiasts who explored Kalawewa with us.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#0D231C]/80 backdrop-blur-md rounded-3xl p-8 border border-[#D4AF37]/25 hover:border-[#D4AF37] transition-all duration-500 flex flex-col justify-between relative group hover:scale-[1.02] shadow-xl hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)]"
            >
              {/* Quote Mark Decoration */}
              <div className="text-[#D4AF37]/20 text-7xl font-serif absolute top-4 right-6 pointer-events-none select-none">
                “
              </div>

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-5 text-[#D4AF37]">
                  {[...Array(t.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Tour Tag Badge */}
                <div className="inline-block px-3 py-1 rounded-full bg-[#071410] border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-bold uppercase tracking-widest mb-5">
                  {t.tourTag}
                </div>

                {/* Quote Body */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light italic mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-[#D4AF37]/20 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white font-serif">{t.author}</h4>
                  <p className="text-xs text-slate-400 font-light">{t.location}</p>
                </div>
                <span className="text-[10px] text-[#D4AF37]/70 font-mono uppercase tracking-wider">{t.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
