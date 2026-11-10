import { useState, useEffect, useCallback } from 'react';
import { gameEngine } from '../game/engine';
import type { GameState, GameStatistics, Settings, DailyChallengeState, Direction } from '../game/types';

export function useGame() {
  const [state, setState] = useState<GameState>(gameEngine.getState());
  const [statistics, setStatistics] = useState<GameStatistics>(gameEngine.getStatistics());
  const [settings, setSettings] = useState<Settings>(gameEngine.getSettings());
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallengeState | null>(gameEngine.getDailyChallengeState());

  useEffect(() => {
    const unsubscribe = gameEngine.subscribe(() => {
      setState(gameEngine.getState());
      setStatistics(gameEngine.getStatistics());
      setSettings(gameEngine.getSettings());
      setDailyChallenge(gameEngine.getDailyChallengeState());
    });
    return unsubscribe;
  }, []);

  const move = useCallback((direction: Direction) => {
    return gameEngine.move(direction);
  }, []);

  const undo = useCallback(() => {
    return gameEngine.undo();
  }, []);

  const newGame = useCallback(() => {
    gameEngine.newGame();
  }, []);

  const continueAfterWin = useCallback(() => {
    gameEngine.continueAfterWin();
  }, []);

  const resetStatistics = useCallback(() => {
    gameEngine.resetStatistics();
  }, []);

  const resetGame = useCallback(() => {
    gameEngine.resetGame();
  }, []);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    gameEngine.updateSettings(newSettings);
  }, []);

  const playDailyChallengeMove = useCallback((direction: Direction) => {
    return gameEngine.playDailyChallengeMove(direction);
  }, []);

  return {
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
    playDailyChallengeMove,
  };
}