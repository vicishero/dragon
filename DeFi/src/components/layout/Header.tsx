import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { WalletConnect } from '../wallet/WalletConnect';

export const Header: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLang: 'zh' | 'en') => {
    setLanguage(newLang);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[500px] mx-auto">
        <div className="glass border-b border-gray-800 px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-lg font-bold text-text-primary">DeFi5.0</span>
          </div>

          {/* Language Toggle & Wallet */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors border border-gray-700 rounded-btn hover:border-gray-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 top-12 bg-bg-secondary border border-gray-700 rounded-card shadow-lg overflow-hidden fade-in min-w-[120px]">
                  <button
                    onClick={() => handleLanguageChange('zh')}
                    className={`w-full px-4 py-2 text-left transition-colors ${
                      language === 'zh'
                        ? 'bg-primary/20 text-primary'
                        : 'text-text-secondary hover:text-text-primary hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>🇨🇳</span>
                      <span className="text-sm">中文</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full px-4 py-2 text-left transition-colors ${
                      language === 'en'
                        ? 'bg-primary/20 text-primary'
                        : 'text-text-secondary hover:text-text-primary hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>🇺🇸</span>
                      <span className="text-sm">English</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Wallet Connect */}
            <WalletConnect />
          </div>
        </div>
      </div>
    </header>
  );
};
