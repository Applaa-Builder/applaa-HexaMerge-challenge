import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useGameStore } from '@/store/gameStore';
import { AIPersona } from '@/types/game';
import { COLORS } from '@/constants/colors';
import { Brain, Zap, Dumbbell, Lightbulb, Cpu } from 'lucide-react-native';

interface AIPersonaSelectorProps {
  isDarkMode?: boolean;
}

export default function AIPersonaSelector({ isDarkMode = false }: AIPersonaSelectorProps) {
  const { aiState, setAIPersona } = useGameStore();
  
  const personas: { name: AIPersona; icon: React.ReactNode; description: string }[] = [
    { 
      name: 'Balanced Betty', 
      icon: <Brain size={16} color={isDarkMode ? COLORS.dark.primary : COLORS.primary} />,
      description: 'Balanced'
    },
    { 
      name: 'Aggressive Alex', 
      icon: <Zap size={16} color={isDarkMode ? COLORS.dark.primary : COLORS.primary} />,
      description: 'Risk taker'
    },
    { 
      name: 'Defensive Dana', 
      icon: <Dumbbell size={16} color={isDarkMode ? COLORS.dark.primary : COLORS.primary} />,
      description: 'Stable'
    },
    { 
      name: 'Strategic Sam', 
      icon: <Lightbulb size={16} color={isDarkMode ? COLORS.dark.primary : COLORS.primary} />,
      description: 'Planner'
    },
    { 
      name: 'Random Randy', 
      icon: <Cpu size={16} color={isDarkMode ? COLORS.dark.primary : COLORS.primary} />,
      description: 'Unpredictable'
    }
  ];
  
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {personas.map((persona) => (
          <TouchableOpacity
            key={persona.name}
            style={[
              styles.personaButton,
              aiState.persona === persona.name && styles.selectedPersona,
              isDarkMode && styles.darkPersonaButton,
              aiState.persona === persona.name && isDarkMode && styles.darkSelectedPersona
            ]}
            onPress={() => setAIPersona(persona.name)}
          >
            {persona.icon}
            <Text style={[
              styles.personaName,
              aiState.persona === persona.name && styles.selectedPersonaText,
              isDarkMode && styles.darkText,
              aiState.persona === persona.name && isDarkMode && styles.darkSelectedPersonaText
            ]}>
              {persona.name.split(' ')[0]}
            </Text>
            <Text style={[
              styles.personaDescription,
              isDarkMode && styles.darkSubtext
            ]}>
              {persona.description}
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
  personaButton: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 6,
    alignItems: 'center',
    width: 80,
  },
  darkPersonaButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  selectedPersona: {
    backgroundColor: COLORS.primary,
  },
  darkSelectedPersona: {
    backgroundColor: COLORS.dark.primary,
  },
  personaName: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 4,
    color: COLORS.text,
    textAlign: 'center',
  },
  selectedPersonaText: {
    color: 'white',
  },
  darkSelectedPersonaText: {
    color: 'white',
  },
  personaDescription: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.6)',
    marginTop: 2,
    textAlign: 'center',
  },
  darkText: {
    color: COLORS.dark.text,
  },
  darkSubtext: {
    color: 'rgba(255,255,255,0.7)',
  },
});