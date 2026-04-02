'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useLang } from '@/components/layout/ClientLayout';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

const MSME_DATA: Record<string, any> = {
  'msme-001': {
    name: 'Sharma Tea & Snacks', category: '🍵 Food & Beverage', city: 'Indore', state: 'Madhya Pradesh',
    gstNumber: '23AADCS1234F1ZH', foundingYear: 2015, employees: 12, revenue: 1200000,
    description: 'A beloved local chai stall that has grown into a chain of 3 outlets serving authentic Indori snacks and chai.',
    targetAmount: 500000, amountRaised: 325000, equityOffered: 8,
    tokenPrice: 0.001,
    contractAddress: '',
    riskScore: { score: 72, label: 'Conservative', factors: [
      { name: 'Business Age', score: 70, weight: 30 },
      { name: 'Revenue', score: 70, weight: 25 },
      { name: 'Sector', score: 75, weight: 20 },
      { name: 'Team Size', score: 55, weight: 15 },
      { name: 'Equity Offered', score: 65, weight: 10 },
    ]},
  },
  'msme-002': {
    name: 'Patil Textiles', category: '🧵 Textile', city: 'Pune', state: 'Maharashtra',
    gstNumber: '27AADCS5678B1ZH', foundingYear: 2018, employees: 25, revenue: 2500000,
    description: 'Traditional handloom textile manufacturer exporting to 5 countries.',
    targetAmount: 1000000, amountRaised: 450000, equityOffered: 12,
    tokenPrice: 0.001,
    contractAddress: '',
    riskScore: { score: 58, label: 'Moderate', factors: [
      { name: 'Business Age', score: 60, weight: 30 },
      { name: 'Revenue', score: 65, weight: 25 },
      { name: 'Sector', score: 55, weight: 20 },
      { name: 'Team Size', score: 60, weight: 15 },
      { name: 'Equity Offered', score: 45, weight: 10 },
    ]},
  },
};

const DEFAULT_MSME = {
  name: 'Sample MSME Business', category: '🏢 Business', city: 'Mumbai', state: 'Maharashtra',
  gstNumber: '27AADCS0000A1ZH', foundingYear: 2020, employees: 10, revenue: 800000,
  description: 'A growing Indian MSME looking to raise micro-equity capital through blockchain tokenisation.',
  targetAmount: 500000, amountRaised: 200000, equityOffered: 10,
  tokenPrice: 0.001,
  contractAddress: '',
  riskScore: { score: 55, label: 'Moderate', factors: [
    { name: 'Business Age', score: 50, weight: 30 },
    { name: 'Revenue', score: 50, weight: 25 },
    { name: 'Sector', score: 60, weight: 20 },
    { name: 'Team Size', score: 55, weight: 15 },
    { name: 'Equity Offered', score: 65, weight: 10 },
  ]},
};

const riskColors: Record<string, string> = {
  Conservative: 'text-green-400 bg-green-400/10 border-green-400/30',
  Moderate: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  High: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  Speculative: 'text-red-400 bg-red-400/10 border-red-400/30',
};

const translations: Record<string, any> = {
  en: {
    about: 'About', revenue: 'Revenue', employees: 'Employees', gst: 'GST',
    risk: 'AI Risk Assessment', fundraising: 'Fundraising',
    raised: 'raised of', funded: 'funded', equity: 'Equity Offered',
    minInvest: 'Min Investment', buyTokens: 'Buy Tokens',
    amount: 'Investment Amount (₹)', minimum: 'Minimum: ₹100',
    youGet: 'You get approximately', tokens: 'tokens',
    equityShare: 'Equity share', investNow: 'Invest Now →',
    processing: '⏳ Processing...',
    testnet: '⚠️ Uses test MATIC — no real money',
    connectFirst: 'Connect wallet first!',
    success: '🎉 Transaction sent! Check Polygonscan.',
    failed: 'Transaction failed. Try again.',
    polygonscan: 'View on Polygonscan',
    sebi: '⚠️ SEBI Disclaimer: Educational prototype only. Not financial advice.',
    txHistory: 'Transaction History',
    noTx: 'No transactions yet',
    est: 'Est.',
  },
  hi: {
    about: 'परिचय', revenue: 'राजस्व', employees: 'कर्मचारी', gst: 'GST',
    risk: 'AI जोखिम मूल्यांकन', fundraising: 'फंडरेजिंग',
    raised: 'जुटाए', funded: 'फंडेड', equity: 'इक्विटी',
    minInvest: 'न्यूनतम निवेश', buyTokens: 'टोकन खरीदें',
    amount: 'निवेश राशि (₹)', minimum: 'न्यूनतम: ₹100',
    youGet: 'आपको मिलेंगे', tokens: 'टोकन',
    equityShare: 'इक्विटी हिस्सा', investNow: 'अभी निवेश करें →',
    processing: '⏳ प्रोसेसिंग...',
    testnet: '⚠️ टेस्ट MATIC — कोई वास्तविक पैसा नहीं',
    connectFirst: 'पहले वॉलेट जोड़ें!',
    success: '🎉 लेनदेन भेजा गया! Polygonscan देखें।',
    failed: 'लेनदेन विफल। पुनः प्रयास करें।',
    polygonscan: 'Polygonscan पर देखें',
    sebi: '⚠️ SEBI अस्वीकरण: केवल शैक्षिक प्रोटोटाइप। वित्तीय सलाह नहीं।',
    txHistory: 'लेनदेन इतिहास',
    noTx: 'अभी तक कोई लेनदेन नहीं',
    est: 'स्था.',
  }
};

export default function MSMEDetailPage({ params }: { params: { id: string } }) {
  const { lang } = useLang();
  const t = translations[lang];
  const { isConnected, provider, address } = useWallet();
  const [investAmount, setInvestAmount] = useState('100');
  const [isInvesting, setIsInvesting] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);

  const msme = MSME_DATA[params.id] || DEFAULT_MSME;
  const progress = (msme.amountRaised / msme.targetAmount) * 100;

  const formatINR = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const handleInvest = async () => {
    if (!isConnected) { toast.error(t.connectFirst); return; }

    setIsInvesting(true);
    try {
      const signer = await provider!.getSigner();
      const amountInINR = parseFloat(investAmount) || 100;
      // Convert INR to MATIC (1 INR ≈ 0.001 MATIC for demo)
      const maticAmount = (amountInINR * 0.001).toFixed(6);
      const maticWei = ethers.parseEther(maticAmount);

      // Send real MetaMask transaction
      const tx = await signer.sendTransaction({
        to: address!, // sending to self for demo (replace with contract address)
        value: maticWei,
        gasLimit: 21000,
      });

      toast.loading('⏳ Waiting for confirmation...', { id: 'tx' });
      await tx.wait();
      toast.dismiss('tx');

      setTxHash(tx.hash);
      setTransactions(prev => [{
        hash: tx.hash,
        amount: amountInINR,
        matic: maticAmount,
        tokens: amountInINR,
        time: new Date().toLocaleTimeString(),
      }, ...prev]);

      toast.success(
        <div>
          <div>{t.success}</div>
          <a
            href={`https://amoy.polygonscan.com/tx/${tx.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline text-xs"
          >
            {t.polygonscan} →
          </a>
        </div>,
        { duration: 8000 }
      );
    } catch (error: any) {
      if (error.code === 4001) {
        toast.error('Transaction rejected by user.');
      } else {
        toast.error(t.failed);
        console.error(error);
      }
    } finally {
      setIsInvesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050A18]">
      <div className="disclaimer-banner">{t.sebi}</div>

      <div className="page-container py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-3xl">
                {msme.category.split(' ')[0]}
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">{msme.name}</h1>
                <p className="text-gray-400">📍 {msme.city}, {msme.state} • {t.est} {msme.foundingYear}</p>
              </div>
            </div>
          </div>
          <span className={`text-sm font-bold px-4 py-2 rounded-xl border ${riskColors[msme.riskScore.label]}`}>
            {msme.riskScore.label} • {msme.riskScore.score}/100
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-white mb-4">📖 {t.about}</h2>
              <p className="text-gray-400 mb-6">{msme.description}</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <p className="text-gray-500 text-xs mb-1">{t.revenue}</p>
                  <p className="text-blue-400 font-bold text-sm">{formatINR(msme.revenue)}</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <p className="text-gray-500 text-xs mb-1">{t.employees}</p>
                  <p className="text-white font-bold">{msme.employees}</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <p className="text-gray-500 text-xs mb-1">{t.gst}</p>
                  <p className="text-white font-bold text-xs">{msme.gstNumber}</p>
                </div>
              </div>
            </div>

            {/* Risk */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-white mb-6">🤖 {t.risk}</h2>
              <div className="space-y-4">
                {msme.riskScore.factors.map((factor: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">{factor.name}</span>
                      <span className="text-white font-medium">{factor.score}/100
                        <span className="text-gray-500 ml-1">({factor.weight}%)</span>
                      </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          factor.score >= 70 ? 'bg-green-500' :
                          factor.score >= 50 ? 'bg-yellow-500' :
                          factor.score >= 35 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction History */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-white mb-4">📋 {t.txHistory}</h2>
              {transactions.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">{t.noTx}</p>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx, i) => (
                    <div key={i} className="bg-gray-800/50 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <div className="text-white text-sm font-medium">₹{tx.amount} → {tx.tokens} tokens</div>
                        <div className="text-gray-500 text-xs">{tx.time} • {tx.matic} MATIC</div>
                      </div>
                      <a
                        href={`https://amoy.polygonscan.com/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 text-xs hover:underline"
                      >
                        View ↗
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">
            {/* Fundraising */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-white mb-4">💰 {t.fundraising}</h2>
              <div className="text-center mb-4">
                <p className="text-3xl font-black gradient-text">{formatINR(msme.amountRaised)}</p>
                <p className="text-gray-500 text-sm">{t.raised} {formatINR(msme.targetAmount)}</p>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-center text-blue-400 font-bold text-sm mb-4">{progress.toFixed(1)}% {t.funded}</p>
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500 text-xs">{t.equity}</p>
                  <p className="text-orange-400 font-black text-2xl">{msme.equityOffered}%</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs">{t.minInvest}</p>
                  <p className="text-green-400 font-black text-2xl">₹100</p>
                </div>
              </div>
            </div>

            {/* Buy Tokens */}
            <div className="card p-6 border-blue-500/40 glow-blue">
              <h2 className="text-xl font-bold text-white mb-4">🪙 {t.buyTokens}</h2>
              <div className="mb-4">
                <label className="label">{t.amount}</label>
                <input
                  type="number"
                  className="input-field text-lg font-bold"
                  min={100}
                  step={100}
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">{t.minimum}</p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{t.youGet}</span>
                  <span className="text-white font-bold">{parseInt(investAmount) || 0} {t.tokens}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{t.equityShare}</span>
                  <span className="text-orange-400 font-bold">
                    {((parseInt(investAmount) || 0) / msme.targetAmount * msme.equityOffered).toFixed(4)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">MATIC cost</span>
                  <span className="text-blue-400 font-bold">
                    {((parseInt(investAmount) || 0) * 0.001).toFixed(4)} MATIC
                  </span>
                </div>
              </div>

              <button
                className="btn-primary w-full text-lg py-4"
                onClick={handleInvest}
                disabled={isInvesting}
              >
                {isInvesting ? t.processing : t.investNow}
              </button>

              {txHash && (
                <a
                  href={`https://amoy.polygonscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-blue-400 text-xs mt-3 hover:underline"
                >
                  ✅ {t.polygonscan} ↗
                </a>
              )}

              <p className="text-xs text-gray-500 text-center mt-3">{t.testnet}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}