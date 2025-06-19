# Monopoly Core

A framework-agnostic library for Monopoly game logic.

## Features

- Complete game state management
- Game actions and events
- Property management
- Player management
- Dice rolling and movement
- Card handling
- Adapters for storage and networking

## Installation

```bash
npm install monopoly-core
```

## Usage

### Creating a Game

```typescript
import { Game } from 'monopoly-core';

// Create a new game with players
const game = new Game([
  { id: 'player1', name: 'Alice', color: 'red' },
  { id: 'player2', name: 'Bob', color: 'blue' }
]);

// Get the current game state
const gameState = game.getState();
```

### Game Actions

```typescript
// Roll dice
const { dice, state } = game.rollDice();
console.log(`Rolled ${dice[0]} and ${dice[1]}`);

// Buy property
game.buyProperty(3); // Buy Baltic Avenue

// End turn
game.endTurn();
```

### Using the Game Service

```typescript
import { GameService, StorageAdapter, MemoryStorageProvider } from 'monopoly-core';

// Create storage adapter with memory provider
const storage = new StorageAdapter(new MemoryStorageProvider());

// Create game service
const gameService = new GameService(storage);

// Create a new game
const gameId = await gameService.createGame([
  { id: 'player1', name: 'Alice', color: 'red' },
  { id: 'player2', name: 'Bob', color: 'blue' }
]);

// Process a game action
await gameService.processAction(gameId, {
  type: 'ROLL_DICE',
  playerId: 'player1',
  data: { dice: [3, 4] },
  timestamp: Date.now()
});
```

### Event Handling

```typescript
import { EventService } from 'monopoly-core';

const eventService = new EventService();

// Subscribe to dice rolled events
eventService.subscribe('DICE_ROLLED', (event) => {
  console.log(`Player ${event.playerId} rolled ${event.dice[0]} and ${event.dice[1]}`);
});

// Publish an event
eventService.publish({
  type: 'DICE_ROLLED',
  gameId: 'game123',
  playerId: 'player1',
  dice: [3, 4],
  timestamp: Date.now()
});
```

## API Reference

See the TypeScript definitions for complete API documentation.

## License

MIT
