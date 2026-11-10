import type { Direction, Board, Tile, MoveResult } from './types';
import { GRID_SIZE, WINNING_TILE, generateId } from './types';

export function cloneBoard(board: Board): Board {
  return board.map(row => row.map(tile => tile ? { ...tile } : null));
}

export function boardsEqual(board1: Board, board2: Board): boolean {
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const t1 = board1[y][x];
      const t2 = board2[y][x];
      if (t1 === null && t2 === null) continue;
      if (t1 === null || t2 === null) return false;
      if (t1.value !== t2.value || t1.id !== t2.id) return false;
    }
  }
  return true;
}

function moveTilesInLine(line: (Tile | null)[]): { tiles: (Tile | null)[]; score: number; mergeCount: number; hasMoved: boolean } {
  const nonNullTiles = line.filter((t): t is Tile => t !== null);
  const result: (Tile | null)[] = [];
  let score = 0;
  let mergeCount = 0;
  let hasMoved = false;
  let i = 0;

  while (i < nonNullTiles.length) {
    const current = nonNullTiles[i];
    if (i + 1 < nonNullTiles.length && nonNullTiles[i + 1].value === current.value) {
      const mergedTile: Tile = {
        id: generateId(),
        value: current.value * 2,
        x: current.x,
        y: current.y,
        isMerged: true,
        mergedFrom: [current.id, nonNullTiles[i + 1].id],
      };
      result.push(mergedTile);
      score += mergedTile.value;
      mergeCount++;
      hasMoved = true;
      i += 2;
    } else {
      const tileCopy: Tile = { ...current };
      result.push(tileCopy);
      if (result.length - 1 !== line.indexOf(current)) {
        hasMoved = true;
      }
      i++;
    }
  }

  while (result.length < GRID_SIZE) {
    result.push(null);
  }

  return { tiles: result, score, mergeCount, hasMoved };
}

export function moveBoard(board: Board, direction: Direction): MoveResult {
  const newBoard = cloneBoard(board);
  let totalScore = 0;
  let totalMergeCount = 0;
  let hasMoved = false;
  let highestTile = 0;
  let hasWon = false;

  // Reset merge flags
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (newBoard[y][x]) {
        newBoard[y][x]!.isMerged = false;
        newBoard[y][x]!.mergedFrom = undefined;
      }
    }
  }

  if (direction === 'left') {
    for (let y = 0; y < GRID_SIZE; y++) {
      const line = newBoard[y].map((tile, x): Tile | null => tile ? { ...tile, x } : null);
      const { tiles, score, mergeCount, hasMoved: lineMoved } = moveTilesInLine(line);
      for (let x = 0; x < GRID_SIZE; x++) {
        if (tiles[x]) {
          tiles[x]!.x = x;
          tiles[x]!.y = y;
          newBoard[y][x] = tiles[x];
          if (tiles[x]!.value > highestTile) highestTile = tiles[x]!.value;
          if (tiles[x]!.value >= WINNING_TILE) hasWon = true;
        } else {
          newBoard[y][x] = null;
        }
      }
      totalScore += score;
      totalMergeCount += mergeCount;
      hasMoved = hasMoved || lineMoved;
    }
  } else if (direction === 'right') {
    for (let y = 0; y < GRID_SIZE; y++) {
      const line = newBoard[y].map((tile, x): Tile | null => tile ? { ...tile, x } : null).reverse();
      const { tiles, score, mergeCount, hasMoved: lineMoved } = moveTilesInLine(line);
      const reversedTiles = tiles.reverse();
      for (let x = 0; x < GRID_SIZE; x++) {
        if (reversedTiles[x]) {
          reversedTiles[x]!.x = x;
          reversedTiles[x]!.y = y;
          newBoard[y][x] = reversedTiles[x];
          if (reversedTiles[x]!.value > highestTile) highestTile = reversedTiles[x]!.value;
          if (reversedTiles[x]!.value >= WINNING_TILE) hasWon = true;
        } else {
          newBoard[y][x] = null;
        }
      }
      totalScore += score;
      totalMergeCount += mergeCount;
      hasMoved = hasMoved || lineMoved;
    }
  } else if (direction === 'up') {
    for (let x = 0; x < GRID_SIZE; x++) {
      const line = newBoard.map((row, y): Tile | null => {
        const tile = row[x];
        return tile ? { ...tile, y } : null;
      });
      const { tiles, score, mergeCount, hasMoved: lineMoved } = moveTilesInLine(line);
      for (let y = 0; y < GRID_SIZE; y++) {
        if (tiles[y]) {
          tiles[y]!.x = x;
          tiles[y]!.y = y;
          newBoard[y][x] = tiles[y];
          if (tiles[y]!.value > highestTile) highestTile = tiles[y]!.value;
          if (tiles[y]!.value >= WINNING_TILE) hasWon = true;
        } else {
          newBoard[y][x] = null;
        }
      }
      totalScore += score;
      totalMergeCount += mergeCount;
      hasMoved = hasMoved || lineMoved;
    }
  } else if (direction === 'down') {
    for (let x = 0; x < GRID_SIZE; x++) {
      const line = newBoard.map((row, y): Tile | null => {
        const tile = row[x];
        return tile ? { ...tile, y } : null;
      }).reverse();
      const { tiles, score, mergeCount, hasMoved: lineMoved } = moveTilesInLine(line);
      const reversedTiles = tiles.reverse();
      for (let y = 0; y < GRID_SIZE; y++) {
        if (reversedTiles[y]) {
          reversedTiles[y]!.x = x;
          reversedTiles[y]!.y = y;
          newBoard[y][x] = reversedTiles[y];
          if (reversedTiles[y]!.value > highestTile) highestTile = reversedTiles[y]!.value;
          if (reversedTiles[y]!.value >= WINNING_TILE) hasWon = true;
        } else {
          newBoard[y][x] = null;
        }
      }
      totalScore += score;
      totalMergeCount += mergeCount;
      hasMoved = hasMoved || lineMoved;
    }
  }

  // Check game over
  const isGameOver = checkGameOver(newBoard);

  return {
    board: newBoard,
    score: totalScore,
    moveCount: hasMoved ? 1 : 0,
    mergeCount: totalMergeCount,
    highestTile,
    hasMoved,
    hasWon,
    isGameOver,
  };
}

export function checkGameOver(board: Board): boolean {
  // Check for empty cells
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (board[y][x] === null) return false;
    }
  }

  // Check for possible merges horizontally
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE - 1; x++) {
      if (board[y][x] && board[y][x + 1] && board[y][x]!.value === board[y][x + 1]!.value) {
        return false;
      }
    }
  }

  // Check for possible merges vertically
  for (let y = 0; y < GRID_SIZE - 1; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (board[y][x] && board[y + 1][x] && board[y][x]!.value === board[y + 1][x]!.value) {
        return false;
      }
    }
  }

  return true;
}

export function getHighestTile(board: Board): number {
  let highest = 0;
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (board[y][x] && board[y][x]!.value > highest) {
        highest = board[y][x]!.value;
      }
    }
  }
  return highest;
}

export function getEmptyCells(board: Board): { x: number; y: number }[] {
  const empty: { x: number; y: number }[] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (board[y][x] === null) {
        empty.push({ x, y });
      }
    }
  }
  return empty;
}