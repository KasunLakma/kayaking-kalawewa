'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  getAllCustomersFromFirestore,
  saveCustomerProfileToFirestore,
  addCustomerContactLogToFirestore,
  updateCustomerVIPStatus,
  CustomerProfile,
  CustomerContactLog,
} from '@/lib/firebase';
import AdminSubNav from '@/components/AdminSubNav';
import {
  Users,
  UserCheck,
  Search,
  Mail,
  Phone,
  MessageSquare,
  Crown,
  Calendar,
  DollarSign,
  Plus,
  ShieldAlert,
  Utensils,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Lock,
  X,
  Check,
  Sparkles,
  Award,
  Compass,
  Filter,
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
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/70 border border-amber-500/50 text-amber-300 text-[11px] font-semibold">
          <Crown className="w-3 h-3 text-amber-400" />
          VIP Guest
        </span>
      );
    case 'Wilderness Elite':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-[11px] font-semibold">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          Wilderness Elite
        </span>
      );
    case 'Corporate':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-950/70 border border-purple-500/50 text-purple-300 text-[11px] font-semibold">
          <Award className="w-3 h-3 text-purple-400" />
          Corporate
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-800/80 border border-stone-600/50 text-stone-300 text-[11px] font-medium">
          Regular
        </span>
      );
  }
}

export default function CustomersPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<string>('');

  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [tierFilter, setTierFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'LTV_DESC' | 'BOOKINGS_DESC' | 'NEWEST' | 'NAME_ASC'>('LTV_DESC');

  // Selected customer for modal view
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);

  // New Contact Log modal state inside drawer
  const [newLogCategory, setNewLogCategory] = useState<CustomerContactLog['category']>('Interaction');
  const [newLogNote, setNewLogNote] = useState<string>('');
  const [newLogAuthor, setNewLogAuthor] = useState<string>('Saman Kumara (Concierge)');
  const [isSubmittingLog, setIsSubmittingLog] = useState<boolean>(false);

  // New Guest Registration Modal
  const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState<boolean>(false);
  const [newGuestName, setNewGuestName] = useState<string>('');
  const [newGuestEmail, setNewGuestEmail] = useState<string>('');
  const [newGuestPhone, setNewGuestPhone] = useState<string>('');
  const [newGuestTier, setNewGuestTier] = useState<CustomerProfile['tier']>('Regular');
  const [newGuestDiet, setNewGuestDiet] = useState<string>('');
  const [newGuestSafety, setNewGuestSafety] = useState<string>('');
  const [newGuestEmergency, setNewGuestEmergency] = useState<string>('');

  // Check auth session
  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
      fetchCustomers();
    } else {
      setLoading(false);
    }
  }, []);

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '2026' || passcode === '1234' || passcode === 'admin123') {
      sessionStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
      setPasscodeError('');
      fetchCustomers();
    } else {
      setPasscodeError('Invalid Security Passcode. Access Denied.');
    }
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await getAllCustomersFromFirestore();
      setCustomers(data);
      // Refresh selected customer reference if open
      if (selectedCustomer) {
        const refreshed = data.find((c) => c.id === selectedCustomer.id || c.email === selectedCustomer.email);
        if (refreshed) setSelectedCustomer(refreshed);
      }
    } catch (err) {
      console.error("Failed to load customer records:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter & Sort Customers
  const filteredCustomers = useMemo(() => {
    return customers
      .filter((c) => {
        const term = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !term ||
          c.fullName.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term) ||
          c.phone.toLowerCase().includes(term) ||
          c.id.toLowerCase().includes(term);

        const matchesTier = tierFilter === 'ALL' || c.tier === tierFilter;
        return matchesSearch && matchesTier;
      })
      .sort((a, b) => {
        if (sortBy === 'LTV_DESC') {
          return (b.totalSpendLKR || 0) - (a.totalSpendLKR || 0);
        }
        if (sortBy === 'BOOKINGS_DESC') {
          return (b.totalBookings || 0) - (a.totalBookings || 0);
        }
        if (sortBy === 'NEWEST') {
          return new Date(b.memberSince).getTime() - new Date(a.memberSince).getTime();
        }
        if (sortBy === 'NAME_ASC') {
          return a.fullName.localeCompare(b.fullName);
        }
        return 0;
      });
  }, [customers, searchTerm, tierFilter, sortBy]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalCount = customers.length;
    const vipCount = customers.filter((c) => c.tier === 'VIP' || c.tier === 'Wilderness Elite').length;
    const totalLTV = customers.reduce((sum, c) => sum + (c.totalSpendLKR || 0), 0);
    const totalExpeditions = customers.reduce((sum, c) => sum + (c.completedExpeditions || 0), 0);
    return { totalCount, vipCount, totalLTV, totalExpeditions };
  }, [customers]);

  // Add Concierge Note
  const handleAddLogNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !newLogNote.trim()) return;

    setIsSubmittingLog(true);
    try {
      await addCustomerContactLogToFirestore(selectedCustomer.id, {
        author: newLogAuthor,
        category: newLogCategory,
        note: newLogNote.trim(),
      });
      setNewLogNote('');
      await fetchCustomers();
    } catch (err) {
      console.error("Error saving log note:", err);
    } finally {
      setIsSubmittingLog(false);
    }
  };

  // Toggle VIP tier status
  const handleToggleVIP = async (customer: CustomerProfile) => {
    const nextTier: CustomerProfile['tier'] = customer.tier === 'VIP' ? 'Regular' : 'VIP';
    await updateCustomerVIPStatus(customer.id, nextTier);
    await fetchCustomers();
  };

  // Register New Guest
  const handleAddGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim() || !newGuestEmail.trim()) return;

    const newGuest: CustomerProfile = {
      id: 'cust-' + Date.now().toString().slice(-6),
      uid: 'user-' + Date.now(),
      fullName: newGuestName.trim(),
      email: newGuestEmail.trim(),
      phone: newGuestPhone.trim() || '+94700000000',
      hasWhatsapp: true,
      memberSince: new Date().toISOString().split('T')[0],
      tier: newGuestTier,
      dietaryPreferences: newGuestDiet.trim() || undefined,
      safetyNotes: newGuestSafety.trim() || undefined,
      emergencyContact: newGuestEmergency.trim() || undefined,
      contactLogs: [
        {
          id: 'log-init-' + Date.now(),
          createdAt: new Date().toISOString(),
          author: 'Operations Staff',
          category: 'General Note',
          note: 'Guest profile created manually via Admin Operations Portal.',
        },
      ],
      totalBookings: 0,
      completedExpeditions: 0,
      totalSpendLKR: 0,
    };

    await saveCustomerProfileToFirestore(newGuest);
    setIsAddGuestModalOpen(false);
    // Reset form
    setNewGuestName('');
    setNewGuestEmail('');
    setNewGuestPhone('');
    setNewGuestDiet('');
    setNewGuestSafety('');
    setNewGuestEmergency('');
    await fetchCustomers();
  };

  // Lock passcode view if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B1914] text-[#F4F1EA] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#13241E] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#C8A97E] mb-3">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-2xl font-normal text-[#F4F1EA]">Admin Security Check</h1>
            <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider">Customer Directory Access</p>
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
                className="w-full px-4 py-3 bg-[#0B1914] border border-white/20 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-[#C8A97E] text-center text-lg tracking-widest"
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
      {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[#C8A97E]">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-serif text-3xl font-normal text-[#F4F1EA] tracking-wide">
                  Guest &amp; Customer Management
                </h1>
                <p className="text-xs text-stone-400 mt-0.5">
                  Unified Directory, Expedition History &amp; Concierge Interaction Logs
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddGuestModalOpen(true)}
              className="px-4 py-2.5 bg-[#C8A97E] hover:bg-[#d4af37] text-[#0B1914] font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Guest</span>
            </button>

            <button
              onClick={fetchCustomers}
              className="p-2.5 border border-white/20 hover:border-[#C8A97E] text-stone-300 hover:text-white rounded-xl transition-all bg-white/[0.02] cursor-pointer"
              title="Refresh Customer Directory"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#13241E]/80 border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Total Registered</p>
              <h3 className="text-2xl font-bold text-white mt-1">{metrics.totalCount}</h3>
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <Users className="w-3 h-3" /> Active Guest Database
              </p>
            </div>
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-emerald-400">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-[#13241E]/80 border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">VIP &amp; Elite Guests</p>
              <h3 className="text-2xl font-bold text-[#C8A97E] mt-1">{metrics.vipCount}</h3>
              <p className="text-[11px] text-amber-300 mt-1 flex items-center gap-1">
                <Crown className="w-3 h-3" /> Premium Tier Members
              </p>
            </div>
            <div className="p-3 bg-amber-950/60 border border-amber-500/30 rounded-xl text-amber-400">
              <Crown className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-[#13241E]/80 border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Lifetime Revenue (LTV)</p>
              <h3 className="text-2xl font-bold text-emerald-300 mt-1">{formatLKR(metrics.totalLTV)}</h3>
              <p className="text-[11px] text-stone-400 mt-1">Aggregated Expedition Spend</p>
            </div>
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-[#13241E]/80 border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Completed Expeditions</p>
              <h3 className="text-2xl font-bold text-white mt-1">{metrics.totalExpeditions}</h3>
              <p className="text-[11px] text-cyan-400 mt-1 flex items-center gap-1">
                <Compass className="w-3 h-3" /> Kalawewa Water Tours
              </p>
            </div>
            <div className="p-3 bg-cyan-950/60 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Compass className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Directory Controls: Search, Filter, Sort */}
        <div className="bg-[#13241E]/90 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Name, Email, Phone, or ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#0B1914] border border-white/15 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C8A97E] transition-all"
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

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-xs text-stone-400">Tier:</span>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="px-3 py-2 bg-[#0B1914] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8A97E] cursor-pointer"
              >
                <option value="ALL">All Tiers</option>
                <option value="VIP">VIP Guests</option>
                <option value="Wilderness Elite">Wilderness Elite</option>
                <option value="Corporate">Corporate</option>
                <option value="Regular">Regular</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-[#0B1914] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8A97E] cursor-pointer"
              >
                <option value="LTV_DESC">Highest Spend (LTV)</option>
                <option value="BOOKINGS_DESC">Most Expeditions</option>
                <option value="NEWEST">Newest Member</option>
                <option value="NAME_ASC">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Directory Table */}
        <div className="bg-[#13241E]/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-stone-400 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-[#C8A97E]" />
              <p className="text-xs uppercase tracking-wider">Querying Guest Records &amp; Booking Histories...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-12 text-center text-stone-400 space-y-3">
              <UserCheck className="w-12 h-12 mx-auto text-stone-600" />
              <h3 className="text-base font-semibold text-stone-300">No Customers Found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                No guest matches your search query or tier filters. Try adjusting your filters or register a new guest.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-[#0B1914]/80 uppercase text-[10px] tracking-wider text-stone-400 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Customer Identity</th>
                    <th className="px-6 py-4 font-semibold">Contact &amp; Channels</th>
                    <th className="px-6 py-4 font-semibold">Expedition Count</th>
                    <th className="px-6 py-4 font-semibold">Lifetime Value (LKR)</th>
                    <th className="px-6 py-4 font-semibold">Member Since</th>
                    <th className="px-6 py-4 font-semibold text-right">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCustomers.map((cust) => {
                    const initials = getInitials(cust.fullName);
                    const whatsappNumber = cust.phone.replace(/[^0-9]/g, '');
                    const isVip = cust.tier === 'VIP' || cust.tier === 'Wilderness Elite';

                    return (
                      <tr
                        key={cust.id}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        {/* Customer Identity */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md border ${
                                isVip
                                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/50 ring-2 ring-amber-500/20'
                                  : 'bg-[#0B1914] text-[#C8A97E] border-white/20'
                              }`}
                            >
                              {initials}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white text-sm group-hover:text-[#C8A97E] transition-colors">
                                  {cust.fullName}
                                </span>
                                {getTierBadge(cust.tier)}
                              </div>
                              <span className="text-[10px] text-stone-500 font-mono">
                                ID: {cust.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Contact Info */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-stone-300">
                              <Mail className="w-3.5 h-3.5 text-stone-500" />
                              <a
                                href={`mailto:${cust.email}`}
                                className="hover:text-amber-300 transition-colors"
                              >
                                {cust.email}
                              </a>
                            </div>
                            <div className="flex items-center gap-1.5 text-stone-400">
                              <Phone className="w-3.5 h-3.5 text-stone-500" />
                              <span>{cust.phone}</span>
                            </div>
                          </div>
                        </td>

                        {/* Expedition Count */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-semibold text-xs">
                              {cust.completedExpeditions || 0} / {cust.totalBookings || 0} Expeditions
                            </span>
                          </div>
                        </td>

                        {/* Lifetime Spend LKR */}
                        <td className="px-6 py-4 font-mono font-bold text-amber-400 text-sm">
                          {formatLKR(cust.totalSpendLKR || 0)}
                        </td>

                        {/* Member Since */}
                        <td className="px-6 py-4 text-stone-400">
                          {formatDate(cust.memberSince)}
                        </td>

                        {/* Quick Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* WhatsApp Button */}
                            {whatsappNumber && (
                              <a
                                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                                  `Hello ${cust.fullName}, greetings from Kalawewa Kayak Operations!`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-800/80 transition-all cursor-pointer"
                                title="Contact via WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                            )}

                            {/* Email Action */}
                            <a
                              href={`mailto:${cust.email}?subject=${encodeURIComponent(
                                'Kalawewa Kayaking Expedition Guest Concierge'
                              )}`}
                              className="p-2 rounded-lg bg-stone-800/80 border border-stone-600/50 text-stone-300 hover:text-white hover:bg-stone-700 transition-all cursor-pointer"
                              title="Send Email"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>

                            {/* View Full Profile Modal Button */}
                            <button
                              onClick={() => setSelectedCustomer(cust)}
                              className="px-3 py-1.5 rounded-lg bg-[#C8A97E]/20 border border-[#C8A97E]/40 text-[#C8A97E] hover:bg-[#C8A97E] hover:text-[#0B1914] font-semibold text-xs transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <span>View Profile</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>

                            {/* Deep Link to Subpage */}
                            <Link
                              href={`/admin/customers/${cust.id}`}
                              className="p-2 rounded-lg border border-white/10 text-stone-400 hover:text-white hover:border-white/30 transition-all"
                              title="Open Dedicated Subpage View"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      {/* =========================================================================
         DETAILED CUSTOMER PROFILE & HISTORY MODAL
         ========================================================================= */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-[#13241E] border border-white/15 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#0B1914] px-6 py-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border ${
                    selectedCustomer.tier === 'VIP' || selectedCustomer.tier === 'Wilderness Elite'
                      ? 'bg-amber-950 text-amber-300 border-amber-500/50 ring-2 ring-amber-500/30'
                      : 'bg-[#13241E] text-[#C8A97E] border-white/20'
                  }`}
                >
                  {getInitials(selectedCustomer.fullName)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-serif text-2xl font-normal text-white">
                      {selectedCustomer.fullName}
                    </h2>
                    {getTierBadge(selectedCustomer.tier)}
                    <button
                      onClick={() => handleToggleVIP(selectedCustomer)}
                      className="text-[10px] uppercase font-bold text-stone-400 hover:text-amber-300 underline cursor-pointer"
                    >
                      {selectedCustomer.tier === 'VIP' ? 'Set as Regular' : 'Set as VIP'}
                    </button>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-2">
                    <span>ID: {selectedCustomer.id}</span>
                    <span>•</span>
                    <span>Member since {formatDate(selectedCustomer.memberSince)}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 text-stone-400 hover:text-white rounded-xl border border-white/10 hover:border-white/30 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Scrollable Container */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0B1914]/80 p-4 rounded-xl border border-white/10">
                <div>
                  <span className="text-[10px] uppercase text-stone-400 font-semibold">Total Spend (LTV)</span>
                  <p className="text-base font-bold text-amber-400 font-mono mt-0.5">
                    {formatLKR(selectedCustomer.totalSpendLKR || 0)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-stone-400 font-semibold">Total Bookings</span>
                  <p className="text-base font-bold text-white mt-0.5">{selectedCustomer.totalBookings || 0}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-stone-400 font-semibold">Completed Expeditions</span>
                  <p className="text-base font-bold text-emerald-400 mt-0.5">
                    {selectedCustomer.completedExpeditions || 0}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-stone-400 font-semibold">WhatsApp Available</span>
                  <p className="text-base font-bold text-emerald-300 mt-0.5 flex items-center gap-1">
                    <Check className="w-4 h-4 text-emerald-400" /> Yes
                  </p>
                </div>
              </div>

              {/* Personal Details & Safety/Dietary Alerts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0B1914]/60 p-4 rounded-xl border border-white/10 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A97E] flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Contact Information
                  </h3>
                  <div className="text-xs text-stone-300 space-y-1">
                    <p><span className="text-stone-500">Email:</span> {selectedCustomer.email}</p>
                    <p><span className="text-stone-500">Phone:</span> {selectedCustomer.phone}</p>
                    {selectedCustomer.emergencyContact && (
                      <p><span className="text-stone-500">Emergency Contact:</span> {selectedCustomer.emergencyContact}</p>
                    )}
                  </div>
                </div>

                <div className="bg-[#0B1914]/60 p-4 rounded-xl border border-white/10 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" /> Safety &amp; Dietary Preferences
                  </h3>
                  <div className="text-xs text-stone-300 space-y-1">
                    {selectedCustomer.dietaryPreferences ? (
                      <p className="flex items-start gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                        <span>{selectedCustomer.dietaryPreferences}</span>
                      </p>
                    ) : (
                      <p className="text-stone-500 italic">No dietary restrictions recorded.</p>
                    )}

                    {selectedCustomer.safetyNotes ? (
                      <p className="flex items-start gap-1.5 text-amber-200">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{selectedCustomer.safetyNotes}</span>
                      </p>
                    ) : (
                      <p className="text-stone-500 italic">Standard kayak safety protocol applies.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Booking History Timeline */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#C8A97E]" /> Expedition Booking History
                </h3>

                {!selectedCustomer.bookings || selectedCustomer.bookings.length === 0 ? (
                  <div className="p-4 bg-[#0B1914]/40 border border-white/5 rounded-xl text-stone-500 text-xs text-center italic">
                    No active or historical bookings found for this customer record.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {selectedCustomer.bookings.map((booking) => (
                      <div
                        key={booking.bookingId}
                        className="bg-[#0B1914]/80 p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-white text-sm">
                              {booking.packageName}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30 text-[10px] font-mono">
                              {booking.bookingId}
                            </span>
                          </div>

                          <p className="text-xs text-stone-400 flex items-center gap-3 flex-wrap">
                            <span><strong className="text-stone-300">Date:</strong> {booking.selectedDate}</span>
                            <span>•</span>
                            <span><strong className="text-stone-300">Slot:</strong> {booking.timeSlot}</span>
                            <span>•</span>
                            <span><strong className="text-stone-300">Craft:</strong> {booking.kayakType || 'Single Kayak'}</span>
                            <span>•</span>
                            <span><strong className="text-stone-300">Guests:</strong> {booking.guestCount}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-3 sm:justify-end">
                          <div className="text-right">
                            <span className="block font-mono font-bold text-emerald-400 text-sm">
                              {formatLKR(booking.totalAmountLKR)}
                            </span>
                            <span className="text-[10px] uppercase font-semibold text-stone-400">
                              {booking.paymentMethod} • {booking.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Concierge & Communication Interaction Logs */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-300 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#C8A97E]" /> Staff Concierge &amp; Communication Logs
                </h3>

                {/* Add Log Note Form */}
                <form onSubmit={handleAddLogNote} className="bg-[#0B1914]/90 p-4 rounded-xl border border-white/10 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                        Category
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
                      Concierge Interaction Note
                    </label>
                    <textarea
                      rows={2}
                      value={newLogNote}
                      onChange={(e) => setNewLogNote(e.target.value)}
                      placeholder="Add details regarding guest preferences, safety debriefs, or special arrival arrangements..."
                      className="w-full px-3 py-2 bg-[#13241E] border border-white/15 rounded-lg text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C8A97E]"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmittingLog || !newLogNote.trim()}
                      className="px-4 py-2 bg-[#C8A97E] hover:bg-[#d4af37] disabled:opacity-50 text-[#0B1914] font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isSubmittingLog ? 'Saving...' : 'Add Note to Log'}</span>
                    </button>
                  </div>
                </form>

                {/* Timeline of Logs */}
                {!selectedCustomer.contactLogs || selectedCustomer.contactLogs.length === 0 ? (
                  <div className="p-4 bg-[#0B1914]/40 border border-white/5 rounded-xl text-stone-500 text-xs text-center italic">
                    No communication logs recorded yet for this guest.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedCustomer.contactLogs.map((log) => (
                      <div
                        key={log.id}
                        className="bg-[#0B1914]/70 p-4 rounded-xl border border-white/10 space-y-1.5"
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

            {/* Modal Footer */}
            <div className="bg-[#0B1914] px-6 py-4 border-t border-white/10 flex items-center justify-between">
              <Link
                href={`/admin/customers/${selectedCustomer.id}`}
                className="text-xs text-[#C8A97E] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Open Standalone Profile Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         REGISTER NEW GUEST MODAL
         ========================================================================= */}
      {isAddGuestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#13241E] border border-white/15 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <Plus className="w-5 h-5 text-[#C8A97E]" />
                <h2 className="font-serif text-xl font-normal text-white">Register New Guest Profile</h2>
              </div>
              <button
                onClick={() => setIsAddGuestModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGuestSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  placeholder="e.g. Ruwan Wickramasinghe"
                  className="w-full px-3.5 py-2.5 bg-[#0B1914] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#C8A97E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newGuestEmail}
                    onChange={(e) => setNewGuestEmail(e.target.value)}
                    placeholder="ruwan@example.com"
                    className="w-full px-3.5 py-2.5 bg-[#0B1914] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#C8A97E]"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newGuestPhone}
                    onChange={(e) => setNewGuestPhone(e.target.value)}
                    placeholder="+94771234567"
                    className="w-full px-3.5 py-2.5 bg-[#0B1914] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#C8A97E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Initial Membership Tier</label>
                <select
                  value={newGuestTier}
                  onChange={(e) => setNewGuestTier(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-[#0B1914] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#C8A97E]"
                >
                  <option value="Regular">Regular Guest</option>
                  <option value="VIP">VIP Guest</option>
                  <option value="Wilderness Elite">Wilderness Elite</option>
                  <option value="Corporate">Corporate Charter</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Dietary Preferences</label>
                <input
                  type="text"
                  value={newGuestDiet}
                  onChange={(e) => setNewGuestDiet(e.target.value)}
                  placeholder="e.g. Vegetarian, Nut allergy"
                  className="w-full px-3.5 py-2.5 bg-[#0B1914] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#C8A97E]"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Safety Notes &amp; Experience</label>
                <input
                  type="text"
                  value={newGuestSafety}
                  onChange={(e) => setNewGuestSafety(e.target.value)}
                  placeholder="e.g. First-time kayaker, requires life vest check"
                  className="w-full px-3.5 py-2.5 bg-[#0B1914] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#C8A97E]"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={newGuestEmergency}
                  onChange={(e) => setNewGuestEmergency(e.target.value)}
                  placeholder="+94770001122 (Spouse)"
                  className="w-full px-3.5 py-2.5 bg-[#0B1914] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#C8A97E]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddGuestModalOpen(false)}
                  className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl font-semibold uppercase tracking-wider text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#C8A97E] hover:bg-[#d4af37] text-[#0B1914] font-bold rounded-xl uppercase tracking-wider text-xs shadow-lg"
                >
                  Save Guest Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
