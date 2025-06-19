/**
 * Player representation in the game
 */
export interface Player {
  id: string;
  name: string;
  color: string;
  position: number;
  money: number;
  properties: Property[];
  inJail: boolean;
  jailTurns: number;
  isActive: boolean;
  avatar?: string;
}

/**
 * Property representation in the game
 */
export interface Property {
  id: number;
  name: string;
  type: 'property' | 'railroad' | 'utility' | 'special';
  color?: string;
  price: number;
  rent: number[];
  mortgageValue: number;
  houseCost?: number;
  hotelCost?: number;
  houses: number;
  hotels: number;
  owner?: string;
  mortgaged: boolean;
}

/**
 * Game state representation
 */
export interface GameState {
  id: string;
  players: Player[];
  currentPlayerIndex: number;
  phase: 'waiting' | 'rolling' | 'moving' | 'buying' | 'trading' | 'ended';
  dice: [number, number];
  lastRoll: number;
  doubleCount: number;
  properties: Property[];
  communityChestCards: Card[];
  chanceCards: Card[];
  freeParking: number;
  winner?: string;
  spectators: string[];
}

/**
 * Card representation for Chance and Community Chest
 */
export type ActionType = {
	type: 'COLLECT' | 'PAY' | 'COLLECT_FROM_PLAYERS' | 'PAY_TO_PLAYERS' | 'MOVE_BACK' | 'ADVANCE_TO',
	value: number
} | {
	type: 'GO_TO_JAIL' | 'GET_OUT_OF_JAIL'
} | {
	type: 'REPAIRS',
	value: {house: number, hotel: number}
} | {
	type: 'ADVANCE_TO_NEAREST',
	value: string
};

export interface Card {
  id: string;
  type: 'community' | 'chance';
  title: string;
  description: string;
  action: ActionType
}

/**
 * Game action representation
 */
export interface GameAction {
  type: string;
  playerId: string;
  data?: any;
  timestamp: number;
}

/**
 * Server-sent event message structure
 */
export interface SSEMessage {
  type: 'gameUpdate' | 'playerJoined' | 'playerLeft' | 'gameAction';
  gameId: string;
  data: any;
}
