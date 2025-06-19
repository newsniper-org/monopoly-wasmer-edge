import type { MonopolyConfig, UserConfig } from '../config/schema';
import type { Environment, EnvConfig } from '../config/env';

/**
 * Configuration provider interface
 */
export interface ConfigProvider {
  /**
   * Get the current configuration
   */
  getConfig(): MonopolyConfig;
  
  /**
   * Update the configuration
   * @param updates Partial configuration updates
   */
  updateConfig(updates: UserConfig): MonopolyConfig;
  
  /**
   * Reset the configuration to defaults
   */
  resetConfig(): MonopolyConfig;
}

/**
 * Configuration hook interface for frameworks that support hooks
 */
export interface ConfigHook {
  /**
   * Get the current configuration
   */
  (): MonopolyConfig;
  
  /**
   * Update the configuration
   * @param updates Partial configuration updates
   */
  update: (updates: UserConfig) => MonopolyConfig;
  
  /**
   * Reset the configuration to defaults
   */
  reset: () => MonopolyConfig;
}

/**
 * Define configuration function type
 */
export type DefineConfigFn = {
  /**
   * Define configuration with a user config object
   * @param config User configuration
   */
  (config: UserConfig): MonopolyConfig;
  
  /**
   * Define configuration with environment-specific config
   * @param config Environment configuration map
   * @param env Target environment
   */
  (config: EnvConfig, env?: Environment): MonopolyConfig;
};

export type NestedPartial<T> = {
	[key in keyof T]?: NestedPartial<T[key]>
};
