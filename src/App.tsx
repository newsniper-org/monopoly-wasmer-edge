import { Component } from 'solid-js';
import { Routes, Route } from '@solidjs/router';
import { GameProvider } from './contexts/GameContext';
import { MatrixProvider } from './contexts/MatrixContext';
import HomePage from './pages/HomePage';
import GameLobby from './pages/GameLobby';
import GameBoard from './pages/GameBoard';

const App: Component = () => {
  return (
    <MatrixProvider>
      <GameProvider>
        <div class="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
          <Routes>
            <Route path="/" component={HomePage} />
            <Route path="/lobby/:roomId" component={GameLobby} />
            <Route path="/game/:gameId" component={GameBoard} />
          </Routes>
        </div>
      </GameProvider>
    </MatrixProvider>
  );
};

export default App;
