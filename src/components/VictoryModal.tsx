import { RefreshCw, ArrowRight } from 'lucide-react';

interface VictoryModalProps {
  isOpen: boolean;
  finalScore: number;
  bestScore: number;
  onContinue: () => void;
  onNewGame: () => void;
}

export function VictoryModal({ isOpen, finalScore, bestScore, onContinue, onNewGame }: VictoryModalProps) {
  if (!isOpen) return null;

  const isNewBest = finalScore >= bestScore && finalScore > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden text-center relative"
        style={{ backgroundColor: '#191B20', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
      >
        <div className="absolute top-0 left-0 right-0 h-2" style={{ background: 'linear-gradient(90deg, #EF4444, #FFA500, #EF4444)' }} />

        <div className="p-8">
          <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center relative" style={{ backgroundColor: '#EDC22E', boxShadow: '0 0 40px #FFA500' }}>
            <span className="text-2xl font-bold" style={{ color: '#F9F6F2' }}>2048</span>
            <div className="absolute inset-0 rounded-full victory-pulse" style={{ boxShadow: '0 0 40px #FFA500' }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#F5F5F5' }}>You Win!</h2>
          <p className="text-sm mb-6" style={{ color: '#9296A0' }}>You reached the 2048 tile!</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#22252B' }}>
              <p className="text-sm uppercase tracking-wider mb-1" style={{ color: '#9296A0' }}>Current Score</p>
              <p className="text-3xl font-bold" style={{ color: '#F5F5F5' }}>{finalScore.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: isNewBest ? '#EF4444' : '#22252B' }}>
              <p className="text-sm uppercase tracking-wider mb-1" style={{ color: isNewBest ? 'rgba(255,255,255,0.8)' : '#9296A0' }}>Best Score</p>
              <p className="text-3xl font-bold" style={{ color: isNewBest ? '#FFFFFF' : '#F5F5F5' }}>{bestScore.toLocaleString()}</p>
              {isNewBest && (
                <p className="text-xs mt-1 font-medium" style={{ color: '#FFFFFF' }}>New Record!</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onContinue}
              className="flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors"
              style={{ backgroundColor: '#EF4444', color: '#FFFFFF', boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)' }}
            >
              <span>Continue Playing</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onNewGame}
              className="flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors"
              style={{ backgroundColor: '#22252B', color: '#F5F5F5' }}
            >
              <RefreshCw className="w-5 h-5" />
              <span>New Game</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}