import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

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
  title: "Kayaking Kalawewa | 5-Star Luxury Eco-Resort Expeditions",
  description: "Experience 5-star luxury kayaking expeditions on King Dhatusena's ancient 5th-century reservoir in Kalawewa, Sri Lanka. Guided by certified local naturalists.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${plusJakartaSans.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#0B1914] text-[#F4F1EA] selection:bg-[#C8A97E] selection:text-[#0B1914]">
        {children}
      </body>
    </html>
  );
}
