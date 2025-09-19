// Game types

export type Direction = 'up' | 'right' | 'down' | 'left';

export interface Position {
  x: number;
  y: number;
}

export interface Tile {
  id: string;
  value: number;
  position: Position;
  mergedFrom?: Tile[];
  isNew?: boolean;
}

export interface Obstacle {
  id: string;
  type: 'wall' | 'portal' | 'multiplier';
  position: Position;
}

export type AIPersona = 'Balanced Betty' | 'Aggressive Alex' | 'Defensive Dana' | 'Strategic Sam' | 'Random Randy' | 'Cautious Carl' | 'Risky Rachel' | 'Corner Connie' | 'Merge Master';

export interface AIState {
  grid: (Tile | null)[][];
  obstacles: Obstacle[];
  score: number;
  bestScore: number;
  status: 'idle' | 'playing' | 'paused';
  won: boolean;
  over: boolean;
  keepPlaying: boolean;
  persona: AIPersona;
  thinking: boolean;
  level: number;
}

export interface GameState {
  grid: (Tile | null)[][];
  obstacles: Obstacle[];
  score: number;
  bestScore: number;
  status: 'idle' | 'playing' | 'paused';
  won: boolean;
  over: boolean;
  keepPlaying: boolean;
  level: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  gridSize: number;
}

export interface ShareContent {
  score: number;
  level: number;
  aiPersona: AIPersona;
  aiScore: number;
  playerWon: boolean;
}

export interface Achievement {
  id?: string;
  title: string;
  description: string;
  unlocked: boolean;
  date?: string;
  icon?: string;
}

export interface GameSession {
  id?: number;
  level: number;
  score: number;
  date: string;
  completed: boolean;
}

export interface ReferralInfo {
  code: string;
  usedBy: number;
  rewards: number;
}

export interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  highestTile: number;
  totalScore: number;
  achievements: Achievement[];
  referrals: ReferralInfo;
}

export interface AppSettings {
  isDarkMode: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  notificationsEnabled: boolean;
  language: string;
}

export interface AdConfig {
  interstitialFrequency: number; // Show after every X games
  rewardedAvailable: boolean;
  bannerPosition: 'top' | 'bottom';
  lastAdShown: string; // ISO date string
}

export interface DeepLinkParams {
  level?: number;
  score?: number;
  referralCode?: string;
  source?: string;
}

export interface NotificationConfig {
  dailyReminder: boolean;
  achievementNotifications: boolean;
  updateNotifications: boolean;
  reminderTime: string; // HH:MM format
}

export interface AnalyticsEvent {
  name: string;
  properties: Record<string, any>;
  timestamp: string;
}

export interface AdReward {
  type: 'coins' | 'lives' | 'hints';
  amount: number;
}