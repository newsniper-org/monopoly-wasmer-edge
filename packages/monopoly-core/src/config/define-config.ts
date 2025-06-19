import { configSchema, type UserConfig, type MonopolyConfig } from './schema';
import { defaultConfig } from './defaults';
import { loadEnvConfig, type EnvConfig, type Environment } from './env';
import { type NestedPartial } from '../types/config'

/**
 * Configuration context for storing and accessing the current configuration
 */
class ConfigContext {
  private static instance: ConfigContext;
  private config: MonopolyConfig = defaultConfig;
  private initialized = false;

  private constructor() {}

  /**
   * Get the singleton instance
   */
  public static getInstance(): ConfigContext {
    if (!ConfigContext.instance) {
      ConfigContext.instance = new ConfigContext();
    }
    return ConfigContext.instance;
  }

  /**
   * Initialize configuration
   * @param userConfig User configuration
   */
  public initialize(userConfig: UserConfig): MonopolyConfig {
    // Merge with default config
    const mergedConfig = this.mergeConfigs(defaultConfig, userConfig);
    
    // Validate the merged config
    try {
      this.config = configSchema.parse(mergedConfig);
    } catch (error) {
      console.error('Invalid configuration:', error);
      throw new Error('Invalid configuration. See console for details.');
    }
    
    this.initialized = true;
    return this.getConfig();
  }

  /**
   * Get current configuration
   * @throws Error if configuration is not initialized
   */
  public getConfig(): MonopolyConfig {
    if (!this.initialized) {
      throw new Error('Configuration not initialized. Call defineConfig first.');
    }
    return { ...this.config };
  }

  /**
   * Update configuration at runtime
   * @param updates Partial configuration updates
   */
  public updateConfig(updates: UserConfig): MonopolyConfig {
    if (!this.initialized) {
      throw new Error('Configuration not initialized. Call defineConfig first.');
    }
    
    // Merge with current config
    const mergedConfig = this.mergeConfigs(this.config, updates);
    
    // Validate the merged config
    try {
      this.config = configSchema.parse(mergedConfig);
    } catch (error) {
      console.error('Invalid configuration update:', error);
      throw new Error('Invalid configuration update. See console for details.');
    }
    
    return this.getConfig();
  }

  /**
   * Reset configuration to defaults
   */
  public resetConfig(): MonopolyConfig {
    this.config = defaultConfig;
    return this.getConfig();
  }

  /**
   * Deep merge configurations
   * @param target Target configuration
   * @param source Source configuration
   */
  private mergeConfigs<T>(target: T, source: NestedPartial<T>): T {
    const result: T = { ...target };
    
    for (const key of Object.keys(source) as Array<keyof T>) {
      if (source[key] === undefined) {
        continue;
      } else if (
        source[key] !== null &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        target[key] !== null &&
        typeof target[key] === 'object' &&
        !Array.isArray(target[key])
      ) {
        // Recursively merge nested objects
        result[key] = this.mergeConfigs(target[key], source[key]);
      } else {
        // Replace value
        result[key] = source[key] as T[typeof key];
      }
    }
    
    return result;
  }
}

/**
 * Define Monopoly configuration
 * @param config User configuration or environment-specific configuration map
 * @param env Target environment (only used if config is an environment map)
 * @returns Resolved configuration
 */
export function defineConfig(
  config: UserConfig | EnvConfig,
  env?: Environment
): MonopolyConfig {
  // Check if config is an environment map
  if ('base' in config || 
      'development' in config || 
      'staging' in config || 
      'production' in config || 
      'test' in config) {
    // Load environment-specific config
    const envConfig = loadEnvConfig(config as EnvConfig, env);
    return ConfigContext.getInstance().initialize(envConfig);
  }
  
  // Regular config
  return ConfigContext.getInstance().initialize(config as UserConfig);
}

/**
 * Get current configuration
 * @throws Error if configuration is not initialized
 */
export function getConfig(): MonopolyConfig {
  return ConfigContext.getInstance().getConfig();
}

/**
 * Update configuration at runtime
 * @param updates Partial configuration updates
 */
export function updateConfig(updates: UserConfig): MonopolyConfig {
  return ConfigContext.getInstance().updateConfig(updates);
}

/**
 * Reset configuration to defaults
 */
export function resetConfig(): MonopolyConfig {
  return ConfigContext.getInstance().resetConfig();
}
