'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BookingModal from './BookingModal';

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
    image: '/images/kalawewa-about1.jpeg.jpg',
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

          {/* Right: Minimal Search icon + solid luxury amber button */}
          <div className="flex items-center gap-4 sm:gap-5">
            <Link
              href="/packages"
              className="hidden md:inline-flex px-4 py-2 border border-[#C8A97E]/40 hover:border-[#C8A97E] text-[#C8A97E] hover:text-white text-xs font-medium uppercase tracking-[0.15em] transition-all"
            >
              Packages &amp; Expeditions
            </Link>

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

            <button
              onClick={handleBookingClick}
              className="px-5 sm:px-6 py-2.5 bg-[#D97706] hover:bg-[#B45309] text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-md cursor-pointer rounded-none"
            >
              BOOK NOW
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Editorial 2-Column Overlay Menu Drawer */}
      {menuDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B1914]/98 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-10 lg:p-12 text-[#F4F1EA] overflow-y-auto">
          
          {/* Top Header Controls Bar */}
          <div className="flex items-center justify-between max-w-7xl mx-auto w-full pb-6 border-b border-white/10 shrink-0">
            {/* Top subtle branding watermark */}
            <div className="text-xs font-mono text-[#C8A97E] tracking-[0.25em] uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C8A97E] animate-pulse" />
              <span>KALAWEWA — SANCTUARY EXPEDITIONS</span>
            </div>

            {/* Sleek Minimalist Circular Close Button */}
            <button
              onClick={() => setMenuDrawerOpen(false)}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:rotate-90 hover:border-[#C8A97E] text-[#C8A97E] hover:text-white transition-all duration-300 cursor-pointer shadow-lg bg-[#0B1914]"
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
                      className="group border-b border-white/10 py-4 transition-all"
                    >
                      <Link
                        href={item.href}
                        onClick={handleClick}
                        className="flex items-center justify-between group-hover:translate-x-2 transition-transform duration-300"
                      >
                        <div className="flex items-center gap-4 sm:gap-6">
                          <span className="text-xs font-mono text-[#C8A97E] tracking-widest">
                            {item.num}.
                          </span>
                          <span className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#f3efe6] group-hover:text-[#d4af37] transition-colors duration-300">
                            {item.label}
                          </span>
                        </div>
                        
                        {/* Arrow Indicator */}
                        <span className="text-[#C8A97E] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-lg">
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
              <div className="relative h-72 rounded-2xl overflow-hidden border border-[#c8b8a6]/20 shadow-2xl group bg-[#13241E]">
                <Image
                  src={PREVIEW_ITEMS[activePreviewIndex].image}
                  alt={PREVIEW_ITEMS[activePreviewIndex].label}
                  fill
                  className="object-cover object-center transition-all duration-700 group-hover:scale-105"
                  sizes="(max-width: 1200px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1914] via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C8A97E] block mb-0.5">
                    PREVIEW {PREVIEW_ITEMS[activePreviewIndex].num}
                  </span>
                  <span className="text-xs font-serif text-white font-normal block">
                    {PREVIEW_ITEMS[activePreviewIndex].caption}
                  </span>
                </div>
              </div>

              {/* Bottom Meta Card */}
              <div className="bg-[#13241E]/90 border border-white/10 rounded-2xl p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-stone-400">Operating Hours:</span>
                  <span className="text-[#F4F1EA] font-medium">6:00 AM – 6:00 PM Daily</span>
                </div>
                
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-stone-400">GPS Coordinates:</span>
                  <span className="text-[#C8A97E] font-mono font-medium">8.0264° N, 80.5284° E</span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-stone-400">Direct Hotline:</span>
                  <span className="text-[#F4F1EA] font-medium">+94 77 123 4567</span>
                </div>

                <a
                  href="https://wa.me/94771234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-2 py-2.5 px-4 bg-[#25D366] hover:bg-[#1ebd59] text-stone-900 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>💬 WHATSAPP CONCIERGE</span>
                </a>
              </div>
            </div>

          </div>

          {/* Footer Bar: Copyright & Discreet Operator Access Link */}
          <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-light border-t border-white/10 pt-4 shrink-0 gap-3">
            <div className="flex items-center gap-6">
              <span>© Kayaking Kalawewa Luxury Eco-Resort</span>
              {/* Discreet Operator Access Link */}
              <Link
                href="/admin"
                onClick={() => setMenuDrawerOpen(false)}
                className="text-xs text-stone-500 hover:text-stone-300 tracking-widest uppercase transition-colors"
              >
                Operator Access →
              </Link>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-[#C8A97E]">WhatsApp: +94 77 123 4567</span>
              <span>expeditions@kalawewakayak.lk</span>
            </div>
          </div>

        </div>
      )}

      {/* Quick Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0B1914] border border-[#C8A97E]/40 p-8 max-w-lg w-full shadow-2xl relative text-[#F4F1EA]">
            <button
              onClick={() => setSearchModalOpen(false)}
              className="absolute top-4 right-4 text-[#C8A97E] hover:text-white transition-colors"
            >
              ✕
            </button>
            <div className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#C8A97E] mb-2">
              SEARCH KALAWEWA EXPEDITIONS
            </div>
            <h3 className="text-2xl font-normal text-[#F4F1EA] mb-6 font-serif">Find Your Wilderness Journey</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search by keyword (e.g. Sunrise, Elephant, Island)..."
                className="w-full px-5 py-3.5 bg-[#13241E] border border-white/15 text-xs text-[#F4F1EA] placeholder-slate-400 focus:outline-none focus:border-[#C8A97E]"
              />
              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => setSearchModalOpen(false)}
                  className="px-6 py-2.5 border border-white/20 text-xs font-medium uppercase tracking-widest text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <a
                  href="#featured-trips"
                  onClick={() => setSearchModalOpen(false)}
                  className="px-6 py-2.5 bg-[#C8A97E] text-[#0B1914] text-xs font-semibold uppercase tracking-widest hover:bg-[#b5966c]"
                >
                  Search
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fallback Local Booking Modal */}
      <BookingModal
        isOpen={localBookingOpen}
        onClose={() => setLocalBookingOpen(false)}
      />
    </>
  );
}

