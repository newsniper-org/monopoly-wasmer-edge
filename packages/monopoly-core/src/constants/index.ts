/**
 * Game board constants
 */
export const BOARD_SIZE = 40;
export const GO_POSITION = 0;
export const JAIL_POSITION = 10;
export const FREE_PARKING_POSITION = 20;
export const GO_TO_JAIL_POSITION = 30;

/**
 * Game rules constants
 */
export const STARTING_MONEY = 1500;
export const PASSING_GO_MONEY = 200;
export const MAX_DOUBLES_BEFORE_JAIL = 3;
export const MAX_JAIL_TURNS = 3;
export const JAIL_FEE = 50;

/**
 * Property types
 */
export const PROPERTY_TYPES = {
  PROPERTY: 'property',
  RAILROAD: 'railroad',
  UTILITY: 'utility',
  SPECIAL: 'special'
} as const;

/**
 * Game phases
 */
export const GAME_PHASES = {
  WAITING: 'waiting',
  ROLLING: 'rolling',
  MOVING: 'moving',
  BUYING: 'buying',
  TRADING: 'trading',
  ENDED: 'ended'
} as const;

/**
 * Event types
 */
export const EVENT_TYPES = {
  GAME_UPDATE: 'gameUpdate',
  PLAYER_JOINED: 'playerJoined',
  PLAYER_LEFT: 'playerLeft',
  GAME_ACTION: 'gameAction'
} as const;

/**
 * Action types
 */
export const ACTION_TYPES = {
  ROLL_DICE: 'ROLL_DICE',
  BUY_PROPERTY: 'BUY_PROPERTY',
  END_TURN: 'END_TURN',
  PAY_RENT: 'PAY_RENT',
  MORTGAGE_PROPERTY: 'MORTGAGE_PROPERTY',
  UNMORTGAGE_PROPERTY: 'UNMORTGAGE_PROPERTY',
  BUILD_HOUSE: 'BUILD_HOUSE',
  BUILD_HOTEL: 'BUILD_HOTEL',
  SELL_HOUSE: 'SELL_HOUSE',
  SELL_HOTEL: 'SELL_HOTEL',
  TRADE_OFFER: 'TRADE_OFFER',
  TRADE_ACCEPT: 'TRADE_ACCEPT',
  TRADE_REJECT: 'TRADE_REJECT',
  USE_GET_OUT_OF_JAIL_CARD: 'USE_GET_OUT_OF_JAIL_CARD',
  PAY_JAIL_FEE: 'PAY_JAIL_FEE',
  DECLARE_BANKRUPTCY: 'DECLARE_BANKRUPTCY'
} as const;
