import { X, Trash2 } from 'lucide-react';
import type { GameStatistics } from '../game/types';

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  statistics: GameStatistics;
  onResetStatistics: () => void;
}

export function StatisticsModal({ isOpen, onClose, statistics, onResetStatistics }: StatisticsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ backgroundColor: '#191B20', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
      >
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#22252B' }}>
          <h2 className="text-xl font-bold" style={{ color: '#F5F5F5' }}>Statistics</h2>
          <button onClick={onClose} className="p-2 rounded-lg transition-colors" style={{ color: '#9296A0' }} aria-label="Close statistics">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Games Played" value={statistics.totalGamesPlayed} icon="🎮" />
            <StatCard label="Total Moves" value={statistics.totalMoves} icon="👆" />
            <StatCard label="Total Merges" value={statistics.totalMerges} icon="🔄" />
            <StatCard label="Highest Tile" value={statistics.highestTileReached} icon="🏆" />
            <StatCard label="Highest Score" value={statistics.highestScore} icon="⭐" />
            <StatCard label="Daily Challenges" value={Object.keys(statistics.dailyChallengeCompleted).filter(d => statistics.dailyChallengeCompleted[d]).length} icon="📅" />
          </div>

          <div className="pt-4 border-t" style={{ borderColor: '#22252B' }}>
            <button
              onClick={onResetStatistics}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors"
              style={{ backgroundColor: 'transparent', color: '#EF4444', border: '1px solid #EF4444' }}
            >
              <Trash2 className="w-5 h-5" />
              <span>Reset All Statistics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#22252B' }}>
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-2xl font-bold" style={{ color: '#F5F5F5' }}>{value.toLocaleString()}</p>
      <p className="text-xs uppercase tracking-wider mt-1" style={{ color: '#9296A0' }}>{label}</p>
    </div>
  );
}