import { Component, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useMatrix } from '../contexts/MatrixContext';

const GameLobbyList: Component = () => {
  const navigate = useNavigate();
  const { rooms, joinRoom } = useMatrix();

  const gameRooms = () => rooms().filter(room => room.gameId);

  const handleJoinRoom = async (roomId: string) => {
    try {
      await joinRoom(roomId);
      navigate(`/lobby/${roomId}`);
    } catch (error) {
      console.error('Failed to join room:', error);
    }
  };

  return (
    <div class="space-y-4">
      <For each={gameRooms()} fallback={
        <div class="text-center text-gray-400 py-8">
          <p>No active games found.</p>
          <p class="text-sm mt-2">Create a new game to get started!</p>
        </div>
      }>
        {(room) => (
          <div class="bg-white/5 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg font-semibold text-white">{room.name}</h3>
                <p class="text-gray-400 text-sm">{room.topic}</p>
                <p class="text-gray-500 text-xs mt-1">
                  {room.members.length} players • Game ID: {room.gameId}
                </p>
              </div>
              <button
                onClick={() => handleJoinRoom(room.roomId)}
                class="bg-monopoly-green hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Join Game
              </button>
            </div>
          </div>
        )}
      </For>
    </div>
  );
};

export default GameLobbyList;
