import { describe, it, expect, beforeEach, vi } from 'vitest';
import { defineConfig, getConfig, updateConfig, resetConfig } from '../src/config';

describe('Configuration System', () => {
  beforeEach(() => {
    // Reset config before each test
    resetConfig();
  });

  it('should initialize with default values', () => {
    const config = defineConfig({});
    expect(config.gameRules.startingMoney).toBe(1500);
    expect(config.ui.theme).toBe('classic');
    expect(config.network.useMatrix).toBe(true);
  });

  it('should override default values with user config', () => {
    const config = defineConfig({
      gameRules: {
        startingMoney: 2000,
        doubleMoneyOnGo: true
      },
      ui: {
        theme: 'dark'
      }
    });

    expect(config.gameRules.startingMoney).toBe(2000);
    expect(config.gameRules.doubleMoneyOnGo).toBe(true);
    expect(config.ui.theme).toBe('dark');
    // Other values should remain default
    expect(config.gameRules.auctionProperties).toBe(true);
  });

  it('should support environment-specific configuration', () => {
    // Mock getCurrentEnv to return 'development'
    vi.mock('../src/config/env', async () => {
      const actual = await vi.importActual('../src/config/env');
      return {
        ...actual,
        getCurrentEnv: () => 'development'
      };
    });

    const config = defineConfig({
      base: {
        gameRules: {
          startingMoney: 1500
        }
      },
      development: {
        debug: {
          enabled: true,
          logLevel: 'debug'
        }
      },
      production: {
        debug: {
          enabled: false,
          logLevel: 'error'
        }
      }
    });

    expect(config.gameRules.startingMoney).toBe(1500);
    expect(config.debug.enabled).toBe(true);
    expect(config.debug.logLevel).toBe('debug');
  });

  it('should allow runtime configuration updates', () => {
    // Initialize with default config
    defineConfig({});
    
    // Update at runtime
    const updated = updateConfig({
      gameRules: {
        auctionProperties: false
      },
      ai: {
        difficulty: 'hard'
      }
    });

    expect(updated.gameRules.auctionProperties).toBe(false);
    expect(updated.ai.difficulty).toBe('hard');
    // Other values should remain unchanged
    expect(updated.gameRules.startingMoney).toBe(1500);
  });

  it('should validate configuration values', () => {
    // Should throw for invalid values
    expect(() => {
      defineConfig({
        gameRules: {
          // @ts-expect-error - Invalid value for testing
          startingMoney: -100
        }
      });
    }).toThrow();

    // Should throw for invalid enum values
    expect(() => {
      defineConfig({
        ui: {
          // @ts-expect-error - Invalid value for testing
          theme: 'invalid-theme'
        }
      });
    }).toThrow();
  });

  it('should reset configuration to defaults', () => {
    // Initialize with custom config
    defineConfig({
      gameRules: {
        startingMoney: 2000
      }
    });
    
    // Reset to defaults
    const reset = resetConfig();
    
    expect(reset.gameRules.startingMoney).toBe(1500);
  });

  it('should get the current configuration', () => {
    // Initialize with custom config
    defineConfig({
      gameRules: {
        startingMoney: 2500
      }
    });
    
    // Get current config
    const current = getConfig();
    
    expect(current.gameRules.startingMoney).toBe(2500);
  });

  it('should throw if getConfig is called before initialization', () => {
    // Reset internal state
    resetConfig();
    
    // Force re-initialization by manipulating the internal state
    // This is a bit hacky but necessary to test this case
    const ConfigContext = (globalThis as any).__monopolyConfigContext;
    if (ConfigContext) {
      ConfigContext.initialized = false;
    }
    
    expect(() => {
      getConfig();
    }).toThrow('Configuration not initialized');
  });

  it('should deeply merge nested configuration objects', () => {
    const config = defineConfig({
      ui: {
        customTheme: {
          primary: '#FF0000',
          secondary: '#00FF00'
        }
      }
    });

    const updated = updateConfig({
      ui: {
        customTheme: {
          secondary: '#0000FF'
        }
      }
    });

    expect(updated.ui.customTheme?.primary).toBe('#FF0000');
    expect(updated.ui.customTheme?.secondary).toBe('#0000FF');
  });
});
