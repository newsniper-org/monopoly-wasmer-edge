import { Component, createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useMatrix } from '../contexts/MatrixContext';
import MatrixLogin from '../components/MatrixLogin';
import GameLobbyList from '../components/GameLobbyList';

const HomePage: Component = () => {
  const navigate = useNavigate();
  const { isLoggedIn, createGameRoom } = useMatrix();
  const [isCreatingGame, setIsCreatingGame] = createSignal(false);

  const handleCreateGame = async () => {
    setIsCreatingGame(true);
    try {
      const gameId = `monopoly_${Date.now()}`;
      const roomId = await createGameRoom(`Monopoly Game ${gameId}`, gameId);
      navigate(`/lobby/${roomId}`);
    } catch (error) {
      console.error('Failed to create game:', error);
    } finally {
      setIsCreatingGame(false);
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="max-w-4xl w-full">
        <div class="text-center mb-12">
          <h1 class="text-6xl font-bold text-white mb-4 font-monopoly">
            MONOPOLY
          </h1>
          <p class="text-xl text-gray-300 mb-8">
            Multiplayer Real-time Board Game with Matrix Protocol
          </p>
          <div class="flex justify-center space-x-4 mb-8">
            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 class="text-lg font-semibold text-white mb-2">🔐 Secure Communication</h3>
              <p class="text-gray-300">Matrix protocol for encrypted chat and voice</p>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 class="text-lg font-semibold text-white mb-2">⚡ Real-time Updates</h3>
              <p class="text-gray-300">Server-sent events for instant gameplay</p>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 class="text-lg font-semibold text-white mb-2">🎮 Classic Gameplay</h3>
              <p class="text-gray-300">Full Monopoly rules and mechanics</p>
            </div>
          </div>
        </div>

        {!isLoggedIn() ? (
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-2xl">
            <h2 class="text-2xl font-bold text-white mb-6 text-center">
              Connect to Matrix
            </h2>
            <MatrixLogin />
          </div>
        ) : (
          <div class="space-y-8">
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-2xl">
              <h2 class="text-2xl font-bold text-white mb-6 text-center">
                Game Actions
              </h2>
              <div class="flex justify-center space-x-4">
                <button
                  onClick={handleCreateGame}
                  disabled={isCreatingGame()}
                  class="bg-monopoly-green hover:bg-green-600 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  {isCreatingGame() ? 'Creating...' : 'Create New Game'}
                </button>
                <button
                  onClick={() => navigate('/lobby')}
                  class="bg-monopoly-blue hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  Browse Games
                </button>
              </div>
            </div>

            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-2xl">
              <h2 class="text-2xl font-bold text-white mb-6">
                Available Games
              </h2>
              <GameLobbyList />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
