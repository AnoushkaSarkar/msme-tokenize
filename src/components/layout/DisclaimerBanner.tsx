interface DisclaimerBannerProps {
  type?: 'default' | 'investment' | 'governance';
}

export default function DisclaimerBanner({ type = 'default' }: DisclaimerBannerProps) {
  const messages = {
    default: '⚠️ This is an educational prototype built for INNOVATHON 2026. Not a real securities offering. Testnet only.',
    investment: '⚠️ MOCK INVESTMENT ONLY — Uses test MATIC with no real value. This does NOT constitute a real securities purchase. SEBI registration required for actual operations.',
    governance: '⚠️ SIMULATED GOVERNANCE — Votes are recorded on testnet only. No real corporate decisions are being made. Educational demonstration only.',
  };

  return (
    <div className="bg-amber-950/50 border border-amber-800/50 rounded-lg p-3 mb-6">
      <p className="text-amber-400 text-xs font-medium text-center">
        {messages[type]}
      </p>
    </div>
  );
}