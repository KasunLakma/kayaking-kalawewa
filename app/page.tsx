import Hero from "@/components/Hero";
import PackageGrid from "@/components/PackageGrid";
import SafetySection from "@/components/SafetySection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0F2C23]">
      <Hero />
      <PackageGrid />
      <SafetySection />
    </main>
  );
}


