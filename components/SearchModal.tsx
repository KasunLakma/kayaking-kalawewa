'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { packages, Package } from '@/data/packages';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPackage?: (packageId: string) => void;
}

export default function SearchModal({ isOpen, onClose, onSelectPackage }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter packages based on query
  const trimmedQuery = query.trim().toLowerCase();
  const filteredPackages: Package[] = trimmedQuery
    ? packages.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(trimmedQuery) ||
          pkg.displayTitle.toLowerCase().includes(trimmedQuery) ||
          pkg.category.toLowerCase().includes(trimmedQuery) ||
          pkg.description.toLowerCase().includes(trimmedQuery) ||
          pkg.highlights.some((h) => h.toLowerCase().includes(trimmedQuery))
      )
    : packages;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md transition-all duration-300 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      {/* Modal Dialog Container */}
      <div
        className="bg-[#0B1914] border border-[#d4af37]/40 rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative text-[#f3efe6] flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-Right Sleek Close Icon Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#C8A97E] hover:text-white hover:border-[#d4af37] hover:bg-white/5 transition-all cursor-pointer"
          aria-label="Close Search Modal"
          title="Close Search Modal"
        >
          <span className="text-lg font-bold leading-none">✕</span>
        </button>

        {/* Header Title */}
        <div className="mb-5 pr-10">
          <span className="text-[10px] font-mono font-medium uppercase tracking-[0.3em] text-[#d4af37] block mb-1">
            EXPLORE SANCTUARY EXPEDITIONS
          </span>
          <h3 className="text-xl sm:text-2xl font-serif text-[#f3efe6] font-normal tracking-wide">
            Search Kalawewa Journeys
          </h3>
        </div>

        {/* High Contrast Input Container */}
        <div className="relative mb-6 shrink-0">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#d4af37]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by keyword (e.g. Sunrise, Elephant, Lotus, Island)..."
            className="w-full pl-12 pr-4 py-4 bg-[#0B1914]/90 border border-[#d4af37]/40 focus:border-[#d4af37] text-[#f3efe6] font-medium text-base sm:text-lg placeholder:text-stone-400 placeholder:font-light rounded-xl focus:outline-none focus:ring-1 focus:ring-[#d4af37]/50 transition-all shadow-inner"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs font-mono cursor-pointer"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Refined Luxury Results List */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-1 custom-scrollbar">
          <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-2 px-3">
            {trimmedQuery
              ? `Found ${filteredPackages.length} Expedition${filteredPackages.length === 1 ? '' : 's'}`
              : 'Featured Expeditions'}
          </div>

          {filteredPackages.length > 0 ? (
            filteredPackages.map((pkg) => {
              const handleSelect = () => {
                onClose();
                if (onSelectPackage) {
                  onSelectPackage(pkg.id);
                }
              };

              return (
                <Link
                  key={pkg.id}
                  href={`/packages#${pkg.id}`}
                  onClick={handleSelect}
                  className="group flex items-center justify-between p-3.5 rounded-xl hover:bg-[#132b22]/70 border-b border-white/10 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    {/* Thumbnail Image */}
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/10 group-hover:border-[#d4af37]/50 transition-all">
                      <Image
                        src={pkg.imageUrl}
                        alt={pkg.title}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        sizes="56px"
                      />
                    </div>

                    {/* Text Details */}
                    <div>
                      <span className="text-[10px] font-mono tracking-wider text-[#d4af37] uppercase block mb-0.5">
                        {pkg.category} • {pkg.duration}
                      </span>
                      <h4 className="font-serif text-base sm:text-lg text-[#f3efe6] font-medium group-hover:text-[#d4af37] transition-colors leading-tight">
                        {pkg.title}
                      </h4>
                      <p className="text-xs text-stone-300 font-light line-clamp-1 mt-0.5">
                        {pkg.description}
                      </p>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="text-right shrink-0 ml-4">
                    <span className="text-sm font-semibold font-mono text-[#d4af37] block">
                      {pkg.price}
                    </span>
                    <span className="text-[10px] text-stone-400 font-light block">
                      {pkg.unit}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#C8A97E] group-hover:translate-x-1 transition-transform mt-1">
                      View →
                    </span>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="text-center py-10 text-stone-400 font-light">
              <p className="text-sm">No expeditions found matching &quot;{query}&quot;</p>
              <p className="text-xs text-stone-500 mt-1">Try searching for &quot;Sunrise&quot;, &quot;Elephant&quot;, or &quot;Island&quot;</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
