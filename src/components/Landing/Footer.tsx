import AppStoreIcon from '@/icons/AppStoreIcon';
import DotIcon from '@/icons/DotIcon';
import FooterBackgroundIcon from '@/icons/FooterBackground';
import FullLogo from '@/icons/FullLogo';
import GooglePlayIcon from '@/icons/GooglePlayIcon';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from '@/icons/Socials';

const Footer = () => {
  const footerNavItems = [
    {
      group: 'Users',
      items: [
        { name: 'Care Seekers', href: '#' },
        { name: 'Hospitals', href: '#' },
        { name: 'Doctors', href: '#' },
        { name: 'Agents', href: '#' },
      ],
    },
    {
      group: 'Quick Links',
      items: [
        { name: 'Services', href: '/services' },
        { name: 'How it works', href: '/how-it-works' },
        { name: 'FAQs', href: '#' },
        { name: 'Blogs', href: '/blog' },
        { name: 'Help centers', href: '#' },
        { name: 'Contact us', href: '#' },
      ],
    },
    {
      group: 'Legal',
      items: [
        { name: 'Privacy policy', href: '#' },
        { name: 'Terms of use', href: '#' },
        { name: 'Data protection', href: '#' },
      ],
    },
  ];

  return (
    <div className="bg-primary text-white py-30 px-5 lg:px-0 mt-22.5 relative font-geist-sans">
      <FooterBackgroundIcon
        className="absolute inset-0 w-full max-w-425 mx-auto h-auto max-h-150 
        object-cover top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
      />
      <div className="max-w-303 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <FullLogo fill="#fff" className="h-auto w-28 sm:w-32" />
            <p className="text-sm mt-3 max-w-112.5">
              Simplifying healthcare access by connecting patients, doctors,
              hospitals, and diagnostic services through one unified platform.
            </p>

            <div className="flex gap-4 mt-7.5 z-2">
              <a href="#" className="cursor-pointer">
                <XIcon />
              </a>
              <a href="#" className="cursor-pointer">
                <FacebookIcon />
              </a>
              <a href="#" className="cursor-pointer">
                <InstagramIcon />
              </a>
              <a href="#" className="cursor-pointer">
                <LinkedInIcon />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 justify-between z-2">
            {footerNavItems.map((group) => (
              <div key={group.group} className="mt-10 md:mt-0">
                <h3 className="text-sm font-bold mb-4">{group.group}</h3>
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm hover:underline transition-colors"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10 ">
          <div className="flex gap-3 items-center text-xs z-2">
            <p>© 2026 EzzyCare</p>
            <DotIcon fill="#fff" />
            <a href="#" className="hover:underline">
              Terms
            </a>
            <DotIcon fill="#fff" />
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10 z-2">
            <AppStoreIcon className="cursor-pointer" />
            <GooglePlayIcon className="cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
