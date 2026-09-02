import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy | Kayaking Kalawewa Adventures',
  description: 'Privacy policy, data protection, and customer information handling practices for Kayaking Kalawewa Adventures.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#07130E] text-stone-300 font-sans flex flex-col justify-between overflow-x-hidden">
      <Header />

      <main className="flex-1 w-full py-20 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto font-light leading-relaxed">
          {/* Back to Home Link */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-stone-300 hover:text-[#d4af37] text-xs font-semibold tracking-wider uppercase transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#d4af37]/40 bg-white/[0.02]"
            >
              <span>←</span>
              <span>BACK TO HOME</span>
            </Link>
          </div>

          {/* Title Header */}
          <span className="text-xs font-semibold tracking-[0.25em] text-[#d4af37] uppercase block mb-2">
            DATA SAFEGUARDS
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#f3efe6] font-normal mb-8">
            Privacy Policy
          </h1>

          <div className="space-y-6 text-stone-300">
            <p className="text-stone-400 text-sm leading-relaxed border-l-2 border-[#d4af37] pl-4 italic">
              Kayaking Kalawewa Adventures is committed to protecting your personal information. This privacy policy explains how customer details are collected, stored, and utilized for expedition logistics and safety alerts.
            </p>

            {/* Section 1 */}
            <h2 className="text-[#d4af37] font-serif text-2xl mb-4 mt-8">
              1. Information Collection
            </h2>
            <p>
              When reserving an expedition through our platform or concierge, we gather essential contact and party details solely for expedition logistics:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-stone-300">
              <li>
                <strong className="text-stone-200 font-medium">Personal Information:</strong> Full name, WhatsApp phone number, and email address.
              </li>
              <li>
                <strong className="text-stone-200 font-medium">Logistical Details:</strong> Party size, selected expedition date, preferred time slot, kayak model preference, and special requests.
              </li>
            </ul>

            {/* Section 2 */}
            <h2 className="text-[#d4af37] font-serif text-2xl mb-4 mt-8">
              2. Data Usage &amp; Dispatch
            </h2>
            <p>
              All customer data is processed exclusively to coordinate your kayak tour, safety alerts, and booking dispatch:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-stone-300">
              <li>
                <strong className="text-stone-200 font-medium">Booking Management:</strong> Information is securely stored in Google Cloud Firestore to manage reservation schedules and dock check-in verification.
              </li>
              <li>
                <strong className="text-stone-200 font-medium">Confirmation Emails:</strong> Real-time confirmation receipts and itinerary details are sent via Resend email API.
              </li>
              <li>
                <strong className="text-stone-200 font-medium">Strict Non-Disclosure:</strong> No customer information is ever sold, rented, or shared with third-party advertisers or external marketing networks.
              </li>
            </ul>

            {/* Section 3 */}
            <h2 className="text-[#d4af37] font-serif text-2xl mb-4 mt-8">
              3. Security Practices
            </h2>
            <p>
              We implement industry-standard security protocols, data encryption, and restricted database access controls to safeguard guest information against unauthorized disclosure.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
