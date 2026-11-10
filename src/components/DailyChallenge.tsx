import { Calendar, Trophy, ArrowRight, CheckCircle } from 'lucide-react';
import type { DailyChallengeState } from '../game/types';

interface DailyChallengeProps {
  dailyChallenge: DailyChallengeState | null;
  onPlay: () => void;
  onViewStats: () => void;
}

export function DailyChallenge({ dailyChallenge, onPlay, onViewStats }: DailyChallengeProps) {
  if (!dailyChallenge) return null;

  const isCompleted = dailyChallenge.isCompleted;

  return (
    <div className="w-full rounded-2xl p-4 transition-all" style={{ backgroundColor: '#191B20', border: '1px solid #22252B' }}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EF4444', opacity: 0.2 }}>
            <Calendar className="w-6 h-6" style={{ color: '#EF4444' }} />
          </div>
          <div>
            <p className="font-bold" style={{ color: '#F5F5F5' }}>Daily Challenge</p>
            <p className="text-sm" style={{ color: '#9296A0' }}>
              {new Date(dailyChallenge.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
        {isCompleted && (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full" style={{ backgroundColor: '#EF4444', opacity: 0.2 }}>
            <CheckCircle className="w-4 h-4" style={{ color: '#EF4444' }} />
            <span className="text-xs font-medium" style={{ color: '#EF4444' }}>Completed</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-xl text-center" style={{ backgroundColor: '#22252B' }}>
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#9296A0' }}>Challenge Score</p>
          <p className="text-2xl font-bold" style={{ color: '#F5F5F5' }}>{dailyChallenge.score.toLocaleString()}</p>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ backgroundColor: '#22252B' }}>
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#9296A0' }}>Best Score</p>
          <p className="text-2xl font-bold" style={{ color: '#F5F5F5' }}>{dailyChallenge.bestScore.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onPlay}
          disabled={isCompleted}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors"
          style={{
            backgroundColor: isCompleted ? '#191B20' : '#EF4444',
            color: isCompleted ? '#555860' : '#FFFFFF',
            boxShadow: isCompleted ? 'none' : '0 4px 16px rgba(239, 68, 68, 0.4)',
          }}
        >
          {isCompleted ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Completed</span>
            </>
          ) : (
            <>
              <span>Play Challenge</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
        <button
          onClick={onViewStats}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors"
          style={{ backgroundColor: '#22252B', color: '#F5F5F5' }}
        >
          <Trophy className="w-5 h-5" />
          <span>Stats</span>
        </button>
      </div>
    </div>
  );
}