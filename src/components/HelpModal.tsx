import { useState, useEffect } from 'react';
import { X, ChevronRight, MousePointer, Smartphone, Keyboard } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDismiss: () => void;
}

const steps = [
  {
    title: 'Swipe to Move',
    description: 'Swipe up, down, left, or right to move all tiles in that direction. On desktop, use arrow keys or WASD.',
    icon: <div className="flex items-center justify-center gap-2"><Smartphone className="w-6 h-6" /><MousePointer className="w-6 h-6" /><Keyboard className="w-6 h-6" /></div>,
  },
  {
    title: 'Match Numbers to Merge',
    description: 'When two tiles with the same number collide, they merge into one tile with double the value. 2+2=4, 4+4=8, and so on.',
    icon: (
      <div className="flex items-center justify-center gap-2">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold" style={{ backgroundColor: '#EEE4DA', color: '#776E65' }}>2</div>
        <ChevronRight className="w-6 h-6" style={{ color: '#9296A0' }} />
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold" style={{ backgroundColor: '#EEE4DA', color: '#776E65' }}>2</div>
        <ChevronRight className="w-6 h-6" style={{ color: '#EF4444' }} />
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold" style={{ backgroundColor: '#F2B179', color: '#F9F6F2' }}>4</div>
      </div>
    ),
  },
  {
    title: 'Score Increases',
    description: 'Every merge adds the value of the new tile to your score. Plan your moves to create chain reactions for higher scores.',
    icon: (
      <div className="flex items-center justify-center gap-2">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: '#F59563', color: '#F9F6F2' }}>16</div>
        <span className="text-xl font-bold" style={{ color: '#EF4444' }}>+</span>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: '#F59563', color: '#F9F6F2' }}>16</div>
        <ChevronRight className="w-6 h-6" style={{ color: '#EF4444' }} />
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: '#F67C5F', color: '#F9F6F2' }}>32</div>
      </div>
    ),
  },
  {
    title: 'New Tiles Appear',
    description: 'After each valid move, a new tile (usually 2, sometimes 4) appears in a random empty spot. Keep the board from filling up!',
    icon: (
      <div className="flex items-center justify-center gap-2">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold" style={{ backgroundColor: '#22252B', color: '#555860' }}>&nbsp;</div>
        <ChevronRight className="w-6 h-6" style={{ color: '#9296A0' }} />
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold" style={{ backgroundColor: '#CDC1B4', color: '#776E65' }}>2</div>
      </div>
    ),
  },
  {
    title: 'Reach 2048 to Win',
    description: 'Create a tile with the value 2048 to win! You can continue playing after winning to reach even higher tiles like 4096, 8192, and beyond.',
    icon: (
      <div className="flex items-center justify-center">
        <div className="w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold relative" style={{ backgroundColor: '#EDC22E', color: '#F9F6F2', boxShadow: '0 0 30px #FFA500' }}>
          2048
        </div>
      </div>
    ),
  },
  {
    title: 'Game Over',
    description: 'The game ends when the board is full and no more merges are possible. Use Undo to fix mistakes, and try again to beat your best score!',
    icon: (
      <div className="flex items-center justify-center gap-2">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold" style={{ backgroundColor: '#CDC1B4', color: '#776E65' }}>2</div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold" style={{ backgroundColor: '#EEE4DA', color: '#776E65' }}>4</div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold" style={{ backgroundColor: '#F2B179', color: '#F9F6F2' }}>8</div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold" style={{ backgroundColor: '#F59563', color: '#F9F6F2' }}>16</div>
        <ChevronRight className="w-6 h-6" style={{ color: '#EF4444' }} />
        <svg className="w-6 h-6" style={{ color: '#EF4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    ),
  },
];

export function HelpModal({ isOpen, onClose, onDismiss }: HelpModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showAgain, setShowAgain] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ backgroundColor: '#191B20', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
      >
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#22252B' }}>
          <h2 className="text-xl font-bold" style={{ color: '#F5F5F5' }}>How to Play</h2>
          <button onClick={onClose} className="p-2 rounded-lg transition-colors" style={{ color: '#9296A0' }} aria-label="Close help">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  backgroundColor: i === currentStep ? '#EF4444' : '#3C3A32',
                  width: i === currentStep ? '24px' : '8px',
                }}
              />
            ))}
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#22252B' }}>
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#F5F5F5' }}>{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#9296A0' }}>{step.description}</p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: currentStep > 0 ? '#22252B' : '#191B20',
                color: currentStep > 0 ? '#F5F5F5' : '#555860',
              }}
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="dont-show-again"
                checked={showAgain}
                onChange={(e) => setShowAgain(e.target.checked)}
                className="w-4 h-4 rounded"
                style={{ accentColor: '#EF4444' }}
              />
              <label htmlFor="dont-show-again" className="text-sm" style={{ color: '#9296A0' }}>
                Don't show again
              </label>
            </div>

            <button
              onClick={isLastStep ? () => { onDismiss(); onClose(); } : () => setCurrentStep(currentStep + 1)}
              className="px-6 py-2 rounded-lg font-medium transition-colors"
              style={{ backgroundColor: '#EF4444', color: '#FFFFFF' }}
            >
              {isLastStep ? 'Start Playing' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}