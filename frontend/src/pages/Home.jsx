import Navbar from "../components/Navbar";
import NavbarSkeleton from "../components/skeletons/NavbarSkeleton";
import HeroSkeleton from "../components/skeletons/HeroSkeleton";
import FeatureSplitSkeleton from "../components/skeletons/FeatureSplitSkeleton";
import Benefits from "@/components/home/Benefits";
import CTASection from "@/components/home/CTASection";
import FeatureSplit from "@/components/home/FeatureSplit";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import { useSelector } from "react-redux";

const Home = () => {

  const { isLoading } = useSelector((state) => state.user);

   if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1F0E8] font-sans text-slate-900 antialiased">
        <div className="pt-16">
          <NavbarSkeleton />
        </div>
        <main className="relative">
          <HeroSkeleton />
          <FeatureSplitSkeleton />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F1F0E8] font-sans text-slate-900 antialiased">
      <div className="pt-16">
        <Navbar />
      </div>

      <main className="relative">
        <Hero />
        <FeatureSplit />
        <HowItWorks />
        <Benefits />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
