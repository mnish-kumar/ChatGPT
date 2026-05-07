import Navbar from "../components/Navbar";
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
      <div className="flex items-center justify-center h-screen bg-chart-1 text-accent-foreground">
        <p>Loading...</p>
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
