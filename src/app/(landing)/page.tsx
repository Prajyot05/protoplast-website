import SyncUser from "@/components/sync-user";
import Hero from "@/pages/hero";
import Services from "@/pages/services";
import About from "@/pages/about";
import Footer from "@/pages/footer";
import Header from "@/components/header";
import CTA from "@/pages/cta";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <SyncUser />
      <Header />
      <Hero />
      <Services />
      <About />
      <CTA />
      <Footer />
    </main>
  );
}
