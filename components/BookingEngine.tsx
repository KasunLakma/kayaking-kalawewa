'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { packages, Package, getPackageById } from '@/data/packages';
import {
  saveBookingToFirestore,
  BookingDocument,
  getBlockedSlotsFromFirestore,
  BlockedSlot,
} from '@/lib/firebase';

interface BookingEngineProps {
  initialPackageId?: string;
  initialDate?: string;
  initialTimeSlot?: string;
  initialGuestCount?: number;
  onSuccessClose?: () => void;
  isModal?: boolean;
}

const SLOT_CARDS = [
  {
    id: 'Morning Expedition (6:00 AM)',
    title: 'Morning Expedition',
    time: '6:00 AM — Quiet bird sightings',
    description: 'Cool morning breeze & serene lotus blooms',
    badge: 'Popular for Wildlife',
  },
  {
    id: 'Evening Sunset Expedition (4:30 PM)',
    title: 'Evening Sunset Expedition',
    time: '4:30 PM — Majestic dusk scenery',
    description: 'Golden hour water glow & elephant trail views',
    badge: 'Best Sunset View',
  },
];

export default function BookingEngine({
  initialPackageId,
  initialDate,
  initialTimeSlot,
  initialGuestCount,
  onSuccessClose,
  isModal = false,
}: BookingEngineProps) {
  const defaultPkg = getPackageById(initialPackageId || '') || packages[0];
  
  const [packageId, setPackageId] = useState<string>(defaultPkg.id);
  const [selectedDate, setSelectedDate] = useState<string>(
    initialDate || new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState<string>(
    initialTimeSlot || 'Morning Expedition (6:00 AM)'
  );
  const [guestCount, setGuestCount] = useState<number>(initialGuestCount || 2);
  const [kayakType, setKayakType] = useState<'Single Kayak' | 'Tandem Kayak'>('Single Kayak');
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  
  // Compact Calendar Navigation Month
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const d = selectedDate ? new Date(selectedDate) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // Guest details
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  // Payment option
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BANK_TRANSFER'>('COD');
  
  // Submit & result states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [bookingResult, setBookingResult] = useState<BookingDocument | null>(null);

  // Load blocked slots
  useEffect(() => {
    getBlockedSlotsFromFirestore().then((slots) => {
      if (slots) setBlockedSlots(slots);
    });
  }, []);

  // Sync initial package
  useEffect(() => {
    if (initialPackageId) {
      const matched = getPackageById(initialPackageId);
      if (matched) {
        setPackageId(matched.id);
      }
    }
  }, [initialPackageId]);

  const todayStr = new Date().toISOString().split('T')[0];

  const currentPkg: Package = packages.find((p) => p.id === packageId) || packages[0];
  const totalAmountLKR = currentPkg.priceAmount * guestCount;

  // Check if a slot is blocked for selected date
  const isSlotBlocked = (slotName: string) => {
    return blockedSlots.some(
      (b) => b.date === selectedDate && (b.timeSlot === slotName || b.timeSlot === 'ALL_SLOTS')
    );
  };

  // Calendar Day Picker logic
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const viewYear = currentMonth.getFullYear();
  const viewMonth = currentMonth.getMonth();

  let firstDayIndex = new Date(viewYear, viewMonth, 1).getDay() - 1;
  if (firstDayIndex === -1) firstDayIndex = 6; // Sunday index fix
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const daysGrid: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysGrid.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysGrid.push(d);
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(viewYear, viewMonth - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentMonth(new Date(viewYear, viewMonth + 1, 1));
  };

  const handleSelectDay = (day: number) => {
    const formattedDate = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (formattedDate >= todayStr) {
      setSelectedDate(formattedDate);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !phone.trim() || !email.trim() || !selectedDate) {
      setErrorMsg('Please complete all mandatory fields marked with an asterisk (*).');
      return;
    }

    setIsSubmitting(true);

    try {
      const resultDoc = await saveBookingToFirestore({
        packageName: currentPkg.title,
        packageId: currentPkg.id,
        selectedDate,
        timeSlot,
        guestCount,
        kayakType,
        totalAmountLKR,
        customer: {
          fullName,
          phone,
          email,
          notes,
        },
        paymentMethod,
      });

      fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: resultDoc.bookingId,
          fullName: fullName,
          email: email,
          phone: phone,
          packageName: currentPkg.title,
          selectedDate,
          timeSlot,
          guestCount,
          totalAmountLKR,
          paymentMethod,
        }),
      }).catch((emailErr) => console.warn('Email dispatch notice:', emailErr));

      setBookingResult(resultDoc);

      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Purchase", {
          value: totalAmountLKR,
          currency: "LKR",
          content_name: currentPkg.title,
        });
      }
      if (typeof window !== "undefined" && (window as any).ttq) {
        (window as any).ttq.track("CompleteRegistration", {
          content_name: currentPkg.title,
          value: totalAmountLKR,
          currency: "LKR",
        });
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      setErrorMsg('An unexpected error occurred while saving your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setBookingResult(null);
    if (onSuccessClose) {
      onSuccessClose();
    }
  };

  const whatsappText = bookingResult
    ? encodeURIComponent(
        `Hi Kalawewa Concierge! I have reserved "${bookingResult.packageName}" (Ref #${bookingResult.bookingId}) for ${bookingResult.selectedDate} at ${bookingResult.timeSlot}. Guest Name: ${bookingResult.customer.fullName}. Total: LKR ${bookingResult.totalAmountLKR.toLocaleString()}.`
      )
    : '';
  const whatsappConciergeUrl = `https://wa.me/94771234567?text=${whatsappText}`;

  const containerClasses = isModal
    ? "w-full text-stone-800"
    : "w-full bg-[#f4efe8] py-16 md:py-20 px-4 sm:px-6 md:px-8 text-stone-800";

  return (
    <div className={containerClasses}>
      {/* Title Header */}
      {!isModal && (
        <div className="text-center mb-8 md:mb-12 max-w-2xl mx-auto">
          <span className="text-xs md:text-sm font-semibold tracking-[0.25em] text-[#b8860b] uppercase block mb-2">
            SECURE YOUR EXPEDITION
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-stone-900 tracking-tight">
            Book Your Adventure
          </h2>
        </div>
      )}

      {/* Main White Card Frame */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl max-w-5xl mx-auto border border-stone-200 relative">
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {!bookingResult ? (
          <form onSubmit={handleSubmit}>
            
            {/* Package Selector Pill Bar */}
            <div className="mb-8 p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 shrink-0">
                Expedition Package:
              </label>
              <select
                value={packageId}
                onChange={(e) => setPackageId(e.target.value)}
                className="w-full sm:w-auto flex-1 bg-white border border-stone-300 rounded-xl px-4 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#112620] cursor-pointer"
              >
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.title} — LKR {pkg.priceAmount.toLocaleString()} per guest
                  </option>
                ))}
              </select>
            </div>

            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* COLUMN 1: SELECT DATE */}
              <div className="flex flex-col space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 pb-2">
                  1. Select Date
                </h3>

                {/* Mini Month Navigation */}
                <div className="flex items-center justify-between bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1 rounded-lg hover:bg-stone-200 text-stone-600 text-xs font-bold cursor-pointer"
                    aria-label="Previous Month"
                  >
                    &lt;
                  </button>
                  <span className="text-xs font-bold text-stone-800">
                    {monthNames[viewMonth]} {viewYear}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1 rounded-lg hover:bg-stone-200 text-stone-600 text-xs font-bold cursor-pointer"
                    aria-label="Next Month"
                  >
                    &gt;
                  </button>
                </div>

                {/* Days of Week Header */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-stone-400 py-1">
                  {daysOfWeek.map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {daysGrid.map((day, idx) => {
                    if (day === null) {
                      return <div key={`empty-${idx}`} className="h-8" />;
                    }
                    const cellDateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isSelected = selectedDate === cellDateStr;
                    const isPast = cellDateStr < todayStr;

                    return (
                      <button
                        key={`day-${day}`}
                        type="button"
                        disabled={isPast}
                        onClick={() => handleSelectDay(day)}
                        className={`h-8 w-8 mx-auto flex items-center justify-center text-xs transition-all ${
                          isSelected
                            ? 'bg-[#112620] text-white rounded-full font-bold shadow-md'
                            : isPast
                            ? 'text-stone-300 cursor-not-allowed'
                            : 'text-stone-700 hover:bg-stone-100 rounded-full cursor-pointer'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {/* Active Date Readout */}
                <div className="pt-2 text-[11px] text-stone-500 font-medium text-center">
                  Selected: <span className="font-bold text-stone-900">{selectedDate}</span>
                </div>
              </div>

              {/* COLUMN 2: CHOOSE SLOT */}
              <div className="flex flex-col space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 pb-2">
                  2. Choose Slot
                </h3>

                <div className="space-y-3">
                  {SLOT_CARDS.map((slot) => {
                    const isSelected = timeSlot === slot.id;
                    const blocked = isSlotBlocked(slot.id);

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={blocked}
                        onClick={() => !blocked && setTimeSlot(slot.id)}
                        className={`w-full p-4 rounded-2xl text-left transition-all border cursor-pointer ${
                          blocked
                            ? 'bg-red-50 border-red-200 opacity-60 cursor-not-allowed'
                            : isSelected
                            ? 'bg-emerald-50/60 border-[#112620] ring-2 ring-[#112620] shadow-sm'
                            : 'bg-stone-50/60 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-stone-900">
                            {slot.title}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-semibold">
                            {slot.badge}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-[#112620] mb-1">
                          {slot.time}
                        </div>
                        <p className="text-[11px] text-stone-500 font-light leading-snug">
                          {slot.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Kayak Model Preference */}
                <div className="pt-2">
                  <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
                    Kayak Model Preference:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setKayakType('Single Kayak')}
                      className={`py-2 px-3 text-xs rounded-xl border text-center font-medium transition-all cursor-pointer ${
                        kayakType === 'Single Kayak'
                          ? 'bg-[#112620] text-white border-[#112620]'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      Single Kayak
                    </button>
                    <button
                      type="button"
                      onClick={() => setKayakType('Tandem Kayak')}
                      className={`py-2 px-3 text-xs rounded-xl border text-center font-medium transition-all cursor-pointer ${
                        kayakType === 'Tandem Kayak'
                          ? 'bg-[#112620] text-white border-[#112620]'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      Tandem Kayak
                    </button>
                  </div>
                </div>
              </div>

              {/* COLUMN 3: GUEST COUNT & PAYMENT & CONTACT */}
              <div className="flex flex-col space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 pb-2">
                  3. Guests &amp; Payment
                </h3>

                {/* Stepper counter */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                    Party Size:
                  </label>
                  <div className="flex items-center justify-between border border-stone-200 rounded-xl p-2 bg-stone-50">
                    <button
                      type="button"
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className="w-9 h-9 rounded-lg bg-white border border-stone-200 text-stone-700 font-bold hover:bg-stone-100 flex items-center justify-center transition-all cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs sm:text-sm font-semibold text-stone-800">
                      {guestCount} Guest{guestCount > 1 ? 's' : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
                      className="w-9 h-9 rounded-lg bg-white border border-stone-200 text-stone-700 font-bold hover:bg-stone-100 flex items-center justify-center transition-all cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Radio Payment Buttons */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                    Payment Method:
                  </label>
                  <div className="space-y-2">
                    <label
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        paymentMethod === 'COD'
                          ? 'border-[#112620] bg-emerald-50/50 ring-1 ring-[#112620]'
                          : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="accent-[#112620] mt-0.5"
                      />
                      <div>
                        <span className="text-xs font-semibold text-stone-800 block">
                          Cash on Arrival
                        </span>
                        <span className="text-[10px] text-stone-500 block">
                          Pay on site at launching dock. Zero upfront deposit.
                        </span>
                      </div>
                    </label>

                    <label
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        paymentMethod === 'BANK_TRANSFER'
                          ? 'border-[#112620] bg-emerald-50/50 ring-1 ring-[#112620]'
                          : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="BANK_TRANSFER"
                        checked={paymentMethod === 'BANK_TRANSFER'}
                        onChange={() => setPaymentMethod('BANK_TRANSFER')}
                        className="accent-[#112620] mt-0.5"
                      />
                      <div>
                        <span className="text-xs font-semibold text-stone-800 block">
                          Bank Transfer
                        </span>
                        <span className="text-[10px] text-stone-500 block">
                          Direct bank transfer details provided on confirmation.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="space-y-2 pt-2">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name *"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-[#112620] text-stone-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none"
                  />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="WhatsApp Number *"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-[#112620] text-stone-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address *"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-[#112620] text-stone-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none"
                  />
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Special Notes / Requests (Optional)"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-[#112620] text-stone-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none"
                  />
                </div>

              </div>

            </div>

            {/* FOOTER SUMMARY ROW */}
            <div className="border-t border-stone-200 pt-6 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-0.5">
                  ESTIMATED TOTAL
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-bold text-[#112620]">
                    LKR {totalAmountLKR.toLocaleString()}
                  </span>
                  <span className="text-xs text-stone-500 font-normal">
                    ({guestCount} guest{guestCount > 1 ? 's' : ''})
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto bg-[#112620] text-white px-10 py-4 rounded-xl font-medium hover:bg-[#1a382f] transition-all shadow-lg text-sm tracking-wide cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Recording Booking...' : 'Confirm Booking'}</span>
                {!isSubmitting && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>

          </form>
        ) : (
          /* CONFIRMATION CARD VIEW */
          <div className="py-8 px-4 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#112620] text-2xl font-bold flex items-center justify-center mx-auto shadow-inner">
              ✓
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 block">
                BOOKING CONFIRMED
              </span>
              <h3 className="font-serif text-3xl md:text-4xl font-normal text-stone-900">
                Expedition Reserved!
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Your eco-kayaking order has been successfully recorded in our system.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-left max-w-lg mx-auto text-xs space-y-2.5">
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Booking Reference:</span>
                <span className="font-mono text-[#112620] font-bold">{bookingResult.bookingId}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Expedition Package:</span>
                <span className="text-stone-900 font-semibold">{bookingResult.packageName}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Scheduled Date &amp; Slot:</span>
                <span className="text-stone-900 font-medium">{bookingResult.selectedDate} ({bookingResult.timeSlot})</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Guest Name:</span>
                <span className="text-stone-900">{bookingResult.customer.fullName} ({bookingResult.guestCount} Guests)</span>
              </div>
              <div className="flex justify-between font-serif text-base pt-1">
                <span className="text-stone-900 font-bold">Total Amount:</span>
                <span className="text-[#112620] font-bold">LKR {bookingResult.totalAmountLKR.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={whatsappConciergeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-[#25D366] text-stone-900 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <span>💬 MESSAGE CONCIERGE ON WHATSAPP</span>
              </a>
              <Link
                href="/"
                onClick={resetForm}
                className="w-full sm:w-auto px-6 py-3 bg-[#112620] hover:bg-[#1f3d34] text-white text-xs font-semibold rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>RETURN TO HOME</span>
              </Link>
              <button
                onClick={resetForm}
                className="w-full sm:w-auto px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl border border-stone-300"
              >
                BOOK ANOTHER EXPEDITION
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

