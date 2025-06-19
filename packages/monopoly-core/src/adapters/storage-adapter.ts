import type { GameState } from '../types';
import type { GameStorage } from '../services/game-service';

/**
 * Interface for storage implementations
 */
export interface StorageProvider {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  keys(): Promise<string[]>;
}

/**
 * Memory storage provider implementation
 */
export class MemoryStorageProvider implements StorageProvider {
  private storage: Map<string, string> = new Map();

  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async keys(): Promise<string[]> {
    return Array.from(this.storage.keys());
  }
}

/**
 * Storage adapter that implements GameStorage using a StorageProvider
 */
export class StorageAdapter implements GameStorage {
  private provider: StorageProvider;
  private prefix: string;

  /**
   * Create a new storage adapter
   * @param provider Storage provider implementation
   * @param prefix Key prefix for storage items
   */
  constructor(provider: StorageProvider, prefix: string = 'monopoly:game:') {
    this.provider = provider;
    this.prefix = prefix;
  }

  /**
   * Get a game by ID
   * @param gameId Game ID
   */
  async getGame(gameId: string): Promise<GameState | null> {
    const data = await this.provider.getItem(`${this.prefix}${gameId}`);
    if (!data) {
      return null;
    }
    
    try {
      return JSON.parse(data) as GameState;
    } catch (error) {
      console.error('Error parsing game data:', error);
      return null;
    }
  }

  /**
   * Save a game
   * @param gameState Game state to save
   */
  async saveGame(gameState: GameState): Promise<void> {
    await this.provider.setItem(
      `${this.prefix}${gameState.id}`,
      JSON.stringify(gameState)
    );
  }

  /**
   * List all game IDs
   */
  async listGames(): Promise<string[]> {
    const keys = await this.provider.keys();
    return keys
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.substring(this.prefix.length));
  }

  /**
   * Delete a game
   * @param gameId Game ID
   */
  async deleteGame(gameId: string): Promise<void> {
    await this.provider.removeItem(`${this.prefix}${gameId}`);
  }
}
