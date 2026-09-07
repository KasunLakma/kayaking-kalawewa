'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  getCustomerByIdFromFirestore,
  addCustomerContactLogToFirestore,
  updateCustomerVIPStatus,
  CustomerProfile,
  CustomerContactLog,
} from '@/lib/firebase';
import AdminSubNav from '@/components/AdminSubNav';
import {
  UserCheck,
  Mail,
  Phone,
  MessageSquare,
  Crown,
  Calendar,
  DollarSign,
  Plus,
  ShieldAlert,
  Utensils,
  ChevronLeft,
  Check,
  Sparkles,
  Award,
  Compass,
  RefreshCw,
} from 'lucide-react';

function getInitials(name: string): string {
  if (!name) return 'GS';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatLKR(amount: number): string {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

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

function formatTimeAgo(dateStr: string): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    if (isNaN(diffMs)) return dateStr;

    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;

    return formatDate(dateStr);
  } catch {
    return dateStr;
  }
}

function getTierBadge(tier: CustomerProfile['tier']) {
  switch (tier) {
    case 'VIP':
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-semibold">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          VIP Guest
        </span>
      );
    case 'Wilderness Elite':
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          Wilderness Elite
        </span>
      );
    case 'Corporate':
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-300 text-xs font-semibold">
          <Award className="w-3.5 h-3.5 text-purple-400" />
          Corporate
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-800/80 border border-stone-600/50 text-stone-300 text-xs font-medium">
          Regular
        </span>
      );
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CustomerDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const customerId = resolvedParams.id;

  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // New Contact Log Form State
  const [newLogCategory, setNewLogCategory] = useState<CustomerContactLog['category']>('Interaction');
  const [newLogNote, setNewLogNote] = useState<string>('');
  const [newLogAuthor, setNewLogAuthor] = useState<string>('Saman Kumara (Concierge)');
  const [isSubmittingLog, setIsSubmittingLog] = useState<boolean>(false);

  useEffect(() => {
    loadCustomer();
  }, [customerId]);

  const loadCustomer = async () => {
    setLoading(true);
    try {
      const data = await getCustomerByIdFromFirestore(customerId);
      setCustomer(data);
    } catch (err) {
      console.error("Failed to load customer profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVIP = async () => {
    if (!customer) return;
    const nextTier: CustomerProfile['tier'] = customer.tier === 'VIP' ? 'Regular' : 'VIP';
    await updateCustomerVIPStatus(customer.id, nextTier);
    await loadCustomer();
  };

  const handleAddLogNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !newLogNote.trim()) return;

    setIsSubmittingLog(true);
    try {
      await addCustomerContactLogToFirestore(customer.id, {
        author: newLogAuthor,
        category: newLogCategory,
        note: newLogNote.trim(),
      });
      setNewLogNote('');
      await loadCustomer();
    } catch (err) {
      console.error("Error adding contact log:", err);
    } finally {
      setIsSubmittingLog(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1914] text-[#F4F1EA] flex flex-col font-sans">
        <AdminSubNav />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#C8A97E] mx-auto" />
            <p className="text-xs uppercase tracking-wider text-stone-400">Loading Customer Profile...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-[#0B1914] text-[#F4F1EA] flex flex-col font-sans">
        <AdminSubNav />
        <main className="flex-1 max-w-4xl mx-auto p-8 text-center space-y-4 flex flex-col items-center justify-center">
          <UserCheck className="w-12 h-12 text-stone-600" />
          <h1 className="font-serif text-2xl text-white">Customer Record Not Found</h1>
          <p className="text-xs text-stone-400">
            No customer matching ID <code className="text-[#C8A97E]">{customerId}</code> exists in the operations database.
          </p>
          <Link
            href="/admin/customers"
            className="px-4 py-2 bg-[#C8A97E] text-[#0B1914] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#d4af37] transition-all"
          >
            Return to Customer Directory
          </Link>
        </main>
      </div>
    );
  }

  const initials = getInitials(customer.fullName);
  const whatsappNumber = customer.phone.replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen bg-[#0B1914] text-[#F4F1EA] flex flex-col font-sans">
      <AdminSubNav onRefresh={loadCustomer} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-stone-400">
          <Link href="/admin" className="hover:text-white transition-colors">
            Admin Portal
          </Link>
          <span>/</span>
          <Link href="/admin/customers" className="hover:text-white transition-colors">
            Customer Directory
          </Link>
          <span>/</span>
          <span className="text-[#C8A97E] font-medium">{customer.fullName}</span>
        </div>

        {/* Profile Banner */}
        <div className="bg-[#13241E]/90 border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg shadow-xl border ${
                customer.tier === 'VIP' || customer.tier === 'Wilderness Elite'
                  ? 'bg-amber-950 text-amber-300 border-amber-500/50 ring-4 ring-amber-500/20'
                  : 'bg-[#0B1914] text-[#C8A97E] border-white/20'
              }`}
            >
              {initials}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-serif text-3xl font-normal text-white">{customer.fullName}</h1>
                {getTierBadge(customer.tier)}
                <button
                  onClick={handleToggleVIP}
                  className="text-xs uppercase font-bold text-stone-400 hover:text-amber-300 underline cursor-pointer"
                >
                  {customer.tier === 'VIP' ? 'Set as Regular' : 'Set as VIP'}
                </button>
              </div>

              <p className="text-xs text-stone-400 flex items-center gap-3 flex-wrap">
                <span>Customer ID: <code className="text-stone-300">{customer.id}</code></span>
                <span>•</span>
                <span>Member since {formatDate(customer.memberSince)}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  `Hello ${customer.fullName}, greetings from Kalawewa Kayak Operations!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-emerald-950/80 border border-emerald-500/50 hover:bg-emerald-800 text-emerald-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            )}

            <a
              href={`mailto:${customer.email}?subject=${encodeURIComponent(
                'Kalawewa Kayaking Expedition Guest Concierge'
              )}`}
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Email Guest</span>
            </a>

            <Link
              href="/admin/customers"
              className="p-2.5 border border-white/10 hover:border-white/30 text-stone-400 hover:text-white rounded-xl transition-all"
              title="Back to Directory Table"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Metrics Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#13241E]/70 border border-white/10 rounded-xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Total Lifetime Value</span>
            <h3 className="text-2xl font-bold text-amber-400 font-mono mt-1">
              {formatLKR(customer.totalSpendLKR || 0)}
            </h3>
            <p className="text-[11px] text-stone-500 mt-1">LKR Expedition Bookings</p>
          </div>

          <div className="bg-[#13241E]/70 border border-white/10 rounded-xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Total Bookings</span>
            <h3 className="text-2xl font-bold text-white mt-1">{customer.totalBookings || 0}</h3>
            <p className="text-[11px] text-stone-500 mt-1">Reservations Placed</p>
          </div>

          <div className="bg-[#13241E]/70 border border-white/10 rounded-xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Completed Expeditions</span>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{customer.completedExpeditions || 0}</h3>
            <p className="text-[11px] text-emerald-500/80 mt-1 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> Water Tours Completed
            </p>
          </div>

          <div className="bg-[#13241E]/70 border border-white/10 rounded-xl p-5 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">WhatsApp Availability</span>
            <h3 className="text-2xl font-bold text-emerald-300 mt-1 flex items-center gap-2">
              <Check className="w-6 h-6 text-emerald-400" /> Active
            </h3>
            <p className="text-[11px] text-stone-500 mt-1">{customer.phone}</p>
          </div>
        </div>

        {/* Main Content Layout (Left Column: Profile Info, Right Column: History & Logs) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Guest Details & Preferences */}
          <div className="space-y-6">
            <div className="bg-[#13241E]/90 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#C8A97E] border-b border-white/10 pb-3 flex items-center gap-2">
                <UserCheck className="w-4 h-4" /> Guest Contact &amp; Details
              </h2>

              <div className="space-y-3 text-xs text-stone-300">
                <div>
                  <span className="text-stone-500 block">Full Name</span>
                  <span className="font-semibold text-white text-sm">{customer.fullName}</span>
                </div>

                <div>
                  <span className="text-stone-500 block">Email Address</span>
                  <span className="font-mono text-stone-200">{customer.email}</span>
                </div>

                <div>
                  <span className="text-stone-500 block">Phone Number</span>
                  <span className="font-mono text-stone-200">{customer.phone}</span>
                </div>

                {customer.emergencyContact && (
                  <div>
                    <span className="text-stone-500 block">Emergency Contact</span>
                    <span className="text-stone-200">{customer.emergencyContact}</span>
                  </div>
                )}

                <div>
                  <span className="text-stone-500 block">Registration Date</span>
                  <span className="text-stone-300">{formatDate(customer.memberSince)}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#13241E]/90 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-amber-300 border-b border-white/10 pb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" /> Dietary &amp; Safety Advisories
              </h2>

              <div className="space-y-3 text-xs text-stone-300">
                <div>
                  <span className="text-stone-500 block flex items-center gap-1 mb-1">
                    <Utensils className="w-3.5 h-3.5 text-stone-400" /> Dietary Preferences
                  </span>
                  {customer.dietaryPreferences ? (
                    <p className="p-3 bg-[#0B1914] border border-white/10 rounded-xl text-stone-200">
                      {customer.dietaryPreferences}
                    </p>
                  ) : (
                    <p className="text-stone-500 italic">No special dietary restrictions recorded.</p>
                  )}
                </div>

                <div>
                  <span className="text-stone-500 block flex items-center gap-1 mb-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Kayak Safety &amp; Experience Notes
                  </span>
                  {customer.safetyNotes ? (
                    <p className="p-3 bg-[#0B1914] border border-amber-500/20 rounded-xl text-amber-200">
                      {customer.safetyNotes}
                    </p>
                  ) : (
                    <p className="text-stone-500 italic">Standard kayak orientation protocol applies.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Timeline & Communication Logs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Booking History Timeline */}
            <div className="bg-[#13241E]/90 border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#C8A97E]" /> Chronological Booking History Timeline
                </h2>
                <span className="text-xs text-stone-400 font-mono">
                  {customer.bookings?.length || 0} Total Records
                </span>
              </div>

              {!customer.bookings || customer.bookings.length === 0 ? (
                <div className="p-6 bg-[#0B1914]/50 border border-white/5 rounded-xl text-center text-xs text-stone-500 italic">
                  No reservations recorded yet for this customer profile.
                </div>
              ) : (
                <div className="relative border-l-2 border-amber-500/30 ml-3 pl-6 space-y-6">
                  {customer.bookings.map((b) => (
                    <div key={b.bookingId} className="relative group">
                      <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-amber-400 border-2 border-[#13241E] shadow" />

                      <div className="bg-[#0B1914]/90 p-5 rounded-2xl border border-white/10 shadow-md space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-semibold text-white text-base group-hover:text-[#C8A97E] transition-colors">
                              {b.packageName}
                            </span>
                            <span className="ml-2 font-mono text-xs text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                              {b.bookingId}
                            </span>
                          </div>

                          <span className="font-mono font-bold text-emerald-400 text-sm">
                            {formatLKR(b.totalAmountLKR)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-stone-400 pt-2 border-t border-white/5">
                          <p><strong className="text-stone-300">Date:</strong> {b.selectedDate}</p>
                          <p><strong className="text-stone-300">Time Slot:</strong> {b.timeSlot}</p>
                          <p><strong className="text-stone-300">Craft:</strong> {b.kayakType || 'Single Kayak'}</p>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] pt-1">
                          <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 uppercase font-semibold">
                            Status: {b.orderStatus}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-600 uppercase font-semibold">
                            Payment: {b.paymentMethod} ({b.paymentStatus})
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Communication & Contact Logs */}
            <div className="bg-[#13241E]/90 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#C8A97E]" /> Staff Concierge Interaction Logs
                </h2>
                <span className="text-xs text-stone-400 font-mono">
                  {customer.contactLogs?.length || 0} Saved Notes
                </span>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddLogNote} className="bg-[#0B1914] p-4 rounded-xl border border-white/10 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                      Log Category
                    </label>
                    <select
                      value={newLogCategory}
                      onChange={(e) => setNewLogCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-[#13241E] border border-white/15 rounded-lg text-xs text-white focus:outline-none focus:border-[#C8A97E]"
                    >
                      <option value="Interaction">Guest Interaction</option>
                      <option value="Preference">Personal Preference</option>
                      <option value="Safety">Safety Advisory</option>
                      <option value="Special Request">Special Request</option>
                      <option value="General Note">General Note</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                      Staff Author Name
                    </label>
                    <input
                      type="text"
                      value={newLogAuthor}
                      onChange={(e) => setNewLogAuthor(e.target.value)}
                      className="w-full px-3 py-2 bg-[#13241E] border border-white/15 rounded-lg text-xs text-white focus:outline-none focus:border-[#C8A97E]"
                      placeholder="e.g. Saman (Front Desk)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                    Concierge Note Details
                  </label>
                  <textarea
                    rows={3}
                    value={newLogNote}
                    onChange={(e) => setNewLogNote(e.target.value)}
                    placeholder="Log guest preferences, water excursion feedback, special requests or safety debrief notes..."
                    className="w-full px-3 py-2 bg-[#13241E] border border-white/15 rounded-lg text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C8A97E]"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingLog || !newLogNote.trim()}
                    className="px-4 py-2 bg-[#C8A97E] hover:bg-[#d4af37] disabled:opacity-50 text-[#0B1914] font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isSubmittingLog ? 'Posting...' : 'Post Interaction Note'}</span>
                  </button>
                </div>
              </form>

              {/* Logs Timeline */}
              {!customer.contactLogs || customer.contactLogs.length === 0 ? (
                <div className="p-6 bg-[#0B1914]/50 border border-white/5 rounded-xl text-center text-xs text-stone-500 italic">
                  No interaction logs logged for this customer yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {customer.contactLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-[#0B1914]/80 p-4 rounded-xl border border-white/10 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          {log.category} — {log.author}
                        </span>
                        <span className="text-stone-500 text-[11px]">
                          {formatTimeAgo(log.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed pl-3 border-l-2 border-amber-500/30">
                        {log.note}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
