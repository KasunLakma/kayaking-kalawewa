import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Terms of Service | Kayaking Kalawewa Adventures',
  description: 'Terms of service, booking policies, cancellation rules, and guest conduct standards for eco-kayaking expeditions on Kalawewa Reservoir.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#07130E] text-stone-300 font-sans flex flex-col justify-between overflow-x-hidden">
      <Header />

      <main className="flex-1 w-full py-20 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto font-light leading-relaxed">
          {/* Back to Home Link */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-stone-400 hover:text-[#d4af37] text-xs font-semibold tracking-[0.2em] uppercase transition-colors"
            >
              <span>←</span>
              <span>BACK TO HOME</span>
            </Link>
          </div>

          {/* Title Header */}
          <span className="text-xs font-semibold tracking-[0.25em] text-[#d4af37] uppercase block mb-2">
            EXPEDITION GOVERNANCE
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#f3efe6] font-normal mb-8">
            Terms of Service
          </h1>

          <div className="space-y-6 text-stone-300">
            <p className="text-stone-400 text-sm leading-relaxed border-l-2 border-[#d4af37] pl-4 italic">
              Welcome to Kayaking Kalawewa Adventures. By reserving or participating in any kayak charter across the ancient waters of Kalawewa Reservoir, you agree to adhere to the terms and environmental standards outlined below.
            </p>

            {/* Section 1 */}
            <h2 className="text-[#d4af37] font-serif text-2xl mb-4 mt-8">
              1. Booking &amp; Reservations
            </h2>
            <p>
              To maintain low-impact wilderness sanctuary standards and ensure guide availability, advance reservation is required for all guided morning, sunset, and elephant corridor expeditions.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-stone-300">
              <li>
                <strong className="text-stone-200 font-medium">Cash on Arrival (COD) Settlement:</strong> All charters operate under a zero upfront deposit policy. Payments are settled in cash (LKR or major foreign currencies) or direct bank transfer upon arrival at our launching dock.
              </li>
              <li>
                <strong className="text-stone-200 font-medium">Check-In Confirmation:</strong> Guests are requested to arrive at the designated Kalawewa lakefront station 15 minutes prior to scheduled departure for safety briefings and gear fitting.
              </li>
            </ul>

            {/* Section 2 */}
            <h2 className="text-[#d4af37] font-serif text-2xl mb-4 mt-8">
              2. Cancellation &amp; Weather Policy
            </h2>
            <p>
              Wilderness safety is our primary imperative. We accommodate flexible travel plans while safeguarding lake ecosystems and passenger safety.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-stone-300">
              <li>
                <strong className="text-stone-200 font-medium">Free Cancellation:</strong> Guests may cancel or modify their reservation free of charge up to 24 hours prior to departure via phone or WhatsApp.
              </li>
              <li>
                <strong className="text-stone-200 font-medium">Weather &amp; Hydrology Overrides:</strong> In the event of severe rain, gale force winds, or spillway discharge notices issued by Department of Wildlife &amp; Irrigation authorities, charters will be automatically rescheduled or released without penalty.
              </li>
            </ul>

            {/* Section 3 */}
            <h2 className="text-[#d4af37] font-serif text-2xl mb-4 mt-8">
              3. Guest Conduct &amp; Environmental Protection
            </h2>
            <p>
              Kalawewa is a sanctuary of immense historical and biological significance. All participants must strictly respect ecosystem protocols.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-stone-300">
              <li>
                <strong className="text-stone-200 font-medium">Zero Single-Use Plastic Rule:</strong> Disposable plastic bottles, food wrappers, and synthetic litter are strictly prohibited aboard all kayaks. Reusable metal water bottles are provided.
              </li>
              <li>
                <strong className="text-stone-200 font-medium">5th-Century Irrigation Heritage Protection:</strong> Respect must be maintained near ancient stone sluice gates (Bisokotuwa) and historical embankment structures. No climbing or defacing heritage monuments.
              </li>
              <li>
                <strong className="text-stone-200 font-medium">Wildlife Non-Harassment Policy:</strong> Active non-interference protocols apply to endemic waterbirds, raptors, and wild Asian elephants. Loud noise, feeding, or approaching wildlife beyond guide perimeters is strictly forbidden.
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
