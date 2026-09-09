import React from 'react';

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#07130E] text-[#F4F1EA] p-6 sm:p-8 lg:p-10 space-y-8">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-2">
          <div className="w-64 h-8 rounded-xl bg-white/[0.03] border border-white/5 animate-pulse" />
          <div className="w-48 h-4 rounded bg-white/[0.03] border border-white/5 animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-28 h-10 rounded-xl bg-white/[0.03] border border-white/5 animate-pulse" />
          <div className="w-36 h-10 rounded-xl bg-white/[0.03] border border-white/5 animate-pulse" />
        </div>
      </div>

      {/* Metric Cards Skeleton Grid (4 Key Performance Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-white/[0.03] animate-pulse border border-white/5 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-24 h-3.5 rounded bg-white/[0.04]" />
              <div className="w-8 h-8 rounded-lg bg-white/[0.05]" />
            </div>
            <div className="w-32 h-8 rounded-lg bg-white/[0.06]" />
            <div className="w-40 h-3 rounded bg-white/[0.03]" />
          </div>
        ))}
      </div>

      {/* Sub-navigation / Filter Bar Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 animate-pulse">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((tab) => (
            <div key={tab} className="w-24 h-9 rounded-xl bg-white/[0.04]" />
          ))}
        </div>
        <div className="w-64 h-10 rounded-xl bg-white/[0.04]" />
      </div>

      {/* Data Management Table Skeleton Card */}
      <div className="bg-white/[0.03] animate-pulse border border-white/5 rounded-2xl p-6 space-y-6">
        {/* Table Header Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="w-48 h-6 rounded-lg bg-white/[0.05]" />
          <div className="w-32 h-8 rounded-lg bg-white/[0.04]" />
        </div>

        {/* Skeleton Rows */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((row) => (
            <div
              key={row}
              className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/[0.04] shrink-0" />
                <div className="space-y-1.5">
                  <div className="w-40 h-4 rounded bg-white/[0.05]" />
                  <div className="w-28 h-3 rounded bg-white/[0.03]" />
                </div>
              </div>
              <div className="hidden sm:block space-y-1.5">
                <div className="w-24 h-4 rounded bg-white/[0.04]" />
                <div className="w-16 h-3 rounded bg-white/[0.02]" />
              </div>
              <div className="w-20 h-7 rounded-full bg-white/[0.05]" />
              <div className="w-8 h-8 rounded-lg bg-white/[0.04]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
