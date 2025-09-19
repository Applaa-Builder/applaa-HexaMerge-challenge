import { HexPosition, Tile, TileValue, Direction } from '@/types/game';
import { DIRECTIONS, GRID_SIZE } from '@/constants/game';
import { generateId } from '@/utils/idGenerator';

// Generate all valid positions in a hexagonal grid with given radius
export function generateGridPositions(radius: number): HexPosition[] {
  const positions: HexPosition[] = [];
  
  for (let q = -radius; q <= radius; q++) {
    const r1 = Math.max(-radius, -q - radius);
    const r2 = Math.min(radius, -q + radius);
    
    for (let r = r1; r <= r2; r++) {
      positions.push({ q, r });
    }
  }
  
  return positions;
}

// Check if a position is within the grid bounds
export function isValidPosition(pos: HexPosition, radius: number): boolean {
  return Math.abs(pos.q) <= radius && 
         Math.abs(pos.r) <= radius && 
         Math.abs(-pos.q - pos.r) <= radius;
}

// Get a position in a specific direction
export function getPositionInDirection(pos: HexPosition, direction: Direction): HexPosition {
  const dir = DIRECTIONS[direction];
  return {
    q: pos.q + dir.q,
    r: pos.r + dir.r
  };
}

// Find a tile at a specific position
export function getTileAtPosition(grid: Tile[], pos: HexPosition): Tile | undefined {
  return grid.find(tile => tile.position.q === pos.q && tile.position.r === pos.r);
}

// Get all empty positions in the grid
export function getEmptyPositions(grid: Tile[], radius: number): HexPosition[] {
  const allPositions = generateGridPositions(radius);
  return allPositions.filter(pos => !getTileAtPosition(grid, pos));
}

// Add a new tile to the grid
export function addRandomTile(grid: Tile[]): Tile[] {
  const emptyPositions = getEmptyPositions(grid, GRID_SIZE);
  
  if (emptyPositions.length === 0) return grid;
  
  const randomPosition = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  
  const newTile: Tile = {
    id: generateId(),
    value: value as TileValue,
    position: randomPosition,
    isNew: true
  };
  
  return [...grid, newTile];
}

// Initialize a new grid with two random tiles
export function initializeGrid(): Tile[] {
  let grid: Tile[] = [];
  grid = addRandomTile(grid);
  grid = addRandomTile(grid);
  return grid;
}

// Check if two tiles can be merged
export function canMergeTiles(tile1: Tile, tile2: Tile): boolean {
  return tile1.value === tile2.value;
}

// Check if the game is over (no more moves possible)
export function isGameOver(grid: Tile[]): boolean {
  // If there are empty cells, game is not over
  if (getEmptyPositions(grid, GRID_SIZE).length > 0) return false;
  
  // Check if any adjacent tiles can be merged
  for (const tile of grid) {
    for (const dirKey in DIRECTIONS) {
      const direction = dirKey as Direction;
      const nextPos = getPositionInDirection(tile.position, direction);
      const nextTile = getTileAtPosition(grid, nextPos);
      
      if (nextTile && canMergeTiles(tile, nextTile)) {
        return false;
      }
    }
  }
  
  return true;
}

// Check if the player has won (reached the winning tile)
export function hasWon(grid: Tile[], winningValue: number): boolean {
  return grid.some(tile => tile.value >= winningValue);
}

// Calculate the coordinates for rendering a hexagon
export function hexToPixel(hex: HexPosition, size: number): { x: number; y: number } {
  const x = size * (3/2 * hex.q);
  const y = size * (Math.sqrt(3)/2 * hex.q + Math.sqrt(3) * hex.r);
  return { x, y };
}