'use client';

import { useState } from 'react';
import DisclaimerBanner from '@/components/layout/DisclaimerBanner';
import toast from 'react-hot-toast';

const PENDING_MSMES = [
  { id: '1', name: 'Chennai Chettinad Kitchen', category: '🍵 Food & Beverage', city: 'Chennai', target: '₹3,00,000', equity: '6%' },
  { id: '2', name: 'Kolkata Craft Studio', category: '🎨 Handicraft', city: 'Kolkata', target: '₹2,00,000', equity: '8%' },
];

export default function AdminPage() {
  const [msmes, setMsmes] = useState(PENDING_MSMES);

  const handleApprove = (id: string, name: string) => {
    setMsmes((prev) => prev.filter((m) => m.id !== id));
    toast.success(`✅ ${name} approved!`);
  };

  const handleReject = (id: string, name: string) => {
    setMsmes((prev) => prev.filter((m) => m.id !== id));
    toast.error(`❌ ${name} rejected`);
  };

  return (
    <div className="page-container animate-fade-in">
      <DisclaimerBanner />

      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2">
          <span className="gradient-text">Admin Panel</span>
        </h1>
        <p className="text-gray-600">Manage platform and approve MSME registrations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card text-center">
          <p className="text-gray-500 text-sm">Pending Approval</p>
          <p className="text-3xl font-bold text-saffron">{msmes.length}</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-500 text-sm">Total Approved</p>
          <p className="text-3xl font-bold text-india-green">6</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-500 text-sm">Total Raised</p>
          <p className="text-3xl font-bold text-primary-600">₹30.25L</p>
        </div>
      </div>

      {/* Pending MSMEs */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">📋 Pending Approvals</h2>
        {msmes.length > 0 ? (
          <div className="space-y-4">
            {msmes.map((msme) => (
              <div key={msme.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-bold">{msme.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-white px-2 py-1 rounded-full">{msme.category}</span>
                    <span className="text-xs bg-white px-2 py-1 rounded-full">📍 {msme.city}</span>
                    <span className="text-xs bg-white px-2 py-1 rounded-full">🎯 {msme.target}</span>
                    <span className="text-xs bg-white px-2 py-1 rounded-full">📊 {msme.equity}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 md:mt-0">
                  <button
                    className="bg-green-100 hover:bg-green-200 text-green-700 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                    onClick={() => handleApprove(msme.id, msme.name)}
                  >
                    ✅ Approve
                  </button>
                  <button
                    className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                    onClick={() => handleReject(msme.id, msme.name)}
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="text-4xl block mb-2">✅</span>
            <p className="text-gray-500">All caught up! No pending approvals.</p>
          </div>
        )}
      </div>
    </div>
  );
}