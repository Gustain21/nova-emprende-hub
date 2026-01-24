import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ProductsSection from "@/components/sections/ProductsSection";
import PacksSection from "@/components/sections/PacksSection";
import TestimonialsPreview from "@/components/sections/TestimonialsPreview";
import CTASection from "@/components/sections/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ProductsSection />
        <PacksSection />
        <TestimonialsPreview />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
