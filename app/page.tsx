import { Navbar } from "@/components/landing-page/Navbar";
import { HeroSection } from "@/components/landing-page/HeroSection";
import { ProblemSection } from "@/components/landing-page/ProblemSection";
import { SolutionSection } from "@/components/landing-page/SolutionSection";
import { ProductScreenshotSection } from "@/components/landing-page/ProductScreenshotSection";
import { FeaturesSection } from "@/components/landing-page/FeaturesSection";
import { HowItWorksSection } from "@/components/landing-page/HowItWorksSection";
import { PricingSection } from "@/components/landing-page/PricingSection";
import { FAQSection } from "@/components/landing-page/FAQSection";
import { FinalCTASection } from "@/components/landing-page/FinalCTASection";
import { Footer } from "@/components/landing-page/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black selection:bg-indigo-500/30">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <ProductScreenshotSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
