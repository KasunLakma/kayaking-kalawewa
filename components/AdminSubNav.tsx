'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, ClipboardList, RefreshCw, Lock, Home, Zap, Anchor } from 'lucide-react';

interface AdminSubNavProps {
  onRefresh?: () => void;
  onLogout?: () => void;
  onOpenWeatherOverride?: () => void;
}

export default function AdminSubNav({
  onRefresh,
  onLogout,
  onOpenWeatherOverride,
}: AdminSubNavProps) {
  const pathname = usePathname();

  const isReservationsActive = pathname === '/admin';
  const isStaffActive = pathname === '/admin/staff';
  const isFleetActive = pathname === '/admin/fleet' || pathname === '/admin/vehicles';

  return (
    <header className="sticky top-0 z-40 bg-[#0B1914]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & System Status */}
        <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
          <Link href="/" className="flex flex-col group">
            <span className="font-serif text-xl font-normal tracking-[0.25em] text-[#F4F1EA] group-hover:text-[#d4af37] transition-colors">
              KALAWEWA
            </span>
            <span className="text-[8px] font-semibold tracking-[0.3em] text-[#C8A97E] uppercase">
              OPERATIONS PORTAL
            </span>
          </Link>

          <span className="hidden sm:inline text-xs text-stone-600">•</span>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>All Systems Operational</span>
          </span>
        </div>

        {/* Navigation Tabs (Reservations, Staff Management, Fleet Inventory) */}
        <nav className="flex items-center gap-1 bg-[#13241E] p-1.5 rounded-xl border border-white/10 flex-wrap justify-center">
          <Link
            href="/admin"
            className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              isReservationsActive
                ? 'bg-[#C8A97E] text-[#0B1914] shadow-md font-bold'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Reservations</span>
          </Link>

          <Link
            href="/admin/staff"
            className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              isStaffActive
                ? 'bg-[#C8A97E] text-[#0B1914] shadow-md font-bold'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Staff Roster</span>
          </Link>

          <Link
            href="/admin/fleet"
            className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              isFleetActive
                ? 'bg-[#C8A97E] text-[#0B1914] shadow-md font-bold'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Anchor className="w-4 h-4" />
            <span>Fleet &amp; Kayak Inventory</span>
          </Link>
        </nav>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center md:justify-end">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-stone-300 hover:text-[#d4af37] text-xs font-semibold tracking-wider uppercase transition-colors px-3 py-2 rounded-lg border border-white/10 hover:border-[#d4af37]/40 bg-white/[0.02]"
            title="Return to Public Website"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Home</span>
          </Link>

          {onOpenWeatherOverride && (
            <button
              onClick={onOpenWeatherOverride}
              className="px-3.5 py-2 bg-amber-600/20 border border-amber-500/50 hover:bg-amber-600/40 text-amber-300 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer rounded-lg shadow-sm"
              title="Enforce Emergency Weather or Water Slot Override"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="hidden sm:inline">Weather Override</span>
            </button>
          )}

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 border border-white/20 hover:border-[#C8A97E] text-slate-300 hover:text-white transition-all text-xs rounded-lg cursor-pointer bg-white/[0.02]"
              title="Refresh Operations Data Feed"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="px-3 py-2 border border-white/20 hover:border-red-400 text-slate-300 hover:text-red-400 text-xs uppercase tracking-wider transition-colors cursor-pointer rounded-lg flex items-center gap-1.5 bg-white/[0.02]"
              title="Lock Admin Session"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
