'use client';

import React from 'react';
import BookingEngine from './BookingEngine';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackageId?: string;
  selectedDate?: string;
  selectedTimeSlot?: string;
  selectedGuestCount?: number;
}

export default function BookingModal({
  isOpen,
  onClose,
  selectedPackageId,
  selectedDate,
  selectedTimeSlot,
  selectedGuestCount,
}: BookingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#f4efe8] text-stone-800 max-w-5xl w-full shadow-2xl relative p-4 sm:p-6 my-8 rounded-3xl border border-stone-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-stone-500 hover:text-stone-900 transition-colors text-xl font-bold cursor-pointer z-10 w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center shadow-sm"
          aria-label="Close Booking Modal"
        >
          ✕
        </button>

        <BookingEngine
          initialPackageId={selectedPackageId}
          initialDate={selectedDate}
          initialTimeSlot={selectedTimeSlot}
          initialGuestCount={selectedGuestCount}
          onSuccessClose={onClose}
          isModal={true}
        />
      </div>
    </div>
  );
}

