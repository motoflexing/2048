import { useState, useEffect } from 'react';
import type { Tile } from '../game/types';
import { TILE_COLORS } from '../game/types';

interface GameTileProps {
  tile: Tile;
  cellSize: number;
  gap: number;
  reducedAnimations: boolean;
}

export function GameTile({ tile, cellSize, gap, reducedAnimations }: GameTileProps) {
  const colors = TILE_COLORS[tile.value] || TILE_COLORS[2];
  const isNew = tile.isNew && !reducedAnimations;
  const isMerged = tile.isMerged && !reducedAnimations;

  const [scale, setScale] = useState(1);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (isNew) {
      setScale(0);
      setOpacity(0);
      requestAnimationFrame(() => {
        setScale(1);
        setOpacity(1);
      });
    } else if (isMerged) {
      setScale(1.2);
      requestAnimationFrame(() => {
        setScale(1);
      });
    }
  }, [isNew, isMerged]);

  const fontSize = Math.max(cellSize * 0.35, 14);

  return (
    <div
      className="absolute rounded-xl transition-all duration-150 ease-out select-none"
      style={{
        width: cellSize,
        height: cellSize,
        left: tile.x * (cellSize + gap) + gap,
        top: tile.y * (cellSize + gap) + gap,
        backgroundColor: colors.bg,
        color: colors.text,
        fontSize: `${fontSize}px`,
        fontWeight: tile.value >= 128 ? '700' : '600',
        transform: `scale(${scale})`,
        opacity,
        boxShadow: colors.glow
          ? `0 0 20px ${colors.glow}, 0 4px 12px rgba(0,0,0,0.3)`
          : '0 2px 8px rgba(0,0,0,0.3)',
        zIndex: isMerged ? 10 : 1,
        borderRadius: '12px',
      }}
    >
      <div className="flex items-center justify-center h-full w-full">
        {tile.value}
      </div>
    </div>
  );
}