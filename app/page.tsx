import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedTrips from "@/components/FeaturedTrips";
import WildernessDifference from "@/components/WildernessDifference";
import SafetySection from "@/components/SafetySection";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#071410] text-slate-200 font-sans selection:bg-[#D4AF37] selection:text-[#071410] overflow-x-hidden">
      {/* 1. Navigation Header */}
      <Header />

      <main className="w-full">
        {/* 2. Wilderness-style Dynamic Hero Section */}
        <Hero />

        {/* 3. Featured Expeditions Section */}
        <FeaturedTrips />

        {/* 4. The Kalawewa Difference (Safety & Heritage Pillars) */}
        <WildernessDifference />

        {/* 5. Comprehensive Safety Assurance & Eco Guidelines */}
        <SafetySection />

        {/* 6. Guest Stories & Testimonials */}
        <Testimonials />
      </main>

      {/* 7. Full Wilderness Travel Footer */}
      <Footer />
    </div>
  );
}
