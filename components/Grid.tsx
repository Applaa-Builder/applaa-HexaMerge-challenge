import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Tile as TileType, Obstacle, Direction } from '@/types/game';
import TileComponent from './TileComponent';
import ObstacleComponent from './ObstacleComponent';
import Cell from './Cell';
import { COLORS } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface GridProps {
  grid: (TileType | null)[][];
  obstacles: Obstacle[];
  gridSize: number;
  isFullScreen?: boolean;
  isDarkMode?: boolean;
  onMove?: (direction: Direction) => void;
}

export default function Grid({ 
  grid, 
  obstacles, 
  gridSize, 
  isFullScreen = false,
  isDarkMode = false,
  onMove
}: GridProps) {
  const { width, height } = Dimensions.get('window');
  
  // Calculate the maximum grid size based on screen dimensions
  // Use a larger percentage of the screen for the grid
  const maxGridWidth = isFullScreen 
    ? Math.min(width * 0.95, height * 0.7) 
    : Math.min(width * 0.95, height * 0.6); // Increased from 0.92 to 0.95
  
  const cellSize = maxGridWidth / gridSize;
  const gridWidth = cellSize * gridSize;
  const padding = 6; // Slightly reduced padding
  
  // Handle edge cell press
  const handleEdgePress = (direction: Direction) => {
    if (onMove) {
      // Provide haptic feedback
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      onMove(direction);
    }
  };
  
  return (
    <View style={[
      styles.container, 
      { width: gridWidth + padding * 2 },
      isDarkMode && styles.darkContainer
    ]}>
      <View style={[
        styles.grid, 
        { width: gridWidth, height: gridWidth, padding }
      ]}>
        {/* Background cells */}
        {Array.from({ length: gridSize }).map((_, y) => (
          Array.from({ length: gridSize }).map((_, x) => (
            <Cell 
              key={`cell-${y}-${x}`} 
              size={cellSize - padding} 
              position={{ x, y }} 
              gridSize={gridSize}
              isDarkMode={isDarkMode}
              onEdgePress={handleEdgePress}
            />
          ))
        ))}
        
        {/* Obstacles */}
        {obstacles.map((obstacle, index) => (
          <ObstacleComponent
            key={`obstacle-${index}`}
            obstacle={obstacle}
            size={cellSize - padding}
            margin={padding / 2}
            gridSize={gridSize}
            isDarkMode={isDarkMode}
          />
        ))}
        
        {/* Tiles */}
        {grid.flat().map((tile, index) => (
          tile && (
            <TileComponent
              key={`tile-${tile.id || index}`}
              tile={tile}
              zIndex={10}
              size={cellSize - padding}
              margin={padding / 2}
              gridSize={gridSize}
              isDarkMode={isDarkMode}
            />
          )
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  grid: {
    position: 'relative',
    backgroundColor: COLORS.background,
    borderRadius: 4,
  },
});