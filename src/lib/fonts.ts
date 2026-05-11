import localFont from 'next/font/local';
import { Geist, Geist_Mono, Playfair_Display, Inter } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const playfairDisplay = Playfair_Display({
  variable: '--font-playfair-display',
  subsets: ['latin'],
});

export const sfProDisplay = localFont({
  src: [
    {
      path: '../assets/fonts/sf-pro-display/SFPRODISPLAYREGULAR.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/sf-pro-display/SFPRODISPLAYMEDIUM.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/sf-pro-display/SFPRODISPLAYBOLD.woff2',
      weight: '700',
      style: 'normal',
    },

    // Italics
    {
      path: '../assets/fonts/sf-pro-display/SFPRODISPLAYLIGHTITALIC.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../assets/fonts/sf-pro-display/SFPRODISPLAYTHINITALIC.woff2',
      weight: '100',
      style: 'italic',
    },
    {
      path: '../assets/fonts/sf-pro-display/SFPRODISPLAYULTRALIGHTITALIC.woff2',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../assets/fonts/sf-pro-display/SFPRODISPLAYSEMIBOLDITALIC.woff2',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../assets/fonts/sf-pro-display/SFPRODISPLAYBLACKITALIC.woff2',
      weight: '900',
      style: 'italic',
    },
    {
      path: '../assets/fonts/sf-pro-display/SFPRODISPLAYHEAVYITALIC.woff2',
      weight: '800',
      style: 'italic',
    },
  ],
  variable: '--font-sf-pro',
  display: 'swap',
});
