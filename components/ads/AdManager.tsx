import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import InterstitialAd from './InterstitialAd';
import RewardedAd from './RewardedAd';
import { useGameStore } from '@/store/gameStore';

interface AdManagerProps {
  children: React.ReactNode;
}

export default function AdManager({ children }: AdManagerProps) {
  const { 
    adConfig, 
    updateAdConfig, 
    extraLives, 
    addExtraLives,
    isDarkMode
  } = useGameStore();
  
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [showRewarded, setShowRewarded] = useState(false);
  const [rewardType, setRewardType] = useState<'coins' | 'lives' | 'hints'>('lives');
  const [rewardAmount, setRewardAmount] = useState(1);
  const [rewardCallback, setRewardCallback] = useState<(() => void) | null>(null);
  
  // Check if we should show an interstitial ad
  const shouldShowInterstitial = () => {
    if (!adConfig.interstitialEnabled) return false;
    
    // Check if we've shown an ad recently
    if (adConfig.lastAdShown) {
      const lastShown = new Date(adConfig.lastAdShown).getTime();
      const now = new Date().getTime();
      const timeSinceLastAd = now - lastShown;
      
      // Don't show ads more frequently than every 2 minutes
      if (timeSinceLastAd < 2 * 60 * 1000) {
        return false;
      }
    }
    
    // Check if we've reached the frequency threshold
    if (adConfig.gamesPlayed % adConfig.interstitialFrequency === 0) {
      return true;
    }
    
    return false;
  };
  
  // Show interstitial ad
  const showInterstitialAd = () => {
    if (shouldShowInterstitial()) {
      setShowInterstitial(true);
      updateAdConfig({
        ...adConfig,
        lastAdShown: new Date().toISOString()
      });
    }
  };
  
  // Show rewarded ad
  const showRewardedAd = (
    type: 'coins' | 'lives' | 'hints' = 'lives', 
    amount: number = 1,
    callback?: () => void
  ) => {
    if (!adConfig.rewardedAvailable) {
      Alert.alert(
        "Ads Not Available",
        "Rewarded ads are currently not available. Please try again later."
      );
      return;
    }
    
    setRewardType(type);
    setRewardAmount(amount);
    if (callback) setRewardCallback(() => callback);
    setShowRewarded(true);
  };
  
  // Handle rewarded ad completion
  const handleReward = (reward: { type: string, amount: number }) => {
    // Process the reward
    switch (reward.type) {
      case 'lives':
        addExtraLives(reward.amount);
        Alert.alert(
          "Reward Claimed!",
          `You've received ${reward.amount} extra ${reward.amount === 1 ? 'life' : 'lives'}!`
        );
        break;
      case 'coins':
        // Handle coins reward
        Alert.alert(
          "Reward Claimed!",
          `You've received ${reward.amount} coins!`
        );
        break;
      case 'hints':
        // Handle hints reward
        Alert.alert(
          "Reward Claimed!",
          `You've received ${reward.amount} ${reward.amount === 1 ? 'hint' : 'hints'}!`
        );
        break;
    }
    
    // Call the callback if provided
    if (rewardCallback) {
      rewardCallback();
      setRewardCallback(null);
    }
  };
  
  // Expose ad methods to other components
  React.useEffect(() => {
    // @ts-ignore - Add methods to global object for easy access
    if (typeof global !== 'undefined') {
      // @ts-ignore
      global.adManager = {
        showInterstitial: showInterstitialAd,
        showRewarded: showRewardedAd
      };
    }
  }, [adConfig]);
  
  return (
    <View style={styles.container}>
      {children}
      
      {/* Interstitial Ad */}
      <InterstitialAd
        visible={showInterstitial}
        onClose={() => setShowInterstitial(false)}
        isDarkMode={isDarkMode}
      />
      
      {/* Rewarded Ad */}
      <RewardedAd
        visible={showRewarded}
        onClose={() => setShowRewarded(false)}
        onReward={handleReward}
        rewardType={rewardType}
        rewardAmount={rewardAmount}
        isDarkMode={isDarkMode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});