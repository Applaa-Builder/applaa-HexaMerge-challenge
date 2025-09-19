import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, Tile, Direction, AIState, AIPersona } from '@/types/game';
import { 
  initializeGrid, 
  addRandomTile, 
  isGameOver, 
  hasWon 
} from '@/utils/gridUtils';
import { moveTiles } from '@/utils/gameLogic';
import { makeAIMove } from '@/utils/aiLogic';
import { LEVELS, DEFAULT_GRID_SIZE } from '@/constants/game';
import { Platform } from 'react-native';
import { storage } from '@/utils/storage';

interface AdConfig {
  interstitialEnabled: boolean;
  interstitialFrequency: number; // Show after every X games
  rewardedAvailable: boolean;
  bannerPosition: 'top' | 'bottom';
  lastAdShown: string; // ISO date string
  gamesPlayed: number;
}

interface GameStore extends GameState {
  initializeGame: () => void;
  restartGame: () => void;
  move: (direction: Direction) => void;
  continueGame: () => void;
  setAIPersona: (persona: AIPersona) => void;
  setLevel: (level: number) => void;
  aiState: AIState;
  runAIMove: () => void;
  saveGameState: () => void;
  loadGameState: () => void;
  setDarkMode: (isDark: boolean) => void;
  isDarkMode: boolean;
  achievements: string[];
  unlockAchievement: (achievement: string) => void;
  referralCode: string;
  generateReferralCode: () => void;
  applyReferralCode: (code: string) => boolean;
  extraLives: number;
  useExtraLife: () => boolean;
  addExtraLives: (amount: number) => void;
  adConfig: AdConfig;
  updateAdConfig: (config: AdConfig) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      grid: [],
      obstacles: [],
      score: 0,
      bestScore: 0,
      status: 'idle',
      won: false,
      over: false,
      keepPlaying: false,
      level: 0,
      difficulty: 'easy',
      gridSize: DEFAULT_GRID_SIZE,
      isDarkMode: false,
      achievements: [],
      referralCode: '',
      extraLives: 0,
      
      adConfig: {
        interstitialEnabled: true,
        interstitialFrequency: 3, // Show after every 3 games
        rewardedAvailable: true,
        bannerPosition: 'bottom',
        lastAdShown: '',
        gamesPlayed: 0
      },
      
      aiState: {
        grid: [],
        obstacles: [],
        score: 0,
        bestScore: 0,
        status: 'idle',
        won: false,
        over: false,
        keepPlaying: false,
        persona: 'Balanced Betty',
        thinking: false,
        level: 0,
      },
      
      initializeGame: () => {
        const currentLevel = get().level;
        const levelData = LEVELS[currentLevel];
        const gridSize = levelData.gridSize;
        const obstacles = JSON.parse(JSON.stringify(levelData.obstacles));
        
        const initialGrid = initializeGrid(obstacles, gridSize);
        
        set({
          grid: initialGrid,
          obstacles,
          score: 0,
          status: 'playing',
          won: false,
          over: false,
          keepPlaying: false,
          gridSize,
          aiState: {
            ...get().aiState,
            grid: JSON.parse(JSON.stringify(initialGrid)), // Deep clone the grid for AI
            obstacles: JSON.parse(JSON.stringify(obstacles)),
            score: 0,
            status: 'playing',
            won: false,
            over: false,
            keepPlaying: false,
            thinking: false,
            level: currentLevel,
          }
        });
        
        // Save initial game state
        get().saveGameState();
      },
      
      restartGame: () => {
        get().initializeGame();
      },
      
      move: (direction: Direction) => {
        const { grid, obstacles, score, won, keepPlaying, gridSize, level } = get();
        const levelData = LEVELS[level];
        
        // Don't allow moves if the game is over
        if (get().over) return;
        
        // Process the move
        const { newGrid, newScore, moved } = moveTiles(grid, direction, obstacles, score, gridSize);
        
        // If no tiles moved, don't do anything
        if (!moved) return;
        
        // Add a new random tile
        const gridWithNewTile = addRandomTile(newGrid, obstacles, gridSize);
        
        // Check if the player has won
        const playerWon = !won && !keepPlaying && hasWon(gridWithNewTile, levelData.winningValue);
        
        // Check if the game is over
        const gameOver = isGameOver(gridWithNewTile, obstacles, gridSize);
        
        // Update the best score if needed
        const newBestScore = Math.max(get().bestScore, newScore);
        
        // Update the state
        set({
          grid: gridWithNewTile,
          score: newScore,
          bestScore: newBestScore,
          won: playerWon || won,
          over: gameOver && !playerWon,
        });
        
        // Save game state after move
        get().saveGameState();
        
        // Run AI move after player's move
        if (!gameOver && !playerWon) {
          setTimeout(() => {
            get().runAIMove();
          }, 500);
        }
      },
      
      continueGame: () => {
        set({ keepPlaying: true });
        get().saveGameState();
      },
      
      setAIPersona: (persona: AIPersona) => {
        set({
          aiState: {
            ...get().aiState,
            persona,
          }
        });
        get().saveGameState();
      },
      
      setLevel: (level: number) => {
        if (level >= 0 && level < LEVELS.length) {
          set({ level });
          get().restartGame();
        }
      },
      
      runAIMove: () => {
        const { aiState } = get();
        const levelData = LEVELS[aiState.level];
        
        // Don't run AI move if the AI game is over
        if (aiState.over || (aiState.won && !aiState.keepPlaying)) return;
        
        // Set AI to thinking state
        set({
          aiState: {
            ...aiState,
            thinking: true,
          }
        });
        
        // Simulate AI thinking time
        setTimeout(() => {
          const { direction, newGrid, newScore } = makeAIMove(
            aiState.grid, 
            aiState.obstacles,
            aiState.score, 
            aiState.persona,
            levelData.gridSize
          );
          
          if (!direction) {
            // No valid move found, game might be over
            set({
              aiState: {
                ...get().aiState,
                thinking: false,
                over: true,
              }
            });
            get().saveGameState();
            return;
          }
          
          // Add a new random tile
          const gridWithNewTile = addRandomTile(newGrid, aiState.obstacles, levelData.gridSize);
          
          // Check if the AI has won
          const aiWon = !aiState.won && !aiState.keepPlaying && 
                        hasWon(gridWithNewTile, levelData.winningValue);
          
          // Check if the game is over for AI
          const aiGameOver = isGameOver(gridWithNewTile, aiState.obstacles, levelData.gridSize);
          
          // Update the best score if needed
          const newBestScore = Math.max(aiState.bestScore, newScore);
          
          // Update the AI state
          set({
            aiState: {
              ...get().aiState,
              grid: gridWithNewTile,
              score: newScore,
              bestScore: newBestScore,
              won: aiWon || aiState.won,
              over: aiGameOver && !aiWon,
              thinking: false,
            }
          });
          
          get().saveGameState();
        }, 1000);
      },
      
      saveGameState: () => {
        // Save game state to storage
        storage.saveItem('gameState', {
          grid: get().grid,
          obstacles: get().obstacles,
          score: get().score,
          bestScore: get().bestScore,
          status: get().status,
          won: get().won,
          over: get().over,
          keepPlaying: get().keepPlaying,
          level: get().level,
          gridSize: get().gridSize,
          aiState: get().aiState,
          isDarkMode: get().isDarkMode,
          achievements: get().achievements,
          referralCode: get().referralCode,
          extraLives: get().extraLives,
          adConfig: get().adConfig
        });
      },
      
      loadGameState: async () => {
        try {
          // Load game state from storage
          const savedState = await storage.getItem('gameState');
          if (savedState) {
            set(savedState);
          }
        } catch (error) {
          console.log('Error loading game state:', error);
        }
      },
      
      setDarkMode: (isDark: boolean) => {
        set({ isDarkMode: isDark });
        get().saveGameState();
      },
      
      unlockAchievement: (achievement: string) => {
        const { achievements } = get();
        
        // Only add if not already achieved
        if (!achievements.includes(achievement)) {
          set({ achievements: [...achievements, achievement] });
          
          // Save achievement to storage
          storage.saveAchievement({
            title: achievement,
            description: "Achievement unlocked!",
            date: new Date().toISOString(),
            unlocked: true
          });
          
          get().saveGameState();
        }
      },
      
      generateReferralCode: () => {
        // Generate a unique referral code based on random characters
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        set({ referralCode: code });
        get().saveGameState();
      },
      
      applyReferralCode: (code: string) => {
        // In a real app, this would validate against a backend
        // For now, just check if it's a valid format and not the user's own code
        if (code && code.length === 8 && code !== get().referralCode) {
          // Award extra lives for using a referral code
          set({ extraLives: get().extraLives + 3 });
          get().saveGameState();
          return true;
        }
        return false;
      },
      
      useExtraLife: () => {
        const { extraLives, over } = get();
        
        // Can only use extra life if game is over and has lives
        if (over && extraLives > 0) {
          set({ 
            over: false,
            extraLives: extraLives - 1
          });
          get().saveGameState();
          return true;
        }
        return false;
      },
      
      addExtraLives: (amount: number) => {
        set({ extraLives: get().extraLives + amount });
        get().saveGameState();
      },
      
      updateAdConfig: (config: AdConfig) => {
        set({ adConfig: config });
        get().saveGameState();
      }
    }),
    {
      name: 'obstacle-2048-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        bestScore: state.bestScore,
        level: state.level,
        isDarkMode: state.isDarkMode,
        achievements: state.achievements,
        referralCode: state.referralCode,
        extraLives: state.extraLives,
        adConfig: state.adConfig,
        aiState: {
          bestScore: state.aiState.bestScore,
          persona: state.aiState.persona,
        }
      }),
    }
  )
);