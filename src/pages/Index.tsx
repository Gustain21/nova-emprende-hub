import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/Seo";
import HeroSection from "@/components/sections/HeroSection";
import WhatIsSection from "@/components/sections/WhatIsSection";
import EbookHighlightSection from "@/components/sections/EbookHighlightSection";
import ProductsSection from "@/components/sections/ProductsSection";
import PacksSection from "@/components/sections/PacksSection";
import TestimonialsPreview from "@/components/sections/TestimonialsPreview";
import FaqSection from "@/components/sections/FaqSection";
import CTASection from "@/components/sections/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Nova Emprende | Método y herramientas para emprender"
        description="Método, libro y herramientas digitales para convertir tu idea en un negocio estructurado y rentable."
      />
      <Header />
      <main>
        <HeroSection />
        <WhatIsSection />
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
