'use client';

import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#07130E] text-[#F4F1EA] flex flex-col md:flex-row font-sans">
      {/* Sleek Vertical Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Workspace */}
      <div className="flex-1 overflow-x-hidden min-w-0">
        {children}
      </div>
    </div>
  );
}
