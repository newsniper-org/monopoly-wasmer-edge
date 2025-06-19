import { Component, onMount } from 'solid-js';
import { useParams } from '@solidjs/router';
import { useGame } from '../contexts/GameContext';
import MonopolyBoard from '../components/MonopolyBoard';
import PlayerPanel from '../components/PlayerPanel';
import GameControls from '../components/GameControls';
import ChatPanel from '../components/ChatPanel';

const GameBoard: Component = () => {
  const params = useParams();
  const { gameState, joinGame } = useGame();

  onMount(async () => {
    // Join the game if not already connected
    if (!gameState()) {
      // This would typically get player info from Matrix context
      const player = {
        id: 'current_player',
        name: 'Player',
        color: 'red',
        position: 0,
        money: 1500,
        properties: [],
        inJail: false,
        jailTurns: 0,
        isActive: true
      };
      
      await joinGame(params.gameId, player);
    }
  });

  return (
    <div class="min-h-screen p-4">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Game Board - Takes up most space */}
          <div class="xl:col-span-3">
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-2xl">
              <MonopolyBoard />
            </div>
          </div>

          {/* Side Panel */}
          <div class="space-y-6">
            {/* Player Info */}
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-2xl">
              <PlayerPanel />
            </div>

            {/* Game Controls */}
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-2xl">
              <GameControls />
            </div>

            {/* Chat Panel */}
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-2xl">
              <ChatPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
