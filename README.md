# Multiplayer Monopoly Game

A real-time multiplayer Monopoly game built with modern web technologies, featuring Matrix.org protocol integration for secure communication and Server-sent Events for real-time gameplay updates.

## 🚀 Features

- **Real-time Multiplayer**: Up to 8 players can join a single game
- **Matrix Protocol Integration**: Secure authentication and encrypted communication
- **Voice & Video Chat**: Built-in Matrix SDK for real-time communication
- **Server-sent Events**: Real-time game state synchronization
- **Classic Monopoly Rules**: Complete implementation of traditional Monopoly gameplay
- **Responsive Design**: Works on desktop and mobile devices
- **Wasmer Edge Deployment**: Optimized for edge runtime environments

## 🛠 Technology Stack

- **Frontend**: SolidJS with TypeScript
- **Styling**: Tailwind CSS v4.x
- **Authentication**: Matrix.org protocol
- **Real-time Updates**: Server-sent Events (SSE)
- **Backend**: Node.js with Express
- **Deployment**: Wasmer Edge runtime

## 🏗 Architecture

### Component Structure
```
src/
├── components/          # Reusable UI components
│   ├── MonopolyBoard.tsx    # Standalone game board renderer
│   ├── PlayerPanel.tsx      # Player information display
│   ├── GameControls.tsx     # Game action controls
│   ├── ChatPanel.tsx        # Matrix chat integration
│   ├── MatrixLogin.tsx      # Authentication component
│   └── GameLobbyList.tsx    # Game discovery
├── contexts/           # State management
│   ├── GameContext.tsx      # Game state and actions
│   └── MatrixContext.tsx    # Matrix client management
├── pages/              # Route components
│   ├── HomePage.tsx         # Landing and authentication
│   ├── GameLobby.tsx        # Pre-game setup
│   └── GameBoard.tsx        # Main game interface
├── types/              # TypeScript definitions
│   ├── game.ts              # Game state interfaces
│   └── matrix.ts            # Matrix protocol types
└── data/               # Static game data
    └── properties.ts        # Monopoly board properties
```

### Game State Management
- **Centralized State**: Game state managed through SolidJS stores
- **Real-time Sync**: SSE for broadcasting state changes
- **Action-based Updates**: All game actions processed server-side
- **Optimistic Updates**: Client-side predictions for smooth UX

### Matrix Integration
- **Authentication**: Secure login with Matrix homeserver
- **Room Management**: Automatic game room creation
- **Real-time Chat**: Text, voice, and video communication
- **Federation Support**: Works with any Matrix homeserver

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Matrix account (create at [Element](https://app.element.io))

### Installation

1. **Clone and install dependencies**:
```bash
git clone <repository>
cd multiplayer-monopoly
npm install
```

2. **Start development servers**:
```bash
# Terminal 1: Start game server
npm run server

# Terminal 2: Start frontend
npm run dev
```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Game Server: http://localhost:3001

### Matrix Setup

1. **Create Matrix Account**:
   - Visit [Element](https://app.element.io/#/register)
   - Create account on matrix.org or your preferred homeserver

2. **Login to Game**:
   - Enter your homeserver URL (e.g., https://matrix.org)
   - Provide Matrix username and password
   - Grant necessary permissions for chat and media

## 🎮 How to Play

### Starting a Game

1. **Login with Matrix**: Authenticate using your Matrix credentials
2. **Create Game**: Click "Create New Game" to start a new lobby
3. **Add Players**: Add 2-8 players with unique names and colors
4. **Start Game**: Begin when all players are ready

### Gameplay

- **Roll Dice**: Click "Roll Dice" when it's your turn
- **Buy Properties**: Purchase unowned properties you land on
- **Pay Rent**: Automatic rent collection when landing on owned properties
- **Build Houses**: Develop properties when you own a color group
- **Trade**: Negotiate trades through the chat system
- **Win**: Bankrupt all other players to win

### Communication

- **Text Chat**: Send messages to all players
- **Voice Chat**: Enable microphone for voice communication
- **Video Chat**: Enable camera for face-to-face interaction

## 🔧 Configuration

### Environment Variables

Create a `.env` file:
```env
VITE_MATRIX_HOMESERVER=https://matrix.org
VITE_GAME_SERVER_URL=http://localhost:3001
```

### Matrix Homeserver

The application supports any Matrix homeserver:
- **matrix.org**: Default public homeserver
- **Custom Homeserver**: Use your organization's Matrix server
- **Self-hosted**: Deploy your own Synapse instance

## 🚀 Deployment

### Wasmer Edge Deployment

1. **Build for production**:
```bash
npm run build
```

2. **Deploy to Wasmer Edge**:
```bash
wasmer deploy
```

3. **Configure environment**:
   - Set Matrix homeserver URL
   - Configure CORS origins
   - Set up SSL certificates

### Traditional Deployment

The application can also be deployed to:
- **Vercel**: Frontend deployment
- **Railway**: Full-stack deployment  
- **Docker**: Containerized deployment
- **AWS/GCP/Azure**: Cloud platform deployment

## 🧪 Development

### Running Tests
```bash
npm test
```

### Code Quality
```bash
npm run lint
npm run type-check
```

### Building
```bash
npm run build
```

## 📚 API Documentation

### Game Server Endpoints

- `POST /api/games` - Create new game
- `POST /api/games/:id/join` - Join existing game
- `POST /api/games/:id/actions` - Send game action
- `GET /api/games/:id` - Get game state
- `GET /sse/game/:id` - SSE connection for real-time updates

### Matrix Events

- `com.monopoly.action` - Game action events
- `com.monopoly.game` - Game state events
- `m.room.message` - Chat messages

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Matrix.org**: For the decentralized communication protocol
- **SolidJS**: For the reactive UI framework
- **Tailwind CSS**: For the utility-first styling
- **Wasmer**: For the edge runtime platform

## 🐛 Troubleshooting

### Common Issues

1. **Matrix Login Fails**:
   - Verify homeserver URL is correct
   - Check username format (@username:homeserver.com)
   - Ensure account exists and password is correct

2. **Game Not Syncing**:
   - Check SSE connection in browser dev tools
   - Verify game server is running on port 3001
   - Check for CORS issues

3. **Chat Not Working**:
   - Verify Matrix room permissions
   - Check Matrix client connection status
   - Ensure proper room membership

### Support

For issues and questions:
- Create GitHub issue
- Join Matrix room: #monopoly-game:matrix.org
- Check documentation wiki
