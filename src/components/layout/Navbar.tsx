'use client';

import Link from 'next/link';
import { useState } from 'react';

interface NavbarProps {
  walletAddress?: string | null;
  onConnectWallet?: () => void;
  onDisconnectWallet?: () => void;
}

export default function Navbar({ walletAddress, onConnectWallet, onDisconnectWallet }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Browse MSMEs', href: '/listings' },
    { name: 'Register MSME', href: '/msme/register' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Governance', href: '/governance' },
    { name: 'Dividend Demo', href: '/dividend-demo' },
  ];

  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : null;

  return (
    <nav className="bg-white shadow-md border-b border-gray-100 sticky top-8 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-saffron rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold gradient-text">MSME Tokenize</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Wallet Button */}
          <div className="hidden md:flex items-center space-x-3">
            {walletAddress ? (
              <div className="flex items-center space-x-2">
                <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  🟢 {shortAddress}
                </div>
                <button
                  onClick={onDisconnectWallet}
                  className="text-gray-400 hover:text-red-500 text-sm transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={onConnectWallet}
                className="btn-saffron text-sm pulse-saffron"
              >
                🦊 Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block py-2 px-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100">
              {walletAddress ? (
                <div className="flex items-center justify-between py-2 px-3">
                  <span className="text-green-700 font-medium text-sm">🟢 {shortAddress}</span>
                  <button onClick={onDisconnectWallet} className="text-red-500 text-sm">
                    Disconnect
                  </button>
                </div>
              ) : (
                <button onClick={onConnectWallet} className="btn-saffron w-full text-sm">
                  🦊 Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}