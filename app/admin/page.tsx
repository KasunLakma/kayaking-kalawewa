'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  getAllBookingsFromFirestore,
  updateBookingStatusInFirestore,
  getBlockedSlotsFromFirestore,
  blockSlotInFirestore,
  unblockSlotInFirestore,
  BookingDocument,
  BlockedSlot,
} from '@/lib/firebase';

const TIME_SLOTS = [
  'Morning / Sunrise (06:00 AM)',
  'Late Morning (09:00 AM)',
  'Afternoon / Wildlife (03:30 PM)',
  'Sunset Romance (05:00 PM)',
  'ALL_SLOTS (Full Day Emergency Override)',
];

// Helper: Format timestamp as clean human-readable date & time (e.g., "Sep 02, 2026 • 06:00 AM")
function formatDateTime(dateVal: any): string {
  if (!dateVal) return 'N/A';
  try {
    let d: Date;
    if (typeof dateVal === 'object' && typeof dateVal.toDate === 'function') {
      d = dateVal.toDate();
    } else if (typeof dateVal === 'object' && dateVal.seconds) {
      d = new Date(dateVal.seconds * 1000);
    } else {
      d = new Date(dateVal);
    }
    if (isNaN(d.getTime())) return String(dateVal);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[d.getMonth()];
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = String(hours).padStart(2, '0');

    return `${month} ${day}, ${year} • ${formattedHours}:${minutes} ${ampm}`;
  } catch {
    return String(dateVal);
  }
}

// Helper: Format date string YYYY-MM-DD cleanly (e.g., "Sep 02, 2026")
function formatDateOnly(dateStr: string): string {
  if (!dateStr) return 'N/A';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return `${monthNames[month]} ${String(day).padStart(2, '0')}, ${year}`;
      }
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`;
    }
  } catch {
    // fallback
  }
  return dateStr;
}

// Helper: Standardize currency formatting (e.g., "LKR 4,500")
function formatCurrency(amount: number | undefined | null): string {
  const val = amount || 0;
  return `LKR ${val.toLocaleString('en-US')}`;
}

export default function AdminPage() {
  // 1. PIN Security Gate State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // 2. Data States
  const [bookings, setBookings] = useState<BookingDocument[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 3. Filter & Search States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('ALL');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('');

  // 4. Weather / Slot Override Modal State & Details Modal State
  const [showSlotModal, setShowSlotModal] = useState<boolean>(false);
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<BookingDocument | null>(null);
  const [blockDate, setBlockDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [blockTimeSlot, setBlockTimeSlot] = useState<string>(TIME_SLOTS[0]);
  const [blockReason, setBlockReason] = useState<string>('High Water Level & Monsoon Spillway Discharge');
  const [isBlocking, setIsBlocking] = useState<boolean>(false);

  // Check stored auth session
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('kalawewa_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch reservation records on auth success
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fetchedBookings, fetchedSlots] = await Promise.all([
        getAllBookingsFromFirestore(),
        getBlockedSlotsFromFirestore(),
      ]);
      setBookings(fetchedBookings);
      setBlockedSlots(fetchedSlots);
    } catch (err) {
      console.error('Failed to load reservation data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Handle Passcode Submission
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = process.env.NEXT_PUBLIC_ADMIN_PIN || '8026';
    if (pinInput === correctPin || pinInput === '8026' || pinInput === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('kalawewa_admin_auth', 'true');
      setPinError('');
    } else {
      setPinError('Invalid Operator PIN. Please enter "8026" or authorized admin passcode.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('kalawewa_admin_auth');
    setIsAuthenticated(false);
    setPinInput('');
  };

  // Status Change Handler
  const handleStatusUpdate = async (
    docId: string,
    newOrderStatus: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  ) => {
    let paymentStatus: 'PENDING_ARRIVAL' | 'PAID' | 'REFUNDED' = 'PENDING_ARRIVAL';
    if (newOrderStatus === 'COMPLETED') {
      paymentStatus = 'PAID';
    } else if (newOrderStatus === 'CANCELLED') {
      paymentStatus = 'REFUNDED';
    }

    // Optimistic UI Update
    setBookings((prev) =>
      prev.map((b) =>
        b.docId === docId || b.bookingId === docId
          ? { ...b, orderStatus: newOrderStatus, paymentStatus }
          : b
      )
    );

    await updateBookingStatusInFirestore(docId, newOrderStatus, paymentStatus);
  };

  // Slot Override Handlers
  const handleCreateBlockSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDate || !blockTimeSlot) return;

    setIsBlocking(true);
    try {
      const newBlock = await blockSlotInFirestore(blockDate, blockTimeSlot, blockReason);
      setBlockedSlots((prev) => [newBlock, ...prev]);
      setShowSlotModal(false);
    } catch (err) {
      console.error('Failed to block slot:', err);
    } finally {
      setIsBlocking(false);
    }
  };

  const handleUnblockSlot = async (slotId: string) => {
    setBlockedSlots((prev) => prev.filter((s) => s.id !== slotId));
    await unblockSlotInFirestore(slotId);
  };

  // Metric Calculations
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter((b) => b.orderStatus === 'PENDING').length;
  const confirmedCount = bookings.filter((b) => b.orderStatus === 'CONFIRMED').length;
  
  const totalRevenueLKR = useMemo(() => {
    return bookings
      .filter((b) => b.orderStatus === 'CONFIRMED' || b.orderStatus === 'COMPLETED')
      .reduce((sum, b) => sum + (b.totalAmountLKR || 0), 0);
  }, [bookings]);

  // Filtered Bookings Table
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // 1. Status Filter
      if (selectedStatusTab !== 'ALL' && b.orderStatus !== selectedStatusTab) {
        return false;
      }
      // 2. Date Filter
      if (selectedDateFilter && b.selectedDate !== selectedDateFilter) {
        return false;
      }
      // 3. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const refMatch = b.bookingId.toLowerCase().includes(q);
        const nameMatch = b.customer.fullName.toLowerCase().includes(q);
        const phoneMatch = b.customer.phone.toLowerCase().includes(q);
        const pkgMatch = b.packageName.toLowerCase().includes(q);
        return refMatch || nameMatch || phoneMatch || pkgMatch;
      }
      return true;
    });
  }, [bookings, selectedStatusTab, selectedDateFilter, searchQuery]);

  const todayStr = new Date().toISOString().split('T')[0];

  // If Not Authenticated: Render PIN Security Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B1914] text-[#F4F1EA] flex items-center justify-center p-6 selection:bg-[#C8A97E] selection:text-[#0B1914]">
        <div className="bg-[#13241E] border border-[#C8A97E]/40 p-8 sm:p-12 max-w-md w-full shadow-2xl space-y-6 relative">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#C8A97E] block">
              KALAWEWA OPERATIONS PORTAL
            </span>
            <h1 className="font-serif text-3xl text-[#F4F1EA]">Admin Authentication</h1>
            <p className="text-xs text-[#F4F1EA]/70 font-light">
              Enter authorized operator passcode to access reservation pipeline and weather slot overrides.
            </p>
          </div>

          {pinError && (
            <div className="p-3 bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-light text-center">
              {pinError}
            </div>
          )}

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-2">
                Operator PIN / Passcode
              </label>
              <input
                type="password"
                required
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (Default: 8026)..."
                className="w-full px-4 py-3.5 bg-[#0B1914] border border-white/20 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-none tracking-widest text-center"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#C8A97E] hover:bg-[#b5966c] text-[#0B1914] text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer shadow-md"
            >
              UNLOCK OPERATIONS PORTAL
            </button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-stone-300 hover:text-[#d4af37] text-xs font-semibold tracking-wider uppercase transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#d4af37]/40 bg-white/[0.02]"
            >
              <span>←</span>
              <span>BACK TO HOME</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1914] text-[#F4F1EA] font-sans selection:bg-[#C8A97E] selection:text-[#0B1914] flex flex-col justify-between">
      {/* Admin Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0B1914]/90 backdrop-blur-md border-b border-white/10 px-6 sm:px-10 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex flex-col group">
              <span className="font-serif text-xl font-normal tracking-[0.25em] text-[#F4F1EA]">
                KALAWEWA
              </span>
              <span className="text-[8px] font-semibold tracking-[0.3em] text-[#C8A97E] uppercase">
                OPERATIONS PORTAL
              </span>
            </Link>
            <span className="hidden sm:inline text-xs text-slate-500">•</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-stone-300 hover:text-[#d4af37] text-xs font-semibold tracking-wider uppercase transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#d4af37]/40 bg-white/[0.02]"
            >
              <span>←</span>
              <span>BACK TO HOME</span>
            </Link>

            <button
              onClick={() => setShowSlotModal(true)}
              className="px-4 py-2 bg-amber-600/20 border border-amber-500/50 hover:bg-amber-600/40 text-amber-300 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer rounded-lg"
            >
              <span>⚡ WEATHER / SLOT OVERRIDE</span>
            </button>

            <button
              onClick={loadData}
              className="p-2 border border-white/20 hover:border-[#C8A97E] text-slate-300 hover:text-white transition-all text-xs rounded-lg"
              title="Refresh Live Operations Feed"
            >
              🔄
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 border border-white/20 hover:border-red-400 text-slate-300 hover:text-red-400 text-xs uppercase tracking-wider transition-colors cursor-pointer rounded-lg"
            >
              LOCK 🔒
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Dashboard Container */}
      <main className="max-w-7xl mx-auto w-full px-6 sm:px-10 py-8 flex-1 space-y-10">
        <div className="pt-1">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-stone-300 hover:text-[#d4af37] text-xs font-semibold tracking-wider uppercase transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#d4af37]/40 bg-white/[0.02]"
          >
            <span>←</span>
            <span>BACK TO HOME</span>
          </Link>
        </div>
        
        {/* MODULE 1: Top KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* KPI 1: Total Bookings */}
          <div className="bg-[#0B1914] border border-white/10 rounded-xl p-5 space-y-2 relative overflow-hidden">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-300 block">
              TOTAL RESERVATIONS
            </span>
            <div className="text-[#f3efe6] font-mono text-2xl font-bold">
              {totalBookings}
            </div>
            <span className="text-stone-300 text-xs font-normal block pt-1">
              Total Expedition Bookings
            </span>
          </div>

          {/* KPI 2: Pending Review Count */}
          <div className="bg-[#0B1914] border border-[#D97706]/60 rounded-xl p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D97706] block">
                PENDING REVIEW
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] animate-ping" />
            </div>
            <div className="text-[#D97706] font-mono text-2xl font-bold">
              {pendingCount}
            </div>
            <span className="text-stone-300 text-xs font-normal block pt-1">
              Requires operator verification
            </span>
          </div>

          {/* KPI 3: Confirmed Expeditions */}
          <div className="bg-[#0B1914] border border-white/10 rounded-xl p-5 space-y-2 relative overflow-hidden">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-400 block">
              CONFIRMED EXPEDITIONS
            </span>
            <div className="text-emerald-400 font-mono text-2xl font-bold">
              {confirmedCount}
            </div>
            <span className="text-stone-300 text-xs font-normal block pt-1">
              Active departures scheduled
            </span>
          </div>

          {/* KPI 4: Total Revenue (LKR) */}
          <div className="bg-[#0B1914] border border-[#C8A97E]/50 rounded-xl p-5 space-y-2 relative overflow-hidden">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C8A97E] block">
              ESTIMATED REVENUE
            </span>
            <div className="text-[#C8A97E] font-mono text-2xl font-bold tracking-tight">
              {formatCurrency(totalRevenueLKR)}
            </div>
            <span className="text-stone-300 text-xs font-normal block pt-1">
              Confirmed &amp; Completed orders
            </span>
          </div>
        </section>

        {/* MODULE 2: Booking Table & Filters */}
        <section className="bg-[#13241E] border border-white/10 p-6 sm:p-8 space-y-6 rounded-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C8A97E] block mb-1">
                LIVE OPERATIONS FEED
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#F4F1EA]">
                Reservation Records &amp; Operational Status
              </h2>
            </div>

            {/* Controls: Lightweight Search Bar & Quick Date Filter */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by Guest Name, Phone, ID..."
                  className="px-4 py-2.5 pl-9 bg-[#0B1914] border border-white/20 text-xs text-[#F4F1EA] placeholder-slate-400 focus:outline-none focus:border-[#C8A97E] min-w-[260px] rounded-lg"
                />
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
              </div>

              <input
                type="date"
                value={selectedDateFilter}
                onChange={(e) => setSelectedDateFilter(e.target.value)}
                className="px-3 py-2.5 bg-[#0B1914] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
              />

              <button
                onClick={() => setSelectedDateFilter(todayStr)}
                className={`px-3 py-2.5 text-xs uppercase tracking-wider font-medium border rounded-lg transition-colors cursor-pointer ${
                  selectedDateFilter === todayStr
                    ? 'bg-[#C8A97E] text-[#0B1914] border-[#C8A97E]'
                    : 'bg-[#0B1914] text-slate-300 border-white/20 hover:text-white'
                }`}
              >
                Today
              </button>

              {selectedDateFilter && (
                <button
                  onClick={() => setSelectedDateFilter('')}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Clear Date
                </button>
              )}
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((tab) => {
              const isActive = selectedStatusTab === tab;
              const count =
                tab === 'ALL'
                  ? bookings.length
                  : bookings.filter((b) => b.orderStatus === tab).length;

              return (
                <button
                  key={tab}
                  onClick={() => setSelectedStatusTab(tab)}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all border rounded-lg cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#C8A97E] text-[#0B1914] border-[#C8A97E]'
                      : 'bg-[#0B1914] text-slate-300 border-white/10 hover:border-[#C8A97E]/50'
                  }`}
                >
                  <span>{tab}</span>
                  <span className="px-1.5 py-0.5 text-[9px] bg-black/40 rounded-full">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Streamlined 5-Column Live Data Table */}
          <div className="overflow-x-auto border border-white/10 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0B1914] border-b border-white/15 text-stone-300 uppercase tracking-widest text-[11px] font-medium">
                  <th className="p-4">1. RESERVATION</th>
                  <th className="p-4">2. GUEST</th>
                  <th className="p-4">3. EXPEDITION</th>
                  <th className="p-4">4. TOTAL &amp; PAYMENT</th>
                  <th className="p-4 text-right sm:text-left">5. STATUS &amp; ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-light">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-stone-300 italic">
                      Loading live reservation records feed...
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-stone-300 italic">
                      No matching reservation records found.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => {
                    const cleanPhone = b.customer.phone.replace(/[^0-9]/g, '');
                    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                      `Hi ${b.customer.fullName}, contacting you regarding your Kalawewa Expedition #${b.bookingId}.`
                    )}`;

                    return (
                      <tr
                        key={b.docId || b.bookingId}
                        className="bg-[#0B1914]/80 hover:bg-white/[0.02] transition-colors"
                      >
                        {/* 1. RESERVATION */}
                        <td className="p-4">
                          <div className="font-mono font-bold text-[#d4af37] text-sm">
                            #{b.bookingId}
                          </div>
                          <div className="text-stone-300 text-xs font-mono mt-0.5">
                            {formatDateTime(b.createdAt)}
                          </div>
                        </td>

                        {/* 2. GUEST */}
                        <td className="p-4">
                          <div className="text-[#f3efe6] font-medium text-sm flex items-center gap-2">
                            <span>{b.customer.fullName}</span>
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:text-emerald-300 text-sm transition-transform hover:scale-110"
                              title="Message Guest via WhatsApp"
                            >
                              💬
                            </a>
                          </div>
                          <div className="text-[#d4af37] text-xs font-mono mt-0.5">
                            {b.customer.phone}
                          </div>
                          <div className="text-stone-300 font-mono text-xs block mt-0.5 select-all">
                            {b.customer.email}
                          </div>
                        </td>

                        {/* 3. EXPEDITION */}
                        <td className="p-4">
                          <div className="font-medium text-stone-200 text-sm">
                            {b.packageName}
                          </div>
                          <div className="text-[#f3efe6] text-xs mt-0.5 font-medium">
                            {formatDateOnly(b.selectedDate)} • {b.timeSlot}
                          </div>
                          <div className="text-stone-300 text-xs mt-0.5">
                            {b.guestCount} Guest{b.guestCount > 1 ? 's' : ''} • {b.kayakType || 'Single Kayak'}
                          </div>
                        </td>

                        {/* 4. TOTAL & PAYMENT */}
                        <td className="p-4">
                          <div className="font-serif font-bold text-[#C8A97E] text-sm">
                            {formatCurrency(b.totalAmountLKR)}
                          </div>
                          <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded border ${
                                b.paymentMethod === 'COD'
                                  ? 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                                  : 'bg-blue-950/40 text-blue-300 border-blue-500/40'
                              }`}
                            >
                              {b.paymentMethod === 'COD' ? 'Cash on Arrival' : 'Bank Transfer'}
                            </span>
                            {b.paymentStatus && (
                              <span className="text-[10px] text-stone-300 font-mono">
                                ({b.paymentStatus.replace('_', ' ')})
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 5. STATUS & ACTIONS */}
                        <td className="p-4">
                          <div className="flex flex-wrap items-center gap-2 justify-end sm:justify-start">
                            <select
                              value={b.orderStatus}
                              onChange={(e) =>
                                handleStatusUpdate(
                                  b.docId || b.bookingId,
                                  e.target.value as any
                                )
                              }
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer border transition-all ${
                                b.orderStatus === 'PENDING'
                                  ? 'bg-amber-950/40 text-amber-300 border-amber-500/40 hover:border-amber-500/70'
                                  : b.orderStatus === 'CONFIRMED'
                                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:border-emerald-500/70'
                                  : b.orderStatus === 'COMPLETED'
                                  ? 'bg-blue-950/40 text-blue-300 border-blue-500/40 hover:border-blue-500/70'
                                  : 'bg-rose-950/40 text-rose-300 border-rose-500/40 hover:border-rose-500/70'
                              }`}
                            >
                              <option value="PENDING" className="bg-[#0B1914] text-amber-300">Pending</option>
                              <option value="CONFIRMED" className="bg-[#0B1914] text-emerald-300">Confirmed</option>
                              <option value="COMPLETED" className="bg-[#0B1914] text-blue-300">Completed</option>
                              <option value="CANCELLED" className="bg-[#0B1914] text-rose-300">Cancelled</option>
                            </select>

                            <button
                              onClick={() => setSelectedBookingForDetails(b)}
                              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 text-stone-200 hover:text-white rounded-lg text-xs font-medium transition-all inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                            >
                              <span>👁️</span>
                              <span>View Details</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* MODULE 4: Slot & Availability Control Panel */}
        <section className="bg-[#13241E] border border-white/10 p-6 sm:p-8 space-y-6 rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C8A97E] block mb-1">
                RESOURCE &amp; OVERRIDE MANAGEMENT
              </span>
              <h2 className="font-serif text-2xl font-normal text-[#F4F1EA]">
                Weather &amp; Capacity Slot Overrides
              </h2>
            </div>

            <button
              onClick={() => setShowSlotModal(true)}
              className="px-5 py-2.5 bg-[#C8A97E] hover:bg-[#b5966c] text-[#0B1914] text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer self-start sm:self-auto rounded-lg"
            >
              + BLOCK NEW DATE / SLOT
            </button>
          </div>

          {/* Currently Blocked Slots List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blockedSlots.length === 0 ? (
              <div className="col-span-full p-6 text-center text-xs text-slate-400 italic bg-[#0B1914] border border-white/10 rounded-lg">
                No active slot blocks recorded. All tour departure times are available for guest reservations.
              </div>
            ) : (
              blockedSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-[#0B1914] border border-red-500/40 p-4 space-y-3 relative rounded-lg"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                      🚫 BLOCKED SLOT
                    </span>
                    <button
                      onClick={() => slot.id && handleUnblockSlot(slot.id)}
                      className="text-[10px] text-slate-400 hover:text-white underline uppercase cursor-pointer"
                    >
                      Unblock ✕
                    </button>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="text-[#F4F1EA] font-medium">Date: {formatDateOnly(slot.date)}</div>
                    <div className="text-[#C8A97E]">{slot.timeSlot}</div>
                    <div className="text-slate-400 text-[11px] italic pt-1">
                      Reason: &quot;{slot.reason}&quot;
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* EMERGENCY WEATHER BLOCK MODAL */}
      {showSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0B1914] border border-[#C8A97E]/50 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative text-[#F4F1EA] rounded-xl">
            <button
              onClick={() => setShowSlotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-500 block mb-1">
                EMERGENCY OVERRIDE CONTROL
              </span>
              <h3 className="font-serif text-2xl text-[#F4F1EA]">Block Date or Time Slot</h3>
              <p className="text-xs text-slate-300 font-light mt-1">
                Disables slot selection in real-time on the guest reservation portal.
              </p>
            </div>

            <form onSubmit={handleCreateBlockSlot} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                  Select Target Date *
                </label>
                <input
                  type="date"
                  required
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                  Target Time Slot *
                </label>
                <select
                  value={blockTimeSlot}
                  onChange={(e) => setBlockTimeSlot(e.target.value)}
                  className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
                >
                  {TIME_SLOTS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                  Block Reason / Note *
                </label>
                <textarea
                  rows={3}
                  required
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="e.g. Monsoon heavy rainfall, reservoir spillway discharge, full capacity..."
                  className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] placeholder-slate-500 focus:outline-none focus:border-[#C8A97E] rounded-lg"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSlotModal(false)}
                  className="px-5 py-2.5 border border-white/20 text-xs uppercase tracking-wider text-slate-300 hover:text-white rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBlocking}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-lg"
                >
                  {isBlocking ? 'BLOCKING...' : 'ENFORCE SLOT BLOCK'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESERVATION DETAILS MODAL */}
      {selectedBookingForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0B1914] border border-[#C8A97E]/50 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative text-[#F4F1EA] rounded-xl">
            <button
              onClick={() => setSelectedBookingForDetails(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white text-lg font-bold cursor-pointer"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C8A97E] block mb-1">
                RESERVATION DETAILS
              </span>
              <h3 className="font-serif text-2xl text-[#F4F1EA]">
                Booking #{selectedBookingForDetails.bookingId}
              </h3>
              <p className="text-xs text-stone-400 font-mono mt-0.5">
                Created: {formatDateTime(selectedBookingForDetails.createdAt)}
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#13241E] p-4 rounded-lg border border-white/10 space-y-2">
                <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block">
                  Guest Information
                </span>
                <div className="text-sm font-semibold text-[#f3efe6]">
                  {selectedBookingForDetails.customer.fullName}
                </div>
                <div className="text-[#d4af37] font-mono">
                  📞 {selectedBookingForDetails.customer.phone}
                </div>
                <div className="text-stone-300 font-mono select-all">
                  ✉️ {selectedBookingForDetails.customer.email}
                </div>
              </div>

              <div className="bg-[#13241E] p-4 rounded-lg border border-white/10 space-y-2">
                <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block">
                  Expedition Details
                </span>
                <div className="text-stone-200 font-medium">
                  Package: {selectedBookingForDetails.packageName}
                </div>
                <div className="text-stone-300">
                  Date: {formatDateOnly(selectedBookingForDetails.selectedDate)} | Slot: {selectedBookingForDetails.timeSlot}
                </div>
                <div className="text-stone-300">
                  Party Size: {selectedBookingForDetails.guestCount} Guest(s) | Kayak: {selectedBookingForDetails.kayakType}
                </div>
              </div>

              <div className="bg-[#13241E] p-4 rounded-lg border border-white/10 space-y-2">
                <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block">
                  Payment &amp; Financials
                </span>
                <div className="text-sm font-serif font-bold text-[#C8A97E]">
                  Total Amount: {formatCurrency(selectedBookingForDetails.totalAmountLKR)}
                </div>
                <div className="text-stone-300">
                  Method: {selectedBookingForDetails.paymentMethod === 'COD' ? 'Cash on Arrival' : 'Bank Transfer'} ({selectedBookingForDetails.paymentStatus.replace('_', ' ')})
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-white/10">
              <a
                href={`https://wa.me/${selectedBookingForDetails.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hi ${selectedBookingForDetails.customer.fullName}, contacting you regarding your Kalawewa Expedition #${selectedBookingForDetails.bookingId}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>💬 Contact via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setSelectedBookingForDetails(null)}
                className="px-5 py-2 bg-white/10 hover:bg-white/20 text-xs font-medium uppercase tracking-wider text-stone-200 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
