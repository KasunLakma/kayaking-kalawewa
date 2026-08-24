'use client';

import React, { useState, useEffect } from 'react';
import { packages, Package, getPackageById } from '@/data/packages';
import {
  saveBookingToFirestore,
  BookingDocument,
  getBlockedSlotsFromFirestore,
  BlockedSlot,
} from '@/lib/firebase';

interface BookingEngineProps {
  initialPackageId?: string;
  onSuccessClose?: () => void;
  isModal?: boolean;
}

const TIME_SLOTS = [
  'Morning / Sunrise (06:00 AM)',
  'Late Morning (09:00 AM)',
  'Afternoon / Wildlife (03:30 PM)',
  'Sunset Romance (05:00 PM)',
];

export default function BookingEngine({
  initialPackageId,
  onSuccessClose,
  isModal = false,
}: BookingEngineProps) {
  const defaultPkg = getPackageById(initialPackageId || '') || packages[0];
  
  const [packageId, setPackageId] = useState<string>(defaultPkg.id);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>(TIME_SLOTS[0]);
  const [guestCount, setGuestCount] = useState<number>(1);
  const [kayakType, setKayakType] = useState<'Single Kayak' | 'Tandem Kayak'>('Single Kayak');
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  
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

  // Set default tour date to tomorrow & min date to today
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const currentPkg: Package = packages.find((p) => p.id === packageId) || packages[0];

  // Dynamic Live Price Calculation
  const totalAmountLKR = currentPkg.priceAmount * guestCount;

  // Check if a slot is blocked for the selected date
  const isSlotBlocked = (slotName: string) => {
    return blockedSlots.some(
      (b) => b.date === selectedDate && (b.timeSlot === slotName || b.timeSlot === 'ALL_SLOTS')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!fullName.trim() || !phone.trim() || !email.trim() || !selectedDate) {
      setErrorMsg('Please complete all mandatory fields marked with an asterisk (*).');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Submit order payload to Firestore `bookings` collection
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

      // 2. Trigger Resend confirmation email API endpoint (non-blocking)
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

      // Trigger Meta & TikTok Tracking Pixels for Successful Booking
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Purchase", {
          value: totalAmountLKR,
          currency: "LKR",
          content_name: currentPkg.title,
        });
        (window as any).fbq("track", "Lead", {
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

  // WhatsApp concierge pre-filled URL
  const whatsappText = bookingResult
    ? encodeURIComponent(
        `Hi Kalawewa Concierge! I have just reserved the "${bookingResult.packageName}" expedition (Ref #${bookingResult.bookingId}) for ${bookingResult.selectedDate} at ${bookingResult.timeSlot}. Guest Name: ${bookingResult.customer.fullName}. Total Payable: LKR ${bookingResult.totalAmountLKR.toLocaleString()}.`
      )
    : '';
  const whatsappConciergeUrl = `https://wa.me/94771234567?text=${whatsappText}`;

  return (
    <div className="w-full text-[#F4F1EA]">
      {!bookingResult ? (
        /* STEP-BY-STEP FORM */
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Header Subtitle */}
          <div className="border-b border-white/10 pb-4">
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#C8A97E] block mb-1">
              OFFICIAL RESERVATION ENGINE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#F4F1EA]">
              Reserve Your Expedition
            </h2>
            <p className="text-xs text-[#F4F1EA]/75 font-light mt-1">
              Select your package, schedule date, guest count, and payment method with instant Pay-on-Arrival (COD).
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-light rounded-none">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* STEP 1: Package Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#C8A97E]">
              Step 1: Select Expedition Package
            </label>
            <select
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              className="w-full px-4 py-3.5 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-none"
            >
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.title} — {pkg.price} {pkg.unit} ({pkg.duration})
                </option>
              ))}
            </select>
          </div>

          {/* STEP 2: Date & Slot Picker */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#C8A97E]">
              Step 2: Date &amp; Time Slot Selection
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-light text-slate-300 mb-1">
                  Tour Date *
                </label>
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E] rounded-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-light text-slate-300 mb-1">
                  Selected Time Slot
                </label>
                <div className="text-xs px-4 py-3 bg-[#13241E] border border-[#C8A97E]/40 text-[#C8A97E] font-medium">
                  {timeSlot}
                </div>
              </div>
            </div>

            {/* Time Slot Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {TIME_SLOTS.map((slot) => {
                const isSelected = timeSlot === slot;
                const blocked = isSlotBlocked(slot);

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={blocked}
                    onClick={() => !blocked && setTimeSlot(slot)}
                    className={`px-3.5 py-2.5 text-xs text-left transition-all border rounded-none flex items-center justify-between ${
                      blocked
                        ? 'bg-red-950/40 text-red-300 border-red-500/40 opacity-60 cursor-not-allowed'
                        : isSelected
                        ? 'bg-[#C8A97E] text-[#0B1914] border-[#C8A97E] font-semibold cursor-pointer'
                        : 'bg-[#13241E] text-[#F4F1EA]/80 hover:text-white border-white/10 hover:border-[#C8A97E]/50 cursor-pointer'
                    }`}
                  >
                    <span>{slot}</span>
                    {blocked ? (
                      <span className="text-[10px] font-bold uppercase text-red-400">BLOCKED</span>
                    ) : (
                      isSelected && <span className="text-[10px]">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Guest Counter & Kayak Type */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#C8A97E]">
              Step 3: Participants &amp; Kayak Preference
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Guest Count */}
              <div>
                <label className="block text-[11px] font-light text-slate-300 mb-1">
                  Number of Guests (1 to 10)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                    className="w-10 h-10 bg-[#13241E] border border-white/20 text-[#F4F1EA] font-bold text-lg hover:border-[#C8A97E]"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-full text-center px-4 py-2.5 bg-[#13241E] border border-white/20 text-sm font-bold text-[#C8A97E] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
                    className="w-10 h-10 bg-[#13241E] border border-white/20 text-[#F4F1EA] font-bold text-lg hover:border-[#C8A97E]"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Kayak Type */}
              <div>
                <label className="block text-[11px] font-light text-slate-300 mb-1">
                  Kayak Model Preference
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setKayakType('Single Kayak')}
                    className={`py-2.5 px-3 text-xs border text-center transition-all cursor-pointer ${
                      kayakType === 'Single Kayak'
                        ? 'bg-[#C8A97E] text-[#0B1914] border-[#C8A97E] font-semibold'
                        : 'bg-[#13241E] text-[#F4F1EA]/80 border-white/10 hover:border-white/30'
                    }`}
                  >
                    Single Kayak
                  </button>

                  <button
                    type="button"
                    onClick={() => setKayakType('Tandem Kayak')}
                    className={`py-2.5 px-3 text-xs border text-center transition-all cursor-pointer ${
                      kayakType === 'Tandem Kayak'
                        ? 'bg-[#C8A97E] text-[#0B1914] border-[#C8A97E] font-semibold'
                        : 'bg-[#13241E] text-[#F4F1EA]/80 border-white/10 hover:border-white/30'
                    }`}
                  >
                    Tandem Kayak
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Live Price Calculation Banner */}
            <div className="bg-[#13241E] border border-[#C8A97E]/30 p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-medium uppercase tracking-widest text-[#C8A97E] block">
                  DYNAMIC ESTIMATED TOTAL
                </span>
                <span className="text-xs text-slate-300 font-light">
                  {guestCount} Guest{guestCount > 1 ? 's' : ''} × {currentPkg.price} ({currentPkg.unit})
                </span>
              </div>
              <div className="text-right">
                <span className="font-serif text-2xl font-bold text-[#C8A97E]">
                  LKR {totalAmountLKR.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* STEP 4: Guest Details */}
          <div className="space-y-4 pt-2 border-t border-white/10">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#C8A97E]">
              Step 4: Contact &amp; Guest Details
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-light text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Kasun Fernando"
                  className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] placeholder-slate-500 focus:outline-none focus:border-[#C8A97E] rounded-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-light text-slate-300 mb-1">
                  WhatsApp Contact Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+94 77 123 4567"
                  className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] placeholder-slate-500 focus:outline-none focus:border-[#C8A97E] rounded-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-light text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kasun@example.com"
                className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] placeholder-slate-500 focus:outline-none focus:border-[#C8A97E] rounded-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-light text-slate-300 mb-1">
                Special Requests / Dietary / Medical Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Vegetarian tea preference, beginner paddlers in party..."
                className="w-full px-4 py-2.5 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] placeholder-slate-500 focus:outline-none focus:border-[#C8A97E] rounded-none"
              />
            </div>
          </div>

          {/* STEP 5: Payment Method Selection */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#C8A97E]">
              Step 5: Payment Option
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Radio 1: COD */}
              <label
                className={`p-4 border text-xs cursor-pointer transition-all flex items-start gap-3 rounded-none ${
                  paymentMethod === 'COD'
                    ? 'border-[#C8A97E] bg-[#13241E]'
                    : 'border-white/15 bg-black/20 hover:border-white/30'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="accent-[#C8A97E] mt-0.5"
                />
                <div>
                  <span className="font-semibold text-[#F4F1EA] block">
                    Pay on Arrival / Cash on-Site (COD)
                  </span>
                  <span className="text-[10px] text-slate-400 font-light block mt-0.5">
                    Zero deposit required. Pay in cash at Kalawewa launch dock.
                  </span>
                </div>
              </label>

              {/* Radio 2: Bank Transfer */}
              <label
                className={`p-4 border text-xs cursor-pointer transition-all flex items-start gap-3 rounded-none ${
                  paymentMethod === 'BANK_TRANSFER'
                    ? 'border-[#C8A97E] bg-[#13241E]'
                    : 'border-white/15 bg-black/20 hover:border-white/30'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="BANK_TRANSFER"
                  checked={paymentMethod === 'BANK_TRANSFER'}
                  onChange={() => setPaymentMethod('BANK_TRANSFER')}
                  className="accent-[#C8A97E] mt-0.5"
                />
                <div>
                  <span className="font-semibold text-[#F4F1EA] block">
                    Direct Bank Transfer
                  </span>
                  <span className="text-[10px] text-slate-400 font-light block mt-0.5">
                    Account details will be provided upon confirmation.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            {isModal && onSuccessClose && (
              <button
                type="button"
                onClick={onSuccessClose}
                className="w-full sm:w-auto px-6 py-3.5 border border-white/20 text-xs font-medium uppercase tracking-widest text-slate-300 hover:text-white"
              >
                Close
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex-1 py-4 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold uppercase tracking-[0.25em] transition-all duration-300 rounded-none shadow-lg cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'SAVING RESERVATION TO FIRESTORE...' : 'CONFIRM EXPEDITION RESERVATION'}
            </button>
          </div>
        </form>
      ) : (
        /* STEP 3 CONFIRMATION CARD VIEW */
        <div className="space-y-8 bg-[#13241E] border border-[#C8A97E]/50 p-8 sm:p-12 shadow-2xl relative text-center">
          {/* Animated Success Badge */}
          <div className="w-20 h-20 rounded-full bg-[#0B1914] border-2 border-[#C8A97E] flex items-center justify-center mx-auto text-3xl text-[#C8A97E] shadow-xl">
            ✓
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#C8A97E] block">
              FIRESTORE RESERVATION CREATED
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#F4F1EA]">
              Expedition Reserved!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-light max-w-md mx-auto">
              Your eco-kayaking order document has been officially recorded in our Firestore database.
            </p>
          </div>

          {/* Confirmation Summary Box */}
          <div className="bg-[#0B1914] border border-[#C8A97E]/40 p-6 text-left space-y-3 max-w-xl mx-auto text-xs">
            <div className="flex justify-between border-b border-white/10 pb-2.5">
              <span className="text-slate-400">Booking Reference:</span>
              <span className="font-mono text-[#C8A97E] font-bold text-sm">{bookingResult.bookingId}</span>
            </div>

            <div className="flex justify-between border-b border-white/10 pb-2.5">
              <span className="text-slate-400">Expedition Package:</span>
              <span className="text-white font-medium">{bookingResult.packageName}</span>
            </div>

            <div className="flex justify-between border-b border-white/10 pb-2.5">
              <span className="text-slate-400">Scheduled Date &amp; Slot:</span>
              <span className="text-white font-medium">{bookingResult.selectedDate} at {bookingResult.timeSlot}</span>
            </div>

            <div className="flex justify-between border-b border-white/10 pb-2.5">
              <span className="text-slate-400">Guest Name &amp; Party:</span>
              <span className="text-white">{bookingResult.customer.fullName} ({bookingResult.guestCount} Guests • {bookingResult.kayakType})</span>
            </div>

            <div className="flex justify-between border-b border-white/10 pb-2.5">
              <span className="text-slate-400">Payment Option:</span>
              <span className="text-[#C8A97E] font-medium uppercase">{bookingResult.paymentMethod === 'COD' ? 'Pay on Arrival / Cash on-Site (COD)' : 'Direct Bank Transfer'}</span>
            </div>

            <div className="flex justify-between font-serif text-base pt-1">
              <span className="text-[#F4F1EA]">Total Payable at Location:</span>
              <span className="text-[#C8A97E] font-bold">LKR {bookingResult.totalAmountLKR.toLocaleString()}</span>
            </div>
          </div>

          {/* Clear Notice */}
          <div className="bg-[#0B1914]/80 border border-white/10 p-4 max-w-xl mx-auto text-xs text-[#F4F1EA]/80 font-light leading-relaxed">
            ✉️ A confirmation receipt has been scheduled for your email (<span className="text-[#C8A97E]">{bookingResult.customer.email}</span>). Our team will verify details via WhatsApp (<span className="text-[#C8A97E]">{bookingResult.customer.phone}</span>).
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappConciergeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#25D366] hover:bg-[#1ebd59] text-[#0B1914] text-xs font-bold uppercase tracking-[0.15em] transition-all rounded-none flex items-center justify-center gap-2 shadow-lg"
            >
              <span>💬 MESSAGE CONCIERGE WITH BOOKING REF</span>
            </a>

            <button
              onClick={resetForm}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#0B1914] hover:bg-[#13241E] border border-white/20 text-[#F4F1EA] text-xs font-medium uppercase tracking-[0.15em] transition-all rounded-none"
            >
              RETURN TO HOME / CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
