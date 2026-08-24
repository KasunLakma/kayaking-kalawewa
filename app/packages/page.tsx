'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';
import { packages, Package } from '@/data/packages';

export default function PackagesPage() {
  const [activeTab, setActiveTab] = useState<string>('All Expeditions');
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);

  const categories = ['All Expeditions', 'Dawn & Dusk', 'Heritage', 'Wildlife'];

  const filteredPackages = useMemo(() => {
    if (activeTab === 'All Expeditions') {
      return packages;
    }
    return packages.filter((pkg) => pkg.category.toLowerCase() === activeTab.toLowerCase());
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#0B1914] text-[#F4F1EA] font-sans selection:bg-[#C8A97E] selection:text-[#0B1914] flex flex-col justify-between overflow-x-hidden">
      {/* 1. Navigation Header */}
      <Header onOpenBooking={() => setActiveBookingId(packages[0].id)} />

      <main className="flex-1 w-full pt-28 sm:pt-36">
        {/* 2. Editorial Page Header Section */}
        <section className="relative px-6 lg:px-12 pb-16 sm:pb-24 border-b border-white/10 overflow-hidden">
          {/* Subtle Background Glow & Pattern */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#C8A97E]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#C8A97E_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

          <div className="max-w-6xl mx-auto text-center relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#13241E] border border-[#C8A97E]/30 text-[10px] sm:text-xs font-medium text-[#C8A97E] uppercase tracking-[0.3em]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8A97E] animate-pulse" />
              5TH CENTURY RESERVOIR EXPEDITIONS
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#F4F1EA] tracking-tight leading-[1.1]">
              Our Curated Expeditions
            </h1>

            <p className="text-base sm:text-lg text-[#F4F1EA]/80 font-light max-w-3xl mx-auto leading-relaxed pt-2">
              Immerse yourself in ancient Sri Lankan hydraulic heritage. Experience serene eco-kayaking across the historic 5th-century waters of King Dhatusena, surrounded by thriving lotus lagoons and Asian elephant sanctuary corridors.
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-[#F4F1EA]/70 font-light border-t border-white/10 max-w-2xl mx-auto">
              <div className="flex items-center gap-2">
                <span className="text-[#C8A97E]">❖</span>
                <span>Indigenous Naturalist Escorts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#C8A97E]">❖</span>
                <span>Zero Single-Use Plastic Policy</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#C8A97E]">❖</span>
                <span>USCG/CE Safety Gear</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Filter Tabs */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-10 sm:py-14">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 border-b border-white/10 pb-8">
            {categories.map((cat) => {
              const isActive = activeTab === cat;
              const count = cat === 'All Expeditions' 
                ? packages.length 
                : packages.filter(p => p.category.toLowerCase() === cat.toLowerCase()).length;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer border rounded-none flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-[#C8A97E] text-[#0B1914] border-[#C8A97E] shadow-lg font-semibold'
                      : 'bg-[#13241E] text-[#F4F1EA]/80 hover:text-[#C8A97E] border-white/10 hover:border-[#C8A97E]/50'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] rounded-none ${
                      isActive
                        ? 'bg-[#0B1914] text-[#C8A97E]'
                        : 'bg-[#0B1914]/60 text-[#F4F1EA]/60 border border-white/10'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Filter Status Subtext */}
          <div className="text-center pt-6 text-xs text-[#F4F1EA]/60 font-light italic">
            Showing {filteredPackages.length} {filteredPackages.length === 1 ? 'expedition' : 'expeditions'} under{' '}
            <span className="text-[#C8A97E] font-medium non-italic uppercase tracking-wider">{activeTab}</span>
          </div>
        </section>

        {/* 4. Package Grid (2-Column Editorial Cards) */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-24 sm:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            {filteredPackages.map((pkg: Package) => {
              const whatsappMsg = encodeURIComponent(
                `Hi! I would like to inquire about booking the "${pkg.title}" expedition (${pkg.price}${pkg.unit}) at Kalawewa Reservoir.`
              );
              const whatsappUrl = `https://wa.me/94771234567?text=${whatsappMsg}`;
              const bookingUrl = `/booking?package=${pkg.id}`;

              return (
                <article
                  key={pkg.id}
                  id={pkg.id}
                  className="group bg-[#13241E] border border-white/10 hover:border-[#C8A97E]/70 transition-all duration-500 flex flex-col justify-between shadow-2xl relative"
                >
                  {/* Card Image Frame (aspect-[16/10] with subtle zoom hover) */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                    <Image
                      src={pkg.imageUrl}
                      alt={pkg.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#13241E] via-[#13241E]/30 to-transparent" />

                    {/* Top Overlay Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <span className="px-3.5 py-1.5 bg-[#0B1914]/85 backdrop-blur-md border border-[#C8A97E]/40 text-[10px] font-semibold text-[#C8A97E] uppercase tracking-widest">
                        {pkg.category}
                      </span>

                      {pkg.badge && (
                        <span className="px-3 py-1 bg-[#C8A97E] text-[#0B1914] text-[10px] font-bold uppercase tracking-[0.2em]">
                          {pkg.badge}
                        </span>
                      )}
                    </div>

                    {/* Bottom Image Spec Badges: Difficulty, Duration, Group Size */}
                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2 z-10">
                      <span className="px-3 py-1 bg-[#0B1914]/90 backdrop-blur-md border border-white/15 text-[11px] font-light text-[#F4F1EA] flex items-center gap-1.5">
                        <span className="text-[#C8A97E]">⏱</span> {pkg.duration}
                      </span>

                      <span className="px-3 py-1 bg-[#0B1914]/90 backdrop-blur-md border border-white/15 text-[11px] font-light text-[#F4F1EA] flex items-center gap-1.5">
                        <span className="text-[#C8A97E]">👥</span> {pkg.capacity}
                      </span>

                      <span className="px-3 py-1 bg-[#0B1914]/90 backdrop-blur-md border border-[#C8A97E]/40 text-[11px] font-medium text-[#C8A97E] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C8A97E]" /> {pkg.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Editorial Content Block */}
                  <div className="p-8 sm:p-10 flex-1 flex flex-col justify-between space-y-8">
                    <div className="space-y-4">
                      {/* Serif Title & Bold Pricing */}
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-white/10 pb-5">
                        <div>
                          <span className="text-[10px] font-medium text-[#C8A97E] uppercase tracking-[0.25em] block mb-1">
                            {pkg.displayTitle}
                          </span>
                          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#F4F1EA] group-hover:text-[#C8A97E] transition-colors leading-tight">
                            {pkg.title}
                          </h2>
                        </div>

                        <div className="text-left sm:text-right shrink-0">
                          <div className="text-2xl sm:text-3xl font-bold text-[#C8A97E] tracking-tight">
                            {pkg.price}
                          </div>
                          <div className="text-[11px] font-light text-slate-400">
                            {pkg.unit}
                          </div>
                        </div>
                      </div>

                      {/* Narrative Description */}
                      <p className="text-sm text-[#F4F1EA]/80 font-light leading-relaxed">
                        {pkg.description}
                      </p>

                      {/* Inclusions Checklist */}
                      <div className="pt-2">
                        <h3 className="text-[10px] font-semibold text-[#C8A97E] uppercase tracking-[0.25em] mb-3.5">
                          OFFICIAL INCLUSIONS &amp; GEAR:
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {pkg.inclusions.map((item, i) => (
                            <div
                              key={i}
                              className="bg-[#0B1914]/70 border border-white/10 px-3.5 py-2 text-xs text-[#F4F1EA]/90 font-light flex items-center gap-2.5"
                            >
                              <span className="text-[#C8A97E] font-bold shrink-0">✓</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Editorial Actions */}
                    <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-4">
                      {/* Direct Reserve Button */}
                      <Link
                        href={bookingUrl}
                        className="w-full sm:w-1/2 py-3.5 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 text-center rounded-none shadow-md cursor-pointer flex items-center justify-center gap-2 group/btn"
                      >
                        <span>RESERVE EXPEDITION</span>
                        <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                      </Link>

                      {/* WhatsApp Inquiry Button */}
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-1/2 py-3.5 bg-[#0B1914] hover:bg-[#13241E] border border-[#C8A97E]/50 text-[#C8A97E] hover:text-white text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 text-center rounded-none flex items-center justify-center gap-2"
                      >
                        <span>💬 WHATSAPP INQUIRY</span>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 5. Safety & Inclusion Callout Bar */}
        <section className="bg-[#13241E] border-t border-b border-[#C8A97E]/30 py-16 px-6 lg:px-12 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#C8A97E]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#C8A97E] block">
                GUARANTEED WILDERNESS EXCELLENCE
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#F4F1EA]">
                Safety, Sustainability &amp; Guest Assurance
              </h2>
              <p className="text-xs sm:text-sm text-[#F4F1EA]/75 font-light leading-relaxed">
                Every Kalawewa kayak expedition is operated strictly adhering to international eco-tourism standards and wilderness safety protocols.
              </p>
            </div>

            {/* 4 Feature Callouts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="bg-[#0B1914] border border-white/10 p-6 space-y-3">
                <div className="w-10 h-10 rounded-none bg-[#13241E] border border-[#C8A97E]/40 flex items-center justify-center text-[#C8A97E] text-lg font-serif">
                  🦺
                </div>
                <h3 className="font-serif text-lg font-normal text-[#F4F1EA]">
                  100% International Safety Vests
                </h3>
                <p className="text-xs text-[#F4F1EA]/70 font-light leading-relaxed">
                  CE and USCG-certified Personal Flotation Devices (PFDs) inspected before every launch for adults and children.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#0B1914] border border-white/10 p-6 space-y-3">
                <div className="w-10 h-10 rounded-none bg-[#13241E] border border-[#C8A97E]/40 flex items-center justify-center text-[#C8A97E] text-lg font-serif">
                  🌿
                </div>
                <h3 className="font-serif text-lg font-normal text-[#F4F1EA]">
                  Zero Single-Use Plastics
                </h3>
                <p className="text-xs text-[#F4F1EA]/70 font-light leading-relaxed">
                  We use stainless steel water flasks and serve organic Ceylon herbal tea in traditional eco-friendly banana leaf cups.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#0B1914] border border-white/10 p-6 space-y-3">
                <div className="w-10 h-10 rounded-none bg-[#13241E] border border-[#C8A97E]/40 flex items-center justify-center text-[#C8A97E] text-lg font-serif">
                  🎓
                </div>
                <h3 className="font-serif text-lg font-normal text-[#F4F1EA]">
                  Certified Local Eco-Guides
                </h3>
                <p className="text-xs text-[#F4F1EA]/70 font-light leading-relaxed">
                  Native wildlife naturalists trained in first aid, water rescue, and 5th-century Kalawewa irrigation history.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-[#0B1914] border border-white/10 p-6 space-y-3">
                <div className="w-10 h-10 rounded-none bg-[#13241E] border border-[#C8A97E]/40 flex items-center justify-center text-[#C8A97E] text-lg font-serif">
                  💵
                </div>
                <h3 className="font-serif text-lg font-normal text-[#F4F1EA]">
                  Pay-on-Arrival (COD) Available
                </h3>
                <p className="text-xs text-[#F4F1EA]/70 font-light leading-relaxed">
                  Reserve online instantly with zero up-front deposit. Pay conveniently in cash or bank transfer upon arrival at the lake.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Footer Sync */}
      <Footer />

      {/* Booking Modal Fallback */}
      {activeBookingId && (
        <BookingModal
          isOpen={true}
          selectedPackageId={activeBookingId}
          onClose={() => setActiveBookingId(null)}
        />
      )}
    </div>
  );
}
