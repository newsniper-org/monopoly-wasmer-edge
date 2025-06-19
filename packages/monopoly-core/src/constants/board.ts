/**
 * Board positions by type
 */
export const BOARD_POSITIONS = {
  GO: 0,
  JAIL: 10,
  FREE_PARKING: 20,
  GO_TO_JAIL: 30,
  
  COMMUNITY_CHEST: [2, 17, 33],
  CHANCE: [7, 22, 36],
  
  RAILROADS: [5, 15, 25, 35],
  UTILITIES: [12, 28],
  
  TAXES: {
    INCOME_TAX: 4,
    LUXURY_TAX: 38
  }
};

/**
 * Board colors and their property IDs
 */
export const BOARD_COLORS = {
  BROWN: [1, 3],
  LIGHT_BLUE: [6, 8, 9],
  PURPLE: [11, 13, 14],
  ORANGE: [16, 18, 19],
  RED: [21, 23, 24],
  YELLOW: [26, 27, 29],
  GREEN: [31, 32, 34],
  BLUE: [37, 39]
};

/**
 * Special positions and their actions
 */
export const SPECIAL_POSITIONS = {
  [BOARD_POSITIONS.GO]: {
    action: 'COLLECT',
    value: 200,
    description: 'Collect $200 salary as you pass GO'
  },
  [BOARD_POSITIONS.JAIL]: {
    action: 'JAIL_VISIT',
    description: 'Just visiting jail'
  },
  [BOARD_POSITIONS.FREE_PARKING]: {
    action: 'FREE_PARKING',
    description: 'Free Parking'
  },
  [BOARD_POSITIONS.GO_TO_JAIL]: {
    action: 'GO_TO_JAIL',
    description: 'Go to Jail. Go directly to Jail, do not pass GO, do not collect $200'
  },
  [BOARD_POSITIONS.TAXES.INCOME_TAX]: {
    action: 'PAY',
    value: 200,
    description: 'Income Tax. Pay $200'
  },
  [BOARD_POSITIONS.TAXES.LUXURY_TAX]: {
    action: 'PAY',
    value: 100,
    description: 'Luxury Tax. Pay $100'
  }
};
