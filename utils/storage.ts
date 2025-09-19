import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface for storage operations that works across platforms
export interface StorageInterface {
  saveItem: (key: string, value: any) => Promise<void>;
  getItem: (key: string) => Promise<any>;
  removeItem: (key: string) => Promise<void>;
  saveGameSession: (session: GameSession) => Promise<void>;
  getGameSessions: () => Promise<GameSession[]>;
  saveAchievement: (achievement: Achievement) => Promise<void>;
  getAchievements: () => Promise<Achievement[]>;
}

// Types for database entities
export interface GameSession {
  id?: number;
  level: number;
  score: number;
  date: string;
  completed: boolean;
}

export interface Achievement {
  id?: number;
  title: string;
  description?: string;
  date: string;
  unlocked: boolean;
}

// Web storage implementation using AsyncStorage
class WebStorage implements StorageInterface {
  async saveItem(key: string, value: any): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }

  async getItem(key: string): Promise<any> {
    const value = await AsyncStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }

  async saveGameSession(session: GameSession): Promise<void> {
    const sessions = await this.getGameSessions();
    sessions.push({
      ...session,
      id: Date.now(), // Use timestamp as ID for web
    });
    await this.saveItem('game_sessions', sessions);
  }

  async getGameSessions(): Promise<GameSession[]> {
    const sessions = await this.getItem('game_sessions');
    return sessions || [];
  }

  async saveAchievement(achievement: Achievement): Promise<void> {
    const achievements = await this.getAchievements();
    // Check if achievement already exists
    const exists = achievements.some(a => a.title === achievement.title);
    if (!exists) {
      achievements.push({
        ...achievement,
        id: Date.now(), // Use timestamp as ID for web
      });
      await this.saveItem('achievements', achievements);
    }
  }

  async getAchievements(): Promise<Achievement[]> {
    const achievements = await this.getItem('achievements');
    return achievements || [];
  }
}

// Native storage implementation using SQLite
class NativeStorage implements StorageInterface {
  private db: SQLite.SQLiteDatabase;

  constructor() {
    // Use openDatabaseSync for native platforms
    if (Platform.OS !== 'web') {
      this.db = SQLite.openDatabaseSync('obstacle2048.db');
      this.initializeTables();
    } else {
      // This should never happen, but TypeScript needs it
      this.db = {} as SQLite.SQLiteDatabase;
    }
  }

  private initializeTables(): void {
    // For native platforms, we'll use AsyncStorage instead of SQLite for now
    // This is a workaround until we can properly fix the SQLite implementation
  }

  async saveItem(key: string, value: any): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }

  async getItem(key: string): Promise<any> {
    const value = await AsyncStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }

  async saveGameSession(session: GameSession): Promise<void> {
    const sessions = await this.getGameSessions();
    sessions.push({
      ...session,
      id: Date.now(), // Use timestamp as ID
    });
    await this.saveItem('game_sessions', sessions);
  }

  async getGameSessions(): Promise<GameSession[]> {
    const sessions = await this.getItem('game_sessions');
    return sessions || [];
  }

  async saveAchievement(achievement: Achievement): Promise<void> {
    const achievements = await this.getAchievements();
    // Check if achievement already exists
    const exists = achievements.some(a => a.title === achievement.title);
    if (!exists) {
      achievements.push({
        ...achievement,
        id: Date.now(), // Use timestamp as ID
      });
      await this.saveItem('achievements', achievements);
    }
  }

  async getAchievements(): Promise<Achievement[]> {
    const achievements = await this.getItem('achievements');
    return achievements || [];
  }
}

// Create and export the appropriate storage implementation based on platform
export const storage: StorageInterface = Platform.OS === 'web' 
  ? new WebStorage() 
  : new NativeStorage();