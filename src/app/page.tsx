'use client';
import Link from 'next/link';
import { useLang } from '@/components/layout/ClientLayout';
import { useEffect, useRef } from 'react';

const translations: Record<string, any> = {
  en: {
    badge: 'INNOVATHON 2026 × VIBE6 × NMIMS Indore',
    hero1: 'Invest in India\'s',
    hero2: 'Small Businesses',
    hero3: 'Starting ₹100',
    subhero: 'Blockchain-powered micro equity tokenization for Indian MSMEs. Transparent, secure, and accessible to every Indian investor.',
    browseMSME: 'Browse MSMEs',
    registerMSME: 'Register Your MSME',
    stats: ['₹2.3Cr+', 'Raised', '156+', 'MSMEs', '12,400+', 'Investors', '₹100', 'Min. Investment'],
    howTitle: 'How It Works',
    forInvestors: 'For Investors',
    forMSMEs: 'For MSMEs',
    investorSteps: [
      { icon: '🔗', title: 'Connect Wallet', desc: 'Connect MetaMask to get started' },
      { icon: '🔍', title: 'Browse MSMEs', desc: 'Explore verified Indian businesses' },
      { icon: '💰', title: 'Buy Tokens', desc: 'Invest from ₹100 with fractional tokens' },
      { icon: '📈', title: 'Earn Returns', desc: 'Receive dividends to your wallet' },
    ],
    msmeSteps: [
      { icon: '📋', title: 'Register', desc: 'Submit MSME details and GST number' },
      { icon: '✅', title: 'Get Verified', desc: 'AI-powered risk assessment' },
      { icon: '🪙', title: 'Issue Tokens', desc: 'Launch token on Polygon blockchain' },
      { icon: '🚀', title: 'Raise Capital', desc: 'Get funded by micro-investors' },
    ],
    whyTitle: 'Why MSME Tokenize?',
    features: [
      { icon: '⛓️', title: 'Blockchain Secured', desc: 'Every transaction on Polygon — transparent and immutable' },
      { icon: '🇮🇳', title: 'Made for India', desc: 'GST verification, Hindi support, SEBI compliant path' },
      { icon: '🤖', title: 'AI Risk Scoring', desc: '5-factor weighted algorithm to assess investment risk' },
      { icon: '🗳️', title: 'Governance', desc: 'Token holders vote on key business decisions' },
      { icon: '💸', title: 'Auto Dividends', desc: 'Smart contract distributes profits automatically' },
      { icon: '🔒', title: 'Investor Protection', desc: 'Automatic refunds if target not met' },
    ],
    sebi: '⚠️ SEBI Disclaimer: Educational prototype only. Not financial advice. Testnet only.',
    ctaTitle: 'Ready to Start?',
    ctaDesc: 'Join thousands of Indians investing in the backbone of our economy',
    liveMarket: 'Live Market Activity',
  },
  hi: {
    badge: 'INNOVATHON 2026 × VIBE6 × NMIMS इंदौर',
    hero1: 'भारत के',
    hero2: 'छोटे व्यवसायों में',
    hero3: '₹100 से निवेश करें',
    subhero: 'भारतीय MSMEs के लिए ब्लॉकचेन-संचालित माइक्रो इक्विटी टोकनाइजेशन। पारदर्शी, सुरक्षित और हर भारतीय निवेशक के लिए सुलभ।',
    browseMSME: 'MSME देखें',
    registerMSME: 'अपना MSME पंजीकृत करें',
    stats: ['₹2.3Cr+', 'जुटाए', '156+', 'MSMEs', '12,400+', 'निवेशक', '₹100', 'न्यूनतम निवेश'],
    howTitle: 'यह कैसे काम करता है',
    forInvestors: 'निवेशकों के लिए',
    forMSMEs: 'MSMEs के लिए',
    investorSteps: [
      { icon: '🔗', title: 'वॉलेट जोड़ें', desc: 'शुरू करने के लिए MetaMask जोड़ें' },
      { icon: '🔍', title: 'MSME देखें', desc: 'सत्यापित भारतीय व्यवसाय खोजें' },
      { icon: '💰', title: 'टोकन खरीदें', desc: '₹100 से फ्रैक्शनल टोकन में निवेश करें' },
      { icon: '📈', title: 'रिटर्न पाएं', desc: 'वॉलेट में लाभांश प्राप्त करें' },
    ],
    msmeSteps: [
      { icon: '📋', title: 'पंजीकरण', desc: 'MSME विवरण और GST नंबर जमा करें' },
      { icon: '✅', title: 'सत्यापन', desc: 'AI-संचालित जोखिम मूल्यांकन' },
      { icon: '🪙', title: 'टोकन जारी करें', desc: 'Polygon पर अपना टोकन लॉन्च करें' },
      { icon: '🚀', title: 'पूंजी जुटाएं', desc: 'माइक्रो-निवेशकों से फंडिंग पाएं' },
    ],
    whyTitle: 'MSME Tokenize क्यों?',
    features: [
      { icon: '⛓️', title: 'ब्लॉकचेन सुरक्षित', desc: 'Polygon पर हर लेनदेन — पारदर्शी और अपरिवर्तनीय' },
      { icon: '🇮🇳', title: 'भारत के लिए बना', desc: 'GST सत्यापन, हिंदी समर्थन, SEBI अनुपालन' },
      { icon: '🤖', title: 'AI जोखिम स्कोरिंग', desc: 'निवेश जोखिम के लिए 5-कारक एल्गोरिथ्म' },
      { icon: '🗳️', title: 'गवर्नेंस', desc: 'टोकन धारक व्यावसायिक निर्णयों पर वोट करते हैं' },
      { icon: '💸', title: 'ऑटो लाभांश', desc: 'स्मार्ट कॉन्ट्रैक्ट स्वचालित रूप से लाभ वितरित करता है' },
      { icon: '🔒', title: 'निवेशक सुरक्षा', desc: 'लक्ष्य पूरा न हो तो स्वचालित रिफंड' },
    ],
    sebi: '⚠️ SEBI अस्वीकरण: केवल शैक्षिक प्रोटोटाइप। वित्तीय सलाह नहीं। केवल टेस्टनेट।',
    ctaTitle: 'शुरू करने के लिए तैयार?',
    ctaDesc: 'हमारी अर्थव्यवस्था की रीढ़ में निवेश करने वाले हजारों भारतीयों से जुड़ें',
    liveMarket: 'लाइव बाजार गतिविधि',
  }
};

function StockGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const points: number[] = [];
    let x = 0;
    const step = canvas.width / 60;

    // Generate realistic stock-like data
    let val = 200;
    for (let i = 0; i < 60; i++) {
      val += (Math.random() - 0.45) * 15;
      val = Math.max(100, Math.min(300, val));
      points.push(val);
    }

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = 'rgba(0,102,255,0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const y = (canvas.height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      const visiblePoints = Math.min(frame + 1, points.length);

      // Gradient fill
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(0,102,255,0.3)');
      gradient.addColorStop(1, 'rgba(0,102,255,0)');

      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let i = 0; i < visiblePoints; i++) {
        const px = i * step;
        const py = canvas.height - ((points[i] - 100) / 200) * canvas.height;
        if (i === 0) ctx.lineTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.lineTo((visiblePoints - 1) * step, canvas.height);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Line
      ctx.beginPath();
      ctx.strokeStyle = '#0066FF';
      ctx.lineWidth = 2;
      for (let i = 0; i < visiblePoints; i++) {
        const px = i * step;
        const py = canvas.height - ((points[i] - 100) / 200) * canvas.height;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Dot at end
      if (visiblePoints > 0) {
        const lastX = (visiblePoints - 1) * step;
        const lastY = canvas.height - ((points[visiblePoints - 1] - 100) / 200) * canvas.height;
        ctx.beginPath();
        ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#00C8FF';
        ctx.fill();
      }

      if (frame < points.length - 1) {
        frame++;
        setTimeout(() => requestAnimationFrame(animate), 50);
      }
    };

    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  );
}

export default function HomePage() {
  const { lang } = useLang();
  const t = translations[lang];

  const msmes = [
    { name: 'Sharma Tea', change: '+12.4%', price: '₹5.20', up: true },
    { name: 'Patil Textiles', change: '+8.1%', price: '₹9.80', up: true },
    { name: 'GreenGrow Dairy', change: '-2.3%', price: '₹7.20', up: false },
    { name: 'TechSeva Solutions', change: '+18.7%', price: '₹18.50', up: true },
    { name: 'Rajasthani Crafts', change: '+5.2%', price: '₹3.10', up: true },
    { name: 'Mumbai Masala', change: '-1.8%', price: '₹3.90', up: false },
  ];

  return (
    <div className="min-h-screen bg-[#050A18]">
      {/* SEBI Banner */}
      <div className="disclaimer-banner">{t.sebi}</div>

      {/* Hero Section */}
      <section className="relative grid-bg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="page-container relative z-10 pt-20 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-8">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-blue-400 text-sm font-medium">{t.badge}</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
                {t.hero1}<br />
                <span className="gradient-text">{t.hero2}</span><br />
                {t.hero3}
              </h1>

              <p className="text-gray-400 text-lg max-w-xl mb-10">{t.subhero}</p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/listings" className="btn-primary text-lg px-8 py-4 text-center">
                  {t.browseMSME} →
                </Link>
                <Link href="/msme/register" className="btn-secondary text-lg px-8 py-4 text-center">
                  {t.registerMSME}
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                {[0,2,4,6].map(i => (
                  <div key={i} className="glass-card p-3 text-center">
                    <div className="text-xl font-black gradient-text">{t.stats[i]}</div>
                    <div className="text-gray-500 text-xs mt-1">{t.stats[i+1]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Stock Graph */}
            <div className="glass-card p-6 glow-blue">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-bold">{t.liveMarket}</h3>
                  <p className="text-gray-500 text-xs">Polygon Amoy Testnet</p>
                </div>
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-xs font-semibold">LIVE</span>
                </div>
              </div>

              {/* Graph */}
              <div className="h-48 mb-4">
                <StockGraph />
              </div>

              {/* MSME Tickers */}
              <div className="space-y-2">
                {msmes.map((m, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-800/50">
                    <span className="text-gray-300 text-xs font-medium">{m.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-xs">{m.price}</span>
                      <span className={`text-xs font-bold ${m.up ? 'text-green-400' : 'text-red-400'}`}>
                        {m.up ? '▲' : '▼'} {m.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 border-t border-blue-500/10">
        <div className="page-container">
          <h2 className="text-4xl font-black text-white text-center mb-4">{t.howTitle}</h2>
          <p className="text-gray-500 text-center mb-16">Simple steps to get started</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">💼</span>
                {t.forInvestors}
              </h3>
              <div className="space-y-4">
                {t.investorSteps.map((step: any, i: number) => (
                  <div key={i} className="flex items-start gap-4 card p-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-xl flex-shrink-0">{step.icon}</div>
                    <div>
                      <div className="text-white font-semibold">{step.title}</div>
                      <div className="text-gray-500 text-sm">{step.desc}</div>
                    </div>
                    <div className="ml-auto text-blue-500/30 font-black text-2xl">0{i+1}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-orange-400 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">🏪</span>
                {t.forMSMEs}
              </h3>
              <div className="space-y-4">
                {t.msmeSteps.map((step: any, i: number) => (
                  <div key={i} className="flex items-start gap-4 card p-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-xl flex-shrink-0">{step.icon}</div>
                    <div>
                      <div className="text-white font-semibold">{step.title}</div>
                      <div className="text-gray-500 text-sm">{step.desc}</div>
                    </div>
                    <div className="ml-auto text-orange-500/30 font-black text-2xl">0{i+1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-blue-500/10 bg-gradient-to-b from-blue-600/5 to-transparent">
        <div className="page-container">
          <h2 className="text-4xl font-black text-white text-center mb-4">{t.whyTitle}</h2>
          <p className="text-gray-500 text-center mb-16">Built for Bharat, powered by blockchain</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.features.map((f: any, i: number) => (
              <div key={i} className="card p-6 hover:border-blue-500/40 transition-all group">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-blue-400 transition-colors">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-blue-500/10">
        <div className="page-container text-center">
          <div className="max-w-2xl mx-auto glass-card p-12 glow-blue">
            <h2 className="text-4xl font-black text-white mb-4">{t.ctaTitle}</h2>
            <p className="text-gray-400 mb-8">{t.ctaDesc}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/listings" className="btn-primary text-lg px-8 py-4">{t.browseMSME} →</Link>
              <Link href="/msme/register" className="btn-saffron text-lg px-8 py-4">{t.registerMSME}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}