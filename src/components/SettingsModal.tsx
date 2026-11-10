import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import type { Settings as SettingsType } from '../game/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsType;
  onSettingsChange: (settings: Partial<SettingsType>) => void;
  onResetStatistics: () => void;
  onResetGame: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  onResetStatistics,
  onResetGame,
}: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [showResetConfirm, setShowResetConfirm] = useState<'statistics' | 'game' | null>(null);

  const handleChange = (key: keyof SettingsType, value: boolean | string) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ backgroundColor: '#191B20', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
      >
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#22252B' }}>
          <h2 className="text-xl font-bold" style={{ color: '#F5F5F5' }}>Settings</h2>
          <button onClick={onClose} className="p-2 rounded-lg transition-colors" style={{ color: '#9296A0' }} aria-label="Close settings">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-wider" style={{ color: '#9296A0' }}>Gameplay</h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#22252B' }}>
                  <svg className="w-5 h-5" style={{ color: '#EF4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5.383v8.234M21 11.75a2.121 2.121 0 01-1.27 1.91l-5.347 3.622a2.12 2.12 0 01-1.69 0L9.27 13.66A2.12 2.12 0 018 11.75V7.5c0-1.11.89-2 2-2h8.5a2.12 2.12 0 011.69.75l5.347 3.622A2.12 2.12 0 0121 11.75z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium" style={{ color: '#F5F5F5' }}>Sound Effects</p>
                  <p className="text-sm" style={{ color: '#9296A0' }}>Play sounds for moves and merges</p>
                </div>
              </div>
              <button
                onClick={() => handleChange('soundEnabled', !localSettings.soundEnabled)}
                className="relative w-12 h-7 rounded-full transition-all"
                style={{
                  backgroundColor: localSettings.soundEnabled ? '#EF4444' : '#3C3A32',
                }}
                aria-label={localSettings.soundEnabled ? 'Disable sound' : 'Enable sound'}
              >
                <div
                  className="absolute top-0.5 w-6 h-6 rounded-full bg-white transition-transform shadow-md"
                  style={{
                    transform: localSettings.soundEnabled ? 'translateX(28px)' : 'translateX(2px)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#22252B' }}>
                  <svg className="w-5 h-5" style={{ color: '#EF4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium" style={{ color: '#F5F5F5' }}>Haptic Feedback</p>
                  <p className="text-sm" style={{ color: '#9296A0' }}>Vibrate on merges and game events</p>
                </div>
              </div>
              <button
                onClick={() => handleChange('hapticEnabled', !localSettings.hapticEnabled)}
                className="relative w-12 h-7 rounded-full transition-all"
                style={{
                  backgroundColor: localSettings.hapticEnabled ? '#EF4444' : '#3C3A32',
                }}
                aria-label={localSettings.hapticEnabled ? 'Disable haptics' : 'Enable haptics'}
              >
                <div
                  className="absolute top-0.5 w-6 h-6 rounded-full bg-white transition-transform shadow-md"
                  style={{
                    transform: localSettings.hapticEnabled ? 'translateX(28px)' : 'translateX(2px)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#22252B' }}>
                  <svg className="w-5 h-5" style={{ color: '#EF4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium" style={{ color: '#F5F5F5' }}>Reduced Animations</p>
                  <p className="text-sm" style={{ color: '#9296A0' }}>Minimize motion for better performance</p>
                </div>
              </div>
              <button
                onClick={() => handleChange('reducedAnimations', !localSettings.reducedAnimations)}
                className="relative w-12 h-7 rounded-full transition-all"
                style={{
                  backgroundColor: localSettings.reducedAnimations ? '#EF4444' : '#3C3A32',
                }}
                aria-label={localSettings.reducedAnimations ? 'Enable animations' : 'Disable animations'}
              >
                <div
                  className="absolute top-0.5 w-6 h-6 rounded-full bg-white transition-transform shadow-md"
                  style={{
                    transform: localSettings.reducedAnimations ? 'translateX(28px)' : 'translateX(2px)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                />
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t" style={{ borderColor: '#22252B' }}>
            <h3 className="text-sm font-medium uppercase tracking-wider" style={{ color: '#9296A0' }}>Appearance</h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#22252B' }}>
                  <svg className="w-5 h-5" style={{ color: '#EF4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium" style={{ color: '#F5F5F5' }}>Theme</p>
                  <p className="text-sm" style={{ color: '#9296A0' }}>Choose color scheme</p>
                </div>
              </div>
              <select
                value={localSettings.theme}
                onChange={(e) => handleChange('theme', e.target.value as 'dark' | 'light')}
                className="px-3 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: '#22252B',
                  color: '#F5F5F5',
                  border: '1px solid #3C3A32',
                }}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t" style={{ borderColor: '#22252B' }}>
            <h3 className="text-sm font-medium uppercase tracking-wider" style={{ color: '#9296A0' }}>Data</h3>

            <button
              onClick={() => setShowResetConfirm('statistics')}
              className="w-full flex items-center justify-between p-3 rounded-lg transition-colors"
              style={{ backgroundColor: '#22252B', color: '#F5F5F5' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3C3A32' }}>
                  <svg className="w-5 h-5" style={{ color: '#F5F5F5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Reset Statistics</p>
                  <p className="text-sm" style={{ color: '#9296A0' }}>Clear all game history and records</p>
                </div>
              </div>
              <ChevronDown className="w-5 h-5" style={{ color: '#9296A0' }} />
            </button>

            <button
              onClick={() => setShowResetConfirm('game')}
              className="w-full flex items-center justify-between p-3 rounded-lg transition-colors"
              style={{ backgroundColor: '#22252B', color: '#F5F5F5' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3C3A32' }}>
                  <svg className="w-5 h-5" style={{ color: '#EF4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Reset Current Game</p>
                  <p className="text-sm" style={{ color: '#9296A0' }}>Start fresh with a new board</p>
                </div>
              </div>
              <ChevronDown className="w-5 h-5" style={{ color: '#9296A0' }} />
            </button>
          </div>
        </div>

        <div className="p-4 border-t" style={{ borderColor: '#22252B' }}>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-medium transition-colors"
            style={{ backgroundColor: '#22252B', color: '#F5F5F5' }}
          >
            Done
          </button>
        </div>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="w-full max-w-md rounded-2xl overflow-hidden" style={{ backgroundColor: '#191B20' }}>
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#EF4444', opacity: 0.2 }}>
                <svg className="w-8 h-8" style={{ color: '#EF4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#F5F5F5' }}>
                {showResetConfirm === 'statistics' ? 'Reset Statistics?' : 'Reset Current Game?'}
              </h3>
              <p className="text-sm mb-6" style={{ color: '#9296A0' }}>
                {showResetConfirm === 'statistics'
                  ? 'This will permanently delete all your game statistics including total games played, highest score, and highest tile reached.'
                  : 'This will start a completely new game. Your current progress will be lost.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(null)}
                  className="flex-1 py-3 rounded-xl font-medium transition-colors"
                  style={{ backgroundColor: '#22252B', color: '#F5F5F5' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (showResetConfirm === 'statistics') onResetStatistics();
                    else onResetGame();
                    setShowResetConfirm(null);
                    onClose();
                  }}
                  className="flex-1 py-3 rounded-xl font-medium transition-colors"
                  style={{ backgroundColor: '#EF4444', color: '#FFFFFF' }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}