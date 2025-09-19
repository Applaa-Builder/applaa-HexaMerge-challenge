import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useGameStore } from '@/store/gameStore';
import { LEVELS } from '@/constants/game';
import { COLORS } from '@/constants/colors';

interface LevelSelectorProps {
  isDarkMode?: boolean;
}

export default function LevelSelector({ isDarkMode = false }: LevelSelectorProps) {
  const { level, setLevel } = useGameStore();
  
  // Map level difficulty based on index
  const getDifficulty = (index: number) => {
    if (index === 0) return 'Easy';
    if (index === 1) return 'Medium';
    if (index === 2) return 'Medium';
    if (index === 3) return 'Hard';
    return 'Expert';
  };
  
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {LEVELS.map((levelData, index) => (
          <TouchableOpacity
            key={`level-${index}`}
            style={[
              styles.levelButton,
              level === index && styles.selectedLevel,
              isDarkMode && styles.darkLevelButton,
              level === index && isDarkMode && styles.darkSelectedLevel
            ]}
            onPress={() => setLevel(index)}
          >
            <Text style={[
              styles.levelNumber,
              level === index && styles.selectedLevelText,
              isDarkMode && styles.darkText,
              level === index && isDarkMode && styles.darkSelectedLevelText
            ]}>
              {index + 1}
            </Text>
            <Text style={[
              styles.levelDifficulty,
              isDarkMode && styles.darkSubtext
            ]}>
              {getDifficulty(index)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  scrollContent: {
    paddingVertical: 8,
  },
  levelButton: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 6,
    alignItems: 'center',
    width: 70,
  },
  darkLevelButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  selectedLevel: {
    backgroundColor: COLORS.primary,
  },
  darkSelectedLevel: {
    backgroundColor: COLORS.dark.primary,
  },
  levelNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  selectedLevelText: {
    color: 'white',
  },
  darkSelectedLevelText: {
    color: 'white',
  },
  levelDifficulty: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.6)',
    marginTop: 2,
  },
  darkText: {
    color: COLORS.dark.text,
  },
  darkSubtext: {
    color: 'rgba(255,255,255,0.7)',
  },
});