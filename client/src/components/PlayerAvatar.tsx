import type { Player } from '../types/game';

interface PlayerAvatarProps {
  player: Player;
  isActive: boolean;
  isWinner?: boolean;
  isLoser?: boolean;
}

export function PlayerAvatar({ player, isActive, isWinner, isLoser }: PlayerAvatarProps) {
  const playerColor = player === 1 ? 'bg-blue-400' : 'bg-red-400';
  const borderColor = player === 1 ? 'border-blue-600' : 'border-red-600';

  const getEmoji = () => {
    const shouldFlip = player === 2;
    const flipClass = shouldFlip ? 'scale-x-[-1]' : '';

    if (isWinner) {
      return <img src="/animations/baby-yes.gif" alt="Winner" className={`w-36 h-36 object-cover rounded-full ${flipClass}`} />;
    }
    if (isLoser) {
      return <img src="/animations/no-the-office.gif" alt="Loser" className={`w-36 h-36 object-cover rounded-full ${flipClass}`} />;
    }
    if (isActive) {
      return <span className="text-7xl">🤔</span>;
    }
    return <span className="text-7xl">😎</span>;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`
          w-44 h-44 rounded-full flex items-center justify-center
          border-4 ${borderColor} ${playerColor}
          transition-all duration-300
          ${isActive ? 'animate-pulse scale-110 shadow-2xl' : 'opacity-70'}
        `}
      >
        {getEmoji()}
      </div>
      <div className={`text-xl font-bold ${player === 1 ? 'text-blue-400' : 'text-red-400'}`}>
        Speler {player}
      </div>
    </div>
  );
}
