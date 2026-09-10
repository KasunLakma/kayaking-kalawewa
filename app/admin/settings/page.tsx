'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getGlobalSettingsFromFirestore,
  saveGlobalSettingsToFirestore,
  SystemSettings,
} from '@/lib/firebase';
import AdminSubNav from '@/components/AdminSubNav';
import {
  Sliders,
  Clock,
  Users,
  ShieldAlert,
  Phone,
  Mail,
  DollarSign,
  Save,
  CheckCircle2,
  Lock,
  RefreshCw,
  Zap,
  Plus,
  Trash2,
  CreditCard,
  Building,
  AlertCircle,
} from 'lucide-react';

export default function GeneralSettingsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<string>('');

  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // Blackout date input helper
  const [newBlackoutDate, setNewBlackoutDate] = useState<string>('');

  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
      fetchSettings();
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
      fetchSettings();
    } else {
      setPasscodeError('Invalid Security Passcode. Access Denied.');
    }
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await getGlobalSettingsFromFirestore();
      setSettings(data);
    } catch (err) {
      console.error("Failed to load global system settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (!settings) return;

    const emailInput = settings.contactDetails?.notificationEmail || '';
    if (!isValidEmail(emailInput)) {
      setEmailError('Please enter a valid email address for Reservation Desk Email Recipient');
      setSaveSuccess(false);
      return;
    }

    setEmailError('');
    setSaving(true);
    setSaveSuccess(false);
    try {
      await saveGlobalSettingsToFirestore(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error("Failed to save global settings:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddBlackoutDate = () => {
    if (!newBlackoutDate || !settings) return;
    if (!settings.maintenance.blackoutBookingDates.includes(newBlackoutDate)) {
      setSettings({
        ...settings,
        maintenance: {
          ...settings.maintenance,
          blackoutBookingDates: [...settings.maintenance.blackoutBookingDates, newBlackoutDate],
        },
      });
      setNewBlackoutDate('');
    }
  };

  const handleRemoveBlackoutDate = (dateStr: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      maintenance: {
        ...settings.maintenance,
        blackoutBookingDates: settings.maintenance.blackoutBookingDates.filter((d) => d !== dateStr),
      },
    });
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
            <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider">General System Settings</p>
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

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-[#0B1914] text-[#F4F1EA] flex flex-col font-sans">
        <AdminSubNav />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#C8A97E] mx-auto" />
            <p className="text-xs uppercase tracking-wider text-stone-400">Loading System Configurations...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[#C8A97E]">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-normal text-[#F4F1EA] tracking-wide">
                General System Settings
              </h1>
              <p className="text-xs text-stone-400 mt-0.5">
                Global Operating Configurations, Slot Capacities, Alert Banners &amp; Payment Rules
              </p>
            </div>
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="px-5 py-2.5 bg-[#C8A97E] hover:bg-[#d4af37] disabled:opacity-50 text-[#0B1914] font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Saving Config...' : 'Save Global Settings'}</span>
          </button>
        </div>

        {/* Save Success Notification Toast */}
        {saveSuccess && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-xl animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>System configurations saved successfully to Firestore (system_settings/global).</span>
            </div>
            <button onClick={() => setSaveSuccess(false)} className="text-emerald-400 hover:text-white">
              &times;
            </button>
          </div>
        )}

        {/* Email Error Validation Toast */}
        {emailError && (
          <div className="p-4 bg-red-950/80 border border-red-500/50 rounded-2xl text-red-300 text-xs font-semibold flex items-center justify-between shadow-xl animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{emailError}</span>
            </div>
            <button onClick={() => setEmailError('')} className="text-red-400 hover:text-white">
              &times;
            </button>
          </div>
        )}

        {/* Settings Form */}
        <form onSubmit={handleSaveSettings} className="space-y-8">
          {/* Section 1: Resort Operating Hours */}
          <div className="bg-[#13241E]/90 border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Clock className="w-5 h-5 text-[#C8A97E]" />
              <h2 className="font-serif text-xl font-normal text-white">1. Resort Operating Hours</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">First Water Launch Opening Time</label>
                <input
                  type="text"
                  value={settings.operatingHours.openingTime}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      operatingHours: { ...settings.operatingHours, openingTime: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#0B1914] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#C8A97E]"
                  placeholder="e.g. 05:30 AM"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">Resort Evening Closing Time</label>
                <input
                  type="text"
                  value={settings.operatingHours.closingTime}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      operatingHours: { ...settings.operatingHours, closingTime: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#0B1914] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#C8A97E]"
                  placeholder="e.g. 06:30 PM"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">Last Launch Cut-Off Hour</label>
                <input
                  type="text"
                  value={settings.operatingHours.lastLaunchCutoff}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      operatingHours: { ...settings.operatingHours, lastLaunchCutoff: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#0B1914] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#C8A97E]"
                  placeholder="e.g. 05:00 PM"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Default Slot Capacities */}
          <div className="bg-[#13241E]/90 border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Users className="w-5 h-5 text-[#C8A97E]" />
              <h2 className="font-serif text-xl font-normal text-white">2. Default Expedition Slot Capacities</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">Morning Max Guests per Slot</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={settings.slotCapacities.morningMaxGuests}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      slotCapacities: { ...settings.slotCapacities, morningMaxGuests: Number(e.target.value) },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#0B1914] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#C8A97E]"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">Evening Max Guests per Slot</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={settings.slotCapacities.eveningMaxGuests}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      slotCapacities: { ...settings.slotCapacities, eveningMaxGuests: Number(e.target.value) },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#0B1914] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#C8A97E]"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">Max Kayak Units Dispatched / Slot</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={settings.slotCapacities.maxKayaksPerSlot}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      slotCapacities: { ...settings.slotCapacities, maxKayaksPerSlot: Number(e.target.value) },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#0B1914] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#C8A97E]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Maintenance Mode & Alert Banner */}
          <div className="bg-[#13241E]/90 border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h2 className="font-serif text-xl font-normal text-white">3. Maintenance Mode &amp; Weather Advisories</h2>
            </div>

            <div className="space-y-4 text-xs">
              {/* Alert Toggle */}
              <div className="flex items-center justify-between p-4 bg-[#0B1914] border border-white/10 rounded-xl">
                <div>
                  <span className="font-semibold text-white block">Enable Public Weather / Maintenance Alert Banner</span>
                  <span className="text-stone-400 text-[11px]">Displays a high-visibility warning banner across the public booking portal</span>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenance.alertBannerEnabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maintenance: { ...settings.maintenance, alertBannerEnabled: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* Alert Message Text */}
              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">Live Weather / Spillway Advisory Message Text</label>
                <textarea
                  rows={2}
                  value={settings.maintenance.alertBannerMessage}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maintenance: { ...settings.maintenance, alertBannerMessage: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#0B1914] border border-white/15 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-[#C8A97E]"
                  placeholder="e.g. High spillway discharge active. Modified shoreline kayak routes in effect."
                />
              </div>

              {/* Blackout Dates */}
              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">Blackout Booking Dates (Full Maintenance Closure)</label>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="date"
                    value={newBlackoutDate}
                    onChange={(e) => setNewBlackoutDate(e.target.value)}
                    className="px-3 py-2 bg-[#0B1914] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8A97E]"
                  />
                  <button
                    type="button"
                    onClick={handleAddBlackoutDate}
                    className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Blackout Date</span>
                  </button>
                </div>

                {settings.maintenance.blackoutBookingDates.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {settings.maintenance.blackoutBookingDates.map((dateStr) => (
                      <span
                        key={dateStr}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/60 border border-red-500/40 text-red-300 rounded-lg text-xs"
                      >
                        <span>{dateStr}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBlackoutDate(dateStr)}
                          className="text-red-400 hover:text-white"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-stone-500 italic text-[11px]">No blackout dates configured.</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Resort Contact & Emergency Support Details */}
          <div className="bg-[#13241E]/90 border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Building className="w-5 h-5 text-[#C8A97E]" />
              <h2 className="font-serif text-xl font-normal text-white">4. Resort Contact &amp; Support Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">Official Resort Phone Number</label>
                <input
                  type="text"
                  value={settings.contactDetails.resortPhone}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contactDetails: { ...settings.contactDetails, resortPhone: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#0B1914] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#C8A97E]"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">Emergency Naturalist Line</label>
                <input
                  type="text"
                  value={settings.contactDetails.emergencyDeskPhone}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contactDetails: { ...settings.contactDetails, emergencyDeskPhone: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#0B1914] border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#C8A97E]"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">Reservation Desk Email Recipient</label>
                <input
                  type="email"
                  value={settings.contactDetails.notificationEmail}
                  onChange={(e) => {
                    const newEmail = e.target.value;
                    setSettings({
                      ...settings,
                      contactDetails: { ...settings.contactDetails, notificationEmail: newEmail },
                    });
                    if (isValidEmail(newEmail)) {
                      setEmailError('');
                    }
                  }}
                  className={`w-full px-3.5 py-2.5 bg-[#0B1914] border ${
                    emailError ? 'border-red-500' : 'border-white/15'
                  } rounded-xl text-white focus:outline-none focus:border-[#C8A97E]`}
                />
                {emailError && (
                  <p className="text-[11px] text-red-400 mt-1.5 font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 5: Base Currency & Payment Gateway Rules */}
          <div className="bg-[#13241E]/90 border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <CreditCard className="w-5 h-5 text-[#C8A97E]" />
              <h2 className="font-serif text-xl font-normal text-white">5. Currency &amp; Payment Gateway Rules</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">Base System Currency Code</label>
                <input
                  type="text"
                  value={settings.currencyAndPayments.baseCurrency}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      currencyAndPayments: { ...settings.currencyAndPayments, baseCurrency: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#0B1914] border border-white/15 rounded-xl text-white font-mono focus:outline-none focus:border-[#C8A97E]"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">Default: LKR (Sri Lankan Rupee)</span>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">Active Payment Gateways</label>
                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.currencyAndPayments.enabledPaymentMethods.includes('COD')}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...settings.currencyAndPayments.enabledPaymentMethods, 'COD' as const]
                          : settings.currencyAndPayments.enabledPaymentMethods.filter((m) => m !== 'COD');
                        setSettings({
                          ...settings,
                          currencyAndPayments: { ...settings.currencyAndPayments, enabledPaymentMethods: next },
                        });
                      }}
                      className="rounded border-white/20 bg-[#0B1914] text-[#C8A97E] focus:ring-0"
                    />
                    <span className="text-white font-medium">Cash / Pay on Arrival (COD)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.currencyAndPayments.enabledPaymentMethods.includes('BANK_TRANSFER')}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...settings.currencyAndPayments.enabledPaymentMethods, 'BANK_TRANSFER' as const]
                          : settings.currencyAndPayments.enabledPaymentMethods.filter((m) => m !== 'BANK_TRANSFER');
                        setSettings({
                          ...settings,
                          currencyAndPayments: { ...settings.currencyAndPayments, enabledPaymentMethods: next },
                        });
                      }}
                      className="rounded border-white/20 bg-[#0B1914] text-[#C8A97E] focus:ring-0"
                    />
                    <span className="text-white font-medium">Direct Bank Wire / Online Slip Transfer</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Save Bar */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-[#C8A97E] hover:bg-[#d4af37] disabled:opacity-50 text-[#0B1914] font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xl"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? 'Saving Changes...' : 'Save Global Configurations'}</span>
            </button>
          </div>
        </form>
    </div>
  );
}
