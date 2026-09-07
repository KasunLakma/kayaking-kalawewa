'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  getAllBookingsFromFirestore,
  updateBookingStatusInFirestore,
  getBlockedSlotsFromFirestore,
  blockSlotInFirestore,
  unblockSlotInFirestore,
  getFleetVehiclesFromFirestore,
  getAllInquiriesFromFirestore,
  BookingDocument,
  BlockedSlot,
  FleetVehicle,
  CustomerInquiry,
} from '@/lib/firebase';
import {
  ClipboardList,
  Search,
  RefreshCw,
  Lock,
  Zap,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  User,
  Phone,
  Mail,
  DollarSign,
  Filter,
  X,
  ChevronRight,
  Anchor,
  AlertTriangle,
  MessageSquare,
  ShieldCheck,
  Eye,
} from 'lucide-react';

const TIME_SLOTS = [
  'Morning / Sunrise (06:00 AM)',
  'Late Morning (09:00 AM)',
  'Afternoon / Wildlife (03:30 PM)',
  'Sunset Romance (05:00 PM)',
  'ALL_SLOTS (Full Day Emergency Override)',
];

function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function formatLKR(amount: number): string {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function getStatusBadge(orderStatus: string, paymentStatus?: string) {
  if (orderStatus === 'CONFIRMED' || orderStatus === 'COMPLETED') {
    return (
      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 text-xs rounded-full inline-flex items-center gap-1.5 font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        {orderStatus}
      </span>
    );
  }
  if (orderStatus === 'PENDING') {
    return (
      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 text-xs rounded-full inline-flex items-center gap-1.5 font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        {paymentStatus === 'PAID' ? 'PAID / PENDING' : 'PENDING'}
      </span>
    );
  }
  return (
    <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 text-xs rounded-full inline-flex items-center gap-1.5 font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
      {orderStatus}
    </span>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<string>('');

  const [bookings, setBookings] = useState<BookingDocument[]>([]);
  const [fleet, setFleet] = useState<FleetVehicle[]>([]);
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Selected Booking Drawer State
  const [selectedBooking, setSelectedBooking] = useState<BookingDocument | null>(null);

  // Weather Override Modal State
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState<boolean>(false);
  const [overrideDate, setOverrideDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [overrideSlot, setOverrideSlot] = useState<string>(TIME_SLOTS[0]);
  const [overrideReason, setOverrideReason] = useState<string>(
    'High Water Spillway Discharge Advisory'
  );

  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
      fetchDashboardData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '2026' || passcode === '1234' || passcode === 'admin123') {
      sessionStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
      setPasscodeError('');
      fetchDashboardData();
    } else {
      setPasscodeError('Invalid Security Passcode. Access Denied.');
    }
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [bookingsData, fleetData, inquiriesData, blockedData] = await Promise.all([
        getAllBookingsFromFirestore(),
        getFleetVehiclesFromFirestore(),
        getAllInquiriesFromFirestore(),
        getBlockedSlotsFromFirestore(),
      ]);
      setBookings(bookingsData);
      setFleet(fleetData);
      setInquiries(inquiriesData);
      setBlockedSlots(blockedData);

      if (selectedBooking) {
        const refreshed = bookingsData.find(
          (b) => b.bookingId === selectedBooking.bookingId || b.docId === selectedBooking.docId
        );
        if (refreshed) setSelectedBooking(refreshed);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        b.bookingId.toLowerCase().includes(term) ||
        b.customer.fullName.toLowerCase().includes(term) ||
        b.customer.email.toLowerCase().includes(term) ||
        b.customer.phone.toLowerCase().includes(term) ||
        b.packageName.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'CONFIRMED' && (b.orderStatus === 'CONFIRMED' || b.orderStatus === 'COMPLETED')) ||
        (statusFilter === 'PENDING' && b.orderStatus === 'PENDING') ||
        (statusFilter === 'CANCELLED' && b.orderStatus === 'CANCELLED');

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  // 4 Minimal Overview Metrics
  const metrics = useMemo(() => {
    const totalReservations = bookings.length;
    const activeFleetCount = fleet.filter(
      (v) => v.availabilityStatus === 'Available' || v.conditionStatus === 'Operational'
    ).length;
    const pendingInquiriesCount = inquiries.filter((i) => i.status === 'UNREAD').length;
    const todayStr = new Date().toISOString().split('T')[0];
    const dailyRevenue = bookings
      .filter((b) => b.selectedDate === todayStr && b.orderStatus !== 'CANCELLED')
      .reduce((sum, b) => sum + (b.totalAmountLKR || 0), 0);

    return { totalReservations, activeFleetCount, pendingInquiriesCount, dailyRevenue };
  }, [bookings, fleet, inquiries]);

  // Status Updates
  const handleUpdateStatus = async (
    docIdOrId: string,
    orderStatus: BookingDocument['orderStatus'],
    paymentStatus?: BookingDocument['paymentStatus']
  ) => {
    await updateBookingStatusInFirestore(docIdOrId, orderStatus, paymentStatus);
    await fetchDashboardData();
  };

  // Weather Slot Block / Unblock
  const handleBlockSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideDate || !overrideSlot || !overrideReason) return;
    await blockSlotInFirestore(overrideDate, overrideSlot, overrideReason);
    setIsWeatherModalOpen(false);
    await fetchDashboardData();
  };

  const handleUnblockSlot = async (slotId: string) => {
    await unblockSlotInFirestore(slotId);
    await fetchDashboardData();
  };

  // Passcode Security Check
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07130E] text-[#F4F1EA] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0B1914] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#C8A97E] mb-3">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-2xl font-normal text-[#F4F1EA]">Admin Security Check</h1>
            <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider">Kalawewa Operations Portal</p>
          </div>

          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                Operator PIN / Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter PIN (e.g., 2026)"
                className="w-full px-4 py-3 bg-[#07130E] border border-white/20 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-[#C8A97E] text-center text-lg tracking-widest"
                autoFocus
              />
            </div>

            {passcodeError && (
              <p className="text-xs text-red-400 text-center font-medium bg-red-950/40 py-2 border border-red-500/20 rounded-lg">
                {passcodeError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#C8A97E] hover:bg-[#d4af37] text-[#0B1914] font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg"
            >
              Unlock Access
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-stone-400 hover:text-white transition-colors">
              &larr; Return to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#F4F1EA]">Reservations &amp; Operations</h1>
          <p className="text-xs text-stone-400 mt-1">
            Real-time expedition manifests, slot capacity management &amp; emergency weather overrides
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsWeatherModalOpen(true)}
            className="px-4 py-2.5 bg-amber-600/15 border border-amber-500/40 hover:bg-amber-600/30 text-amber-300 font-semibold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Weather Override</span>
          </button>

          <button
            onClick={fetchDashboardData}
            className="p-2.5 border border-white/10 hover:border-[#C8A97E] text-stone-300 hover:text-white rounded-xl transition-all bg-white/[0.02] cursor-pointer"
            title="Refresh Data Feed"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4 Minimal Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reservations */}
        <div className="bg-[#0B1914] border border-white/10 rounded-2xl p-5 hover:border-[#d4af37]/30 transition-all shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">Total Reservations</span>
            <ClipboardList className="w-5 h-5 text-[#C8A97E]" />
          </div>
          <h3 className="text-2xl font-mono text-[#f3efe6] mt-2 font-bold">{metrics.totalReservations}</h3>
          <p className="text-xs text-stone-400 mt-1">Expedition Bookings Placed</p>
        </div>

        {/* Active Fleet */}
        <div className="bg-[#0B1914] border border-white/10 rounded-2xl p-5 hover:border-[#d4af37]/30 transition-all shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">Active Fleet</span>
            <Anchor className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-mono text-[#f3efe6] mt-2 font-bold">{metrics.activeFleetCount} / {fleet.length || 18}</h3>
          <p className="text-xs text-stone-400 mt-1">Kayaks Available for Dispatch</p>
        </div>

        {/* Pending Inquiries */}
        <div className="bg-[#0B1914] border border-white/10 rounded-2xl p-5 hover:border-[#d4af37]/30 transition-all shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">Pending Inquiries</span>
            <MessageSquare className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-2xl font-mono text-amber-400 mt-2 font-bold">{metrics.pendingInquiriesCount}</h3>
          <p className="text-xs text-stone-400 mt-1">Unread Guest Messages</p>
        </div>

        {/* Daily Revenue */}
        <div className="bg-[#0B1914] border border-white/10 rounded-2xl p-5 hover:border-[#d4af37]/30 transition-all shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">Daily Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-mono text-emerald-400 mt-2 font-bold">{formatLKR(metrics.dailyRevenue)}</h3>
          <p className="text-xs text-stone-400 mt-1">Scheduled Expeditions Today</p>
        </div>
      </div>

      {/* Active Weather Overrides Banner */}
      {blockedSlots.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Active Weather &amp; Spillway Overrides ({blockedSlots.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {blockedSlots.map((b) => (
              <div
                key={b.id || b.date + b.timeSlot}
                className="bg-[#0B1914] border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 text-stone-200"
              >
                <span>{b.date} • {b.timeSlot}: <em>{b.reason}</em></span>
                <button
                  onClick={() => b.id && handleUnblockSlot(b.id)}
                  className="text-amber-400 hover:text-white ml-1 font-bold"
                  title="Remove Override"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unified Search Bar & Status Filter */}
      <div className="bg-[#0B1914] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Booking REF, Guest Name, Email, or Package..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#07130E] border border-white/15 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C8A97E] transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-xs text-stone-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 bg-[#07130E] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8A97E] cursor-pointer"
          >
            <option value="ALL">All Reservations</option>
            <option value="CONFIRMED">Confirmed / Completed</option>
            <option value="PENDING">Pending Arrival</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Minimalist Data Table (No Noise) */}
      <div className="bg-[#0B1914] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-12 text-center text-stone-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#C8A97E]" />
            <p className="text-xs uppercase tracking-wider">Querying Reservation Manifests...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center text-stone-400 space-y-3">
            <ClipboardList className="w-12 h-12 mx-auto text-stone-600" />
            <h3 className="text-base font-semibold text-stone-300">No Reservations Found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              No booking record matches your search query or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-white/[0.02] text-[11px] font-medium tracking-widest text-stone-400 uppercase border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">Booking Ref</th>
                  <th className="px-6 py-4">Guest Identity</th>
                  <th className="px-6 py-4">Expedition Package</th>
                  <th className="px-6 py-4">Date &amp; Slot</th>
                  <th className="px-6 py-4">Amount (LKR)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBookings.map((b) => (
                  <tr
                    key={b.bookingId || b.docId}
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer group px-6 py-4"
                    onClick={() => setSelectedBooking(b)}
                  >
                    {/* Booking Reference */}
                    <td className="px-6 py-4 font-mono font-bold text-amber-300">
                      #{b.bookingId}
                    </td>

                    {/* Guest Identity */}
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-semibold text-white group-hover:text-[#C8A97E] transition-colors block">
                          {b.customer.fullName}
                        </span>
                        <span className="text-[11px] text-stone-400">{b.customer.phone || b.customer.email}</span>
                      </div>
                    </td>

                    {/* Package */}
                    <td className="px-6 py-4">
                      <div>
                        <span className="text-stone-200 font-medium block">{b.packageName}</span>
                        <span className="text-[10px] text-stone-400">{b.kayakType || 'Single Kayak'} • {b.guestCount} Guests</span>
                      </div>
                    </td>

                    {/* Date & Slot */}
                    <td className="px-6 py-4 text-stone-300">
                      <div>
                        <span className="font-mono text-stone-200 block">{formatDate(b.selectedDate)}</span>
                        <span className="text-[10px] text-stone-400">{b.timeSlot}</span>
                      </div>
                    </td>

                    {/* Total Amount LKR */}
                    <td className="px-6 py-4 font-mono font-bold text-emerald-400 text-sm">
                      {formatLKR(b.totalAmountLKR)}
                    </td>

                    {/* Status Pill Badge */}
                    <td className="px-6 py-4">
                      {getStatusBadge(b.orderStatus, b.paymentStatus)}
                    </td>

                    {/* Quick Actions */}
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="px-3 py-1.5 rounded-lg bg-[#C8A97E]/15 border border-[#C8A97E]/30 text-[#C8A97E] hover:bg-[#C8A97E] hover:text-[#0B1914] font-semibold text-xs transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================================================================
         SELECTED BOOKING INSPECTION & EDIT DRAWER / MODAL
         ========================================================================= */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#0B1914] border border-white/15 rounded-2xl shadow-2xl overflow-hidden space-y-0 text-xs">
            {/* Modal Header */}
            <div className="bg-[#07130E] px-6 py-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-amber-300 text-lg">#{selectedBooking.bookingId}</span>
                {getStatusBadge(selectedBooking.orderStatus, selectedBooking.paymentStatus)}
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg border border-white/10 hover:border-white/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Guest Card */}
              <div className="bg-[#13241E]/80 p-4 rounded-xl border border-white/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A97E]">Guest Contact Details</span>
                <p className="text-sm font-semibold text-white">{selectedBooking.customer.fullName}</p>
                <p className="text-stone-300">Email: {selectedBooking.customer.email}</p>
                <p className="text-stone-300">Phone: {selectedBooking.customer.phone}</p>
                {selectedBooking.customer.notes && (
                  <p className="text-stone-400 italic pt-1 border-t border-white/5">
                    &ldquo;{selectedBooking.customer.notes}&rdquo;
                  </p>
                )}
              </div>

              {/* Expedition Details */}
              <div className="bg-[#13241E]/80 p-4 rounded-xl border border-white/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A97E]">Expedition Details</span>
                <p className="text-sm font-semibold text-white">{selectedBooking.packageName}</p>
                <p className="text-stone-300">Date: {formatDate(selectedBooking.selectedDate)}</p>
                <p className="text-stone-300">Time Slot: {selectedBooking.timeSlot}</p>
                <p className="text-stone-300">Craft &amp; Guests: {selectedBooking.kayakType || 'Single Kayak'} • {selectedBooking.guestCount} Guests</p>
                <p className="text-stone-300">Payment: {selectedBooking.paymentMethod} ({selectedBooking.paymentStatus})</p>
                <p className="text-base font-bold font-mono text-emerald-400 pt-1">
                  Due Total: {formatLKR(selectedBooking.totalAmountLKR)}
                </p>
              </div>

              {/* Quick Status Update Controls */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Update Reservation Status</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedBooking.docId || selectedBooking.bookingId, 'CONFIRMED', 'PAID')
                    }
                    className="py-2.5 px-3 bg-emerald-950/80 border border-emerald-500/50 hover:bg-emerald-800 text-emerald-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                  >
                    Mark Paid &amp; Confirmed
                  </button>

                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedBooking.docId || selectedBooking.bookingId, 'COMPLETED', 'PAID')
                    }
                    className="py-2.5 px-3 bg-cyan-950/80 border border-cyan-500/50 hover:bg-cyan-800 text-cyan-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                  >
                    Mark Completed
                  </button>

                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedBooking.docId || selectedBooking.bookingId, 'CANCELLED', 'REFUNDED')
                    }
                    className="py-2.5 px-3 bg-rose-950/80 border border-rose-500/50 hover:bg-rose-800 text-rose-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#07130E] px-6 py-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         WEATHER / WATER EMERGENCY OVERRIDE MODAL
         ========================================================================= */}
      {isWeatherModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#0B1914] border border-white/15 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
                <h2 className="font-serif text-xl font-normal text-white">Emergency Weather Override</h2>
              </div>
              <button onClick={() => setIsWeatherModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBlockSlot} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Target Date</label>
                <input
                  type="date"
                  required
                  value={overrideDate}
                  onChange={(e) => setOverrideDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#07130E] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#C8A97E]"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Select Time Slot to Block</label>
                <select
                  value={overrideSlot}
                  onChange={(e) => setOverrideSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#07130E] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#C8A97E]"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Advisory Reason</label>
                <input
                  type="text"
                  required
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="e.g. High spillway discharge active"
                  className="w-full px-3.5 py-2.5 bg-[#07130E] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#C8A97E]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsWeatherModalOpen(false)}
                  className="px-4 py-2.5 bg-stone-800 text-stone-300 rounded-xl font-semibold uppercase tracking-wider text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl uppercase tracking-wider text-xs shadow-lg"
                >
                  Enforce Override Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
