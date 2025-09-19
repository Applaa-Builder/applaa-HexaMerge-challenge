import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Share,
  Platform,
  Alert
} from 'react-native';
import { X, Share2, Twitter, Facebook, MessageCircle } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import * as Clipboard from 'expo-clipboard';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  shareContent: {
    score: number;
    level: number;
    aiPersona: string;
    aiScore: number;
    playerWon: boolean;
  };
}

export default function ShareModal({ visible, onClose, shareContent }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  
  const generateShareText = () => {
    const { score, level, aiPersona, aiScore, playerWon } = shareContent;
    
    let shareText = `I scored ${score} points on level ${level + 1} in Obstacle 2048! `;
    
    if (playerWon) {
      shareText += `I beat ${aiPersona} who scored ${aiScore}. Can you beat me? #Obstacle2048 #MobileGame`;
    } else {
      shareText += `${aiPersona} scored ${aiScore}. Can you do better? #Obstacle2048 #MobileGame`;
    }
    
    return shareText;
  };
  
  const handleShare = async () => {
    try {
      const shareText = generateShareText();
      
      const result = await Share.share({
        message: shareText,
        title: "Check out my Obstacle 2048 score!"
      });
      
      if (result.action === Share.sharedAction) {
        // Shared successfully
        onClose();
      }
    } catch (error) {
      Alert.alert("Error", "Could not share at this time");
    }
  };
  
  const handleCopyToClipboard = async () => {
    try {
      const shareText = generateShareText();
      
      if (Platform.OS === 'web') {
        // For web, use the clipboard API
        navigator.clipboard.writeText(shareText);
      } else {
        // For native platforms, use expo-clipboard
        await Clipboard.setStringAsync(shareText);
      }
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      Alert.alert("Error", "Could not copy to clipboard");
    }
  };
  
  const handleShareToTwitter = () => {
    const shareText = encodeURIComponent(generateShareText());
    const url = `https://twitter.com/intent/tweet?text=${shareText}`;
    
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      // On native, we would use Linking to open the URL
      // This is a simplified version
      Alert.alert("Share to Twitter", "This would open Twitter with your score");
    }
  };
  
  const handleShareToFacebook = () => {
    // In a real app, this would use the Facebook SDK or deep linking
    Alert.alert("Share to Facebook", "This would share your score on Facebook");
  };
  
  const handleShareToMessages = () => {
    // In a real app, this would use deep linking to the messages app
    Alert.alert("Share via Messages", "This would open your messaging app with your score");
  };
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={COLORS.text} />
          </TouchableOpacity>
          
          <Text style={styles.modalTitle}>Share Your Score</Text>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Your Score:</Text>
            <Text style={styles.scoreValue}>{shareContent.score}</Text>
            
            <Text style={styles.scoreLabel}>Level:</Text>
            <Text style={styles.scoreValue}>{shareContent.level + 1}</Text>
            
            <Text style={styles.scoreLabel}>AI Opponent:</Text>
            <Text style={styles.scoreValue}>{shareContent.aiPersona}</Text>
            
            <Text style={styles.scoreLabel}>AI Score:</Text>
            <Text style={styles.scoreValue}>{shareContent.aiScore}</Text>
            
            <Text style={styles.resultText}>
              {shareContent.playerWon 
                ? "Congratulations! You won! 🎉" 
                : "Keep practicing! You'll win next time! 💪"}
            </Text>
          </View>
          
          <View style={styles.shareOptions}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Share2 size={24} color="white" />
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.shareButton, styles.copyButton]} 
              onPress={handleCopyToClipboard}
            >
              <Text style={styles.copyButtonText}>
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.shareViaText}>Share via:</Text>
          
          <View style={styles.socialButtons}>
            <TouchableOpacity 
              style={[styles.socialButton, styles.twitterButton]} 
              onPress={handleShareToTwitter}
            >
              <Twitter size={24} color="white" />
              <Text style={styles.socialButtonText}>Twitter</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.socialButton, styles.facebookButton]} 
              onPress={handleShareToFacebook}
            >
              <Facebook size={24} color="white" />
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.socialButton, styles.messagesButton]} 
              onPress={handleShareToMessages}
            >
              <MessageCircle size={24} color="white" />
              <Text style={styles.socialButtonText}>Messages</Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreContainer: {
    width: '100%',
    marginBottom: 20,
  },
  scoreLabel: {
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.7,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  shareOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  shareButton: {
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
  shareButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  copyButton: {
    backgroundColor: '#f0f0f0',
  },
  copyButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  shareViaText: {
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.7,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  socialButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  socialButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 4,
  },
  twitterButton: {
    backgroundColor: '#1DA1F2',
  },
  facebookButton: {
    backgroundColor: '#4267B2',
  },
  messagesButton: {
    backgroundColor: '#34B7F1',
  },
});