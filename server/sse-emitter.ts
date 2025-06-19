import type { Response } from 'express';
import { EventEmitter } from 'monopoly-core';

/**
 * Server-Sent Events implementation of event emitter
 */
export class SSEEventEmitter implements EventEmitter {
  private clients: Map<string, Map<string, Response>> = new Map();

  /**
   * Register a new SSE client
   * @param gameId Game ID
   * @param clientId Client ID
   * @param res Express response object
   */
  registerClient(gameId: string, clientId: string, res: Response): void {
    if (!this.clients.has(gameId)) {
      this.clients.set(gameId, new Map());
    }
    
    this.clients.get(gameId)!.set(clientId, res);
  }

  /**
   * Unregister an SSE client
   * @param gameId Game ID
   * @param clientId Client ID
   */
  unregisterClient(gameId: string, clientId: string): void {
    if (this.clients.has(gameId)) {
      this.clients.get(gameId)!.delete(clientId);
      
      // Clean up empty game entries
      if (this.clients.get(gameId)!.size === 0) {
        this.clients.delete(gameId);
      }
    }
  }

  /**
   * Emit an event to all clients for a game
   * @param gameId Game ID
   * @param eventType Event type
   * @param data Event data
   */
  emitEvent(gameId: string, eventType: string, data: any): void {
    if (!this.clients.has(gameId)) {
      return;
    }
    
    const gameClients = this.clients.get(gameId)!;
    
    for (const [clientId, res] of gameClients.entries()) {
      try {
        res.write(`data: ${JSON.stringify({
          type: eventType,
          gameId,
          data
        })}\n\n`);
      } catch (error) {
        console.error(`Error sending event to client ${clientId}:`, error);
        this.unregisterClient(gameId, clientId);
      }
    }
  }
}
