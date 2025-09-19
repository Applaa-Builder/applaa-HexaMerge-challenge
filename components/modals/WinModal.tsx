import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Modal, 
  TouchableOpacity,
  Image,
  Animated,
  Platform
} from 'react-native';
import { COLORS } from '@/constants/colors';
import { Share2, Trophy, Star, ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface WinModalProps {
  visible: boolean;
  onClose: () => void;
  onContinue: () => void;
  onShare: () => void;
  score: number;
  level: number;
}

export default function WinModal({ 
  visible, 
  onClose, 
  onContinue, 
  onShare,
  score,
  level
}: WinModalProps) {
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
      
      // Start animations
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        })
      ]).start();
      
      // Trigger haptic feedback on iOS/Android
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  }, [visible, scaleAnim, opacityAnim]);
  
  const handleShare = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onShare();
  };
  
  const handleContinue = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onContinue();
  };
  
  const handleNextLevel = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onClose();
  };
  
  return (
    <Modal
      animationType="none" // We'll handle animations ourselves
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <Animated.View 
          style={[
            styles.modalView,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.confettiContainer}>
            <Trophy size={40} color={COLORS.primary} style={styles.trophyIcon} />
          </View>
          
          <Text style={styles.title}>Level Complete!</Text>
          
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1531686264889-56fdcabd163f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }} 
            style={styles.image} 
          />
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Score</Text>
              <Text style={styles.statValue}>{score}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Level</Text>
              <Text style={styles.statValue}>{level + 1}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Star size={16} color={COLORS.primary} />
              <Text style={styles.statValue}>★★★</Text>
            </View>
          </View>
          
          <Text style={styles.motivationalText}>
            Amazing! You've mastered this level. Ready for the next challenge?
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.continueButton]} 
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Keep Playing</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.shareButton]} 
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <Share2 size={20} color="white" />
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.nextLevelButton} 
            onPress={handleNextLevel}
            activeOpacity={0.8}
          >
            <Text style={styles.nextLevelText}>Next Level</Text>
            <ArrowRight size={20} color="white" style={styles.arrowIcon} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalView: {
    width: '90%',
    maxWidth: 360,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  confettiContainer: {
    position: 'absolute',
    top: -30,
    backgroundColor: 'white',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  trophyIcon: {
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.7,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  motivationalText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  button: {
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  continueButton: {
    backgroundColor: COLORS.ui.info,
  },
  shareButton: {
    backgroundColor: COLORS.social.twitter,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 6,
  },
  nextLevelButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  nextLevelText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  arrowIcon: {
    marginLeft: 8,
  }
});