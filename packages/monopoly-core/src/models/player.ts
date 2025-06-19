import type { Player, Property } from '../types';

/**
 * Player model that encapsulates player operations
 */
export class PlayerModel {
  private player: Player;

  /**
   * Create a new player model
   * @param player Player data
   */
  constructor(player: Player) {
    this.player = { ...player };
  }

  /**
   * Get player data
   */
  getData(): Player {
    return { ...this.player };
  }

  /**
   * Update player data
   * @param updates Partial player updates
   */
  update(updates: Partial<Player>): Player {
    this.player = { ...this.player, ...updates };
    return this.getData();
  }

  /**
   * Add money to player
   * @param amount Amount to add
   */
  addMoney(amount: number): Player {
    this.player.money += amount;
    return this.getData();
  }

  /**
   * Subtract money from player
   * @param amount Amount to subtract
   * @throws Error if player doesn't have enough money
   */
  subtractMoney(amount: number): Player {
    if (this.player.money < amount) {
      throw new Error('Not enough money');
    }
    this.player.money -= amount;
    return this.getData();
  }

  /**
   * Add property to player
   * @param property Property to add
   */
  addProperty(property: Property): Player {
    this.player.properties.push(property);
    return this.getData();
  }

  /**
   * Remove property from player
   * @param propertyId Property ID to remove
   */
  removeProperty(propertyId: number): Player {
    this.player.properties = this.player.properties.filter(p => p.id !== propertyId);
    return this.getData();
  }

  /**
   * Check if player owns a property
   * @param propertyId Property ID to check
   */
  ownsProperty(propertyId: number): boolean {
    return this.player.properties.some(p => p.id === propertyId);
  }

  /**
   * Send player to jail
   */
  sendToJail(): Player {
    this.player.inJail = true;
    this.player.jailTurns = 0;
    this.player.position = 10; // Jail position
    return this.getData();
  }

  /**
   * Release player from jail
   */
  releaseFromJail(): Player {
    this.player.inJail = false;
    this.player.jailTurns = 0;
    return this.getData();
  }

  /**
   * Check if player owns all properties of a color group
   * @param color Color group to check
   * @param allProperties All properties in the game
   */
  ownsColorGroup(color: string, allProperties: Property[]): boolean {
    const colorProperties = allProperties.filter(p => p.color === color);
    return colorProperties.every(p => this.ownsProperty(p.id));
  }
}
