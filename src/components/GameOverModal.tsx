import { RefreshCw, RotateCcw } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  finalScore: number;
  bestScore: number;
  onPlayAgain: () => void;
  onNewGame: () => void;
}

export function GameOverModal({ isOpen, finalScore, bestScore, onPlayAgain, onNewGame }: GameOverModalProps) {
  if (!isOpen) return null;

  const isNewBest = finalScore >= bestScore && finalScore > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden text-center"
        style={{ backgroundColor: '#191B20', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
      >
        <div className="p-8">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#EF4444', opacity: 0.2 }}>
            <svg className="w-10 h-10" style={{ color: '#EF4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#F5F5F5' }}>Game Over</h2>
          <p className="text-sm mb-6" style={{ color: '#9296A0' }}>No more moves available</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#22252B' }}>
              <p className="text-sm uppercase tracking-wider mb-1" style={{ color: '#9296A0' }}>Final Score</p>
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

          <div className="flex gap-3">
            <button
              onClick={onNewGame}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors"
              style={{ backgroundColor: '#22252B', color: '#F5F5F5' }}
            >
              <RotateCcw className="w-5 h-5" />
              <span>New Game</span>
            </button>
            <button
              onClick={onPlayAgain}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors"
              style={{ backgroundColor: '#EF4444', color: '#FFFFFF', boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)' }}
            >
              <RefreshCw className="w-5 h-5" />
              <span>Play Again</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}