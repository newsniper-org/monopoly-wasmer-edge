import type { SSEMessage, GameState, GameAction } from '../types';

/**
 * Interface for network implementations
 */
export interface NetworkProvider {
  connect(gameId: string, onMessage: (message: SSEMessage) => void): Promise<() => void>;
  sendAction(gameId: string, action: GameAction): Promise<void>;
  createGame(players: any[]): Promise<string>;
  joinGame(gameId: string, player: any): Promise<void>;
  getGameState(gameId: string): Promise<GameState>;
}

/**
 * Network adapter for game communication
 */
export class NetworkAdapter {
  private provider: NetworkProvider;

  /**
   * Create a new network adapter
   * @param provider Network provider implementation
   */
  constructor(provider: NetworkProvider) {
    this.provider = provider;
  }

  /**
   * Connect to a game's real-time updates
   * @param gameId Game ID
   * @param onMessage Callback for received messages
   * @returns Disconnect function
   */
  async connect(gameId: string, onMessage: (message: SSEMessage) => void): Promise<() => void> {
    return this.provider.connect(gameId, onMessage);
  }

  /**
   * Send a game action
   * @param gameId Game ID
   * @param action Game action
   */
  async sendAction(gameId: string, action: GameAction): Promise<void> {
    return this.provider.sendAction(gameId, action);
  }

  /**
   * Create a new game
   * @param players Initial players
   */
  async createGame(players: any[]): Promise<string> {
    return this.provider.createGame(players);
  }

  /**
   * Join an existing game
   * @param gameId Game ID
   * @param player Player data
   */
  async joinGame(gameId: string, player: any): Promise<void> {
    return this.provider.joinGame(gameId, player);
  }

  /**
   * Get current game state
   * @param gameId Game ID
   */
  async getGameState(gameId: string): Promise<GameState> {
    return this.provider.getGameState(gameId);
  }
}
