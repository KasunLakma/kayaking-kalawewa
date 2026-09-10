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

      {/* 2. PINTEREST FLOATING GLASS CARD MENU OVERLAY */}
      {menuDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300 overflow-y-auto">
          {/* Floating Glassmorphism Menu Card */}
          <div className="w-full max-w-4xl bg-[#0B1914]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl transition-all relative overflow-hidden my-auto max-h-[90vh] flex flex-col justify-between">
            {/* Top Bar inside Floating Card */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37]">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L15 8.5C14 10 12 11 12 11C12 11 10 10 9 8.5L12 2Z" />
                    <path d="M12 11V22" />
                  </svg>
                </div>
                <span className="font-serif text-sm sm:text-base tracking-[0.25em] text-[#F4F1EA] uppercase font-medium">
                  KALAWEWA SANCTUARY
                </span>
              </div>

              <button
                onClick={() => setMenuDrawerOpen(false)}
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:rotate-90 hover:border-[#d4af37] text-[#d4af37] hover:text-white transition-all duration-300 cursor-pointer bg-[#07130E]/80"
                aria-label="Close Navigation Menu"
              >
                <span className="text-sm font-bold">✕</span>
              </button>
            </div>

            {/* Main Content Area inside Floating Glass Card */}
            <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center overflow-y-auto">
              {/* Left Navigation Items */}
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
                        className="group border-b border-white/10 py-3 transition-all"
                      >
                        <Link
                          href={item.href}
                          onClick={handleClick}
                          className="flex items-center justify-between group-hover:translate-x-2 transition-transform duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-mono text-[#d4af37] tracking-widest font-medium">
                              {item.num}.
                            </span>
                            <span className="font-serif text-lg sm:text-2xl lg:text-3xl text-[#f5f2eb] group-hover:text-[#d4af37] transition-colors duration-300">
                              {item.label}
                            </span>
                          </div>
                          <span className="text-[#d4af37] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-base">
                            →
                          </span>
                        </Link>
                      </div>
                    );
                  })}
                </nav>

                {/* Mobile Actions inside Card */}
                <div className="flex flex-wrap items-center gap-3 pt-4 lg:hidden">
                  <button
                    onClick={() => {
                      setMenuDrawerOpen(false);
                      setSearchModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-full border border-white/20 text-stone-200 text-xs font-mono tracking-wider uppercase flex items-center gap-2 bg-white/5 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>SEARCH</span>
                  </button>

                  {userProfile ? (
                    <Link
                      href="/account"
                      onClick={() => setMenuDrawerOpen(false)}
                      className="px-4 py-2 rounded-full border border-[#d4af37]/60 text-[#d4af37] text-xs font-mono tracking-wider uppercase flex items-center gap-2 bg-[#d4af37]/10"
                    >
                      <span>👤 MY ACCOUNT</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        setMenuDrawerOpen(false);
                        setHeaderAuthOpen(true);
                      }}
                      className="px-4 py-2 rounded-full border border-white/20 text-stone-200 text-xs font-mono tracking-wider uppercase flex items-center gap-2 bg-white/5 cursor-pointer"
                    >
                      <span>🔑 SIGN IN</span>
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      setMenuDrawerOpen(false);
                      handleBookingClick(e);
                    }}
                    className="px-5 py-2 rounded-full bg-[#d4af37] hover:bg-[#b8972e] text-[#07130E] text-xs font-semibold tracking-wider uppercase cursor-pointer"
                  >
                    RESERVE NOW
                  </button>
                </div>
              </div>

              {/* Right Visual Preview Card */}
              <div className="hidden lg:flex lg:col-span-5 flex-col space-y-4">
                <div className="relative h-56 rounded-2xl overflow-hidden border border-white/15 shadow-xl group bg-[#13241E]">
                  <Image
                    src={PREVIEW_ITEMS[activePreviewIndex].image}
                    alt={PREVIEW_ITEMS[activePreviewIndex].label}
                    fill
                    className="object-cover object-center transition-all duration-700 group-hover:scale-105"
                    sizes="(max-width: 1200px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07130E] via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#d4af37] font-medium block mb-0.5">
                      PREVIEW {PREVIEW_ITEMS[activePreviewIndex].num}
                    </span>
                    <span className="text-xs font-serif text-[#f5f2eb] font-normal block leading-tight">
                      {PREVIEW_ITEMS[activePreviewIndex].caption}
                    </span>
                  </div>
                </div>

                <div className="bg-[#07130E]/80 border border-white/10 rounded-2xl p-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-stone-400 font-light">Operating Hours:</span>
                    <span className="text-[#f5f2eb] font-medium">6:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-stone-400 font-light">GPS Coordinates:</span>
                    <span className="text-[#d4af37] font-mono">8.0264° N, 80.5284° E</span>
                  </div>
                  <div className="pt-1 flex items-center gap-2">
                    <a
                      href="tel:+94771234567"
                      className="flex-1 py-1.5 px-3 bg-[#13241E] hover:bg-[#1a3028] border border-white/20 text-[#f3efe6] text-[11px] transition-colors rounded-xl flex items-center justify-center gap-1"
                    >
                      <span>📞 Call Us</span>
                    </a>
                    <a
                      href="https://wa.me/94771234567"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1.5 px-3 bg-[#132b22] border border-[#d4af37]/40 text-[#d4af37] text-[11px] transition-colors rounded-xl flex items-center justify-center gap-1"
                    >
                      <span>💬 WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer inside Floating Card */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 border-t border-white/10 pt-4 shrink-0 gap-2">
              <div className="flex items-center gap-4">
                <span>© Kayaking Kalawewa</span>
                <Link
                  href="/admin"
                  onClick={() => setMenuDrawerOpen(false)}
                  className="hover:text-[#d4af37] tracking-widest uppercase transition-colors"
                >
                  Operator Access →
                </Link>
              </div>
              <a
                href="mailto:expeditions@kalawewakayak.lk"
                className="text-[#f3efe6] hover:text-[#d4af37] transition-colors"
              >
                expeditions@kalawewakayak.lk
              </a>
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



