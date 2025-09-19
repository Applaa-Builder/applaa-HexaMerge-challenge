import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Animated } from 'react-native';
import { COLORS } from '@/constants/colors';
import { X, ExternalLink } from 'lucide-react-native';

interface AdBannerProps {
  isDarkMode?: boolean;
  onPress?: () => void;
  onClose?: () => void;
  size?: 'banner' | 'large';
}

export default function AdBanner({ 
  isDarkMode = false, 
  onPress, 
  onClose,
  size = 'banner' 
}: AdBannerProps) {
  const { width } = Dimensions.get('window');
  const [adIndex, setAdIndex] = useState(0);
  const fadeAnim = React.useRef(new Animated.Value(0.3)).current;
  
  // Dummy ad content
  const ads = [
    {
      title: "Upgrade to Pro",
      description: "Remove ads and unlock exclusive levels!",
      cta: "Upgrade Now",
      image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=200&auto=format"
    },
    {
      title: "Play Candy Crush",
      description: "Match candies in this sweet puzzle game!",
      cta: "Install",
      image: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=200&auto=format"
    },
    {
      title: "Learn to Code",
      description: "Start your coding journey today!",
      cta: "Learn More",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=200&auto=format"
    },
    {
      title: "New Game: Space Adventure",
      description: "Explore the universe in this exciting game!",
      cta: "Download",
      image: "https://images.unsplash.com/photo-1581822261290-991b38693d1b?q=80&w=200&auto=format"
    }
  ];
  
  // Rotate ads every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
      
      // Fade animation
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
      
    }, 30000);
    
    // Initial fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
    return () => clearInterval(interval);
  }, []);
  
  const currentAd = ads[adIndex];
  
  return (
    <Animated.View 
      style={[
        styles.container,
        { width: size === 'banner' ? width * 0.95 : width * 0.95 },
        size === 'large' && styles.largeContainer,
        isDarkMode && styles.darkContainer,
        { opacity: fadeAnim }
      ]}
    >
      <View style={styles.adLabelContainer}>
        <Text style={styles.adLabel}>AD</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.content}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <Image 
          source={{ uri: currentAd.image }} 
          style={size === 'banner' ? styles.adImage : styles.largeAdImage} 
          resizeMode="cover"
        />
        
        <View style={styles.adTextContainer}>
          <Text style={[
            styles.adTitle,
            isDarkMode && styles.darkText
          ]}>
            {currentAd.title}
          </Text>
          
          <Text style={[
            styles.adDescription,
            isDarkMode && styles.darkText
          ]} numberOfLines={1}>
            {currentAd.description}
          </Text>
          
          <View style={styles.ctaContainer}>
            <TouchableOpacity 
              style={[
                styles.ctaButton,
                isDarkMode && styles.darkCtaButton
              ]}
              onPress={onPress}
            >
              <Text style={styles.ctaText}>{currentAd.cta}</Text>
              <ExternalLink size={12} color="#FFFFFF" style={styles.ctaIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
      
      {onClose && (
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={14} color={isDarkMode ? "#FFFFFF" : "#000000"} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    position: 'relative',
  },
  darkContainer: {
    backgroundColor: '#37474F',
  },
  largeContainer: {
    height: 250,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  adImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  largeAdImage: {
    width: '100%',
    height: 150,
    borderRadius: 4,
    marginBottom: 8,
  },
  adTextContainer: {
    flex: 1,
  },
  adTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  adDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  darkText: {
    color: '#FFFFFF',
  },
  ctaContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  darkCtaButton: {
    backgroundColor: COLORS.dark.primary,
  },
  ctaText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ctaIcon: {
    marginLeft: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  adLabelContainer: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
    zIndex: 10,
  },
  adLabel: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
});