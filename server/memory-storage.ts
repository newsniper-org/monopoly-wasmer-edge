import type { GameState } from 'monopoly-core';
import { GameStorage } from 'monopoly-core';

/**
 * In-memory implementation of game storage
 */
export class MemoryGameStorage implements GameStorage {
  private games: Map<string, GameState> = new Map();

  /**
   * Get a game by ID
   * @param gameId Game ID
   */
  async getGame(gameId: string): Promise<GameState | null> {
    return this.games.get(gameId) || null;
  }

  /**
   * Save a game state
   * @param gameState Game state to save
   */
  async saveGame(gameState: GameState): Promise<void> {
    this.games.set(gameState.id, gameState);
  }

  /**
   * List all available games
   */
  async listGames(): Promise<string[]> {
    return Array.from(this.games.keys());
  }

  /**
   * Delete a game
   * @param gameId Game ID
   */
  async deleteGame(gameId: string): Promise<void> {
    this.games.delete(gameId);
  }
}
