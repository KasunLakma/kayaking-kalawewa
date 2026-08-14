'use client';

import React, { useState } from 'react';

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
    <footer className="w-full bg-[#081712] text-slate-300 border-t border-emerald-900/80 pt-16 pb-12 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        
        {/* Newsletter Signup Banner */}
        <div className="bg-[#0D231C] rounded-3xl p-8 sm:p-12 border border-[#D4AF37]/40 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-2 text-center lg:text-left">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#D4AF37] block">
              EXPEDITION NEWSLETTER
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
              Join Our Expedition Community
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 font-light leading-relaxed">
              Receive seasonal wildlife reports, reservoir water level updates, and exclusive early-bird discounts for Kalawewa kayaking tours.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
            {subscribed ? (
              <div className="px-6 py-3.5 bg-emerald-900/80 border border-[#D4AF37] rounded-xl text-xs font-bold text-[#D4AF37] text-center">
                ✓ Thank you for subscribing to our expedition list!
              </div>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="px-4 py-3.5 rounded-xl bg-[#081712] border border-emerald-800 text-white placeholder-emerald-400/50 text-xs font-medium focus:outline-none focus:border-[#D4AF37] min-w-[280px]"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#0D231C] text-xs font-black uppercase tracking-widest transition-all shadow cursor-pointer whitespace-nowrap"
                >
                  SUBSCRIBE
                </button>
              </>
            )}
          </form>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 text-xs">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-amber-600 flex items-center justify-center text-[#0D231C] font-bold">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2L2 19h20L12 2zm0 3.8L18.5 17H5.5L12 5.8zM11 9h2v4h-2V9zm0 6h2v2h-2v-2z" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-black tracking-widest text-white uppercase font-serif block leading-none">
                  KAYAKING KALAWEWA
                </span>
                <span className="text-[9px] font-bold text-[#D4AF37] tracking-widest uppercase">
                  ADVENTURES & EXPEDITIONS
                </span>
              </div>
            </div>

            <p className="text-emerald-100/70 font-light leading-relaxed max-w-sm">
              Sri Lanka&apos;s premier eco-friendly kayaking tour operator on Kalawewa Reservoir. Dedicated to sustainable wilderness adventure, historic 5th-century irrigation heritage, and safety excellence.
            </p>

            <div className="pt-2 flex items-center gap-4 text-emerald-300">
              {/* Facebook */}
              <a href="#" className="hover:text-[#D4AF37] transition-colors p-2 rounded-lg bg-[#0D231C] border border-emerald-800" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" className="hover:text-[#D4AF37] transition-colors p-2 rounded-lg bg-[#0D231C] border border-emerald-800" aria-label="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* TikTok */}
              <a href="#" className="hover:text-[#D4AF37] transition-colors p-2 rounded-lg bg-[#0D231C] border border-emerald-800" aria-label="TikTok">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.58c.02 2.26-.64 4.54-2.03 6.34-1.39 1.8-3.43 3.03-5.69 3.44-2.26.41-4.63.02-6.64-1.1-2.01-1.12-3.48-2.98-4.14-5.2-1.33-4.48 1.41-9.2 5.92-10.21.68-.15 1.38-.2 2.08-.16v4.19c-.43-.05-.88.01-1.29.15-1.07.36-1.9 1.25-2.18 2.34-.28 1.09-.01 2.26.72 3.09.73.83 1.83 1.25 2.93 1.11 1.1-.14 2.06-.82 2.52-1.82.26-.57.37-1.2.35-1.83V.02z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-extrabold uppercase text-[#D4AF37] tracking-wider text-[11px]">
              Expedition Links
            </h4>
            <ul className="space-y-2 text-emerald-100/80 font-light">
              <li><a href="#featured-trips" className="hover:text-[#D4AF37] transition-colors">Sunrise Paddle</a></li>
              <li><a href="#featured-trips" className="hover:text-[#D4AF37] transition-colors">Classic Island Tour</a></li>
              <li><a href="#featured-trips" className="hover:text-[#D4AF37] transition-colors">Sunset Romance</a></li>
              <li><a href="#featured-trips" className="hover:text-[#D4AF37] transition-colors">Full-Day Wilderness</a></li>
              <li><a href="#safety" className="hover:text-[#D4AF37] transition-colors">Eco Guidelines</a></li>
            </ul>
          </div>

          {/* Col 3: Why Kalawewa */}
          <div className="space-y-3">
            <h4 className="font-extrabold uppercase text-[#D4AF37] tracking-wider text-[11px]">
              Heritage & Safety
            </h4>
            <ul className="space-y-2 text-emerald-100/80 font-light">
              <li><a href="#why-kalawewa" className="hover:text-[#D4AF37] transition-colors">5th Century Reservoir</a></li>
              <li><a href="#why-kalawewa" className="hover:text-[#D4AF37] transition-colors">Asian Elephant Sanctuary</a></li>
              <li><a href="#why-kalawewa" className="hover:text-[#D4AF37] transition-colors">Zero-Plastic Standard</a></li>
              <li><a href="#why-kalawewa" className="hover:text-[#D4AF37] transition-colors">Rescue Ready Guides</a></li>
              <li><a href="#testimonials" className="hover:text-[#D4AF37] transition-colors">Adventurer Reviews</a></li>
            </ul>
          </div>

          {/* Col 4: Booking Policies */}
          <div className="space-y-3">
            <h4 className="font-extrabold uppercase text-[#D4AF37] tracking-wider text-[11px]">
              Booking & Payment
            </h4>
            <ul className="space-y-2 text-emerald-100/80 font-light">
              <li><span className="text-white font-medium">Cash On-Site (COD)</span> Accepted</li>
              <li><span className="text-[#D4AF37] font-semibold">Instant Confirmation</span></li>
              <li><span>Free Cancellation (24h prior)</span></li>
              <li><span>Group Booking Discounts</span></li>
              <li><span>Custom Private Charters</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-emerald-300/60 font-light">
          <p>© {new Date().getFullYear()} Kayaking Kalawewa Adventures & Expeditions. Inspired by Wilderness Travel standards.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Safety Standard Charter</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
