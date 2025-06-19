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

export interface Card {
  id: string;
  type: 'community' | 'chance';
  title: string;
  description: string;
  action: string;
  value?: number;
}

export interface GameAction {
  type: string;
  playerId: string;
  data?: any;
  timestamp: number;
}

export interface SSEMessage {
  type: 'gameUpdate' | 'playerJoined' | 'playerLeft' | 'gameAction';
  gameId: string;
  data: any;
}
