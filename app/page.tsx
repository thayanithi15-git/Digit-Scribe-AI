import Header from '@/components/header';
import Hero from '@/components/hero/hero';
import Features from '@/components/hero/feature';
import HowItWorks from '@/components/hero/works';
import CTA from '@/components/hero/cta';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}