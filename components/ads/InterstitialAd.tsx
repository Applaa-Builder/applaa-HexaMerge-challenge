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
  Easing
} from 'react-native';
import { COLORS } from '@/constants/colors';
import { X, ExternalLink } from 'lucide-react-native';

interface InterstitialAdProps {
  visible: boolean;
  onClose: () => void;
  onAdPress?: () => void;
  isDarkMode?: boolean;
}

const { width, height } = Dimensions.get('window');

export default function InterstitialAd({ 
  visible, 
  onClose, 
  onAdPress,
  isDarkMode = false
}: InterstitialAdProps) {
  const [countdown, setCountdown] = useState(5);
  const [adLoaded, setAdLoaded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  // Random ad selection
  const ads = [
    {
      title: "Clash of Clans",
      description: "Build your village, train your troops & go to battle!",
      cta: "Install Now",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format"
    },
    {
      title: "Candy Crush Saga",
      description: "Match candies in this sweet puzzle adventure!",
      cta: "Download",
      image: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?q=80&w=400&auto=format"
    },
    {
      title: "Raid: Shadow Legends",
      description: "Collect champions and battle in epic RPG combat!",
      cta: "Play Free",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format"
    },
    {
      title: "Subway Surfers",
      description: "Dash as fast as you can through the subway!",
      cta: "Get Game",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=400&auto=format"
    }
  ];
  
  const randomAdIndex = Math.floor(Math.random() * ads.length);
  const currentAd = ads[randomAdIndex];
  
  // Simulate ad loading
  useEffect(() => {
    if (visible) {
      // Reset state
      setCountdown(5);
      setAdLoaded(false);
      
      // Simulate ad loading delay
      const loadTimer = setTimeout(() => {
        setAdLoaded(true);
        
        // Animate in
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.back(1.5)),
            useNativeDriver: true,
          })
        ]).start();
        
      }, 1000);
      
      return () => clearTimeout(loadTimer);
    }
  }, [visible]);
  
  // Countdown timer
  useEffect(() => {
    if (visible && adLoaded && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [visible, adLoaded, countdown]);
  
  // Handle ad press
  const handleAdPress = () => {
    if (onAdPress) {
      onAdPress();
    }
    onClose();
  };
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => countdown === 0 && onClose()}
    >
      <View style={[
        styles.container,
        isDarkMode && styles.darkContainer
      ]}>
        {!adLoaded ? (
          <View style={styles.loadingContainer}>
            <Text style={[
              styles.loadingText,
              isDarkMode && styles.darkText
            ]}>
              Loading Ad...
            </Text>
          </View>
        ) : (
          <Animated.View 
            style={[
              styles.adContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <View style={styles.adHeader}>
              <View style={styles.adLabelContainer}>
                <Text style={styles.adLabel}>ADVERTISEMENT</Text>
              </View>
              
              {countdown === 0 && (
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={onClose}
                >
                  <X size={20} color={isDarkMode ? "#FFFFFF" : "#000000"} />
                </TouchableOpacity>
              )}
              
              {countdown > 0 && (
                <View style={styles.countdownContainer}>
                  <Text style={styles.countdownText}>{countdown}</Text>
                </View>
              )}
            </View>
            
            <Image 
              source={{ uri: currentAd.image }} 
              style={styles.adImage} 
              resizeMode="cover"
            />
            
            <View style={styles.adContent}>
              <Text style={[
                styles.adTitle,
                isDarkMode && styles.darkText
              ]}>
                {currentAd.title}
              </Text>
              
              <Text style={[
                styles.adDescription,
                isDarkMode && styles.darkText
              ]}>
                {currentAd.description}
              </Text>
              
              <TouchableOpacity 
                style={styles.ctaButton}
                onPress={handleAdPress}
              >
                <Text style={styles.ctaText}>{currentAd.cta}</Text>
                <ExternalLink size={16} color="#FFFFFF" style={styles.ctaIcon} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
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
  loadingContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  darkText: {
    color: '#FFFFFF',
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
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
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
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  adImage: {
    width: '100%',
    height: 200,
  },
  adContent: {
    padding: 16,
  },
  adTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  adDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 22,
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ctaIcon: {
    marginLeft: 8,
  },
});