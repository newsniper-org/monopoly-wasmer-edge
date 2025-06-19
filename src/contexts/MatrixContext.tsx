import { createContext, useContext, createSignal, onMount, JSX } from 'solid-js';
import { createStore } from 'solid-js/store';
import * as sdk from 'matrix-js-sdk';
import type { MatrixConfig, MatrixRoom, MatrixUser, MatrixMessage } from '../types/matrix';

interface MatrixContextType {
  client: () => sdk.MatrixClient | null;
  isLoggedIn: () => boolean;
  currentUser: () => MatrixUser | null;
  rooms: () => MatrixRoom[];
  login: (homeserver: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  createGameRoom: (roomName: string, gameId: string) => Promise<string>;
  joinRoom: (roomId: string) => Promise<void>;
  sendMessage: (roomId: string, message: string) => Promise<void>;
  sendGameAction: (roomId: string, action: any) => Promise<void>;
}

const MatrixContext = createContext<MatrixContextType>();

export function MatrixProvider(props: { children: JSX.Element }) {
  const [client, setClient] = createSignal<sdk.MatrixClient | null>(null);
  const [isLoggedIn, setIsLoggedIn] = createSignal(false);
  const [currentUser, setCurrentUser] = createSignal<MatrixUser | null>(null);
  const [rooms, setRooms] = createStore<MatrixRoom[]>([]);

  const login = async (homeserver: string, username: string, password: string) => {
    try {
      const matrixClient = sdk.createClient({
        baseUrl: homeserver,
      });

      const response = await matrixClient.login('m.login.password', {
        user: username,
        password: password,
      });

      matrixClient.setCredentials({
        userId: response.user_id,
        accessToken: response.access_token,
        homeserverUrl: homeserver,
      });

      await matrixClient.startClient();

      setClient(matrixClient);
      setIsLoggedIn(true);
      setCurrentUser({
        userId: response.user_id,
        displayName: username,
        powerLevel: 100
      });

      // Set up event listeners
      matrixClient.on('Room.timeline', handleRoomMessage);
      matrixClient.on('Room', handleRoomUpdate);

      // Store credentials in localStorage
      localStorage.setItem('matrix_credentials', JSON.stringify({
        homeserverUrl: homeserver,
        accessToken: response.access_token,
        userId: response.user_id
      }));

    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    const matrixClient = client();
    if (matrixClient) {
      await matrixClient.logout();
      matrixClient.stopClient();
    }
    
    setClient(null);
    setIsLoggedIn(false);
    setCurrentUser(null);
    setRooms([]);
    localStorage.removeItem('matrix_credentials');
  };

  const createGameRoom = async (roomName: string, gameId: string): Promise<string> => {
    const matrixClient = client();
    if (!matrixClient) throw new Error('Not logged in');

    const room = await matrixClient.createRoom({
      name: roomName,
      topic: `Monopoly Game: ${gameId}`,
      preset: 'public_chat',
      initial_state: [
        {
          type: 'com.monopoly.game',
          content: { gameId }
        }
      ]
    });

    return room.room_id;
  };

  const joinRoom = async (roomId: string) => {
    const matrixClient = client();
    if (!matrixClient) throw new Error('Not logged in');

    await matrixClient.joinRoom(roomId);
  };

  const sendMessage = async (roomId: string, message: string) => {
    const matrixClient = client();
    if (!matrixClient) throw new Error('Not logged in');

    await matrixClient.sendTextMessage(roomId, message);
  };

  const sendGameAction = async (roomId: string, action: any) => {
    const matrixClient = client();
    if (!matrixClient) throw new Error('Not logged in');

    await matrixClient.sendEvent(roomId, 'com.monopoly.action', action);
  };

  const handleRoomMessage = (event: any) => {
    // Handle incoming messages and game actions
    if (event.getType() === 'com.monopoly.action') {
      // Dispatch game action to game context
      window.dispatchEvent(new CustomEvent('matrix-game-action', {
        detail: { roomId: event.getRoomId(), action: event.getContent() }
      }));
    }
  };

  const handleRoomUpdate = (room: any) => {
    // Update rooms list
    const roomData: MatrixRoom = {
      roomId: room.roomId,
      name: room.name || 'Unnamed Room',
      topic: room.currentState.getStateEvents('m.room.topic', '')?.getContent()?.topic,
      members: room.getMembers().map((member: any) => ({
        userId: member.userId,
        displayName: member.name,
        avatarUrl: member.getAvatarUrl(),
        powerLevel: member.powerLevel
      })),
      gameId: room.currentState.getStateEvents('com.monopoly.game', '')?.getContent()?.gameId
    };

    setRooms(prev => {
      const existing = prev.findIndex(r => r.roomId === room.roomId);
      if (existing >= 0) {
        return prev.map((r, i) => i === existing ? roomData : r);
      }
      return [...prev, roomData];
    });
  };

  // Auto-login if credentials exist
  onMount(async () => {
    const stored = localStorage.getItem('matrix_credentials');
    if (stored) {
      try {
        const config: MatrixConfig = JSON.parse(stored);
        const matrixClient = sdk.createClient({
          baseUrl: config.homeserverUrl,
          accessToken: config.accessToken,
          userId: config.userId,
        });

        await matrixClient.startClient();
        setClient(matrixClient);
        setIsLoggedIn(true);
        setCurrentUser({
          userId: config.userId!,
          displayName: config.userId!.split(':')[0].substring(1),
          powerLevel: 100
        });

        matrixClient.on('Room.timeline', handleRoomMessage);
        matrixClient.on('Room', handleRoomUpdate);
      } catch (error) {
        console.error('Auto-login failed:', error);
        localStorage.removeItem('matrix_credentials');
      }
    }
  });

  const value: MatrixContextType = {
    client,
    isLoggedIn,
    currentUser,
    rooms: () => rooms,
    login,
    logout,
    createGameRoom,
    joinRoom,
    sendMessage,
    sendGameAction
  };

  return (
    <MatrixContext.Provider value={value}>
      {props.children}
    </MatrixContext.Provider>
  );
}

export function useMatrix() {
  const context = useContext(MatrixContext);
  if (!context) {
    throw new Error('useMatrix must be used within a MatrixProvider');
  }
  return context;
}
