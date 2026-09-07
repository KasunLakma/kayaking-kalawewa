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
      {/* Modal Content Container */}
      <div
        className="w-full max-w-5xl relative pointer-events-auto flex justify-center my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accessible Top-Right Close Action Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-50 w-9 h-9 flex items-center justify-center rounded-full text-stone-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
          aria-label="Close Booking Modal"
          title="Close Booking Modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
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

