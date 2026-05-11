import NavBar from '@/components/Base/Nav';
import Footer from '@/components/Landing/Footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-surface-card">
      <header className="w-full flex pr-2 pl-5 sm:px-5 lg:px-0">
        <NavBar />
      </header>
      {children}
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
