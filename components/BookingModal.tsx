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
  // Support ESC key to close modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      {/* Fixed Accessible Top-Right Close Action Button */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-50 p-2.5 text-stone-400 hover:text-white rounded-full bg-black/60 border border-white/10 backdrop-blur-md hover:border-[#d4af37] transition-all cursor-pointer shadow-2xl flex items-center justify-center"
        aria-label="Close Booking Modal"
        title="Close Booking Modal"
      >
        <span className="text-xl font-bold leading-none px-1">✕</span>
      </button>

      {/* Modal Content Container */}
      <div
        className="w-full max-w-5xl relative pointer-events-auto flex justify-center my-8"
        onClick={(e) => e.stopPropagation()}
      >
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

