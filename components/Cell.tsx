import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react-native';

interface CellProps {
  size: number;
  position: { x: number; y: number };
  gridSize: number;
  isDarkMode?: boolean;
  onEdgePress?: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export default function Cell({ 
  size, 
  position, 
  gridSize, 
  isDarkMode = false,
  onEdgePress
}: CellProps) {
  // Calculate position based on grid coordinates
  const left = position.x * (size + 2 * 4) + 4; // 4 is the margin
  const top = position.y * (size + 2 * 4) + 4;
  
  // Determine if this is an edge cell
  const isFirstRow = position.y === 0;
  const isLastRow = position.y === gridSize - 1;
  const isFirstCol = position.x === 0;
  const isLastCol = position.x === gridSize - 1;
  const isEdgeCell = isFirstRow || isLastRow || isFirstCol || isLastCol;
  
  // Determine direction based on position
  let direction: 'up' | 'down' | 'left' | 'right' | null = null;
  let DirectionIcon = null;
  let iconSize = size * 0.3;
  
  if (isFirstRow) {
    direction = 'up';
    DirectionIcon = ArrowUp;
  } else if (isLastRow) {
    direction = 'down';
    DirectionIcon = ArrowDown;
  } else if (isFirstCol) {
    direction = 'left';
    DirectionIcon = ArrowLeft;
  } else if (isLastCol) {
    direction = 'right';
    DirectionIcon = ArrowRight;
  }
  
  // Handle press on edge cells
  const handlePress = () => {
    if (isEdgeCell && direction && onEdgePress) {
      onEdgePress(direction);
    }
  };
  
  const cellContent = (
    <View
      style={[
        styles.cell,
        {
          width: size,
          height: size,
          backgroundColor: isDarkMode 
            ? isEdgeCell 
              ? 'rgba(255,255,255,0.15)' 
              : 'rgba(255,255,255,0.1)' 
            : isEdgeCell 
              ? 'rgba(0,0,0,0.08)' 
              : COLORS.grid.cell,
        }
      ]}
    >
      {isEdgeCell && DirectionIcon && (
        <DirectionIcon 
          size={iconSize} 
          color={isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)'} 
          style={styles.directionIcon}
        />
      )}
    </View>
  );
  
  if (isEdgeCell && onEdgePress) {
    return (
      <TouchableOpacity
        style={[styles.cellContainer, { left, top }]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {cellContent}
      </TouchableOpacity>
    );
  }
  
  return (
    <View style={[styles.cellContainer, { left, top }]}>
      {cellContent}
    </View>
  );
}

const styles = StyleSheet.create({
  cellContainer: {
    position: 'absolute',
  },
  cell: {
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  directionIcon: {
    opacity: 0.6,
  }
});