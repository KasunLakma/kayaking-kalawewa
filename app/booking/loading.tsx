import React from 'react';

export default function BookingLoading() {
  return (
    <div className="min-h-screen bg-[#0B1914] text-[#F4F1EA] font-sans flex flex-col justify-center items-center p-6">
      <div className="max-w-3xl w-full bg-white/[0.03] animate-pulse border border-white/5 rounded-2xl p-8 space-y-6">
        <div className="w-48 h-8 rounded-xl bg-white/[0.05] mx-auto" />
        <div className="w-full max-w-md h-4 rounded bg-white/[0.03] mx-auto" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
          <div className="h-12 rounded-xl bg-white/[0.04]" />
          <div className="h-12 rounded-xl bg-white/[0.04]" />
          <div className="h-12 rounded-xl bg-white/[0.04]" />
          <div className="h-12 rounded-xl bg-white/[0.04]" />
        </div>

        <div className="h-32 rounded-xl bg-white/[0.03] w-full" />
        <div className="w-full h-14 rounded-full bg-white/[0.06]" />
      </div>
    </div>
  );
}
