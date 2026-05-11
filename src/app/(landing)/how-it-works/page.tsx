import FancyButton from '@/components/Ui/FancyButton';
import HowEzzycareWorks from '@/components/Landing/Home/HowEzzycareWorks';
import About from '@/components/Landing/HowItWorks/About';
import CareItems from '@/components/Landing/HowItWorks/CareItems';

const page = () => {
  return (
    <main>
      <About />
      <CareItems />
      <HowEzzycareWorks>
        <FancyButton variant="primary" className="mt-5">
          Join as Care Seeker
        </FancyButton>
      </HowEzzycareWorks>
    </main>
  );
};

export default page;
