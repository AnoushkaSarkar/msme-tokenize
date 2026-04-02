'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  doc, 
  updateDoc, 
  increment, 
  getDoc, 
  setDoc,
  collection,
  getDocs
} from 'firebase/firestore';

// ─── TYPES ───────────────────────────────────────────────
interface VoteData {
  msmeId: string;
  msmeName: string;
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  lastUpdated: string;
}

interface MSMEProposal {
  id: string;
  name: string;
  city: string;
  category: string;
  targetAmount: number;
  description: string;
  status: 'active' | 'passed' | 'rejected';
  deadline: string;
}

// ─── SAMPLE PROPOSALS (replace with Firebase fetch later) ──
const SAMPLE_PROPOSALS: MSMEProposal[] = [
  {
    id: 'msme_sharma_tea',
    name: 'Sharma Tea & Snacks',
    city: 'Indore',
    category: 'Food & Beverage',
    targetAmount: 500000,
    description: 'Expanding chai stall to 3 locations in Indore. Need funds for equipment and staff.',
    status: 'active',
    deadline: '2026-04-15'
  },
  {
    id: 'msme_riya_textiles',
    name: 'Riya Textiles',
    city: 'Surat',
    category: 'Textiles',
    targetAmount: 750000,
    description: 'Purchasing 5 new looms to increase production capacity by 40%.',
    status: 'active',
    deadline: '2026-04-20'
  },
  {
    id: 'msme_kumar_tech',
    name: 'Kumar Tech Solutions',
    city: 'Pune',
    category: 'Technology',
    targetAmount: 1000000,
    description: 'Building a SaaS platform for local kirana stores to manage inventory.',
    status: 'active',
    deadline: '2026-04-25'
  },
  {
    id: 'msme_delhi_bakery',
    name: 'Delhi Delights Bakery',
    city: 'Delhi',
    category: 'Food & Beverage',
    targetAmount: 300000,
    description: 'Opening second outlet and adding online delivery service.',
    status: 'passed',
    deadline: '2026-03-30'
  },
  {
    id: 'msme_mumbai_crafts',
    name: 'Mumbai Handcrafts',
    city: 'Mumbai',
    category: 'Handicrafts',
    targetAmount: 400000,
    description: 'Exporting handmade products to international markets via e-commerce.',
    status: 'rejected',
    deadline: '2026-03-25'
  }
];

// ─── HINDI TRANSLATIONS ──────────────────────────────────
const translations = {
  en: {
    title: 'Governance',
    subtitle: 'Vote on MSME funding proposals. Your tokens = Your voting power.',
    activeProposals: 'Active Proposals',
    pastProposals: 'Past Proposals',
    voteFor: '✅ Vote For',
    voteAgainst: '❌ Vote Against',
    votesFor: 'Votes For',
    votesAgainst: 'Votes Against',
    totalVotes: 'Total Votes',
    deadline: 'Deadline',
    target: 'Target',
    category: 'Category',
    city: 'City',
    status: 'Status',
    passed: '✅ Passed',
    rejected: '❌ Rejected',
    active: '🔵 Active',
    alreadyVoted: 'Already Voted',
    voteSuccess: 'Vote recorded successfully!',
    voteFail: 'Vote failed — try again',
    loading: 'Loading votes...',
    noProposals: 'No proposals yet',
    howItWorks: 'How Governance Works',
    step1: 'Buy tokens in any MSME',
    step2: 'Your tokens = voting power',
    step3: 'Vote on funding proposals',
    step4: 'Majority decides funding',
  },
  hi: {
    title: 'शासन',
    subtitle: 'MSME फंडिंग प्रस्तावों पर वोट करें। आपके टोकन = आपकी वोटिंग शक्ति।',
    activeProposals: 'सक्रिय प्रस्ताव',
    pastProposals: 'पिछले प्रस्ताव',
    voteFor: '✅ पक्ष में वोट',
    voteAgainst: '❌ विरोध में वोट',
    votesFor: 'पक्ष में वोट',
    votesAgainst: 'विरोध में वोट',
    totalVotes: 'कुल वोट',
    deadline: 'अंतिम तिथि',
    target: 'लक्ष्य',
    category: 'श्रेणी',
    city: 'शहर',
    status: 'स्थिति',
    passed: '✅ पारित',
    rejected: '❌ अस्वीकृत',
    active: '🔵 सक्रिय',
    alreadyVoted: 'पहले से वोट किया',
    voteSuccess: 'वोट सफलतापूर्वक दर्ज किया गया!',
    voteFail: 'वोट विफल — पुनः प्रयास करें',
    loading: 'वोट लोड हो रहे हैं...',
    noProposals: 'अभी कोई प्रस्ताव नहीं',
    howItWorks: 'शासन कैसे काम करता है',
    step1: 'किसी भी MSME में टोकन खरीदें',
    step2: 'आपके टोकन = वोटिंग शक्ति',
    step3: 'फंडिंग प्रस्तावों पर वोट करें',
    step4: 'बहुमत फंडिंग तय करता है',
  }
};

// ─── MAIN COMPONENT ──────────────────────────────────────
export default function GovernancePage() {
  const [voteData, setVoteData] = useState<Record<string, VoteData>>({});
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [isHindi, setIsHindi] = useState(false);

  const t = translations[isHindi ? 'hi' : 'en'];

  // ── Load Hindi preference from localStorage ──
  useEffect(() => {
    const stored = localStorage.getItem('isHindi');
    if (stored === 'true') setIsHindi(true);

    // Load already voted IDs from localStorage
    const voted = localStorage.getItem('governance_voted');
    if (voted) setVotedIds(new Set(JSON.parse(voted)));
  }, []);

  // ── Fetch all votes from Firebase ──
  const fetchVotes = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'governance_votes'));
      const data: Record<string, VoteData> = {};
      
      snapshot.forEach((doc) => {
        data[doc.id] = doc.data() as VoteData;
      });
      
      setVoteData(data);
    } catch (error) {
      console.error('Failed to fetch votes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  // ── Handle Vote ──
  const handleVote = async (msmeId: string, msmeName: string, voteType: 'for' | 'against') => {
    // Check if already voted
    if (votedIds.has(msmeId)) {
      alert(t.alreadyVoted);
      return;
    }

    try {
      setVoting(msmeId);
      const voteRef = doc(db, 'governance_votes', msmeId);
      const voteSnap = await getDoc(voteRef);

      if (voteSnap.exists()) {
        // Update existing
        await updateDoc(voteRef, {
          [voteType === 'for' ? 'votesFor' : 'votesAgainst']: increment(1),
          totalVotes: increment(1),
          lastUpdated: new Date().toISOString()
        });
      } else {
        // Create new
        await setDoc(voteRef, {
          msmeId,
          msmeName,
          votesFor: voteType === 'for' ? 1 : 0,
          votesAgainst: voteType === 'against' ? 1 : 0,
          totalVotes: 1,
          lastUpdated: new Date().toISOString()
        });
      }

      // Save voted state locally
      const newVoted = new Set(votedIds);
      newVoted.add(msmeId);
      setVotedIds(newVoted);
      localStorage.setItem('governance_voted', JSON.stringify([...newVoted]));

      // Refresh votes
      await fetchVotes();
      alert(`✅ ${t.voteSuccess}`);

    } catch (error) {
      console.error('Vote failed:', error);
      alert(`❌ ${t.voteFail}`);
    } finally {
      setVoting(null);
    }
  };

  // ── Get vote percentage ──
  const getPercentage = (votes: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  // ── Filter proposals ──
  const activeProposals = SAMPLE_PROPOSALS.filter(p => p.status === 'active');
  const pastProposals = SAMPLE_PROPOSALS.filter(p => p.status !== 'active');

  // ─── RENDER ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      
      {/* ── HEADER ── */}
      <div className="bg-gradient-to-r from-[#0a0e1a] via-[#0d1528] to-[#0a0e1a] border-b border-cyan-900/30 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-3">
            🏛️ {t.title}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t.subtitle}
          </p>

          {/* Stats Bar */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">
                {activeProposals.length}
              </div>
              <div className="text-xs text-gray-500 mt-1">{t.activeProposals}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {Object.values(voteData).reduce((sum, v) => sum + v.totalVotes, 0)}
              </div>
              <div className="text-xs text-gray-500 mt-1">{t.totalVotes}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {votedIds.size}
              </div>
              <div className="text-xs text-gray-500 mt-1">Your Votes</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* ── HOW IT WORKS ── */}
        <div className="bg-[#0d1528] border border-cyan-900/30 rounded-xl p-6 mb-10">
          <h2 className="text-lg font-semibold text-cyan-400 mb-4">
            ℹ️ {t.howItWorks}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[t.step1, t.step2, t.step3, t.step4].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-gray-400 text-sm">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'active'
                ? 'bg-cyan-500 text-black'
                : 'bg-[#0d1528] text-gray-400 border border-cyan-900/30 hover:border-cyan-500/50'
            }`}
          >
            🔵 {t.activeProposals} ({activeProposals.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'past'
                ? 'bg-cyan-500 text-black'
                : 'bg-[#0d1528] text-gray-400 border border-cyan-900/30 hover:border-cyan-500/50'
            }`}
          >
            📋 {t.pastProposals} ({pastProposals.length})
          </button>
        </div>

        {/* ── LOADING ── */}
        {loading && (
          <div className="text-center py-20 text-gray-500">
            <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" />
            {t.loading}
          </div>
        )}

        {/* ── PROPOSALS LIST ── */}
        {!loading && (
          <div className="space-y-6">
            {(activeTab === 'active' ? activeProposals : pastProposals).map((proposal) => {
              const votes = voteData[proposal.id];
              const totalVotes = votes?.totalVotes || 0;
              const votesFor = votes?.votesFor || 0;
              const votesAgainst = votes?.votesAgainst || 0;
              const forPct = getPercentage(votesFor, totalVotes);
              const againstPct = getPercentage(votesAgainst, totalVotes);
              const hasVoted = votedIds.has(proposal.id);
              const isVoting = voting === proposal.id;

              return (
                <div
                  key={proposal.id}
                  className="bg-[#0d1528] border border-cyan-900/30 rounded-xl p-6 hover:border-cyan-500/40 transition-all"
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-white">
                          {proposal.name}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          proposal.status === 'active' 
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : proposal.status === 'passed'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {proposal.status === 'active' ? t.active : proposal.status === 'passed' ? t.passed : t.rejected}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <span>📍 {proposal.city}</span>
                        <span>🏷️ {proposal.category}</span>
                        <span>🎯 ₹{proposal.targetAmount.toLocaleString('en-IN')}</span>
                        <span>📅 {proposal.deadline}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                    {proposal.description}
                  </p>

                  {/* Vote Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span className="text-green-400 font-medium">
                        ✅ {t.votesFor}: {votesFor} ({forPct}%)
                      </span>
                      <span className="text-gray-500">
                        {t.totalVotes}: {totalVotes}
                      </span>
                      <span className="text-red-400 font-medium">
                        {againstPct}% ({votesAgainst}) :{t.votesAgainst} ❌
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-[#1a2235] rounded-full overflow-hidden">
                      {totalVotes > 0 ? (
                        <div className="h-full flex">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                            style={{ width: `${forPct}%` }}
                          />
                          <div
                            className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
                            style={{ width: `${againstPct}%` }}
                          />
                        </div>
                      ) : (
                        <div className="h-full bg-gray-700 rounded-full" />
                      )}
                    </div>

                    {totalVotes === 0 && (
                      <p className="text-center text-xs text-gray-600 mt-2">
                        No votes yet — be the first!
                      </p>
                    )}
                  </div>

                  {/* Vote Buttons */}
                  {proposal.status === 'active' && (
                    <div className="flex gap-3">
                      {hasVoted ? (
                        <div className="w-full text-center py-3 rounded-lg bg-gray-800 border border-gray-600 text-gray-400 text-sm">
                          ✅ {t.alreadyVoted}
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleVote(proposal.id, proposal.name, 'for')}
                            disabled={isVoting}
                            className="flex-1 py-3 rounded-lg font-semibold text-sm transition-all bg-green-500/10 border border-green-500/40 text-green-400 hover:bg-green-500/20 hover:border-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isVoting ? (
                              <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full" />
                                Voting...
                              </span>
                            ) : t.voteFor}
                          </button>
                          <button
                            onClick={() => handleVote(proposal.id, proposal.name, 'against')}
                            disabled={isVoting}
                            className="flex-1 py-3 rounded-lg font-semibold text-sm transition-all bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500/20 hover:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isVoting ? (
                              <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full" />
                                Voting...
                              </span>
                            ) : t.voteAgainst}
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {/* Past proposal result */}
                  {proposal.status !== 'active' && totalVotes > 0 && (
                    <div className={`text-center py-3 rounded-lg text-sm font-medium ${
                      proposal.status === 'passed'
                        ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                        : 'bg-red-500/10 border border-red-500/30 text-red-400'
                    }`}>
                      {proposal.status === 'passed' ? t.passed : t.rejected} — {totalVotes} {t.totalVotes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}