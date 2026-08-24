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
    quote: "Gliding through the ancient lotus beds at dawn was surreal. The guides' respect for wild elephants is commendable.",
    author: "Sarah W.",
    location: "UK",
    tourTag: "Dawn & Lotus Lagoons",
    rating: 5,
    date: "July 2026",
  },
  {
    id: 't2',
    quote: "Best kayaking experience in Sri Lanka. 100% safe, high-grade life vests, and zero plastic policy.",
    author: "Dilshan P.",
    location: "Colombo",
    tourTag: "Eco Heritage & Safety",
    rating: 5,
    date: "August 2026",
  },
  {
    id: 't3',
    quote: "Watching the sunset behind the submerged dead trees while elephants grazed on the bank was pure magic.",
    author: "Elena & Marcus",
    location: "Germany",
    tourTag: "Sunset & Wildlife Trail",
    rating: 5,
    date: "June 2026",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="w-full bg-[#08120E] py-28 sm:py-36 px-6 lg:px-12 text-[#F4F1EA] relative overflow-hidden border-t border-white/10">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#C8A97E]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
          <span className="tracking-[0.35em] text-xs font-medium text-[#C8A97E] uppercase block">
            GUEST REVIEWS &amp; TESTIMONIALS
          </span>

          <h2 className="font-serif text-4xl sm:text-6xl font-normal text-[#F4F1EA] tracking-tight">
            Adventures Shared by Our Guests
          </h2>

          <p className="text-base text-[#F4F1EA]/80 font-light max-w-2xl mx-auto leading-relaxed pt-2">
            Read verified experiences from global explorers who journeyed through the historic 5th-century waters of Kalawewa Reservoir.
          </p>
        </div>

        {/* Luxury 3-Card Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#13241E]/80 border border-white/10 hover:border-[#C8A97E]/60 transition-all duration-500 p-8 sm:p-10 flex flex-col justify-between space-y-8 shadow-xl relative group"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-6 text-[#C8A97E]">
                  {[...Array(t.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <div className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#C8A97E] mb-4">
                  {t.tourTag}
                </div>

                <p className="text-sm sm:text-base text-[#F4F1EA]/90 leading-relaxed font-light italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-normal text-[#F4F1EA] font-serif group-hover:text-[#C8A97E] transition-colors">{t.author}</h4>
                  <p className="text-xs text-slate-400 font-light">{t.location}</p>
                </div>
                <span className="text-[10px] text-[#C8A97E]/80 font-mono uppercase tracking-wider">{t.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
