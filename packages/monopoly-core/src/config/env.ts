import type { UserConfig } from './schema';

/**
 * Environment types
 */
export type Environment = 'development' | 'staging' | 'production' | 'test';

/**
 * Environment-specific configuration
 */
export interface EnvConfig {
  base?: UserConfig;
  development?: UserConfig;
  staging?: UserConfig;
  production?: UserConfig;
  test?: UserConfig;
}

/**
 * Load environment-specific configuration
 * @param config Environment configuration map
 * @param env Target environment (defaults to process.env.NODE_ENV or 'development')
 */
export function loadEnvConfig(config: EnvConfig, env?: Environment): UserConfig {
  // Determine current environment
  const currentEnv = env || (process.env.NODE_ENV as Environment) || 'development';
  
  // Start with base config
  const baseConfig = config.base || {};
  
  // Merge with environment-specific config
  const envConfig = config[currentEnv] || {};
  
  // Return merged config
  return {
    ...baseConfig,
    ...envConfig
  };
}
