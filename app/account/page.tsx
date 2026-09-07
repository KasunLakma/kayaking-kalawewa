'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { getUserBookingsFromFirestore, BookingDocument } from '@/lib/firebase';

export default function CustomerAccountPage() {
  const { userProfile, loading, signOut, updateCustomerProfile } = useAuth();
  const [userBookings, setUserBookings] = useState<BookingDocument[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileMsg, setProfileMsg] = useState('');

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.fullName || '');
      setPhone(userProfile.phone || '');
      setIsLoadingBookings(true);
      getUserBookingsFromFirestore(userProfile.uid)
        .then((bookings) => {
          setUserBookings(bookings || []);
        })
        .finally(() => setIsLoadingBookings(false));
    }
  }, [userProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg('');
    try {
      await updateCustomerProfile(fullName, phone);
      setProfileMsg('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setProfileMsg('Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07110E] text-stone-200 flex flex-col justify-between">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-24 text-xs font-mono tracking-widest text-[#d4af37]">
          VERIFYING SANCTUARY IDENTITY...
        </div>
        <Footer />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-[#07110E] text-stone-200 flex flex-col justify-between">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-32 pb-16 px-4">
          <div className="max-w-md w-full bg-[#0B1914] text-[#F4F1EA] rounded-3xl border border-white/10 p-8 text-center shadow-2xl">
            <span className="text-3xl mb-3 block">🛡️</span>
            <h2 className="font-serif text-2xl font-light text-white mb-2">Customer Account Access</h2>
            <p className="text-xs text-stone-300 mb-6 font-light">
              Please sign in to view your expedition reservations, customer history, and profile.
            </p>
            <Link
              href="/auth/signin?callbackUrl=/account"
              className="inline-block bg-[#d4af37] text-[#0B1914] px-8 py-3 rounded-xl font-semibold text-xs uppercase tracking-widest hover:bg-[#c59e2b] transition-all shadow-lg"
            >
              Sign In to Sanctuary Account
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07110E] text-[#F4F1EA] font-sans flex flex-col justify-between overflow-x-hidden">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        
        {/* Top Banner */}
        <div className="bg-[#0B1914] rounded-3xl border border-white/10 p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-80" />
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-2xl text-[#d4af37]">
              👤
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#d4af37] uppercase bg-[#d4af37]/10 px-2.5 py-0.5 rounded-full border border-[#d4af37]/20">
                  {userProfile.role.toUpperCase()} PROFILE
                </span>
                <span className="text-[10px] font-mono text-stone-400">UID: {userProfile.uid.slice(0, 12)}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl text-white font-light tracking-wide mt-1">
                {userProfile.fullName}
              </h1>
              <p className="text-xs text-stone-400 font-light">{userProfile.email} • {userProfile.phone || 'No phone recorded'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#d4af37] text-xs text-stone-300 hover:text-white rounded-xl transition-all cursor-pointer font-medium"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-xs text-red-200 rounded-xl transition-all cursor-pointer font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Profile Edit Form */}
        {isEditing && (
          <div className="bg-[#0B1914] rounded-3xl border border-white/10 p-6 mb-8 shadow-xl">
            <h3 className="text-sm font-semibold text-[#d4af37] uppercase tracking-wider mb-4">
              Update Customer Information
            </h3>
            {profileMsg && <div className="mb-4 text-xs text-emerald-400 font-medium">{profileMsg}</div>}
            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/15 focus:border-[#d4af37] text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-1">
                  WhatsApp Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/15 focus:border-[#d4af37] text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="bg-[#d4af37] text-[#0B1914] font-semibold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider hover:bg-[#c59e2b] transition-all cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reservations Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl text-white font-light">My Expedition Booking History</h2>
            <p className="text-xs text-stone-400 font-light mt-0.5">
              All active reservations and past kayaking journeys tied to your account
            </p>
          </div>
          <Link
            href="/booking"
            className="bg-[#d4af37] text-[#0B1914] px-5 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider hover:bg-[#c59e2b] transition-all shadow-md inline-flex items-center gap-2"
          >
            <span>+ Book New Expedition</span>
          </Link>
        </div>

        {/* Reservations List */}
        {isLoadingBookings ? (
          <div className="py-16 text-center text-xs font-mono text-stone-400 tracking-widest uppercase">
            Fetching reservation history...
          </div>
        ) : userBookings.length === 0 ? (
          <div className="bg-[#0B1914] rounded-3xl border border-white/10 p-12 text-center shadow-xl">
            <span className="text-4xl block mb-3 opacity-60">🚣‍♂️</span>
            <h3 className="font-serif text-xl text-white font-light mb-2">No Active Reservations Found</h3>
            <p className="text-xs text-stone-400 font-light mb-6 max-w-md mx-auto">
              You haven't completed any expedition reservations under this email yet. Explore our curated sanctuary paddle tours today!
            </p>
            <Link
              href="/booking"
              className="inline-block bg-[#d4af37] text-[#0B1914] px-6 py-3 rounded-xl font-semibold text-xs uppercase tracking-widest hover:bg-[#c59e2b] transition-all"
            >
              Reserve Expedition Slot Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {userBookings.map((b) => {
              const whatsappMsg = encodeURIComponent(
                `Hi Kalawewa Concierge! I have a question regarding my reservation Ref #${b.bookingId} (${b.packageName}) on ${b.selectedDate}.`
              );
              return (
                <div
                  key={b.docId || b.bookingId}
                  className="bg-[#0B1914] rounded-3xl border border-white/10 p-6 shadow-xl hover:border-[#d4af37]/40 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-4 mb-4 gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-[#d4af37]">
                          REF: #{b.bookingId}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            b.orderStatus === 'CONFIRMED'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : b.orderStatus === 'CANCELLED'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {b.orderStatus}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl text-white font-normal mt-1">
                        {b.packageName}
                      </h3>
                    </div>

                    <div className="text-left md:text-right">
                      <span className="text-[10px] font-mono text-stone-400 block uppercase">
                        TOTAL ESTIMATED AMOUNT
                      </span>
                      <span className="font-serif text-xl font-bold text-[#d4af37]">
                        LKR {b.totalAmountLKR.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-stone-400 uppercase block mb-0.5">
                        Expedition Date
                      </span>
                      <span className="font-semibold text-white">{b.selectedDate}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-stone-400 uppercase block mb-0.5">
                        Time Slot
                      </span>
                      <span className="font-semibold text-white">{b.timeSlot}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-stone-400 uppercase block mb-0.5">
                        Guests & Kayak
                      </span>
                      <span className="font-semibold text-white">
                        {b.guestCount} Guest{b.guestCount > 1 ? 's' : ''} ({b.kayakType || 'Single'})
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-stone-400 uppercase block mb-0.5">
                        Payment Method
                      </span>
                      <span className="font-semibold text-white">
                        {b.paymentMethod === 'COD' ? 'Cash on Arrival' : 'Bank Transfer'}
                      </span>
                    </div>
                  </div>

                  {b.customer.notes && (
                    <div className="mt-4 pt-3 border-t border-white/5 text-xs text-stone-400 font-light">
                      <span className="text-[#d4af37] font-medium">Special Requests:</span> {b.customer.notes}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-stone-400">
                      Booked on: {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                    <a
                      href={`https://wa.me/94771234567?text=${whatsappMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <span>💬 WhatsApp Concierge Support</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
