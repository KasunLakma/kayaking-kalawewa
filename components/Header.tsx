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

      {/* 2. PINTEREST EDITORIAL MULTI-COLUMN MEGA-DRAWER OVERLAY */}
      {menuDrawerOpen && (
        <div className="fixed inset-0 z-[100] bg-[#07130E]/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 md:p-10 lg:p-12 overflow-y-auto animate-in fade-in duration-300">
          
          {/* Main Editorial Container */}
          <div className="relative w-full max-w-6xl my-auto max-h-[92vh] flex flex-col justify-between overflow-y-auto no-scrollbar py-2">
            
            {/* Top Control Bar */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 shrink-0">
              <Link
                href="/"
                onClick={() => setMenuDrawerOpen(false)}
                className="flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37] group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L15 8.5C14 10 12 11 12 11C12 11 10 10 9 8.5L12 2Z" />
                    <path d="M12 11V22" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-base sm:text-lg tracking-[0.25em] text-[#F4F1EA] group-hover:text-[#d4af37] transition-colors leading-none uppercase font-medium">
                    KALAWEWA
                  </span>
                  <span className="text-[8px] font-mono tracking-[0.3em] text-[#d4af37] uppercase mt-1 opacity-90">
                    SANCTUARY EDITORIAL SHOWCASE
                  </span>
                </div>
              </Link>

              <button
                onClick={() => setMenuDrawerOpen(false)}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:rotate-90 hover:border-[#d4af37] text-[#d4af37] hover:text-white transition-all duration-300 cursor-pointer bg-[#07130E]/80 shadow-lg"
                aria-label="Close Navigation Menu"
              >
                <span className="text-base font-bold">✕</span>
              </button>
            </div>

            {/* 4-COLUMN EDITORIAL CARD GRID */}
            <div className="py-6 sm:py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 min-h-[460px] items-stretch">
              
              {/* COLUMN 1: Primary Navigation Links */}
              <div className="bg-[#0B1914]/80 border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-xl hover:border-white/20 transition-all duration-300">
                <div className="space-y-4">
                  <span className="text-[10px] font-mono text-[#d4af37] tracking-[0.25em] uppercase font-semibold block border-b border-white/10 pb-3">
                    01 / PRIMARY EXPEDITIONS
                  </span>
                  <nav className="flex flex-col space-y-2.5 font-serif">
                    {[
                      { num: '01', title: 'Dawn & Dusk Expeditions', href: '/packages' },
                      { num: '02', title: 'Ancient Lake Heritage', href: '/#about' },
                      { num: '03', title: 'Wilderness Safety', href: '/safety' },
                      { num: '04', title: 'Private Fleet & Charters', href: '/booking' },
                      { num: '05', title: 'Contact Concierge', href: 'https://wa.me/94771234567', isExternal: true },
                    ].map((item, idx) => {
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
                          onMouseEnter={() => setActivePreviewIndex(idx % PREVIEW_ITEMS.length)}
                          className="group/link flex items-center justify-between py-2 border-b border-white/5 text-stone-300 hover:text-[#d4af37] transition-all cursor-pointer"
                        >
                          <span className="text-xs sm:text-sm lg:text-base font-light tracking-wide group-hover/link:translate-x-1 transition-transform">
                            {item.num} / {item.title}
                          </span>
                          <span className="text-xs text-[#d4af37] opacity-0 group-hover/link:opacity-100 transition-opacity">
                            →
                          </span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-4 border-t border-white/10 text-[10px] font-mono text-stone-400">
                  <span className="text-[#d4af37]">SELECT DESTINATION</span> — GUIDED ECO-TOURS
                </div>
              </div>

              {/* COLUMN 2: Featured Highlight Card (Editorial Color Accent) */}
              <div className="bg-[#13281E] border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xl group hover:border-[#d4af37]/40 transition-all duration-300">
                {/* Background Paddle Monogram Silhouette */}
                <div className="absolute -bottom-8 -right-8 w-36 h-36 opacity-10 pointer-events-none text-[#d4af37] group-hover:scale-110 transition-transform duration-700">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15 8.5C14 10 12 11 12 11C12 11 10 10 9 8.5L12 2Z" />
                    <path d="M12 11V22" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>

                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-[10px] font-mono text-[#d4af37] tracking-[0.25em] uppercase font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                      FEATURED HIGHLIGHT
                    </span>
                    <span className="text-[9px] font-mono text-stone-400 uppercase">05:30 AM</span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <h3 className="font-serif text-xl sm:text-2xl text-[#f5f2eb] font-normal leading-tight group-hover:text-[#d4af37] transition-colors">
                      Dawn Paddle &amp; Bird Watching
                    </h3>
                    <p className="text-xs text-stone-300 font-light leading-relaxed">
                      Silent 5:30 AM guided navigation across King Dhatusena&apos;s ancient waters as lake wildlife awakens.
                    </p>
                  </div>
                </div>

                <div className="pt-6 space-y-3">
                  <div className="bg-[#0B1914]/60 border border-white/10 rounded-xl p-3 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-stone-300 font-mono text-[11px]">
                      <span>Session:</span>
                      <span className="text-[#f5f2eb]">05:30 AM – 08:30 AM</span>
                    </div>
                    <div className="flex items-center justify-between text-stone-300 font-mono text-[11px]">
                      <span>GPS Ref:</span>
                      <span className="text-[#d4af37]">8.0264° N, 80.5284° E</span>
                    </div>
                  </div>

                  <Link
                    href="/packages"
                    onClick={() => setMenuDrawerOpen(false)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#d4af37] hover:text-white transition-colors"
                  >
                    <span>View Expedition Details</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* COLUMN 3: Lake Atmosphere Showcase Card */}
              <div className="rounded-2xl overflow-hidden relative group border border-white/10 shadow-xl min-h-[320px] flex flex-col justify-between p-6 bg-[#13241E]">
                <Image
                  src="/images/wildlife-elephant.jpg"
                  alt="Kalawewa Wildlife Corridor"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1200px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07130E] via-[#07130E]/60 to-black/20" />

                <div className="relative z-10 flex items-center justify-between border-b border-white/20 pb-3">
                  <span className="text-[10px] font-mono text-[#d4af37] tracking-[0.25em] uppercase font-semibold">
                    WILDLIFE CORRIDOR
                  </span>
                  <span className="text-[9px] font-mono text-white/80 uppercase px-2 py-0.5 rounded-full bg-black/40 border border-white/10">
                    PROTECTED
                  </span>
                </div>

                <div className="relative z-10 mt-auto pt-6 space-y-2">
                  <h4 className="font-serif text-lg text-white font-normal leading-snug">
                    Elephant Corridor &amp; Wetland Habitat
                  </h4>
                  <p className="text-xs text-stone-300 font-light leading-relaxed line-clamp-2">
                    Ancient hydraulic reservoir supporting over 120 bird species &amp; wild elephant herds.
                  </p>
                  
                  <Link
                    href="/safety"
                    onClick={() => setMenuDrawerOpen(false)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#d4af37] hover:text-white transition-colors pt-2"
                  >
                    <span>Explore Route</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* COLUMN 4: Quick Action & Booking Status Card */}
              <div className="bg-[#0B1914] border border-[#d4af37]/30 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-[#d4af37]/60 transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/40 text-[#d4af37] text-[10px] font-mono uppercase tracking-widest">
                      <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
                      4 SLOTS LEFT TODAY
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-serif text-xl text-[#f5f2eb] font-normal">
                      Instant Reservation
                    </h4>
                    <p className="text-xs text-stone-300 font-light leading-relaxed">
                      Lock in your private paddle session with pay-on-arrival flexibility &amp; full equipment briefing.
                    </p>
                  </div>
                </div>

                <div className="pt-6 space-y-3">
                  <button
                    onClick={(e) => {
                      setMenuDrawerOpen(false);
                      handleBookingClick(e);
                    }}
                    className="w-full py-3 px-4 bg-[#d4af37] hover:bg-[#b8972e] text-[#07130E] text-xs font-semibold uppercase tracking-wider rounded-full text-center transition-all shadow-lg hover:scale-[1.02] cursor-pointer"
                  >
                    INSTANT RESERVATION
                  </button>

                  <a
                    href="https://wa.me/94771234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#d4af37]/50 text-stone-200 hover:text-[#d4af37] text-xs font-medium uppercase tracking-wider rounded-full text-center transition-all flex items-center justify-center gap-2"
                  >
                    <span>💬 WhatsApp Concierge</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Footer Bar inside Mega-Drawer */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 border-t border-white/10 pt-4 shrink-0 gap-3">
              <div className="flex items-center gap-6">
                <span>© Kayaking Kalawewa Sanctuary</span>
                <Link
                  href="/admin"
                  onClick={() => setMenuDrawerOpen(false)}
                  className="hover:text-[#d4af37] tracking-widest uppercase transition-colors"
                >
                  Operator Access →
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="tel:+94771234567"
                  className="text-stone-300 hover:text-[#d4af37] transition-colors"
                >
                  +94 77 123 4567
                </a>
                <span className="text-white/20">•</span>
                <a
                  href="mailto:expeditions@kalawewakayak.lk"
                  className="text-[#f3efe6] hover:text-[#d4af37] transition-colors"
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



