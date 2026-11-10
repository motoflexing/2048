import { Volume2, VolumeX, Settings as SettingsIcon, HelpCircle } from 'lucide-react';
import type { Settings } from '../game/types';

interface HeaderProps {
  settings: Settings;
  onSoundToggle: () => void;
  onSettingsOpen: () => void;
  onHelpOpen: () => void;
}

export function Header({ settings, onSoundToggle, onSettingsOpen, onHelpOpen }: HeaderProps) {
  return (
    <header className="flex items-center justify-between w-full px-4 py-3">
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xl"
          style={{ backgroundColor: '#EF4444', color: '#FFFFFF' }}
        >
          NM
        </div>
        <span className="text-xl font-bold" style={{ color: '#F5F5F5' }}>
          NUMBER MERGE
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onSoundToggle}
          className="p-2 rounded-lg transition-colors"
          style={{
            backgroundColor: '#22252B',
            color: settings.soundEnabled ? '#F5F5F5' : '#9296A0',
          }}
          aria-label={settings.soundEnabled ? 'Mute sound' : 'Unmute sound'}
        >
          {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
        <button
          onClick={onSettingsOpen}
          className="p-2 rounded-lg transition-colors"
          style={{ backgroundColor: '#22252B', color: '#F5F5F5' }}
          aria-label="Settings"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
        <button
          onClick={onHelpOpen}
          className="p-2 rounded-lg transition-colors"
          style={{ backgroundColor: '#22252B', color: '#F5F5F5' }}
          aria-label="Help"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}