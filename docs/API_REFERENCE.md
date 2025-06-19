# API Reference

## Game Server Endpoints

### Games

#### Create Game
```http
POST /api/games
Content-Type: application/json

{
  "players": [
    {
      "id": "player1",
      "name": "Alice",
      "color": "red"
    }
  ],
  "houseRules": [
    {
      "id": "free_parking_jackpot",
      "enabled": true,
      "parameters": { "startingAmount": 500 }
    }
  ]
}
```

#### Join Game
```http
POST /api/games/{gameId}/join
Content-Type: application/json

{
  "player": {
    "id": "player2",
    "name": "Bob",
    "color": "blue"
  }
}
```

#### Send Game Action
```http
POST /api/games/{gameId}/actions
Content-Type: application/json

{
  "type": "ROLL_DICE",
  "playerId": "player1",
  "data": {
    "dice": [3, 4]
  },
  "timestamp": 1640995200000
}
```

### Trading

#### Create Trade Offer
```http
POST /api/games/{gameId}/actions
Content-Type: application/json

{
  "type": "CREATE_TRADE_OFFER",
  "playerId": "player1",
  "data": {
    "id": "trade_123",
    "toPlayerId": "player2",
    "fromItems": [
      {
        "type": "property",
        "propertyId": 1
      }
    ],
    "toItems": [
      {
        "type": "money",
        "amount": 200
      }
    ],
    "expiresAt": 1640995500000
  },
  "timestamp": 1640995200000
}
```

### Auctions

#### Start Auction
```http
POST /api/games/{gameId}/actions
Content-Type: application/json

{
  "type": "START_AUCTION",
  "playerId": "player1",
  "data": {
    "propertyId": 1,
    "startingBid": 60,
    "duration": 60000
  },
  "timestamp": 1640995200000
}
```

#### Place Bid
```http
POST /api/games/{gameId}/actions
Content-Type: application/json

{
  "type": "PLACE_BID",
  "playerId": "player2",
  "data": {
    "auctionId": "auction_123",
    "amount": 80
  },
  "timestamp": 1640995200000
}
```

## Server-Sent Events

### Connection
```http
GET /sse/game/{gameId}
Accept: text/event-stream
```

### Event Types

#### Game Update
```json
{
  "type": "gameUpdate",
  "gameId": "game_123",
  "data": {
    "id": "game_123",
    "players": [...],
    "currentPlayerIndex": 0,
    "phase": "rolling"
  }
}
```

#### Trade Offer Received
```json
{
  "type": "tradeOfferReceived",
  "gameId": "game_123",
  "data": {
    "id": "trade_123",
    "fromPlayerId": "player1",
    "toPlayerId": "player2",
    "fromItems": [...],
    "toItems": [...]
  }
}
```

#### Auction Started
```json
{
  "type": "auctionStarted",
  "gameId": "game_123",
  "data": {
    "id": "auction_123",
    "propertyId": 1,
    "startingBid": 60,
    "timeRemaining": 60000
  }
}
```

## Matrix Events

### Game Action Event
```json
{
  "type": "com.monopoly.action",
  "content": {
    "action_type": "ROLL_DICE",
    "player_id": "player1",
    "data": {
      "dice": [3, 4]
    },
    "timestamp": 1640995200000
  }
}
```

### Game State Event
```json
{
  "type": "com.monopoly.game",
  "content": {
    "game_id": "game_123",
    "state": {
      "players": [...],
      "currentPlayerIndex": 0,
      "phase": "moving"
    }
  }
}
```

## Error Responses

### Standard Error Format
```json
{
  "error": {
    "code": "INVALID_ACTION",
    "message": "Cannot roll dice when it's not your turn",
    "details": {
      "currentPlayer": "player2",
      "requestingPlayer": "player1"
    }
  }
}
```

### Common Error Codes
- `GAME_NOT_FOUND`: Game ID does not exist
- `PLAYER_NOT_IN_GAME`: Player is not part of this game
- `INVALID_ACTION`: Action not allowed in current game state
- `INSUFFICIENT_FUNDS`: Player doesn't have enough money
- `PROPERTY_NOT_AVAILABLE`: Property is already owned
- `TRADE_EXPIRED`: Trade offer has expired
- `AUCTION_ENDED`: Auction is no longer active
