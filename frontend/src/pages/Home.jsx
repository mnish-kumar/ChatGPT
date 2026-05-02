import Navbar from "../components/Navbar";
import Benefits from "@/components/home/Benefits";
import CTASection from "@/components/home/CTASection";
import FeatureSplit from "@/components/home/FeatureSplit";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#F1F0E8] font-sans text-slate-900 antialiased">
      <div className="pt-4">
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
