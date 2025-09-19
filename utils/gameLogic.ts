import { Tile, Direction, Obstacle } from '@/types/game';
import { 
  getTileAtPosition, 
  getPositionInDirection, 
  isValidPosition, 
  hasObstacle,
  getObstacleAtPosition
} from './gridUtils';
import { generateId } from './idGenerator';

// Move tiles in a specific direction
export function moveTiles(
  grid: (Tile | null)[][], 
  direction: Direction, 
  obstacles: Obstacle[], 
  currentScore: number,
  gridSize: number
): { newGrid: (Tile | null)[][], newScore: number, moved: boolean } {
  // Create a deep copy of the grid to work with
  const newGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
  
  // Copy all tiles to the new grid
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (grid[y][x]) {
        newGrid[y][x] = { ...grid[y][x], isNew: false, mergedFrom: undefined };
      }
    }
  }
  
  let newScore = currentScore;
  let moved = false;
  
  // Get all tiles as a flat array
  const tiles: Tile[] = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (newGrid[y][x]) {
        tiles.push(newGrid[y][x]!);
      }
    }
  }
  
  // Sort tiles to process them in the correct order based on direction
  // This ensures that tiles closer to the edge are moved first
  const sortedTiles = sortTilesForDirection(tiles, direction);
  
  // Process each tile
  for (const tile of sortedTiles) {
    // Skip tiles that have already been merged
    if (!newGrid[tile.position.y][tile.position.x]) {
      continue;
    }
    
    // Clear the tile from its original position
    newGrid[tile.position.y][tile.position.x] = null;
    
    // Find the farthest position the tile can move to
    const { farthestPosition, nextPosition, multiplied } = findFarthestPosition(
      tile.position, 
      direction, 
      newGrid, 
      obstacles,
      gridSize
    );
    
    // If the tile can move
    if (farthestPosition.x !== tile.position.x || farthestPosition.y !== tile.position.y) {
      moved = true;
      
      // Apply multiplier if the tile passed through a multiplier obstacle
      let newValue = tile.value;
      if (multiplied) {
        newValue = tile.value * 2;
      }
      
      // Update the tile's position and value
      tile.position = farthestPosition;
      tile.value = newValue;
    }
    
    // Check if there's a tile at the next position that can be merged
    if (nextPosition && newGrid[nextPosition.y][nextPosition.x]) {
      const nextTile = newGrid[nextPosition.y][nextPosition.x]!;
      
      if (nextTile.value === tile.value) {
        // Merge the tiles
        const mergedValue = tile.value * 2;
        
        // Create a new tile at the next position with the merged value
        const mergedTile: Tile = {
          id: generateId(),
          position: nextPosition,
          value: mergedValue,
          isNew: false,
          mergedFrom: [tile, nextTile]
        };
        
        // Remove the next tile from the grid (it's being merged)
        newGrid[nextPosition.y][nextPosition.x] = null;
        
        // Place the merged tile on the grid
        newGrid[nextPosition.y][nextPosition.x] = mergedTile;
        
        // Update the score
        newScore += mergedValue;
        
        // Mark that a move occurred
        moved = true;
      } else {
        // Just place the tile on the grid
        newGrid[farthestPosition.y][farthestPosition.x] = tile;
      }
    } else {
      // Just place the tile on the grid
      newGrid[farthestPosition.y][farthestPosition.x] = tile;
    }
  }
  
  return { newGrid, newScore, moved };
}

// Sort tiles based on direction to ensure correct processing order
function sortTilesForDirection(tiles: Tile[], direction: Direction): Tile[] {
  const sortedTiles = [...tiles];
  
  switch (direction) {
    case 'up':
      sortedTiles.sort((a, b) => a.position.y - b.position.y);
      break;
    case 'right':
      sortedTiles.sort((a, b) => b.position.x - a.position.x);
      break;
    case 'down':
      sortedTiles.sort((a, b) => b.position.y - a.position.y);
      break;
    case 'left':
      sortedTiles.sort((a, b) => a.position.x - b.position.x);
      break;
  }
  
  return sortedTiles;
}

// Find the farthest position a tile can move to
function findFarthestPosition(
  startPosition: { x: number, y: number }, 
  direction: Direction, 
  grid: (Tile | null)[][], 
  obstacles: Obstacle[],
  gridSize: number
): { 
  farthestPosition: { x: number, y: number }, 
  nextPosition?: { x: number, y: number },
  multiplied: boolean
} {
  let position = { ...startPosition };
  let previousPosition = { ...position };
  let multiplied = false;
  
  // Keep moving until we hit an obstacle, another tile, or the edge of the grid
  do {
    previousPosition = { ...position };
    position = getPositionInDirection(position, direction);
    
    // Check if the position is valid
    if (!isValidPosition(position, gridSize)) {
      break;
    }
    
    // Check if there's an obstacle at the position
    const obstacle = getObstacleAtPosition(obstacles, position);
    if (obstacle) {
      if (obstacle.type === 'wall') {
        break;
      } else if (obstacle.type === 'multiplier') {
        multiplied = true;
      }
    }
    
    // Check if there's a tile at the position
    if (grid[position.y][position.x]) {
      // We found a tile, so we can't move further
      return { 
        farthestPosition: previousPosition, 
        nextPosition: position,
        multiplied
      };
    }
  } while (isValidPosition(position, gridSize) && !hasObstacle(obstacles, position, 'wall'));
  
  return { 
    farthestPosition: previousPosition, 
    multiplied
  };
}