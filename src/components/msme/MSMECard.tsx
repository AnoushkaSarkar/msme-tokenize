import Link from 'next/link';
import RiskBadge from './RiskBadge';
import { CATEGORY_LABELS } from '@/types';

interface MSMECardProps {
  id: string;
  name: string;
  category: string;
  city: string;
  state: string;
  targetAmount: number;
  amountRaised: number;
  equityOffered: number;
  riskScore: {
    score: number;
    label: string;
  };
  foundingYear: number;
  employees: number;
}

export default function MSMECard({
  id, name, category, city, state, targetAmount, amountRaised,
  equityOffered, riskScore, foundingYear, employees,
}: MSMECardProps) {
  const progress = Math.min((amountRaised / targetAmount) * 100, 100);
  const categoryLabel = CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category;

  const formatINR = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)} K`;
    return `₹${amount}`;
  };

  return (
    <Link href={`/msme/${id}`}>
      <div className="card hover:scale-[1.02] hover:border-blue-700 transition-all duration-200 cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-100">{name}</h3>
            <p className="text-sm text-gray-500">{categoryLabel}</p>
          </div>
          <RiskBadge score={riskScore.score} label={riskScore.label} />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs bg-blue-900/50 text-blue-400 px-2 py-1 rounded-full">📍 {city}, {state}</span>
          <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">📅 Est. {foundingYear}</span>
          <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">👥 {employees}</span>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Raised: {formatINR(amountRaised)}</span>
            <span className="font-semibold text-blue-400">{formatINR(targetAmount)}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-blue-500 to-orange-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{progress.toFixed(1)}% funded</p>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-800">
          <div>
            <p className="text-xs text-gray-500">Equity</p>
            <p className="text-lg font-bold text-orange-400">{equityOffered}%</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Min Invest</p>
            <p className="text-lg font-bold text-green-400">₹100</p>
          </div>
          <button className="btn-primary text-sm">Invest →</button>
        </div>
      </div>
    </Link>
  );
}