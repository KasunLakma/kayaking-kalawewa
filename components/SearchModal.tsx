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

  // Auto-focus input when search bar opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle ESC key press to dismiss search bar
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
    <>
      {/* 1. Subtle Dark Backdrop (No heavy modal wrapper) */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-fade-in cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Top-Aligned Sleek Compact Luxury Search Bar & Dropdown */}
      <div className="fixed inset-x-0 top-0 pt-20 sm:pt-24 px-4 z-50 flex flex-col items-center pointer-events-none">
        <div className="max-w-xl mx-auto w-full pointer-events-auto transition-all duration-300 animate-slide-down">
          
          {/* Sleek Compact Input Container (~48px height) */}
          <div className="bg-[#0B1914] border border-[#d4af37]/40 focus-within:border-[#d4af37] rounded-xl px-4 h-12 flex items-center shadow-2xl relative w-full backdrop-blur-md">
            {/* Left Search Icon */}
            <svg
              className="w-4 h-4 text-[#d4af37] shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            {/* Input Element */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search expeditions (e.g. Sunrise, Elephant, Lotus)..."
              className="w-full bg-transparent text-[#f3efe6] placeholder:text-stone-400 text-sm font-light focus:outline-none pl-3 pr-2 h-full"
            />

            {/* Clear query button if typed */}
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-stone-400 hover:text-white text-xs font-mono px-1 cursor-pointer"
                title="Clear Search"
              >
                CLEAR
              </button>
            )}

            {/* Clean ✕ Close Icon */}
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-[#d4af37] transition-colors cursor-pointer text-base p-1 ml-1 flex items-center justify-center rounded-full hover:bg-white/5"
              aria-label="Dismiss Search Bar"
              title="Dismiss Search"
            >
              ✕
            </button>
          </div>

          {/* 3. Floating Instant Compact Results Dropdown */}
          <div className="mt-2 w-full bg-[#0B1914]/95 border border-[#d4af37]/30 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md max-h-[60vh] overflow-y-auto">
            {/* Quick Suggestion Pills when empty */}
            {!trimmedQuery && (
              <div className="px-4 py-2.5 bg-[#132b22]/40 border-b border-white/5 flex items-center gap-2 overflow-x-auto text-[11px] text-stone-400">
                <span className="font-mono uppercase text-[#d4af37] text-[10px] shrink-0">Popular:</span>
                {['Sunrise', 'Elephant', 'Lotus Drift', 'Sunset Romance'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-0.5 rounded-full bg-white/5 hover:bg-[#d4af37]/20 text-stone-300 hover:text-[#d4af37] transition-colors shrink-0 text-[11px]"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* Results List */}
            {filteredPackages.length > 0 ? (
              <div className="divide-y divide-white/10">
                {filteredPackages.map((pkg) => {
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
                      className="group flex items-center justify-between px-4 py-3 hover:bg-[#132b22]/80 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        {/* Compact Thumbnail */}
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10 group-hover:border-[#d4af37]/50 transition-all">
                          <Image
                            src={pkg.imageUrl}
                            alt={pkg.title}
                            fill
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            sizes="40px"
                          />
                        </div>

                        {/* Title & Metadata */}
                        <div className="min-w-0">
                          <h4 className="font-serif text-sm text-[#f3efe6] group-hover:text-[#d4af37] transition-colors font-medium truncate">
                            {pkg.title}
                          </h4>
                          <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                            {pkg.category} • {pkg.duration}
                          </span>
                        </div>
                      </div>

                      {/* Price Badge */}
                      <div className="shrink-0 ml-3 text-right">
                        <span className="text-xs font-mono font-semibold text-[#d4af37] bg-[#d4af37]/10 px-2.5 py-1 rounded-md border border-[#d4af37]/20 block">
                          {pkg.price}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-stone-400 font-light">
                <p className="text-xs">No expeditions match &quot;{query}&quot;</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
