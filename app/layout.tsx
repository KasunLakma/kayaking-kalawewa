import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import TrackingPixels from "@/components/TrackingPixels";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kayaking Kalawewa Adventures & Expeditions | Eco Tours Sri Lanka",
  description: "Book eco-adventure kayaking tours, sunrise/sunset paddling, and wildlife expeditions on the ancient 5th-century Kalawewa reservoir.",
  keywords: [
    "Kayaking in Kalawewa",
    "Kalawewa Adventure Tours",
    "Water sports Anuradhapura Sri Lanka",
    "Kayaking Kalawewa Adventures & Expeditions",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${plusJakartaSans.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#0B1914] text-[#F4F1EA] selection:bg-[#C8A97E] selection:text-[#0B1914]">
        <TrackingPixels />
        {children}
      </body>
    </html>
  );
}
