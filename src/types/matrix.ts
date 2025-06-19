export interface MatrixConfig {
  homeserverUrl: string;
  accessToken?: string;
  userId?: string;
}

export interface MatrixRoom {
  roomId: string;
  name: string;
  topic?: string;
  members: MatrixUser[];
  gameId?: string;
}

export interface MatrixUser {
  userId: string;
  displayName?: string;
  avatarUrl?: string;
  powerLevel: number;
}

export interface MatrixMessage {
  type: string;
  content: any;
  sender: string;
  timestamp: number;
  eventId: string;
}

export interface GameInvite {
  gameId: string;
  roomId: string;
  inviter: string;
  timestamp: number;
}
