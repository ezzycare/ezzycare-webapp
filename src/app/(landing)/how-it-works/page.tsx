import HowEzzycareWorks from '@/components/Landing/Home/HowEzzycareWorks';
import About from '@/components/Landing/HowItWorks/About';
import CareItems from '@/components/Landing/HowItWorks/CareItems';
import Button from '@/components/Ui/Button';

const page = () => {
  return (
    <main>
      <About />
      <CareItems />
      <HowEzzycareWorks>
        <Button variant="primary" className="mt-5">
          Join as Care Seeker
        </Button>
      </HowEzzycareWorks>
    </main>
  );
};

export default page;
