'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import DisclaimerBanner from '@/components/layout/DisclaimerBanner';
import toast from 'react-hot-toast';

const SAMPLE_PROPOSALS = [
  {
    id: 1, title: 'Expand to second location in Vijay Nagar', msme: 'Sharma Tea & Snacks',
    description: 'Proposal to use 40% of raised funds to open a second outlet in the Vijay Nagar area of Indore.',
    proposer: '0x1234...5678', forVotes: 3500, againstVotes: 1200, status: 'active',
    endTime: Date.now() + 86400000 * 2,
  },
  {
    id: 2, title: 'Purchase new weaving machines', msme: 'Patil Textiles',
    description: 'Invest in 3 new automated weaving machines to increase production capacity by 50%.',
    proposer: '0xabcd...efgh', forVotes: 5000, againstVotes: 800, status: 'active',
    endTime: Date.now() + 86400000,
  },
  {
    id: 3, title: 'Launch online delivery service', msme: 'Mumbai Masala Kitchen',
    description: 'Partner with Swiggy and Zomato for online food delivery to increase revenue.',
    proposer: '0x9876...4321', forVotes: 2000, againstVotes: 2100, status: 'passed',
    endTime: Date.now() - 86400000,
  },
];

export default function GovernancePage() {
  const { isConnected } = useWallet();
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);

  const handleVote = (proposalId: number, support: boolean) => {
    if (!isConnected) { toast.error('Connect wallet to vote!'); return; }
    toast.success(`Vote ${support ? 'FOR ✅' : 'AGAINST ❌'} recorded!`);
  };

  return (
    <div className="page-container animate-fade-in">
      <DisclaimerBanner type="governance" />

      <div className="text-center mb-8">
        <h1 className="text-4xl font-black mb-2">
          <span className="gradient-text">Governance</span>
        </h1>
        <p className="text-gray-600">Vote on MSME business decisions with your token power</p>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <div className="bg-primary-50 px-4 py-2 rounded-full text-sm">
          🗳️ <strong>{SAMPLE_PROPOSALS.length}</strong> Total Proposals
        </div>
        <div className="bg-green-50 px-4 py-2 rounded-full text-sm">
          ✅ <strong>{SAMPLE_PROPOSALS.filter(p => p.status === 'active').length}</strong> Active Votes
        </div>
      </div>

      {/* Proposals */}
      <div className="space-y-4">
        {SAMPLE_PROPOSALS.map((proposal) => {
          const totalVotes = proposal.forVotes + proposal.againstVotes;
          const forPercent = totalVotes > 0 ? (proposal.forVotes / totalVotes) * 100 : 50;
          const isActive = proposal.status === 'active';

          return (
            <div key={proposal.id} className="card">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {isActive ? '🟢 Active' : '⚪ Ended'}
                    </span>
                    <span className="text-xs text-gray-400">{proposal.msme}</span>
                  </div>
                  <h3 className="text-lg font-bold">{proposal.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{proposal.description}</p>
                </div>
              </div>

              {/* Vote Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-green-600 font-medium">For: {proposal.forVotes}</span>
                  <span className="text-red-600 font-medium">Against: {proposal.againstVotes}</span>
                </div>
                <div className="w-full bg-red-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-green-500 h-3 rounded-l-full"
                    style={{ width: `${forPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Vote Buttons */}
              {isActive && (
                <div className="flex gap-3 mt-4">
                  <button
                    className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-2 rounded-lg transition-colors"
                    onClick={() => handleVote(proposal.id, true)}
                  >
                    ✅ Vote For
                  </button>
                  <button
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 rounded-lg transition-colors"
                    onClick={() => handleVote(proposal.id, false)}
                  >
                    ❌ Vote Against
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}