import type { Metadata } from 'next';
import './globals.css';
import {
  geistMono,
  geistSans,
  sfProDisplay,
  playfairDisplay,
} from '@/lib/fonts';
import QueryProvider from '@/components/Base/QueryProvider';
import NavBar from '@/components/Base/Nav';
import SplashScreen from '@/components/Base/SplashScreen';
import Footer from '@/components/Landing/Footer';

export const metadata: Metadata = {
  title: 'Ezzycare | Find Doctors,  Lab Tests & Medicine Delivery',
  description: 'Ezzycare | Find Doctors,  Lab Tests & Medicine Delivery',
  openGraph: {
    title: 'Ezzycare | Find Doctors,  Lab Tests & Medicine Delivery',
    description: 'Ezzycare | Find Doctors,  Lab Tests & Medicine Delivery',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${sfProDisplay.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <SplashScreen />

          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
