import AppLinkBg from '@/assets/img/app-link-bg.png';
import AppStoreIcon from '@/icons/AppStoreIcon';
import GooglePlayIcon from '@/icons/GooglePlayIcon';
import clsx from 'clsx';
import Image from 'next/image';

const AppLink = () => {
  return (
    <div id="applink-section" className="px-5 lg:px-0">
      <section
        className={clsx(
          'w-full max-w-300 mx-auto flex flex-col rounded-[40px]',
          'relative items-center py-20 px-5 font-geist-sans'
        )}
      >
        <div className="bg-primary absolute inset-0 z-0 rounded-[40px]"></div>
        <Image
          src={AppLinkBg}
          alt="app link background"
          width={0}
          height={0}
          className="absolute inset-0 w-full h-full object-cover rounded-[40px]"
        />
        <div className="z-2">
          <h3
            className="text-4xl lg:text-[46px] text-white font-medium mt-3.5 mb-3 max-w-80 sm:max-w-130 mx-auto text-center"
            role="heading"
          >
            Healthcare, simplified
          </h3>

          <p
            className="text-white max-w-112.5 text-center mx-auto"
            role="description"
          >
            Book appointments, consult doctors, manage records, and access care
            anytime, anywhere with the EzzyCare app.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
            <AppStoreIcon className="cursor-pointer" />
            <GooglePlayIcon className="cursor-pointer" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppLink;
