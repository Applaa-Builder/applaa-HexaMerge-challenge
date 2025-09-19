import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Obstacle } from '@/types/game';
import { COLORS } from '@/constants/colors';
import { X, Zap } from 'lucide-react-native';

interface ObstacleProps {
  obstacle: Obstacle;
  size: number;
  margin: number;
  gridSize: number;
  isDarkMode?: boolean;
}

export default function ObstacleComponent({ 
  obstacle, 
  size, 
  margin, 
  gridSize,
  isDarkMode = false 
}: ObstacleProps) {
  const { type, position } = obstacle;
  
  // Calculate position based on grid coordinates
  const left = position.x * (size + margin * 2) + margin;
  const top = position.y * (size + margin * 2) + margin;
  
  // Determine the appearance based on the obstacle type
  let backgroundColor;
  let icon;
  
  switch (type) {
    case 'wall':
      backgroundColor = isDarkMode && COLORS.dark.obstacle 
        ? COLORS.dark.obstacle.wall 
        : COLORS.obstacle.wall;
      icon = <X size={size * 0.4} color="white" />;
      break;
    case 'multiplier':
      backgroundColor = isDarkMode && COLORS.dark.obstacle 
        ? COLORS.dark.obstacle.multiplier 
        : COLORS.obstacle.multiplier;
      icon = <Zap size={size * 0.4} color="white" />;
      break;
    case 'portal':
      backgroundColor = isDarkMode && COLORS.dark.obstacle 
        ? COLORS.dark.obstacle.portal 
        : COLORS.obstacle.portal;
      icon = <Text style={styles.portalText}>P</Text>;
      break;
    default:
      backgroundColor = '#888';
      icon = null;
  }
  
  return (
    <View
      style={[
        styles.obstacle,
        { 
          backgroundColor, 
          width: size,
          height: size,
          left,
          top,
        }
      ]}
    >
      {icon}
    </View>
  );
}

const styles = StyleSheet.create({
  obstacle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    zIndex: 5,
  },
  portalText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  }
});