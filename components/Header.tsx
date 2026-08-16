'use client';

import React, { useState } from 'react';

export default function Header() {
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

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
          <a href="#" className="flex flex-col items-center group">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#C8A97E] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
              </svg>
              <span className="font-serif text-xl sm:text-2xl font-light tracking-[0.3em] text-[#F4F1EA] group-hover:text-[#C8A97E] transition-colors leading-none uppercase">
                KALAWEWA
              </span>
            </div>
            <span className="text-[9px] font-medium tracking-[0.35em] text-[#C8A97E] uppercase mt-1">
              EXPEDITIONS
            </span>
          </a>

          {/* Right: Minimal Search icon + solid luxury amber button */}
          <div className="flex items-center gap-4 sm:gap-5">
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

            <a
              href="#featured-trips"
              className="px-5 sm:px-6 py-2.5 bg-[#D97706] hover:bg-[#B45309] text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-md cursor-pointer rounded-none"
            >
              ENQUIRE NOW
            </a>
          </div>
        </div>
      </header>

      {/* Fullscreen Overlay Menu Drawer */}
      {menuDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B1914]/95 backdrop-blur-2xl flex flex-col justify-between p-8 sm:p-16 text-[#F4F1EA]">
          <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
            <div className="text-xs font-mono text-[#C8A97E] tracking-widest">
              8.0264° N, 80.5284° E • KALWEWA
            </div>
            <button
              onClick={() => setMenuDrawerOpen(false)}
              className="px-4 py-2 rounded-full border border-white/30 text-xs font-medium uppercase tracking-[0.2em] hover:border-[#C8A97E] text-[#C8A97E] transition-colors"
            >
              CLOSE ✕
            </button>
          </div>

          <div className="max-w-7xl mx-auto w-full my-auto py-12">
            <nav className="flex flex-col space-y-6 sm:space-y-8 text-center sm:text-left">
              <a
                href="#featured-trips"
                onClick={() => setMenuDrawerOpen(false)}
                className="font-serif text-4xl sm:text-6xl text-[#F4F1EA] hover:text-[#C8A97E] transition-colors tracking-wide"
              >
                01. Signature Expeditions
              </a>
              <a
                href="#why-kalawewa"
                onClick={() => setMenuDrawerOpen(false)}
                className="font-serif text-4xl sm:text-6xl text-[#F4F1EA] hover:text-[#C8A97E] transition-colors tracking-wide"
              >
                02. Heritage &amp; Wildlife
              </a>
              <a
                href="#safety"
                onClick={() => setMenuDrawerOpen(false)}
                className="font-serif text-4xl sm:text-6xl text-[#F4F1EA] hover:text-[#C8A97E] transition-colors tracking-wide"
              >
                03. Safety &amp; Eco Charter
              </a>
              <a
                href="#testimonials"
                onClick={() => setMenuDrawerOpen(false)}
                className="font-serif text-4xl sm:text-6xl text-[#F4F1EA] hover:text-[#C8A97E] transition-colors tracking-wide"
              >
                04. Guest Reviews
              </a>
            </nav>
          </div>

          <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-light border-t border-white/10 pt-6">
            <span>© Kayaking Kalawewa Luxury Eco-Resort &amp; Expeditions</span>
            <div className="flex items-center gap-6 mt-4 sm:mt-0">
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
    </>
  );
}
