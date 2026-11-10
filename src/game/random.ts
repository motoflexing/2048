import type { Tile, Board } from './types';
import { GRID_SIZE, createEmptyBoard, generateId } from './types';

export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextBool(probability: number = 0.5): boolean {
    return this.next() < probability;
  }
}

export function getDailySeed(): number {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getRandomEmptyCell(board: Board, random: SeededRandom): { x: number; y: number } | null {
  const emptyCells: { x: number; y: number }[] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (board[y][x] === null) {
        emptyCells.push({ x, y });
      }
    }
  }
  if (emptyCells.length === 0) return null;
  const index = random.nextInt(0, emptyCells.length - 1);
  return emptyCells[index];
}

export function createRandomTile(random: SeededRandom, board: Board): Tile | null {
  const emptyCell = getRandomEmptyCell(board, random);
  if (!emptyCell) return null;

  const value = random.nextBool(0.9) ? 2 : 4;
  return {
    id: generateId(),
    value,
    x: emptyCell.x,
    y: emptyCell.y,
    isNew: true,
  };
}

export function addRandomTile(board: Board, random: SeededRandom): Board {
  const newBoard = board.map(row => [...row]);
  const tile = createRandomTile(random, newBoard);
  if (tile) {
    newBoard[tile.y][tile.x] = tile;
  }
  return newBoard;
}

export function initializeBoard(random: SeededRandom): Board {
  const board = createEmptyBoard();
  const boardWithFirst = addRandomTile(board, random);
  return addRandomTile(boardWithFirst, random);
}