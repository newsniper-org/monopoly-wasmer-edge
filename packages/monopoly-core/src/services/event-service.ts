import { SSEMessage } from '../types';

/**
 * Interface for event emitter implementations
 */
export interface EventEmitter {
  emit(gameId: string, message: SSEMessage): void;
  subscribe(gameId: string, callback: (message: SSEMessage) => void): () => void;
}

/**
 * Service for managing game events
 */
export class EventService {
  private emitter: EventEmitter;

  /**
   * Create a new event service
   * @param emitter Event emitter implementation
   */
  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
  }

  /**
   * Emit an event for a game
   * @param gameId Game ID
   * @param type Event type
   * @param data Event data
   */
  emitEvent(gameId: string, type: SSEMessage['type'], data: any): void {
    this.emitter.emit(gameId, {
      type,
      gameId,
      data
    });
  }

  /**
   * Subscribe to events for a game
   * @param gameId Game ID
   * @param callback Callback function
   * @returns Unsubscribe function
   */
  subscribeToEvents(gameId: string, callback: (message: SSEMessage) => void): () => void {
    return this.emitter.subscribe(gameId, callback);
  }
}
