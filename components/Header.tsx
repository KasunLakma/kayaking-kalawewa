'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BookingModal from './BookingModal';
import SearchModal from './SearchModal';

interface HeaderProps {
  onOpenBooking?: () => void;
}

const PREVIEW_ITEMS = [
  {
    num: '01',
    label: 'Sanctuary Home',
    href: '/',
    image: '/images/kalawewa-hero.jpeg',
    caption: 'Ancient 5th-Century Waters & Untamed Wilderness',
  },
  {
    num: '02',
    label: 'Expeditions & Packages',
    href: '/packages',
    image: '/images/sunrise-paddle.jpg',
    caption: 'Curated Eco-Kayaking Tours & Guided Expeditions',
  },
  {
    num: '03',
    label: 'About Kalawewa',
    href: '/#about',
    image: '/images/about-elephant.jpg',
    caption: 'Hydraulic Heritage of King Dhatusena',
  },
  {
    num: '04',
    label: 'Heritage & Safety',
    href: '/#impact',
    image: '/images/wildlife-elephant.jpg',
    caption: 'Elephant Corridor & Wetland Protection',
  },
  {
    num: '05',
    label: 'Reserve Slot',
    href: '/booking',
    image: '/images/sunset-romance.jpg',
    caption: 'Instant Slot Confirmation with Pay-on-Arrival',
    isBookingTrigger: true,
  },
];

export default function Header({ onOpenBooking }: HeaderProps) {
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [localBookingOpen, setLocalBookingOpen] = useState(false);
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0);

  const handleBookingClick = () => {
    if (onOpenBooking) {
      onOpenBooking();
    } else {
      setLocalBookingOpen(true);
    }
  };

  return (
    <>
      {/* Top Header Pinned to Top */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#0B1914]/70 backdrop-blur-md border-b border-white/10 px-6 sm:px-10 lg:px-16 py-4.5 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left: Rounded Hamburger Menu button ("☰ MENU") */}
          <button
            onClick={() => setMenuDrawerOpen(!menuDrawerOpen)}
            className="px-4 py-2 rounded-full border border-white/30 hover:border-white text-white text-xs font-medium uppercase tracking-[0.2em] transition-all flex items-center gap-2.5 cursor-pointer bg-black/20 backdrop-blur-sm"
            aria-label="Toggle Menu"
          >
            <span className="text-sm">☰</span>
            <span>MENU</span>
          </button>

          {/* Center: Minimalist Logo with organic wave icon and clean uppercase serif text */}
          <Link href="/" className="flex flex-col items-center group">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#C8A97E] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
              </svg>
              <span className="font-serif text-xl sm:text-2xl font-light tracking-[0.3em] text-[#F4F1EA] group-hover:text-[#C8A97E] transition-colors leading-none uppercase">
                KALAWEWA
              </span>
            </div>
            <span className="text-[9px] font-medium tracking-[0.35em] text-[#C8A97E] uppercase mt-1">
              ADVENTURES &amp; EXPEDITIONS
            </span>
          </Link>

          {/* Right: Minimal Search icon + secondary gold outline action */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2 text-white/80 hover:text-[#C8A97E] transition-colors cursor-pointer"
              aria-label="Search Expeditions"
              title="Search Expeditions"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <Link
              href="/#packages"
              className="px-4 sm:px-5 py-2.5 border border-[#C8A97E]/70 hover:border-[#C8A97E] hover:bg-[#C8A97E]/10 text-[#C8A97E] hover:text-white text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-300 shadow-sm cursor-pointer rounded-none inline-flex items-center justify-center text-center"
            >
              EXPLORE EXPEDITIONS
            </Link>
          </div>
        </div>
      </header>

      {/* Fullscreen Editorial 2-Column Overlay Menu Drawer */}
      {menuDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B1914]/98 backdrop-blur-xl border-l border-white/15 flex flex-col justify-between p-6 sm:p-10 lg:p-12 text-[#f5f2eb] overflow-y-auto">
          
          {/* Top Header Controls Bar */}
          <div className="flex items-center justify-between max-w-7xl mx-auto w-full pb-6 border-b border-white/15 shrink-0">
            {/* Top subtle branding watermark */}
            <div className="text-xs font-mono text-[#d4af37] tracking-[0.25em] uppercase font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
              <span>KALAWEWA — SANCTUARY EXPEDITIONS</span>
            </div>

            {/* Sleek Minimalist Circular Close Button */}
            <button
              onClick={() => setMenuDrawerOpen(false)}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:rotate-90 hover:border-[#d4af37] text-[#d4af37] hover:text-white transition-all duration-300 cursor-pointer shadow-lg bg-[#0B1914]"
              aria-label="Close Navigation Menu"
              title="Close Menu"
            >
              <span className="text-base font-bold">✕</span>
            </button>
          </div>

          {/* Main 2-Column Split Structure */}
          <div className="max-w-7xl mx-auto w-full my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: 60% Width (col-span-7) */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-1">
              <nav className="flex flex-col">
                {PREVIEW_ITEMS.map((item, idx) => {
                  const handleClick = (e: React.MouseEvent) => {
                    setMenuDrawerOpen(false);
                    if (item.isBookingTrigger) {
                      e.preventDefault();
                      handleBookingClick();
                    }
                  };

                  return (
                    <div
                      key={item.num}
                      onMouseEnter={() => setActivePreviewIndex(idx)}
                      className="group border-b border-white/15 py-4 transition-all"
                    >
                      <Link
                        href={item.href}
                        onClick={handleClick}
                        className="flex items-center justify-between group-hover:translate-x-2 transition-transform duration-300"
                      >
                        <div className="flex items-center gap-4 sm:gap-6">
                          <span className="text-xs font-mono text-[#d4af37] tracking-widest font-medium">
                            {item.num}.
                          </span>
                          <span className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#f5f2eb] group-hover:text-[#d4af37] transition-colors duration-300">
                            {item.label}
                          </span>
                        </div>
                        
                        {/* Arrow Indicator */}
                        <span className="text-[#d4af37] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-lg">
                          →
                        </span>
                      </Link>
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* RIGHT COLUMN: 40% Width (col-span-5) - Hidden on Mobile */}
            <div className="hidden lg:flex lg:col-span-5 flex-col space-y-5">
              {/* Dynamic Visual Preview Frame */}
              <div className="relative h-72 rounded-2xl overflow-hidden border border-white/15 shadow-2xl group bg-[#13241E]">
                <Image
                  src={PREVIEW_ITEMS[activePreviewIndex].image}
                  alt={PREVIEW_ITEMS[activePreviewIndex].label}
                  fill
                  className="object-cover object-center transition-all duration-700 group-hover:scale-105"
                  sizes="(max-width: 1200px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1914] via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#d4af37] font-medium block mb-0.5">
                    PREVIEW {PREVIEW_ITEMS[activePreviewIndex].num}
                  </span>
                  <span className="text-xs font-serif text-[#f5f2eb] font-normal block">
                    {PREVIEW_ITEMS[activePreviewIndex].caption}
                  </span>
                </div>
              </div>

              {/* Bottom Meta Card */}
              <div className="bg-[#13241E]/95 border border-white/15 rounded-2xl p-5 space-y-3.5 text-sm">
                <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
                  <span className="text-stone-300 font-light">Operating Hours:</span>
                  <span className="text-[#f5f2eb] font-medium">6:00 AM – 6:00 PM Daily</span>
                </div>
                
                <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
                  <span className="text-stone-300 font-light">GPS Coordinates:</span>
                  <span className="text-[#d4af37] font-mono font-medium">8.0264° N, 80.5284° E</span>
                </div>

                {/* Unified Contact Action Row */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href="tel:+94771234567"
                    className="flex-1 w-full py-2.5 px-3 bg-[#13241E] hover:bg-[#1a3028] border border-white/20 hover:border-[#d4af37] text-[#f3efe6] hover:text-[#d4af37] text-sm tracking-wider transition-colors rounded-xl flex items-center justify-center gap-2 font-medium shadow-md"
                  >
                    <span>📞 +94 77 123 4567</span>
                  </a>
                  <a
                    href="https://wa.me/94771234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 w-full py-2.5 px-3 bg-[#132b22]/90 hover:bg-[#132b22] border border-[#d4af37]/40 hover:border-[#d4af37] text-[#f3efe6] hover:text-[#d4af37] text-sm tracking-wider transition-colors rounded-xl flex items-center justify-center gap-2 font-medium shadow-md"
                  >
                    <span>💬 WhatsApp Concierge</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Bar: Copyright & Discreet Operator Access Link */}
          <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between text-sm text-stone-300 font-light border-t border-white/15 pt-5 shrink-0 gap-3">
            <div className="flex items-center gap-6">
              <span>© Kayaking Kalawewa Luxury Eco-Resort</span>
              {/* Discreet Operator Access Link */}
              <Link
                href="/admin"
                onClick={() => setMenuDrawerOpen(false)}
                className="text-xs text-stone-300 hover:text-[#d4af37] tracking-widest uppercase transition-colors"
              >
                Operator Access →
              </Link>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="mailto:expeditions@kalawewakayak.lk"
                className="text-[#f3efe6] hover:text-[#d4af37] text-sm tracking-wider transition-colors"
              >
                expeditions@kalawewakayak.lk
              </a>
            </div>
          </div>

        </div>
      )}

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Fallback Local Booking Modal */}
      <BookingModal
        isOpen={localBookingOpen}
        onClose={() => setLocalBookingOpen(false)}
      />
    </>
  );
}

