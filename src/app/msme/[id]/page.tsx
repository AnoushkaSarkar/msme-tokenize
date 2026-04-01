'use client';

import { useWallet } from '@/hooks/useWallet';
import RiskBadge from '@/components/msme/RiskBadge';
import DisclaimerBanner from '@/components/layout/DisclaimerBanner';
import toast from 'react-hot-toast';
import { useState } from 'react';

const MSME_DATA: Record<string, any> = {
  'msme-001': {
    name: 'Sharma Tea & Snacks', category: '🍵 Food & Beverage', city: 'Indore', state: 'Madhya Pradesh',
    gstNumber: '23AADCS1234F1ZH', foundingYear: 2015, employees: 12, revenue: 1200000,
    description: 'A beloved local chai stall that has grown into a chain of 3 outlets serving authentic Indori snacks and chai. Known for special garlic chutney and poha.',
    targetAmount: 500000, amountRaised: 325000, equityOffered: 8,
    riskScore: { score: 72, label: 'Conservative', factors: [
      { name: 'Business Age', score: 70, weight: 30 },
      { name: 'Revenue', score: 70, weight: 25 },
      { name: 'Sector', score: 75, weight: 20 },
      { name: 'Team Size', score: 55, weight: 15 },
      { name: 'Equity Offered', score: 65, weight: 10 },
    ]},
  },
};

const DEFAULT_MSME = {
  name: 'Sample MSME Business', category: '🏢 Business', city: 'Mumbai', state: 'Maharashtra',
  gstNumber: '27AADCS0000A1ZH', foundingYear: 2020, employees: 10, revenue: 800000,
  description: 'A growing Indian MSME looking to raise micro-equity capital through blockchain tokenisation.',
  targetAmount: 500000, amountRaised: 200000, equityOffered: 10,
  riskScore: { score: 55, label: 'Moderate', factors: [
    { name: 'Business Age', score: 50, weight: 30 },
    { name: 'Revenue', score: 50, weight: 25 },
    { name: 'Sector', score: 60, weight: 20 },
    { name: 'Team Size', score: 55, weight: 15 },
    { name: 'Equity Offered', score: 65, weight: 10 },
  ]},
};

export default function MSMEDetailPage({ params }: { params: { id: string } }) {
  const { isConnected } = useWallet();
  const [investAmount, setInvestAmount] = useState('100');
  const [isInvesting, setIsInvesting] = useState(false);

  const msme = MSME_DATA[params.id] || DEFAULT_MSME;
  const progress = (msme.amountRaised / msme.targetAmount) * 100;

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const handleInvest = async () => {
    if (!isConnected) { toast.error('Connect your wallet first!'); return; }
    setIsInvesting(true);
    await new Promise((r) => setTimeout(r, 2000));
    toast.success('🎉 Investment successful! Tokens purchased.');
    setIsInvesting(false);
  };

  return (
    <div className="page-container animate-fade-in">
      <DisclaimerBanner type="investment" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-black mb-2">{msme.name}</h1>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm bg-primary-50 text-primary-700 px-3 py-1 rounded-full">{msme.category}</span>
            <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">📍 {msme.city}, {msme.state}</span>
            <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">📅 Est. {msme.foundingYear}</span>
          </div>
        </div>
        <RiskBadge score={msme.riskScore.score} label={msme.riskScore.label} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <div className="card">
            <h2 className="text-xl font-bold mb-3">📖 About</h2>
            <p className="text-gray-600">{msme.description}</p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="font-bold text-primary-600">{formatINR(msme.revenue)}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Employees</p>
                <p className="font-bold">{msme.employees}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">GST</p>
                <p className="font-bold text-xs">{msme.gstNumber}</p>
              </div>
            </div>
          </div>

          {/* Risk Score Breakdown */}
          <div className="card">
            <h2 className="text-xl font-bold mb-3">🤖 AI Risk Assessment</h2>
            <div className="space-y-3">
              {msme.riskScore.factors.map((factor: any, index: number) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{factor.name}</span>
                    <span className="font-medium">{factor.score}/100 ({factor.weight}% weight)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        factor.score >= 70 ? 'bg-green-500' : factor.score >= 50 ? 'bg-yellow-500' : factor.score >= 35 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${factor.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Invest */}
        <div className="space-y-6">
          {/* Fundraising Progress */}
          <div className="card">
            <h2 className="text-xl font-bold mb-3">💰 Fundraising</h2>
            <div className="text-center mb-4">
              <p className="text-3xl font-black text-primary-600">{formatINR(msme.amountRaised)}</p>
              <p className="text-gray-500">raised of {formatINR(msme.targetAmount)}</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-primary-500 to-saffron h-3 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-500">{progress.toFixed(1)}% funded</p>
            <div className="flex justify-between mt-4 text-sm">
              <div>
                <p className="text-gray-500">Equity Offered</p>
                <p className="font-bold text-saffron text-lg">{msme.equityOffered}%</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500">Min Investment</p>
                <p className="font-bold text-india-green text-lg">₹100</p>
              </div>
            </div>
          </div>

          {/* Buy Tokens */}
          <div className="card border-2 border-saffron">
            <h2 className="text-xl font-bold mb-3">🪙 Buy Tokens</h2>
            <div>
              <label className="label">Investment Amount (₹)</label>
              <input
                type="number"
                className="input-field text-lg font-bold"
                min={100}
                step={100}
                value={investAmount}
                onChange={(e) => setInvestAmount(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">Minimum: ₹100</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 mt-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">You get approximately</span>
                <span className="font-bold">{parseInt(investAmount) || 0} tokens</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-gray-500">Equity share</span>
                <span className="font-bold text-saffron">
                  {((parseInt(investAmount) || 0) / msme.targetAmount * msme.equityOffered).toFixed(4)}%
                </span>
              </div>
            </div>
            <button
              className="btn-saffron w-full mt-4 text-lg"
              onClick={handleInvest}
              disabled={isInvesting}
            >
              {isInvesting ? '⏳ Processing...' : '🚀 Invest Now'}
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">
              Uses test MATIC — no real money
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}