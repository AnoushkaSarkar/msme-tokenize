'use client';

import { useState } from 'react';
import MSMECard from '@/components/msme/MSMECard';
import EmptyState from '@/components/common/EmptyState';
import DisclaimerBanner from '@/components/layout/DisclaimerBanner';
import { CATEGORY_LABELS } from '@/types';

const SAMPLE_MSMES = [
  {
    id: 'msme-001',
    name: 'Sharma Tea & Snacks',
    category: 'food_beverage',
    city: 'Indore',
    state: 'Madhya Pradesh',
    targetAmount: 500000,
    amountRaised: 325000,
    equityOffered: 8,
    riskScore: { score: 72, label: 'Conservative' },
    foundingYear: 2015,
    employees: 12,
  },
  {
    id: 'msme-002',
    name: 'Patil Textiles',
    category: 'textile',
    city: 'Pune',
    state: 'Maharashtra',
    targetAmount: 1000000,
    amountRaised: 450000,
    equityOffered: 12,
    riskScore: { score: 58, label: 'Moderate' },
    foundingYear: 2018,
    employees: 25,
  },
  {
    id: 'msme-003',
    name: 'GreenGrow Dairy Farm',
    category: 'agriculture',
    city: 'Jaipur',
    state: 'Rajasthan',
    targetAmount: 750000,
    amountRaised: 120000,
    equityOffered: 10,
    riskScore: { score: 65, label: 'Moderate' },
    foundingYear: 2020,
    employees: 8,
  },
  {
    id: 'msme-004',
    name: 'TechSeva Solutions',
    category: 'technology',
    city: 'Bangalore',
    state: 'Karnataka',
    targetAmount: 2000000,
    amountRaised: 1800000,
    equityOffered: 15,
    riskScore: { score: 45, label: 'High' },
    foundingYear: 2022,
    employees: 6,
  },
  {
    id: 'msme-005',
    name: 'Rajasthani Handicrafts',
    category: 'handicraft',
    city: 'Jaipur',
    state: 'Rajasthan',
    targetAmount: 300000,
    amountRaised: 280000,
    equityOffered: 5,
    riskScore: { score: 78, label: 'Conservative' },
    foundingYear: 2010,
    employees: 20,
  },
  {
    id: 'msme-006',
    name: 'Mumbai Masala Kitchen',
    category: 'food_beverage',
    city: 'Mumbai',
    state: 'Maharashtra',
    targetAmount: 400000,
    amountRaised: 50000,
    equityOffered: 7,
    riskScore: { score: 32, label: 'Speculative' },
    foundingYear: 2024,
    employees: 3,
  },
];

export default function ListingsPage() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMSMEs = SAMPLE_MSMES.filter((msme) => {
    if (categoryFilter !== 'all' && msme.category !== categoryFilter) return false;
    if (cityFilter !== 'all' && msme.city !== cityFilter) return false;
    if (riskFilter !== 'all' && msme.riskScore.label !== riskFilter) return false;
    if (searchQuery && !msme.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="page-container animate-fade-in">
      <DisclaimerBanner type="investment" />

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black mb-2">
          <span className="gradient-text">Browse MSME Listings</span>
        </h1>
        <p className="text-gray-400">
          Discover investment opportunities in verified Indian MSMEs
        </p>
      </div>

      {/* Stats Bar */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <div className="bg-blue-900/30 border border-blue-800/50 px-4 py-2 rounded-full text-sm text-blue-300">
          📊 <strong className="text-blue-200">{SAMPLE_MSMES.length}</strong> MSMEs Listed
        </div>
        <div className="bg-green-900/30 border border-green-800/50 px-4 py-2 rounded-full text-sm text-green-300">
          💰 <strong className="text-green-200">₹{(SAMPLE_MSMES.reduce((a, b) => a + b.amountRaised, 0) / 100000).toFixed(1)}L</strong> Total Raised
        </div>
        <div className="bg-orange-900/30 border border-orange-800/50 px-4 py-2 rounded-full text-sm text-orange-300">
          🏢 <strong className="text-orange-200">{new Set(SAMPLE_MSMES.map(m => m.city)).size}</strong> Cities
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label">🔍 Search</label>
            <input
              type="text"
              className="input-field"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <label className="label">📁 Category</label>
            <select
              className="input-field"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">📍 City</label>
            <select
              className="input-field"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <option value="all">All Cities</option>
              {[...new Set(SAMPLE_MSMES.map(m => m.city))].map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">⚡ Risk Level</label>
            <select
              className="input-field"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="Conservative">🟢 Conservative</option>
              <option value="Moderate">🟡 Moderate</option>
              <option value="High">🟠 High</option>
              <option value="Speculative">🔴 Speculative</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing {filteredMSMEs.length} of {SAMPLE_MSMES.length} MSMEs
      </p>

      {/* MSME Grid */}
      {filteredMSMEs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMSMEs.map((msme) => (
            <MSMECard key={msme.id} {...msme} />
          ))}
        </div>
      ) : (
        <EmptyState
          emoji="🔍"
          title="No MSMEs Found"
          description="Try changing your filters to see more results"
          actionLabel="Clear Filters"
          onAction={() => {
            setCategoryFilter('all');
            setCityFilter('all');
            setRiskFilter('all');
            setSearchQuery('');
          }}
        />
      )}
    </div>
  );
}