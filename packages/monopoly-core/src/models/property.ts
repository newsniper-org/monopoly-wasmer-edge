import type { Property } from '../types';

/**
 * Property model that encapsulates property operations
 */
export class PropertyModel {
  private property: Property;

  /**
   * Create a new property model
   * @param property Property data
   */
  constructor(property: Property) {
    this.property = { ...property };
  }

  /**
   * Get property data
   */
  getData(): Property {
    return { ...this.property };
  }

  /**
   * Update property data
   * @param updates Partial property updates
   */
  update(updates: Partial<Property>): Property {
    this.property = { ...this.property, ...updates };
    return this.getData();
  }

  /**
   * Set property owner
   * @param ownerId Owner ID
   */
  setOwner(ownerId: string): Property {
    this.property.owner = ownerId;
    return this.getData();
  }

  /**
   * Clear property owner
   */
  clearOwner(): Property {
    this.property.owner = undefined;
    return this.getData();
  }

  /**
   * Mortgage property
   */
  mortgage(): Property {
    if (this.property.mortgaged) {
      throw new Error('Property is already mortgaged');
    }
    this.property.mortgaged = true;
    return this.getData();
  }

  /**
   * Unmortgage property
   */
  unmortgage(): Property {
    if (!this.property.mortgaged) {
      throw new Error('Property is not mortgaged');
    }
    this.property.mortgaged = false;
    return this.getData();
  }

  /**
   * Add house to property
   */
  addHouse(): Property {
    if (this.property.type !== 'property') {
      throw new Error('Cannot add house to non-property');
    }
    if (this.property.houses >= 4) {
      throw new Error('Maximum houses reached');
    }
    if (this.property.hotels > 0) {
      throw new Error('Cannot add houses when hotel exists');
    }
    this.property.houses += 1;
    return this.getData();
  }

  /**
   * Remove house from property
   */
  removeHouse(): Property {
    if (this.property.houses <= 0) {
      throw new Error('No houses to remove');
    }
    this.property.houses -= 1;
    return this.getData();
  }

  /**
   * Add hotel to property
   */
  addHotel(): Property {
    if (this.property.type !== 'property') {
      throw new Error('Cannot add hotel to non-property');
    }
    if (this.property.houses < 4) {
      throw new Error('Need 4 houses before adding hotel');
    }
    if (this.property.hotels >= 1) {
      throw new Error('Maximum hotels reached');
    }
    this.property.houses = 0;
    this.property.hotels = 1;
    return this.getData();
  }

  /**
   * Remove hotel from property
   */
  removeHotel(): Property {
    if (this.property.hotels <= 0) {
      throw new Error('No hotels to remove');
    }
    this.property.hotels = 0;
    this.property.houses = 4; // Convert back to houses
    return this.getData();
  }

  /**
   * Calculate current rent for property
   * @param diceRoll Optional dice roll (for utilities)
   * @param ownedInGroup Number of properties owned in the same group (for railroads)
   */
  calculateRent(diceRoll?: number, ownedInGroup?: number): number {
    if (this.property.mortgaged) {
      return 0;
    }

    switch (this.property.type) {
      case 'property':
        // If has hotel
        if (this.property.hotels > 0) {
          return this.property.rent[5];
        }
        // If has houses
        if (this.property.houses > 0) {
          return this.property.rent[this.property.houses];
        }
        // Base rent (possibly doubled if owns all in color group)
        return this.property.rent[0];
      
      case 'railroad':
        // Rent depends on how many railroads are owned
        const railroadIndex = Math.min((ownedInGroup || 1) - 1, 3);
        return this.property.rent[railroadIndex];
      
      case 'utility':
        // Rent depends on dice roll and number of utilities owned
        const multiplier = (ownedInGroup || 1) === 1 ? 4 : 10;
        return (diceRoll || 0) * multiplier;
      
      default:
        return 0;
    }
  }
}
