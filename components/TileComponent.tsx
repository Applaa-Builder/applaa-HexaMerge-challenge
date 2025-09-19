import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
  withDelay,
  Easing
} from 'react-native-reanimated';
import { COLORS } from '@/constants/colors';
import { Tile } from '@/types/game';

interface TileProps {
  tile: Tile;
  zIndex: number;
  gridSize: number;
  size: number;
  margin: number;
  isDarkMode?: boolean;
}

export default function TileComponent({ 
  tile, 
  zIndex, 
  gridSize, 
  size, 
  margin,
  isDarkMode = false 
}: TileProps) {
  const { value, position, isNew, mergedFrom } = tile;
  
  // Calculate position based on grid coordinates
  const left = position.x * (size + margin * 2) + margin;
  const top = position.y * (size + margin * 2) + margin;
  
  // Animation values
  const scale = useSharedValue(isNew ? 0 : 1);
  const translateX = useSharedValue(left);
  const translateY = useSharedValue(top);
  
  // Update position when tile moves
  useEffect(() => {
    translateX.value = withTiming(left, {
      duration: 200, // Animation duration
      easing: Easing.ease
    });
    translateY.value = withTiming(top, {
      duration: 200, // Animation duration
      easing: Easing.ease
    });
  }, [left, top, translateX, translateY]);
  
  // Animate new tiles and merges
  useEffect(() => {
    if (isNew) {
      scale.value = withTiming(1, {
        duration: 200, // Animation duration
        easing: Easing.elastic(1.2)
      });
    } else if (mergedFrom) {
      scale.value = withSequence(
        withTiming(1.1, {
          duration: 100, // Animation duration
          easing: Easing.ease
        }),
        withTiming(1, {
          duration: 100, // Animation duration
          easing: Easing.ease
        })
      );
    }
  }, [isNew, mergedFrom, scale]);
  
  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value }
      ]
    };
  });
  
  // Get background color based on tile value
  let backgroundColor;
  
  // Check if the value exists as a key in COLORS.tile
  // Use type assertion to handle the numeric key
  if (value in COLORS.tile) {
    backgroundColor = COLORS.tile[value as keyof typeof COLORS.tile];
  } else {
    backgroundColor = '#333'; // Default color if value not found
  }
  
  // Determine text color based on tile value
  const textColor = value <= 8 ? COLORS.text : '#FFFFFF';
  
  // Determine font size based on tile value length and tile size
  const fontSize = value < 100 ? size * 0.37 : value < 1000 ? size * 0.31 : value < 10000 ? size * 0.26 : size * 0.2;
  
  // Use regular View on web to avoid reanimated issues
  const TileComponent = Platform.OS === 'web' ? View : Animated.View;
  
  return (
    <TileComponent
      style={[
        styles.tile,
        { 
          backgroundColor, 
          zIndex,
          width: size,
          height: size,
        },
        Platform.OS !== 'web' ? animatedStyle : {
          position: 'absolute',
          left,
          top,
        }
      ]}
    >
      <Text style={[styles.value, { color: textColor, fontSize }]}>
        {value > 0 ? value : ''}
      </Text>
    </TileComponent>
  );
}

const styles = StyleSheet.create({
  tile: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  value: {
    fontWeight: 'bold',
    textAlign: 'center',
  }
});