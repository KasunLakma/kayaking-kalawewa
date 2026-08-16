'use client';

import React, { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  return (
    <>
      {/* Ultra-clean transparent/blur glass navigation pinned to top */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#0B1914]/80 backdrop-blur-md border-b border-white/5 px-6 sm:px-10 lg:px-16 py-4.5 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Monogram / Minimalist Serif Logo */}
          <a href="#" className="flex flex-col group">
            <span className="font-serif text-xl sm:text-2xl font-light tracking-[0.25em] text-[#F4F1EA] group-hover:text-[#C8A97E] transition-colors leading-none">
              KALAWEWA
            </span>
            <span className="text-[9px] font-medium tracking-[0.3em] text-[#C8A97E] uppercase mt-1">
              EXPEDITIONS &amp; WILDERNESS
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-200">
            <a href="#featured-trips" className="hover:text-[#C8A97E] transition-colors py-1">
              Expeditions
            </a>
            <a href="#why-kalawewa" className="hover:text-[#C8A97E] transition-colors py-1">
              Trip Styles
            </a>
            <a href="#safety" className="hover:text-[#C8A97E] transition-colors py-1">
              Safety &amp; Heritage
            </a>
            <a href="#testimonials" className="hover:text-[#C8A97E] transition-colors py-1">
              Reviews
            </a>
          </nav>

          {/* Right Action CTA */}
          <div className="hidden md:flex items-center gap-5">
            <button
              onClick={() => setInfoModalOpen(true)}
              className="text-[11px] font-medium text-slate-300 hover:text-[#C8A97E] uppercase tracking-[0.2em] transition-colors cursor-pointer"
              title="Request Private Catalog"
            >
              Catalog
            </button>
            <a
              href="#featured-trips"
              className="px-5 py-2.5 rounded-none border border-[#C8A97E]/50 hover:border-[#C8A97E] text-[#F4F1EA] hover:text-[#C8A97E] text-[11px] font-medium uppercase tracking-[0.2em] transition-all duration-300 bg-transparent hover:bg-[#C8A97E]/10"
            >
              PLAN YOUR JOURNEY
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#F4F1EA] hover:text-[#C8A97E] transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 pb-6 border-t border-white/10 bg-[#0B1914] px-4 space-y-4">
            <nav className="flex flex-col space-y-3 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-200">
              <a
                href="#featured-trips"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#C8A97E] py-2 border-b border-white/5"
              >
                Expeditions
              </a>
              <a
                href="#why-kalawewa"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#C8A97E] py-2 border-b border-white/5"
              >
                Trip Styles
              </a>
              <a
                href="#safety"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#C8A97E] py-2 border-b border-white/5"
              >
                Safety &amp; Heritage
              </a>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#C8A97E] py-2 border-b border-white/5"
              >
                Reviews
              </a>
            </nav>
            <div className="pt-2 flex flex-col gap-3">
              <a
                href="#featured-trips"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 border border-[#C8A97E] text-[#C8A97E] text-[11px] font-medium uppercase tracking-[0.2em]"
              >
                PLAN YOUR JOURNEY
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setInfoModalOpen(true);
                }}
                className="w-full text-center py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-300 hover:text-[#C8A97E]"
              >
                Request Catalog
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Quick Info Modal */}
      {infoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0B1914] border border-[#C8A97E]/40 p-6 sm:p-10 max-w-md w-full shadow-2xl relative text-[#F4F1EA]">
            <button
              onClick={() => setInfoModalOpen(false)}
              className="absolute top-4 right-4 text-[#C8A97E] hover:text-white transition-colors"
            >
              ✕
            </button>
            <div className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#C8A97E] mb-2">
              KALAWEWA LUXURY CATALOG
            </div>
            <h3 className="text-2xl font-normal text-[#F4F1EA] mb-4 font-serif">Request Trip Details &amp; Itinerary</h3>
            <p className="text-xs text-[#F4F1EA]/80 leading-relaxed mb-6 font-light">
              Have questions regarding seasonal elephant gatherings, water level forecasts, or private charter bookings? Speak directly with our lead naturalist in Kalawewa.
            </p>
            <div className="space-y-3 text-xs text-slate-200 mb-6">
              <div className="p-3.5 bg-[#13241E] border border-[#C8A97E]/20 flex items-center justify-between">
                <span>Phone / WhatsApp:</span>
                <span className="font-semibold text-[#C8A97E]">+94 77 123 4567</span>
              </div>
              <div className="p-3.5 bg-[#13241E] border border-[#C8A97E]/20 flex items-center justify-between">
                <span>Email Support:</span>
                <span className="font-semibold text-[#C8A97E]">expeditions@kalawewakayak.lk</span>
              </div>
            </div>
            <button
              onClick={() => setInfoModalOpen(false)}
              className="w-full py-3 bg-[#C8A97E] text-[#0B1914] font-medium text-xs uppercase tracking-[0.2em] hover:bg-[#b5966c] transition-colors"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </>
  );
}
