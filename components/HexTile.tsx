import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
  withDelay,
  Easing
} from 'react-native-reanimated';
import { COLORS } from '@/constants/colors';
import { CELL_SIZE, ANIMATION_DURATION } from '@/constants/game';
import { Tile } from '@/types/game';
import { hexToPixel } from '@/utils/hexGrid';
import { Platform } from 'react-native';

interface HexTileProps {
  tile: Tile;
  zIndex: number;
}

export default function HexTile({ tile, zIndex }: HexTileProps) {
  const { value, position, isNew, mergedFrom } = tile;
  
  // Calculate pixel position from hex coordinates
  const { x, y } = hexToPixel(position, CELL_SIZE);
  
  // Animation values
  const scale = useSharedValue(isNew ? 0 : 1);
  const translateX = useSharedValue(x);
  const translateY = useSharedValue(y);
  
  // Update position when tile moves
  useEffect(() => {
    translateX.value = withTiming(x, {
      duration: ANIMATION_DURATION,
      easing: Easing.ease
    });
    translateY.value = withTiming(y, {
      duration: ANIMATION_DURATION,
      easing: Easing.ease
    });
  }, [x, y, translateX, translateY]);
  
  // Animate new tiles and merges
  useEffect(() => {
    if (isNew) {
      scale.value = withTiming(1, {
        duration: ANIMATION_DURATION,
        easing: Easing.elastic(1.2)
      });
    } else if (mergedFrom) {
      scale.value = withSequence(
        withTiming(1.1, {
          duration: ANIMATION_DURATION / 2,
          easing: Easing.ease
        }),
        withTiming(1, {
          duration: ANIMATION_DURATION / 2,
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
  // Use a default color if the value doesn't exist in the colors object
  const backgroundColor = value === 0 
    ? COLORS.background 
    : (COLORS.tile[value] || '#333');
  
  // Determine text color based on tile value
  const textColor = value <= 4 ? '#776e65' : '#f9f6f2';
  
  // Determine font size based on tile value length
  const fontSize = value < 100 ? 24 : value < 1000 ? 20 : 16;
  
  // Use regular View on web to avoid reanimated issues
  const TileComponent = Platform.OS === 'web' ? View : Animated.View;
  
  return (
    <TileComponent
      style={[
        styles.tile,
        { backgroundColor, zIndex },
        Platform.OS !== 'web' ? animatedStyle : {
          transform: [
            { translateX: x },
            { translateY: y },
            { scale: 1 }
          ]
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
    width: CELL_SIZE * 2,
    height: CELL_SIZE * Math.sqrt(3),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    // Hexagon shape using clip-path would be ideal, but not well supported
    // Instead, we use a rounded rectangle for better compatibility
  },
  value: {
    fontWeight: 'bold',
    textAlign: 'center',
  }
});