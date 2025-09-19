import { Tile, Obstacle, Position, Direction } from '@/types/game';
import { generateId } from './idGenerator';

// Initialize a grid with random tiles
export function initializeGrid(obstacles: Obstacle[], gridSize: number): (Tile | null)[][] {
  // Create an empty grid
  const grid: (Tile | null)[][] = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(null));
  
  // Add two random tiles
  const gridWithTiles = addRandomTile(grid, obstacles, gridSize);
  return addRandomTile(gridWithTiles, obstacles, gridSize);
}

// Add a random tile to the grid
export function addRandomTile(grid: (Tile | null)[][], obstacles: Obstacle[], gridSize: number): (Tile | null)[][] {
  // Create a copy of the grid
  const newGrid = JSON.parse(JSON.stringify(grid));
  
  // Find all empty cells
  const emptyCells: Position[] = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (!newGrid[y][x] && !hasObstacle(obstacles, { x, y })) {
        emptyCells.push({ x, y });
      }
    }
  }
  
  // If there are no empty cells, return the original grid
  if (emptyCells.length === 0) {
    return newGrid;
  }
  
  // Choose a random empty cell
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const position = emptyCells[randomIndex];
  
  // Create a new tile with a value of 2 or 4
  const value = Math.random() < 0.9 ? 2 : 4;
  const tile: Tile = {
    id: generateId(),
    value,
    position,
    isNew: true
  };
  
  // Add the tile to the grid
  newGrid[position.y][position.x] = tile;
  
  return newGrid;
}

// Check if the game is over
export function isGameOver(grid: (Tile | null)[][], obstacles: Obstacle[], gridSize: number): boolean {
  // Check if there are any empty cells
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (!grid[y][x] && !hasObstacle(obstacles, { x, y })) {
        return false;
      }
    }
  }
  
  // Check if there are any adjacent tiles with the same value
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const tile = grid[y][x];
      if (tile) {
        // Check right
        if (x < gridSize - 1 && !hasObstacle(obstacles, { x: x + 1, y }, 'wall')) {
          const rightTile = grid[y][x + 1];
          if (rightTile && rightTile.value === tile.value) {
            return false;
          }
        }
        
        // Check down
        if (y < gridSize - 1 && !hasObstacle(obstacles, { x, y: y + 1 }, 'wall')) {
          const downTile = grid[y + 1][x];
          if (downTile && downTile.value === tile.value) {
            return false;
          }
        }
        
        // Check left
        if (x > 0 && !hasObstacle(obstacles, { x: x - 1, y }, 'wall')) {
          const leftTile = grid[y][x - 1];
          if (leftTile && leftTile.value === tile.value) {
            return false;
          }
        }
        
        // Check up
        if (y > 0 && !hasObstacle(obstacles, { x, y: y - 1 }, 'wall')) {
          const upTile = grid[y - 1][x];
          if (upTile && upTile.value === tile.value) {
            return false;
          }
        }
      }
    }
  }
  
  return true;
}

// Check if the player has won
export function hasWon(grid: (Tile | null)[][], winningValue: number): boolean {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const tile = grid[y][x];
      if (tile && tile.value >= winningValue) {
        return true;
      }
    }
  }
  
  return false;
}

// Get a tile at a specific position
export function getTileAtPosition(tiles: Tile[], position: Position): Tile | null {
  return tiles.find(
    tile => tile.position.x === position.x && tile.position.y === position.y
  ) || null;
}

// Get the next position in a specific direction
export function getPositionInDirection(position: Position, direction: Direction): Position {
  switch (direction) {
    case 'up':
      return { x: position.x, y: position.y - 1 };
    case 'right':
      return { x: position.x + 1, y: position.y };
    case 'down':
      return { x: position.x, y: position.y + 1 };
    case 'left':
      return { x: position.x - 1, y: position.y };
  }
}

// Check if a position is valid
export function isValidPosition(position: Position, gridSize: number): boolean {
  return (
    position.x >= 0 &&
    position.x < gridSize &&
    position.y >= 0 &&
    position.y < gridSize
  );
}

// Check if there's an obstacle at a specific position
export function hasObstacle(obstacles: Obstacle[], position: Position, type?: string): boolean {
  return obstacles.some(
    obstacle => 
      obstacle.position.x === position.x && 
      obstacle.position.y === position.y &&
      (type ? obstacle.type === type : true)
  );
}

// Get an obstacle at a specific position
export function getObstacleAtPosition(obstacles: Obstacle[], position: Position): Obstacle | null {
  return obstacles.find(
    obstacle => obstacle.position.x === position.x && obstacle.position.y === position.y
  ) || null;
}