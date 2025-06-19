# Testing Guide

## 🧪 Testing Strategy

### Test Pyramid
```
    /\
   /  \     E2E Tests (10%)
  /____\    Integration Tests (20%)
 /______\   Unit Tests (70%)
```

## 🔧 Setup

### Test Dependencies
```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "vitest": "^1.0.0",
    "jsdom": "^23.0.0",
    "playwright": "^1.40.0",
    "supertest": "^6.3.0",
    "ws": "^8.16.0"
  }
}
```

### Vitest Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*'
      ]
    }
  }
});
```

## 🎯 Unit Tests

### Game Logic Tests
```typescript
// src/test/gameLogic.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { GameTestHarness } from './utils/GameTestHarness';
import type { GameState, Player } from '../types/game';

describe('Game Logic', () => {
  let harness: GameTestHarness;

  beforeEach(() => {
    harness = new GameTestHarness({
      players: [
        { id: 'p1', name: 'Alice', color: 'red', position: 0, money: 1500 },
        { id: 'p2', name: 'Bob', color: 'blue', position: 0, money: 1500 }
      ]
    });
  });

  describe('Dice Rolling', () => {
    it('should advance player position', () => {
      harness.simulateAction({
        type: 'ROLL_DICE',
        playerId: 'p1',
        data: { dice: [3, 4] },
        timestamp: Date.now()
      });

      harness.assertPlayerPosition('p1', 7);
    });

    it('should handle passing GO', () => {
      harness.setPlayerPosition('p1', 38);
      
      harness.simulateAction({
        type: 'ROLL_DICE',
        playerId: 'p1',
        data: { dice: [3, 4] },
        timestamp: Date.now()
      });

      harness.assertPlayerPosition('p1', 1); // 38 + 7 - 40 = 5, but landed on GO first
      harness.assertPlayerMoney('p1', 1700); // 1500 + 200 for passing GO
    });

    it('should handle doubles correctly', () => {
      harness.simulateAction({
        type: 'ROLL_DICE',
        playerId: 'p1',
        data: { dice: [3, 3] },
        timestamp: Date.now()
      });

      const gameState = harness.getGameState();
      expect(gameState.doubleCount).toBe(1);
      expect(gameState.currentPlayerIndex).toBe(0); // Still player 1's turn
    });

    it('should send to jail on third double', () => {
      // First double
      harness.simulateAction({
        type: 'ROLL_DICE',
        playerId: 'p1',
        data: { dice: [2, 2] },
        timestamp: Date.now()
      });

      // Second double
      harness.simulateAction({
        type: 'ROLL_DICE',
        playerId: 'p1',
        data: { dice: [4, 4] },
        timestamp: Date.now()
      });

      // Third double - should go to jail
      harness.simulateAction({
        type: 'ROLL_DICE',
        playerId: 'p1',
        data: { dice: [1, 1] },
        timestamp: Date.now()
      });

      harness.assertPlayerPosition('p1', 10); // Jail position
      harness.assertPlayerInJail('p1', true);
    });
  });

  describe('Property Purchase', () => {
    it('should allow buying unowned property', () => {
      harness.setPlayerPosition('p1', 1); // Mediterranean Avenue
      
      harness.simulateAction({
        type: 'BUY_PROPERTY',
        playerId: 'p1',
        data: { propertyId: 1, price: 60 },
        timestamp: Date.now()
      });

      harness.assertPropertyOwner(1, 'p1');
      harness.assertPlayerMoney('p1', 1440); // 1500 - 60
    });

    it('should prevent buying owned property', () => {
      harness.setPropertyOwner(1, 'p2');
      harness.setPlayerPosition('p1', 1);

      expect(() => {
        harness.simulateAction({
          type: 'BUY_PROPERTY',
          playerId: 'p1',
          data: { propertyId: 1, price: 60 },
          timestamp: Date.now()
        });
      }).toThrow('Property already owned');
    });

    it('should prevent buying with insufficient funds', () => {
      harness.setPlayerMoney('p1', 50);
      harness.setPlayerPosition('p1', 1);

      expect(() => {
        harness.simulateAction({
          type: 'BUY_PROPERTY',
          playerId: 'p1',
          data: { propertyId: 1, price: 60 },
          timestamp: Date.now()
        });
      }).toThrow('Insufficient funds');
    });
  });

  describe('Rent Collection', () => {
    it('should collect rent when landing on owned property', () => {
      harness.setPropertyOwner(1, 'p2');
      harness.setPlayerPosition('p1', 1);

      harness.simulateAction({
        type: 'LAND_ON_PROPERTY',
        playerId: 'p1',
        data: { propertyId: 1 },
        timestamp: Date.now()
      });

      harness.assertPlayerMoney('p1', 1498); // 1500 - 2 (rent)
      harness.assertPlayerMoney('p2', 1502); // 1500 + 2 (rent)
    });

    it('should not collect rent from property owner', () => {
      harness.setPropertyOwner(1, 'p1');
      harness.setPlayerPosition('p1', 1);

      harness.simulateAction({
        type: 'LAND_ON_PROPERTY',
        playerId: 'p1',
        data: { propertyId: 1 },
        timestamp: Date.now()
      });

      harness.assertPlayerMoney('p1', 1500); // No change
    });
  });
});
```

### Component Tests
```typescript
// src/test/components/MonopolyBoard.test.tsx
import { render, screen } from '@testing-library/solid';
import { describe, it, expect, vi } from 'vitest';
import MonopolyBoard from '../../components/MonopolyBoard';
import { GameProvider } from '../../contexts/GameContext';

const mockGameState = {
  id: 'test-game',
  players: [
    { id: 'p1', name: 'Alice', color: 'red', position: 5, money: 1500 },
    { id: 'p2', name: 'Bob', color: 'blue', position: 12, money: 1200 }
  ],
  currentPlayerIndex: 0,
  phase: 'waiting',
  dice: [0, 0],
  properties: [],
  freeParking: 0
};

vi.mock('../../contexts/GameContext', () => ({
  useGame: () => ({
    gameState: () => mockGameState
  })
}));

describe('MonopolyBoard', () => {
  it('should render the board with all properties', () => {
    render(() => (
      <GameProvider>
        <MonopolyBoard />
      </GameProvider>
    ));

    expect(screen.getByText('MONOPOLY')).toBeInTheDocument();
    expect(screen.getByText('Mediterranean Avenue')).toBeInTheDocument();
    expect(screen.getByText('Boardwalk')).toBeInTheDocument();
  });

  it('should display players at correct positions', () => {
    render(() => (
      <GameProvider>
        <MonopolyBoard />
      </GameProvider>
    ));

    // Check if player pieces are rendered
    const playerPieces = screen.getAllByTitle(/Alice|Bob/);
    expect(playerPieces).toHaveLength(2);
  });

  it('should highlight current player turn', () => {
    render(() => (
      <GameProvider>
        <MonopolyBoard />
      </GameProvider>
    ));

    expect(screen.getByText('Current Player: Alice')).toBeInTheDocument();
  });
});
```

### Context Tests
```typescript
// src/test/contexts/GameContext.test.tsx
import { renderHook, act } from '@testing-library/solid';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GameProvider, useGame } from '../../contexts/GameContext';

// Mock fetch
global.fetch = vi.fn();

describe('GameContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a new game', async () => {
    const mockResponse = { gameId: 'test-game-123' };
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const { result } = renderHook(() => useGame(), {
      wrapper: GameProvider
    });

    let gameId: string;
    await act(async () => {
      gameId = await result.createGame([
        { id: 'p1', name: 'Alice', color: 'red' }
      ]);
    });

    expect(gameId!).toBe('test-game-123');
    expect(fetch).toHaveBeenCalledWith('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        players: [{ id: 'p1', name: 'Alice', color: 'red' }]
      })
    });
  });

  it('should handle SSE messages', async () => {
    const { result } = renderHook(() => useGame(), {
      wrapper: GameProvider
    });

    // Simulate SSE message
    const mockGameState = {
      id: 'test-game',
      players: [{ id: 'p1', name: 'Alice' }],
      currentPlayerIndex: 0
    };

    act(() => {
      // Simulate receiving SSE message
      window.dispatchEvent(new CustomEvent('sse-message', {
        detail: {
          type: 'gameUpdate',
          data: mockGameState
        }
      }));
    });

    expect(result.gameState()).toEqual(mockGameState);
  });
});
```

## 🔗 Integration Tests

### API Integration Tests
```typescript
// src/test/integration/api.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../server/index';

describe('Game API Integration', () => {
  let gameId: string;

  it('should create a new game', async () => {
    const response = await request(app)
      .post('/api/games')
      .send({
        players: [
          { id: 'p1', name: 'Alice', color: 'red' },
          { id: 'p2', name: 'Bob', color: 'blue' }
        ]
      })
      .expect(200);

    expect(response.body).toHaveProperty('gameId');
    gameId = response.body.gameId;
  });

  it('should join an existing game', async () => {
    await request(app)
      .post(`/api/games/${gameId}/join`)
      .send({
        player: { id: 'p3', name: 'Charlie', color: 'green' }
      })
      .expect(200);
  });

  it('should handle game actions', async () => {
    await request(app)
      .post(`/api/games/${gameId}/actions`)
      .send({
        type: 'ROLL_DICE',
        playerId: 'p1',
        data: { dice: [3, 4] },
        timestamp: Date.now()
      })
      .expect(200);
  });

  it('should get game state', async () => {
    const response = await request(app)
      .get(`/api/games/${gameId}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', gameId);
    expect(response.body).toHaveProperty('players');
    expect(response.body.players).toHaveLength(3);
  });

  it('should handle invalid game ID', async () => {
    await request(app)
      .get('/api/games/invalid-id')
      .expect(404);
  });
});
```

### SSE Integration Tests
```typescript
// src/test/integration/sse.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { EventSource } from 'eventsource';
import { app } from '../../server/index';

describe('SSE Integration', () => {
  let server: any;
  let gameId: string;

  beforeAll(async () => {
    server = app.listen(0);
    const port = server.address().port;
    
    // Create a test game
    const response = await fetch(`http://localhost:${port}/api/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        players: [{ id: 'p1', name: 'Alice', color: 'red' }]
      })
    });
    
    const data = await response.json();
    gameId = data.gameId;
  });

  afterAll(() => {
    server.close();
  });

  it('should receive game updates via SSE', (done) => {
    const port = server.address().port;
    const eventSource = new EventSource(`http://localhost:${port}/sse/game/${gameId}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'gameUpdate') {
        expect(data).toHaveProperty('gameId', gameId);
        expect(data).toHaveProperty('data');
        eventSource.close();
        done();
      }
    };

    eventSource.onerror = (error) => {
      eventSource.close();
      done(error);
    };

    // Trigger an action to generate an update
    setTimeout(async () => {
      await fetch(`http://localhost:${port}/api/games/${gameId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ROLL_DICE',
          playerId: 'p1',
          data: { dice: [2, 3] },
          timestamp: Date.now()
        })
      });
    }, 100);
  });
});
```

## 🎭 End-to-End Tests

### Playwright E2E Tests
```typescript
// e2e/game-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Monopoly Game Flow', () => {
  test('should complete a full game turn', async ({ page, context }) => {
    // Create two browser contexts for multiplayer testing
    const player2Page = await context.newPage();

    // Player 1 setup
    await page.goto('/');
    await page.fill('[data-testid="homeserver-input"]', 'https://matrix.org');
    await page.fill('[data-testid="username-input"]', 'test-player-1');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Wait for login and create game
    await expect(page.locator('[data-testid="create-game-button"]')).toBeVisible();
    await page.click('[data-testid="create-game-button"]');

    // Add players
    await page.fill('[data-testid="player-name-input"]', 'Alice');
    await page.click('[data-testid="color-red"]');
    await page.click('[data-testid="add-player-button"]');

    await page.fill('[data-testid="player-name-input"]', 'Bob');
    await page.click('[data-testid="color-blue"]');
    await page.click('[data-testid="add-player-button"]');

    // Start game
    await page.click('[data-testid="start-game-button"]');

    // Wait for game board to load
    await expect(page.locator('[data-testid="monopoly-board"]')).toBeVisible();

    // Player 1's turn - roll dice
    await expect(page.locator('[data-testid="roll-dice-button"]')).toBeEnabled();
    await page.click('[data-testid="roll-dice-button"]');

    // Check dice animation
    await expect(page.locator('[data-testid="dice-1"]')).toHaveClass(/dice-animation/);
    await expect(page.locator('[data-testid="dice-2"]')).toHaveClass(/dice-animation/);

    // Wait for animation to complete
    await page.waitForTimeout(1500);

    // Check if player moved
    const diceValue1 = await page.locator('[data-testid="dice-1"]').textContent();
    const diceValue2 = await page.locator('[data-testid="dice-2"]').textContent();
    const totalMove = parseInt(diceValue1!) + parseInt(diceValue2!);

    // Verify player position changed
    const playerPosition = await page.locator('[data-testid="player-alice-position"]').textContent();
    expect(parseInt(playerPosition!)).toBe(totalMove);

    // Check if buy property button appears (if landed on purchasable property)
    const buyButton = page.locator('[data-testid="buy-property-button"]');
    if (await buyButton.isVisible()) {
      await buyButton.click();
      
      // Verify property ownership
      await expect(page.locator('[data-testid="property-owned-indicator"]')).toBeVisible();
    }

    // End turn
    await page.click('[data-testid="end-turn-button"]');

    // Verify turn changed
    await expect(page.locator('[data-testid="current-player"]')).toContainText('Bob');
  });

  test('should handle property trading', async ({ page }) => {
    // Setup game with properties owned
    await setupGameWithProperties(page);

    // Open trading panel
    await page.click('[data-testid="trading-panel-button"]');
    await expect(page.locator('[data-testid="trading-panel"]')).toBeVisible();

    // Select player to trade with
    await page.selectOption('[data-testid="trade-player-select"]', 'player-2');

    // Add property to offer
    await page.click('[data-testid="offer-property-1"]');
    
    // Add money to request
    await page.fill('[data-testid="request-money-input"]', '200');
    await page.click('[data-testid="add-money-request"]');

    // Send trade offer
    await page.click('[data-testid="send-trade-offer"]');

    // Verify trade offer sent
    await expect(page.locator('[data-testid="trade-offer-sent"]')).toBeVisible();
  });

  test('should handle auction mechanics', async ({ page }) => {
    // Setup game and navigate to property that triggers auction
    await setupGameForAuction(page);

    // Decline to buy property (triggers auction)
    await page.click('[data-testid="decline-property-button"]');

    // Verify auction started
    await expect(page.locator('[data-testid="auction-panel"]')).toBeVisible();
    await expect(page.locator('[data-testid="auction-timer"]')).toBeVisible();

    // Place bid
    await page.fill('[data-testid="bid-amount-input"]', '80');
    await page.click('[data-testid="place-bid-button"]');

    // Verify bid placed
    await expect(page.locator('[data-testid="current-bid"]')).toContainText('$80');
    await expect(page.locator('[data-testid="leading-bidder"]')).toContainText('Alice');

    // Wait for auction to complete
    await page.waitForSelector('[data-testid="auction-completed"]', { timeout: 65000 });

    // Verify property ownership
    await expect(page.locator('[data-testid="property-owner"]')).toContainText('Alice');
  });
});

// Helper functions
async function setupGameWithProperties(page: any) {
  // Implementation for setting up a game with pre-owned properties
  await page.goto('/test-setup/properties');
  // ... setup logic
}

async function setupGameForAuction(page: any) {
  // Implementation for setting up a game state that triggers auction
  await page.goto('/test-setup/auction');
  // ... setup logic
}
```

### Performance Tests
```typescript
// e2e/performance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load game board within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/game/test-game-id');
    await expect(page.locator('[data-testid="monopoly-board"]')).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('should handle 100 rapid dice rolls without lag', async ({ page }) => {
    await page.goto('/game/test-game-id');
    
    const startTime = Date.now();
    
    for (let i = 0; i < 100; i++) {
      await page.click('[data-testid="roll-dice-button"]');
      await page.waitForSelector('[data-testid="dice-result"]');
      await page.click('[data-testid="end-turn-button"]');
    }
    
    const totalTime = Date.now() - startTime;
    const averageTime = totalTime / 100;
    
    expect(averageTime).toBeLessThan(500); // Less than 500ms per action
  });

  test('should maintain SSE connection stability', async ({ page }) => {
    await page.goto('/game/test-game-id');
    
    let connectionDrops = 0;
    
    page.on('console', (msg) => {
      if (msg.text().includes('SSE connection error')) {
        connectionDrops++;
      }
    });

    // Wait for 5 minutes
    await page.waitForTimeout(300000);
    
    expect(connectionDrops).toBeLessThan(3); // Allow max 2 reconnections
  });
});
```

## 📊 Test Coverage

### Coverage Configuration
```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:all": "npm run test:coverage && npm run test:e2e"
  }
}
```

### Coverage Targets
- **Unit Tests**: 90%+ coverage
- **Integration Tests**: 80%+ coverage
- **E2E Tests**: Critical user flows
- **Performance Tests**: Key metrics

### CI/CD Integration
```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e
```

This comprehensive testing guide ensures robust quality assurance for the multiplayer Monopoly game across all layers of the application.
