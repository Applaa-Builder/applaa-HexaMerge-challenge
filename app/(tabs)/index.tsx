import React, { useEffect, useState, useCallback, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions, 
  StatusBar, 
  Platform,
  ScrollView,
  Share,
  PanResponder,
  Animated,
  AppState,
  Alert,
  Modal
} from 'react-native';
import { useGameStore } from '@/store/gameStore';
import Grid from '@/components/Grid';
import ScoreBoard from '@/components/ScoreBoard';
import GameControls from '@/components/GameControls';
import AIPersonaSelector from '@/components/AIPersonaSelector';
import LevelSelector from '@/components/LevelSelector';
import WinModal from '@/components/modals/WinModal';
import LoseModal from '@/components/modals/LoseModal';
import TutorialModal from '@/components/modals/TutorialModal';
import ShareModal from '@/components/modals/ShareModal';
import AdBanner from '@/components/AdBanner';
import { COLORS } from '@/constants/colors';
import { LEVELS } from '@/constants/game';
import { X, Trophy, Star, Share2, Settings, Info, Gift } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Direction } from '@/types/game';
import * as Haptics from 'expo-haptics';
import * as StoreReview from 'expo-store-review';
import * as Updates from 'expo-updates';
import * as Notifications from 'expo-notifications';
import { useFocusEffect } from '@react-navigation/native';
import { storage } from '@/utils/storage';

const { width, height } = Dimensions.get('window');

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function GameScreen() {
  const router = useRouter();
  const { 
    grid, 
    obstacles,
    score, 
    bestScore, 
    status, 
    initializeGame,
    won,
    over,
    level,
    gridSize,
    continueGame,
    setLevel,
    restartGame,
    move,
    aiState,
    saveGameState,
    loadGameState,
    setDarkMode,
    isDarkMode,
    adConfig,
    updateAdConfig,
    extraLives,
    useExtraLife
  } = useGameStore();

  const [winModalVisible, setWinModalVisible] = useState(false);
  const [loseModalVisible, setLoseModalVisible] = useState(false);
  const [tutorialModalVisible, setTutorialModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [gamePlayTime, setGamePlayTime] = useState(0);
  const [showRatingPrompt, setShowRatingPrompt] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementMessage, setAchievementMessage] = useState('');
  const [isProcessingMove, setIsProcessingMove] = useState(false);
  const [showAdBanner, setShowAdBanner] = useState(true);
  const [showRewardedAdButton, setShowRewardedAdButton] = useState(false);
  
  const gameTimer = useRef<NodeJS.Timeout | null>(null);
  const achievementAnim = useRef(new Animated.Value(0)).current;
  const appState = useRef(AppState.currentState);
  
  // Create tables on first load
  useEffect(() => {
    // Tables are automatically created when storage is initialized
  }, []);
  
  // Check for updates when the app starts
  useEffect(() => {
    const checkForUpdates = async () => {
      if (Platform.OS !== 'web') {
        try {
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            setShowUpdateBanner(true);
          }
        } catch (error) {
          console.log('Error checking for updates:', error);
        }
      }
    };
    
    checkForUpdates();
  }, []);
  
  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        // App is going to background, save the game state
        saveGameState();
        
        // Stop the game timer
        if (gameTimer.current) {
          clearInterval(gameTimer.current);
          gameTimer.current = null;
        }
      } else if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App is coming to foreground, load the game state
        loadGameState();
        
        // Restart the game timer if game is in progress
        if (status === 'playing' && !over && !won) {
          startGameTimer();
        }
      }
      
      appState.current = nextAppState;
    });
    
    return () => {
      subscription.remove();
    };
  }, [status, over, won]);
  
  // Initialize the game when the component mounts
  useEffect(() => {
    if (status === 'idle') {
      initializeGame();
    }
  }, [status, initializeGame]);
  
  // Show win modal when player wins
  useEffect(() => {
    if (won && !over) {
      setWinModalVisible(true);
      
      // Save the completed level to storage
      storage.saveGameSession({
        level,
        score,
        date: new Date().toISOString(),
        completed: true
      });
      
      // Check if this is a good time to show the rating prompt
      if (level >= 2 && !showRatingPrompt) {
        checkAndShowRatingPrompt();
      }
      
      // Stop the game timer
      if (gameTimer.current) {
        clearInterval(gameTimer.current);
        gameTimer.current = null;
      }
      
      // Trigger haptic feedback
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Show interstitial ad after winning (if conditions are met)
      if (adConfig.interstitialEnabled && adConfig.gamesPlayed % adConfig.interstitialFrequency === 0) {
        // @ts-ignore - Access global adManager
        if (global.adManager) {
          // @ts-ignore
          global.adManager.showInterstitial();
        }
      }
      
      // Update ad config
      updateAdConfig({
        ...adConfig,
        gamesPlayed: adConfig.gamesPlayed + 1
      });
    }
  }, [won, over]);
  
  // Show lose modal when game is over
  useEffect(() => {
    if (over && !won) {
      setLoseModalVisible(true);
      
      // Save the failed level to storage
      storage.saveGameSession({
        level,
        score,
        date: new Date().toISOString(),
        completed: false
      });
      
      // Stop the game timer
      if (gameTimer.current) {
        clearInterval(gameTimer.current);
        gameTimer.current = null;
      }
      
      // Trigger haptic feedback
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      
      // Show rewarded ad button if player has no extra lives
      if (extraLives === 0) {
        setShowRewardedAdButton(true);
      }
      
      // Update ad config
      updateAdConfig({
        ...adConfig,
        gamesPlayed: adConfig.gamesPlayed + 1
      });
    }
  }, [over, won]);
  
  // Hide tab bar when in full screen mode
  useEffect(() => {
    if (Platform.OS !== 'web') {
      StatusBar.setHidden(isFullScreen);
    }
  }, [isFullScreen]);
  
  // Start the game timer when the game is in progress
  const startGameTimer = useCallback(() => {
    if (gameTimer.current) {
      clearInterval(gameTimer.current);
    }
    
    gameTimer.current = setInterval(() => {
      setGamePlayTime(prev => prev + 1);
    }, 1000);
    
    return () => {
      if (gameTimer.current) {
        clearInterval(gameTimer.current);
        gameTimer.current = null;
      }
    };
  }, []);
  
  // Start the game timer when the game is in progress
  useEffect(() => {
    if (status === 'playing' && !over && !won) {
      startGameTimer();
    }
    
    return () => {
      if (gameTimer.current) {
        clearInterval(gameTimer.current);
        gameTimer.current = null;
      }
    };
  }, [status, over, won, startGameTimer]);
  
  // Check for achievements based on score and level
  useEffect(() => {
    // Only check for achievements during active gameplay
    if (status !== 'playing' || over || won) return;
    
    // Achievement thresholds
    const scoreAchievements = [
      { score: 1000, message: "Score Novice! 🎮" },
      { score: 5000, message: "Score Apprentice! 🏆" },
      { score: 10000, message: "Score Master! 👑" }
    ];
    
    // Check score achievements
    for (const achievement of scoreAchievements) {
      if (score >= achievement.score && bestScore < achievement.score) {
        unlockAchievement(achievement.message);
        break;
      }
    }
    
    // Check for tile value achievements
    const highestTile = grid.flat().reduce((max, tile) => 
      tile ? Math.max(max, tile.value) : max, 0);
    
    if (highestTile >= 1024) {
      unlockAchievement("1024 Tile Achieved! 🚀");
    } else if (highestTile >= 512) {
      unlockAchievement("512 Tile Achieved! 🔥");
    } else if (highestTile >= 256) {
      unlockAchievement("256 Tile Achieved! ✨");
    }
    
  }, [score, grid, status, over, won, bestScore]);
  
  // Function to unlock and display achievements
  const unlockAchievement = useCallback((message: string) => {
    setAchievementMessage(message);
    setShowAchievement(true);
    
    // Save achievement to storage
    storage.saveAchievement({
      title: message,
      description: "You've reached a new milestone!",
      date: new Date().toISOString(),
      unlocked: true
    });
    
    // Animate achievement notification
    achievementAnim.setValue(0);
    Animated.sequence([
      Animated.timing(achievementAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.delay(2000),
      Animated.timing(achievementAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      })
    ]).start(() => {
      setShowAchievement(false);
    });
    
    // Trigger haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Schedule a local notification for later
    scheduleAchievementReminder(message);
    
  }, [achievementAnim]);
  
  // Schedule a reminder notification
  const scheduleAchievementReminder = async (achievement: string) => {
    if (Platform.OS === 'web') return;
    
    try {
      const { status } = await Notifications.getPermissionsAsync();
      
      if (status !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          return;
        }
      }
      
      // Schedule notification for 24 hours later
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Remember your achievement!',
          body: `You unlocked "${achievement}" - Can you beat your score today?`,
          data: { level, score },
        },
        trigger: { 
          seconds: 60 * 60 * 24,
          channelId: 'achievements'
        },
      });
    } catch (error) {
      console.log('Error scheduling notification:', error);
    }
  };
  
  // Check if we should show the rating prompt
  const checkAndShowRatingPrompt = async () => {
    try {
      // Get the number of completed levels
      const sessions = await storage.getGameSessions();
      const completedLevels = sessions.filter(session => session.completed).length;
      
      // Show rating prompt after completing 3 levels
      if (completedLevels >= 3 && Platform.OS !== 'web') {
        // Check if the device can review
        const available = await StoreReview.isAvailableAsync();
        if (available) {
          setShowRatingPrompt(true);
        }
      }
    } catch (error) {
      console.log('Error checking for rating prompt:', error);
    }
  };
  
  // Handle the rating prompt
  const handleRatingPrompt = async () => {
    setShowRatingPrompt(false);
    
    if (Platform.OS !== 'web') {
      try {
        await StoreReview.requestReview();
      } catch (error) {
        console.log('Error requesting review:', error);
      }
    }
  };
  
  // Download and apply the update
  const handleUpdate = async () => {
    if (Platform.OS !== 'web') {
      try {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      } catch (error) {
        console.log('Error updating app:', error);
        Alert.alert('Update Failed', 'Please try again later or check your internet connection.');
      }
    }
  };
  
  // Handle swipe gesture for the game
  const handleSwipe = useCallback((direction: Direction) => {
    // Prevent multiple moves being processed at once
    if (isProcessingMove) return;
    
    setIsProcessingMove(true);
    
    // Provide haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Process the move
    move(direction);
    
    // Reset the processing flag after a short delay
    setTimeout(() => {
      setIsProcessingMove(false);
    }, 200);
  }, [move, isProcessingMove]);

  // Set up swipe gesture handling
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to deliberate swipes, not small movements
        const { dx, dy } = gestureState;
        return Math.abs(dx) > 10 || Math.abs(dy) > 10;
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        const dragDistance = Math.sqrt(dx * dx + dy * dy);
        
        // Only register as a swipe if the distance is significant
        if (dragDistance < 20) return;
        
        // Determine the direction of the swipe
        if (Math.abs(dx) > Math.abs(dy)) {
          // Horizontal swipe
          if (dx > 0) {
            handleSwipe('right');
          } else {
            handleSwipe('left');
          }
        } else {
          // Vertical swipe
          if (dy > 0) {
            handleSwipe('down');
          } else {
            handleSwipe('up');
          }
        }
      }
    })
  ).current;

  // Handle direction press from grid edge cells
  const handleDirectionPress = useCallback((direction: Direction) => {
    // Prevent multiple moves being processed at once
    if (isProcessingMove) return;
    
    setIsProcessingMove(true);
    
    // Process the move
    move(direction);
    
    // Reset the processing flag after a short delay
    setTimeout(() => {
      setIsProcessingMove(false);
    }, 200);
  }, [move, isProcessingMove]);

  const handleContinue = () => {
    continueGame();
    setWinModalVisible(false);
    
    // Restart the game timer
    startGameTimer();
  };

  const handleNextLevel = () => {
    if (level < LEVELS.length - 1) {
      setLevel(level + 1);
    }
    setWinModalVisible(false);
    
    // Restart the game timer
    startGameTimer();
  };

  const handleRestart = () => {
    restartGame();
    setLoseModalVisible(false);
    setShowRewardedAdButton(false);
    
    // Restart the game timer
    startGameTimer();
  };

  const handleShowTutorial = () => {
    setTutorialModalVisible(true);
  };

  const toggleFullScreen = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setIsFullScreen(!isFullScreen);
  };

  const handleShare = () => {
    // Prepare share content
    const shareContent = {
      score,
      level,
      aiPersona: aiState.persona,
      aiScore: aiState.score,
      playerWon: score > aiState.score
    };
    
    // Show the share modal
    setShareModalVisible(true);
    
    // Close the win/lose modal
    setWinModalVisible(false);
    setLoseModalVisible(false);
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode);
  };
  
  const openSettings = () => {
    setSettingsModalVisible(true);
  };
  
  const closeSettings = () => {
    setSettingsModalVisible(false);
  };
  
  const handleAdPress = () => {
    // In a real app, this would navigate to a premium upgrade screen
    Alert.alert(
      "Upgrade to Pro",
      "Remove ads and unlock exclusive content with our Pro version!",
      [
        { text: "Maybe Later", style: "cancel" },
        { text: "Learn More", onPress: () => console.log("Navigate to upgrade screen") }
      ]
    );
  };
  
  const handleAdClose = () => {
    setShowAdBanner(false);
    
    // Show banner again after 3 minutes
    setTimeout(() => {
      setShowAdBanner(true);
    }, 3 * 60 * 1000);
  };
  
  const handleWatchRewardedAd = () => {
    // @ts-ignore - Access global adManager
    if (global.adManager) {
      // @ts-ignore
      global.adManager.showRewarded('lives', 1, () => {
        // This callback will be called after the user gets the reward
        setLoseModalVisible(false);
        setShowRewardedAdButton(false);
        
        // Use the extra life
        if (useExtraLife()) {
          // Restart the game timer
          startGameTimer();
        }
      });
    }
  };
  
  const handleUseExtraLife = () => {
    if (useExtraLife()) {
      setLoseModalVisible(false);
      setShowRewardedAdButton(false);
      
      // Restart the game timer
      startGameTimer();
    } else {
      Alert.alert(
        "No Extra Lives",
        "You don't have any extra lives. Watch an ad to get one!",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Watch Ad", onPress: handleWatchRewardedAd }
        ]
      );
    }
  };
  
  // Focus effect to ensure we load the latest game state when navigating back to this screen
  useFocusEffect(
    React.useCallback(() => {
      loadGameState();
      return () => {
        saveGameState();
      };
    }, [])
  );

  if (isFullScreen) {
    return (
      <SafeAreaView style={[
        styles.fullScreenContainer,
        isDarkMode && { backgroundColor: COLORS.dark.background }
      ]}>
        <View style={styles.fullScreenHeader}>
          <ScoreBoard 
            score={score} 
            bestScore={bestScore} 
            level={level} 
            isCompact={true} 
            isDarkMode={isDarkMode}
          />
          <TouchableOpacity 
            style={[
              styles.closeButton,
              isDarkMode && { backgroundColor: COLORS.dark.controls.background }
            ]} 
            onPress={toggleFullScreen}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={24} color={isDarkMode ? COLORS.dark.text : COLORS.text} />
          </TouchableOpacity>
        </View>
        
        <View 
          style={styles.fullScreenGameContainer}
          {...panResponder.panHandlers}
        >
          <Grid 
            grid={grid} 
            obstacles={obstacles} 
            gridSize={gridSize} 
            isFullScreen={true} 
            isDarkMode={isDarkMode}
            onMove={handleDirectionPress}
          />
        </View>
        
        <View style={styles.fullScreenControlsContainer}>
          <GameControls 
            onRestart={restartGame} 
            onShowTutorial={handleShowTutorial} 
            isFullScreen={true}
            isDarkMode={isDarkMode}
          />
        </View>
        
        {/* Achievement notification */}
        {showAchievement && (
          <Animated.View 
            style={[
              styles.achievementContainer,
              {
                opacity: achievementAnim,
                transform: [
                  { translateY: achievementAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 0]
                  })}
                ]
              }
            ]}
          >
            <Trophy size={20} color="white" />
            <Text style={styles.achievementText}>{achievementMessage}</Text>
          </Animated.View>
        )}
        
        {/* Modals */}
        <WinModal 
          visible={winModalVisible}
          onClose={handleNextLevel}
          onContinue={handleContinue}
          onShare={handleShare}
          score={score}
          level={level}
        />
        
        <LoseModal 
          visible={loseModalVisible}
          onClose={() => setLoseModalVisible(false)}
          onRestart={handleRestart}
          onShare={handleShare}
          score={score}
          level={level}
          showExtraLifeButton={extraLives > 0}
          onUseExtraLife={handleUseExtraLife}
          extraLives={extraLives}
          showWatchAdButton={showRewardedAdButton}
          onWatchAd={handleWatchRewardedAd}
        />
        
        <TutorialModal
          visible={tutorialModalVisible}
          onClose={() => setTutorialModalVisible(false)}
        />
        
        <ShareModal
          visible={shareModalVisible}
          onClose={() => setShareModalVisible(false)}
          shareContent={{
            score,
            level,
            aiPersona: aiState.persona,
            aiScore: aiState.score,
            playerWon: score > aiState.score
          }}
        />
        
        {/* Rating prompt */}
        {showRatingPrompt && (
          <View style={styles.ratingPromptContainer}>
            <View style={styles.ratingPrompt}>
              <Text style={styles.ratingTitle}>Enjoying Obstacle 2048?</Text>
              <Text style={styles.ratingText}>Your rating helps us improve the game!</Text>
              <View style={styles.ratingButtons}>
                <TouchableOpacity 
                  style={styles.ratingButton} 
                  onPress={handleRatingPrompt}
                >
                  <Text style={styles.ratingButtonText}>Rate Now</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.ratingButton, styles.ratingLaterButton]} 
                  onPress={() => setShowRatingPrompt(false)}
                >
                  <Text style={styles.ratingLaterText}>Later</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <View 
      style={[
        styles.container,
        isDarkMode && { backgroundColor: COLORS.dark.background }
      ]}
    >
      {/* Update banner */}
      {showUpdateBanner && (
        <TouchableOpacity 
          style={styles.updateBanner}
          onPress={handleUpdate}
        >
          <Text style={styles.updateText}>Update available! Tap to update now.</Text>
        </TouchableOpacity>
      )}
      
      {/* Compact Header */}
      <View style={styles.compactHeader}>
        <View style={styles.titleContainer}>
          <Text style={[
            styles.title,
            isDarkMode && { color: COLORS.dark.primary }
          ]}>Obstacle 2048</Text>
        </View>
        
        <ScoreBoard 
          score={score} 
          bestScore={bestScore} 
          level={level} 
          isCompact={true}
          isDarkMode={isDarkMode}
        />
        
        <TouchableOpacity 
          style={[
            styles.settingsButton,
            isDarkMode && { backgroundColor: COLORS.dark.controls.background }
          ]} 
          onPress={openSettings}
        >
          <Settings size={22} color={isDarkMode ? COLORS.dark.primary : COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Main Game Area */}
      <View style={styles.gameArea}>
        {/* Game Grid */}
        <View 
          style={styles.gameContainer}
          {...panResponder.panHandlers}
        >
          <Grid 
            grid={grid} 
            obstacles={obstacles} 
            gridSize={gridSize} 
            isDarkMode={isDarkMode}
            onMove={handleDirectionPress}
          />
        </View>
        
        {/* Ad Banner */}
        {showAdBanner && (
          <AdBanner 
            isDarkMode={isDarkMode}
            onPress={handleAdPress}
            onClose={handleAdClose}
          />
        )}
        
        {/* Game Controls */}
        <View style={styles.controlsContainer}>
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity 
              style={[
                styles.actionButton,
                isDarkMode && { backgroundColor: COLORS.dark.controls.background }
              ]}
              onPress={restartGame}
            >
              <Text style={[
                styles.actionButtonText,
                isDarkMode && { color: COLORS.dark.primary }
              ]}>Restart</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.actionButton,
                styles.fullScreenActionButton,
                isDarkMode && { backgroundColor: COLORS.dark.primary }
              ]}
              onPress={toggleFullScreen}
              activeOpacity={0.8}
            >
              <Text style={styles.fullScreenButtonText}>Full Screen</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.actionButton,
                isDarkMode && { backgroundColor: COLORS.dark.controls.background }
              ]}
              onPress={handleWatchRewardedAd}
            >
              <Gift size={16} color={isDarkMode ? COLORS.dark.primary : COLORS.primary} style={styles.buttonIcon} />
              <Text style={[
                styles.actionButtonText,
                isDarkMode && { color: COLORS.dark.primary }
              ]}>Get Life</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {/* Settings Modal */}
      <Modal
        visible={settingsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeSettings}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.settingsModal,
            isDarkMode && { backgroundColor: COLORS.dark.background }
          ]}>
            <View style={styles.settingsHeader}>
              <Text style={[
                styles.settingsTitle,
                isDarkMode && { color: COLORS.dark.text }
              ]}>Game Settings</Text>
              <TouchableOpacity onPress={closeSettings}>
                <X size={24} color={isDarkMode ? COLORS.dark.text : COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.settingsContent}>
              <View style={styles.settingSection}>
                <Text style={[
                  styles.settingSectionTitle,
                  isDarkMode && { color: COLORS.dark.text }
                ]}>Appearance</Text>
                <TouchableOpacity 
                  style={[
                    styles.settingButton,
                    isDarkMode && { backgroundColor: COLORS.dark.controls.background }
                  ]}
                  onPress={toggleDarkMode}
                >
                  <Text style={[
                    styles.settingButtonText,
                    isDarkMode && { color: COLORS.dark.text }
                  ]}>
                    {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.settingSection}>
                <Text style={[
                  styles.settingSectionTitle,
                  isDarkMode && { color: COLORS.dark.text }
                ]}>Game Level</Text>
                <LevelSelector isDarkMode={isDarkMode} />
              </View>
              
              <View style={styles.settingSection}>
                <Text style={[
                  styles.settingSectionTitle,
                  isDarkMode && { color: COLORS.dark.text }
                ]}>AI Opponent</Text>
                <AIPersonaSelector isDarkMode={isDarkMode} />
              </View>
              
              <View style={styles.settingSection}>
                <Text style={[
                  styles.settingSectionTitle,
                  isDarkMode && { color: COLORS.dark.text }
                ]}>Extra Lives</Text>
                <View style={styles.livesContainer}>
                  <Text style={[
                    styles.livesText,
                    isDarkMode && { color: COLORS.dark.text }
                  ]}>
                    You have {extraLives} extra {extraLives === 1 ? 'life' : 'lives'}
                  </Text>
                  <TouchableOpacity 
                    style={styles.getMoreLivesButton}
                    onPress={() => {
                      closeSettings();
                      handleWatchRewardedAd();
                    }}
                  >
                    <Text style={styles.getMoreLivesText}>Get More</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.settingSection}>
                <Text style={[
                  styles.settingSectionTitle,
                  isDarkMode && { color: COLORS.dark.text }
                ]}>Share</Text>
                <TouchableOpacity 
                  style={[
                    styles.settingButton,
                    isDarkMode && { backgroundColor: COLORS.dark.controls.background }
                  ]}
                  onPress={handleShare}
                >
                  <Share2 size={20} color={isDarkMode ? COLORS.dark.primary : COLORS.primary} />
                  <Text style={[
                    styles.settingButtonText,
                    isDarkMode && { color: COLORS.dark.text }
                  ]}>Share Your Score</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.settingSection}>
                <Text style={[
                  styles.settingSectionTitle,
                  isDarkMode && { color: COLORS.dark.text }
                ]}>About</Text>
                <TouchableOpacity 
                  style={[
                    styles.settingButton,
                    isDarkMode && { backgroundColor: COLORS.dark.controls.background }
                  ]}
                  onPress={handleShowTutorial}
                >
                  <Info size={20} color={isDarkMode ? COLORS.dark.primary : COLORS.primary} />
                  <Text style={[
                    styles.settingButtonText,
                    isDarkMode && { color: COLORS.dark.text }
                  ]}>How to Play</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.settingSection}>
                <Text style={[
                  styles.settingSectionTitle,
                  isDarkMode && { color: COLORS.dark.text }
                ]}>Remove Ads</Text>
                <TouchableOpacity 
                  style={styles.removeAdsButton}
                  onPress={handleAdPress}
                >
                  <Text style={styles.removeAdsText}>Upgrade to Pro</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* Achievement notification */}
      {showAchievement && (
        <Animated.View 
          style={[
            styles.achievementContainer,
            {
              opacity: achievementAnim,
              transform: [
                { translateY: achievementAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0]
                })}
              ]
            }
          ]}
        >
          <Trophy size={20} color="white" />
          <Text style={styles.achievementText}>{achievementMessage}</Text>
        </Animated.View>
      )}
      
      {/* Modals */}
      <WinModal 
        visible={winModalVisible}
        onClose={handleNextLevel}
        onContinue={handleContinue}
        onShare={handleShare}
        score={score}
        level={level}
      />
      
      <LoseModal 
        visible={loseModalVisible}
        onClose={() => setLoseModalVisible(false)}
        onRestart={handleRestart}
        onShare={handleShare}
        score={score}
        level={level}
        showExtraLifeButton={extraLives > 0}
        onUseExtraLife={handleUseExtraLife}
        extraLives={extraLives}
        showWatchAdButton={showRewardedAdButton}
        onWatchAd={handleWatchRewardedAd}
      />
      
      <TutorialModal
        visible={tutorialModalVisible}
        onClose={() => setTutorialModalVisible(false)}
      />
      
      <ShareModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        shareContent={{
          score,
          level,
          aiPersona: aiState.persona,
          aiScore: aiState.score,
          playerWon: score > aiState.score
        }}
      />
      
      {/* Rating prompt */}
      {showRatingPrompt && (
        <View style={styles.ratingPromptContainer}>
          <View style={styles.ratingPrompt}>
            <Text style={styles.ratingTitle}>Enjoying Obstacle 2048?</Text>
            <Text style={styles.ratingText}>Your rating helps us improve the game!</Text>
            <View style={styles.ratingButtons}>
              <TouchableOpacity 
                style={styles.ratingButton} 
                onPress={handleRatingPrompt}
              >
                <Text style={styles.ratingButtonText}>Rate Now</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.ratingButton, styles.ratingLaterButton]} 
                onPress={() => setShowRatingPrompt(false)}
              >
                <Text style={styles.ratingLaterText}>Later</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Compact header
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  // Game area
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16, // Added more top padding
  },
  gameContainer: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  actionButton: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 4,
    flexDirection: 'row',
  },
  actionButtonText: {
    fontWeight: '600',
    color: COLORS.text,
  },
  fullScreenActionButton: {
    backgroundColor: COLORS.primary,
    flex: 1.5,
  },
  fullScreenButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 4,
  },
  // Settings modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsModal: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  settingsContent: {
    padding: 16,
  },
  settingSection: {
    marginBottom: 24,
  },
  settingSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.text,
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
  },
  settingButtonText: {
    fontSize: 16,
    marginLeft: 8,
    color: COLORS.text,
  },
  // Update banner
  updateBanner: {
    backgroundColor: COLORS.ui.info,
    padding: 12,
    alignItems: 'center',
    width: '100%',
  },
  updateText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Full screen styles
  fullScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  fullScreenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenGameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenControlsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20, // Ensure controls are above other elements
  },
  // Achievement notification
  achievementContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 30, // Ensure notification is above other elements
  },
  achievementText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  // Rating prompt
  ratingPromptContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  ratingPrompt: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  ratingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  ratingButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  ratingButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  ratingButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ratingLaterButton: {
    backgroundColor: '#f0f0f0',
  },
  ratingLaterText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Extra lives
  livesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
  },
  livesText: {
    fontSize: 16,
    color: COLORS.text,
  },
  getMoreLivesButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  getMoreLivesText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Remove ads button
  removeAdsButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginVertical: 4,
  },
  removeAdsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});