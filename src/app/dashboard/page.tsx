'use client';

import { useWallet } from '@/hooks/useWallet';
import DisclaimerBanner from '@/components/layout/DisclaimerBanner';

export default function DashboardPage() {
  const { address, isConnected, balance } = useWallet();

  if (!isConnected) {
    return (
      <div className="page-container animate-fade-in">
        <div className="flex flex-col items-center justify-center py-20">
          <span className="text-6xl mb-4">🦊</span>
          <h1 className="text-3xl font-bold mb-2">Connect Your Wallet</h1>
          <p className="text-gray-500 mb-6">Please connect MetaMask to view your dashboard</p>
          <p className="text-sm text-gray-400">Click the &quot;Connect Wallet&quot; button in the navbar</p>
        </div>
      </div>
    );
  }

  const sampleHoldings = [
    { name: 'Sharma Tea & Snacks', tokens: '500', value: '₹2,500', dividends: '₹125', change: '+5.2%' },
    { name: 'Patil Textiles', tokens: '200', value: '₹1,800', dividends: '₹45', change: '+2.1%' },
    { name: 'Rajasthani Handicrafts', tokens: '1000', value: '₹5,000', dividends: '₹300', change: '+8.5%' },
  ];

  return (
    <div className="page-container animate-fade-in">
      <DisclaimerBanner />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2">
          <span className="gradient-text">Investor Dashboard</span>
        </h1>
        <p className="text-gray-600">
          Track your MSME investments and earnings
        </p>
      </div>

      {/* Wallet Info */}
      <div className="card bg-gradient-to-br from-primary-600 to-primary-800 text-white mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <p className="text-primary-200 text-sm">Connected Wallet</p>
            <p className="font-mono text-lg">{address}</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-primary-200 text-sm">Balance</p>
            <p className="text-2xl font-bold">{parseFloat(balance).toFixed(4)} MATIC</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card text-center">
          <p className="text-gray-500 text-sm">Total Invested</p>
          <p className="text-2xl font-bold text-primary-600">₹9,300</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-500 text-sm">Current Value</p>
          <p className="text-2xl font-bold text-india-green">₹9,800</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-500 text-sm">Total Dividends</p>
          <p className="text-2xl font-bold text-saffron">₹470</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-500 text-sm">MSMEs Invested</p>
          <p className="text-2xl font-bold text-india-blue">3</p>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">📊 Your Holdings</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-sm text-gray-500">MSME</th>
                <th className="text-right py-3 px-2 text-sm text-gray-500">Tokens</th>
                <th className="text-right py-3 px-2 text-sm text-gray-500">Value</th>
                <th className="text-right py-3 px-2 text-sm text-gray-500">Dividends</th>
                <th className="text-right py-3 px-2 text-sm text-gray-500">Change</th>
              </tr>
            </thead>
            <tbody>
              {sampleHoldings.map((holding, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium">{holding.name}</td>
                  <td className="py-3 px-2 text-right">{holding.tokens}</td>
                  <td className="py-3 px-2 text-right font-semibold">{holding.value}</td>
                  <td className="py-3 px-2 text-right text-saffron">{holding.dividends}</td>
                  <td className="py-3 px-2 text-right text-india-green font-medium">{holding.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card mt-6">
        <h2 className="text-xl font-bold mb-4">📜 Recent Transactions</h2>
        <div className="space-y-3">
          {[
            { type: '💰 Investment', msme: 'Sharma Tea & Snacks', amount: '₹2,500', time: '2 hours ago', color: 'text-primary-600' },
            { type: '📈 Dividend', msme: 'Rajasthani Handicrafts', amount: '+₹300', time: '1 day ago', color: 'text-india-green' },
            { type: '💰 Investment', msme: 'Patil Textiles', amount: '₹1,800', time: '3 days ago', color: 'text-primary-600' },
          ].map((tx, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-50">
              <div>
                <p className="font-medium text-sm">{tx.type}</p>
                <p className="text-xs text-gray-500">{tx.msme}</p>
              </div>
              <div className="text-right">
                <p className={`font-bold text-sm ${tx.color}`}>{tx.amount}</p>
                <p className="text-xs text-gray-400">{tx.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}