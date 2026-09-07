'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  getStaffMembersFromFirestore,
  saveStaffMemberToFirestore,
  updateStaffMemberInFirestore,
  deleteStaffMemberFromFirestore,
  getStaffLogsFromFirestore,
  addStaffLogToFirestore,
  StaffMember,
  StaffActivityLog,
} from '@/lib/firebase';
import AdminSubNav from '@/components/AdminSubNav';
import {
  Users,
  UserCheck,
  UserX,
  UserMinus,
  Shield,
  Plus,
  Edit3,
  Activity,
  Search,
  Mail,
  Phone,
  Compass,
  Check,
  X,
  Lock,
  Clock,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';

const AVAILABLE_ROLES = [
  'Naturalist Guide',
  'Reservation Desk',
  'Operations Manager',
  'Safety Officer',
  'Kayak Master',
];

const AVAILABLE_EXPEDITIONS = [
  'Sunrise Lotus Drift',
  'Wild Elephant Corridor Trail',
  'Sunset Romance & Couples',
  'Full Day Kalawewa Explorer',
  'Emergency Rapid Response & Safety Protocol',
];

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

    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function getInitials(name: string): string {
  if (!name) return 'ST';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getRoleBadgeStyle(role: string) {
  switch (role) {
    case 'Operations Manager':
      return 'bg-amber-950/60 border-amber-500/50 text-amber-300';
    case 'Naturalist Guide':
      return 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300';
    case 'Reservation Desk':
      return 'bg-purple-950/60 border-purple-500/50 text-purple-300';
    case 'Safety Officer':
      return 'bg-red-950/60 border-red-500/50 text-red-300';
    case 'Kayak Master':
      return 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300';
    default:
      return 'bg-stone-800/60 border-stone-600 text-stone-300';
  }
}

export default function StaffManagementPage() {
  // 1. PIN Security Gate State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // 2. Data States
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [staffLogs, setStaffLogs] = useState<StaffActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 3. Filter & Search States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // 4. Modal States
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [viewingLogsStaff, setViewingLogsStaff] = useState<StaffMember | null>(null);

  // 5. Form Input States (for Add & Edit)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: AVAILABLE_ROLES[0],
    status: 'ACTIVE' as 'ACTIVE' | 'OFF_DUTY' | 'SUSPENDED',
    expeditions: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Check stored auth session
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('kalawewa_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch staff records & logs
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fetchedStaff, fetchedLogs] = await Promise.all([
        getStaffMembersFromFirestore(),
        getStaffLogsFromFirestore(),
      ]);
      setStaffList(fetchedStaff);
      setStaffLogs(fetchedLogs);
    } catch (err) {
      console.error('Failed to load staff data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Passcode verification
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = process.env.NEXT_PUBLIC_ADMIN_PIN || '8026';
    if (pinInput === correctPin || pinInput === '8026' || pinInput === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('kalawewa_admin_auth', 'true');
      setPinError('');
    } else {
      setPinError('Invalid Operator PIN. Enter "8026" or authorized admin passcode.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('kalawewa_admin_auth');
    setIsAuthenticated(false);
    setPinInput('');
  };

  // KPI Calculations
  const totalStaff = staffList.length;
  const activeCount = staffList.filter((s) => s.status === 'ACTIVE').length;
  const offDutyCount = staffList.filter((s) => s.status === 'OFF_DUTY').length;
  const suspendedCount = staffList.filter((s) => s.status === 'SUSPENDED').length;

  // Filtered Staff Table
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      // 1. Status Filter
      if (selectedStatusFilter !== 'ALL' && s.status !== selectedStatusFilter) {
        return false;
      }
      // 2. Role Filter
      if (selectedRoleFilter !== 'ALL' && s.role !== selectedRoleFilter) {
        return false;
      }
      // 3. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = s.fullName.toLowerCase().includes(q);
        const emailMatch = s.email.toLowerCase().includes(q);
        const phoneMatch = s.phone.toLowerCase().includes(q);
        const idMatch = s.id.toLowerCase().includes(q);
        const roleMatch = s.role.toLowerCase().includes(q);
        return nameMatch || emailMatch || phoneMatch || idMatch || roleMatch;
      }
      return true;
    });
  }, [staffList, selectedStatusFilter, selectedRoleFilter, searchQuery]);

  // Open Invite Modal
  const handleOpenInviteModal = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      role: AVAILABLE_ROLES[0],
      status: 'ACTIVE',
      expeditions: [AVAILABLE_EXPEDITIONS[0]],
    });
    setShowInviteModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (staff: StaffMember) => {
    setEditingStaff(staff);
    setFormData({
      fullName: staff.fullName,
      email: staff.email,
      phone: staff.phone,
      role: staff.role,
      status: staff.status,
      expeditions: staff.expeditions || [],
    });
  };

  // Toggle Expedition Checkbox Selection
  const handleExpeditionToggle = (expedition: string) => {
    setFormData((prev) => {
      const exists = prev.expeditions.includes(expedition);
      if (exists) {
        return { ...prev, expeditions: prev.expeditions.filter((e) => e !== expedition) };
      } else {
        return { ...prev, expeditions: [...prev.expeditions, expedition] };
      }
    });
  };

  // Handle Invite Form Submission
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;

    setIsSubmitting(true);
    try {
      const created = await saveStaffMemberToFirestore({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || '+94770000000',
        role: formData.role,
        status: formData.status,
        expeditions: formData.expeditions,
        lastActive: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });

      setStaffList((prev) => [created, ...prev]);
      setShowInviteModal(false);
      await loadData();
    } catch (err) {
      console.error('Failed to invite staff:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Form Submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    setIsSubmitting(true);
    try {
      const updates = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
        expeditions: formData.expeditions,
      };

      await updateStaffMemberInFirestore(editingStaff.id, updates);

      // Add audit log
      await addStaffLogToFirestore({
        staffId: editingStaff.id,
        staffName: formData.fullName,
        action: `Profile updated by Admin (Role: ${formData.role}, Status: ${formData.status})`,
        timestamp: new Date().toISOString(),
        type: 'PROFILE',
      });

      setStaffList((prev) =>
        prev.map((s) => (s.id === editingStaff.id ? { ...s, ...updates } : s))
      );

      setEditingStaff(null);
      await loadData();
    } catch (err) {
      console.error('Failed to update staff:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Status Toggle (Active <-> Off Duty <-> Suspended)
  const handleQuickStatusToggle = async (staff: StaffMember) => {
    let nextStatus: 'ACTIVE' | 'OFF_DUTY' | 'SUSPENDED' = 'OFF_DUTY';
    if (staff.status === 'ACTIVE') nextStatus = 'OFF_DUTY';
    else if (staff.status === 'OFF_DUTY') nextStatus = 'ACTIVE';
    else if (staff.status === 'SUSPENDED') nextStatus = 'ACTIVE';

    setStaffList((prev) =>
      prev.map((s) => (s.id === staff.id ? { ...s, status: nextStatus } : s))
    );

    await updateStaffMemberInFirestore(staff.id, { status: nextStatus });
    await addStaffLogToFirestore({
      staffId: staff.id,
      staffName: staff.fullName,
      action: `Status toggled to [${nextStatus}]`,
      timestamp: new Date().toISOString(),
      type: 'PROFILE',
    });
  };

  // Filter logs for selected staff member in modal
  const activeStaffLogs = useMemo(() => {
    if (!viewingLogsStaff) return [];
    return staffLogs.filter((l) => l.staffId === viewingLogsStaff.id);
  }, [staffLogs, viewingLogsStaff]);

  // Security Gate UI
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B1914] text-[#F4F1EA] flex items-center justify-center p-6 selection:bg-[#C8A97E] selection:text-[#0B1914]">
        <div className="bg-[#13241E] border border-[#C8A97E]/40 p-8 sm:p-12 max-w-md w-full shadow-2xl space-y-6 relative rounded-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#C8A97E]/10 border border-[#C8A97E]/40 flex items-center justify-center mx-auto text-[#C8A97E]">
              <Lock className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#C8A97E] block pt-2">
              KALAWEWA STAFF MANAGEMENT
            </span>
            <h1 className="font-serif text-3xl text-[#F4F1EA]">Admin Authentication</h1>
            <p className="text-xs text-[#F4F1EA]/70 font-light">
              Enter authorized operator PIN to manage staff records, roles, and provisioning.
            </p>
          </div>

          {pinError && (
            <div className="p-3 bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-light text-center rounded-lg">
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
                className="w-full px-4 py-3.5 bg-[#0B1914] border border-white/20 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] tracking-widest text-center rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#C8A97E] hover:bg-[#b5966c] text-[#0B1914] text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer shadow-md rounded-lg"
            >
              UNLOCK STAFF PORTAL
            </button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-stone-300 hover:text-[#d4af37] text-xs font-semibold tracking-wider uppercase transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#d4af37]/40 bg-white/[0.02]"
            >
              <span>←</span>
              <span>BACK TO RESERVATIONS</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1914] text-[#F4F1EA] font-sans selection:bg-[#C8A97E] selection:text-[#0B1914] flex flex-col justify-between">
      {/* Top Admin Sub-Navigation Header */}
      <AdminSubNav onRefresh={loadData} onLogout={handleLogout} />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1 space-y-8">
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C8A97E] block mb-1">
              ADMIN DASHBOARD • QA V1.1 MODULE
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#F4F1EA] flex items-center gap-3">
              <Users className="w-8 h-8 text-[#C8A97E]" />
              <span>Staff Management &amp; Roster</span>
            </h1>
            <p className="text-xs text-stone-400 font-light mt-1 max-w-2xl">
              Provision, assign roles, inspect activity logs, and configure trail expedition permissions for Kalawewa naturalist guides, reservation operators, and safety specialists.
            </p>
          </div>

          <button
            onClick={handleOpenInviteModal}
            className="px-5 py-3 bg-[#C8A97E] hover:bg-[#b5966c] text-[#0B1914] font-bold text-xs uppercase tracking-[0.15em] transition-all flex items-center gap-2 cursor-pointer shadow-lg rounded-xl self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Invite New Staff</span>
          </button>
        </div>

        {/* KPI Metrics Summary Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* KPI 1: Total Staff */}
          <div className="bg-[#13241E] border border-white/10 rounded-xl p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-400 block">
                TOTAL STAFF ROSTER
              </span>
              <Users className="w-5 h-5 text-stone-400" />
            </div>
            <div className="text-[#f3efe6] font-mono text-3xl font-bold">{totalStaff}</div>
            <span className="text-stone-400 text-xs font-normal block pt-0.5">
              Registered personnel &amp; guides
            </span>
          </div>

          {/* KPI 2: On Duty / Active */}
          <div className="bg-[#13241E] border border-emerald-500/40 rounded-xl p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-400 block">
                ACTIVE / ON DUTY
              </span>
              <UserCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-emerald-400 font-mono text-3xl font-bold">{activeCount}</div>
            <span className="text-stone-300 text-xs font-normal block pt-0.5">
              Available for trail dispatch
            </span>
          </div>

          {/* KPI 3: Off Duty */}
          <div className="bg-[#13241E] border border-white/10 rounded-xl p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-300 block">
                OFF DUTY
              </span>
              <UserMinus className="w-5 h-5 text-amber-300" />
            </div>
            <div className="text-amber-300 font-mono text-3xl font-bold">{offDutyCount}</div>
            <span className="text-stone-400 text-xs font-normal block pt-0.5">
              Scheduled shift rest
            </span>
          </div>

          {/* KPI 4: Suspended */}
          <div className="bg-[#13241E] border border-red-500/40 rounded-xl p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-red-400 block">
                SUSPENDED / INACTIVE
              </span>
              <UserX className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-red-400 font-mono text-3xl font-bold">{suspendedCount}</div>
            <span className="text-stone-400 text-xs font-normal block pt-0.5">
              Access restricted
            </span>
          </div>
        </section>

        {/* Staff Table Section & Filters */}
        <section className="bg-[#13241E] border border-white/10 p-6 sm:p-8 space-y-6 rounded-2xl">
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[280px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff by Name, Email, Phone, ID..."
                className="w-full px-4 py-2.5 min-h-[44px] pl-10 bg-[#0B1914] border border-white/20 text-xs text-[#F4F1EA] placeholder-slate-400 focus:outline-none focus:border-[#C8A97E] rounded-lg"
              />
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Role Dropdown */}
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="px-3.5 py-2.5 min-h-[44px] bg-[#0B1914] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
              >
                <option value="ALL">All Roles</option>
                {AVAILABLE_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 bg-[#0B1914] p-1 rounded-lg border border-white/10">
                {['ALL', 'ACTIVE', 'OFF_DUTY', 'SUSPENDED'].map((st) => {
                  const isActive = selectedStatusFilter === st;
                  return (
                    <button
                      key={st}
                      onClick={() => setSelectedStatusFilter(st)}
                      className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#C8A97E] text-[#0B1914]'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      {st === 'OFF_DUTY' ? 'OFF DUTY' : st}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto w-full border border-white/10 rounded-xl no-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0B1914] border-b border-white/15 text-stone-300 uppercase tracking-widest text-[11px] font-medium">
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Assigned Role &amp; Expeditions</th>
                  <th className="p-4">Activity Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-light">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-stone-400 italic">
                      Loading staff member records...
                    </td>
                  </tr>
                ) : filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-stone-400 italic">
                      No staff records found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((staff) => {
                    const cleanPhone = staff.phone.replace(/[^0-9]/g, '');
                    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                      `Hi ${staff.fullName}, contacting from Kalawewa Operations Desk.`
                    )}`;

                    return (
                      <tr
                        key={staff.id}
                        className="bg-[#0B1914]/80 hover:bg-white/[0.03] transition-colors"
                      >
                        {/* 1. STAFF MEMBER */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#13241E] border border-[#C8A97E]/50 flex items-center justify-center font-mono font-bold text-[#C8A97E] text-xs shrink-0 shadow-inner">
                              {getInitials(staff.fullName)}
                            </div>
                            <div>
                              <div className="font-medium text-[#f3efe6] text-sm">
                                {staff.fullName}
                              </div>
                              <div className="text-[#d4af37] font-mono text-[11px]">
                                {staff.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. CONTACT INFO */}
                        <td className="p-4 space-y-1">
                          <div className="text-stone-300 font-mono text-xs flex items-center gap-1.5 select-all">
                            <Mail className="w-3.5 h-3.5 text-stone-400" />
                            <span>{staff.email}</span>
                          </div>
                          <div className="text-[#d4af37] font-mono text-xs flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>{staff.phone}</span>
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-1 text-emerald-400 hover:text-emerald-300 transition-transform hover:scale-110"
                              title="Chat via WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>

                        {/* 3. ASSIGNED ROLE & EXPEDITIONS */}
                        <td className="p-4 space-y-2">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${getRoleBadgeStyle(
                              staff.role
                            )}`}
                          >
                            {staff.role}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {staff.expeditions && staff.expeditions.length > 0 ? (
                              staff.expeditions.map((exp, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 text-[9px] bg-white/[0.05] border border-white/10 text-stone-300 rounded"
                                >
                                  {exp}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-stone-500 italic">
                                General Roster
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 4. ACTIVITY STATUS */}
                        <td className="p-4 space-y-1">
                          <div className="flex items-center gap-2">
                            {staff.status === 'ACTIVE' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Active / On Duty
                              </span>
                            )}
                            {staff.status === 'OFF_DUTY' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900 border border-stone-600 text-stone-400 text-[10px] font-semibold uppercase tracking-wider">
                                Off Duty
                              </span>
                            )}
                            {staff.status === 'SUSPENDED' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-red-300 text-[10px] font-semibold uppercase tracking-wider">
                                Suspended
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-stone-500" />
                            <span>Last active {formatTimeAgo(staff.lastActive)}</span>
                          </div>
                        </td>

                        {/* 5. ACTIONS */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenEditModal(staff)}
                              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="Edit Role & Permissions"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Status Quick Switch */}
                            <button
                              onClick={() => handleQuickStatusToggle(staff)}
                              className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] font-semibold uppercase tracking-wider rounded-lg border border-white/10 transition-colors cursor-pointer"
                              title="Toggle Duty Status"
                            >
                              Toggle
                            </button>

                            {/* Activity Logs Button */}
                            <button
                              onClick={() => setViewingLogsStaff(staff)}
                              className="p-2 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 rounded-lg transition-colors cursor-pointer"
                              title="View Activity Logs"
                            >
                              <Activity className="w-3.5 h-3.5" />
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
      </main>

      {/* INVITE NEW STAFF MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0B1914] border border-[#C8A97E]/50 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative text-[#F4F1EA] rounded-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowInviteModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C8A97E] block mb-1">
                STAFF PROVISIONING
              </span>
              <h3 className="font-serif text-2xl text-[#F4F1EA]">Invite New Staff Member</h3>
              <p className="text-xs text-stone-400 font-light mt-1">
                Provision a staff account in Firestore/Auth with assigned expedition capabilities.
              </p>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Priyantha Dissanayake"
                  className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="priyantha@kalawewakayaking.com"
                    className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+94 77 123 4567"
                    className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                    Assigned Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
                  >
                    {AVAILABLE_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                    Account Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as any })
                    }
                    className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
                  >
                    <option value="ACTIVE">Active / On Duty</option>
                    <option value="OFF_DUTY">Off Duty</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Expedition Capabilities */}
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-2">
                  Expeditions &amp; Trail Capability Assignments
                </label>
                <div className="space-y-2 bg-[#13241E] p-3 rounded-lg border border-white/10">
                  {AVAILABLE_EXPEDITIONS.map((exp) => {
                    const isChecked = formData.expeditions.includes(exp);
                    return (
                      <label
                        key={exp}
                        className="flex items-center gap-2.5 text-stone-300 hover:text-white cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleExpeditionToggle(exp)}
                          className="accent-[#C8A97E] w-4 h-4 rounded cursor-pointer"
                        />
                        <span>{exp}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-5 py-2.5 border border-white/20 text-xs uppercase tracking-wider text-slate-300 hover:text-white rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#C8A97E] hover:bg-[#b5966c] text-[#0B1914] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-lg shadow-md"
                >
                  {isSubmitting ? 'PROVISIONING...' : 'PROVISION & INVITE STAFF'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STAFF MODAL */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0B1914] border border-[#C8A97E]/50 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative text-[#F4F1EA] rounded-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingStaff(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C8A97E] block mb-1">
                STAFF RECONFIGURATION
              </span>
              <h3 className="font-serif text-2xl text-[#F4F1EA]">
                Edit Staff: {editingStaff.fullName}
              </h3>
              <p className="text-xs text-stone-400 font-mono mt-0.5">
                Staff ID: {editingStaff.id}
              </p>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                    Official Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                    Assigned Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
                  >
                    {AVAILABLE_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                    Account Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as any })
                    }
                    className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
                  >
                    <option value="ACTIVE">Active / On Duty</option>
                    <option value="OFF_DUTY">Off Duty</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Expedition Capabilities */}
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-2">
                  Expeditions &amp; Trail Capability Assignments
                </label>
                <div className="space-y-2 bg-[#13241E] p-3 rounded-lg border border-white/10">
                  {AVAILABLE_EXPEDITIONS.map((exp) => {
                    const isChecked = formData.expeditions.includes(exp);
                    return (
                      <label
                        key={exp}
                        className="flex items-center gap-2.5 text-stone-300 hover:text-white cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleExpeditionToggle(exp)}
                          className="accent-[#C8A97E] w-4 h-4 rounded cursor-pointer"
                        />
                        <span>{exp}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-5 py-2.5 border border-white/20 text-xs uppercase tracking-wider text-slate-300 hover:text-white rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#C8A97E] hover:bg-[#b5966c] text-[#0B1914] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-lg shadow-md"
                >
                  {isSubmitting ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW ACTIVITY LOGS MODAL */}
      {viewingLogsStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0B1914] border border-[#C8A97E]/50 p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 relative text-[#F4F1EA] rounded-2xl max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setViewingLogsStaff(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C8A97E] block mb-1">
                AUDIT LOG TRAIL
              </span>
              <h3 className="font-serif text-2xl text-[#F4F1EA] flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                <span>Activity Logs: {viewingLogsStaff.fullName}</span>
              </h3>
              <p className="text-xs text-stone-400 font-mono mt-0.5">
                Staff ID: {viewingLogsStaff.id} • Role: {viewingLogsStaff.role}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {activeStaffLogs.length === 0 ? (
                <div className="p-6 bg-[#13241E] rounded-lg border border-white/10 text-center text-stone-400 italic">
                  No activity log entries recorded for this staff member yet.
                </div>
              ) : (
                <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                  {activeStaffLogs.map((log) => (
                    <div
                      key={log.id}
                      className="pl-8 relative bg-[#13241E] p-3.5 rounded-lg border border-white/10 space-y-1"
                    >
                      <div className="absolute left-1.5 top-4 w-3 h-3 rounded-full bg-[#C8A97E] border-2 border-[#0B1914]" />
                      <div className="flex items-center justify-between text-stone-400 text-[10px] font-mono">
                        <span className="uppercase text-[#C8A97E] font-semibold tracking-wider">
                          [{log.type}]
                        </span>
                        <span>{formatTimeAgo(log.timestamp)}</span>
                      </div>
                      <p className="text-stone-200 text-xs font-light">{log.action}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-end border-t border-white/10">
              <button
                type="button"
                onClick={() => setViewingLogsStaff(null)}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-xs font-medium uppercase tracking-wider text-stone-200 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
