import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-container min-h-screen">
      <Header />
      <main className="pt-[70px] pb-[90px] px-4 fade-in">
        {children}
      </main>
      <Footer />
    </div>
  );
};
