import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { 
  GameService, 
  EventService,
  MemoryGameStorage,
  SSEEventEmitter
} from '../packages/monopoly-core/src/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize core services
const gameStorage = new MemoryGameStorage();
const sseEmitter = new SSEEventEmitter();
const gameService = new GameService(gameStorage);
const eventService = new EventService(sseEmitter);

// SSE endpoint for real-time game updates
app.get('/sse/game/:gameId', (req, res) => {
  const { gameId } = req.params;
  
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  const clientId = uuidv4();
  
  // Register SSE client
  sseEmitter.registerClient(gameId, clientId, res);

  // Send initial game state
  gameService.getGame(gameId)
    .then(game => {
      const gameState = game.getState();
      res.write(`data: ${JSON.stringify({
        type: 'gameUpdate',
        gameId,
        data: gameState
      })}\n\n`);
    })
    .catch(error => {
      console.error('Error getting game state:', error);
    });

  // Handle client disconnect
  req.on('close', () => {
    sseEmitter.unregisterClient(gameId, clientId);
  });
});

// Create new game
app.post('/api/games', async (req, res) => {
  try {
    const { players } = req.body;
    const gameId = await gameService.createGame(players);
    
    res.json({ gameId });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Failed to create game' });
  }
});

// Join existing game
app.post('/api/games/:gameId/join', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { player } = req.body;
    
    const updatedState = await gameService.addPlayer(gameId, player);
    
    // Broadcast player joined event
    eventService.emitEvent(gameId, 'playerJoined', player);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error joining game:', error);
    res.status(500).json({ error: 'Failed to join game' });
  }
});

// Handle game actions
app.post('/api/games/:gameId/actions', async (req, res) => {
  try {
    const { gameId } = req.params;
    const action = req.body;
    
    // Process the action
    const updatedState = await gameService.processAction(gameId, action);
    
    // Broadcast action to all clients
    eventService.emitEvent(gameId, 'gameAction', action);
    
    // Broadcast updated game state
    eventService.emitEvent(gameId, 'gameUpdate', updatedState);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error processing game action:', error);
    res.status(500).json({ error: 'Failed to process game action' });
  }
});

// Get game state
app.get('/api/games/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await gameService.getGame(gameId);
    
    res.json(game.getState());
  } catch (error) {
    console.error('Error getting game:', error);
    res.status(404).json({ error: 'Game not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Game server running on port ${PORT}`);
});
