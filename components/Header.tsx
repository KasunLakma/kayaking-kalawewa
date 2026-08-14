'use client';

import React, { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  return (
    <>
      {/* Floating Glass Navbar Wrapper */}
      <div className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6">
        <header className="max-w-6xl mx-auto mt-4 px-6 py-3.5 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-between transition-all duration-300">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] via-amber-400 to-amber-600 flex items-center justify-center text-[#071410] shadow-md group-hover:scale-105 transition-transform duration-300 border border-[#D4AF37]/50">
              {/* Gold Leaf Icon */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.0001 3C17.0001 3 13.0001 3.5 10.0001 6.5C7.00012 9.5 6.50012 13.5 6.50012 13.5C6.50012 13.5 10.5001 13 13.5001 10C16.5001 7 17.0001 3 17.0001 3Z" />
                <path d="M6.50012 13.5C6.50012 13.5 3.00012 17 3.00012 21M6.50012 13.5C7.50012 15.5 9.50012 18 13.5001 19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-serif font-bold text-base sm:text-lg tracking-wider text-white uppercase group-hover:text-[#D4AF37] transition-colors">
              KALAWEWA ADVENTURES
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-widest text-slate-200">
            <a href="#featured-trips" className="hover:text-[#D4AF37] transition-colors py-1">
              Expeditions
            </a>
            <a href="#trip-styles" className="hover:text-[#D4AF37] transition-colors py-1">
              Trip Styles
            </a>
            <a href="#safety" className="hover:text-[#D4AF37] transition-colors py-1">
              Safety &amp; Heritage
            </a>
            <a href="#testimonials" className="hover:text-[#D4AF37] transition-colors py-1">
              Reviews
            </a>
          </nav>

          {/* Right Action Gold Pill CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setInfoModalOpen(true)}
              className="text-[11px] font-semibold text-emerald-200/80 hover:text-[#D4AF37] uppercase tracking-wider transition-colors pr-2"
              title="Request Private Catalog"
            >
              Catalog
            </button>
            <a
              href="#featured-trips"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-amber-300 to-[#D4AF37] text-[#071410] text-xs font-bold uppercase tracking-widest shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 border border-[#D4AF37]/50"
            >
              Book Your Trip
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-slate-200 hover:text-[#D4AF37] transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </header>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden max-w-6xl mx-auto mt-2 p-5 rounded-3xl bg-black/80 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-4">
            <nav className="flex flex-col space-y-3 text-xs font-semibold uppercase tracking-wider text-slate-200">
              <a
                href="#featured-trips"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#D4AF37] py-2 border-b border-white/10"
              >
                Expeditions
              </a>
              <a
                href="#trip-styles"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#D4AF37] py-2 border-b border-white/10"
              >
                Trip Styles
              </a>
              <a
                href="#safety"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#D4AF37] py-2 border-b border-white/10"
              >
                Safety &amp; Heritage
              </a>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#D4AF37] py-2 border-b border-white/10"
              >
                Reviews
              </a>
            </nav>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="#featured-trips"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-amber-300 to-[#D4AF37] text-[#071410] text-xs font-bold uppercase tracking-widest shadow-lg border border-[#D4AF37]/50"
              >
                Book Your Trip
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setInfoModalOpen(true);
                }}
                className="w-full text-center py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium uppercase tracking-wider text-slate-300 hover:text-[#D4AF37]"
              >
                Request Catalog
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Info Modal */}
      {infoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#071410] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_25px_50px_rgba(0,0,0,0.8)] relative">
            <button
              onClick={() => setInfoModalOpen(false)}
              className="absolute top-4 right-4 text-emerald-400 hover:text-white transition-colors"
            >
              ✕
            </button>
            <div className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
              KALAWEWA LUXURY CATALOG
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 font-serif">Request Trip Details &amp; Itinerary</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6 font-light">
              Have questions regarding seasonal elephant gatherings, water level forecasts, or private charter bookings? Speak directly with our lead naturalist in Kalawewa.
            </p>
            <div className="space-y-3 text-xs text-slate-200 mb-6">
              <div className="p-3.5 bg-[#040d0a] rounded-2xl border border-[#D4AF37]/20 flex items-center justify-between">
                <span>Phone / WhatsApp:</span>
                <span className="font-bold text-[#D4AF37]">+94 77 123 4567</span>
              </div>
              <div className="p-3.5 bg-[#040d0a] rounded-2xl border border-[#D4AF37]/20 flex items-center justify-between">
                <span>Email Support:</span>
                <span className="font-bold text-[#D4AF37]">expeditions@kalawewakayak.lk</span>
              </div>
            </div>
            <button
              onClick={() => setInfoModalOpen(false)}
              className="w-full py-3 rounded-full bg-[#D4AF37] text-[#071410] font-bold text-xs uppercase tracking-widest hover:bg-amber-300 transition-colors shadow-lg"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </>
  );
}

