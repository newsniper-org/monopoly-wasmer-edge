import { z } from 'zod';

/**
 * Game configuration schema
 */
export const gameConfigSchema = z.object({
  startingMoney: z.number().min(0).default(1500),
  goSalary: z.number().min(0).default(200),
  maxPlayers: z.number().min(2).max(8).default(8),
  jailPosition: z.number().min(0).max(39).default(10),
  maxDiceRolls: z.number().min(1).default(3),
  auctionEnabled: z.boolean().default(true),
  freeParking: z.object({
    collectFines: z.boolean().default(false),
    startingAmount: z.number().min(0).default(0)
  }).default({})
});

/**
 * Server configuration schema
 */
export const serverConfigSchema = z.object({
  port: z.number().min(1).max(65535).default(3001),
  host: z.string().default('0.0.0.0'),
  cors: z.object({
    origin: z.union([z.string(), z.array(z.string())]).default('*'),
    methods: z.array(z.string()).default(['GET', 'POST', 'PUT', 'DELETE'])
  }).default({})
});

/**
 * Matrix configuration schema
 */
export const matrixConfigSchema = z.object({
  enabled: z.boolean().default(false),
  homeserver: z.string().url().optional(),
  accessToken: z.string().optional()
}).refine(data => {
  // If Matrix is enabled, homeserver and accessToken are required
  if (data.enabled) {
    return !!data.homeserver && !!data.accessToken;
  }
  return true;
}, {
  message: 'homeserver and accessToken are required when Matrix is enabled'
});

/**
 * Complete configuration schema
 */
export const configSchema = z.object({
  game: gameConfigSchema.default({}),
  server: serverConfigSchema.default({}),
  matrix: matrixConfigSchema.default({}),
  debug: z.boolean().default(false)
});

/**
 * User configuration type (partial configuration)
 */
export type UserConfig = z.input<typeof configSchema>;

/**
 * Monopoly configuration type (complete configuration)
 */
export type MonopolyConfig = z.infer<typeof configSchema>;
