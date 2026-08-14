'use client';

import React, { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  return (
    <>
      {/* Top Luxury Utility Bar */}
      <div className="w-full bg-[#040d0a] text-xs text-emerald-200/80 py-2.5 px-4 sm:px-8 border-b border-[#D4AF37]/20 flex flex-wrap justify-between items-center z-50 relative">
        <div className="flex items-center gap-4 mx-auto sm:mx-0">
          <span className="flex items-center gap-1.5 font-medium text-emerald-100/90">
            <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Expedition Concierge: <a href="tel:+94771234567" className="font-bold text-[#D4AF37] hover:underline tracking-wide">+94 77 123 4567</a>
          </span>
          <span className="hidden md:inline text-[#D4AF37]/30">•</span>
          <span className="hidden md:inline text-emerald-300/70 tracking-wide">5th-Century Reservoir Eco-Resort Expeditions</span>
        </div>

        <div className="flex items-center gap-4 mx-auto sm:mx-0 mt-1 sm:mt-0">
          <button
            onClick={() => setInfoModalOpen(true)}
            className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 font-semibold uppercase tracking-widest text-[11px] text-emerald-200/90"
          >
            <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Request Private Catalog
          </button>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-[#071410]/90 backdrop-blur-xl border-b border-[#D4AF37]/20 shadow-2xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] via-amber-400 to-amber-600 flex items-center justify-center text-[#071410] shadow-lg group-hover:scale-105 transition-transform duration-300 border border-[#D4AF37]/40">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L2 19h20L12 2zm0 3.8L18.5 17H5.5L12 5.8zM11 9h2v4h-2V9zm0 6h2v2h-2v-2z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white uppercase group-hover:text-[#D4AF37] transition-colors leading-none font-serif">
                KAYAKING KALAWEWA
              </span>
              <span className="text-[9px] font-bold text-[#D4AF37] tracking-[0.25em] uppercase mt-1">
                LUXURY ECO-RESORT & EXPEDITIONS
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-slate-300">
            <a href="#featured-trips" className="hover:text-[#D4AF37] transition-colors py-2 border-b-2 border-transparent hover:border-[#D4AF37]">
              Destinations
            </a>
            <a href="#trip-styles" className="hover:text-[#D4AF37] transition-colors py-2 border-b-2 border-transparent hover:border-[#D4AF37]">
              Trip Styles
            </a>
            <a href="#why-kalawewa" className="hover:text-[#D4AF37] transition-colors py-2 border-b-2 border-transparent hover:border-[#D4AF37]">
              Why Kalawewa
            </a>
            <a href="#testimonials" className="hover:text-[#D4AF37] transition-colors py-2 border-b-2 border-transparent hover:border-[#D4AF37]">
              Guest Reviews
            </a>
            <a href="#safety" className="hover:text-[#D4AF37] transition-colors py-2 border-b-2 border-transparent hover:border-[#D4AF37]">
              Safety Charter
            </a>
          </nav>

          {/* Primary CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="#featured-trips"
              className="px-7 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-amber-300 to-[#D4AF37] text-[#071410] text-xs font-bold uppercase tracking-widest shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-[#D4AF37]/50"
            >
              BOOK AN EXPEDITION
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-full bg-[#071410] border border-[#D4AF37]/40 text-emerald-100 hover:text-[#D4AF37] transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#071410]/95 backdrop-blur-2xl border-b border-[#D4AF37]/30 px-6 py-6 space-y-4">
            <nav className="flex flex-col space-y-3 text-sm font-semibold uppercase tracking-wider text-slate-200">
              <a
                href="#featured-trips"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#D4AF37] py-2 border-b border-[#D4AF37]/15"
              >
                Destinations & Trips
              </a>
              <a
                href="#trip-styles"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#D4AF37] py-2 border-b border-[#D4AF37]/15"
              >
                Trip Styles
              </a>
              <a
                href="#why-kalawewa"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#D4AF37] py-2 border-b border-[#D4AF37]/15"
              >
                Why Kalawewa
              </a>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#D4AF37] py-2 border-b border-[#D4AF37]/15"
              >
                Guest Reviews
              </a>
              <a
                href="#safety"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#D4AF37] py-2 border-b border-[#D4AF37]/15"
              >
                Safety & Guidelines
              </a>
            </nav>
            <div className="pt-3">
              <a
                href="#featured-trips"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-block text-center py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-amber-300 to-[#D4AF37] text-[#071410] text-xs font-bold uppercase tracking-widest shadow-lg border border-[#D4AF37]/50"
              >
                BOOK AN EXPEDITION
              </a>
            </div>
          </div>
        )}
      </header>

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
            <h3 className="text-2xl font-bold text-white mb-4 font-serif">Request Trip Details & Itinerary</h3>
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
