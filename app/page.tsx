import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import DestinationsSlider from "@/components/DestinationsSlider";
import CustomJourneys from "@/components/CustomJourneys";
import ExperiencePortals from "@/components/ExperiencePortals";
import ImpactSection from "@/components/ImpactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B1914] text-[#F4F1EA] font-sans selection:bg-[#C8A97E] selection:text-[#0B1914] overflow-x-hidden">
      {/* 1. Minimalist Header */}
      <Header />

      <main className="w-full">
        {/* 2. Fullscreen Cinematic Hero */}
        <Hero />

        {/* 3. Editorial Split About Section */}
        <AboutSection />

        {/* 4. Infinite Auto-Play Warm Taupe Destinations Slider */}
        <DestinationsSlider />

        {/* 5. Bespoke Two-Stage Scroll Reveal Custom Journeys */}
        <CustomJourneys />

        {/* 6. Signature Circular Experience Portals */}
        <ExperiencePortals />

        {/* 7. Conservation & Wetland Heritage Impact Section */}
        <ImpactSection />
      </main>

      {/* 8. Luxury Dark Wilderness Footer */}
      <Footer />
    </div>
  );
}
