import Link from 'next/link';

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="gradient-text">MSME Tokenize</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-4">
            Micro Equity Tokenisation Platform for Indian MSMEs
          </p>
          <p className="text-3xl md:text-4xl font-bold text-orange-400 mb-8">
            63 Million MSMEs. Zero Equity Access. Until Now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/listings" className="btn-primary text-lg px-8 py-3">
              🔍 Browse MSMEs
            </Link>
            <Link href="/msme/register" className="btn-saffron text-lg px-8 py-3">
              🏢 Register Your MSME
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="card text-center min-w-[150px]">
              <p className="text-3xl font-bold text-blue-400">₹100</p>
              <p className="text-sm text-gray-500">Minimum Investment</p>
            </div>
            <div className="card text-center min-w-[150px]">
              <p className="text-3xl font-bold text-green-400">63M+</p>
              <p className="text-sm text-gray-500">Indian MSMEs</p>
            </div>
            <div className="card text-center min-w-[150px]">
              <p className="text-3xl font-bold text-orange-400">₹43L Cr</p>
              <p className="text-sm text-gray-500">MSME GDP Contribution</p>
            </div>
            <div className="card text-center min-w-[150px]">
              <p className="text-3xl font-bold text-purple-400">30%</p>
              <p className="text-sm text-gray-500">of India GDP</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-100">
            🚨 The Problem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center border-red-900/50">
              <span className="text-4xl mb-3 block">🏦</span>
              <h3 className="font-bold text-lg mb-2 text-gray-100">No Bank Loans</h3>
              <p className="text-gray-500 text-sm">
                Banks require collateral. 80% of MSMEs have NO access to formal equity capital.
              </p>
            </div>
            <div className="card text-center border-red-900/50">
              <span className="text-4xl mb-3 block">💰</span>
              <h3 className="font-bold text-lg mb-2 text-gray-100">IPO Too Expensive</h3>
              <p className="text-gray-500 text-sm">
                Traditional IPO minimum is ₹10 crore — completely out of reach for small businesses.
              </p>
            </div>
            <div className="card text-center border-red-900/50">
              <span className="text-4xl mb-3 block">🙅</span>
              <h3 className="font-bold text-lg mb-2 text-gray-100">No Micro-Investment</h3>
              <p className="text-gray-500 text-sm">
                Investors cannot invest ₹100–₹10,000 in local businesses they believe in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-100">
            ✅ Our Solution
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card text-center">
              <span className="text-4xl mb-3 block">🏢</span>
              <h3 className="font-bold mb-2 text-gray-100">1. MSME Lists</h3>
              <p className="text-gray-500 text-sm">
                Business registers and sets fundraising target & equity offered
              </p>
            </div>
            <div className="card text-center">
              <span className="text-4xl mb-3 block">🪙</span>
              <h3 className="font-bold mb-2 text-gray-100">2. Tokens Created</h3>
              <p className="text-gray-500 text-sm">
                ERC-20 tokens minted on Polygon — each token = fractional equity
              </p>
            </div>
            <div className="card text-center">
              <span className="text-4xl mb-3 block">💸</span>
              <h3 className="font-bold mb-2 text-gray-100">3. Investors Buy</h3>
              <p className="text-gray-500 text-sm">
                Micro-investors buy tokens starting at just ₹100 via MetaMask
              </p>
            </div>
            <div className="card text-center">
              <span className="text-4xl mb-3 block">📈</span>
              <h3 className="font-bold mb-2 text-gray-100">4. Earn Dividends</h3>
              <p className="text-gray-500 text-sm">
                MSME distributes profits automatically to all token holders
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-100">
            🛡️ Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { emoji: '🔗', title: 'Blockchain Powered', desc: 'All transactions on Polygon — transparent, tamper-proof, near-zero fees' },
              { emoji: '🤖', title: 'AI Risk Scoring', desc: 'Every MSME gets a risk score based on revenue, age, sector & location' },
              { emoji: '🗳️', title: 'Token Governance', desc: 'Token holders vote on business decisions — true democratic ownership' },
              { emoji: '💰', title: 'Auto Dividends', desc: 'Profits distributed automatically to all investors proportionally' },
              { emoji: '🔒', title: 'Founder Vesting', desc: 'Founder tokens locked for 6-12 months — aligned incentives' },
              { emoji: '↩️', title: 'Auto Refund', desc: 'If fundraising target not met, all investors get automatic refund' },
            ].map((feature, i) => (
              <div key={i} className="card">
                <span className="text-3xl mb-3 block">{feature.emoji}</span>
                <h3 className="font-bold text-lg mb-2 text-gray-100">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-100">⚡ Built With</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              '⟠ Polygon Amoy', '📝 Solidity', '🔷 ERC-20', '⚛️ Next.js',
              '🔥 Firebase', '🦊 MetaMask', '📦 IPFS', '🎨 Tailwind CSS',
            ].map((tech) => (
              <span key={tech} className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-full text-sm font-medium text-gray-300">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-orange-900 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Invest in India&apos;s Future?
          </h2>
          <p className="text-lg mb-8 text-gray-300">
            Browse verified MSMEs and start investing with as little as ₹100
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/listings" className="bg-white text-gray-900 font-bold px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors">
              Start Investing →
            </Link>
            <Link href="/msme/register" className="border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
              List Your MSME
            </Link>
          </div>
        </div>
      </section>

      {/* Regulatory */}
      <section className="py-8 bg-amber-950/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-amber-500/80">
            ⚠️ <strong>REGULATORY DISCLAIMER:</strong> This is an educational prototype developed for INNOVATHON 2026.
            This is NOT a real securities offering. All transactions use test MATIC on Polygon Amoy Testnet with no real monetary value.
            Real operations would require SEBI registration under AIF regulations, compliance with PMLA 2002,
            Securities Contracts Act, Depositories Act, and Income Tax Act. Mock KYC only.
          </p>
        </div>
      </section>
    </div>
  );
}