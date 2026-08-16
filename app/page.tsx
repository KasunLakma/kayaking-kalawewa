import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import FeaturedTrips from "@/components/FeaturedTrips";
import WildernessDifference from "@/components/WildernessDifference";
import SafetySection from "@/components/SafetySection";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B1914] text-[#F4F1EA] font-sans selection:bg-[#C8A97E] selection:text-[#0B1914] overflow-x-hidden">
      {/* 1. Navigation Header */}
      <Header />

      <main className="w-full">
        {/* 2. Wilderness-style Dynamic Hero Section */}
        <Hero />

        {/* Editorial Split About Section */}
        <AboutSection />

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
