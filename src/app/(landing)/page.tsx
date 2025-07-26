import SyncUser from "@/components/sync-user";
import Hero from "@/pages/hero";
import Services from "@/pages/services";
import Pricing from "@/pages/pricing";
import About from "@/pages/about";
import Footer from "@/pages/footer";
import Header from "@/components/header";
import Testimonials from "@/pages/testimonials";
import CTA from "@/pages/cta";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-gray-950">
      <SyncUser />
      <Header />
      <Hero />
      <Services />
      {/* <Pricing /> */}
      <About />
      {/* <Testimonials /> */}
      <CTA />
      <Footer />
    </main>
  );
}
