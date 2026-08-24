'use client';

import React, { useState } from 'react';
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import QuickBookingBar from "@/components/QuickBookingBar";
import AboutSection from "@/components/AboutSection";
import DestinationsSlider from "@/components/DestinationsSlider";
import CustomJourneys from "@/components/CustomJourneys";
import ExperiencePortals from "@/components/ExperiencePortals";
import ImpactSection from "@/components/ImpactSection";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { packages } from "@/data/packages";

export default function Home() {
  const [activeBookingState, setActiveBookingState] = useState<{
    packageId: string;
    date?: string;
    slot?: string;
    guests?: number;
  } | null>(null);

  const handleOpenBooking = (
    packageId?: string,
    date?: string,
    slot?: string,
    guests?: number
  ) => {
    setActiveBookingState({
      packageId: packageId || packages[0].id,
      date,
      slot,
      guests,
    });
  };

  return (
    <div className="min-h-screen bg-[#0B1914] text-[#F4F1EA] font-sans selection:bg-[#C8A97E] selection:text-[#0B1914] overflow-x-hidden">
      {/* 1. Minimalist Header */}
      <Header onOpenBooking={() => handleOpenBooking()} />

      <main className="w-full">
        {/* 2. Fullscreen Cinematic Hero */}
        <Hero />

        {/* 3. Sleek Floating Quick Booking Bar (Below Hero) */}
        <QuickBookingBar
          onCheckAvailability={(pkgId, date, slot, guests) =>
            handleOpenBooking(pkgId, date, slot, guests)
          }
        />

        {/* 4. Editorial Split About Section */}
        <AboutSection />

        {/* 5. Infinite Auto-Play Warm Taupe Destinations Slider */}
        <DestinationsSlider onSelectPackage={(pkgId) => handleOpenBooking(pkgId)} />

        {/* 6. Bespoke Two-Stage Scroll Reveal Custom Journeys */}
        <CustomJourneys />

        {/* 7. Signature Circular Experience Portals */}
        <ExperiencePortals />

        {/* 8. Conservation & Wetland Heritage Impact Section */}
        <ImpactSection />

        {/* 9. Luxury 3-Card Customer Testimonials Section (Above Footer) */}
        <Testimonials />
      </main>

      {/* 10. Luxury Dark Wilderness Footer */}
      <Footer />

      {/* Booking Modal Popup */}
      {activeBookingState && (
        <BookingModal
          isOpen={true}
          selectedPackageId={activeBookingState.packageId}
          selectedDate={activeBookingState.date}
          selectedTimeSlot={activeBookingState.slot}
          selectedGuestCount={activeBookingState.guests}
          onClose={() => setActiveBookingState(null)}
        />
      )}
    </div>
  );
}

