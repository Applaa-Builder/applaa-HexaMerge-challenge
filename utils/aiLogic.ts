import { Tile, Direction, Obstacle, AIPersona } from '@/types/game';
import { moveTiles } from './gameLogic';
import { isGameOver } from './gridUtils';

// Make an AI move based on the current state
export function makeAIMove(
  grid: (Tile | null)[][], 
  obstacles: Obstacle[], 
  score: number, 
  persona: AIPersona,
  gridSize: number
): { direction: Direction | null; newGrid: (Tile | null)[][]; newScore: number } {
  // If the game is over, return null
  if (isGameOver(grid, obstacles, gridSize)) {
    return { direction: null, newGrid: grid, newScore: score };
  }
  
  // Choose a direction based on the AI persona
  const direction = chooseDirection(grid, obstacles, score, persona, gridSize);
  
  // If no valid direction is found, return null
  if (!direction) {
    return { direction: null, newGrid: grid, newScore: score };
  }
  
  // Make the move
  const { newGrid, newScore } = moveTiles(grid, direction, obstacles, score, gridSize);
  
  return { direction, newGrid, newScore };
}

// Choose a direction based on the AI persona
function chooseDirection(
  grid: (Tile | null)[][], 
  obstacles: Obstacle[], 
  score: number, 
  persona: AIPersona,
  gridSize: number
): Direction | null {
  const directions: Direction[] = ['up', 'right', 'down', 'left'];
  
  // Try each direction and evaluate the result
  const moves = directions.map(direction => {
    const { newGrid, newScore, moved } = moveTiles(grid, direction, obstacles, score, gridSize);
    
    // If the move doesn't change the grid, it's not valid
    if (!moved) {
      return { direction, score: -1 };
    }
    
    // Evaluate the move based on the AI persona
    const moveScore = evaluateMove(newGrid, newScore, score, persona);
    
    return { direction, score: moveScore };
  });
  
  // Filter out invalid moves
  const validMoves = moves.filter(move => move.score >= 0);
  
  // If there are no valid moves, return null
  if (validMoves.length === 0) {
    return null;
  }
  
  // Choose the best move based on the AI persona
  switch (persona) {
    case 'Balanced Betty':
      // Choose a move with a good balance of score and empty cells
      validMoves.sort((a, b) => b.score - a.score);
      return validMoves[0].direction;
      
    case 'Aggressive Alex':
      // Choose a move that maximizes score, even if it's risky
      validMoves.sort((a, b) => b.score - a.score);
      return validMoves[0].direction;
      
    case 'Defensive Dana':
      // Choose a move that maximizes empty cells, even if it doesn't increase score
      validMoves.sort((a, b) => {
        const aEmptyCells = countEmptyCells(moveTiles(grid, a.direction, obstacles, score, gridSize).newGrid);
        const bEmptyCells = countEmptyCells(moveTiles(grid, b.direction, obstacles, score, gridSize).newGrid);
        return bEmptyCells - aEmptyCells;
      });
      return validMoves[0].direction;
      
    case 'Strategic Sam':
      // Look ahead multiple moves
      validMoves.sort((a, b) => {
        const aScore = lookAhead(
          moveTiles(grid, a.direction, obstacles, score, gridSize).newGrid,
          obstacles,
          score,
          2,
          gridSize
        );
        const bScore = lookAhead(
          moveTiles(grid, b.direction, obstacles, score, gridSize).newGrid,
          obstacles,
          score,
          2,
          gridSize
        );
        return bScore - aScore;
      });
      return validMoves[0].direction;
      
    case 'Random Randy':
      // Choose a random valid move
      return validMoves[Math.floor(Math.random() * validMoves.length)].direction;
      
    default:
      // Default to balanced
      validMoves.sort((a, b) => b.score - a.score);
      return validMoves[0].direction;
  }
}

// Evaluate a move based on the AI persona
function evaluateMove(
  grid: (Tile | null)[][], 
  newScore: number, 
  oldScore: number, 
  persona: AIPersona
): number {
  // Count the number of empty cells
  const emptyCells = countEmptyCells(grid);
  
  // Calculate the score increase
  const scoreIncrease = newScore - oldScore;
  
  // Calculate the highest tile value
  const highestTile = findHighestTile(grid);
  
  // Calculate the monotonicity (how ordered the grid is)
  const monotonicity = calculateMonotonicity(grid);
  
  // Calculate the smoothness (how similar adjacent tiles are)
  const smoothness = calculateSmoothness(grid);
  
  // Evaluate the move based on the AI persona
  switch (persona) {
    case 'Balanced Betty':
      return scoreIncrease * 0.5 + emptyCells * 10 + monotonicity * 2 + smoothness * 2;
      
    case 'Aggressive Alex':
      return scoreIncrease * 1.0 + emptyCells * 5 + highestTile * 0.1;
      
    case 'Defensive Dana':
      return scoreIncrease * 0.2 + emptyCells * 20 + smoothness * 5;
      
    case 'Strategic Sam':
      return scoreIncrease * 0.3 + emptyCells * 15 + monotonicity * 5 + smoothness * 3;
      
    case 'Random Randy':
      return Math.random() * 100;
      
    default:
      return scoreIncrease * 0.5 + emptyCells * 10;
  }
}

// Count the number of empty cells in the grid
function countEmptyCells(grid: (Tile | null)[][]): number {
  let count = 0;
  
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (!grid[y][x]) {
        count++;
      }
    }
  }
  
  return count;
}

// Find the highest tile value in the grid
function findHighestTile(grid: (Tile | null)[][]): number {
  let highest = 0;
  
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const tile = grid[y][x];
      if (tile && tile.value > highest) {
        highest = tile.value;
      }
    }
  }
  
  return highest;
}

// Calculate the monotonicity of the grid (how ordered it is)
function calculateMonotonicity(grid: (Tile | null)[][]): number {
  let score = 0;
  
  // Check rows
  for (let y = 0; y < grid.length; y++) {
    let current = 0;
    let next = 0;
    
    for (let x = 0; x < grid[y].length - 1; x++) {
      current = grid[y][x] ? Math.log2(grid[y][x]!.value) : 0;
      next = grid[y][x + 1] ? Math.log2(grid[y][x + 1]!.value) : 0;
      
      if (current > next) {
        score += current - next;
      }
    }
  }
  
  // Check columns
  for (let x = 0; x < grid[0].length; x++) {
    let current = 0;
    let next = 0;
    
    for (let y = 0; y < grid.length - 1; y++) {
      current = grid[y][x] ? Math.log2(grid[y][x]!.value) : 0;
      next = grid[y + 1][x] ? Math.log2(grid[y + 1][x]!.value) : 0;
      
      if (current > next) {
        score += current - next;
      }
    }
  }
  
  return score;
}

// Calculate the smoothness of the grid (how similar adjacent tiles are)
function calculateSmoothness(grid: (Tile | null)[][]): number {
  let score = 0;
  
  // Check rows
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length - 1; x++) {
      const current = grid[y][x] ? grid[y][x]!.value : 0;
      const next = grid[y][x + 1] ? grid[y][x + 1]!.value : 0;
      
      if (current > 0 && next > 0) {
        score -= Math.abs(Math.log2(current) - Math.log2(next));
      }
    }
  }
  
  // Check columns
  for (let x = 0; x < grid[0].length; x++) {
    for (let y = 0; y < grid.length - 1; y++) {
      const current = grid[y][x] ? grid[y][x]!.value : 0;
      const next = grid[y + 1][x] ? grid[y + 1][x]!.value : 0;
      
      if (current > 0 && next > 0) {
        score -= Math.abs(Math.log2(current) - Math.log2(next));
      }
    }
  }
  
  return score;
}

// Look ahead multiple moves to evaluate the best direction
function lookAhead(
  grid: (Tile | null)[][], 
  obstacles: Obstacle[], 
  score: number, 
  depth: number,
  gridSize: number
): number {
  if (depth === 0 || isGameOver(grid, obstacles, gridSize)) {
    return evaluateMove(grid, score, 0, 'Strategic Sam');
  }
  
  const directions: Direction[] = ['up', 'right', 'down', 'left'];
  let bestScore = -Infinity;
  
  for (const direction of directions) {
    const { newGrid, newScore, moved } = moveTiles(grid, direction, obstacles, score, gridSize);
    
    if (moved) {
      const moveScore = lookAhead(newGrid, obstacles, newScore, depth - 1, gridSize);
      bestScore = Math.max(bestScore, moveScore);
    }
  }
  
  return bestScore === -Infinity ? evaluateMove(grid, score, 0, 'Strategic Sam') : bestScore;
}