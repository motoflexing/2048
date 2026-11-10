import { RotateCcw, RefreshCw } from 'lucide-react';

interface GameControlsProps {
  onUndo: () => void;
  onNewGame: () => void;
  onRestart: () => void;
  canUndo: boolean;
  isGameOver: boolean;
}

export function GameControls({ onUndo, onNewGame, onRestart, canUndo, isGameOver }: GameControlsProps) {
  return (
    <div className="flex items-center justify-center gap-3 w-full">
      <button
        onClick={onUndo}
        disabled={!canUndo || isGameOver}
        className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all min-w-[120px] justify-center"
        style={{
          backgroundColor: canUndo && !isGameOver ? '#22252B' : '#191B20',
          color: canUndo && !isGameOver ? '#F5F5F5' : '#555860',
          boxShadow: canUndo && !isGameOver ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
        }}
        aria-label="Undo last move"
      >
        <RotateCcw className="w-5 h-5" />
        <span>Undo</span>
      </button>
      <button
        onClick={onNewGame}
        className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all min-w-[120px] justify-center"
        style={{
          backgroundColor: '#EF4444',
          color: '#FFFFFF',
          boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)',
        }}
        aria-label="Start new game"
      >
        <RefreshCw className="w-5 h-5" />
        <span>New Game</span>
      </button>
      <button
        onClick={onRestart}
        className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all min-w-[120px] justify-center"
        style={{
          backgroundColor: '#22252B',
          color: '#F5F5F5',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
        aria-label="Restart current game"
      >
        <RotateCcw className="w-5 h-5" />
        <span>Restart</span>
      </button>
    </div>
  );
}