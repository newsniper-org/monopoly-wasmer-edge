import type { MonopolyConfig } from './schema';

/**
 * Default configuration values
 */
export const defaultConfig: MonopolyConfig = {
  game: {
    startingMoney: 1500,
    goSalary: 200,
    maxPlayers: 8,
    jailPosition: 10,
    maxDiceRolls: 3,
    auctionEnabled: true,
    freeParking: {
      collectFines: false,
      startingAmount: 0
    }
  },
  server: {
    port: 3001,
    host: '0.0.0.0',
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
  },
  matrix: {
    enabled: false
  },
  debug: false
};
