import { createContext, useContext, createSignal, onMount, JSX } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { GameState, Player, Property, GameAction, SSEMessage } from '../types/game';
import { initialProperties } from '../data/properties';

interface GameContextType {
  gameState: () => GameState | null;
  isConnected: () => boolean;
  createGame: (players: Player[]) => Promise<string>;
  joinGame: (gameId: string, player: Player) => Promise<void>;
  rollDice: () => Promise<void>;
  buyProperty: (propertyId: number) => Promise<void>;
  endTurn: () => Promise<void>;
  sendAction: (action: GameAction) => Promise<void>;
}

const GameContext = createContext<GameContextType>();

export function GameProvider(props: { children: JSX.Element }) {
  const [gameState, setGameState] = createStore<GameState | null>(null);
  const [isConnected, setIsConnected] = createSignal(false);
  const [eventSource, setEventSource] = createSignal<EventSource | null>(null);

  const connectToSSE = (gameId: string) => {
    const es = new EventSource(`/sse/game/${gameId}`);
    
    es.onopen = () => {
      setIsConnected(true);
      console.log('Connected to SSE');
    };

    es.onmessage = (event) => {
      const message: SSEMessage = JSON.parse(event.data);
      handleSSEMessage(message);
    };

    es.onerror = () => {
      setIsConnected(false);
      console.error('SSE connection error');
    };

    setEventSource(es);
  };

  const handleSSEMessage = (message: SSEMessage) => {
    switch (message.type) {
      case 'gameUpdate':
        setGameState(message.data);
        break;
      case 'playerJoined':
        if (gameState) {
          setGameState('players', prev => [...prev, message.data]);
        }
        break;
      case 'playerLeft':
        if (gameState) {
          setGameState('players', prev => prev.filter(p => p.id !== message.data.playerId));
        }
        break;
      case 'gameAction':
        handleGameAction(message.data);
        break;
    }
  };

  const handleGameAction = (action: GameAction) => {
    // Process game actions and update state accordingly
    switch (action.type) {
      case 'ROLL_DICE':
        if (gameState) {
          setGameState('dice', action.data.dice);
          setGameState('phase', 'moving');
        }
        break;
      case 'MOVE_PLAYER':
        if (gameState) {
          const playerIndex = gameState.players.findIndex(p => p.id === action.playerId);
          if (playerIndex >= 0) {
            setGameState('players', playerIndex, 'position', action.data.position);
          }
        }
        break;
      case 'BUY_PROPERTY':
        if (gameState) {
          const playerIndex = gameState.players.findIndex(p => p.id === action.playerId);
          const propertyIndex = gameState.properties.findIndex(p => p.id === action.data.propertyId);
          
          if (playerIndex >= 0 && propertyIndex >= 0) {
            setGameState('players', playerIndex, 'money', prev => prev - action.data.price);
            setGameState('players', playerIndex, 'properties', prev => [...prev, gameState!.properties[propertyIndex]]);
            setGameState('properties', propertyIndex, 'owner', action.playerId);
          }
        }
        break;
    }
  };

  const createGame = async (players: Player[]): Promise<string> => {
    const response = await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ players })
    });

    const { gameId } = await response.json();
    connectToSSE(gameId);
    return gameId;
  };

  const joinGame = async (gameId: string, player: Player) => {
    await fetch(`/api/games/${gameId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player })
    });

    connectToSSE(gameId);
  };

  const sendAction = async (action: GameAction) => {
    if (!gameState) return;

    await fetch(`/api/games/${gameState.id}/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action)
    });
  };

  const rollDice = async () => {
    if (!gameState) return;

    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;

    const action: GameAction = {
      type: 'ROLL_DICE',
      playerId: gameState.players[gameState.currentPlayerIndex].id,
      data: { dice: [dice1, dice2] },
      timestamp: Date.now()
    };

    await sendAction(action);
  };

  const buyProperty = async (propertyId: number) => {
    if (!gameState) return;

    const property = gameState.properties.find(p => p.id === propertyId);
    if (!property) return;

    const action: GameAction = {
      type: 'BUY_PROPERTY',
      playerId: gameState.players[gameState.currentPlayerIndex].id,
      data: { propertyId, price: property.price },
      timestamp: Date.now()
    };

    await sendAction(action);
  };

  const endTurn = async () => {
    if (!gameState) return;

    const action: GameAction = {
      type: 'END_TURN',
      playerId: gameState.players[gameState.currentPlayerIndex].id,
      data: {},
      timestamp: Date.now()
    };

    await sendAction(action);
  };

  // Listen for Matrix game actions
  onMount(() => {
    const handleMatrixAction = (event: CustomEvent) => {
      handleGameAction(event.detail.action);
    };

    window.addEventListener('matrix-game-action', handleMatrixAction as EventListener);

    return () => {
      window.removeEventListener('matrix-game-action', handleMatrixAction as EventListener);
      const es = eventSource();
      if (es) {
        es.close();
      }
    };
  });

  const value: GameContextType = {
    gameState: () => gameState,
    isConnected,
    createGame,
    joinGame,
    rollDice,
    buyProperty,
    endTurn,
    sendAction
  };

  return (
    <GameContext.Provider value={value}>
      {props.children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
