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
    <section id="testimonials" className="w-full bg-[#08120E] py-28 sm:py-36 px-6 lg:px-12 text-[#F4F1EA] relative overflow-hidden border-t border-white/10">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
          <span className="tracking-[0.35em] text-xs font-medium text-[#C8A97E] uppercase block">
            GUEST REVIEWS &amp; STORIES
          </span>

          <h2 className="font-serif text-4xl sm:text-6xl font-normal text-[#F4F1EA] tracking-tight">
            What Our Adventurers Say
          </h2>

          <p className="text-base text-[#F4F1EA]/80 font-light max-w-2xl mx-auto leading-relaxed pt-2">
            Read verified reviews from global travelers and wilderness enthusiasts who explored Kalawewa with us.
          </p>
        </div>

        {/* Minimalist Editorial Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="flex flex-col justify-between space-y-8 relative"
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

                <p className="text-sm sm:text-base text-[#F4F1EA]/85 leading-relaxed font-light italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-normal text-[#F4F1EA] font-serif">{t.author}</h4>
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
