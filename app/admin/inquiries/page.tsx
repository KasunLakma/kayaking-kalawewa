'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  getAllInquiriesFromFirestore,
  updateInquiryStatusInFirestore,
  CustomerInquiry,
} from '@/lib/firebase';
import AdminSubNav from '@/components/AdminSubNav';
import {
  Mail,
  Search,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Lock,
  Filter,
  User,
  ArrowRight,
  Sparkles,
  Inbox,
} from 'lucide-react';

function getInitials(name: string): string {
  if (!name) return 'IN';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' at ' +
      d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
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

function getStatusBadge(status: CustomerInquiry['status']) {
  switch (status) {
    case 'UNREAD':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-semibold animate-pulse">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          Unread Inquiry
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-semibold">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          In Progress
        </span>
      );
    case 'RESOLVED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Resolved
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800 border border-stone-600 text-stone-300 text-xs font-medium">
          New
        </span>
      );
  }
}

export default function CustomerInquiriesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<string>('');

  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Selected Inquiry for Detail Reader Modal
  const [selectedInquiry, setSelectedInquiry] = useState<CustomerInquiry | null>(null);
  const [staffNoteInput, setStaffNoteInput] = useState<string>('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
      fetchInquiries();
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
      fetchInquiries();
    } else {
      setPasscodeError('Invalid Security Passcode. Access Denied.');
    }
  };

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const data = await getAllInquiriesFromFirestore();
      setInquiries(data);
      if (selectedInquiry) {
        const refreshed = data.find((i) => i.id === selectedInquiry.id);
        if (refreshed) {
          setSelectedInquiry(refreshed);
          setStaffNoteInput(refreshed.staffNotes || '');
        }
      }
    } catch (err) {
      console.error("Failed to fetch customer inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        inq.name.toLowerCase().includes(term) ||
        inq.email.toLowerCase().includes(term) ||
        inq.subject.toLowerCase().includes(term) ||
        inq.message.toLowerCase().includes(term);

      const matchesStatus = statusFilter === 'ALL' || inq.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [inquiries, searchTerm, statusFilter]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const total = inquiries.length;
    const unread = inquiries.filter((i) => i.status === 'UNREAD').length;
    const inProgress = inquiries.filter((i) => i.status === 'IN_PROGRESS').length;
    const resolved = inquiries.filter((i) => i.status === 'RESOLVED').length;
    return { total, unread, inProgress, resolved };
  }, [inquiries]);

  // Handle status update
  const handleUpdateStatus = async (
    inquiryId: string,
    newStatus: CustomerInquiry['status'],
    notes?: string
  ) => {
    setIsUpdatingStatus(true);
    try {
      await updateInquiryStatusInFirestore(inquiryId, newStatus, notes);
      await fetchInquiries();
    } catch (err) {
      console.error("Failed to update inquiry status:", err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const openInquiryModal = (inquiry: CustomerInquiry) => {
    setSelectedInquiry(inquiry);
    setStaffNoteInput(inquiry.staffNotes || '');
    // Auto mark as IN_PROGRESS if UNREAD when opened
    if (inquiry.status === 'UNREAD') {
      handleUpdateStatus(inquiry.id, 'IN_PROGRESS', inquiry.staffNotes);
    }
  };

  // Security Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B1914] text-[#F4F1EA] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#13241E] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#C8A97E] mb-3">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-2xl font-normal text-[#F4F1EA]">Admin Security Check</h1>
            <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider">Customer Inquiries Module</p>
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
      {/* Header Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[#C8A97E]">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-normal text-[#F4F1EA] tracking-wide">
                Customer Inquiries Inbox
              </h1>
              <p className="text-xs text-stone-400 mt-0.5">
                Manage guest contact form submissions, special requests, and concierge inquiries
              </p>
            </div>
          </div>

          <button
            onClick={fetchInquiries}
            className="px-4 py-2.5 border border-white/20 hover:border-[#C8A97E] text-stone-300 hover:text-white rounded-xl transition-all bg-white/[0.02] cursor-pointer flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Inbox</span>
          </button>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#13241E]/80 border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Total Received</p>
              <h3 className="text-2xl font-bold text-white mt-1">{metrics.total}</h3>
              <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
                <Inbox className="w-3.5 h-3.5" /> Lifetime Contact Form Submissions
              </p>
            </div>
            <div className="p-3 bg-stone-800/80 border border-stone-600/50 rounded-xl text-stone-300">
              <Inbox className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-[#13241E]/80 border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Unread Messages</p>
              <h3 className="text-2xl font-bold text-amber-300 mt-1">{metrics.unread}</h3>
              <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Requires Front Desk Attention
              </p>
            </div>
            <div className="p-3 bg-amber-950/60 border border-amber-500/40 rounded-xl text-amber-400">
              <AlertCircle className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          <div className="bg-[#13241E]/80 border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">In Progress</p>
              <h3 className="text-2xl font-bold text-cyan-300 mt-1">{metrics.inProgress}</h3>
              <p className="text-[11px] text-cyan-400 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Active Staff Correspondence
              </p>
            </div>
            <div className="p-3 bg-cyan-950/60 border border-cyan-500/40 rounded-xl text-cyan-400">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-[#13241E]/80 border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Resolved Inquiries</p>
              <h3 className="text-2xl font-bold text-emerald-300 mt-1">{metrics.resolved}</h3>
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Completed Guest Requests
              </p>
            </div>
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#13241E]/90 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Guest Name, Email, or Subject..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#0B1914] border border-white/15 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C8A97E]"
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
              className="px-3.5 py-2 bg-[#0B1914] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8A97E] cursor-pointer"
            >
              <option value="ALL">All Inquiries</option>
              <option value="UNREAD">Unread Only</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>

        {/* Inquiries Inbox Directory Table */}
        <div className="bg-[#13241E]/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-stone-400 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-[#C8A97E]" />
              <p className="text-xs uppercase tracking-wider">Fetching Customer Inquiries Feed...</p>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="p-12 text-center text-stone-400 space-y-3">
              <Mail className="w-12 h-12 mx-auto text-stone-600" />
              <h3 className="text-base font-semibold text-stone-300">No Inquiries Found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                No customer messages match your current search criteria or status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-[#0B1914]/80 uppercase text-[10px] tracking-wider text-stone-400 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Guest Sender</th>
                    <th className="px-6 py-4 font-semibold">Subject &amp; Snippet</th>
                    <th className="px-6 py-4 font-semibold">Submitted</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredInquiries.map((inq) => {
                    const initials = getInitials(inq.name);
                    const whatsappNumber = inq.phone.replace(/[^0-9]/g, '');

                    return (
                      <tr
                        key={inq.id}
                        className={`hover:bg-white/[0.02] transition-colors cursor-pointer group ${
                          inq.status === 'UNREAD' ? 'bg-amber-950/10' : ''
                        }`}
                        onClick={() => openInquiryModal(inq)}
                      >
                        {/* Guest Sender */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#0B1914] border border-white/20 flex items-center justify-center font-bold text-xs text-[#C8A97E]">
                              {initials}
                            </div>
                            <div>
                              <span className="font-semibold text-white text-sm group-hover:text-[#C8A97E] transition-colors block">
                                {inq.name}
                              </span>
                              <span className="text-[11px] text-stone-400">{inq.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Subject & Preview Snippet */}
                        <td className="px-6 py-4 max-w-md">
                          <div className="space-y-1">
                            <span className="font-semibold text-stone-200 block truncate">
                              {inq.subject}
                            </span>
                            <p className="text-[11px] text-stone-400 line-clamp-1">
                              {inq.message}
                            </p>
                          </div>
                        </td>

                        {/* Timestamp */}
                        <td className="px-6 py-4 text-stone-400 whitespace-nowrap">
                          {formatTimeAgo(inq.createdAt)}
                        </td>

                        {/* Status Badge */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(inq.status)}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            {whatsappNumber && (
                              <a
                                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                                  `Hello ${inq.name}, replying to your inquiry regarding "${inq.subject}"...`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-800 transition-all"
                                title="Reply via WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                            )}

                            <button
                              onClick={() => openInquiryModal(inq)}
                              className="px-3 py-1.5 rounded-lg bg-[#C8A97E]/20 border border-[#C8A97E]/40 text-[#C8A97E] hover:bg-[#C8A97E] hover:text-[#0B1914] font-semibold text-xs transition-all flex items-center gap-1"
                            >
                              <span>Read Inquiry</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
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
         INQUIRY READER & STAFF NOTES MODAL
         ========================================================================= */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#13241E] border border-white/15 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col space-y-0">
            {/* Modal Header */}
            <div className="bg-[#0B1914] px-6 py-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#C8A97E] flex items-center justify-center font-bold">
                  {getInitials(selectedInquiry.name)}
                </div>
                <div>
                  <h2 className="font-serif text-xl font-normal text-white">{selectedInquiry.name}</h2>
                  <p className="text-xs text-stone-400">{selectedInquiry.email} • {selectedInquiry.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(selectedInquiry.status)}
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="p-2 text-stone-400 hover:text-white rounded-xl border border-white/10 hover:border-white/30 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Submission Info */}
              <div className="bg-[#0B1914]/60 p-4 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-stone-400 text-[11px]">
                  <span>Submitted: {formatDate(selectedInquiry.createdAt)}</span>
                  <span>Inquiry Ref ID: <code className="text-stone-300">{selectedInquiry.id}</code></span>
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide">{selectedInquiry.subject}</h3>
              </div>

              {/* Message Body */}
              <div className="bg-[#0B1914]/90 p-5 rounded-xl border border-white/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A97E] block">
                  Guest Message Body:
                </span>
                <p className="text-stone-200 text-xs leading-relaxed whitespace-pre-line font-sans">
                  {selectedInquiry.message}
                </p>
              </div>

              {/* Staff Concierge Notes */}
              <div className="bg-[#0B1914]/80 p-5 rounded-xl border border-white/10 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 block flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Staff Internal Resolution Notes:
                </span>

                <textarea
                  rows={3}
                  value={staffNoteInput}
                  onChange={(e) => setStaffNoteInput(e.target.value)}
                  placeholder="Record staff actions taken, guide assignments, or phone correspondence details..."
                  className="w-full p-3 bg-[#13241E] border border-white/15 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C8A97E]"
                />

                <div className="flex justify-end">
                  <button
                    onClick={() => handleUpdateStatus(selectedInquiry.id, selectedInquiry.status, staffNoteInput)}
                    disabled={isUpdatingStatus}
                    className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs uppercase tracking-wider rounded-lg transition-all border border-stone-600 cursor-pointer"
                  >
                    Save Internal Notes
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer Quick Actions */}
            <div className="bg-[#0B1914] px-6 py-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {selectedInquiry.phone && (
                  <a
                    href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${selectedInquiry.name}, replying to your Kalawewa inquiry regarding "${selectedInquiry.subject}"...`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-800 font-semibold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Reply via WhatsApp</span>
                  </a>
                )}

                <a
                  href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent(
                    `Re: ${selectedInquiry.subject}`
                  )}`}
                  className="px-3.5 py-2 bg-stone-800 border border-stone-600 text-stone-200 hover:bg-stone-700 font-semibold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </a>
              </div>

              <div className="flex items-center gap-2">
                {selectedInquiry.status !== 'RESOLVED' ? (
                  <button
                    onClick={() => handleUpdateStatus(selectedInquiry.id, 'RESOLVED', staffNoteInput)}
                    disabled={isUpdatingStatus}
                    className="px-4 py-2 bg-emerald-950/80 border border-emerald-500/50 hover:bg-emerald-800 text-emerald-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark as Resolved</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdateStatus(selectedInquiry.id, 'IN_PROGRESS', staffNoteInput)}
                    disabled={isUpdatingStatus}
                    className="px-4 py-2 bg-amber-950/80 border border-amber-500/50 hover:bg-amber-800 text-amber-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Reopen Inquiry</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
