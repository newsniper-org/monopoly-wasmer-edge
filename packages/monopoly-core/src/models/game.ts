import { v4 as uuidv4 } from 'uuid';
import type { GameState, Player, Property } from '../types';
import { initialChanceCards, initialCommunityChestCards } from '../constants/cards';
import { getConfig } from '../config/define-config';

/**
 * Game model representing a Monopoly game
 */
export class Game {
  private state: GameState;

  /**
   * Create a new game
   * @param players Initial players
   * @param id Game ID (optional, will be generated if not provided)
   */
  constructor(
    players: Omit<Player, 'position' | 'money' | 'properties' | 'inJail' | 'jailTurns' | 'isActive'>[],
    id?: string
  ) {
    const config = getConfig();
    
    // Initialize players with default values
    const initializedPlayers = players.map(player => ({
      ...player,
      position: 0,
      money: config.game.startingMoney,
      properties: [],
      inJail: false,
      jailTurns: 0,
      isActive: true
    }));

    // Initialize game state
    this.state = {
      id: id || uuidv4(),
      players: initializedPlayers,
      currentPlayerIndex: 0,
      phase: 'waiting',
      dice: [0, 0],
      lastRoll: 0,
      doubleCount: 0,
      properties: [], // TODO: Initialize with board properties
      communityChestCards: [...initialCommunityChestCards],
      chanceCards: [...initialChanceCards],
      freeParking: 0,
      spectators: []
    };

    // Shuffle cards
    this.shuffleCards();
  }

  /**
   * Get current game state
   */
  getState(): GameState {
    return { ...this.state };
  }

  /**
   * Update game state
   * @param updater Function to update state
   */
  updateState(updater: (state: GameState) => GameState): GameState {
    this.state = updater(this.state);
    return this.getState();
  }

  /**
   * Roll dice for current player
   */
  rollDice(): [number, number] {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    
    this.state.dice = [dice1, dice2];
    this.state.lastRoll = dice1 + dice2;
    
    // Check for doubles
    if (dice1 === dice2) {
      this.state.doubleCount++;
      
      // Check if player goes to jail (3 doubles in a row)
      if (this.state.doubleCount >= 3) {
        this.sendToJail();
        this.state.doubleCount = 0;
        return this.state.dice;
      }
    } else {
      this.state.doubleCount = 0;
    }
    
    // Move player
    this.movePlayer(this.state.lastRoll);
    
    return this.state.dice;
  }

  /**
   * Move current player
   * @param spaces Number of spaces to move
   */
  movePlayer(spaces: number): void {
    const currentPlayer = this.getCurrentPlayer();
    const config = getConfig();
    
    // Calculate new position
    const oldPosition = currentPlayer.position;
    const newPosition = (oldPosition + spaces) % 40;
    
    // Update player position
    currentPlayer.position = newPosition;
    
    // Check if player passed Go
    if (newPosition < oldPosition) {
      currentPlayer.money += config.game.goSalary;
    }
    
    // TODO: Handle landing on different spaces (properties, chance, etc.)
    
    // Update game phase
    this.state.phase = 'buying';
  }

  /**
   * Send current player to jail
   */
  sendToJail(): void {
    const currentPlayer = this.getCurrentPlayer();
    const config = getConfig();
    
    currentPlayer.position = config.game.jailPosition;
    currentPlayer.inJail = true;
    currentPlayer.jailTurns = 0;
    
    this.state.phase = 'rolling';
    this.endTurn();
  }

  /**
   * Buy property for current player
   * @param propertyId Property ID
   */
  buyProperty(propertyId: number): void {
    const currentPlayer = this.getCurrentPlayer();
    const property = this.getPropertyById(propertyId);
    
    if (!property) {
      throw new Error(`Property with ID ${propertyId} not found`);
    }
    
    if (property.owner) {
      throw new Error(`Property already owned by player ${property.owner}`);
    }
    
    if (currentPlayer.money < property.price) {
      throw new Error(`Player does not have enough money to buy property`);
    }
    
    // Update property owner
    property.owner = currentPlayer.id;
    
    // Deduct money from player
    currentPlayer.money -= property.price;
    
    // Add property to player's properties
    currentPlayer.properties.push(property);
    
    // Update game phase
    this.state.phase = 'rolling';
  }

  /**
   * End current player's turn
   */
  endTurn(): void {
    // Move to next player
    this.state.currentPlayerIndex = (this.state.currentPlayerIndex + 1) % this.state.players.length;
    
    // Reset dice
    this.state.dice = [0, 0];
    this.state.lastRoll = 0;
    
    // Update game phase
    this.state.phase = 'rolling';
    
    // Check if player is in jail
    const currentPlayer = this.getCurrentPlayer();
    if (currentPlayer.inJail) {
      currentPlayer.jailTurns++;
    }
  }

  /**
   * Add a spectator to the game
   * @param spectatorId Spectator ID
   */
  addSpectator(spectatorId: string): GameState {
    if (!this.state.spectators.includes(spectatorId)) {
      this.state.spectators.push(spectatorId);
    }
    return this.getState();
  }

  /**
   * Remove a spectator from the game
   * @param spectatorId Spectator ID
   */
  removeSpectator(spectatorId: string): GameState {
    this.state.spectators = this.state.spectators.filter(id => id !== spectatorId);
    return this.getState();
  }

  /**
   * Get current player
   */
  private getCurrentPlayer(): Player {
    return this.state.players[this.state.currentPlayerIndex];
  }

  /**
   * Get property by ID
   * @param propertyId Property ID
   */
  private getPropertyById(propertyId: number): Property | undefined {
    return this.state.properties.find(property => property.id === propertyId);
  }

  /**
   * Shuffle cards
   */
  private shuffleCards(): void {
    // Shuffle community chest cards
    for (let i = this.state.communityChestCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.state.communityChestCards[i], this.state.communityChestCards[j]] = 
      [this.state.communityChestCards[j], this.state.communityChestCards[i]];
    }
    
    // Shuffle chance cards
    for (let i = this.state.chanceCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.state.chanceCards[i], this.state.chanceCards[j]] = 
      [this.state.chanceCards[j], this.state.chanceCards[i]];
    }
  }
}
