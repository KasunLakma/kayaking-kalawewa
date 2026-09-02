import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Resort Safety Charter | Kayaking Kalawewa Adventures',
  description: 'Safety gear standards, certified naturalist guides, and wildlife non-interference protocols for eco-kayaking charters on Kalawewa Lake.',
};

export default function SafetyPage() {
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
            WILDERNESS EXCELLENCE
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#f3efe6] font-normal mb-8">
            Resort Safety Charter
          </h1>

          <div className="space-y-6 text-stone-300">
            <p className="text-stone-400 text-sm leading-relaxed border-l-2 border-[#d4af37] pl-4 italic">
              Guest safety and ecological stewardship are the foundational pillars of Kayaking Kalawewa Adventures. Our safety charter guarantees uncompromising equipment, guide accreditation, and wildlife protection standards across every expedition.
            </p>

            {/* Section 1 */}
            <h2 className="text-[#d4af37] font-serif text-2xl mb-4 mt-8">
              1. Safety Gear Standards
            </h2>
            <p>
              All marine equipment undergoes rigorous daily inspection and conforms to international water safety guidelines:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-stone-300">
              <li>
                <strong className="text-stone-200 font-medium">Certified Flotation Gear:</strong> Mandatory USCG/CE-certified life jackets and buoyant gear fitted individually for all passengers prior to lake departure.
              </li>
              <li>
                <strong className="text-stone-200 font-medium">Vessel Maintenance &amp; Dry Bags:</strong> Double-hulled, high-buoyancy ocean/lake kayaks equipped with watertight dry bags, emergency whistles, and towlines.
              </li>
            </ul>

            {/* Section 2 */}
            <h2 className="text-[#d4af37] font-serif text-2xl mb-4 mt-8">
              2. Certified Escort &amp; Hydrology Expertise
            </h2>
            <p>
              Navigating Kalawewa Reservoir requires deep local knowledge of seasonal water currents, wind patterns, and spillway hydrology.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-stone-300">
              <li>
                <strong className="text-stone-200 font-medium">Licensed Naturalist Escorts:</strong> All charters are escorted by certified local naturalists trained in wilderness first aid, CPR, and Kalawewa hydrology.
              </li>
              <li>
                <strong className="text-stone-200 font-medium">Base Station Radio Contact:</strong> Safety escorts maintain continuous VHF/radio communication with lakefront base stations and regional wildlife rescue personnel.
              </li>
            </ul>

            {/* Section 3 */}
            <h2 className="text-[#d4af37] font-serif text-2xl mb-4 mt-8">
              3. Wildlife Protocol &amp; Safe Perimeters
            </h2>
            <p>
              Kalawewa is home to magnificent wild Asian elephants, mugger crocodiles, and over 140 species of endemic waterbirds.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-stone-300">
              <li>
                <strong className="text-stone-200 font-medium">100-Meter Elephant Safety Perimeter:</strong> A strict 100-meter non-motorized safety perimeter is maintained from wild Asian elephant corridors and shoreline feeding grounds.
              </li>
              <li>
                <strong className="text-stone-200 font-medium">Nesting Sanctuary Quiet Zones:</strong> Paddlers observe silent non-intrusive navigation when approaching lotus nesting bays to protect roosting waterfowl.
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
