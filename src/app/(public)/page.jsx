import CategoryHighlightWrapper from "@/components/CategoryHighlightWrapper";
import CategorySection from "@/components/CategorySection";
import FAQ from "@/components/FAQ";
import HeroBanner from "@/components/HeroBanner";
import LoopLine from "@/components/LoopLine";


export default function Home() {
  return (
    <div className="min-h-screen">
      <LoopLine />
      <HeroBanner />
      <CategorySection />
      <CategoryHighlightWrapper />
      <FAQ/>
    </div>
  );
}
