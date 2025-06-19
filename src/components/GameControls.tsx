import { Component, createSignal } from 'solid-js';
import { useGame } from '../contexts/GameContext';

const GameControls: Component = () => {
  const { gameState, rollDice, endTurn, buyProperty } = useGame();
  const [isRolling, setIsRolling] = createSignal(false);

  const currentPlayer = () => {
    const state = gameState();
    if (!state) return null;
    return state.players[state.currentPlayerIndex];
  };

  const canRoll = () => {
    const state = gameState();
    return state?.phase === 'waiting' && currentPlayer();
  };

  const canBuy = () => {
    const state = gameState();
    if (!state || state.phase !== 'buying') return false;
    
    const player = currentPlayer();
    if (!player) return false;
    
    const property = state.properties[player.position];
    return property && !property.owner && player.money >= property.price;
  };

  const handleRollDice = async () => {
    setIsRolling(true);
    try {
      await rollDice();
    } finally {
      setTimeout(() => setIsRolling(false), 1000);
    }
  };

  const handleBuyProperty = async () => {
    const player = currentPlayer();
    if (!player) return;
    
    await buyProperty(player.position);
  };

  return (
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-white">Game Controls</h3>
      
      {/* Dice Display */}
      <div class="bg-white/5 rounded-lg p-4">
        <h4 class="text-white font-medium mb-2">Dice</h4>
        <div class="flex space-x-2 justify-center">
          <div class={`w-12 h-12 bg-white rounded border-2 border-gray-300 flex items-center justify-center text-black font-bold text-lg ${
            isRolling() ? 'dice-animation' : ''
          }`}>
            {gameState()?.dice?.[0] || '?'}
          </div>
          <div class={`w-12 h-12 bg-white rounded border-2 border-gray-300 flex items-center justify-center text-black font-bold text-lg ${
            isRolling() ? 'dice-animation' : ''
          }`}>
            {gameState()?.dice?.[1] || '?'}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div class="space-y-2">
        <button
          onClick={handleRollDice}
          disabled={!canRoll() || isRolling()}
          class="w-full bg-monopoly-blue hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          {isRolling() ? 'Rolling...' : 'Roll Dice'}
        </button>

        {canBuy() && (
          <button
            onClick={handleBuyProperty}
            class="w-full bg-monopoly-green hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Buy Property
          </button>
        )}

        <button
          onClick={endTurn}
          disabled={gameState()?.phase === 'waiting'}
          class="w-full bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          End Turn
        </button>
      </div>

      {/* Game Status */}
      <div class="bg-white/5 rounded-lg p-3">
        <h4 class="text-white font-medium mb-1">Game Status</h4>
        <p class="text-gray-300 text-sm">Phase: {gameState()?.phase}</p>
        <p class="text-gray-300 text-sm">
          Turn: {currentPlayer()?.name || 'Waiting...'}
        </p>
      </div>
    </div>
  );
};

export default GameControls;
