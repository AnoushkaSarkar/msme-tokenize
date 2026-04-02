'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLang } from '@/components/layout/ClientLayout';
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
    description: 'Popular tea stall chain with 3 outlets in Indore serving 500+ customers daily.',
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
    description: 'Traditional handloom textile manufacturer exporting to 5 countries.',
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
    description: 'Organic dairy farm supplying fresh milk to 200+ households in Jaipur.',
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
    description: 'AI-powered rural fintech startup serving unbanked population in Karnataka.',
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
    description: 'Award-winning handicraft cooperative with 20 artisans and global exports.',
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
    description: 'Cloud kitchen startup specializing in authentic Mumbai street food delivery.',
  },
];

const riskColors: Record<string, string> = {
  Conservative: 'text-green-400 bg-green-400/10 border-green-400/30',
  Moderate: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  High: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  Speculative: 'text-red-400 bg-red-400/10 border-red-400/30',
};

const categoryEmojis: Record<string, string> = {
  food_beverage: '🍵',
  textile: '🧵',
  agriculture: '🌾',
  technology: '💻',
  handicraft: '🎨',
  manufacturing: '🏭',
  retail: '🛒',
  healthcare: '🏥',
  education: '📚',
  services: '⚙️',
};

const translations: Record<string, any> = {
  en: {
    title: 'Browse MSME Listings',
    subtitle: 'Discover investment opportunities in verified Indian MSMEs',
    search: 'Search by name...',
    category: 'Category',
    city: 'City',
    risk: 'Risk Level',
    allCategories: 'All Categories',
    allCities: 'All Cities',
    allRisk: 'All Levels',
    showing: 'Showing',
    of: 'of',
    msmes: 'MSMEs',
    invest: 'Invest Now',
    viewDetails: 'View Details',
    raised: 'Raised',
    target: 'Target',
    equity: 'Equity',
    employees: 'employees',
    founded: 'Founded',
    funded: 'funded',
    noResults: 'No MSMEs Found',
    noResultsDesc: 'Try changing your filters',
    clearFilters: 'Clear Filters',
    sebi: '⚠️ SEBI Disclaimer: Educational prototype only. Not financial advice.',
    loading: 'Loading MSMEs...',
  },
  hi: {
    title: 'MSME लिस्टिंग देखें',
    subtitle: 'सत्यापित भारतीय MSMEs में निवेश के अवसर खोजें',
    search: 'नाम से खोजें...',
    category: 'श्रेणी',
    city: 'शहर',
    risk: 'जोखिम स्तर',
    allCategories: 'सभी श्रेणियां',
    allCities: 'सभी शहर',
    allRisk: 'सभी स्तर',
    showing: 'दिखा रहे हैं',
    of: 'में से',
    msmes: 'MSMEs',
    invest: 'अभी निवेश करें',
    viewDetails: 'विवरण देखें',
    raised: 'जुटाए',
    target: 'लक्ष्य',
    equity: 'इक्विटी',
    employees: 'कर्मचारी',
    founded: 'स्थापित',
    funded: 'फंडेड',
    noResults: 'कोई MSME नहीं मिला',
    noResultsDesc: 'फिल्टर बदलकर देखें',
    clearFilters: 'फिल्टर हटाएं',
    sebi: '⚠️ SEBI अस्वीकरण: केवल शैक्षिक प्रोटोटाइप। वित्तीय सलाह नहीं।',
    loading: 'MSME लोड हो रहे हैं...',
  }
};

export default function ListingsPage() {
  const { lang } = useLang();
  const t = translations[lang];
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [allMSMEs, setAllMSMEs] = useState(SAMPLE_MSMES as any[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMSMEs = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'msmes'));
        if (!snapshot.empty) {
          const firebaseMSMEs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            riskScore: (doc.data() as any).riskScore || { score: 50, label: 'Moderate' },
          }));
          setAllMSMEs([...SAMPLE_MSMES, ...firebaseMSMEs]);
        }
      } catch (error) {
        console.error('Firebase error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMSMEs();
  }, []);

  const filteredMSMEs = allMSMEs.filter((msme) => {
    if (categoryFilter !== 'all' && msme.category !== categoryFilter) return false;
    if (cityFilter !== 'all' && msme.city !== cityFilter) return false;
    if (riskFilter !== 'all' && msme.riskScore?.label !== riskFilter) return false;
    if (searchQuery && !msme.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalRaised = allMSMEs.reduce((a, b) => a + (b.amountRaised || 0), 0);

  return (
    <div className="min-h-screen bg-[#050A18]">
      <div className="disclaimer-banner">{t.sebi}</div>

      <div className="page-container py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-400 text-sm font-medium">Polygon Amoy Testnet</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            <span className="gradient-text">{t.title}</span>
          </h1>
          <p className="text-gray-400 text-lg">{t.subtitle}</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-black gradient-text">{allMSMEs.length}</div>
            <div className="text-gray-500 text-sm">MSMEs Listed</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-black text-green-400">₹{(totalRaised / 100000).toFixed(1)}L</div>
            <div className="text-gray-500 text-sm">Total Raised</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-black text-orange-400">
              {new Set(allMSMEs.map(m => m.city)).size}
            </div>
            <div className="text-gray-500 text-sm">Cities</div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="label">🔍 {lang === 'en' ? 'Search' : 'खोजें'}</label>
              <input
                type="text"
                className="input-field"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <label className="label">📁 {t.category}</label>
              <select className="input-field" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="all">{t.allCategories}</option>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">📍 {t.city}</label>
              <select className="input-field" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
                <option value="all">{t.allCities}</option>
                {[...new Set(allMSMEs.map(m => m.city))].map((city) => (
                  <option key={city as string} value={city as string}>{city as string}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">⚡ {t.risk}</label>
              <select className="input-field" value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
                <option value="all">{t.allRisk}</option>
                <option value="Conservative">🟢 Conservative</option>
                <option value="Moderate">🟡 Moderate</option>
                <option value="High">🟠 High</option>
                <option value="Speculative">🔴 Speculative</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">{t.loading}</p>
          </div>
        )}

        {/* Results Count */}
        {!loading && (
          <p className="text-sm text-gray-500 mb-6">
            {t.showing} <span className="text-white font-bold">{filteredMSMEs.length}</span> {t.of} {allMSMEs.length} {t.msmes}
          </p>
        )}

        {/* MSME Grid */}
        {!loading && filteredMSMEs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMSMEs.map((msme) => {
              const progress = ((msme.amountRaised || 0) / (msme.targetAmount || 1)) * 100;
              return (
                <div key={msme.id} className="card p-6 hover:border-blue-500/40 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">
                        {categoryEmojis[msme.category] || '🏪'}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-sm group-hover:text-blue-400 transition-colors">
                          {msme.name}
                        </h3>
                        <p className="text-gray-500 text-xs">{msme.city}, {msme.state}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg border ${riskColors[msme.riskScore?.label] || riskColors.Moderate}`}>
                      {msme.riskScore?.label || 'Moderate'}
                    </span>
                  </div>

                  <p className="text-gray-500 text-xs mb-4 line-clamp-2">{msme.description}</p>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">₹{((msme.amountRaised || 0) / 100000).toFixed(1)}L {t.raised}</span>
                      <span className="text-gray-500">₹{((msme.targetAmount || 0) / 100000).toFixed(1)}L {t.target}</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="text-right text-xs text-blue-400 font-bold mt-1">{progress.toFixed(1)}% {t.funded}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                      <div className="text-white font-bold text-sm">{msme.equityOffered}%</div>
                      <div className="text-gray-500 text-xs">{t.equity}</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                      <div className="text-white font-bold text-sm">{msme.employees || '-'}</div>
                      <div className="text-gray-500 text-xs">{t.employees}</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                      <div className="text-white font-bold text-sm">{msme.foundingYear || '-'}</div>
                      <div className="text-gray-500 text-xs">{t.founded}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/msme/${msme.id}`} className="flex-1 btn-primary text-center text-sm py-2">
                      {t.invest} →
                    </Link>
                    <Link href={`/msme/${msme.id}`} className="btn-secondary text-sm py-2 px-3">
                      {t.viewDetails}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredMSMEs.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-white font-bold text-xl mb-2">{t.noResults}</h3>
            <p className="text-gray-500 mb-6">{t.noResultsDesc}</p>
            <button
              onClick={() => { setCategoryFilter('all'); setCityFilter('all'); setRiskFilter('all'); setSearchQuery(''); }}
              className="btn-primary"
            >
              {t.clearFilters}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}