'use client';

export default function Vibe6Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: {
      wrapper: 'h-6 gap-1',
      icon: 'w-6 h-6 text-[10px]',
      text: 'text-sm',
    },
    md: {
      wrapper: 'h-8 gap-1.5',
      icon: 'w-7 h-7 text-xs',
      text: 'text-base',
    },
    lg: {
      wrapper: 'h-10 gap-2',
      icon: 'w-9 h-9 text-sm',
      text: 'text-xl',
    },
  };

  const s = sizes[size];

  return (
    <div className={`flex items-center ${s.wrapper}`}>
      {/* U6 Icon — matches VIBE6 gradient logo style */}
      <div
        className={`
          ${s.icon} 
          rounded-lg 
          flex items-center justify-center 
          font-black text-white
          bg-gradient-to-br from-blue-500 via-purple-500 to-orange-400
          shadow-sm
        `}
      >
        U6
      </div>

      {/* VIBE6 Text */}
      <span className={`font-black ${s.text} leading-none`}>
        <span style={{ color: '#0d1f3c' }}>VIBE</span>
        <span style={{ color: '#f97316' }}>6</span>
      </span>
    </div>
  );
}