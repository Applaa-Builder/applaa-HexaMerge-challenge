import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { RefreshCw, HelpCircle } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

interface GameControlsProps {
  onRestart: () => void;
  onShowTutorial: () => void;
  isFullScreen?: boolean;
  isDarkMode?: boolean;
}

export default function GameControls({ 
  onRestart, 
  onShowTutorial,
  isFullScreen = false,
  isDarkMode = false
}: GameControlsProps) {
  return (
    <View style={[
      styles.container,
      isFullScreen && styles.fullScreenContainer
    ]}>
      <TouchableOpacity
        style={[
          styles.button,
          isDarkMode && styles.darkButton
        ]}
        onPress={onRestart}
      >
        <RefreshCw size={20} color={isDarkMode ? COLORS.dark.primary : COLORS.primary} />
        <Text style={[
          styles.buttonText,
          isDarkMode && styles.darkButtonText
        ]}>Restart</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.button,
          isDarkMode && styles.darkButton
        ]}
        onPress={onShowTutorial}
      >
        <HelpCircle size={20} color={isDarkMode ? COLORS.dark.primary : COLORS.primary} />
        <Text style={[
          styles.buttonText,
          isDarkMode && styles.darkButtonText
        ]}>How to Play</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  fullScreenContainer: {
    marginTop: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  darkButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  buttonText: {
    marginLeft: 8,
    fontWeight: '600',
    color: COLORS.text,
  },
  darkButtonText: {
    color: COLORS.dark.text,
  },
});