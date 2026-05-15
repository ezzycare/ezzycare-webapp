import QueryProvider from '@/components/Base/QueryProvider';
import SplashScreen from '@/components/Base/SplashScreen';
import {
  geistMono,
  geistSans,
  inter,
  playfairDisplay,
  sfProDisplay,
} from '@/lib/fonts';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
// import { ToastContainer } from 'react-toastify';
import { ToastContainer } from '@/components/Base/Toast/ToastContainer';
import './globals.css';

export const metadata: Metadata = {
  // metadataBase: new URL('https://ezzycare.com'),
  metadataBase: new URL('http://localhost:3000'),

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
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        sfProDisplay.variable,
        playfairDisplay.variable,
        inter.variable,
        'font-sans'
      )}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <QueryProvider>
          <SplashScreen />

          {children}

          <ToastContainer />
        </QueryProvider>
      </body>
    </html>
  );
}
