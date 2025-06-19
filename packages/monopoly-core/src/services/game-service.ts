import { v4 as uuidv4 } from 'uuid';
import type { GameState, Player, GameAction } from '../types';
import { Game } from '../models/game';

/**
 * Interface for game storage implementations
 */
export interface GameStorage {
  getGame(gameId: string): Promise<GameState | null>;
  saveGame(gameState: GameState): Promise<void>;
  listGames(): Promise<string[]>;
  deleteGame(gameId: string): Promise<void>;
}

/**
 * Game service for managing game operations
 */
export class GameService {
  private storage: GameStorage;
  private games: Map<string, Game> = new Map();

  /**
   * Create a new game service
   * @param storage Game storage implementation
   */
  constructor(storage: GameStorage) {
    this.storage = storage;
  }

  /**
   * Create a new game
   * @param players Initial players
   */
  async createGame(players: Omit<Player, 'position' | 'money' | 'properties' | 'inJail' | 'jailTurns' | 'isActive'>[]): Promise<string> {
    const gameId = uuidv4();
    const game = new Game(players, gameId);
    
    this.games.set(gameId, game);
    await this.storage.saveGame(game.getState());
    
    return gameId;
  }

  /**
   * Get a game by ID
   * @param gameId Game ID
   */
  async getGame(gameId: string): Promise<Game> {
    // Check in-memory cache first
    if (this.games.has(gameId)) {
      return this.games.get(gameId)!;
    }

    // Load from storage
    const gameState = await this.storage.getGame(gameId);
    if (!gameState) {
      throw new Error(`Game with ID ${gameId} not found`);
    }

    // Reconstruct game from state
    const players = gameState.players.map(p => ({
      id: p.id,
      name: p.name,
      color: p.color,
      avatar: p.avatar
    }));
    
    const game = new Game(players, gameId);
    game.updateState(() => gameState);
    
    // Cache for future use
    this.games.set(gameId, game);
    
    return game;
  }

  /**
   * Process a game action
   * @param gameId Game ID
   * @param action Game action
   */
  async processAction(gameId: string, action: GameAction): Promise<GameState> {
    const game = await this.getGame(gameId);
    
    switch (action.type) {
      case 'ROLL_DICE':
        game.rollDice();
        break;
        
      case 'BUY_PROPERTY':
        game.buyProperty(action.data.propertyId);
        break;
        
      case 'END_TURN':
        game.endTurn();
        break;
        
      // Add more action handlers as needed
        
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
    
    const updatedState = game.getState();
    await this.storage.saveGame(updatedState);
    
    return updatedState;
  }

  /**
   * Add a player to a game
   * @param gameId Game ID
   * @param player Player to add
   */
  async addPlayer(gameId: string, player: Omit<Player, 'position' | 'money' | 'properties' | 'inJail' | 'jailTurns' | 'isActive'>): Promise<GameState> {
    const game = await this.getGame(gameId);
    
    const updatedState = game.updateState(state => {
      return {
        ...state,
        players: [
          ...state.players,
          {
            ...player,
            position: 0,
            money: 1500,
            properties: [],
            inJail: false,
            jailTurns: 0,
            isActive: true
          }
        ]
      };
    });
    
    await this.storage.saveGame(updatedState);
    
    return updatedState;
  }

  /**
   * Add a spectator to a game
   * @param gameId Game ID
   * @param spectatorId Spectator ID
   */
  async addSpectator(gameId: string, spectatorId: string): Promise<GameState> {
    const game = await this.getGame(gameId);
    const updatedState = game.addSpectator(spectatorId);
    await this.storage.saveGame(updatedState);
    return updatedState;
  }

  /**
   * Remove a spectator from a game
   * @param gameId Game ID
   * @param spectatorId Spectator ID
   */
  async removeSpectator(gameId: string, spectatorId: string): Promise<GameState> {
    const game = await this.getGame(gameId);
    const updatedState = game.removeSpectator(spectatorId);
    await this.storage.saveGame(updatedState);
    return updatedState;
  }

  /**
   * List all available games
   */
  async listGames(): Promise<string[]> {
    return this.storage.listGames();
  }

  /**
   * Delete a game
   * @param gameId Game ID
   */
  async deleteGame(gameId: string): Promise<void> {
    this.games.delete(gameId);
    await this.storage.deleteGame(gameId);
  }
}
