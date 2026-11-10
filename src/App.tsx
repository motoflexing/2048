import { useState, useEffect, useCallback } from 'react';
import { useGame } from './hooks/useGame';
import { Header } from './components/Header';
import { ScoreCard } from './components/ScoreCard';
import { GameBoard } from './components/GameBoard';
import { GameControls } from './components/GameControls';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { StatisticsModal } from './components/StatisticsModal';
import { DailyChallenge } from './components/DailyChallenge';
import { soundManager } from './utils/sound';
import { hapticsManager } from './utils/haptics';
import type { Direction, Settings } from './game/types';
import './App.css';

function App() {
  const {
    state,
    statistics,
    settings,
    dailyChallenge,
    move,
    undo,
    newGame,
    continueAfterWin,
    resetStatistics,
    resetGame,
    updateSettings,
  } = useGame();

  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [boardRef, setBoardRef] = useState<HTMLDivElement | null>(null);
  const [cellSize, setCellSize] = useState(70);
  const [gap, setGap] = useState(8);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const [initialized, setInitialized] = useState(false);
  const initAudio = useCallback(() => {
    if (!initialized) {
      soundManager.initialize();
      hapticsManager.setEnabled(settings.hapticEnabled);
      setInitialized(true);
    }
  }, [initialized, settings.hapticEnabled]);

  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled);
    hapticsManager.setEnabled(settings.hapticEnabled);
  }, [settings.soundEnabled, settings.hapticEnabled]);

  useEffect(() => {
    if (state.isGameOver && !showGameOver) {
      setShowGameOver(true);
      if (settings.soundEnabled) soundManager.play('gameover');
      if (settings.hapticEnabled) hapticsManager.trigger('gameover');
    }
  }, [state.isGameOver, showGameOver, settings.soundEnabled, settings.hapticEnabled]);

  useEffect(() => {
    if (state.isWon && !showVictory) {
      setShowVictory(true);
      if (settings.soundEnabled) soundManager.play('win');
      if (settings.hapticEnabled) hapticsManager.trigger('win');
    }
  }, [state.isWon, showVictory, settings.soundEnabled, settings.hapticEnabled]);

  useEffect(() => {
    const calculateSize = () => {
      const containerWidth = boardRef?.offsetWidth || (isMobile ? window.innerWidth - 32 : 400);
      const maxCellSize = isMobile ? 85 : 100;
      const minCellSize = isMobile ? 55 : 70;
      const calculatedGap = isMobile ? 6 : 8;
      const calculatedCellSize = Math.min(
        maxCellSize,
        Math.max(minCellSize, (containerWidth - (5 * calculatedGap)) / 4)
      );
      setGap(calculatedGap);
      setCellSize(Math.floor(calculatedCellSize));
    };

    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, [boardRef, isMobile]);

  const handleMove = useCallback((direction: Direction) => {
    initAudio();
    const moved = move(direction);
    if (moved) {
      if (state.mergeCount > 0 || state.moveCount > 0) {
        if (settings.soundEnabled) soundManager.play('merge');
        if (settings.hapticEnabled) hapticsManager.trigger('merge');
      } else {
        if (settings.soundEnabled) soundManager.play('move');
        if (settings.hapticEnabled) hapticsManager.trigger('move');
      }
    }
  }, [move, state.mergeCount, state.moveCount, settings.soundEnabled, settings.hapticEnabled, initAudio]);

  const handleUndo = useCallback(() => {
    initAudio();
    undo();
    if (settings.soundEnabled) soundManager.play('move');
  }, [undo, settings.soundEnabled, initAudio]);

  const handleNewGame = useCallback(() => {
    initAudio();
    if (state.moveCount > 0 || state.score > 0) {
      if (confirm('Start a new game? Current progress will be lost.')) {
        newGame();
      }
    } else {
      newGame();
    }
    if (settings.soundEnabled) soundManager.play('move');
  }, [newGame, state.moveCount, state.score, settings.soundEnabled, initAudio]);

  const handleRestart = useCallback(() => {
    initAudio();
    newGame();
    if (settings.soundEnabled) soundManager.play('move');
  }, [newGame, settings.soundEnabled, initAudio]);

  const handleContinue = useCallback(() => {
    initAudio();
    continueAfterWin();
    setShowVictory(false);
  }, [continueAfterWin, initAudio]);

  const handleSettingsChange = useCallback((newSettings: Partial<Settings>) => {
    updateSettings(newSettings);
  }, [updateSettings]);

  useEffect(() => {
    const hasSeenHelp = localStorage.getItem('number-merge-help-seen');
    if (!hasSeenHelp) {
      setShowHelp(true);
      localStorage.setItem('number-merge-help-seen', 'true');
    }
  }, []);

  const handleHelpDismiss = useCallback(() => {
    localStorage.setItem('number-merge-help-seen', 'true');
  }, []);

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#101114', color: '#F5F5F5' }}>
      <div className="max-w-md mx-auto p-4 pb-8" ref={setBoardRef}>
        <Header
          settings={settings}
          onSoundToggle={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
          onSettingsOpen={() => setShowSettings(true)}
          onHelpOpen={() => setShowHelp(true)}
        />

        <div className="mt-4 mb-6">
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#F5F5F5' }}>Number Merge</h1>
          <p className="text-sm" style={{ color: '#9296A0' }}>Merge tiles and reach 2048</p>
        </div>

        <div className="flex gap-3 mb-6">
          <ScoreCard label="SCORE" value={state.score} />
          <ScoreCard label="BEST" value={state.bestScore} isBest />
        </div>

        <GameBoard
          board={state.board}
          cellSize={cellSize}
          gap={gap}
          reducedAnimations={settings.reducedAnimations}
          onMove={handleMove}
        />

        <p className="text-center text-sm mt-4 mb-6" style={{ color: '#9296A0' }}>
          Swipe to move tiles. Match identical numbers to merge them.
        </p>

        <GameControls
          onUndo={handleUndo}
          onNewGame={handleNewGame}
          onRestart={handleRestart}
          canUndo={state.canUndo}
          isGameOver={state.isGameOver}
        />

        <DailyChallenge
          dailyChallenge={dailyChallenge}
          onPlay={() => {}}
          onViewStats={() => setShowStatistics(true)}
        />

        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          <button
            onClick={() => setShowSettings(true)}
            className="py-3 rounded-xl text-sm font-medium transition-colors"
            style={{ backgroundColor: '#22252B', color: '#F5F5F5' }}
          >
            Settings
          </button>
          <button
            onClick={() => setShowStatistics(true)}
            className="py-3 rounded-xl text-sm font-medium transition-colors"
            style={{ backgroundColor: '#22252B', color: '#F5F5F5' }}
          >
            Statistics
          </button>
          <button
            onClick={() => setShowHelp(true)}
            className="py-3 rounded-xl text-sm font-medium transition-colors"
            style={{ backgroundColor: '#22252B', color: '#F5F5F5' }}
          >
            Help
          </button>
        </div>

        <footer className="mt-12 text-center text-xs" style={{ color: '#555860' }}>
          <p>Number Merge</p>
          <p className="mt-1">Merge. Multiply. Master.</p>
        </footer>
      </div>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        onResetStatistics={resetStatistics}
        onResetGame={resetGame}
      />

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        onDismiss={handleHelpDismiss}
      />

      <GameOverModal
        isOpen={showGameOver}
        finalScore={state.score}
        bestScore={state.bestScore}
        onPlayAgain={handleRestart}
        onNewGame={handleNewGame}
      />

      <VictoryModal
        isOpen={showVictory}
        finalScore={state.score}
        bestScore={state.bestScore}
        onContinue={handleContinue}
        onNewGame={handleNewGame}
      />

      <StatisticsModal
        isOpen={showStatistics}
        onClose={() => setShowStatistics(false)}
        statistics={statistics}
        onResetStatistics={resetStatistics}
      />
    </div>
  );
}

export default App;