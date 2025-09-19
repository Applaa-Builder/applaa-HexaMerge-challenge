import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { COLORS } from '@/constants/colors';
import { RefreshCw, Share2, Heart, Gift } from 'lucide-react-native';

interface LoseModalProps {
  visible: boolean;
  onClose: () => void;
  onRestart: () => void;
  onShare: () => void;
  score: number;
  level: number;
  showExtraLifeButton?: boolean;
  onUseExtraLife?: () => void;
  extraLives?: number;
  showWatchAdButton?: boolean;
  onWatchAd?: () => void;
}

const { width } = Dimensions.get('window');

export default function LoseModal({ 
  visible, 
  onClose, 
  onRestart, 
  onShare, 
  score, 
  level,
  showExtraLifeButton = false,
  onUseExtraLife,
  extraLives = 0,
  showWatchAdButton = false,
  onWatchAd
}: LoseModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Game Over</Text>
          </View>
          
          <View style={styles.modalContent}>
            <Text style={styles.scoreText}>Your Score: {score}</Text>
            <Text style={styles.levelText}>Level: {level + 1}</Text>
            
            {showExtraLifeButton && extraLives > 0 && (
              <TouchableOpacity 
                style={styles.extraLifeButton}
                onPress={onUseExtraLife}
              >
                <Heart size={20} color="white" style={styles.buttonIcon} />
                <Text style={styles.extraLifeButtonText}>
                  Use Extra Life ({extraLives})
                </Text>
              </TouchableOpacity>
            )}
            
            {showWatchAdButton && (
              <TouchableOpacity 
                style={styles.watchAdButton}
                onPress={onWatchAd}
              >
                <Gift size={20} color="white" style={styles.buttonIcon} />
                <Text style={styles.watchAdButtonText}>
                  Watch Ad for Extra Life
                </Text>
              </TouchableOpacity>
            )}
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={styles.button}
                onPress={onRestart}
              >
                <RefreshCw size={20} color="white" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Restart</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.button}
                onPress={onShare}
              >
                <Share2 size={20} color="white" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Share</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    backgroundColor: COLORS.ui.error,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  modalContent: {
    padding: 20,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  levelText: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  closeButtonText: {
    color: COLORS.text,
    fontSize: 16,
  },
  extraLifeButton: {
    backgroundColor: '#E91E63',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 16,
  },
  extraLifeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  watchAdButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 16,
  },
  watchAdButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});