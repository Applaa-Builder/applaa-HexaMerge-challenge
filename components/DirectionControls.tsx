import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { ArrowUp, ArrowRight, ArrowDown, ArrowLeft } from 'lucide-react-native';
import { Direction } from '@/types/game';
import { COLORS } from '@/constants/colors';
import * as Haptics from 'expo-haptics';

interface DirectionControlsProps {
  onMove: (direction: Direction) => void;
  isFullScreen?: boolean;
  isDarkMode?: boolean;
}

export default function DirectionControls({ 
  onMove, 
  isFullScreen = false,
  isDarkMode = false
}: DirectionControlsProps) {
  const { width, height } = Dimensions.get('window');
  
  // Adjust button size based on screen size and mode
  const buttonSize = isFullScreen 
    ? Math.min(width, height) * 0.13 
    : Math.min(width, height) * 0.11;
  
  const iconSize = buttonSize * 0.5;
  
  const handlePress = (direction: Direction) => {
    // Provide haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Call the onMove function with the direction
    onMove(direction);
  };
  
  return (
    <View style={[
      styles.container,
      isFullScreen && styles.fullScreenContainer
    ]}>
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={[
            styles.button,
            { width: buttonSize, height: buttonSize },
            isDarkMode && styles.darkButton
          ]}
          onPress={() => handlePress('up')}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowUp size={iconSize} color={isDarkMode ? COLORS.dark.primary : COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={[
            styles.button,
            { width: buttonSize, height: buttonSize },
            isDarkMode && styles.darkButton
          ]}
          onPress={() => handlePress('left')}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={iconSize} color={isDarkMode ? COLORS.dark.primary : COLORS.primary} />
        </TouchableOpacity>
        
        <View style={{ width: buttonSize }} />
        
        <TouchableOpacity
          style={[
            styles.button,
            { width: buttonSize, height: buttonSize },
            isDarkMode && styles.darkButton
          ]}
          onPress={() => handlePress('right')}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowRight size={iconSize} color={isDarkMode ? COLORS.dark.primary : COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={[
            styles.button,
            { width: buttonSize, height: buttonSize },
            isDarkMode && styles.darkButton
          ]}
          onPress={() => handlePress('down')}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowDown size={iconSize} color={isDarkMode ? COLORS.dark.primary : COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
    zIndex: 10, // Ensure buttons are above other elements
  },
  fullScreenContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  darkButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});