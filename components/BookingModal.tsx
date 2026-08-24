'use client';

import React from 'react';
import BookingEngine from './BookingEngine';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackageId?: string;
}

export default function BookingModal({
  isOpen,
  onClose,
  selectedPackageId,
}: BookingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0B1914] border border-[#C8A97E]/40 text-[#F4F1EA] max-w-3xl w-full shadow-2xl relative p-6 sm:p-10 my-8 rounded-none">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-[#C8A97E] transition-colors text-lg cursor-pointer z-10"
          aria-label="Close Booking Modal"
        >
          ✕
        </button>

        <BookingEngine
          initialPackageId={selectedPackageId}
          onSuccessClose={onClose}
          isModal={true}
        />
      </div>
    </div>
  );
}
