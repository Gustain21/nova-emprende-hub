import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import WhatIsSection from "@/components/sections/WhatIsSection";
import EbookHighlightSection from "@/components/sections/EbookHighlightSection";
import ProductsSection from "@/components/sections/ProductsSection";
import PacksSection from "@/components/sections/PacksSection";
import TestimonialsPreview from "@/components/sections/TestimonialsPreview";
import FaqSection from "@/components/sections/FaqSection";
import CTASection from "@/components/sections/CTASection";
import DiagnosticCTA from "@/components/sections/DiagnosticCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <WhatIsSection />
        <section className="brand-container pb-4">
          <DiagnosticCTA source="inicio" />
        </section>
        <EbookHighlightSection />
        <ProductsSection />
        <PacksSection />
        <TestimonialsPreview />
        <FaqSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
