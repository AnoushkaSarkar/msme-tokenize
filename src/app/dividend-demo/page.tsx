'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import DisclaimerBanner from '@/components/layout/DisclaimerBanner';
import toast from 'react-hot-toast';

export default function DividendDemoPage() {
  const { isConnected } = useWallet();
  const [dividendAmount, setDividendAmount] = useState('0.1');
  const [isDistributing, setIsDistributing] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const sampleHolders = [
    { address: '0x1234...5678', tokens: 500, percentage: 50 },
    { address: '0xabcd...efgh', tokens: 300, percentage: 30 },
    { address: '0x9876...4321', tokens: 200, percentage: 20 },
  ];

  const handleDistribute = async () => {
    if (!isConnected) { toast.error('Connect wallet first!'); return; }

    setIsDistributing(true);
    setResults([]);

    // Simulate distribution
    for (let i = 0; i < sampleHolders.length; i++) {
      await new Promise((r) => setTimeout(r, 1500));
      const holder = sampleHolders[i];
      const amount = (parseFloat(dividendAmount) * holder.percentage / 100).toFixed(4);
      setResults((prev) => [...prev, {
        address: holder.address,
        amount: `${amount} MATIC`,
        txHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      }]);
    }

    setIsDistributing(false);
    toast.success('🎉 Dividends distributed successfully!');
  };

  return (
    <div className="page-container animate-fade-in">
      <DisclaimerBanner />

      <div className="text-center mb-8">
        <h1 className="text-4xl font-black mb-2">
          <span className="gradient-text">Dividend Distribution Demo</span>
        </h1>
        <p className="text-gray-600">Watch live dividend distribution to token holders</p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Token Holders */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">👥 Token Holders — Sharma Tea & Snacks</h2>
          <div className="space-y-3">
            {sampleHolders.map((holder, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-mono text-sm">{holder.address}</p>
                  <p className="text-xs text-gray-500">{holder.tokens} tokens</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-600">{holder.percentage}%</p>
                  <p className="text-xs text-gray-500">ownership</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution Controls */}
        <div className="card border-2 border-saffron mb-6">
          <h2 className="text-xl font-bold mb-4">💰 Distribute Dividends</h2>
          <div>
            <label className="label">Dividend Amount (MATIC)</label>
            <input
              type="number"
              className="input-field text-lg font-bold"
              min={0.01}
              step={0.01}
              value={dividendAmount}
              onChange={(e) => setDividendAmount(e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">Uses test MATIC — no real value</p>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <p className="text-sm font-semibold mb-2">Distribution Preview:</p>
            {sampleHolders.map((holder, i) => (
              <div key={i} className="flex justify-between text-sm py-1">
                <span className="text-gray-600">{holder.address} ({holder.percentage}%)</span>
                <span className="font-medium">
                  {(parseFloat(dividendAmount) * holder.percentage / 100).toFixed(4)} MATIC
                </span>
              </div>
            ))}
          </div>

          <button
            className="btn-saffron w-full mt-4 text-lg"
            onClick={handleDistribute}
            disabled={isDistributing}
          >
            {isDistributing ? '⏳ Distributing...' : '🚀 Distribute Dividends'}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="card border-2 border-green-300 bg-green-50">
            <h2 className="text-xl font-bold mb-4 text-green-800">✅ Distribution Results</h2>
            <div className="space-y-3">
              {results.map((result, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-white rounded-lg animate-fade-in">
                  <div>
                    <p className="font-mono text-sm">{result.address}</p>
                    <p className="text-xs text-blue-600 hover:underline cursor-pointer">
                      Tx: {result.txHash} ↗
                    </p>
                  </div>
                  <p className="font-bold text-green-600">{result.amount}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}