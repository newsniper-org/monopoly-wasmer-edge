/**
 * Base event interface for all game events
 */
export interface GameEvent {
  type: string;
  gameId: string;
  timestamp: number;
  playerId?: string;
}

/**
 * Player joined event
 */
export interface PlayerJoinedEvent extends GameEvent {
  type: 'PLAYER_JOINED';
  player: {
    id: string;
    name: string;
    color: string;
    avatar?: string;
  };
}

/**
 * Player left event
 */
export interface PlayerLeftEvent extends GameEvent {
  type: 'PLAYER_LEFT';
  playerId: string;
}

/**
 * Dice rolled event
 */
export interface DiceRolledEvent extends GameEvent {
  type: 'DICE_ROLLED';
  dice: [number, number];
}

/**
 * Property purchased event
 */
export interface PropertyPurchasedEvent extends GameEvent {
  type: 'PROPERTY_PURCHASED';
  propertyId: number;
  price: number;
}

/**
 * Turn ended event
 */
export interface TurnEndedEvent extends GameEvent {
  type: 'TURN_ENDED';
  nextPlayerId: string;
}

/**
 * Union type of all game events
 */
export type MonopolyEvent = 
  | PlayerJoinedEvent
  | PlayerLeftEvent
  | DiceRolledEvent
  | PropertyPurchasedEvent
  | TurnEndedEvent;
