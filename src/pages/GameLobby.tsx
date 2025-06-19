import { Component, createSignal, onMount } from 'solid-js';
import { useParams, useNavigate } from '@solidjs/router';
import { useMatrix } from '../contexts/MatrixContext';
import { useGame } from '../contexts/GameContext';
import type { Player } from '../types/game';

const GameLobby: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { currentUser, sendMessage } = useMatrix();
  const { createGame } = useGame();
  
  const [players, setPlayers] = createSignal<Player[]>([]);
  const [isStarting, setIsStarting] = createSignal(false);
  const [playerName, setPlayerName] = createSignal('');
  const [selectedColor, setSelectedColor] = createSignal('red');

  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown'];

  onMount(() => {
    if (currentUser()) {
      setPlayerName(currentUser()!.displayName || 'Player');
    }
  });

  const addPlayer = () => {
    if (!playerName().trim()) return;

    const newPlayer: Player = {
      id: currentUser()?.userId || `player_${Date.now()}`,
      name: playerName(),
      color: selectedColor(),
      position: 0,
      money: 1500,
      properties: [],
      inJail: false,
      jailTurns: 0,
      isActive: true
    };

    setPlayers(prev => [...prev, newPlayer]);
    setPlayerName('');
  };

  const removePlayer = (playerId: string) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
  };

  const startGame = async () => {
    if (players().length < 2) {
      alert('Need at least 2 players to start the game');
      return;
    }

    setIsStarting(true);
    try {
      const gameId = await createGame(players());
      await sendMessage(params.roomId, `Game started! Game ID: ${gameId}`);
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error('Failed to start game:', error);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div class="min-h-screen p-4">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-2xl">
          <h1 class="text-3xl font-bold text-white mb-8 text-center">
            Game Lobby
          </h1>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Player Section */}
            <div class="space-y-6">
              <h2 class="text-xl font-semibold text-white">Add Player</h2>
              
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Player Name
                </label>
                <input
                  type="text"
                  value={playerName()}
                  onInput={(e) => setPlayerName(e.currentTarget.value)}
                  class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter player name"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Player Color
                </label>
                <div class="grid grid-cols-4 gap-2">
                  {colors.map(color => (
                    <button
                      onClick={() => setSelectedColor(color)}
                      class={`w-12 h-12 rounded-lg border-2 transition-all ${
                        selectedColor() === color 
                          ? 'border-white scale-110' 
                          : 'border-gray-600 hover:border-gray-400'
                      }`}
                      style={{ 'background-color': color }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={addPlayer}
                disabled={!playerName().trim() || players().some(p => p.color === selectedColor())}
                class="w-full bg-monopoly-green hover:bg-green-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Add Player
              </button>
            </div>

            {/* Players List */}
            <div class="space-y-6">
              <h2 class="text-xl font-semibold text-white">
                Players ({players().length}/8)
              </h2>
              
              <div class="space-y-3">
                {players().map(player => (
                  <div class="bg-white/5 rounded-lg p-4 flex justify-between items-center">
                    <div class="flex items-center space-x-3">
                      <div 
                        class="w-8 h-8 rounded-full"
                        style={{ 'background-color': player.color }}
                      />
                      <span class="text-white font-medium">{player.name}</span>
                    </div>
                    <button
                      onClick={() => removePlayer(player.id)}
                      class="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {players().length >= 2 && (
                <button
                  onClick={startGame}
                  disabled={isStarting()}
                  class="w-full bg-monopoly-blue hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  {isStarting() ? 'Starting Game...' : 'Start Game'}
                </button>
              )}
            </div>
          </div>

          <div class="mt-8 text-center">
            <p class="text-gray-400 text-sm">
              Room ID: {params.roomId}
            </p>
            <p class="text-gray-500 text-xs mt-1">
              Share this room ID with friends to invite them
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLobby;
