import AppLink from '@/components/Landing/Home/AppLink';
import Faqs from '@/components/Landing/Home/Faqs';
import Features from '@/components/Landing/Home/Features';
import GetStarted from '@/components/Landing/Home/GetStarted';
import Hero from '@/components/Landing/Home/Hero';
import HowEzzycareWorks from '@/components/Landing/Home/HowEzzycareWorks';
import Insights from '@/components/Landing/Home/Insights';
import TrustAndSafety from '@/components/Landing/Home/TrustAndSafety';
import UseCases from '@/components/Landing/Home/UseCases';
import WhyEzzycare from '@/components/Landing/Home/WhyEzzycare';
import Footer from '@/components/Landing/Footer';
import NavBar from '@/components/Base/Nav';

export default function Home() {
  return (
    <main className="flex flex-col w-full bg-surface-card">
      <header className="w-full flex pr-2 pl-5 sm:px-5 lg:px-0">
        <NavBar />
      </header>
      <Hero />
      <GetStarted />
      <WhyEzzycare />
      <HowEzzycareWorks />
      <Features />
      <UseCases />
      <TrustAndSafety />
      <Faqs />
      <Insights />
      <AppLink />
      <footer>
        <Footer />
      </footer>
    </main>
  );
}
