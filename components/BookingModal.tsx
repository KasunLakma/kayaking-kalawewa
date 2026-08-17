'use client';

import React, { useState, useEffect } from 'react';
import { packages, Package } from '@/data/packages';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackageId?: string;
}

export default function BookingModal({ isOpen, onClose, selectedPackageId }: BookingModalProps) {
  const [packageId, setPackageId] = useState<string>(selectedPackageId || packages[0].id);
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [tourDate, setTourDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('06:00 AM');
  const [kayakType, setKayakType] = useState<'Single' | 'Double'>('Single');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer'>('cod');
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingResult, setBookingResult] = useState<any>(null);

  // Update selected package if passed in props
  useEffect(() => {
    if (selectedPackageId) {
      setPackageId(selectedPackageId);
    }
  }, [selectedPackageId]);

  // Set default tour date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setTourDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  if (!isOpen) return null;

  const currentPkg = packages.find((p) => p.id === packageId) || packages[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          tourDate,
          timeSlot,
          kayakType,
          guestCount,
          packageId: currentPkg.id,
          packageName: currentPkg.title,
          paymentMethod,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setBookingResult(data);
      } else {
        alert(data.error || 'Failed to submit reservation request.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setBookingResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0B1914] border border-[#C8A97E]/40 text-[#F4F1EA] max-w-2xl w-full shadow-2xl relative p-6 sm:p-10 my-8 rounded-none">
        
        {/* Close Button */}
        <button
          onClick={resetForm}
          className="absolute top-5 right-5 text-slate-400 hover:text-[#C8A97E] transition-colors text-lg"
          aria-label="Close Booking Modal"
        >
          ✕
        </button>

        {!bookingResult ? (
          /* FORM STATE */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C8A97E] block mb-1">
                KALAWEWA ADVENTURES &amp; EXPEDITIONS
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl text-[#F4F1EA] font-normal leading-tight">
                Reserve Your Expedition
              </h3>
              <p className="text-xs text-slate-300 font-light mt-1">
                Instant reservation with Pay on Arrival (COD) or Manual Bank Transfer.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Package Selector */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium uppercase tracking-[0.15em] text-[#C8A97E] mb-2">
                  Select Tour Package
                </label>
                <select
                  value={packageId}
                  onChange={(e) => setPackageId(e.target.value)}
                  className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E]"
                >
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.title} ({pkg.duration} — {pkg.price})
                    </option>
                  ))}
                </select>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-[0.15em] text-[#C8A97E] mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Kasun Perera"
                  className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] placeholder-slate-500 focus:outline-none focus:border-[#C8A97E]"
                />
              </div>

              {/* WhatsApp / Phone */}
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-[0.15em] text-[#C8A97E] mb-2">
                  WhatsApp / Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+94 77 123 4567"
                  className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] placeholder-slate-500 focus:outline-none focus:border-[#C8A97E]"
                />
              </div>

              {/* Email Address */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium uppercase tracking-[0.15em] text-[#C8A97E] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] placeholder-slate-500 focus:outline-none focus:border-[#C8A97E]"
                />
              </div>

              {/* Tour Date */}
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-[0.15em] text-[#C8A97E] mb-2">
                  Tour Date *
                </label>
                <input
                  type="date"
                  required
                  value={tourDate}
                  onChange={(e) => setTourDate(e.target.value)}
                  className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E]"
                />
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-[0.15em] text-[#C8A97E] mb-2">
                  Time Slot *
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E]"
                >
                  <option value="06:00 AM">06:00 AM (Sunrise Mist)</option>
                  <option value="08:30 AM">08:30 AM (Morning Exploration)</option>
                  <option value="03:30 PM">03:30 PM (Afternoon Trail)</option>
                  <option value="05:00 PM">05:00 PM (Sunset Golden Hour)</option>
                </select>
              </div>

              {/* Kayak Type */}
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-[0.15em] text-[#C8A97E] mb-2">
                  Kayak Selection *
                </label>
                <div className="flex gap-4 pt-1">
                  <label className="inline-flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="kayakType"
                      value="Single"
                      checked={kayakType === 'Single'}
                      onChange={() => setKayakType('Single')}
                      className="accent-[#C8A97E]"
                    />
                    <span>Single Kayak</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="kayakType"
                      value="Double"
                      checked={kayakType === 'Double'}
                      onChange={() => setKayakType('Double')}
                      className="accent-[#C8A97E]"
                    />
                    <span>Double Kayak</span>
                  </label>
                </div>
              </div>

              {/* Guest Count */}
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-[0.15em] text-[#C8A97E] mb-2">
                  Guest Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 bg-[#13241E] border border-white/20 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C8A97E]"
                />
              </div>

              {/* Payment Method */}
              <div className="sm:col-span-2 pt-2 border-t border-white/10">
                <label className="block text-[11px] font-medium uppercase tracking-[0.15em] text-[#C8A97E] mb-3">
                  Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 text-left border transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-[#C8A97E] bg-[#13241E]'
                        : 'border-white/15 bg-black/20 hover:border-white/40'
                    }`}
                  >
                    <div className="text-xs font-semibold text-[#F4F1EA] flex items-center gap-2">
                      <span className="text-[#C8A97E]">💵</span>
                      <span>Pay Cash on Arrival (On-Site)</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-light mt-1">
                      Pay directly to our operations team at the Kalawewa launch point.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-4 text-left border transition-all cursor-pointer ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-[#C8A97E] bg-[#13241E]'
                        : 'border-white/15 bg-black/20 hover:border-white/40'
                    }`}
                  >
                    <div className="text-xs font-semibold text-[#F4F1EA] flex items-center gap-2">
                      <span className="text-[#C8A97E]">🏦</span>
                      <span>Manual Bank Transfer</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-light mt-1">
                      Receive account details in your confirmation note.
                    </p>
                  </button>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-white/20 text-xs font-medium uppercase tracking-widest text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'PROCESSING...' : 'CONFIRM RESERVATION'}
              </button>
            </div>

          </form>
        ) : (
          /* CONFIRMATION STATE */
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-[#13241E] border border-[#C8A97E] flex items-center justify-center mx-auto text-2xl text-[#C8A97E]">
              ✓
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C8A97E] block mb-1">
                RESERVATION RECEIVED
              </span>
              <h3 className="font-serif text-3xl text-[#F4F1EA] font-normal">
                Booking Pending Confirmation
              </h3>
              <p className="text-xs text-slate-300 font-light mt-2 max-w-md mx-auto">
                Thank you for choosing Kayaking Kalawewa Adventures &amp; Expeditions. An automated email notification placeholder (Resend/Nodemailer schema) has been dispatched.
              </p>
            </div>

            <div className="bg-[#13241E] border border-[#C8A97E]/30 p-6 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Booking Reference:</span>
                <span className="font-mono text-[#C8A97E] font-bold">{bookingResult.referenceId}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Order Status:</span>
                <span className="text-yellow-400 uppercase font-semibold">{bookingResult.status}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Expedition:</span>
                <span className="text-white font-medium">{bookingResult.bookingDetails.packageName}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Date &amp; Time:</span>
                <span className="text-white">{bookingResult.bookingDetails.tourDate} at {bookingResult.bookingDetails.timeSlot}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Equipment:</span>
                <span className="text-white">{bookingResult.bookingDetails.kayakType} Kayak ({bookingResult.bookingDetails.guestCount} Guest)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Selection:</span>
                <span className="text-[#C8A97E] font-medium">{bookingResult.bookingDetails.paymentMethod}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={resetForm}
                className="px-8 py-3 bg-[#C8A97E] hover:bg-[#b5966c] text-[#0B1914] text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer"
              >
                RETURN TO EXPEDITIONS
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
