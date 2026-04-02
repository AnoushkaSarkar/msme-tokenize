'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ── Wallet Hook ──
declare global {
  interface Window {
    ethereum?: any;
  }
}
import Vibe6Logo from '@/components/common/Vibe6Logo';
export default function Navbar() {
  const pathname = usePathname();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isHindi, setIsHindi] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('isHindi');
    if (stored === 'true') setIsHindi(true);

    // Check if already connected
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
        if (accounts.length > 0) setWalletAddress(accounts[0]);
      });
    }
  }, []);

  const toggleHindi = () => {
    const next = !isHindi;
    setIsHindi(next);
    localStorage.setItem('isHindi', String(next));
    window.dispatchEvent(new Event('hindiToggle'));
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      setWalletAddress(accounts[0]);

      // Switch to Polygon Amoy
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x13882' }],
        });
      } catch {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x13882',
            chainName: 'Polygon Amoy Testnet',
            nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
            rpcUrls: ['https://rpc-amoy.polygon.technology/'],
            blockExplorerUrls: ['https://amoy.polygonscan.com'],
          }],
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
  };

  const shortAddress = walletAddress 
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` 
    : null;

  const navLinks = [
    { href: '/', label: isHindi ? 'होम' : 'Home' },
    { href: '/listings', label: isHindi ? 'MSME देखें' : 'Browse MSMEs' },
    { href: '/msme/register', label: isHindi ? 'रजिस्टर करें' : 'Register MSME' },
    { href: '/governance', label: isHindi ? 'शासन' : 'Governance' },
    { href: '/dashboard', label: isHindi ? 'डैशबोर्ड' : 'Dashboard' },
  ];

  return (
    <>
      {/* ── TOP BAR — VIBE6 Partner Strip ── */}
      <div className="w-full bg-[#0d1f3c] py-1.5 px-4 flex items-center justify-center gap-2">
        <span className="text-xs text-gray-300">
          {isHindi ? 'प्रौद्योगिकी भागीदार:' : 'Technology Partner:'}
        </span>
        {/* VIBE6 LOGO — Text based matching their style */}
        <a 
          href="https://www.linkedin.com/company/vibe6/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
        >
          <VIBE6Logo size="sm" />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-3.5 h-3.5 text-blue-400" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          <span className="text-xs text-blue-400 underline">LinkedIn</span>
        </a>
        <span className="text-xs text-gray-500 mx-2">|</span>
        <a 
          href="https://vibe6.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-orange-400 hover:text-orange-300 transition-colors underline"
        >
          vibe6.com
        </a>
      </div>

      {/* ── MAIN NAVBAR ── */}
      <nav className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* Left — MSME Tokenize Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              {/* Blockchain icon */}
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0d1f3c] to-[#1e40af] flex items-center justify-center">
                <span className="text-white text-xs font-black">₮</span>
              </div>
              <div>
                <span className="text-[#0d1f3c] font-black text-lg leading-none">
                  MSME
                </span>
                <span className="text-orange-500 font-black text-lg leading-none ml-1">
                  Tokenize
                </span>
              </div>
            </div>
          </Link>

          {/* Center — Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href
                    ? 'text-orange-500 bg-orange-50'
                    : 'text-[#0d1f3c] hover:text-orange-500 hover:bg-orange-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right — Actions */}
          <div className="flex items-center gap-2">

            {/* VIBE6 Logo Badge */}
            <a
              href="https://www.linkedin.com/company/vibe6/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all"
              title="VIBE6 on LinkedIn"
            >
              <VIBE6Logo size="sm" />
            </a>

            {/* Hindi Toggle */}
            <button
              onClick={toggleHindi}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-[#0d1f3c] hover:border-orange-400 hover:text-orange-500 transition-all"
            >
              {isHindi ? 'EN' : 'हि'}
            </button>

            {/* Wallet Button */}
            {walletAddress ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-mono text-green-700">{shortAddress}</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200 text-red-500 hover:bg-red-50 transition-all"
                >
                  {isHindi ? 'डिस्कनेक्ट' : 'Disconnect'}
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#0d1f3c] text-white hover:bg-[#1a2f52] transition-all"
              >
                {isHindi ? 'वॉलेट जोड़ें' : 'Connect Wallet'}
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg border border-gray-200"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className={`block h-0.5 bg-[#0d1f3c] transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block h-0.5 bg-[#0d1f3c] transition-all ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 bg-[#0d1f3c] transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href
                    ? 'text-orange-500 bg-orange-50'
                    : 'text-[#0d1f3c] hover:bg-orange-50 hover:text-orange-500'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {/* LinkedIn in mobile menu */}
            <a
              href="https://www.linkedin.com/company/vibe6/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-blue-600 hover:bg-blue-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              VIBE6 LinkedIn
            </a>
          </div>
        )}
      </nav>
    </>
  );
}

// ── VIBE6 LOGO COMPONENT (matches their style) ──────────
function VIBE6Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { container: 'h-6', icon: 'w-5 h-5 text-xs', text: 'text-sm' },
    md: { container: 'h-8', icon: 'w-7 h-7 text-sm', text: 'text-base' },
    lg: { container: 'h-10', icon: 'w-9 h-9 text-base', text: 'text-xl' },
  };
  const s = sizes[size];

  return (
    <div className={`flex items-center gap-1 ${s.container}`}>
      {/* U6 icon matching VIBE6 logo style */}
      <div className={`${s.icon} rounded-md bg-gradient-to-br from-blue-500 via-purple-500 to-orange-400 flex items-center justify-center font-black text-white`}>
        U6
      </div>
      <span className={`font-black ${s.text} text-[#0d1f3c]`}>
        VIBE<span className="text-orange-500">6</span>
      </span>
    </div>
  );
}