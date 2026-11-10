import type {
  GameState,
  GameStatistics,
  Settings,
  DailyChallengeState,
  Direction,
  Board,
} from './types';
import { GRID_SIZE, DEFAULT_SETTINGS, DEFAULT_STATISTICS } from './types';
import { SeededRandom, getDailySeed, initializeBoard, addRandomTile } from './random';
import { moveBoard, checkGameOver, getHighestTile, cloneBoard } from './board';

const STORAGE_KEYS = {
  GAME_STATE: 'number-merge-game-state',
  STATISTICS: 'number-merge-statistics',
  SETTINGS: 'number-merge-settings',
  DAILY_CHALLENGE: 'number-merge-daily-challenge',
} as const;

// Test-only flag - only enable in test environment
// In Vite, import.meta.env.MODE can be used, but process is not available in browser
// We'll rely on the browser test mode flag instead
const IS_TEST_ENV = false;

// Browser test mode flag - set by Playwright tests
let isBrowserTestMode = false;

// Only enable test mode functions in development/test, not production
// Use a non-enumerable property to prevent casual access
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  Object.defineProperty(window, '__TEST_MODE__', {
    value: false,
    writable: true,
    configurable: false,
    enumerable: false,
  });
}

export function enableBrowserTestMode(): void {
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    isBrowserTestMode = true;
    (window as any).__TEST_MODE__ = true;
  }
}

export function disableBrowserTestMode(): void {
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    isBrowserTestMode = false;
    (window as any).__TEST_MODE__ = false;
  }
}

export function isInBrowserTestMode(): boolean {
  if (typeof window !== 'undefined') {
    return (window as any).__TEST_MODE__ === true;
  }
  return isBrowserTestMode;
}

// Combined check for test environment
function isTestEnvironment(): boolean {
  return IS_TEST_ENV || isInBrowserTestMode();
}

export class GameEngine {
  private state: GameState;
  private statistics: GameStatistics;
  private settings: Settings;
  private dailyChallenge: DailyChallengeState | null;
  private listeners: Set<() => void> = new Set();
  private random: SeededRandom;
  private dailyRandom: SeededRandom;

  constructor() {
    this.settings = this.loadSettings();
    this.statistics = this.loadStatistics();
    this.dailyChallenge = this.loadDailyChallenge();
    this.random = new SeededRandom(Date.now());
    this.dailyRandom = new SeededRandom(getDailySeed());

    const savedState = this.loadGameState();
    if (savedState) {
      this.state = savedState;
    } else {
      this.state = this.createInitialState();
    }
  }

  private createInitialState(): GameState {
    const board = initializeBoard(this.random);
    return {
      board,
      score: 0,
      bestScore: this.statistics.highestScore,
      isGameOver: false,
      isWon: false,
      hasWon: false,
      moveCount: 0,
      mergeCount: 0,
      highestTile: getHighestTile(board),
      previousState: null,
      canUndo: false,
    };
  }

  private loadSettings(): Settings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to load settings:', e);
    }
    return DEFAULT_SETTINGS;
  }

  private saveSettings(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  }

  private loadStatistics(): GameStatistics {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STATISTICS);
      if (stored) {
        return { ...DEFAULT_STATISTICS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to load statistics:', e);
    }
    return DEFAULT_STATISTICS;
  }

  private saveStatistics(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STATISTICS, JSON.stringify(this.statistics));
    } catch (e) {
      console.warn('Failed to save statistics:', e);
    }
  }

  private loadGameState(): GameState | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate the loaded state
        if (this.isValidGameState(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load game state:', e);
    }
    return null;
  }

  private isValidGameState(state: any): boolean {
    return (
      state &&
      Array.isArray(state.board) &&
      state.board.length === GRID_SIZE &&
      state.board.every((row: any) => Array.isArray(row) && row.length === GRID_SIZE) &&
      typeof state.score === 'number' &&
      typeof state.bestScore === 'number'
    );
  }

  private saveGameState(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to save game state:', e);
    }
  }

  private loadDailyChallenge(): DailyChallengeState | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DAILY_CHALLENGE);
      if (stored) {
        const parsed = JSON.parse(stored);
        const today = new Date().toISOString().split('T')[0];
        if (parsed.date === today) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load daily challenge:', e);
    }
    return null;
  }

  private saveDailyChallenge(): void {
    if (this.dailyChallenge) {
      try {
        localStorage.setItem(STORAGE_KEYS.DAILY_CHALLENGE, JSON.stringify(this.dailyChallenge));
      } catch (e) {
        console.warn('Failed to save daily challenge:', e);
      }
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(listener => listener());
  }

  getState(): GameState {
    return this.state;
  }

  getStatistics(): GameStatistics {
    return this.statistics;
  }

  getSettings(): Settings {
    return this.settings;
  }

  getDailyChallenge(): DailyChallengeState | null {
    return this.dailyChallenge;
  }

  updateSettings(newSettings: Partial<Settings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
    this.notify();
  }

  move(direction: Direction): boolean {
    if (this.state.isGameOver) return false;

    const previousState = cloneBoard(this.state.board);
    const previousScore = this.state.score;
    const previousMoveCount = this.state.moveCount;
    const previousMergeCount = this.state.mergeCount;
    const previousHighestTile = this.state.highestTile;

    const result = moveBoard(this.state.board, direction);

    if (!result.hasMoved) return false;

    // Save previous state for undo
    const previousGameState: GameState = {
      ...this.state,
      board: previousState,
      score: previousScore,
      moveCount: previousMoveCount,
      mergeCount: previousMergeCount,
      highestTile: previousHighestTile,
      previousState: null,
      canUndo: false,
    };

    // Add new random tile
    const newBoard = addRandomTile(result.board, this.random);

    // Check game over AFTER the new tile is added (critical fix)
    const isGameOver = checkGameOver(newBoard);

    this.state = {
      ...this.state,
      board: newBoard,
      score: this.state.score + result.score,
      moveCount: this.state.moveCount + 1,
      mergeCount: this.state.mergeCount + result.mergeCount,
      highestTile: Math.max(this.state.highestTile, result.highestTile),
      hasWon: this.state.hasWon || result.hasWon,
      isWon: result.hasWon && !this.state.hasWon,
      isGameOver,
      previousState: previousGameState,
      canUndo: true,
    };

    // Update statistics
    this.statistics.totalMoves++;
    this.statistics.totalMerges += result.mergeCount;
    this.statistics.highestTileReached = Math.max(this.statistics.highestTileReached, this.state.highestTile);
    this.statistics.highestScore = Math.max(this.statistics.highestScore, this.state.score);
    this.state.bestScore = this.statistics.highestScore;

    this.saveStatistics();
    this.saveGameState();
    this.notify();

    return true;
  }

  undo(): boolean {
    if (!this.state.canUndo || !this.state.previousState) return false;

    this.state = this.state.previousState;
    this.saveGameState();
    this.notify();
    return true;
  }

  newGame(): void {
    const board = initializeBoard(this.random);
    this.state = {
      board,
      score: 0,
      bestScore: this.statistics.highestScore,
      isGameOver: false,
      isWon: false,
      hasWon: false,
      moveCount: 0,
      mergeCount: 0,
      highestTile: getHighestTile(board),
      previousState: null,
      canUndo: false,
    };
    this.saveGameState();
    this.notify();
  }

  continueAfterWin(): void {
    this.state = {
      ...this.state,
      isWon: false,
    };
    this.saveGameState();
    this.notify();
  }

  resetStatistics(): void {
    this.statistics = { ...DEFAULT_STATISTICS };
    this.saveStatistics();
    this.notify();
  }

  resetGame(): void {
    this.newGame();
    this.statistics = { ...DEFAULT_STATISTICS };
    this.saveStatistics();
    this.saveGameState();
    this.notify();
  }

  startDailyChallenge(): DailyChallengeState {
    const seed = getDailySeed();
    this.dailyRandom = new SeededRandom(seed);
    const board = initializeBoard(this.dailyRandom);
    const today = new Date().toISOString().split('T')[0];

    this.dailyChallenge = {
      date: today,
      seed,
      board,
      score: 0,
      isCompleted: false,
      bestScore: this.statistics.dailyChallengeScores[today] || 0,
    };

    this.saveDailyChallenge();
    this.notify();
    return this.dailyChallenge;
  }

  playDailyChallengeMove(direction: Direction): boolean {
    if (!this.dailyChallenge || this.dailyChallenge.isCompleted) return false;

    const result = moveBoard(this.dailyChallenge.board, direction);
    if (!result.hasMoved) return false;

    const newBoard = addRandomTile(result.board, this.dailyRandom);
    const newScore = this.dailyChallenge.score + result.score;
    const isGameOver = checkGameOver(newBoard);

    this.dailyChallenge = {
      ...this.dailyChallenge,
      board: newBoard,
      score: newScore,
      isCompleted: isGameOver,
      bestScore: Math.max(this.dailyChallenge.bestScore, newScore),
    };

    // Update statistics
    const today = new Date().toISOString().split('T')[0];
    this.statistics.dailyChallengeScores[today] = this.dailyChallenge.bestScore;
    if (isGameOver) {
      this.statistics.dailyChallengeCompleted[today] = true;
    }
    this.saveStatistics();
    this.saveDailyChallenge();
    this.notify();

    return true;
  }

  getDailyChallengeState(): DailyChallengeState | null {
    if (!this.dailyChallenge) {
      return this.startDailyChallenge();
    }
    const today = new Date().toISOString().split('T')[0];
    if (this.dailyChallenge.date !== today) {
      return this.startDailyChallenge();
    }
    return this.dailyChallenge;
  }

  // ============ TEST-ONLY METHODS ============
  // These methods are only available in test environment (import.meta.env.DEV && test mode enabled)

  /**
   * Sets a specific board state for testing purposes.
   * Only available in development with test mode enabled.
   */
  setTestBoard(
    board: Board,
    score: number = 0,
    bestScore: number = 0,
    hasWon: boolean = false,
    moveCount: number = 0,
    mergeCount: number = 0,
    highestTile: number = 0,
    canUndo: boolean = false,
    previousState: GameState | null = null
  ): void {
    if (!isTestEnvironment()) {
      if (import.meta.env.DEV) {
        console.warn('setTestBoard is only available in test environment');
      }
      return;
    }

    // Calculate highest tile if not provided
    const calculatedHighestTile = highestTile > 0 ? highestTile : getHighestTile(board);

    // For victory, set isWon to true if hasWon is true (triggers victory modal)
    const isWon = hasWon && !this.state?.hasWon;

    this.state = {
      board: cloneBoard(board),
      score,
      bestScore,
      isGameOver: checkGameOver(board),
      isWon,
      hasWon,
      moveCount,
      mergeCount,
      highestTile: calculatedHighestTile,
      previousState: previousState ? { ...previousState, board: cloneBoard(previousState.board) } : null,
      canUndo,
    };

    this.saveGameState();
    this.notify();
  }

  /**
   * Sets a deterministic random seed for reproducible tests.
   * Only available in development with test mode enabled.
   */
  setTestRandom(seed: number): void {
    if (!isTestEnvironment()) {
      if (import.meta.env.DEV) {
        console.warn('setTestRandom is only available in test environment');
      }
      return;
    }
    this.random = new SeededRandom(seed);
  }

  /**
   * Gets the current random generator for test inspection.
   * Only available in development with test mode enabled.
   */
  getTestRandom(): SeededRandom {
    if (!isTestEnvironment()) {
      if (import.meta.env.DEV) {
        console.warn('getTestRandom is only available in test environment');
      }
      return this.random;
    }
    return this.random;
  }

  /**
   * Sets test statistics.
   * Only available in development with test mode enabled.
   */
  setTestStatistics(statistics: Partial<GameStatistics>): void {
    if (!isTestEnvironment()) {
      if (import.meta.env.DEV) {
        console.warn('setTestStatistics is only available in test environment');
      }
      return;
    }
    this.statistics = { ...this.statistics, ...statistics };
    this.saveStatistics();
    this.notify();
  }

  /**
   * Sets a specific daily challenge state for testing.
   * Only available in development with test mode enabled.
   */
  setTestDailyChallenge(challenge: DailyChallengeState | null): void {
    if (!isTestEnvironment()) {
      if (import.meta.env.DEV) {
        console.warn('setTestDailyChallenge is only available in test environment');
      }
      return;
    }
    this.dailyChallenge = challenge ? { ...challenge, board: cloneBoard(challenge.board) } : null;
    if (challenge) {
      this.saveDailyChallenge();
    }
    this.notify();
  }

  /**
   * Resets the engine to initial state for testing.
   * Only available in development with test mode enabled.
   */
  resetForTest(): void {
    if (!isTestEnvironment()) {
      if (import.meta.env.DEV) {
        console.warn('resetForTest is only available in test environment');
      }
      return;
    }
    this.random = new SeededRandom(Date.now());
    this.dailyRandom = new SeededRandom(getDailySeed());
    this.statistics = { ...DEFAULT_STATISTICS };
    this.dailyChallenge = null;
    this.state = this.createInitialState();
    this.saveStatistics();
    this.saveGameState();
    this.saveDailyChallenge();
    this.notify();
  }
}

export const gameEngine = new GameEngine();

// Expose gameEngine and test functions on window for E2E testing
// Only in development mode to prevent production access
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).gameEngine = gameEngine;
  (window as any).enableBrowserTestMode = enableBrowserTestMode;
  (window as any).disableBrowserTestMode = disableBrowserTestMode;
  (window as any).isInBrowserTestMode = isInBrowserTestMode;
}