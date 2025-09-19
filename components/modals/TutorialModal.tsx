import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Modal, 
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView
} from 'react-native';
import { COLORS } from '@/constants/colors';
import { ArrowLeft, ArrowRight, X, Square, ChevronLeft, ChevronRight } from 'lucide-react-native';

interface TutorialModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export default function TutorialModal({ visible, onClose }: TutorialModalProps) {
  const [currentPage, setCurrentPage] = useState(0);
  
  const tutorialPages = [
    {
      title: 'How to Play',
      content: 'Swipe to move all tiles. When two tiles with the same number touch, they merge into one!',
      image: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      title: 'Obstacles',
      content: 'Watch out for walls that block your tiles. Plan your moves carefully to navigate around them.',
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      title: 'Special Tiles',
      content: 'Multiplier tiles double the value of tiles that merge on them. Use them strategically!',
      image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      title: 'Compete with AI',
      content: 'Challenge different AI personalities. Each has their own strategy and difficulty level.',
      image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      title: 'Achievements',
      content: 'Unlock achievements as you play. Share your progress with friends and challenge them!',
      image: 'https://images.unsplash.com/photo-1531686264889-56fdcabd163f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    }
  ];
  
  const nextPage = () => {
    if (currentPage < tutorialPages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onClose();
      setCurrentPage(0);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleClose = () => {
    onClose();
    setCurrentPage(0);
  };
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={handleClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={24} color={COLORS.text} />
          </TouchableOpacity>
          
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Image 
              source={{ uri: tutorialPages[currentPage].image }} 
              style={styles.image} 
              resizeMode="cover"
            />
            
            <Text style={styles.title}>{tutorialPages[currentPage].title}</Text>
            <Text style={styles.content}>{tutorialPages[currentPage].content}</Text>
            
            {currentPage === 1 && (
              <View style={styles.exampleContainer}>
                <View style={styles.exampleRow}>
                  <View style={styles.exampleTile}>
                    <Text style={styles.exampleTileText}>2</Text>
                  </View>
                  <View style={styles.exampleObstacle}>
                    <Square size={24} color={COLORS.obstacle.wall} fill={COLORS.obstacle.wall} />
                  </View>
                  <View style={styles.exampleTile}>
                    <Text style={styles.exampleTileText}>4</Text>
                  </View>
                </View>
                <Text style={styles.exampleText}>Walls block tile movement</Text>
              </View>
            )}
            
            {currentPage === 2 && (
              <View style={styles.exampleContainer}>
                <View style={styles.exampleRow}>
                  <View style={styles.exampleTile}>
                    <Text style={styles.exampleTileText}>2</Text>
                  </View>
                  <View style={[styles.exampleTile, { backgroundColor: COLORS.obstacle.multiplier }]}>
                    <Text style={styles.exampleTileText}>2</Text>
                  </View>
                  <ArrowRight size={24} color={COLORS.text} style={styles.exampleArrow} />
                  <View style={[styles.exampleTile, { backgroundColor: COLORS.tile[8] }]}>
                    <Text style={styles.exampleTileText}>8</Text>
                  </View>
                </View>
                <Text style={styles.exampleText}>Multipliers double the merged value</Text>
              </View>
            )}
            
            {currentPage === 3 && (
              <View style={styles.exampleContainer}>
                <View style={styles.aiPersonaRow}>
                  <View style={styles.aiPersona}>
                    <Text style={styles.aiPersonaName}>Cautious Carl</Text>
                    <Text style={styles.aiPersonaDesc}>Plays it safe</Text>
                  </View>
                  <View style={styles.aiPersona}>
                    <Text style={styles.aiPersonaName}>Risky Rachel</Text>
                    <Text style={styles.aiPersonaDesc}>Takes chances</Text>
                  </View>
                </View>
                <Text style={styles.exampleText}>Different AI personalities to challenge</Text>
              </View>
            )}
          </ScrollView>
          
          <View style={styles.paginationContainer}>
            <TouchableOpacity 
              style={[styles.navButton, currentPage === 0 && styles.disabledButton]} 
              onPress={prevPage}
              disabled={currentPage === 0}
            >
              <ChevronLeft size={24} color={currentPage === 0 ? '#ccc' : COLORS.text} />
            </TouchableOpacity>
            
            <View style={styles.dotsContainer}>
              {tutorialPages.map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.dot, 
                    currentPage === index && styles.activeDot
                  ]} 
                />
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.navButton} 
              onPress={nextPage}
            >
              {currentPage < tutorialPages.length - 1 ? (
                <ChevronRight size={24} color={COLORS.text} />
              ) : (
                <Text style={styles.doneText}>Done</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
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
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    maxHeight: 500,
  },
  scrollContent: {
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  content: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  navButton: {
    padding: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 12,
    height: 8,
  },
  doneText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  exampleContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    width: width * 0.7,
  },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exampleTile: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.tile[2],
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  exampleTileText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  exampleObstacle: {
    width: 50,
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  exampleText: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
  },
  exampleArrow: {
    marginHorizontal: 8,
  },
  aiPersonaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 12,
  },
  aiPersona: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    width: '45%',
  },
  aiPersonaName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  aiPersonaDesc: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.7,
  },
});