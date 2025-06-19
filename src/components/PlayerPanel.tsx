import { Component, For } from 'solid-js';
import { useGame } from '../contexts/GameContext';

const PlayerPanel: Component = () => {
  const { gameState } = useGame();

  const currentPlayer = () => {
    const state = gameState();
    if (!state) return null;
    return state.players[state.currentPlayerIndex];
  };

  return (
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-white">Players</h3>
      
      <For each={gameState()?.players || []}>
        {(player) => (
          <div class={`p-3 rounded-lg border ${
            player.id === currentPlayer()?.id 
              ? 'border-yellow-400 bg-yellow-400/10' 
              : 'border-gray-600 bg-white/5'
          }`}>
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2">
                <div 
                  class="w-4 h-4 rounded-full"
                  style={{ 'background-color': player.color }}
                />
                <span class="text-white font-medium">{player.name}</span>
                {player.id === currentPlayer()?.id && (
                  <span class="text-yellow-400 text-xs">TURN</span>
                )}
              </div>
              <span class="text-green-400 font-bold">${player.money}</span>
            </div>
            
            <div class="text-xs text-gray-400">
              <p>Position: {player.position}</p>
              <p>Properties: {player.properties.length}</p>
              {player.inJail && (
                <p class="text-red-400">In Jail ({player.jailTurns} turns)</p>
              )}
            </div>
          </div>
        )}
      </For>
    </div>
  );
};

export default PlayerPanel;
