
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import NewsFeed from "@/components/NewsFeed";
import FaqCard from "@/components/FaqCard";
import Benefits from "@/components/Benefits";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Benefits />
        <Stats />
        <NewsFeed />
        <Testimonials />
        <div className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <FaqCard />
            </div>
          </div>
        </div>
        <Contact />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
