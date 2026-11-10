export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Tile {
  id: string;
  value: number;
  x: number;
  y: number;
  isNew?: boolean;
  isMerged?: boolean;
  mergedFrom?: string[];
}

export type Board = (Tile | null)[][];

export interface GameState {
  board: Board;
  score: number;
  bestScore: number;
  isGameOver: boolean;
  isWon: boolean;
  hasWon: boolean;
  moveCount: number;
  mergeCount: number;
  highestTile: number;
  previousState: GameState | null;
  canUndo: boolean;
}

export interface GameStatistics {
  totalGamesPlayed: number;
  totalMoves: number;
  highestTileReached: number;
  highestScore: number;
  totalMerges: number;
  dailyChallengeCompleted: Record<string, boolean>;
  dailyChallengeScores: Record<string, number>;
}

export interface Settings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  reducedAnimations: boolean;
  theme: 'dark' | 'light';
}

export interface DailyChallengeState {
  date: string;
  seed: number;
  board: Board;
  score: number;
  isCompleted: boolean;
  bestScore: number;
}

export interface MoveResult {
  board: Board;
  score: number;
  moveCount: number;
  mergeCount: number;
  highestTile: number;
  hasMoved: boolean;
  hasWon: boolean;
  isGameOver: boolean;
}

export const GRID_SIZE = 4;
export const WINNING_TILE = 2048;

export const TILE_COLORS: Record<number, { bg: string; text: string; glow?: string }> = {
  2: { bg: '#CDC1B4', text: '#776E65' },
  4: { bg: '#EEE4DA', text: '#776E65' },
  8: { bg: '#F2B179', text: '#F9F6F2' },
  16: { bg: '#F59563', text: '#F9F6F2' },
  32: { bg: '#F67C5F', text: '#F9F6F2' },
  64: { bg: '#F65E3B', text: '#F9F6F2' },
  128: { bg: '#EDCF72', text: '#F9F6F2' },
  256: { bg: '#EDCC61', text: '#F9F6F2' },
  512: { bg: '#EDC850', text: '#F9F6F2' },
  1024: { bg: '#EDC53F', text: '#F9F6F2' },
  2048: { bg: '#EDC22E', text: '#F9F6F2', glow: '#FFA500' },
  4096: { bg: '#3C3A32', text: '#F9F6F2', glow: '#FFD700' },
  8192: { bg: '#3C3A32', text: '#F9F6F2', glow: '#FFA500' },
};

export const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  hapticEnabled: true,
  reducedAnimations: false,
  theme: 'dark',
};

export const DEFAULT_STATISTICS: GameStatistics = {
  totalGamesPlayed: 0,
  totalMoves: 0,
  highestTileReached: 0,
  highestScore: 0,
  totalMerges: 0,
  dailyChallengeCompleted: {},
  dailyChallengeScores: {},
};

export function createEmptyBoard(): Board {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}