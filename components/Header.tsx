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

      {/* 2. KALAWEWA DARK LUXURY EDITORIAL MEGA-DRAWER OVERLAY */}
      {menuDrawerOpen && (
        <div className="fixed inset-0 z-[100] bg-[#06100B]/95 backdrop-blur-2xl text-[#f3efe6] overflow-y-auto p-4 sm:p-6 md:p-10 lg:p-12 flex flex-col justify-between animate-in fade-in duration-300">
          
          {/* Main Editorial Container */}
          <div className="relative w-full max-w-7xl my-auto max-h-[94vh] flex flex-col justify-between overflow-y-auto no-scrollbar py-2">
            
            {/* Top Control Bar */}
            <div className="flex items-center justify-between pb-5 border-b border-white/10 shrink-0">
              <Link
                href="/"
                onClick={() => setMenuDrawerOpen(false)}
                className="flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37] font-mono text-xs font-bold flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                  KW
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-lg sm:text-xl font-normal tracking-[0.15em] text-[#f3efe6] group-hover:text-[#d4af37] transition-colors leading-none uppercase">
                    KALAWEWA
                  </span>
                  <span className="text-[8px] font-mono tracking-[0.3em] text-[#d4af37] uppercase mt-1 opacity-90 font-medium">
                    SANCTUARY EDITORIAL SHOWCASE
                  </span>
                </div>
              </Link>

              {/* Minimal Clean Close Button ("✕") with Gold Accent */}
              <button
                onClick={() => setMenuDrawerOpen(false)}
                className="w-10 h-10 rounded-full border border-white/20 hover:border-[#d4af37] text-stone-300 hover:text-white hover:rotate-90 transition-all duration-300 cursor-pointer bg-white/5 shadow-lg flex items-center justify-center"
                aria-label="Close Navigation Menu"
              >
                <span className="text-base font-bold">✕</span>
              </button>
            </div>

            {/* FOUR-COLUMN DARK LUXURY GRID ARCHITECTURE */}
            <div className="py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-6 min-h-[480px] items-stretch border-t border-b border-white/10 my-4">
              
              {/* COLUMN 1: Index & Typography Links (Span 3 / 12) */}
              <div className="lg:col-span-3 bg-[#0B1D16]/70 border border-white/10 rounded-2xl p-6 flex flex-col justify-between relative shadow-xl hover:border-white/20 hover:scale-[1.015] transition-all duration-500">
                <span className="hidden xl:block absolute -left-7 bottom-16 -rotate-90 origin-center text-[9px] tracking-[0.3em] font-mono text-stone-500 uppercase pointer-events-none whitespace-nowrap">
                  — ARCHIVE / EXPEDITIONS
                </span>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-[10px] font-mono text-[#d4af37] tracking-[0.25em] uppercase font-bold">
                      KW — INDEX 01
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
                  </div>

                  {/* Primary Navigation List */}
                  <nav className="flex flex-col space-y-1">
                    {[
                      { num: '01', label: 'EXPEDITIONS', href: '/packages' },
                      { num: '02', label: 'LAKE HERITAGE', href: '/#about' },
                      { num: '03', label: 'FLEET & CRAFT', href: '/booking' },
                      { num: '04', label: 'SAFETY CHARTER', href: '/safety' },
                      { num: '05', label: 'CONCIERGE', href: 'https://wa.me/94771234567', isExternal: true },
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
                          key={item.num}
                          href={item.href}
                          target={item.isExternal ? '_blank' : undefined}
                          rel={item.isExternal ? 'noopener noreferrer' : undefined}
                          onClick={handleClick}
                          className="group/link text-stone-300 hover:text-[#d4af37] font-serif text-base lg:text-lg tracking-[0.15em] transition-colors duration-200 py-2 border-b border-white/5 flex items-center justify-between cursor-pointer"
                        >
                          <span className="group-hover/link:translate-x-1 transition-transform flex items-center gap-2">
                            <span className="text-xs font-mono text-[#d4af37]/80">{item.num}</span>
                            <span>{item.label}</span>
                          </span>
                          <span className="text-xs text-[#d4af37] opacity-0 group-hover/link:opacity-100 transition-opacity font-mono">
                            →
                          </span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                {/* Secondary Category Filter Tags */}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <span className="text-[9px] font-mono text-stone-400 uppercase tracking-widest block font-medium">
                    CATEGORY FILTERS
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['All', 'Dawn Paddle', 'Sunset Safari', 'Private Island', 'Heritage Trail'].map((tag) => (
                      <span
                        key={tag}
                        onClick={() => setMenuDrawerOpen(false)}
                        className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-stone-300 uppercase font-medium hover:bg-[#d4af37]/20 hover:text-[#d4af37] hover:border-[#d4af37]/50 transition-all cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* COLUMN 2: Deep Forest Emerald & Gold Foil Poster Column (Span 3 / 12) */}
              <div className="lg:col-span-3 bg-gradient-to-b from-[#133827] to-[#0A1F16] border border-[#d4af37]/30 text-white rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xl hover:border-[#d4af37]/60 hover:scale-[1.015] transition-all duration-500 group">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-[10px] font-mono tracking-[0.25em] uppercase font-bold text-[#d4af37]">
                      POSTER / 02
                    </span>
                    <span className="text-xs font-mono font-medium bg-[#06100B]/80 text-[#d4af37] px-2.5 py-0.5 rounded-full border border-[#d4af37]/30">
                      05.30 — 08.30
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#f3efe6] font-normal tracking-[0.1em] uppercase leading-tight group-hover:text-[#d4af37] transition-colors">
                      Kalawewa Dawn
                    </h3>
                    <p className="text-xs text-stone-300 font-sans font-light leading-relaxed">
                      Silent morning mist &amp; migratory waterfowl navigation across King Dhatusena&apos;s 5th-century hydraulic waters.
                    </p>
                  </div>
                </div>

                {/* Graphic Element: Gold Paddle Silhouette Artwork */}
                <div className="pt-6 relative">
                  <div className="w-full h-32 relative flex items-end justify-center">
                    <svg className="w-24 h-24 text-[#d4af37]/25 group-hover:scale-110 transition-transform duration-700" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L15 8.5C14 10 12 11 12 11C12 11 10 10 9 8.5L12 2Z" />
                      <path d="M12 11V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M4 18C8 16 16 16 20 18" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  </div>

                  <Link
                    href="/packages"
                    onClick={() => setMenuDrawerOpen(false)}
                    className="w-full py-2.5 px-4 bg-[#d4af37] hover:bg-[#b8972e] text-[#06100B] text-xs font-semibold tracking-widest uppercase rounded-full text-center transition-all block shadow-md"
                  >
                    EXPLORE DAWN TOUR →
                  </Link>
                </div>
              </div>

              {/* COLUMN 3: Geometric Semicircle Showcase (Span 3 / 12) */}
              <div className="lg:col-span-3 bg-[#0B1D16]/70 border border-white/10 rounded-2xl p-6 flex flex-col justify-between relative shadow-xl hover:border-white/20 hover:scale-[1.015] transition-all duration-500 group">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-[10px] font-mono text-[#d4af37] tracking-[0.25em] uppercase font-bold">
                      SEMICIRCLE / 03
                    </span>
                    <span className="text-xs font-mono font-medium text-[#d4af37]">18.2</span>
                  </div>

                  {/* Semicircle Image Cutout Framed with Gold Border */}
                  <div className="w-full h-44 sm:h-48 rounded-t-full overflow-hidden relative border border-[#d4af37]/30 mt-4 group bg-[#08140F] shadow-inner">
                    <Image
                      src="/images/sunrise-paddle.jpg"
                      alt="Full Moon Kayak Expedition"
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 1200px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06100B] via-transparent to-transparent opacity-80" />
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-serif text-xl text-[#f3efe6] font-normal tracking-[0.1em] uppercase">
                      Full Moon Paddle
                    </h4>
                    <span className="font-mono text-xs text-[#d4af37] font-medium">18.2</span>
                  </div>
                  <p className="text-xs text-stone-300 font-sans font-light leading-relaxed">
                    Starlight water reflection &amp; nocturnal lake navigation with full equipment safety charter.
                  </p>
                </div>
              </div>

              {/* COLUMN 4: Dark Inverted Obsidian Black Card (Span 3 / 12) */}
              <div className="lg:col-span-3 bg-[#050B08] border border-white/15 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl hover:border-[#d4af37]/50 hover:scale-[1.015] transition-all duration-500 group">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-[10px] font-mono text-[#d4af37] tracking-[0.25em] uppercase font-bold">
                      INVERTED / 04
                    </span>
                    <span className="text-xs font-mono font-medium text-[#d4af37]">14.3</span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <h4 className="font-serif text-2xl text-[#f3efe6] font-normal tracking-[0.1em] uppercase">
                      Elephant Corridor
                    </h4>
                    <p className="text-xs text-stone-300 font-sans font-light leading-relaxed">
                      Wild elephant gathering sanctuary preserving Sri Lanka&apos;s ancient hydraulic ecosystem.
                    </p>
                  </div>
                </div>

                {/* Inverse Arch Cutout Window */}
                <div className="pt-3">
                  <div className="w-full h-36 rounded-b-full overflow-hidden relative border border-[#d4af37]/30 group bg-[#08140F] shadow-inner">
                    <Image
                      src="/images/wildlife-elephant.jpg"
                      alt="Elephant Corridor Wildlife"
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 1200px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050B08] via-transparent to-transparent" />
                  </div>

                  <button
                    onClick={(e) => {
                      setMenuDrawerOpen(false);
                      handleBookingClick(e);
                    }}
                    className="w-full mt-4 py-2.5 px-4 bg-[#d4af37] hover:bg-[#b8972e] text-[#06100B] text-xs font-semibold tracking-widest uppercase rounded-full text-center transition-all cursor-pointer shadow-md"
                  >
                    BOOK CHARTER NOW
                  </button>
                </div>
              </div>

            </div>

            {/* Footer Bar inside Dark Luxury Overlay */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 border-t border-white/10 pt-4 shrink-0 gap-3 font-mono">
              <div className="flex items-center gap-6">
                <span className="text-[#f3efe6]">© KAYAKING KALAWEWA</span>
                <Link
                  href="/admin"
                  onClick={() => setMenuDrawerOpen(false)}
                  className="hover:text-[#d4af37] tracking-widest uppercase transition-colors"
                >
                  OPERATOR ACCESS →
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="tel:+94771234567"
                  className="text-stone-300 hover:text-[#d4af37] transition-colors font-medium"
                >
                  +94 77 123 4567
                </a>
                <span className="text-white/20">•</span>
                <a
                  href="mailto:expeditions@kalawewakayak.lk"
                  className="text-[#f3efe6] hover:text-[#d4af37] transition-colors font-medium"
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



