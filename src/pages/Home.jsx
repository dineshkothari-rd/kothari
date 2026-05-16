import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import RoomsPreview from "../components/home/RoomsPreview";
import TestimonialsSection from "../components/home/TestimonialsSection";
import FAQSection from "../components/home/FAQSection";
import CTASection from "../components/home/CTASection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <RoomsPreview />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
