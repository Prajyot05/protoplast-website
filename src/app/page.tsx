import Hero from "@/pages/hero";
import Services from "@/pages/services";
import Pricing from "@/pages/pricing";
import About from "@/pages/about";
import Footer from "@/pages/footer";
import Header from "@/components/header";
import Testimonials from "@/pages/testimonials";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950">
      <Header />
      <Hero />
      <Services />
      <Pricing />
      <About />
      <Testimonials />
      <Footer />
    </main>
  );
}
