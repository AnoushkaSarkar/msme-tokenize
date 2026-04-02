'use client';

import Link from 'next/link';
import Vibe6Logo from '@/components/common/Vibe6Logo';
function VIBE6Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { container: 'h-6', icon: 'w-5 h-5 text-xs', text: 'text-sm' },
    md: { container: 'h-8', icon: 'w-7 h-7 text-sm', text: 'text-base' },
    lg: { container: 'h-10', icon: 'w-9 h-9 text-base', text: 'text-xl' },
  };
  const s = sizes[size];

  return (
    <div className={`flex items-center gap-1 ${s.container}`}>
      <div className={`${s.icon} rounded-md bg-gradient-to-br from-blue-500 via-purple-500 to-orange-400 flex items-center justify-center font-black text-white`}>
        U6
      </div>
      <span className={`font-black ${s.text} text-white`}>
        VIBE<span className="text-orange-500">6</span>
      </span>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-[#0d1f3c] text-white mt-20">

      {/* ── MAIN FOOTER ── */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Column 1 — MSME Tokenize */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center">
                <span className="text-white text-base font-black">₮</span>
              </div>
              <div>
                <span className="text-white font-black text-xl">MSME</span>
                <span className="text-orange-400 font-black text-xl ml-1">Tokenize</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-4">
              Blockchain-based micro equity tokenization for Indian MSMEs. 
              Empowering 63 million businesses with fractional investment 
              starting at ₹100.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Built on Polygon Amoy Testnet
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'Home' },
                { href: '/listings', label: 'Browse MSMEs' },
                { href: '/msme/register', label: 'Register MSME' },
                { href: '/governance', label: 'Governance' },
                { href: '/dashboard', label: 'Dashboard' },
                { href: '/dividend-demo', label: 'Dividend Demo' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-orange-400 text-sm transition-colors"
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — VIBE6 Partner */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Technology Partner
            </h4>

            {/* VIBE6 Card */}
            <a
              href="https://www.linkedin.com/company/vibe6/"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-xl border border-white/10 hover:border-orange-500/40 bg-white/5 hover:bg-white/10 transition-all group"
            >
              <VIBE6Logo size="md" />
              <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                Innovating with AI, Blockchain & Beyond
              </p>
              <div className="flex items-center gap-1.5 mt-3">
                {/* LinkedIn Icon */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-4 h-4 text-blue-400" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="text-blue-400 text-xs group-hover:text-blue-300 transition-colors">
                  Follow on LinkedIn →
                </span>
              </div>
            </a>

            {/* Website link */}
            <a
              href="https://vibe6.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg border border-white/10 hover:border-orange-400/40 transition-all group"
            >
              <span className="text-xs text-gray-400 group-hover:text-orange-400 transition-colors">
                🌐 vibe6.com
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div className="border-t border-white/10" />

      {/* ── BOTTOM BAR ── */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>© 2026 MSME Tokenize</span>
          <span>|</span>
          <span>Built for INNOVATHON 2026</span>
          <span>|</span>
          <span className="flex items-center gap-1">
            Powered by 
            <a 
              href="https://www.linkedin.com/company/vibe6/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 ml-1 font-semibold"
            >
              VIBE6
            </a>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>🔗 Polygon Amoy</span>
          <span>🔥 Firebase</span>
          <span>▲ Vercel</span>
          {/* LinkedIn icon in bottom bar */}
          <a
            href="https://www.linkedin.com/company/vibe6/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            VIBE6
          </a>
        </div>
      </div>

      {/* ── DISCLAIMER ── */}
      <div className="bg-black/20 px-4 py-3 text-center">
        <p className="text-xs text-gray-600">
          ⚠️ This is a hackathon demo on testnet. Not financial advice. 
          All transactions use test MATIC. SEBI compliance pending.
        </p>
      </div>
    </footer>
  );
}