interface RiskBadgeProps {
  score: number;
  label: string;
}

export default function RiskBadge({ score, label }: RiskBadgeProps) {
  const getColor = () => {
    switch (label) {
      case 'Conservative':
        return 'bg-green-900/50 text-green-400 border-green-800';
      case 'Moderate':
        return 'bg-yellow-900/50 text-yellow-400 border-yellow-800';
      case 'High':
        return 'bg-orange-900/50 text-orange-400 border-orange-800';
      case 'Speculative':
        return 'bg-red-900/50 text-red-400 border-red-800';
      default:
        return 'bg-gray-800 text-gray-400 border-gray-700';
    }
  };

  const getEmoji = () => {
    switch (label) {
      case 'Conservative': return '🟢';
      case 'Moderate': return '🟡';
      case 'High': return '🟠';
      case 'Speculative': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border text-sm font-medium ${getColor()}`}>
      <span>{getEmoji()}</span>
      <span>{label}</span>
      <span className="text-xs opacity-75">({score}/100)</span>
    </div>
  );
}