import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 border-t border-gray-800">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-white">MSME Tokenize</span>
            </div>
            <p className="text-gray-500 text-sm mb-4 max-w-md">
              Empowering 63 million Indian MSMEs with blockchain-based micro equity tokenisation. 
              Invest as little as ₹100 in local businesses you believe in.
            </p>
            <div className="flex space-x-3">
              <span className="text-2xl">🇮🇳</span>
              <span className="text-sm text-gray-600 mt-1">Made for India | Built on Polygon</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link href="/listings" className="text-sm hover:text-orange-400 transition-colors">Browse MSMEs</Link></li>
              <li><Link href="/msme/register" className="text-sm hover:text-orange-400 transition-colors">Register MSME</Link></li>
              <li><Link href="/dashboard" className="text-sm hover:text-orange-400 transition-colors">Dashboard</Link></li>
              <li><Link href="/governance" className="text-sm hover:text-orange-400 transition-colors">Governance</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal & Compliance</h3>
            <ul className="space-y-2">
              <li><span className="text-sm text-gray-500">SEBI Regulatory Sandbox</span></li>
              <li><span className="text-sm text-gray-500">Mock KYC/AML</span></li>
              <li><span className="text-sm text-gray-500">Testnet Only</span></li>
              <li><span className="text-sm text-gray-500">Educational Prototype</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-xs text-gray-600">
              © 2026 MSME Tokenize — INNOVATHON 2026 Hackathon Project
            </p>
            <p className="text-xs text-amber-500 font-medium">
              ⚠️ EDUCATIONAL PROTOTYPE ONLY — Not a real securities offering — Polygon Amoy Testnet
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}