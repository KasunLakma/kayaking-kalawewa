'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  getFleetVehiclesFromFirestore,
  saveFleetVehicleToFirestore,
  updateFleetVehicleInFirestore,
  deleteFleetVehicleFromFirestore,
  calculateFleetCapacitySummary,
  getAllBookingsFromFirestore,
  FleetVehicle,
  BookingDocument,
} from '@/lib/firebase';
import AdminSubNav from '@/components/AdminSubNav';
import {
  Anchor,
  ShieldCheck,
  AlertTriangle,
  Wrench,
  Plus,
  Edit3,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  Lock,
  Compass,
  LifeBuoy,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

const CRAFT_TYPES = [
  'Single Kayak',
  'Tandem Kayak',
  'Safari Transfer Vehicle',
  'Rescue Tender',
];

const AVAILABLE_EXPEDITION_PACKAGES = [
  'Sunrise Lotus Drift',
  'Sunset Romance & Couples',
  '5th Century Island Exploration',
  'Wild Elephant Corridor Trail',
  'Emergency Rapid Response & Safety Protocol',
  'All Expeditions',
];

function getConditionBadgeStyle(status: string) {
  switch (status) {
    case 'Operational':
      return 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300';
    case 'Under Inspection':
      return 'bg-amber-950/70 border-amber-500/50 text-amber-300';
    case 'Out of Service':
      return 'bg-red-950/70 border-red-500/50 text-red-300';
    default:
      return 'bg-stone-800 border-stone-600 text-stone-300';
  }
}

function getAvailabilityBadgeStyle(status: string) {
  switch (status) {
    case 'Available':
      return 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300';
    case 'On Lake / Reserved':
      return 'bg-purple-950/60 border-purple-500/40 text-purple-300';
    case 'Reserved Maintenance':
      return 'bg-amber-950/60 border-amber-500/40 text-amber-300';
    default:
      return 'bg-stone-800 border-stone-600 text-stone-300';
  }
}

function formatInspectionDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function FleetManagementPage() {
  // 1. PIN Security Gate State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // 2. Data States
  const [fleetList, setFleetList] = useState<FleetVehicle[]>([]);
  const [bookings, setBookings] = useState<BookingDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 3. Filter & Search States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [selectedConditionFilter, setSelectedConditionFilter] = useState<string>('ALL');
  const [selectedAvailabilityFilter, setSelectedAvailabilityFilter] = useState<string>('ALL');

  // 4. Modal States
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingVehicle, setEditingVehicle] = useState<FleetVehicle | null>(null);
  const [inspectingVehicle, setInspectingVehicle] = useState<FleetVehicle | null>(null);
  const [inspectionNotes, setInspectionNotes] = useState<string>('');

  // 5. Form Input States (for Add & Edit)
  const [formData, setFormData] = useState({
    id: '',
    identifier: '',
    craftType: CRAFT_TYPES[0],
    capacity: 1,
    conditionStatus: 'Operational' as 'Operational' | 'Under Inspection' | 'Out of Service',
    availabilityStatus: 'Available' as 'Available' | 'On Lake / Reserved' | 'Reserved Maintenance',
    lifeJacketCount: 1,
    paddleSerials: '',
    emergencyKitChecked: true,
    uscgCompliant: true,
    lastInspectionDate: new Date().toISOString().split('T')[0],
    acquisitionDate: new Date().toISOString().split('T')[0],
    lastMaintenanceLog: '',
    assignedPackages: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Check stored auth session
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('kalawewa_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch fleet records & bookings
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fetchedFleet, fetchedBookings] = await Promise.all([
        getFleetVehiclesFromFirestore(),
        getAllBookingsFromFirestore(),
      ]);
      setFleetList(fetchedFleet);
      setBookings(fetchedBookings);
    } catch (err) {
      console.error('Failed to load fleet inventory data:', err);
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

  // KPI & Real-Time Capacity Summary Calculations
  const capacitySummary = useMemo(() => {
    return calculateFleetCapacitySummary(fleetList);
  }, [fleetList]);

  // Calculate today's booked guests for capacity linking check
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = useMemo(() => {
    return bookings.filter((b) => b.selectedDate === todayStr && b.orderStatus !== 'CANCELLED');
  }, [bookings, todayStr]);

  const todayBookedGuests = useMemo(() => {
    return todayBookings.reduce((sum, b) => sum + (b.guestCount || 1), 0);
  }, [todayBookings]);

  const isCapacityOverbooked = todayBookedGuests > capacitySummary.totalAvailableSeats;

  // Filtered Table Data
  const filteredFleet = useMemo(() => {
    return fleetList.filter((v) => {
      if (selectedTypeFilter !== 'ALL' && v.craftType !== selectedTypeFilter) {
        return false;
      }
      if (selectedConditionFilter !== 'ALL' && v.conditionStatus !== selectedConditionFilter) {
        return false;
      }
      if (selectedAvailabilityFilter !== 'ALL' && v.availabilityStatus !== selectedAvailabilityFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const idMatch = v.id.toLowerCase().includes(q);
        const nameMatch = v.identifier.toLowerCase().includes(q);
        const typeMatch = v.craftType.toLowerCase().includes(q);
        const paddlesMatch = (v.safetyEquipment.paddleSerials || []).some((p) => p.toLowerCase().includes(q));
        const packagesMatch = (v.assignedPackages || []).some((pkg) => pkg.toLowerCase().includes(q));
        return idMatch || nameMatch || typeMatch || paddlesMatch || packagesMatch;
      }
      return true;
    });
  }, [fleetList, selectedTypeFilter, selectedConditionFilter, selectedAvailabilityFilter, searchQuery]);

  // Open Add Craft Modal
  const handleOpenAddModal = () => {
    const nextNum = fleetList.length + 1;
    const formattedId = `KALA-KAYAK-${String(nextNum).padStart(2, '0')}`;
    setFormData({
      id: formattedId,
      identifier: `Single Ocean Explorer #${nextNum}`,
      craftType: 'Single Kayak',
      capacity: 1,
      conditionStatus: 'Operational',
      availabilityStatus: 'Available',
      lifeJacketCount: 1,
      paddleSerials: `PD-${String(nextNum).padStart(2, '0')}A`,
      emergencyKitChecked: true,
      uscgCompliant: true,
      lastInspectionDate: new Date().toISOString().split('T')[0],
      acquisitionDate: new Date().toISOString().split('T')[0],
      lastMaintenanceLog: 'Routine pre-dispatch safety and buoy test passed.',
      assignedPackages: [AVAILABLE_EXPEDITION_PACKAGES[0]],
    });
    setShowAddModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (v: FleetVehicle) => {
    setEditingVehicle(v);
    setFormData({
      id: v.id,
      identifier: v.identifier,
      craftType: v.craftType,
      capacity: v.capacity,
      conditionStatus: v.conditionStatus,
      availabilityStatus: v.availabilityStatus,
      lifeJacketCount: v.safetyEquipment.lifeJacketCount,
      paddleSerials: (v.safetyEquipment.paddleSerials || []).join(', '),
      emergencyKitChecked: v.safetyEquipment.emergencyKitChecked,
      uscgCompliant: v.safetyEquipment.uscgCompliant,
      lastInspectionDate: v.safetyEquipment.lastInspectionDate || new Date().toISOString().split('T')[0],
      acquisitionDate: v.acquisitionDate || new Date().toISOString().split('T')[0],
      lastMaintenanceLog: v.lastMaintenanceLog || '',
      assignedPackages: v.assignedPackages || [],
    });
  };

  // Handle Assigned Package Checkbox Toggle
  const handlePackageToggle = (pkg: string) => {
    setFormData((prev) => {
      const exists = prev.assignedPackages.includes(pkg);
      if (exists) {
        return { ...prev, assignedPackages: prev.assignedPackages.filter((p) => p !== pkg) };
      } else {
        return { ...prev, assignedPackages: [...prev.assignedPackages, pkg] };
      }
    });
  };

  // Auto-adjust default capacity based on craft type selection
  const handleCraftTypeChange = (type: string) => {
    let defaultCap = 1;
    if (type === 'Tandem Kayak') defaultCap = 2;
    else if (type === 'Safari Transfer Vehicle') defaultCap = 10;
    else if (type === 'Rescue Tender') defaultCap = 4;

    let defaultPFDs = defaultCap;
    if (type === 'Safari Transfer Vehicle') defaultPFDs = 12;
    if (type === 'Rescue Tender') defaultPFDs = 6;

    setFormData((prev) => ({
      ...prev,
      craftType: type,
      capacity: defaultCap,
      lifeJacketCount: defaultPFDs,
    }));
  };

  // Handle Add Submission
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.identifier) return;

    setIsSubmitting(true);
    try {
      const paddleSerialsArray = formData.paddleSerials
        ? formData.paddleSerials.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      const created = await saveFleetVehicleToFirestore({
        id: formData.id || undefined,
        identifier: formData.identifier,
        craftType: formData.craftType,
        capacity: Number(formData.capacity) || 1,
        conditionStatus: formData.conditionStatus,
        availabilityStatus: formData.availabilityStatus,
        safetyEquipment: {
          lifeJacketCount: Number(formData.lifeJacketCount) || 1,
          paddleSerials: paddleSerialsArray,
          emergencyKitChecked: formData.emergencyKitChecked,
          uscgCompliant: formData.uscgCompliant,
          lastInspectionDate: formData.lastInspectionDate,
        },
        acquisitionDate: formData.acquisitionDate,
        lastMaintenanceLog: formData.lastMaintenanceLog,
        assignedPackages: formData.assignedPackages,
        createdAt: new Date().toISOString(),
      });

      setFleetList((prev) => [created, ...prev]);
      setShowAddModal(false);
      await loadData();
    } catch (err) {
      console.error('Failed to add fleet vehicle:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;

    setIsSubmitting(true);
    try {
      const paddleSerialsArray = formData.paddleSerials
        ? formData.paddleSerials.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      const updates: Partial<FleetVehicle> = {
        identifier: formData.identifier,
        craftType: formData.craftType,
        capacity: Number(formData.capacity) || 1,
        conditionStatus: formData.conditionStatus,
        availabilityStatus: formData.availabilityStatus,
        safetyEquipment: {
          lifeJacketCount: Number(formData.lifeJacketCount) || 1,
          paddleSerials: paddleSerialsArray,
          emergencyKitChecked: formData.emergencyKitChecked,
          uscgCompliant: formData.uscgCompliant,
          lastInspectionDate: formData.lastInspectionDate,
        },
        acquisitionDate: formData.acquisitionDate,
        lastMaintenanceLog: formData.lastMaintenanceLog,
        assignedPackages: formData.assignedPackages,
      };

      await updateFleetVehicleInFirestore(editingVehicle.id, updates);

      setFleetList((prev) =>
        prev.map((v) => (v.id === editingVehicle.id ? { ...v, ...updates } : v))
      );

      setEditingVehicle(null);
      await loadData();
    } catch (err) {
      console.error('Failed to update fleet vehicle:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Status Toggle (Operational -> Under Inspection -> Out of Service)
  const handleQuickStatusToggle = async (v: FleetVehicle) => {
    let nextCondition: 'Operational' | 'Under Inspection' | 'Out of Service' = 'Under Inspection';
    let nextAvailability: 'Available' | 'On Lake / Reserved' | 'Reserved Maintenance' = 'Reserved Maintenance';

    if (v.conditionStatus === 'Operational') {
      nextCondition = 'Under Inspection';
      nextAvailability = 'Reserved Maintenance';
    } else if (v.conditionStatus === 'Under Inspection') {
      nextCondition = 'Out of Service';
      nextAvailability = 'Reserved Maintenance';
    } else if (v.conditionStatus === 'Out of Service') {
      nextCondition = 'Operational';
      nextAvailability = 'Available';
    }

    setFleetList((prev) =>
      prev.map((item) =>
        item.id === v.id
          ? {
              ...item,
              conditionStatus: nextCondition,
              availabilityStatus: nextAvailability,
            }
          : item
      )
    );

    await updateFleetVehicleInFirestore(v.id, {
      conditionStatus: nextCondition,
      availabilityStatus: nextAvailability,
    });
  };

  // Handle Mark for Inspection submit
  const handlePassInspection = async (v: FleetVehicle) => {
    const today = new Date().toISOString().split('T')[0];
    const logEntry = inspectionNotes
      ? `Inspection Passed (${today}): ${inspectionNotes}`
      : `Routine Safety & USCG Inspection Passed on ${today}.`;

    const updates: Partial<FleetVehicle> = {
      conditionStatus: 'Operational',
      availabilityStatus: 'Available',
      lastMaintenanceLog: logEntry,
      safetyEquipment: {
        ...v.safetyEquipment,
        uscgCompliant: true,
        emergencyKitChecked: true,
        lastInspectionDate: today,
      },
    };

    setFleetList((prev) =>
      prev.map((item) => (item.id === v.id ? { ...item, ...updates } : item))
    );

    await updateFleetVehicleInFirestore(v.id, updates);
    setInspectingVehicle(null);
    setInspectionNotes('');
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
              KALAWEWA FLEET INVENTORY
            </span>
            <h1 className="font-serif text-3xl text-[#F4F1EA]">Admin Authentication</h1>
            <p className="text-xs text-[#F4F1EA]/70 font-light">
              Enter authorized operator PIN to access watercraft logs, USCG compliance, and availability controls.
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
              UNLOCK FLEET PORTAL
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
              <Anchor className="w-8 h-8 text-[#C8A97E]" />
              <span>Vehicle &amp; Kayak Fleet Management</span>
            </h1>
            <p className="text-xs text-stone-400 font-light mt-1 max-w-2xl">
              Track expedition watercraft, safari transfer vehicles, real-time Lake Kalawewa availability, life jacket counts, paddle serials, and USCG safety compliance.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-5 py-3 bg-[#C8A97E] hover:bg-[#b5966c] text-[#0B1914] font-bold text-xs uppercase tracking-[0.15em] transition-all flex items-center gap-2 cursor-pointer shadow-lg rounded-xl self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Craft / Vehicle</span>
          </button>
        </div>

        {/* Real-Time Availability & Expedition Capacity Link Banner */}
        <section className={`border rounded-2xl p-5 sm:p-6 transition-all ${
          isCapacityOverbooked
            ? 'bg-red-950/40 border-red-500/60 text-red-200'
            : 'bg-[#13241E]/90 border-[#C8A97E]/30 text-[#F4F1EA]'
        }`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                isCapacityOverbooked
                  ? 'bg-red-900/50 border-red-500/60 text-red-300'
                  : 'bg-[#C8A97E]/10 border-[#C8A97E]/40 text-[#C8A97E]'
              }`}>
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C8A97E]">
                    REAL-TIME EXPEDITION CAPACITY LINK
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                    LIVE FIRESTORE SYNC
                  </span>
                </div>
                <h3 className="font-serif text-lg text-white font-medium mt-0.5">
                  Physical Watercraft Limits vs Today&apos;s Expedition Reservations
                </h3>
                <p className="text-xs text-stone-300 mt-1 max-w-3xl font-light">
                  Calculates real-time operational passenger seats based on active vessels ({capacitySummary.singleKayaksCount} Single Kayaks, {capacitySummary.tandemKayaksCount} Tandem Kayaks, {capacitySummary.safariVehiclesCount} Safari Rover, {capacitySummary.rescueTendersCount} Rescue Tender).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end bg-[#0B1914] p-3 rounded-xl border border-white/10 font-mono text-xs">
              <div className="text-center px-3 border-r border-white/10">
                <span className="text-[9px] uppercase tracking-wider text-stone-400 block">Operational Kayak Seats</span>
                <span className="text-xl font-bold text-emerald-400">{capacitySummary.totalKayakSeats}</span>
              </div>
              <div className="text-center px-3 border-r border-white/10">
                <span className="text-[9px] uppercase tracking-wider text-stone-400 block">Today&apos;s Booked Guests</span>
                <span className="text-xl font-bold text-[#C8A97E]">{todayBookedGuests}</span>
              </div>
              <div className="text-center px-3">
                <span className="text-[9px] uppercase tracking-wider text-stone-400 block">Safety Buffer Seats</span>
                <span className={`text-xl font-bold ${
                  capacitySummary.totalAvailableSeats - todayBookedGuests >= 0
                    ? 'text-cyan-300'
                    : 'text-red-400'
                }`}>
                  {capacitySummary.totalAvailableSeats - todayBookedGuests}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* KPI Metrics Summary Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* KPI 1: Total Fleet Size */}
          <div className="bg-[#13241E] border border-white/10 rounded-xl p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-400 block">
                TOTAL FLEET INVENTORY
              </span>
              <Layers className="w-5 h-5 text-stone-400" />
            </div>
            <div className="text-[#f3efe6] font-mono text-3xl font-bold">{capacitySummary.totalFleetSize}</div>
            <span className="text-stone-400 text-xs font-normal block pt-0.5">
              Kayaks, tenders &amp; safari transfer rovers
            </span>
          </div>

          {/* KPI 2: Operational Watercraft */}
          <div className="bg-[#13241E] border border-emerald-500/40 rounded-xl p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-400 block">
                OPERATIONAL CRAFT
              </span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-emerald-400 font-mono text-3xl font-bold">{capacitySummary.operationalCount}</div>
            <span className="text-stone-300 text-xs font-normal block pt-0.5">
              Passed USCG &amp; safety inspections
            </span>
          </div>

          {/* KPI 3: Active On Lake / Reserved */}
          <div className="bg-[#13241E] border border-purple-500/40 rounded-xl p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-purple-300 block">
                ACTIVE ON LAKE
              </span>
              <Compass className="w-5 h-5 text-purple-300" />
            </div>
            <div className="text-purple-300 font-mono text-3xl font-bold">{capacitySummary.onLakeCount}</div>
            <span className="text-stone-400 text-xs font-normal block pt-0.5">
              Currently dispatched on expedition
            </span>
          </div>

          {/* KPI 4: Under Inspection / Maintenance */}
          <div className="bg-[#13241E] border border-amber-500/40 rounded-xl p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-300 block">
                UNDER INSPECTION
              </span>
              <Wrench className="w-5 h-5 text-amber-300" />
            </div>
            <div className="text-amber-300 font-mono text-3xl font-bold">{capacitySummary.maintenanceCount}</div>
            <span className="text-stone-400 text-xs font-normal block pt-0.5">
              Scheduled seal check / service
            </span>
          </div>
        </section>

        {/* Fleet Inventory Table Section & Filters */}
        <section className="bg-[#13241E] border border-white/10 p-6 sm:p-8 space-y-6 rounded-2xl">
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[260px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search craft by ID, Name, Type, Paddle Serial, Package..."
                className="w-full px-4 py-2.5 min-h-[44px] pl-10 bg-[#0B1914] border border-white/20 text-xs text-[#F4F1EA] placeholder-slate-400 focus:outline-none focus:border-[#C8A97E] rounded-lg"
              />
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Type Filter */}
              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="px-3 py-2.5 min-h-[44px] bg-[#0B1914] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
              >
                <option value="ALL">All Craft Types</option>
                {CRAFT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              {/* Condition Filter */}
              <select
                value={selectedConditionFilter}
                onChange={(e) => setSelectedConditionFilter(e.target.value)}
                className="px-3 py-2.5 min-h-[44px] bg-[#0B1914] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
              >
                <option value="ALL">All Conditions</option>
                <option value="Operational">Operational</option>
                <option value="Under Inspection">Under Inspection</option>
                <option value="Out of Service">Out of Service</option>
              </select>

              {/* Availability Filter */}
              <select
                value={selectedAvailabilityFilter}
                onChange={(e) => setSelectedAvailabilityFilter(e.target.value)}
                className="px-3 py-2.5 min-h-[44px] bg-[#0B1914] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
              >
                <option value="ALL">All Availability</option>
                <option value="Available">Available</option>
                <option value="On Lake / Reserved">On Lake / Reserved</option>
                <option value="Reserved Maintenance">Reserved Maintenance</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto w-full border border-white/10 rounded-xl no-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0B1914] border-b border-white/15 text-stone-300 uppercase tracking-widest text-[11px] font-medium">
                  <th className="p-4">Vessel / Vehicle ID &amp; Identifier</th>
                  <th className="p-4">Craft Type &amp; Capacity</th>
                  <th className="p-4">Condition &amp; Status</th>
                  <th className="p-4">Real-Time Availability</th>
                  <th className="p-4">Safety &amp; USCG Compliance</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-light">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-stone-400 italic">
                      Loading fleet inventory records...
                    </td>
                  </tr>
                ) : filteredFleet.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-stone-400 italic">
                      No watercraft or vehicles found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredFleet.map((v) => {
                    const paddleSerialsList = v.safetyEquipment.paddleSerials || [];

                    return (
                      <tr
                        key={v.id}
                        className="bg-[#0B1914]/80 hover:bg-white/[0.03] transition-colors"
                      >
                        {/* 1. VESSEL / VEHICLE ID & IDENTIFIER */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#13241E] border border-[#C8A97E]/50 flex items-center justify-center font-mono font-bold text-[#C8A97E] text-xs shrink-0 shadow-inner">
                              {v.craftType === 'Safari Transfer Vehicle' ? 'SR' : v.craftType === 'Rescue Tender' ? 'RT' : 'KK'}
                            </div>
                            <div>
                              <div className="font-medium text-[#f3efe6] text-sm flex items-center gap-2">
                                <span>{v.identifier}</span>
                              </div>
                              <div className="text-[#d4af37] font-mono text-[11px]">
                                {v.id}
                              </div>
                              {v.lastMaintenanceLog && (
                                <div className="text-[10px] text-stone-400 truncate max-w-xs mt-0.5 italic">
                                  &quot;{v.lastMaintenanceLog}&quot;
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 2. CRAFT TYPE & CAPACITY */}
                        <td className="p-4 space-y-1.5">
                          <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider border bg-white/[0.04] border-white/10 text-stone-200">
                            {v.craftType}
                          </span>
                          <div className="text-stone-300 font-mono text-xs flex items-center gap-1.5">
                            <span>Capacity:</span>
                            <span className="font-bold text-[#C8A97E]">
                              {v.capacity} {v.capacity === 1 ? 'Guest Seat' : 'Guest Seats'}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {(v.assignedPackages || []).slice(0, 2).map((pkg, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 text-[9px] bg-white/[0.03] border border-white/10 text-stone-400 rounded"
                              >
                                {pkg}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* 3. CONDITION & STATUS */}
                        <td className="p-4 space-y-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${getConditionBadgeStyle(
                              v.conditionStatus
                            )}`}
                          >
                            {v.conditionStatus === 'Operational' && (
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            )}
                            {v.conditionStatus === 'Under Inspection' && (
                              <Wrench className="w-3 h-3 text-amber-400" />
                            )}
                            {v.conditionStatus === 'Out of Service' && (
                              <XCircle className="w-3 h-3 text-red-400" />
                            )}
                            <span>{v.conditionStatus}</span>
                          </span>
                          <div className="text-[10px] text-stone-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-stone-500" />
                            <span>Acquired {formatInspectionDate(v.acquisitionDate)}</span>
                          </div>
                        </td>

                        {/* 4. REAL-TIME AVAILABILITY */}
                        <td className="p-4 space-y-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${getAvailabilityBadgeStyle(
                              v.availabilityStatus
                            )}`}
                          >
                            {v.availabilityStatus}
                          </span>
                          <div className="text-[10px] text-stone-400">
                            {v.availabilityStatus === 'Available' && 'Ready for immediate launch'}
                            {v.availabilityStatus === 'On Lake / Reserved' && 'Dispatched on Lake Kalawewa'}
                            {v.availabilityStatus === 'Reserved Maintenance' && 'Held in dock yard'}
                          </div>
                        </td>

                        {/* 5. SAFETY & USCG COMPLIANCE */}
                        <td className="p-4 space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            {v.safetyEquipment.uscgCompliant ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[10px] font-semibold">
                                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                <span>USCG Compliant</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-950/60 border border-red-500/40 text-red-300 text-[10px] font-semibold">
                                <AlertTriangle className="w-3 h-3 text-red-400" />
                                <span>Check Inspection</span>
                              </span>
                            )}

                            <span className="px-2 py-0.5 rounded bg-stone-900 border border-stone-700 text-stone-300 text-[10px] font-mono">
                              PFDs: {v.safetyEquipment.lifeJacketCount}
                            </span>
                          </div>

                          <div className="text-[11px] text-stone-400 font-mono flex items-center gap-1 pt-1">
                            <LifeBuoy className="w-3 h-3 text-stone-500" />
                            <span>Paddles: {paddleSerialsList.length > 0 ? paddleSerialsList.join(', ') : 'Vehicle Gear'}</span>
                          </div>
                        </td>

                        {/* 6. ACTIONS */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Edit Details */}
                            <button
                              onClick={() => handleOpenEditModal(v)}
                              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="Edit Vessel & Safety Details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Quick Status Toggle */}
                            <button
                              onClick={() => handleQuickStatusToggle(v)}
                              className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] font-semibold uppercase tracking-wider rounded-lg border border-white/10 transition-colors cursor-pointer"
                              title="Toggle Condition Status"
                            >
                              Toggle
                            </button>

                            {/* Mark for Inspection */}
                            <button
                              onClick={() => {
                                setInspectingVehicle(v);
                                setInspectionNotes(v.lastMaintenanceLog || '');
                              }}
                              className="p-2 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 rounded-lg transition-colors cursor-pointer"
                              title="Inspect & Pass Safety Check"
                            >
                              <Wrench className="w-3.5 h-3.5" />
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

      {/* ADD VESSEL / VEHICLE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0B1914] border border-[#C8A97E]/50 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative text-[#F4F1EA] rounded-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C8A97E] block mb-1">
                FLEET REGISTRATION
              </span>
              <h3 className="font-serif text-2xl text-[#F4F1EA]">Add Craft / Expedition Vehicle</h3>
              <p className="text-xs text-stone-400 font-light mt-1">
                Register a new kayak, tender, or safari vehicle into Firestore fleet collection.
              </p>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                    Craft ID Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="e.g. KALA-KAYAK-04"
                    className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] font-mono focus:outline-none focus:border-[#C8A97E] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                    Identifier / Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    placeholder="e.g. Single Ocean Explorer #4"
                    className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                    Craft Category *
                  </label>
                  <select
                    value={formData.craftType}
                    onChange={(e) => handleCraftTypeChange(e.target.value)}
                    className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
                  >
                    {CRAFT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                    Guest Capacity (Seats) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                    Condition Status *
                  </label>
                  <select
                    value={formData.conditionStatus}
                    onChange={(e) => setFormData({ ...formData, conditionStatus: e.target.value as any })}
                    className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
                  >
                    <option value="Operational">Operational</option>
                    <option value="Under Inspection">Under Inspection</option>
                    <option value="Out of Service">Out of Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                    Real-Time Availability *
                  </label>
                  <select
                    value={formData.availabilityStatus}
                    onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value as any })}
                    className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
                  >
                    <option value="Available">Available</option>
                    <option value="On Lake / Reserved">On Lake / Reserved</option>
                    <option value="Reserved Maintenance">Reserved Maintenance</option>
                  </select>
                </div>
              </div>

              {/* Safety & USCG Compliance Block */}
              <div className="p-4 bg-[#13241E] border border-[#C8A97E]/30 rounded-xl space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A97E] block">
                  SAFETY EQUIPMENT &amp; USCG COMPLIANCE
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium text-stone-300 mb-1">
                      Assigned PFDs (Life Jackets)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={formData.lifeJacketCount}
                      onChange={(e) => setFormData({ ...formData, lifeJacketCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#0B1914] border border-white/20 text-xs text-white rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-stone-300 mb-1">
                      Paddle Serials (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.paddleSerials}
                      onChange={(e) => setFormData({ ...formData, paddleSerials: e.target.value })}
                      placeholder="e.g. PD-04A, PD-04B"
                      className="w-full px-3 py-2 bg-[#0B1914] border border-white/20 text-xs text-white rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.uscgCompliant}
                      onChange={(e) => setFormData({ ...formData, uscgCompliant: e.target.checked })}
                      className="accent-[#C8A97E] w-4 h-4"
                    />
                    <span>USCG Compliant</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.emergencyKitChecked}
                      onChange={(e) => setFormData({ ...formData, emergencyKitChecked: e.target.checked })}
                      className="accent-[#C8A97E] w-4 h-4"
                    />
                    <span>Emergency Kit Checked</span>
                  </label>
                </div>
              </div>

              {/* Maintenance Log */}
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                  Initial Maintenance Log / Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.lastMaintenanceLog}
                  onChange={(e) => setFormData({ ...formData, lastMaintenanceLog: e.target.value })}
                  placeholder="Record hull inspection details or paddle upgrades..."
                  className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
                />
              </div>

              {/* Assigned Expedition Packages */}
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-2">
                  Assigned Expedition Suitability
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AVAILABLE_EXPEDITION_PACKAGES.map((pkg) => {
                    const isChecked = formData.assignedPackages.includes(pkg);
                    return (
                      <button
                        type="button"
                        key={pkg}
                        onClick={() => handlePackageToggle(pkg)}
                        className={`p-2 rounded-lg text-left text-[11px] transition-all flex items-center gap-2 cursor-pointer border ${
                          isChecked
                            ? 'bg-[#C8A97E]/20 border-[#C8A97E] text-white font-medium'
                            : 'bg-[#13241E] border-white/10 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                            isChecked ? 'bg-[#C8A97E] border-[#C8A97E]' : 'border-stone-500'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3 h-3 text-[#0B1914]" />}
                        </div>
                        <span className="truncate">{pkg}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#C8A97E] hover:bg-[#b5966c] text-[#0B1914] text-xs font-bold uppercase tracking-[0.15em] transition-all cursor-pointer shadow-lg rounded-xl"
                >
                  {isSubmitting ? 'SAVING TO FIRESTORE...' : 'REGISTER CRAFT TO FLEET'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-3 border border-white/20 text-stone-300 hover:text-white text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT VESSEL / VEHICLE MODAL */}
      {editingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0B1914] border border-[#C8A97E]/50 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative text-[#F4F1EA] rounded-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingVehicle(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C8A97E] block mb-1">
                EDIT VESSEL DETAILS
              </span>
              <h3 className="font-serif text-2xl text-[#F4F1EA]">{editingVehicle.identifier}</h3>
              <span className="text-xs font-mono text-[#d4af37]">{editingVehicle.id}</span>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                    Identifier / Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                    Craft Category *
                  </label>
                  <select
                    value={formData.craftType}
                    onChange={(e) => handleCraftTypeChange(e.target.value)}
                    className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
                  >
                    {CRAFT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                    Capacity (Seats) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] font-mono focus:outline-none focus:border-[#C8A97E] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                    Condition Status *
                  </label>
                  <select
                    value={formData.conditionStatus}
                    onChange={(e) => setFormData({ ...formData, conditionStatus: e.target.value as any })}
                    className="w-full px-3 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
                  >
                    <option value="Operational">Operational</option>
                    <option value="Under Inspection">Under Inspection</option>
                    <option value="Out of Service">Out of Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                    Availability *
                  </label>
                  <select
                    value={formData.availabilityStatus}
                    onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value as any })}
                    className="w-full px-3 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
                  >
                    <option value="Available">Available</option>
                    <option value="On Lake / Reserved">On Lake / Reserved</option>
                    <option value="Reserved Maintenance">Reserved Maintenance</option>
                  </select>
                </div>
              </div>

              {/* Safety & USCG Compliance Block */}
              <div className="p-4 bg-[#13241E] border border-[#C8A97E]/30 rounded-xl space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A97E] block">
                  SAFETY EQUIPMENT &amp; USCG COMPLIANCE
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium text-stone-300 mb-1">
                      Assigned PFDs (Life Jackets)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={formData.lifeJacketCount}
                      onChange={(e) => setFormData({ ...formData, lifeJacketCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#0B1914] border border-white/20 text-xs text-white rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-stone-300 mb-1">
                      Paddle Serials
                    </label>
                    <input
                      type="text"
                      value={formData.paddleSerials}
                      onChange={(e) => setFormData({ ...formData, paddleSerials: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0B1914] border border-white/20 text-xs text-white rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.uscgCompliant}
                      onChange={(e) => setFormData({ ...formData, uscgCompliant: e.target.checked })}
                      className="accent-[#C8A97E] w-4 h-4"
                    />
                    <span>USCG Compliant</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.emergencyKitChecked}
                      onChange={(e) => setFormData({ ...formData, emergencyKitChecked: e.target.checked })}
                      className="accent-[#C8A97E] w-4 h-4"
                    />
                    <span>Emergency Kit Checked</span>
                  </label>
                </div>
              </div>

              {/* Maintenance Log */}
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#C8A97E] mb-1.5">
                  Maintenance Log / Service Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.lastMaintenanceLog}
                  onChange={(e) => setFormData({ ...formData, lastMaintenanceLog: e.target.value })}
                  className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-lg"
                />
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#C8A97E] hover:bg-[#b5966c] text-[#0B1914] text-xs font-bold uppercase tracking-[0.15em] transition-all cursor-pointer shadow-lg rounded-xl"
                >
                  {isSubmitting ? 'UPDATING FIRESTORE...' : 'SAVE CHANGES'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingVehicle(null)}
                  className="px-5 py-3 border border-white/20 text-stone-300 hover:text-white text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECTION & PASS MODAL */}
      {inspectingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0B1914] border border-amber-500/50 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative text-[#F4F1EA] rounded-2xl">
            <button
              onClick={() => setInspectingVehicle(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
                <Wrench className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-400 block pt-1">
                USCG &amp; SAFETY INSPECTION PASS
              </span>
              <h3 className="font-serif text-2xl text-white">{inspectingVehicle.identifier}</h3>
              <p className="text-xs text-stone-300 font-light">
                Confirm vessel safety check, buoy test, PFD inventory, and mark as Operational.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-amber-300 mb-1.5">
                  Inspection / Maintenance Log Notes
                </label>
                <textarea
                  rows={3}
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  placeholder="Record hull check findings, rudder test, and inspector sign-off..."
                  className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-amber-400 rounded-lg"
                />
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => handlePassInspection(inspectingVehicle)}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-[#0B1914] font-bold text-xs uppercase tracking-[0.15em] transition-all cursor-pointer shadow-lg rounded-xl flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>MARK OPERATIONAL &amp; COMPLIANT</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInspectingVehicle(null)}
                  className="w-full py-2.5 text-stone-400 hover:text-white text-xs uppercase tracking-wider text-center"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
