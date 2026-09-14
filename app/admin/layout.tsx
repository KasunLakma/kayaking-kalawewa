'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const checkAuthStatus = () => {
    if (typeof window !== 'undefined') {
      const isAuth =
        sessionStorage.getItem('isAdminAuthenticated') === 'true' ||
        sessionStorage.getItem('admin_authenticated') === 'true' ||
        sessionStorage.getItem('kalawewa_admin_auth') === 'true' ||
        Boolean(sessionStorage.getItem('staff_authorized_email')) ||
        Boolean(sessionStorage.getItem('kalawewa_staff_email'));
      setIsAuthenticated(isAuth);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    setIsMounted(true);

    const handleAuthEvent = () => checkAuthStatus();

    window.addEventListener('storage', handleAuthEvent);
    window.addEventListener('admin_auth_changed', handleAuthEvent);

    return () => {
      window.removeEventListener('storage', handleAuthEvent);
      window.removeEventListener('admin_auth_changed', handleAuthEvent);
    };
  }, []);

  // Hydration check with brief loading state to prevent sidebar flickering
  if (!isMounted) {
    return (
      <div className="min-h-screen w-full bg-[#07130E] text-[#F4F1EA] flex items-center justify-center p-4 font-sans">
        <div className="text-center font-mono text-xs text-[#C8A97E] tracking-widest animate-pulse">
          VERIFYING OPERATOR ACCESS...
        </div>
      </div>
    );
  }

  // Unauthenticated layout: Centered login card without AdminSidebar
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-[#07130E] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    );
  }

  // Authenticated layout: AdminSidebar + Main Content Workspace
  return (
    <div className="flex min-h-screen bg-[#07130E] text-[#F4F1EA] flex-col md:flex-row font-sans">
      {/* Sleek Vertical Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Workspace */}
      <div className="flex-1 overflow-x-hidden min-w-0">
        {children}
      </div>
    </div>
  );
}
