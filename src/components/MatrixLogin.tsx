import { Component, createSignal } from 'solid-js';
import { useMatrix } from '../contexts/MatrixContext';

const MatrixLogin: Component = () => {
  const { login } = useMatrix();
  const [homeserver, setHomeserver] = createSignal('https://matrix.org');
  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal('');

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(homeserver(), username(), password());
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Homeserver URL
        </label>
        <input
          type="url"
          value={homeserver()}
          onInput={(e) => setHomeserver(e.currentTarget.value)}
          class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://matrix.org"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Username
        </label>
        <input
          type="text"
          value={username()}
          onInput={(e) => setUsername(e.currentTarget.value)}
          class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="@username:matrix.org"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Password
        </label>
        <input
          type="password"
          value={password()}
          onInput={(e) => setPassword(e.currentTarget.value)}
          class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {error() && (
        <div class="text-red-400 text-sm">{error()}</div>
      )}

      <button
        type="submit"
        disabled={isLoading()}
        class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg transition-colors"
      >
        {isLoading() ? 'Connecting...' : 'Connect to Matrix'}
      </button>

      <div class="text-sm text-gray-400 text-center">
        <p>Don't have a Matrix account?</p>
        <a 
          href="https://app.element.io/#/register" 
          target="_blank" 
          class="text-blue-400 hover:text-blue-300"
        >
          Create one on Element
        </a>
      </div>
    </form>
  );
};

export default MatrixLogin;
