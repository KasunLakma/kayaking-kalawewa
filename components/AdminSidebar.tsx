'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ClipboardList,
  UserCheck,
  Mail,
  Anchor,
  Users,
  Shield,
  Sliders,
  Home,
  Lock,
  RefreshCw,
  Zap,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

interface AdminSidebarProps {
  onRefresh?: () => void;
  onLogout?: () => void;
  onOpenWeatherOverride?: () => void;
}

export default function AdminSidebar({
  onRefresh,
  onLogout,
  onOpenWeatherOverride,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navGroups = [
    {
      category: 'OPERATIONS',
      items: [
        {
          label: 'Reservations',
          href: '/admin',
          icon: ClipboardList,
          active: pathname === '/admin',
        },
        {
          label: 'Customer Directory',
          href: '/admin/customers',
          icon: UserCheck,
          active: pathname === '/admin/customers' || pathname?.startsWith('/admin/customers'),
        },
        {
          label: 'Inquiries',
          href: '/admin/inquiries',
          icon: Mail,
          active: pathname === '/admin/inquiries' || pathname?.startsWith('/admin/inquiries'),
        },
      ],
    },
    {
      category: 'ASSETS & TEAM',
      items: [
        {
          label: 'Kayak Fleet',
          href: '/admin/fleet',
          icon: Anchor,
          active: pathname === '/admin/fleet' || pathname === '/admin/vehicles',
        },
        {
          label: 'Staff Management',
          href: '/admin/staff',
          icon: Users,
          active: pathname === '/admin/staff',
        },
      ],
    },
    {
      category: 'SYSTEM',
      items: [
        {
          label: 'Roles & Permissions',
          href: '/admin/roles',
          icon: Shield,
          active: pathname === '/admin/roles' || pathname === '/admin/settings/roles',
        },
        {
          label: 'General Settings',
          href: '/admin/settings',
          icon: Sliders,
          active: pathname === '/admin/settings',
        },
      ],
    },
  ];

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else if (typeof window !== 'undefined') {
      sessionStorage.removeItem('admin_authenticated');
      window.location.reload();
    }
  };

  const SidebarContent = (
    <div className="flex flex-col justify-between h-full space-y-6">
      {/* Brand Header & System Status */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex flex-col group">
            <span className="font-serif text-xl font-normal tracking-[0.2em] text-[#F4F1EA] group-hover:text-[#d4af37] transition-colors">
              KALAWEWA
            </span>
            <span className="text-[9px] font-semibold tracking-[0.25em] text-[#C8A97E] uppercase">
              OPERATIONS PORTAL
            </span>
          </Link>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-stone-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Operational Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-medium w-full">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="truncate">All Systems Operational</span>
        </div>
      </div>

      {/* Categorized Vertical Navigation Menu */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-1 no-scrollbar">
        {navGroups.map((group) => (
          <div key={group.category} className="space-y-2">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-500 px-3">
              {group.category}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      item.active
                        ? 'bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 shadow-sm font-semibold'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${item.active ? 'text-[#d4af37]' : 'text-stone-400 group-hover:text-stone-200'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.active && <ChevronRight className="w-3.5 h-3.5 text-[#d4af37]" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Footer Controls */}
      <div className="pt-4 border-t border-white/10 space-y-2">
        {onOpenWeatherOverride && (
          <button
            onClick={onOpenWeatherOverride}
            className="w-full px-3 py-2 bg-amber-600/15 border border-amber-500/40 hover:bg-amber-600/30 text-amber-300 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            title="Enforce Emergency Weather or Water Slot Override"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Weather Override</span>
          </button>
        )}

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex-1 px-3 py-2 border border-white/10 hover:border-[#d4af37]/40 text-stone-300 hover:text-white rounded-xl transition-all text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 bg-white/[0.02]"
            title="Return to Customer Website"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Website</span>
          </Link>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 border border-white/10 hover:border-[#d4af37]/40 text-stone-300 hover:text-white rounded-xl transition-all text-xs bg-white/[0.02] cursor-pointer"
              title="Refresh Data Feed"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleLogoutClick}
            className="p-2 border border-white/10 hover:border-red-400/50 text-stone-300 hover:text-red-400 rounded-xl transition-all text-xs bg-white/[0.02] cursor-pointer"
            title="Lock Security Session"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header Toggle Bar */}
      <div className="md:hidden sticky top-0 z-40 bg-[#08140F]/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between w-full">
        <Link href="/" className="flex flex-col">
          <span className="font-serif text-lg tracking-[0.2em] text-[#F4F1EA]">KALAWEWA</span>
          <span className="text-[8px] tracking-[0.2em] text-[#C8A97E] uppercase">PORTAL</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 border border-white/10 rounded-xl text-stone-300 hover:text-white bg-white/[0.02]"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Vertical Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#08140F] border-r border-white/10 min-h-screen p-5 flex-col justify-between shrink-0 sticky top-0 h-screen">
        {SidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex">
          <div className="w-72 bg-[#08140F] border-r border-white/10 h-full p-5 flex flex-col justify-between shadow-2xl">
            {SidebarContent}
          </div>
          <div className="flex-1" onClick={() => setIsMobileOpen(false)} />
        </div>
      )}
    </>
  );
}
