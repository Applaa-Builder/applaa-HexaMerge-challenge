import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

interface ScoreBoardProps {
  score: number;
  bestScore: number;
  level: number;
  isCompact?: boolean;
  isDarkMode?: boolean;
}

export default function ScoreBoard({ 
  score, 
  bestScore, 
  level,
  isCompact = false,
  isDarkMode = false
}: ScoreBoardProps) {
  return (
    <View style={[
      styles.container,
      isCompact && styles.compactContainer
    ]}>
      <View style={[
        styles.scoreBox,
        isCompact && styles.compactScoreBox,
        isDarkMode && styles.darkScoreBox
      ]}>
        <Text style={[
          styles.scoreLabel,
          isCompact && styles.compactLabel,
          isDarkMode && styles.darkText
        ]}>SCORE</Text>
        <Text style={[
          styles.scoreValue,
          isCompact && styles.compactValue,
          isDarkMode && styles.darkText
        ]}>{score}</Text>
      </View>
      
      <View style={[
        styles.scoreBox,
        isCompact && styles.compactScoreBox,
        isDarkMode && styles.darkScoreBox
      ]}>
        <Text style={[
          styles.scoreLabel,
          isCompact && styles.compactLabel,
          isDarkMode && styles.darkText
        ]}>BEST</Text>
        <Text style={[
          styles.scoreValue,
          isCompact && styles.compactValue,
          isDarkMode && styles.darkText
        ]}>{bestScore}</Text>
      </View>
      
      <View style={[
        styles.scoreBox,
        isCompact && styles.compactScoreBox,
        isDarkMode && styles.darkScoreBox
      ]}>
        <Text style={[
          styles.scoreLabel,
          isCompact && styles.compactLabel,
          isDarkMode && styles.darkText
        ]}>LEVEL</Text>
        <Text style={[
          styles.scoreValue,
          isCompact && styles.compactValue,
          isDarkMode && styles.darkText
        ]}>{level + 1}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 16,
  },
  compactContainer: {
    flex: 1,
    marginVertical: 0,
  },
  scoreBox: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  compactScoreBox: {
    padding: 8,
    minWidth: 0,
    flex: 1,
    marginHorizontal: 4,
  },
  darkScoreBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
    opacity: 0.7,
  },
  compactLabel: {
    fontSize: 10,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 4,
  },
  compactValue: {
    fontSize: 16,
    marginTop: 2,
  },
  darkText: {
    color: COLORS.dark.text,
  },
});