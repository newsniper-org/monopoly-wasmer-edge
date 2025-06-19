/**
 * Matrix configuration
 */
export interface MatrixConfig {
  homeserverUrl: string;
  accessToken?: string;
  userId?: string;
}

/**
 * Matrix room representation
 */
export interface MatrixRoom {
  roomId: string;
  name: string;
  topic?: string;
  members: MatrixUser[];
  gameId?: string;
}

/**
 * Matrix user representation
 */
export interface MatrixUser {
  userId: string;
  displayName?: string;
  avatarUrl?: string;
  powerLevel: number;
}

/**
 * Matrix message representation
 */
export interface MatrixMessage {
  type: string;
  content: any;
  sender: string;
  timestamp: number;
  eventId: string;
}

/**
 * Game invitation representation
 */
export interface GameInvite {
  gameId: string;
  roomId: string;
  inviter: string;
  timestamp: number;
}
