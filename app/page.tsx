import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import DestinationsSlider from "@/components/DestinationsSlider";
import CustomJourneys from "@/components/CustomJourneys";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B1914] text-[#F4F1EA] font-sans selection:bg-[#C8A97E] selection:text-[#0B1914] overflow-x-hidden">
      {/* 1. Navigation Header */}
      <Header />

      <main className="w-full">
        {/* 2. Wilderness-style Dynamic Hero Section */}
        <Hero />

        {/* 3. Editorial Split About Section */}
        <AboutSection />

        {/* 4. Interactive Wilderness Destinations Slider */}
        <DestinationsSlider />

        {/* 5. Bespoke Custom Expeditions Section */}
        <CustomJourneys />
      </main>

      {/* 6. Wilderness Travel Footer */}
      <Footer />
    </div>
  );
}
