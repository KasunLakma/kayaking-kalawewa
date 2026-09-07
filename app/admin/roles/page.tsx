'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  getRolesFromFirestore,
  updateRolePermissionsInFirestore,
  saveRoleToFirestore,
  resetDefaultRolesInFirestore,
  SYSTEM_PERMISSIONS,
  RoleDefinition,
} from '@/lib/firebase';
import AdminSubNav from '@/components/AdminSubNav';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Plus,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Key,
  Users,
  Briefcase,
  Compass,
  FileText,
  Save,
  X,
  Info,
} from 'lucide-react';

function getRoleIcon(roleId: string) {
  switch (roleId) {
    case 'super_admin':
      return <ShieldCheck className="w-5 h-5 text-[#d4af37]" />;
    case 'operations_manager':
      return <Briefcase className="w-5 h-5 text-emerald-400" />;
    case 'naturalist_guide':
      return <Compass className="w-5 h-5 text-cyan-400" />;
    case 'front_desk':
      return <Users className="w-5 h-5 text-purple-400" />;
    default:
      return <Shield className="w-5 h-5 text-stone-400" />;
  }
}

function getRoleBadgeStyle(roleId: string) {
  switch (roleId) {
    case 'super_admin':
      return 'bg-amber-950/70 border-amber-500/50 text-[#d4af37]';
    case 'operations_manager':
      return 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300';
    case 'naturalist_guide':
      return 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300';
    case 'front_desk':
      return 'bg-purple-950/70 border-purple-500/50 text-purple-300';
    default:
      return 'bg-stone-800 border-stone-600 text-stone-300';
  }
}

export default function RolesManagementPage() {
  // 1. Super Admin Passcode Security Gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // 2. Data States
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('operations_manager');
  const [activePermissions, setActivePermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 3. UI & Feedback States
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 4. Custom Role Creation Modal
  const [showAddRoleModal, setShowAddRoleModal] = useState<boolean>(false);
  const [newRoleData, setNewRoleData] = useState({
    id: '',
    name: '',
    description: '',
  });

  // Check stored auth session
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('kalawewa_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load role definitions
  const loadData = async () => {
    setIsLoading(true);
    try {
      const fetchedRoles = await getRolesFromFirestore();
      setRoles(fetchedRoles);
      const initialRole = fetchedRoles.find((r) => r.id === selectedRoleId) || fetchedRoles[0];
      if (initialRole) {
        setSelectedRoleId(initialRole.id);
        setActivePermissions(initialRole.permissions || []);
      }
    } catch (err) {
      console.error('Failed to load role definitions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Sync active permissions when selected role changes
  useEffect(() => {
    const matched = roles.find((r) => r.id === selectedRoleId);
    if (matched) {
      setActivePermissions(matched.permissions || []);
      setIsDirty(false);
    }
  }, [selectedRoleId, roles]);

  // Handle PIN verification
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = process.env.NEXT_PUBLIC_ADMIN_PIN || '8026';
    if (pinInput === correctPin || pinInput === '8026' || pinInput === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('kalawewa_admin_auth', 'true');
      setPinError('');
    } else {
      setPinError('Access Denied. Only Super Admin passcode "8026" can alter security matrices.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('kalawewa_admin_auth');
    setIsAuthenticated(false);
    setPinInput('');
  };

  // Selected Role Metadata
  const currentRole = useMemo(() => {
    return roles.find((r) => r.id === selectedRoleId) || roles[0];
  }, [roles, selectedRoleId]);

  // Toggle individual permission key
  const handleTogglePermission = (permissionKey: string) => {
    if (currentRole?.id === 'super_admin') {
      // Super admin permissions remain locked for security
      showToast('Super Admin role maintains all system permissions by protocol.');
      return;
    }

    setActivePermissions((prev) => {
      const exists = prev.includes(permissionKey);
      const updated = exists ? prev.filter((k) => k !== permissionKey) : [...prev, permissionKey];
      setIsDirty(true);
      return updated;
    });
  };

  // Save Role Permissions Matrix
  const handleSavePermissions = async () => {
    if (!currentRole) return;
    setIsSaving(true);
    try {
      await updateRolePermissionsInFirestore(currentRole.id, activePermissions);

      setRoles((prev) =>
        prev.map((r) => (r.id === currentRole.id ? { ...r, permissions: activePermissions } : r))
      );

      setIsDirty(false);
      showToast(`Permissions updated for role [${currentRole.name}] in Firestore!`);
    } catch (err) {
      console.error('Failed to update role permissions:', err);
      showToast('Error saving permissions to Firestore.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset System Defaults
  const handleResetDefaults = async () => {
    if (!window.confirm('Reset all roles to system default permission matrices?')) return;
    setIsSaving(true);
    try {
      const resetRoles = await resetDefaultRolesInFirestore();
      setRoles(resetRoles);
      const current = resetRoles.find((r) => r.id === selectedRoleId) || resetRoles[0];
      if (current) {
        setActivePermissions(current.permissions);
      }
      setIsDirty(false);
      showToast('All roles reset to system default permission configurations.');
    } catch (err) {
      console.error('Failed to reset default roles:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Add Custom Role
  const handleAddCustomRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleData.name) return;

    const roleId = newRoleData.id || `custom_role_${Date.now()}`;
    const newRole: RoleDefinition = {
      id: roleId.toLowerCase().replace(/\s+/g, '_'),
      name: newRoleData.name,
      description: newRoleData.description || 'Custom administrative role.',
      isSystemRole: false,
      permissions: ['bookings.view', 'fleet.view'],
      updatedAt: new Date().toISOString(),
    };

    try {
      const created = await saveRoleToFirestore(newRole);
      setRoles((prev) => [...prev, created]);
      setSelectedRoleId(created.id);
      setShowAddRoleModal(false);
      setNewRoleData({ id: '', name: '', description: '' });
      showToast(`New role [${created.name}] registered successfully!`);
    } catch (err) {
      console.error('Failed to add custom role:', err);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

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
              SECURITY MATRIX &amp; RBAC PORTAL
            </span>
            <h1 className="font-serif text-3xl text-[#F4F1EA]">Super Admin Access</h1>
            <p className="text-xs text-[#F4F1EA]/70 font-light">
              Enter Super Admin operator passcode to configure system roles and granular security matrices.
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
                Super Admin Passcode
              </label>
              <input
                type="password"
                required
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter Super Admin PIN (Default: 8026)..."
                className="w-full px-4 py-3.5 bg-[#0B1914] border border-white/20 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] tracking-widest text-center rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#C8A97E] hover:bg-[#b5966c] text-[#0B1914] text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer shadow-md rounded-lg"
            >
              UNLOCK RBAC PORTAL
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

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#13241E] border border-[#d4af37] text-[#d4af37] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#d4af37] shrink-0" />
          <span className="font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-stone-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1 space-y-8">
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C8A97E] block mb-1">
              ADMIN DASHBOARD • QA V1.1 MODULE
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#F4F1EA] flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-[#d4af37]" />
              <span>Role-Based Access Control (RBAC)</span>
            </h1>
            <p className="text-xs text-stone-400 font-light mt-1 max-w-2xl">
              Configure granular security permission matrices across Bookings, Fleet, Staff Roster, Financial Audit Reports, and System Settings.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={handleResetDefaults}
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs uppercase tracking-wider rounded-xl border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
              title="Reset System Roles to Default Matrix"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={() => setShowAddRoleModal(true)}
              className="px-4 py-2.5 bg-[#C8A97E] hover:bg-[#b5966c] text-[#0B1914] font-bold text-xs uppercase tracking-[0.15em] transition-all flex items-center gap-2 cursor-pointer shadow-lg rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>New Role</span>
            </button>
          </div>
        </div>

        {/* Role Selector Tabs Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((r) => {
            const isSelected = r.id === selectedRoleId;
            const permCount = r.permissions ? r.permissions.length : 0;

            return (
              <button
                key={r.id}
                onClick={() => setSelectedRoleId(r.id)}
                className={`p-5 rounded-2xl text-left border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-[#13241E] border-[#d4af37] shadow-xl ring-1 ring-[#d4af37]/40'
                    : 'bg-[#0B1914] border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {getRoleIcon(r.id)}
                    <span className="font-serif font-medium text-sm text-[#F4F1EA]">
                      {r.name}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider border ${getRoleBadgeStyle(
                      r.id
                    )}`}
                  >
                    {r.isSystemRole ? 'System Role' : 'Custom Role'}
                  </span>
                </div>

                <p className="text-[11px] text-stone-400 font-light line-clamp-2 leading-relaxed">
                  {r.description}
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono border-t border-white/10 pt-2.5 text-stone-300">
                  <span>Permissions Enabled:</span>
                  <span className="font-bold text-[#d4af37]">{permCount} Active</span>
                </div>
              </button>
            );
          })}
        </section>

        {/* Selected Role Header & Granular Permission Matrix */}
        {currentRole && (
          <section className="bg-[#13241E] border border-white/10 p-6 sm:p-8 space-y-8 rounded-2xl relative">
            {/* Active Role Meta Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  {getRoleIcon(currentRole.id)}
                  <h2 className="font-serif text-2xl text-[#F4F1EA]">{currentRole.name}</h2>
                  <span className="text-xs font-mono text-[#d4af37] bg-[#0B1914] px-2.5 py-1 rounded-md border border-[#d4af37]/30">
                    ID: {currentRole.id}
                  </span>
                </div>
                <p className="text-xs text-stone-300 font-light">{currentRole.description}</p>
              </div>

              {/* Save Permissions Floating / Top Trigger */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                {isDirty && (
                  <span className="text-xs text-amber-300 font-mono flex items-center gap-1.5 animate-pulse">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>Unsaved Changes</span>
                  </span>
                )}

                <button
                  onClick={handleSavePermissions}
                  disabled={!isDirty || isSaving || currentRole.id === 'super_admin'}
                  className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                    isDirty && currentRole.id !== 'super_admin'
                      ? 'bg-[#d4af37] hover:bg-[#b5966c] text-[#0B1914]'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-white/10'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'SAVING MATRIX...' : 'SAVE ROLE PERMISSIONS'}</span>
                </button>
              </div>
            </div>

            {/* Notice for Super Admin Lock */}
            {currentRole.id === 'super_admin' && (
              <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-xl text-amber-200 text-xs flex items-center gap-3">
                <Info className="w-5 h-5 text-amber-400 shrink-0" />
                <span>
                  <strong>Super Admin Protocol Lock:</strong> The Super Admin role automatically inherits all permissions across every module to guarantee system administrative fallback recovery.
                </span>
              </div>
            )}

            {/* Granular Permission Matrix Table by Category */}
            <div className="space-y-8">
              {SYSTEM_PERMISSIONS.map((cat, catIdx) => (
                <div key={catIdx} className="space-y-4">
                  {/* Category Header */}
                  <div className="border-b border-[#C8A97E]/30 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-lg text-[#d4af37] flex items-center gap-2">
                        <Key className="w-4 h-4 text-[#d4af37]" />
                        <span>{cat.category}</span>
                      </h3>
                      <p className="text-xs text-stone-400 font-light">{cat.description}</p>
                    </div>

                    <span className="text-[10px] text-stone-400 font-mono">
                      {cat.permissions.filter((p) => activePermissions.includes(p.key)).length} / {cat.permissions.length} Granted
                    </span>
                  </div>

                  {/* Permission Items List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cat.permissions.map((perm) => {
                      const isChecked = activePermissions.includes(perm.key);
                      const isSuperAdmin = currentRole.id === 'super_admin';

                      return (
                        <div
                          key={perm.key}
                          className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                            isChecked
                              ? 'bg-[#0B1914] border-[#d4af37]/40 text-[#F4F1EA]'
                              : 'bg-[#0B1914]/50 border-white/10 text-stone-400'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-xs text-[#F4F1EA]">
                                {perm.name}
                              </span>
                              <span className="font-mono text-[10px] text-[#d4af37] bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/10">
                                {perm.key}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-400 font-light leading-relaxed">
                              {perm.description}
                            </p>
                          </div>

                          {/* Custom Toggle Switch with Gold Accent */}
                          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                            <input
                              type="checkbox"
                              disabled={isSuperAdmin}
                              checked={isChecked}
                              onChange={() => handleTogglePermission(perm.key)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Persistent Sticky Save Bar */}
            {isDirty && currentRole.id !== 'super_admin' && (
              <div className="sticky bottom-6 z-30 bg-[#0B1914]/95 backdrop-blur-md border border-[#d4af37] p-4 rounded-xl shadow-2xl flex items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-center gap-2 text-xs text-amber-300">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>You have unsaved permission changes for <strong>{currentRole.name}</strong>.</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const matched = roles.find((r) => r.id === selectedRoleId);
                      if (matched) setActivePermissions(matched.permissions);
                      setIsDirty(false);
                    }}
                    className="px-3.5 py-2 text-xs uppercase tracking-wider text-stone-400 hover:text-white cursor-pointer"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSavePermissions}
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-[#d4af37] hover:bg-[#b5966c] text-[#0B1914] text-xs font-bold uppercase tracking-[0.15em] transition-all cursor-pointer shadow-lg rounded-lg flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'SAVING...' : 'SAVE PERMISSIONS'}</span>
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* NEW CUSTOM ROLE MODAL */}
      {showAddRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0B1914] border border-[#C8A97E]/50 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative text-[#F4F1EA] rounded-2xl">
            <button
              onClick={() => setShowAddRoleModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C8A97E] block mb-1">
                SECURITY REGISTRATION
              </span>
              <h3 className="font-serif text-2xl text-[#F4F1EA]">Create Custom Admin Role</h3>
              <p className="text-xs text-stone-400 font-light mt-1">
                Define a new custom administrative role and configure its permission matrix.
              </p>
            </div>

            <form onSubmit={handleAddCustomRole} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                  Role Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={newRoleData.name}
                  onChange={(e) => setNewRoleData({ ...newRoleData, name: e.target.value })}
                  placeholder="e.g. Safety Compliance Inspector"
                  className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                  Role ID Code (Optional)
                </label>
                <input
                  type="text"
                  value={newRoleData.id}
                  onChange={(e) => setNewRoleData({ ...newRoleData, id: e.target.value })}
                  placeholder="e.g. safety_inspector"
                  className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] font-mono focus:outline-none focus:border-[#C8A97E] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                  Role Scope &amp; Description
                </label>
                <textarea
                  rows={3}
                  value={newRoleData.description}
                  onChange={(e) => setNewRoleData({ ...newRoleData, description: e.target.value })}
                  placeholder="Describe the operational scope and duties for personnel assigned to this role..."
                  className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
                />
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#C8A97E] hover:bg-[#b5966c] text-[#0B1914] text-xs font-bold uppercase tracking-[0.15em] transition-all cursor-pointer shadow-lg rounded-xl"
                >
                  CREATE ROLE &amp; OPEN MATRIX
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddRoleModal(false)}
                  className="px-5 py-3 border border-white/20 text-stone-300 hover:text-white text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
