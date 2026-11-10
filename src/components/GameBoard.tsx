import { useRef, useEffect, useCallback } from 'react';
import type { Board, Direction } from '../game/types';
import { GRID_SIZE } from '../game/types';
import { GameTile } from './GameTile';
import { useSwipe } from '../hooks/useSwipe';

interface GameBoardProps {
  board: Board;
  cellSize: number;
  gap: number;
  reducedAnimations: boolean;
  onMove: (direction: Direction) => void;
}

export function GameBoard({ board, cellSize, gap, reducedAnimations, onMove }: GameBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);

  useSwipe(boardRef, {
    onSwipe: onMove,
    threshold: 20,
    preventScroll: true,
  });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const keyMap: Record<string, Direction> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      w: 'up',
      s: 'down',
      a: 'left',
      d: 'right',
      W: 'up',
      S: 'down',
      A: 'left',
      D: 'right',
    };

    const direction = keyMap[e.key];
    if (direction) {
      e.preventDefault();
      onMove(direction);
    }
  }, [onMove]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const containerSize = GRID_SIZE * cellSize + (GRID_SIZE + 1) * gap;

  return (
    <div
      ref={boardRef}
      className="relative rounded-2xl"
      style={{
        width: containerSize,
        height: containerSize,
        backgroundColor: '#191B20',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.4)',
        borderRadius: '16px',
        touchAction: 'none',
      }}
      role="grid"
      aria-label="Game board"
    >
      {/* Grid cells background */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${cellSize}px)`,
          gap: `${gap}px`,
          padding: `${gap}px`,
          pointerEvents: 'none',
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl"
            style={{
              backgroundColor: '#22252B',
              borderRadius: '12px',
            }}
          />
        ))}
      </div>

      {/* Tiles */}
      {board.flat().filter((tile): tile is NonNullable<typeof tile> => tile !== null).map((tile) => (
        <GameTile
          key={tile.id}
          tile={tile}
          cellSize={cellSize}
          gap={gap}
          reducedAnimations={reducedAnimations}
        />
      ))}
    </div>
  );
}