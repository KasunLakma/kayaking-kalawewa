'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#0B1914] text-[#F4F1EA] border-t border-white/10 pt-20 pb-12 px-6 lg:px-12 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#C8A97E]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-20">
        
        {/* Newsletter Signup Gazette Banner */}
        <div className="bg-[#13241E] rounded-none p-8 sm:p-12 border border-[#C8A97E]/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3 text-center lg:text-left">
            <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#C8A97E] block">
              EXPEDITION GAZETTE
            </span>
            <h3 className="text-3xl sm:text-4xl font-normal text-[#F4F1EA] font-serif">
              Join Our Private Expedition List
            </h3>
            <p className="text-xs sm:text-sm text-[#F4F1EA]/80 font-light leading-relaxed">
              Receive seasonal wildlife reports, reservoir water level updates, and exclusive early-bird resort privileges for Kalawewa kayaking tours.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
            {subscribed ? (
              <div className="px-8 py-3.5 bg-[#0B1914] border border-[#C8A97E] text-xs font-medium text-[#C8A97E] text-center tracking-[0.15em] uppercase">
                ✓ Thank you for joining our expedition gazette
              </div>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="px-6 py-3.5 rounded-none bg-[#0B1914] border border-[#C8A97E]/30 text-[#F4F1EA] placeholder-slate-400 text-xs font-light focus:outline-none focus:border-[#C8A97E] min-w-[280px]"
                />
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-none bg-[#C8A97E] hover:bg-[#b5966c] text-[#0B1914] text-xs font-medium uppercase tracking-[0.2em] transition-all cursor-pointer whitespace-nowrap"
                >
                  JOIN GAZETTE
                </button>
              </>
            )}
          </form>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 text-xs">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col group">
              <span className="font-serif text-2xl font-light tracking-[0.25em] text-[#F4F1EA]">
                KALAWEWA
              </span>
              <span className="text-[9px] font-medium tracking-[0.3em] text-[#C8A97E] uppercase mt-1">
                ADVENTURES &amp; EXPEDITIONS
              </span>
            </div>

            <p className="text-[#F4F1EA]/75 font-light leading-relaxed max-w-sm pt-2">
              Sri Lanka&apos;s premier eco-friendly kayaking tour operator on Kalawewa Reservoir. Dedicated to sustainable wilderness adventure, historic 5th-century irrigation heritage, and safety excellence.
            </p>

            <div className="text-xs text-[#F4F1EA]/80 font-light space-y-2 pt-1">
              <p>📍 Kalawewa Lake, North Central Province, Sri Lanka (Coordinates: 8.0264° N, 80.5284° E)</p>
              
              {/* Unified Contact Action Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="tel:+94771234567"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#13241E] hover:bg-[#1a3028] border border-white/20 hover:border-[#d4af37] text-[#f3efe6] hover:text-[#d4af37] text-sm tracking-wider transition-colors rounded-lg shadow-sm"
                >
                  <span>📞 +94 77 123 4567</span>
                </a>
                <a
                  href="https://wa.me/94771234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#132b22]/90 hover:bg-[#132b22] border border-[#d4af37]/40 hover:border-[#d4af37] text-[#f3efe6] hover:text-[#d4af37] text-sm tracking-wider transition-colors rounded-lg shadow-sm"
                >
                  <span>💬 WhatsApp Concierge</span>
                </a>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4 text-slate-300">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/1CFim8B1AW/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C8A97E] transition-colors p-2.5 bg-[#13241E] border border-white/10"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://www.instagram.com/kayaking_kalawewa_adventures/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C8A97E] transition-colors p-2.5 bg-[#13241E] border border-white/10"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@kayakingkalawewaadventur?lang=en"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C8A97E] transition-colors p-2.5 bg-[#13241E] border border-white/10"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.58c.02 2.26-.64 4.54-2.03 6.34-1.39 1.8-3.43 3.03-5.69 3.44-2.26.41-4.63.02-6.64-1.1-2.01-1.12-3.48-2.98-4.14-5.2-1.33-4.48 1.41-9.2 5.92-10.21.68-.15 1.38-.2 2.08-.16v4.19c-.43-.05-.88.01-1.29.15-1.07.36-1.9 1.25-2.18 2.34-.28 1.09-.01 2.26.72 3.09.73.83 1.83 1.25 2.93 1.11 1.1-.14 2.06-.82 2.52-1.82.26-.57.37-1.2.35-1.83V.02z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-medium uppercase text-[#C8A97E] tracking-[0.2em] text-[11px]">
              Expedition Links
            </h4>
            <ul className="space-y-2.5 text-[#F4F1EA]/75 font-light">
              <li><Link href="/packages#sunrise-lotus-drift" className="hover:text-[#C8A97E] transition-colors">Sunrise Lotus Drift</Link></li>
              <li><Link href="/packages#sunset-romance-couples" className="hover:text-[#C8A97E] transition-colors">Sunset Romance &amp; Couples</Link></li>
              <li><Link href="/packages#5th-century-island-exploration" className="hover:text-[#C8A97E] transition-colors">5th Century Island Exploration</Link></li>
              <li><Link href="/packages#wild-elephant-corridor-trail" className="hover:text-[#C8A97E] transition-colors">Wild Elephant Corridor Trail</Link></li>
              <li><Link href="/packages" className="hover:text-[#C8A97E] font-medium transition-colors">All Packages &amp; Expeditions →</Link></li>
            </ul>
          </div>

          {/* Col 3: Why Kalawewa */}
          <div className="space-y-3">
            <h4 className="font-medium uppercase text-[#C8A97E] tracking-[0.2em] text-[11px]">
              Heritage &amp; Safety
            </h4>
            <ul className="space-y-2.5 text-[#F4F1EA]/75 font-light">
              <li><a href="#impact" className="hover:text-[#C8A97E] transition-colors">5th Century Reservoir</a></li>
              <li><a href="#impact" className="hover:text-[#C8A97E] transition-colors">Asian Elephant Sanctuary</a></li>
              <li><a href="#impact" className="hover:text-[#C8A97E] transition-colors">Zero-Plastic Standard</a></li>
              <li><a href="#custom-journeys" className="hover:text-[#C8A97E] transition-colors">Certified Safety Guides</a></li>
              <li><a href="#about" className="hover:text-[#C8A97E] transition-colors">Automated COD Booking</a></li>
            </ul>
          </div>

          {/* Col 4: Booking Policies */}
          <div className="space-y-3">
            <h4 className="font-medium uppercase text-[#C8A97E] tracking-[0.2em] text-[11px]">
              Resort Privileges
            </h4>
            <ul className="space-y-2.5 text-[#F4F1EA]/75 font-light">
              <li><span className="text-[#F4F1EA] font-medium">Cash On-Site (COD)</span> Accepted</li>
              <li><span className="text-[#C8A97E] font-medium">Instant Booking Confirmation</span></li>
              <li><span>Free Cancellation (24h prior)</span></li>
              <li><span>Group Booking Discounts</span></li>
              <li><span>Custom Private Charters</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-light">
          <p>© {new Date().getFullYear()} Kayaking Kalawewa Adventures &amp; Expeditions. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#C8A97E] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#C8A97E] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#C8A97E] transition-colors">Resort Safety Charter</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
