import { EventEmitter } from '../services/event-service';
import { SSEMessage } from '../types';

/**
 * Interface for SSE client
 */
export interface SSEClient {
  write(data: string): void;
}

/**
 * SSE implementation of event emitter
 */
export class SSEEventEmitter implements EventEmitter {
  private clients: Map<string, Map<string, SSEClient>> = new Map();

  /**
   * Register a client for a game
   * @param gameId Game ID
   * @param clientId Client ID
   * @param client SSE client
   */
  registerClient(gameId: string, clientId: string, client: SSEClient): void {
    if (!this.clients.has(gameId)) {
      this.clients.set(gameId, new Map());
    }
    
    this.clients.get(gameId)!.set(clientId, client);
  }

  /**
   * Unregister a client
   * @param gameId Game ID
   * @param clientId Client ID
   */
  unregisterClient(gameId: string, clientId: string): void {
    const gameClients = this.clients.get(gameId);
    if (gameClients) {
      gameClients.delete(clientId);
      if (gameClients.size === 0) {
        this.clients.delete(gameId);
      }
    }
  }

  /**
   * Emit an event to all clients for a game
   * @param gameId Game ID
   * @param message SSE message
   */
  emit(gameId: string, message: SSEMessage): void {
    const gameClients = this.clients.get(gameId);
    if (gameClients) {
      const data = `data: ${JSON.stringify(message)}\n\n`;
      gameClients.forEach(client => {
        try {
          client.write(data);
        } catch (error) {
          console.error('Error broadcasting to client:', error);
        }
      });
    }
  }

  /**
   * Subscribe to events for a game
   * @param gameId Game ID
   * @param callback Callback function
   */
  subscribe(_gameId: string, _callback: (message: SSEMessage) => void): () => void {
    // This is a no-op for SSE as it's a one-way communication
    // The actual subscription happens through the registerClient method
    return () => {};
  }
}
