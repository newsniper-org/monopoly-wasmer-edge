# Extension Guides for Multiplayer Monopoly

This document provides comprehensive guides for extending the Monopoly game with advanced features like trading, auctions, and custom house rules.

## 📋 Table of Contents

1. [Trading System](#trading-system)
2. [Auction Mechanics](#auction-mechanics)
3. [Custom House Rules](#custom-house-rules)
4. [Advanced Features](#advanced-features)
5. [Implementation Patterns](#implementation-patterns)

---

## 🤝 Trading System

### Overview
Implement a comprehensive trading system allowing players to exchange properties, money, and special items.

### 1. Data Structures

First, extend the game types to support trading:

```typescript
// src/types/trading.ts
export interface TradeOffer {
  id: string;
  fromPlayerId: string;
  toPlayerId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  fromItems: TradeItem[];
  toItems: TradeItem[];
  message?: string;
  expiresAt: number;
  createdAt: number;
}

export interface TradeItem {
  type: 'property' | 'money' | 'jail_card' | 'future_rent';
  propertyId?: number;
  amount?: number;
  turns?: number; // For future rent exemptions
}

export interface TradeHistory {
  tradeId: string;
  participants: string[];
  completedAt: number;
  items: TradeItem[];
}
```

### 2. Trading Context

Create a dedicated context for trading operations:

```typescript
// src/contexts/TradingContext.tsx
import { createContext, useContext, createSignal, JSX } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { TradeOffer, TradeItem } from '../types/trading';

interface TradingContextType {
  activeOffers: () => TradeOffer[];
  createTradeOffer: (toPlayerId: string, fromItems: TradeItem[], toItems: TradeItem[]) => Promise<void>;
  respondToTrade: (tradeId: string, accept: boolean) => Promise<void>;
  cancelTrade: (tradeId: string) => Promise<void>;
  getTradeHistory: () => TradeHistory[];
}

export function TradingProvider(props: { children: JSX.Element }) {
  const [activeOffers, setActiveOffers] = createStore<TradeOffer[]>([]);
  const [tradeHistory, setTradeHistory] = createStore<TradeHistory[]>([]);

  const createTradeOffer = async (toPlayerId: string, fromItems: TradeItem[], toItems: TradeItem[]) => {
    const offer: TradeOffer = {
      id: `trade_${Date.now()}`,
      fromPlayerId: getCurrentPlayerId(),
      toPlayerId,
      status: 'pending',
      fromItems,
      toItems,
      expiresAt: Date.now() + (5 * 60 * 1000), // 5 minutes
      createdAt: Date.now()
    };

    // Send to game server
    await sendGameAction({
      type: 'CREATE_TRADE_OFFER',
      playerId: getCurrentPlayerId(),
      data: offer,
      timestamp: Date.now()
    });
  };

  const respondToTrade = async (tradeId: string, accept: boolean) => {
    await sendGameAction({
      type: accept ? 'ACCEPT_TRADE' : 'REJECT_TRADE',
      playerId: getCurrentPlayerId(),
      data: { tradeId },
      timestamp: Date.now()
    });
  };

  // ... implementation details
}
```

### 3. Trading UI Components

Create intuitive trading interfaces:

```typescript
// src/components/TradingPanel.tsx
import { Component, createSignal, For } from 'solid-js';
import { useGame } from '../contexts/GameContext';
import { useTrading } from '../contexts/TradingContext';

const TradingPanel: Component = () => {
  const { gameState } = useGame();
  const { activeOffers, createTradeOffer } = useTrading();
  const [selectedPlayer, setSelectedPlayer] = createSignal('');
  const [offerItems, setOfferItems] = createSignal<TradeItem[]>([]);
  const [requestItems, setRequestItems] = createSignal<TradeItem[]>([]);

  const availablePlayers = () => 
    gameState()?.players.filter(p => p.id !== getCurrentPlayerId()) || [];

  return (
    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <h3 class="text-xl font-bold text-white mb-4">Trading Center</h3>
      
      {/* Player Selection */}
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Trade with Player
        </label>
        <select 
          value={selectedPlayer()} 
          onChange={(e) => setSelectedPlayer(e.currentTarget.value)}
          class="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white"
        >
          <option value="">Select a player...</option>
          <For each={availablePlayers()}>
            {(player) => (
              <option value={player.id}>{player.name}</option>
            )}
          </For>
        </select>
      </div>

      {/* Trade Builder */}
      <div class="grid grid-cols-2 gap-4 mb-4">
        <TradeItemSelector 
          title="Your Offer"
          items={offerItems()}
          onItemsChange={setOfferItems}
          playerId={getCurrentPlayerId()}
        />
        <TradeItemSelector 
          title="Your Request"
          items={requestItems()}
          onItemsChange={setRequestItems}
          playerId={selectedPlayer()}
        />
      </div>

      {/* Action Buttons */}
      <div class="flex space-x-2">
        <button
          onClick={() => createTradeOffer(selectedPlayer(), offerItems(), requestItems())}
          disabled={!selectedPlayer() || offerItems().length === 0}
          class="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg"
        >
          Send Trade Offer
        </button>
        <button
          onClick={() => {
            setOfferItems([]);
            setRequestItems([]);
            setSelectedPlayer('');
          }}
          class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Clear
        </button>
      </div>

      {/* Active Offers */}
      <div class="mt-6">
        <h4 class="text-lg font-semibold text-white mb-3">Active Offers</h4>
        <For each={activeOffers()}>
          {(offer) => <TradeOfferCard offer={offer} />}
        </For>
      </div>
    </div>
  );
};
```

### 4. Server-side Trade Processing

Extend the game server to handle trading:

```javascript
// server/trading.js
function processTradeAction(game, action) {
  switch (action.type) {
    case 'CREATE_TRADE_OFFER':
      const offer = action.data;
      
      // Validate trade items
      if (!validateTradeItems(game, offer)) {
        throw new Error('Invalid trade items');
      }
      
      // Add to active offers
      if (!game.activeOffers) game.activeOffers = [];
      game.activeOffers.push(offer);
      
      // Notify target player
      broadcastToGame(game.id, {
        type: 'tradeOfferReceived',
        data: offer
      });
      break;

    case 'ACCEPT_TRADE':
      const { tradeId } = action.data;
      const trade = game.activeOffers.find(o => o.id === tradeId);
      
      if (trade && trade.toPlayerId === action.playerId) {
        executeTrade(game, trade);
        game.activeOffers = game.activeOffers.filter(o => o.id !== tradeId);
        
        // Add to history
        if (!game.tradeHistory) game.tradeHistory = [];
        game.tradeHistory.push({
          tradeId,
          participants: [trade.fromPlayerId, trade.toPlayerId],
          completedAt: Date.now(),
          items: [...trade.fromItems, ...trade.toItems]
        });
      }
      break;
  }
}

function executeTrade(game, trade) {
  const fromPlayer = game.players.find(p => p.id === trade.fromPlayerId);
  const toPlayer = game.players.find(p => p.id === trade.toPlayerId);
  
  // Transfer items from fromPlayer to toPlayer
  trade.fromItems.forEach(item => {
    transferItem(game, fromPlayer, toPlayer, item);
  });
  
  // Transfer items from toPlayer to fromPlayer
  trade.toItems.forEach(item => {
    transferItem(game, toPlayer, fromPlayer, item);
  });
}
```

---

## 🏛️ Auction Mechanics

### Overview
Implement property auctions when players decline to purchase properties or when properties are foreclosed.

### 1. Auction Data Structures

```typescript
// src/types/auction.ts
export interface Auction {
  id: string;
  propertyId: number;
  startingBid: number;
  currentBid: number;
  currentBidder?: string;
  participants: string[];
  status: 'active' | 'completed' | 'cancelled';
  timeRemaining: number;
  bidHistory: Bid[];
  createdAt: number;
}

export interface Bid {
  playerId: string;
  amount: number;
  timestamp: number;
  isAutoBid?: boolean;
}

export interface AutoBidSettings {
  playerId: string;
  maxBid: number;
  increment: number;
  enabled: boolean;
}
```

### 2. Auction Context

```typescript
// src/contexts/AuctionContext.tsx
export function AuctionProvider(props: { children: JSX.Element }) {
  const [currentAuction, setCurrentAuction] = createSignal<Auction | null>(null);
  const [autoBidSettings, setAutoBidSettings] = createStore<AutoBidSettings[]>([]);

  const startAuction = async (propertyId: number, startingBid: number) => {
    const auction: Auction = {
      id: `auction_${Date.now()}`,
      propertyId,
      startingBid,
      currentBid: startingBid,
      participants: gameState()?.players.map(p => p.id) || [],
      status: 'active',
      timeRemaining: 60000, // 60 seconds
      bidHistory: [],
      createdAt: Date.now()
    };

    await sendGameAction({
      type: 'START_AUCTION',
      playerId: getCurrentPlayerId(),
      data: auction,
      timestamp: Date.now()
    });
  };

  const placeBid = async (amount: number) => {
    if (!currentAuction()) return;

    const bid: Bid = {
      playerId: getCurrentPlayerId(),
      amount,
      timestamp: Date.now()
    };

    await sendGameAction({
      type: 'PLACE_BID',
      playerId: getCurrentPlayerId(),
      data: { auctionId: currentAuction()!.id, bid },
      timestamp: Date.now()
    });
  };

  const setAutoBid = (maxBid: number, increment: number) => {
    const settings: AutoBidSettings = {
      playerId: getCurrentPlayerId(),
      maxBid,
      increment,
      enabled: true
    };

    setAutoBidSettings(prev => {
      const existing = prev.findIndex(s => s.playerId === getCurrentPlayerId());
      if (existing >= 0) {
        return prev.map((s, i) => i === existing ? settings : s);
      }
      return [...prev, settings];
    });
  };

  // Auto-bid logic
  createEffect(() => {
    const auction = currentAuction();
    if (!auction || auction.status !== 'active') return;

    const mySettings = autoBidSettings.find(s => s.playerId === getCurrentPlayerId());
    if (!mySettings?.enabled) return;

    const nextBid = auction.currentBid + mySettings.increment;
    if (nextBid <= mySettings.maxBid && auction.currentBidder !== getCurrentPlayerId()) {
      setTimeout(() => placeBid(nextBid), 1000); // Delay for realism
    }
  });
}
```

### 3. Auction UI Components

```typescript
// src/components/AuctionPanel.tsx
const AuctionPanel: Component = () => {
  const { currentAuction, placeBid, setAutoBid } = useAuction();
  const [bidAmount, setBidAmount] = createSignal(0);
  const [autoBidMax, setAutoBidMax] = createSignal(0);

  const auction = currentAuction();
  if (!auction) return null;

  const property = getPropertyById(auction.propertyId);
  const minBid = auction.currentBid + 10;

  return (
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white/95 backdrop-blur-sm rounded-xl p-6 max-w-md w-full mx-4">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Property Auction</h2>
        
        {/* Property Info */}
        <div class="bg-gray-100 rounded-lg p-4 mb-4">
          <h3 class="font-bold text-lg">{property.name}</h3>
          <p class="text-gray-600">Starting Bid: ${auction.startingBid}</p>
          <p class="text-gray-600">Current Bid: ${auction.currentBid}</p>
          {auction.currentBidder && (
            <p class="text-green-600">
              Leading: {getPlayerName(auction.currentBidder)}
            </p>
          )}
        </div>

        {/* Timer */}
        <div class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-600">Time Remaining</span>
            <span class="font-bold text-red-600">
              {Math.ceil(auction.timeRemaining / 1000)}s
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-red-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(auction.timeRemaining / 60000) * 100}%` }}
            />
          </div>
        </div>

        {/* Bidding */}
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Your Bid (min: ${minBid})
            </label>
            <input
              type="number"
              value={bidAmount()}
              onInput={(e) => setBidAmount(Number(e.currentTarget.value))}
              min={minBid}
              step="10"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => placeBid(bidAmount())}
            disabled={bidAmount() < minBid}
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg"
          >
            Place Bid
          </button>

          {/* Auto-bid */}
          <div class="border-t pt-4">
            <h4 class="font-medium text-gray-700 mb-2">Auto-bid Settings</h4>
            <div class="flex space-x-2">
              <input
                type="number"
                placeholder="Max bid"
                value={autoBidMax()}
                onInput={(e) => setAutoBidMax(Number(e.currentTarget.value))}
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={() => setAutoBid(autoBidMax(), 10)}
                class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm"
              >
                Enable
              </button>
            </div>
          </div>
        </div>

        {/* Bid History */}
        <div class="mt-4 max-h-32 overflow-y-auto">
          <h4 class="font-medium text-gray-700 mb-2">Bid History</h4>
          <For each={auction.bidHistory.slice().reverse()}>
            {(bid) => (
              <div class="flex justify-between text-sm py-1">
                <span>{getPlayerName(bid.playerId)}</span>
                <span class="font-medium">${bid.amount}</span>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};
```

### 4. Server-side Auction Logic

```javascript
// server/auction.js
function processAuctionAction(game, action) {
  switch (action.type) {
    case 'START_AUCTION':
      game.currentAuction = action.data;
      
      // Start countdown timer
      const auctionTimer = setInterval(() => {
        game.currentAuction.timeRemaining -= 1000;
        
        if (game.currentAuction.timeRemaining <= 0) {
          clearInterval(auctionTimer);
          completeAuction(game);
        }
        
        broadcastToGame(game.id, {
          type: 'auctionUpdate',
          data: game.currentAuction
        });
      }, 1000);
      
      break;

    case 'PLACE_BID':
      const { auctionId, bid } = action.data;
      const auction = game.currentAuction;
      
      if (auction && auction.id === auctionId && bid.amount > auction.currentBid) {
        auction.currentBid = bid.amount;
        auction.currentBidder = bid.playerId;
        auction.bidHistory.push(bid);
        
        // Extend time if bid placed in last 10 seconds
        if (auction.timeRemaining < 10000) {
          auction.timeRemaining = 10000;
        }
      }
      break;
  }
}

function completeAuction(game) {
  const auction = game.currentAuction;
  if (!auction) return;

  if (auction.currentBidder) {
    // Award property to highest bidder
    const winner = game.players.find(p => p.id === auction.currentBidder);
    const property = game.properties[auction.propertyId];
    
    winner.money -= auction.currentBid;
    winner.properties.push(auction.propertyId);
    property.owner = winner.id;
    
    broadcastToGame(game.id, {
      type: 'auctionCompleted',
      data: {
        winner: winner.id,
        amount: auction.currentBid,
        property: auction.propertyId
      }
    });
  }

  game.currentAuction = null;
}
```

---

## 🏠 Custom House Rules

### Overview
Implement a flexible system for custom house rules that can be configured per game.

### 1. House Rules Data Structure

```typescript
// src/types/houseRules.ts
export interface HouseRules {
  id: string;
  name: string;
  description: string;
  category: 'money' | 'movement' | 'properties' | 'special';
  enabled: boolean;
  parameters?: Record<string, any>;
}

export interface GameRuleSet {
  gameId: string;
  rules: HouseRules[];
  createdBy: string;
  createdAt: number;
}

// Predefined house rules
export const AVAILABLE_HOUSE_RULES: HouseRules[] = [
  {
    id: 'free_parking_jackpot',
    name: 'Free Parking Jackpot',
    description: 'All tax and fee money goes to Free Parking. Landing on Free Parking wins the jackpot.',
    category: 'money',
    enabled: false,
    parameters: { startingAmount: 500 }
  },
  {
    id: 'speed_die',
    name: 'Speed Die',
    description: 'Add a third die for faster gameplay and special moves.',
    category: 'movement',
    enabled: false,
    parameters: { 
      mrMonopolyMoves: true,
      busMoves: true,
      doubleRent: true 
    }
  },
  {
    id: 'auction_all_properties',
    name: 'Auction All Properties',
    description: 'All unowned properties go to auction when landed on.',
    category: 'properties',
    enabled: false
  },
  {
    id: 'snake_eyes_bonus',
    name: 'Snake Eyes Bonus',
    description: 'Rolling double 1s gives $1000 bonus.',
    category: 'special',
    enabled: false,
    parameters: { bonusAmount: 1000 }
  },
  {
    id: 'salary_increase',
    name: 'Salary Increase',
    description: 'Increase GO salary based on properties owned.',
    category: 'money',
    enabled: false,
    parameters: { 
      baseAmount: 200,
      propertyBonus: 10,
      monopolyBonus: 50 
    }
  },
  {
    id: 'property_development_limit',
    name: 'No Building Shortage',
    description: 'Remove the 32 house / 12 hotel limit.',
    category: 'properties',
    enabled: false
  },
  {
    id: 'bankruptcy_redistribution',
    name: 'Bankruptcy Redistribution',
    description: 'When a player goes bankrupt, their assets are auctioned to remaining players.',
    category: 'special',
    enabled: false
  }
];
```

### 2. House Rules Context

```typescript
// src/contexts/HouseRulesContext.tsx
export function HouseRulesProvider(props: { children: JSX.Element }) {
  const [gameRules, setGameRules] = createStore<HouseRules[]>([]);
  const [availableRules] = createSignal(AVAILABLE_HOUSE_RULES);

  const enableRule = (ruleId: string, parameters?: Record<string, any>) => {
    setGameRules(prev => {
      const existing = prev.findIndex(r => r.id === ruleId);
      const rule = availableRules().find(r => r.id === ruleId);
      
      if (!rule) return prev;
      
      const updatedRule = {
        ...rule,
        enabled: true,
        parameters: { ...rule.parameters, ...parameters }
      };

      if (existing >= 0) {
        return prev.map((r, i) => i === existing ? updatedRule : r);
      }
      return [...prev, updatedRule];
    });
  };

  const disableRule = (ruleId: string) => {
    setGameRules(prev => prev.filter(r => r.id !== ruleId));
  };

  const isRuleEnabled = (ruleId: string) => {
    return gameRules.some(r => r.id === ruleId && r.enabled);
  };

  const getRuleParameters = (ruleId: string) => {
    return gameRules.find(r => r.id === ruleId)?.parameters || {};
  };

  const applyRule = (ruleId: string, context: any) => {
    if (!isRuleEnabled(ruleId)) return context;

    const rule = gameRules.find(r => r.id === ruleId);
    if (!rule) return context;

    return applyHouseRule(rule, context);
  };

  return (
    <HouseRulesContext.Provider value={{
      gameRules: () => gameRules,
      availableRules,
      enableRule,
      disableRule,
      isRuleEnabled,
      getRuleParameters,
      applyRule
    }}>
      {props.children}
    </HouseRulesContext.Provider>
  );
}
```

### 3. House Rules Configuration UI

```typescript
// src/components/HouseRulesConfig.tsx
const HouseRulesConfig: Component = () => {
  const { availableRules, gameRules, enableRule, disableRule } = useHouseRules();
  const [selectedCategory, setSelectedCategory] = createSignal<string>('all');

  const categories = ['all', 'money', 'movement', 'properties', 'special'];
  
  const filteredRules = () => {
    if (selectedCategory() === 'all') return availableRules();
    return availableRules().filter(rule => rule.category === selectedCategory());
  };

  const isEnabled = (ruleId: string) => {
    return gameRules().some(r => r.id === ruleId && r.enabled);
  };

  return (
    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <h2 class="text-2xl font-bold text-white mb-6">House Rules Configuration</h2>
      
      {/* Category Filter */}
      <div class="mb-6">
        <div class="flex space-x-2">
          <For each={categories}>
            {(category) => (
              <button
                onClick={() => setSelectedCategory(category)}
                class={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory() === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            )}
          </For>
        </div>
      </div>

      {/* Rules List */}
      <div class="space-y-4">
        <For each={filteredRules()}>
          {(rule) => (
            <HouseRuleCard 
              rule={rule}
              enabled={isEnabled(rule.id)}
              onToggle={(enabled) => enabled ? enableRule(rule.id) : disableRule(rule.id)}
            />
          )}
        </For>
      </div>

      {/* Active Rules Summary */}
      <div class="mt-8 p-4 bg-white/5 rounded-lg">
        <h3 class="text-lg font-semibold text-white mb-3">Active Rules Summary</h3>
        <div class="text-sm text-gray-300">
          {gameRules().length === 0 ? (
            <p>No custom rules enabled. Playing with standard Monopoly rules.</p>
          ) : (
            <ul class="space-y-1">
              <For each={gameRules().filter(r => r.enabled)}>
                {(rule) => <li>• {rule.name}</li>}
              </For>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const HouseRuleCard: Component<{
  rule: HouseRules;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}> = (props) => {
  const [showParameters, setShowParameters] = createSignal(false);

  return (
    <div class={`p-4 rounded-lg border transition-all ${
      props.enabled 
        ? 'border-green-500 bg-green-500/10' 
        : 'border-gray-600 bg-white/5'
    }`}>
      <div class="flex justify-between items-start mb-2">
        <div class="flex-1">
          <h4 class="text-lg font-semibold text-white">{props.rule.name}</h4>
          <p class="text-gray-300 text-sm">{props.rule.description}</p>
          <span class={`inline-block px-2 py-1 rounded text-xs font-medium mt-2 ${
            getCategoryColor(props.rule.category)
          }`}>
            {props.rule.category}
          </span>
        </div>
        
        <div class="flex items-center space-x-2">
          {props.rule.parameters && (
            <button
              onClick={() => setShowParameters(!showParameters())}
              class="text-gray-400 hover:text-white transition-colors"
            >
              ⚙️
            </button>
          )}
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={props.enabled}
              onChange={(e) => props.onToggle(e.currentTarget.checked)}
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>
      </div>

      {/* Parameters Configuration */}
      {showParameters() && props.rule.parameters && (
        <div class="mt-4 p-3 bg-white/5 rounded-lg">
          <h5 class="text-sm font-medium text-white mb-2">Parameters</h5>
          <RuleParametersEditor rule={props.rule} />
        </div>
      )}
    </div>
  );
};
```

### 4. Rule Application Engine

```typescript
// src/utils/houseRuleEngine.ts
export function applyHouseRule(rule: HouseRules, context: any): any {
  switch (rule.id) {
    case 'free_parking_jackpot':
      return applyFreeParkingJackpot(rule, context);
    
    case 'speed_die':
      return applySpeedDie(rule, context);
    
    case 'salary_increase':
      return applySalaryIncrease(rule, context);
    
    case 'snake_eyes_bonus':
      return applySnakeEyesBonus(rule, context);
    
    default:
      return context;
  }
}

function applyFreeParkingJackpot(rule: HouseRules, context: any) {
  const { gameState, action } = context;
  
  if (action.type === 'PAY_TAX' || action.type === 'PAY_FINE') {
    // Add money to Free Parking jackpot
    gameState.freeParking += action.data.amount;
  }
  
  if (action.type === 'LAND_ON_SPACE' && action.data.spaceId === 20) {
    // Player landed on Free Parking
    const player = gameState.players.find(p => p.id === action.playerId);
    if (player) {
      player.money += gameState.freeParking;
      gameState.freeParking = rule.parameters?.startingAmount || 500;
      
      return {
        ...context,
        notifications: [
          ...context.notifications || [],
          {
            type: 'jackpot',
            message: `${player.name} won the Free Parking jackpot!`,
            amount: gameState.freeParking
          }
        ]
      };
    }
  }
  
  return context;
}

function applySpeedDie(rule: HouseRules, context: any) {
  const { gameState, action } = context;
  
  if (action.type === 'ROLL_DICE') {
    // Add third die roll
    const speedDie = Math.floor(Math.random() * 6) + 1;
    const speedDieResult = getSpeedDieResult(speedDie);
    
    return {
      ...context,
      dice: [...action.data.dice, speedDie],
      speedDieResult,
      movement: calculateSpeedDieMovement(action.data.dice, speedDieResult)
    };
  }
  
  return context;
}

function applySalaryIncrease(rule: HouseRules, context: any) {
  const { gameState, action } = context;
  
  if (action.type === 'PASS_GO' || action.type === 'LAND_ON_GO') {
    const player = gameState.players.find(p => p.id === action.playerId);
    if (player) {
      const baseAmount = rule.parameters?.baseAmount || 200;
      const propertyBonus = (rule.parameters?.propertyBonus || 10) * player.properties.length;
      const monopolies = countMonopolies(player, gameState.properties);
      const monopolyBonus = (rule.parameters?.monopolyBonus || 50) * monopolies;
      
      const totalSalary = baseAmount + propertyBonus + monopolyBonus;
      
      return {
        ...context,
        salaryAmount: totalSalary,
        salaryBreakdown: {
          base: baseAmount,
          propertyBonus,
          monopolyBonus
        }
      };
    }
  }
  
  return context;
}
```

### 5. Server Integration

```javascript
// server/houseRules.js
function processGameActionWithRules(game, action) {
  let context = {
    gameState: game,
    action,
    notifications: []
  };

  // Apply each enabled house rule
  game.houseRules?.forEach(rule => {
    if (rule.enabled) {
      context = applyHouseRule(rule, context);
    }
  });

  // Process the modified action
  processStandardGameAction(context.gameState, context.action);

  // Send notifications if any
  if (context.notifications.length > 0) {
    broadcastToGame(game.id, {
      type: 'houseRuleNotifications',
      data: context.notifications
    });
  }

  return context.gameState;
}
```

---

## 🚀 Advanced Features

### 1. Tournament Mode

```typescript
// src/types/tournament.ts
export interface Tournament {
  id: string;
  name: string;
  format: 'single_elimination' | 'round_robin' | 'swiss';
  participants: string[];
  rounds: TournamentRound[];
  status: 'registration' | 'active' | 'completed';
  settings: TournamentSettings;
}

export interface TournamentSettings {
  maxPlayers: number;
  timeLimit: number;
  houseRules: HouseRules[];
  prizeDistribution: number[];
}
```

### 2. Spectator Mode

```typescript
// Enhanced spectator features
export interface SpectatorFeatures {
  liveCommentary: boolean;
  playerStats: boolean;
  predictiveAnalytics: boolean;
  replayMode: boolean;
}
```

### 3. AI Players

```typescript
// src/ai/monopolyAI.ts
export class MonopolyAI {
  private strategy: AIStrategy;
  private difficulty: 'easy' | 'medium' | 'hard' | 'expert';

  async makeDecision(gameState: GameState, options: DecisionOptions): Promise<AIDecision> {
    switch (options.type) {
      case 'buy_property':
        return this.decideBuyProperty(gameState, options);
      case 'trade_offer':
        return this.evaluateTradeOffer(gameState, options);
      case 'auction_bid':
        return this.calculateAuctionBid(gameState, options);
      case 'build_houses':
        return this.decideBuildStrategy(gameState, options);
    }
  }

  private decideBuyProperty(gameState: GameState, options: any): AIDecision {
    const property = options.property;
    const player = this.getAIPlayer(gameState);
    
    // Calculate property value using various factors
    const value = this.calculatePropertyValue(property, gameState);
    const affordability = player.money / property.price;
    const strategicValue = this.getStrategicValue(property, player, gameState);
    
    const shouldBuy = value > property.price && affordability > 0.3 && strategicValue > 0.5;
    
    return {
      action: shouldBuy ? 'buy' : 'pass',
      confidence: this.calculateConfidence([value, affordability, strategicValue]),
      reasoning: this.generateReasoning(shouldBuy, { value, affordability, strategicValue })
    };
  }
}
```

---

## 🛠 Implementation Patterns

### 1. Event-Driven Architecture

```typescript
// src/utils/eventBus.ts
export class GameEventBus {
  private listeners: Map<string, Function[]> = new Map();

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  emit(event: string, data: any) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }

  // Usage in components
  onMount(() => {
    eventBus.on('trade:offer:received', handleTradeOffer);
    eventBus.on('auction:started', showAuctionPanel);
    eventBus.on('house_rule:applied', showRuleNotification);
  });
}
```

### 2. Plugin System

```typescript
// src/plugins/pluginSystem.ts
export interface GamePlugin {
  id: string;
  name: string;
  version: string;
  hooks: PluginHooks;
  initialize: (game: GameState) => void;
  cleanup: () => void;
}

export interface PluginHooks {
  beforeAction?: (action: GameAction) => GameAction;
  afterAction?: (action: GameAction, result: any) => void;
  onPlayerTurn?: (player: Player) => void;
  onGameEnd?: (winner: Player) => void;
}

// Example plugin
export const TradingPlugin: GamePlugin = {
  id: 'trading-system',
  name: 'Advanced Trading System',
  version: '1.0.0',
  hooks: {
    beforeAction: (action) => {
      if (action.type === 'END_TURN') {
        // Check for pending trades
        checkPendingTrades();
      }
      return action;
    }
  },
  initialize: (game) => {
    game.tradingSystem = new TradingSystem();
  },
  cleanup: () => {
    // Cleanup resources
  }
};
```

### 3. State Persistence

```typescript
// src/utils/gameStateManager.ts
export class GameStateManager {
  async saveGameState(gameId: string, state: GameState) {
    const serialized = JSON.stringify(state);
    await fetch(`/api/games/${gameId}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: serialized })
    });
  }

  async loadGameState(gameId: string): Promise<GameState | null> {
    const response = await fetch(`/api/games/${gameId}/load`);
    if (response.ok) {
      const data = await response.json();
      return JSON.parse(data.state);
    }
    return null;
  }

  async createGameSnapshot(gameId: string, description: string) {
    const state = await this.loadGameState(gameId);
    if (state) {
      await fetch(`/api/games/${gameId}/snapshots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state,
          description,
          timestamp: Date.now()
        })
      });
    }
  }
}
```

### 4. Testing Framework

```typescript
// src/testing/gameTestUtils.ts
export class GameTestHarness {
  private gameState: GameState;
  private actionHistory: GameAction[] = [];

  constructor(initialState?: Partial<GameState>) {
    this.gameState = this.createTestGameState(initialState);
  }

  simulateAction(action: GameAction): GameState {
    this.actionHistory.push(action);
    this.gameState = processGameAction(this.gameState, action);
    return this.gameState;
  }

  simulateGame(actions: GameAction[]): GameState {
    actions.forEach(action => this.simulateAction(action));
    return this.gameState;
  }

  assertPlayerMoney(playerId: string, expectedAmount: number) {
    const player = this.gameState.players.find(p => p.id === playerId);
    if (!player || player.money !== expectedAmount) {
      throw new Error(`Expected player ${playerId} to have $${expectedAmount}, but has $${player?.money}`);
    }
  }

  assertPropertyOwner(propertyId: number, expectedOwner: string) {
    const property = this.gameState.properties[propertyId];
    if (property.owner !== expectedOwner) {
      throw new Error(`Expected property ${propertyId} to be owned by ${expectedOwner}, but is owned by ${property.owner}`);
    }
  }
}

// Example test
describe('Trading System', () => {
  test('should complete valid trade', () => {
    const harness = new GameTestHarness();
    
    // Setup initial state
    harness.simulateAction({
      type: 'BUY_PROPERTY',
      playerId: 'player1',
      data: { propertyId: 1 }
    });

    // Create trade offer
    harness.simulateAction({
      type: 'CREATE_TRADE_OFFER',
      playerId: 'player1',
      data: {
        toPlayerId: 'player2',
        fromItems: [{ type: 'property', propertyId: 1 }],
        toItems: [{ type: 'money', amount: 100 }]
      }
    });

    // Accept trade
    harness.simulateAction({
      type: 'ACCEPT_TRADE',
      playerId: 'player2',
      data: { tradeId: 'trade_123' }
    });

    // Verify results
    harness.assertPropertyOwner(1, 'player2');
    harness.assertPlayerMoney('player1', 1600); // 1500 + 100
    harness.assertPlayerMoney('player2', 1400); // 1500 - 100
  });
});
```

---

## 📚 Best Practices

### 1. Performance Optimization
- Use lazy loading for complex UI components
- Implement virtual scrolling for large lists
- Cache frequently accessed game data
- Optimize Matrix room synchronization

### 2. Error Handling
- Implement comprehensive error boundaries
- Add retry logic for network operations
- Validate all user inputs and game actions
- Provide meaningful error messages

### 3. Accessibility
- Add keyboard navigation support
- Implement screen reader compatibility
- Provide high contrast mode
- Support reduced motion preferences

### 4. Security
- Validate all game actions server-side
- Implement rate limiting for actions
- Sanitize user inputs
- Use Matrix encryption for sensitive data

### 5. Scalability
- Design for horizontal scaling
- Implement proper database indexing
- Use caching strategies effectively
- Monitor performance metrics

This comprehensive guide provides the foundation for extending the Monopoly game with advanced features while maintaining code quality and user experience.
