'use client';
import Link from 'next/link';

const translations: Record<string, Record<string, string>> = {
  en: {
    tagline: 'Democratizing MSME investments through blockchain technology.',
    disclaimer: '⚠️ SEBI Disclaimer: This is a prototype for educational purposes only. Not real investment advice. Testnet only.',
    rights: 'All rights reserved.',
    platform: 'Platform',
    legal: 'Legal',
    poweredBy: 'Powered by'
  },
  hi: {
    tagline: 'ब्लॉकचेन तकनीक के माध्यम से MSME निवेश को लोकतांत्रिक बनाना।',
    disclaimer: '⚠️ SEBI अस्वीकरण: यह केवल शैक्षिक उद्देश्यों के लिए एक प्रोटोटाइप है। वास्तविक निवेश सलाह नहीं।',
    rights: 'सर्वाधिकार सुरक्षित।',
    platform: 'प्लेटफॉर्म',
    legal: 'कानूनी',
    poweredBy: 'द्वारा संचालित'
  }
};

export default function Footer({ lang }: { lang: string }) {
  const t = translations[lang];
  return (
    <footer className="bg-[#030812] border-t border-blue-500/20 mt-auto">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-black text-white text-sm">V6</div>
              <span className="font-black text-white text-xl">MSME <span className="gradient-text">Tokenize</span></span>
            </div>
            <p className="text-gray-500 text-sm mb-4">{t.tagline}</p>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>{t.poweredBy}</span>
              <span className="text-blue-400 font-semibold">Polygon Amoy</span>
              <span>•</span>
              <span className="text-blue-400 font-semibold">VIBE6</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t.platform}</h4>
            <ul className="space-y-2">
              {[
                { href: '/listings', label: lang === 'en' ? 'Browse MSMEs' : 'MSME देखें' },
                { href: '/msme/register', label: lang === 'en' ? 'Register MSME' : 'MSME पंजीकरण' },
                { href: '/dashboard', label: lang === 'en' ? 'Dashboard' : 'डैशबोर्ड' },
                { href: '/governance', label: lang === 'en' ? 'Governance' : 'गवर्नेंस' },
                { href: '/dividend-demo', label: lang === 'en' ? 'Dividend Demo' : 'लाभांश डेमो' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-500 hover:text-blue-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t.legal}</h4>
            <ul className="space-y-2">
              {['SEBI Guidelines', 'Privacy Policy', 'Terms of Use', 'Risk Disclosure'].map(item => (
                <li key={item}>
                  <span className="text-gray-500 text-sm cursor-pointer hover:text-blue-400 transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-8 border-t border-blue-500/10">
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-4">
            <p className="text-orange-300/80 text-xs text-center">{t.disclaimer}</p>
          </div>
          <p className="text-gray-600 text-xs text-center">
            © 2026 MSME Tokenize × VIBE6. {t.rights} | INNOVATHON 2026 | Challenge 3
          </p>
        </div>
      </div>
    </footer>
  );
}