import React from 'react';
import { Tabs } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useGameStore } from '@/store/gameStore';
import AdManager from '@/components/ads/AdManager';

export default function TabLayout() {
  const { isDarkMode } = useGameStore();
  
  return (
    <AdManager>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: isDarkMode ? COLORS.dark.primary : COLORS.primary,
          tabBarInactiveTintColor: isDarkMode ? COLORS.dark.controls.inactive : COLORS.controls.inactive,
          tabBarStyle: {
            backgroundColor: isDarkMode ? COLORS.dark.background : COLORS.background,
            borderTopColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          },
          headerStyle: {
            backgroundColor: isDarkMode ? COLORS.dark.background : COLORS.background,
          },
          headerTintColor: isDarkMode ? COLORS.dark.text : COLORS.text,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Obstacle 2048",
            tabBarLabel: "Game",
            headerShown: false,
          }}
        />
      </Tabs>
    </AdManager>
  );
}