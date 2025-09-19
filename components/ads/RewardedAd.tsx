import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  Animated,
  ActivityIndicator
} from 'react-native';
import { COLORS } from '@/constants/colors';
import { X, Play, Gift } from 'lucide-react-native';

interface RewardedAdProps {
  visible: boolean;
  onClose: () => void;
  onReward: (reward: { type: string, amount: number }) => void;
  rewardType?: 'coins' | 'lives' | 'hints';
  rewardAmount?: number;
  isDarkMode?: boolean;
}

const { width, height } = Dimensions.get('window');

export default function RewardedAd({ 
  visible, 
  onClose, 
  onReward,
  rewardType = 'lives',
  rewardAmount = 1,
  isDarkMode = false
}: RewardedAdProps) {
  const [stage, setStage] = useState<'intro' | 'loading' | 'watching' | 'reward'>('intro');
  const [progress, setProgress] = useState(0);
  const [adWatched, setAdWatched] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setStage('intro');
      setProgress(0);
      setAdWatched(false);
      progressAnim.setValue(0);
    }
  }, [visible]);
  
  // Handle progress animation
  useEffect(() => {
    if (stage === 'watching') {
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 15000, // 15 seconds to watch the "ad"
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          setAdWatched(true);
          setStage('reward');
        }
      });
      
      // Update progress state for UI
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / 150); // 100% over 15 seconds in 100ms intervals
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 100);
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [stage]);
  
  // Handle start watching
  const handleStartWatching = () => {
    setStage('loading');
    
    // Simulate ad loading
    setTimeout(() => {
      setStage('watching');
    }, 1500);
  };
  
  // Handle claim reward
  const handleClaimReward = () => {
    onReward({ type: rewardType, amount: rewardAmount });
    onClose();
  };
  
  // Handle close
  const handleClose = () => {
    if (stage === 'watching' && progress < 100) {
      // If user tries to close during ad, show warning
      // In a real app, you might want to show a confirmation dialog
      return;
    }
    
    onClose();
  };
  
  // Get reward text based on type and amount
  const getRewardText = () => {
    switch (rewardType) {
      case 'coins':
        return `${rewardAmount} Coins`;
      case 'lives':
        return `${rewardAmount} Extra ${rewardAmount === 1 ? 'Life' : 'Lives'}`;
      case 'hints':
        return `${rewardAmount} ${rewardAmount === 1 ? 'Hint' : 'Hints'}`;
      default:
        return `${rewardAmount} Reward`;
    }
  };
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={[
        styles.container,
        isDarkMode && styles.darkContainer
      ]}>
        <View style={[
          styles.adContainer,
          isDarkMode && styles.darkAdContainer
        ]}>
          {/* Intro Stage */}
          {stage === 'intro' && (
            <View style={styles.stageContainer}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleClose}
              >
                <X size={20} color={isDarkMode ? "#FFFFFF" : "#000000"} />
              </TouchableOpacity>
              
              <Image 
                source={{ uri: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=400&auto=format" }} 
                style={styles.introImage} 
                resizeMode="cover"
              />
              
              <View style={styles.introContent}>
                <Gift size={40} color={COLORS.primary} style={styles.giftIcon} />
                
                <Text style={[
                  styles.introTitle,
                  isDarkMode && styles.darkText
                ]}>
                  Watch an ad to get {getRewardText()}
                </Text>
                
                <Text style={[
                  styles.introDescription,
                  isDarkMode && styles.darkSubText
                ]}>
                  Complete watching the entire ad to claim your reward.
                </Text>
                
                <TouchableOpacity 
                  style={styles.watchButton}
                  onPress={handleStartWatching}
                >
                  <Play size={20} color="#FFFFFF" style={styles.watchIcon} />
                  <Text style={styles.watchButtonText}>Watch Ad</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {/* Loading Stage */}
          {stage === 'loading' && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={[
                styles.loadingText,
                isDarkMode && styles.darkText
              ]}>
                Loading Ad...
              </Text>
            </View>
          )}
          
          {/* Watching Stage */}
          {stage === 'watching' && (
            <View style={styles.watchingContainer}>
              <View style={styles.adHeader}>
                <View style={styles.adLabelContainer}>
                  <Text style={styles.adLabel}>ADVERTISEMENT</Text>
                </View>
                
                <View style={styles.progressTextContainer}>
                  <Text style={styles.progressText}>{Math.round(progress)}%</Text>
                </View>
              </View>
              
              <Image 
                source={{ uri: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=400&auto=format" }} 
                style={styles.adImage} 
                resizeMode="cover"
              />
              
              <View style={styles.progressBarContainer}>
                <Animated.View 
                  style={[
                    styles.progressBar,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%']
                      })
                    }
                  ]}
                />
              </View>
              
              <View style={styles.adContent}>
                <Text style={[
                  styles.adTitle,
                  isDarkMode && styles.darkText
                ]}>
                  Puzzle Masters Challenge
                </Text>
                
                <Text style={[
                  styles.adDescription,
                  isDarkMode && styles.darkSubText
                ]}>
                  Train your brain with challenging puzzles! Download now and get 500 free coins.
                </Text>
              </View>
            </View>
          )}
          
          {/* Reward Stage */}
          {stage === 'reward' && (
            <View style={styles.rewardContainer}>
              <Image 
                source={{ uri: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=400&auto=format" }} 
                style={styles.rewardImage} 
                resizeMode="cover"
              />
              
              <View style={styles.rewardContent}>
                <Text style={[
                  styles.rewardTitle,
                  isDarkMode && styles.darkText
                ]}>
                  Congratulations!
                </Text>
                
                <Text style={[
                  styles.rewardDescription,
                  isDarkMode && styles.darkSubText
                ]}>
                  You've earned {getRewardText()} for watching the ad.
                </Text>
                
                <TouchableOpacity 
                  style={styles.claimButton}
                  onPress={handleClaimReward}
                >
                  <Text style={styles.claimButtonText}>Claim Reward</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkContainer: {
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  adContainer: {
    width: width * 0.9,
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  darkAdContainer: {
    backgroundColor: '#263238',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  // Intro Stage
  stageContainer: {
    width: '100%',
  },
  introImage: {
    width: '100%',
    height: 150,
  },
  introContent: {
    padding: 20,
    alignItems: 'center',
  },
  giftIcon: {
    marginBottom: 16,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  introDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  watchButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  watchIcon: {
    marginRight: 8,
  },
  watchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Loading Stage
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
  },
  // Watching Stage
  watchingContainer: {
    width: '100%',
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  adLabelContainer: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  adLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666',
  },
  progressTextContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  adImage: {
    width: '100%',
    height: 200,
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: '#E0E0E0',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  adContent: {
    padding: 16,
  },
  adTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  adDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  // Reward Stage
  rewardContainer: {
    width: '100%',
  },
  rewardImage: {
    width: '100%',
    height: 180,
  },
  rewardContent: {
    padding: 20,
    alignItems: 'center',
  },
  rewardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  rewardDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  claimButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  claimButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Dark mode text styles
  darkText: {
    color: '#FFFFFF',
  },
  darkSubText: {
    color: '#B0BEC5',
  },
});