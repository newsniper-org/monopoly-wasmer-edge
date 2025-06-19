import { defineConfig, getConfig, updateConfig, resetConfig } from '../src/config';

// Basic configuration
console.log('Defining basic configuration...');
const config = defineConfig({
  gameRules: {
    startingMoney: 2000,
    doubleMoneyOnGo: true
  },
  ui: {
    theme: 'dark'
  }
});

console.log('Basic configuration:', config);

// Environment-specific configuration
console.log('\nDefining environment-specific configuration...');
const envConfig = defineConfig({
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

console.log('Environment-specific configuration:', envConfig);

// Get current configuration
console.log('\nGetting current configuration...');
const currentConfig = getConfig();
console.log('Current configuration:', currentConfig);

// Update configuration at runtime
console.log('\nUpdating configuration at runtime...');
const updatedConfig = updateConfig({
  gameRules: {
    auctionProperties: false
  },
  ai: {
    difficulty: 'hard'
  }
});

console.log('Updated configuration:', updatedConfig);

// Reset configuration to defaults
console.log('\nResetting configuration to defaults...');
const resetedConfig = resetConfig();
console.log('Reset configuration:', resetedConfig);

// Example with validation error
try {
  console.log('\nTrying invalid configuration...');
  defineConfig({
    gameRules: {
      // @ts-expect-error - Invalid value for testing
      startingMoney: -100
    }
  });
} catch (error) {
  console.error('Validation error caught:', error.message);
}
