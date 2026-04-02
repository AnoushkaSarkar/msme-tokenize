'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';

const translations: Record<string, Record<string, string>> = {
  en: {
    home: 'Home', browse: 'Browse MSMEs', register: 'Register MSME',
    dashboard: 'Dashboard', governance: 'Governance', admin: 'Admin',
    connect: 'Connect Wallet', disconnect: 'Disconnect', connecting: 'Connecting...',
    wrongNetwork: 'Wrong Network', tagline: 'MSME Tokenization Platform'
  },
  hi: {
    home: 'होम', browse: 'MSME देखें', register: 'MSME पंजीकरण',
    dashboard: 'डैशबोर्ड', governance: 'गवर्नेंस', admin: 'एडमिन',
    connect: 'वॉलेट जोड़ें', disconnect: 'डिसकनेक्ट', connecting: 'जोड़ रहे हैं...',
    wrongNetwork: 'गलत नेटवर्क', tagline: 'MSME टोकनाइजेशन प्लेटफॉर्म'
  }
};

export default function Navbar({ lang, setLang }: { lang: string, setLang: (l: string) => void }) {
  const { isConnected, isCorrectNetwork, address, balance, isLoading, connectWallet, disconnectWallet, switchToAmoy } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false);
  const t = translations[lang];

  const navLinks = [
    { href: '/', label: t.home },
    { href: '/listings', label: t.browse },
    { href: '/msme/register', label: t.register },
    { href: '/dashboard', label: t.dashboard },
    { href: '/governance', label: t.governance },
    { href: '/admin', label: t.admin },
  ];

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <nav className="sticky top-0 z-50 bg-[#050A18]/95 backdrop-blur-md border-b border-blue-500/20">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-black text-white text-sm">
              V6
            </div>
            <div>
              <span className="font-black text-white text-lg">MSME</span>
              <span className="font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent text-lg"> Tokenize</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className="text-gray-400 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-blue-500/10 transition-all">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Hindi Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition-all"
            >
              {lang === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
            </button>

            {/* Wallet Button */}
            {!isConnected ? (
              <button onClick={connectWallet}
                className="btn-primary text-sm py-2 px-4">
                {isLoading ? t.connecting : t.connect}
              </button>
            ) : !isCorrectNetwork ? (
              <button onClick={switchToAmoy}
                className="bg-orange-500/20 border border-orange-500/50 text-orange-400 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-orange-500/30 transition-all">
                ⚠️ {t.wrongNetwork}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-green-400 text-xs font-mono">
                      {formatAddress(address || '')}
                    </span>
                  </div>
                  <div className="text-gray-500 text-xs text-center">
                    {parseFloat(balance || '0').toFixed(3)} MATIC
                  </div>
                </div>
                <button onClick={disconnectWallet}
                  className="text-gray-500 hover:text-red-400 text-xs transition-all">
                  ✕
                </button>
              </div>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-gray-400 hover:text-white p-2">
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-blue-500/20 py-4 space-y-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block text-gray-400 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-blue-500/10 transition-all">
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}