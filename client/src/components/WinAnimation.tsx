import { useEffect, useState } from 'react';

interface WinAnimationProps {
  winner: 1 | 2;
}

export function WinAnimation({ winner }: WinAnimationProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  // Winner is on left (1) or right (2)
  const fromLeft = winner === 1;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <img
        src="/animations/67-67-kid.gif"
        alt="Win animation"
        className={`
          w-64 h-64 object-contain
          ${fromLeft ? 'animate-slide-right' : 'animate-slide-left'}
        `}
        style={{
          animation: fromLeft
            ? 'slideRight 2.4s ease-in-out forwards'
            : 'slideLeft 2.4s ease-in-out forwards',
          transform: 'translateY(20px)' // Align with player avatars at center
        }}
      />
      <style>{`
        @keyframes slideRight {
          from {
            transform: translateX(-400px) translateY(20px);
          }
          to {
            transform: translateX(400px) translateY(20px);
          }
        }
        @keyframes slideLeft {
          from {
            transform: translateX(400px) translateY(20px);
          }
          to {
            transform: translateX(-400px) translateY(20px);
          }
        }
      `}</style>
    </div>
  );
}
