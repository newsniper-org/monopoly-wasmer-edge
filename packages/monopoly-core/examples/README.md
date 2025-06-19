# Configuration System Examples

This directory contains examples of how to use the Monopoly core library's configuration system.

## Basic Usage

The simplest way to use the configuration system is with the `defineConfig` function:

```typescript
import { defineConfig } from 'monopoly-core';

const config = defineConfig({
  gameRules: {
    startingMoney: 2000,
    doubleMoneyOnGo: true
  },
  ui: {
    theme: 'dark'
