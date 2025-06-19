import { Component, For } from 'solid-js';
import { useGame } from '../contexts/GameContext';
import { initialProperties } from '../data/properties';

const MonopolyBoard: Component = () => {
  const { gameState } = useGame();

  const getBoardPosition = (index: number) => {
    // Calculate position on the board (40 spaces total)
    if (index <= 10) {
      // Bottom row (right to left)
      return {
        gridColumn: `${12 - index}`,
        gridRow: '11'
      };
    } else if (index <= 20) {
      // Left column (bottom to top)
      return {
        gridColumn: '1',
        gridRow: `${12 - (index - 10)}`
      };
    } else if (index <= 30) {
      // Top row (left to right)
      return {
        gridColumn: `${index - 19}`,
        gridRow: '1'
      };
    } else {
      // Right column (top to bottom)
      return {
        gridColumn: '11',
        gridRow: `${index - 29}`
      };
    }
  };

  const getPropertyColor = (property: any) => {
    const colorMap: Record<string, string> = {
      brown: '#8B4513',
      lightblue: '#87CEEB',
      purple: '#800080',
      orange: '#FFA500',
      red: '#FF0000',
      yellow: '#FFFF00',
      green: '#008000',
      blue: '#0000FF'
    };
    return colorMap[property.color] || '#FFFFFF';
  };

  const getPlayersAtPosition = (position: number) => {
    return gameState()?.players.filter(p => p.position === position) || [];
  };

  return (
    <div class="relative">
      <h2 class="text-2xl font-bold text-white mb-6 text-center">Monopoly Board</h2>
      
      <div class="game-board relative w-full max-w-4xl mx-auto aspect-square">
        {/* Board Grid */}
        <div class="grid grid-cols-11 grid-rows-11 gap-1 w-full h-full bg-green-800 p-4 rounded-lg">
          {/* Center Logo */}
          <div class="col-span-9 row-span-9 col-start-2 row-start-2 bg-green-700 rounded-lg flex items-center justify-center">
            <div class="text-center">
              <h1 class="text-4xl font-bold text-white font-monopoly mb-2">MONOPOLY</h1>
              <div class="text-white text-sm">
                <p>Current Player: {gameState()?.players[gameState()?.currentPlayerIndex || 0]?.name}</p>
                <p>Phase: {gameState()?.phase}</p>
                {gameState()?.dice && (
                  <p>Last Roll: {gameState()!.dice[0]} + {gameState()!.dice[1]} = {gameState()!.dice[0] + gameState()!.dice[1]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Property Spaces */}
          <For each={initialProperties}>
            {(property, index) => {
              const position = getBoardPosition(index());
              const playersHere = getPlayersAtPosition(index());
              const isCorner = [0, 10, 20, 30].includes(index());
              
              return (
                <div
                  class={`board-cell relative bg-white border border-gray-300 rounded ${
                    isCorner ? 'text-xs' : 'text-xs'
                  } flex flex-col justify-between p-1`}
                  style={position}
                >
                  {/* Property Color Bar */}
                  {property.color && (
                    <div 
                      class="w-full h-2 rounded-t"
                      style={{ 'background-color': getPropertyColor(property) }}
                    />
                  )}
                  
                  {/* Property Name */}
                  <div class="text-center font-semibold text-black leading-tight">
                    {property.name}
                  </div>
                  
                  {/* Property Price */}
                  {property.price > 0 && (
                    <div class="text-center text-xs text-gray-600">
                      ${property.price}
                    </div>
                  )}
                  
                  {/* Owner Indicator */}
                  {property.owner && (
                    <div class="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full" />
                  )}
                  
                  {/* Players on this space */}
                  {playersHere.length > 0 && (
                    <div class="absolute bottom-0 left-0 flex flex-wrap gap-1">
                      <For each={playersHere}>
                        {(player) => (
                          <div
                            class="player-piece w-3 h-3 rounded-full border border-white"
                            style={{ 'background-color': player.color }}
                            title={player.name}
                          />
                        )}
                      </For>
                    </div>
                  )}
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
};

export default MonopolyBoard;
