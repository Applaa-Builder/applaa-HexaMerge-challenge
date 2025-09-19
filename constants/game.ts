// Game constants

// Grid size
export const DEFAULT_GRID_SIZE = 4;

// Cell dimensions - adjusted for better visibility
export const CELL_SIZE = 80; // Increased from 70
export const CELL_MARGIN = 5; // Reduced from 6

// Animation duration in milliseconds
export const ANIMATION_DURATION = 150;

// Direction vectors
export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 }
};

// Game levels
export const LEVELS = [
  {
    name: 'Beginner',
    description: 'Classic 2048 - Merge tiles to reach 512',
    gridSize: 4,
    winningValue: 512,
    obstacles: []
  },
  {
    name: 'Obstacles',
    description: 'Navigate around walls to merge tiles',
    gridSize: 4,
    winningValue: 512,
    obstacles: [
      { id: 'wall1', type: 'wall', position: { x: 1, y: 1 } },
      { id: 'wall2', type: 'wall', position: { x: 2, y: 2 } }
    ]
  },
  {
    name: 'Expansion',
    description: 'Larger grid with more obstacles',
    gridSize: 5,
    winningValue: 1024,
    obstacles: [
      { id: 'wall1', type: 'wall', position: { x: 1, y: 1 } },
      { id: 'wall2', type: 'wall', position: { x: 3, y: 3 } },
      { id: 'multiplier1', type: 'multiplier', position: { x: 2, y: 2 } }
    ]
  },
  {
    name: 'Challenge',
    description: 'Complex obstacle pattern with multipliers',
    gridSize: 5,
    winningValue: 2048,
    obstacles: [
      { id: 'wall1', type: 'wall', position: { x: 0, y: 2 } },
      { id: 'wall2', type: 'wall', position: { x: 4, y: 2 } },
      { id: 'wall3', type: 'wall', position: { x: 2, y: 0 } },
      { id: 'wall4', type: 'wall', position: { x: 2, y: 4 } },
      { id: 'multiplier1', type: 'multiplier', position: { x: 1, y: 1 } },
      { id: 'multiplier2', type: 'multiplier', position: { x: 3, y: 3 } }
    ]
  },
  {
    name: 'Master',
    description: 'The ultimate challenge - reach 4096',
    gridSize: 6,
    winningValue: 4096,
    obstacles: [
      { id: 'wall1', type: 'wall', position: { x: 1, y: 1 } },
      { id: 'wall2', type: 'wall', position: { x: 1, y: 4 } },
      { id: 'wall3', type: 'wall', position: { x: 4, y: 1 } },
      { id: 'wall4', type: 'wall', position: { x: 4, y: 4 } },
      { id: 'wall5', type: 'wall', position: { x: 2, y: 3 } },
      { id: 'wall6', type: 'wall', position: { x: 3, y: 2 } },
      { id: 'multiplier1', type: 'multiplier', position: { x: 0, y: 0 } },
      { id: 'multiplier2', type: 'multiplier', position: { x: 5, y: 5 } }
    ]
  }
];