'use client';

import React from 'react';
import Link from 'next/link';
import { BookingDocument } from '@/lib/firebase';

interface BookingConfirmationModalProps {
  bookingResult: BookingDocument;
  onClose?: () => void;
  onReset?: () => void;
  onPrimaryAction?: () => void;
  primaryActionText?: string;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export default function BookingConfirmationModal({
  bookingResult,
  onClose,
  onReset,
  onPrimaryAction,
  primaryActionText = "CONFIRM & RESERVE NOW",
  secondaryActionText = "RETURN HOME",
  onSecondaryAction,
}: BookingConfirmationModalProps) {
  const handlePrimaryClick = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    } else {
      // Default primary action: Download/View itinerary via window.print()
      if (typeof window !== 'undefined') {
        window.print();
      }
    }
  };

  const handleSecondaryClick = () => {
    if (onSecondaryAction) {
      onSecondaryAction();
    } else if (onReset) {
      onReset();
    } else if (onClose) {
      onClose();
    }
  };

  const paymentLabel =
    bookingResult.paymentMethod === 'COD'
      ? 'Cash on Arrival'
      : 'Bank Transfer';

  return (
    <div className="max-w-lg w-full p-6 md:p-8 bg-[#0B1914] border border-[#d4af37]/30 rounded-2xl shadow-2xl mx-auto text-left relative overflow-hidden font-sans">
      {/* HEADER SECTION - Center Aligned */}
      <div className="text-center space-y-3">
        {/* Elegant Gold Checkmark Icon */}
        <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center mx-auto shadow-inner">
          <svg
            className="w-8 h-8 text-[#d4af37]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Modal Title */}
        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#f3efe6] tracking-tight">
          Expedition Reservation Confirmed
        </h2>

        {/* Reservation Reference Code */}
        <p className="text-xs font-mono text-stone-400 tracking-wider">
          REF: <span className="text-[#d4af37] font-semibold">#{bookingResult.bookingId}</span>
        </p>
      </div>

      {/* DETAILS BREAKDOWN - Sleek Key-Value List */}
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 my-6 space-y-3">
        {/* Package Name */}
        <div className="flex justify-between items-center text-sm gap-2">
          <span className="text-stone-400 font-light shrink-0">Package Name</span>
          <span className="text-[#f3efe6] font-medium font-mono text-right truncate max-w-[60%]">
            {bookingResult.packageName}
          </span>
        </div>

        {/* Date */}
        <div className="flex justify-between items-center text-sm gap-2">
          <span className="text-stone-400 font-light shrink-0">Date</span>
          <span className="text-[#f3efe6] font-medium font-mono text-right">
            {bookingResult.selectedDate}
          </span>
        </div>

        {/* Slot */}
        <div className="flex justify-between items-center text-sm gap-2">
          <span className="text-stone-400 font-light shrink-0">Slot</span>
          <span className="text-[#f3efe6] font-medium font-mono text-right truncate max-w-[60%]">
            {bookingResult.timeSlot}
          </span>
        </div>

        {/* Guests */}
        <div className="flex justify-between items-center text-sm gap-2">
          <span className="text-stone-400 font-light shrink-0">Guests</span>
          <span className="text-[#f3efe6] font-medium font-mono text-right">
            {bookingResult.guestCount} {bookingResult.guestCount === 1 ? 'Guest' : 'Guests'}
          </span>
        </div>

        {/* Payment / COD Amount */}
        <div className="flex justify-between items-center text-sm gap-2">
          <span className="text-stone-400 font-light shrink-0">Payment Method</span>
          <span className="text-[#f3efe6] font-medium font-mono text-right">
            {paymentLabel}
          </span>
        </div>

        {/* Total / Due on Arrival */}
        <div className="border-t border-white/10 pt-3 flex justify-between items-baseline font-semibold text-[#d4af37] text-base">
          <span>Due on Arrival</span>
          <span className="font-mono text-lg">
            LKR {bookingResult.totalAmountLKR.toLocaleString()}
          </span>
        </div>
      </div>

      {/* STREAMLINED BUTTON ACTIONS - Primary vs Secondary */}
      <div className="flex flex-col w-full">
        {/* PRIMARY ACTION */}
        <button
          type="button"
          onClick={handlePrimaryClick}
          className="w-full bg-[#d4af37] text-black font-semibold py-3.5 px-6 rounded-xl hover:bg-[#c29d2b] transition-all shadow-lg text-sm tracking-wider uppercase cursor-pointer"
        >
          {primaryActionText}
        </button>

        {/* SECONDARY ACTION */}
        {onSecondaryAction ? (
          <button
            type="button"
            onClick={handleSecondaryClick}
            className="w-full bg-transparent border border-white/20 text-stone-300 hover:text-white hover:border-white/40 py-3 px-6 rounded-xl transition-all text-xs tracking-wider uppercase font-medium mt-3 cursor-pointer"
          >
            {secondaryActionText}
          </button>
        ) : (
          <Link
            href="/"
            onClick={handleSecondaryClick}
            className="w-full text-center bg-transparent border border-white/20 text-stone-300 hover:text-white hover:border-white/40 py-3 px-6 rounded-xl transition-all text-xs tracking-wider uppercase font-medium mt-3 block cursor-pointer"
          >
            {secondaryActionText}
          </Link>
        )}
      </div>
    </div>
  );
}
