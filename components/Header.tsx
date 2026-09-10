'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BookingModal from './BookingModal';
import SearchModal from './SearchModal';
import AuthModal from './AuthModal';
import { useAuth } from '@/context/AuthContext';

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
    label: 'Lake Heritage',
    href: '/#about',
    image: '/images/about-elephant.jpg',
    caption: 'Hydraulic Heritage of King Dhatusena',
  },
  {
    num: '04',
    label: 'Safety & Impact',
    href: '/safety',
    image: '/images/wildlife-elephant.jpg',
    caption: 'Elephant Corridor & Wetland Protection',
  },
  {
    num: '05',
    label: 'Privileges & Reserve',
    href: '/booking',
    image: '/images/sunset-romance.jpg',
    caption: 'Instant Slot Confirmation with Pay-on-Arrival',
    isBookingTrigger: true,
  },
];

const DESKTOP_NAV_LINKS = [
  { label: 'Expeditions', href: '/packages' },
  { label: 'Lake Heritage', href: '/#about' },
  { label: 'Safety', href: '/safety' },
  { label: 'Privileges', href: '/booking' },
];

export default function Header({ onOpenBooking }: HeaderProps) {
  const { userProfile } = useAuth();
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [localBookingOpen, setLocalBookingOpen] = useState(false);
  const [headerAuthOpen, setHeaderAuthOpen] = useState(false);
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookingClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (onOpenBooking) {
      onOpenBooking();
    } else {
      setLocalBookingOpen(true);
    }
  };

  return (
    <>
      {/* 1. RESTORE MAIN NAVBAR LAYOUT (STANDARD FULL-WIDTH HEADER) */}
      <header
        className={`w-full fixed top-0 left-0 right-0 z-50 bg-[#07130E]/80 backdrop-blur-md border-b border-white/10 px-6 lg:px-12 py-4 flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'bg-[#07130E]/95 shadow-xl border-white/15 py-3.5' : ''
        }`}
      >
        {/* Left: Minimalist Logo with Gold Monogram Accent */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/40 flex items-center justify-center group-hover:border-[#d4af37] transition-all shrink-0">
            <svg
              className="w-4.5 h-4.5 text-[#d4af37] group-hover:scale-110 transition-transform duration-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L15 8.5C14 10 12 11 12 11C12 11 10 10 9 8.5L12 2Z" fill="currentColor" fillOpacity="0.2" />
              <path d="M12 2L15 8.5C14 10 12 11 12 11C12 11 10 10 9 8.5L12 2Z" />
              <path d="M12 11V22" />
              <path d="M4 17C6.5 15.5 9.5 15.5 12 17C14.5 18.5 17.5 18.5 20 17" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg sm:text-xl font-medium tracking-[0.25em] text-[#F4F1EA] group-hover:text-[#d4af37] transition-colors leading-none uppercase">
              KALAWEWA
            </span>
            <span className="text-[9px] font-mono tracking-[0.3em] text-[#d4af37] uppercase mt-1 opacity-90 hidden sm:block">
              EXPEDITIONS &amp; RESORT
            </span>
          </div>
        </Link>

        {/* Center: Standard Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {DESKTOP_NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-stone-300 hover:text-[#d4af37] text-xs uppercase tracking-[0.2em] font-medium transition-colors py-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Actions (Search, Auth, CTA & Menu Toggle) */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search trigger */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="p-2 text-stone-300 hover:text-[#d4af37] transition-colors rounded-full hover:bg-white/5 cursor-pointer"
            aria-label="Search Expeditions"
            title="Search Expeditions"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Auth status indicator */}
          {userProfile ? (
            <Link
              href="/account"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-xs font-mono tracking-widest text-[#d4af37] border border-[#d4af37]/40 hover:border-[#d4af37] bg-[#d4af37]/10 rounded-full transition-all"
            >
              <span>👤</span>
              <span className="truncate max-w-[100px]">{userProfile.fullName.split(' ')[0]}</span>
            </Link>
          ) : (
            <button
              onClick={() => setHeaderAuthOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-xs font-mono tracking-widest text-stone-300 hover:text-[#d4af37] border border-white/20 hover:border-[#d4af37]/50 rounded-full transition-all bg-white/[0.03] cursor-pointer"
            >
              <span>🔑</span>
              <span>SIGN IN</span>
            </button>
          )}

          {/* Luxury CTA Button */}
          <button
            onClick={handleBookingClick}
            className="hidden sm:inline-flex bg-[#d4af37] hover:bg-[#b8972e] text-[#07130E] text-xs font-semibold tracking-wider uppercase px-5 py-2.5 rounded-full transition-all shadow-md hover:scale-105 cursor-pointer whitespace-nowrap"
          >
            RESERVE
          </button>

          {/* Menu / Hamburger Toggle Button */}
          <button
            onClick={() => setMenuDrawerOpen(!menuDrawerOpen)}
            className="px-3.5 py-2 min-h-[40px] rounded-full border border-white/20 hover:border-[#d4af37] text-stone-200 hover:text-[#d4af37] text-xs font-medium uppercase tracking-[0.18em] transition-all flex items-center justify-center gap-2 cursor-pointer bg-white/5 backdrop-blur-sm"
            aria-label="Toggle Menu"
          >
            <div className="w-4 h-4 relative flex flex-col justify-center gap-1">
              <span
                className={`block h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${
                  menuDrawerOpen ? 'rotate-45 translate-y-1' : ''
                }`}
              />
              <span
                className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${
                  menuDrawerOpen ? 'opacity-0 scale-x-0' : 'w-4'
                }`}
              />
              <span
                className={`block h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${
                  menuDrawerOpen ? '-rotate-45 -translate-y-1' : ''
                }`}
              />
            </div>
            <span className="hidden xs:inline">MENU</span>
          </button>
        </div>
      </header>

      {/* 2. SWISS-EDITORIAL MULTI-COLUMN MEGA-DRAWER OVERLAY */}
      {menuDrawerOpen && (
        <div className="fixed inset-0 z-[100] bg-[#FAF8F5] text-stone-900 overflow-y-auto p-4 sm:p-6 md:p-10 lg:p-12 flex flex-col justify-between animate-in fade-in duration-300">
          
          {/* Main Editorial Container */}
          <div className="relative w-full max-w-7xl my-auto max-h-[94vh] flex flex-col justify-between overflow-y-auto no-scrollbar py-2">
            
            {/* Top Control Bar */}
            <div className="flex items-center justify-between pb-5 border-b border-stone-300 shrink-0">
              <Link
                href="/"
                onClick={() => setMenuDrawerOpen(false)}
                className="flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-full bg-[#E63925] text-white font-mono text-xs font-bold flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                  KW
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-lg sm:text-xl font-bold tracking-[0.2em] text-stone-900 group-hover:text-[#E63925] transition-colors leading-none uppercase">
                    KALAWEWA
                  </span>
                  <span className="text-[9px] font-mono tracking-[0.3em] text-[#E63925] uppercase mt-1 font-semibold">
                    SWISS-EDITORIAL ARCHIVE
                  </span>
                </div>
              </Link>

              {/* Minimal Clean Close Button ("✕") */}
              <button
                onClick={() => setMenuDrawerOpen(false)}
                className="w-10 h-10 rounded-full border border-stone-300 hover:border-[#E63925] flex items-center justify-center text-stone-900 hover:text-[#E63925] hover:rotate-90 transition-all duration-300 cursor-pointer bg-white shadow-sm"
                aria-label="Close Navigation Menu"
              >
                <span className="text-base font-bold">✕</span>
              </button>
            </div>

            {/* FOUR-COLUMN SWISS GRID ARCHITECTURE */}
            <div className="py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-6 min-h-[480px] items-stretch border-t border-b border-stone-300 my-4">
              
              {/* COLUMN 1: Index & Typography Links (Span 3 / 12) */}
              <div className="lg:col-span-3 bg-white border border-stone-300 rounded-2xl p-6 flex flex-col justify-between relative shadow-sm hover:shadow-md hover:scale-[1.015] transition-all duration-500">
                <span className="hidden xl:block absolute -left-7 bottom-16 -rotate-90 origin-center text-[9px] tracking-[0.3em] font-mono text-stone-400 uppercase pointer-events-none whitespace-nowrap">
                  — ARCHIVE / EXPEDITIONS
                </span>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <span className="text-[10px] font-mono text-[#E63925] tracking-[0.25em] uppercase font-bold">
                      KW — INDEX 01
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#E63925]" />
                  </div>

                  {/* Primary Navigation List */}
                  <nav className="flex flex-col space-y-1">
                    {[
                      { label: 'Expeditions', href: '/packages' },
                      { label: 'Lake Heritage', href: '/#about' },
                      { label: 'Fleet & Craft', href: '/booking' },
                      { label: 'Safety Charter', href: '/safety' },
                      { label: 'Concierge', href: 'https://wa.me/94771234567', isExternal: true },
                    ].map((item) => {
                      const handleClick = (e: React.MouseEvent) => {
                        setMenuDrawerOpen(false);
                        if (item.href === '/booking') {
                          e.preventDefault();
                          handleBookingClick();
                        }
                      };

                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          target={item.isExternal ? '_blank' : undefined}
                          rel={item.isExternal ? 'noopener noreferrer' : undefined}
                          onClick={handleClick}
                          className="group/link text-stone-900 hover:text-[#E63925] font-sans font-bold text-lg lg:text-xl tracking-tight transition-colors py-2 border-b border-stone-100 flex items-center justify-between cursor-pointer"
                        >
                          <span className="group-hover/link:translate-x-1 transition-transform">
                            {item.label}
                          </span>
                          <span className="text-xs text-[#E63925] opacity-0 group-hover/link:opacity-100 transition-opacity font-mono">
                            →
                          </span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                {/* Secondary Category Filter Tags */}
                <div className="pt-4 border-t border-stone-200 space-y-2">
                  <span className="text-[9px] font-mono text-stone-400 uppercase tracking-widest block font-medium">
                    CATEGORY FILTERS
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['All', 'Dawn Paddle', 'Sunset Safari', 'Private Island', 'Heritage Trail'].map((tag) => (
                      <span
                        key={tag}
                        onClick={() => setMenuDrawerOpen(false)}
                        className="px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-[10px] font-mono text-stone-700 uppercase font-semibold hover:bg-[#E63925] hover:text-white hover:border-[#E63925] transition-all cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* COLUMN 2: Solid High-Contrast Poster Column (Span 3 / 12) */}
              <div className="lg:col-span-3 bg-[#E63925] text-white rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-md hover:scale-[1.015] transition-all duration-500 group">
                <div>
                  <div className="flex items-center justify-between border-b border-white/20 pb-3">
                    <span className="text-[10px] font-mono tracking-[0.25em] uppercase font-bold text-white/90">
                      POSTER / 02
                    </span>
                    <span className="text-xs font-mono font-bold bg-white text-[#E63925] px-2 py-0.5 rounded-full">
                      05.30 — 08.30
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    <h3 className="font-serif text-3xl sm:text-4xl text-white font-bold leading-none uppercase tracking-tight">
                      Kalawewa Dawn
                    </h3>
                    <p className="text-xs text-white/90 font-sans font-light leading-relaxed">
                      Silent morning mist &amp; migratory waterfowl navigation across King Dhatusena&apos;s 5th-century hydraulic waters.
                    </p>
                  </div>
                </div>

                {/* Graphic Element: Silhouette Kayak Paddle Artwork */}
                <div className="pt-6 relative">
                  <div className="w-full h-32 relative flex items-end justify-center">
                    <svg className="w-24 h-24 text-white/30 group-hover:scale-110 transition-transform duration-700" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L15 8.5C14 10 12 11 12 11C12 11 10 10 9 8.5L12 2Z" />
                      <path d="M12 11V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M4 18C8 16 16 16 20 18" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  </div>

                  <Link
                    href="/packages"
                    onClick={() => setMenuDrawerOpen(false)}
                    className="w-full py-2.5 px-4 bg-white hover:bg-stone-100 text-[#E63925] text-xs font-mono font-bold uppercase tracking-wider rounded-full transition-all block text-center shadow-sm"
                  >
                    EXPLORE DAWN TOUR →
                  </Link>
                </div>
              </div>

              {/* COLUMN 3: Geometric Semicircle Showcase (Span 3 / 12) */}
              <div className="lg:col-span-3 bg-white border border-stone-300 rounded-2xl p-6 flex flex-col justify-between relative shadow-sm hover:shadow-md hover:scale-[1.015] transition-all duration-500 group">
                <div>
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <span className="text-[10px] font-mono text-[#E63925] tracking-[0.25em] uppercase font-bold">
                      SEMICIRCLE / 03
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-500">18.2</span>
                  </div>

                  {/* Semicircle Image Window Cutout */}
                  <div className="w-full h-44 sm:h-48 rounded-t-full overflow-hidden relative border border-stone-200 mt-4 group bg-stone-100 shadow-inner">
                    <Image
                      src="/images/sunrise-paddle.jpg"
                      alt="Full Moon Kayak Expedition"
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 1200px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-[#E63925]/15 mix-blend-multiply" />
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-serif text-xl text-stone-900 font-bold uppercase tracking-tight">
                      Full Moon Paddle
                    </h4>
                    <span className="font-mono text-sm text-[#E63925] font-bold">18.2</span>
                  </div>
                  <p className="text-xs text-stone-600 font-sans font-light leading-relaxed">
                    Starlight water reflection &amp; nocturnal lake navigation with full equipment safety charter.
                  </p>
                </div>
              </div>

              {/* COLUMN 4: Dark Inverted Split Column (Span 3 / 12) */}
              <div className="lg:col-span-3 bg-[#0B1914] text-white rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-md border border-stone-800 hover:scale-[1.015] transition-all duration-500 group">
                <div>
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                    <span className="text-[10px] font-mono text-[#d4af37] tracking-[0.25em] uppercase font-bold">
                      INVERTED / 04
                    </span>
                    <span className="text-xs font-mono font-bold text-[#d4af37]">14.3</span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <h4 className="font-serif text-2xl text-white font-bold uppercase tracking-tight">
                      Elephant Corridor
                    </h4>
                    <p className="text-xs text-stone-300 font-sans font-light leading-relaxed">
                      Wild elephant gathering sanctuary preserving Sri Lanka&apos;s ancient hydraulic ecosystem.
                    </p>
                  </div>
                </div>

                {/* Inverse Arch / Semicircle Window */}
                <div className="pt-3">
                  <div className="w-full h-36 rounded-b-full overflow-hidden relative border border-white/20 group bg-stone-900 shadow-inner">
                    <Image
                      src="/images/wildlife-elephant.jpg"
                      alt="Elephant Corridor Wildlife"
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 1200px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1914] via-transparent to-transparent" />
                  </div>

                  <button
                    onClick={(e) => {
                      setMenuDrawerOpen(false);
                      handleBookingClick(e);
                    }}
                    className="w-full mt-4 py-2.5 px-4 bg-[#d4af37] hover:bg-[#b8972e] text-[#07130E] text-xs font-mono font-bold uppercase tracking-wider rounded-full text-center transition-all cursor-pointer shadow-md"
                  >
                    BOOK CHARTER NOW
                  </button>
                </div>
              </div>

            </div>

            {/* Footer Bar inside Swiss Overlay */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-stone-600 border-t border-stone-300 pt-4 shrink-0 gap-3 font-mono">
              <div className="flex items-center gap-6">
                <span className="font-bold text-stone-900">© KAYAKING KALAWEWA</span>
                <Link
                  href="/admin"
                  onClick={() => setMenuDrawerOpen(false)}
                  className="hover:text-[#E63925] tracking-widest uppercase transition-colors"
                >
                  OPERATOR ACCESS →
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="tel:+94771234567"
                  className="text-stone-800 hover:text-[#E63925] transition-colors font-medium"
                >
                  +94 77 123 4567
                </a>
                <span className="text-stone-300">•</span>
                <a
                  href="mailto:expeditions@kalawewakayak.lk"
                  className="text-stone-800 hover:text-[#E63925] transition-colors font-medium"
                >
                  expeditions@kalawewakayak.lk
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Modals */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
      <BookingModal isOpen={localBookingOpen} onClose={() => setLocalBookingOpen(false)} />
      <AuthModal isOpen={headerAuthOpen} onClose={() => setHeaderAuthOpen(false)} />
    </>
  );
}



