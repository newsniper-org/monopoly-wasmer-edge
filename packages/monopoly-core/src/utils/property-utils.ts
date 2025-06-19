import type { Property } from '../types';

/**
 * Get all properties of a specific color
 * @param properties All properties
 * @param color Color to filter by
 */
export function getPropertiesByColor(properties: Property[], color: string): Property[] {
  return properties.filter(property => property.color === color);
}

/**
 * Get all properties owned by a player
 * @param properties All properties
 * @param playerId Player ID
 */
export function getPropertiesByOwner(properties: Property[], playerId: string): Property[] {
  return properties.filter(property => property.owner === playerId);
}

/**
 * Check if a player owns all properties of a color
 * @param properties All properties
 * @param playerId Player ID
 * @param color Color to check
 */
export function ownsAllPropertiesOfColor(properties: Property[], playerId: string, color: string): boolean {
  const colorProperties = getPropertiesByColor(properties, color);
  return colorProperties.length > 0 && colorProperties.every(property => property.owner === playerId);
}

/**
 * Count how many properties of a type a player owns
 * @param properties All properties
 * @param playerId Player ID
 * @param type Property type
 */
export function countPropertiesByType(properties: Property[], playerId: string, type: Property['type']): number {
  return properties.filter(property => property.owner === playerId && property.type === type).length;
}

/**
 * Calculate rent for a property
 * @param property Property to calculate rent for
 * @param properties All properties (needed for color group checks)
 * @param diceRoll Dice roll (for utilities)
 */
export function calculateRent(property: Property, properties: Property[], diceRoll?: number): number {
  if (property.mortgaged || !property.owner) {
    return 0;
  }

  switch (property.type) {
    case 'property': {
      // If has hotel
      if (property.hotels > 0) {
        return property.rent[5];
      }
      
      // If has houses
      if (property.houses > 0) {
        return property.rent[property.houses];
      }
      
      // Base rent (possibly doubled if owns all in color group)
      const baseRent = property.rent[0];
      const ownsAll = property.color ? 
        ownsAllPropertiesOfColor(properties, property.owner, property.color) : 
        false;
        
      return ownsAll ? baseRent * 2 : baseRent;
    }
    
    case 'railroad': {
      const ownedCount = countPropertiesByType(properties, property.owner, 'railroad');
      const rentIndex = Math.min(ownedCount - 1, 3);
      return property.rent[rentIndex];
    }
    
    case 'utility': {
      const ownedCount = countPropertiesByType(properties, property.owner, 'utility');
      const multiplier = ownedCount === 1 ? 4 : 10;
      return (diceRoll || 0) * multiplier;
    }
    
    default:
      return 0;
  }
}

/**
 * Check if houses can be built on a property
 * @param property Property to check
 * @param properties All properties
 * @param playerId Player ID
 */
export function canBuildHouse(property: Property, properties: Property[], playerId: string): boolean {
  // Must be a regular property
  if (property.type !== 'property' || !property.color) {
    return false;
  }
  
  // Must own all properties in the color group
  if (!ownsAllPropertiesOfColor(properties, playerId, property.color)) {
    return false;
  }
  
  // Cannot build if mortgaged
  if (property.mortgaged) {
    return false;
  }
  
  // Cannot build more than 4 houses
  if (property.houses >= 4) {
    return false;
  }
  
  // Cannot build houses if there's a hotel
  if (property.hotels > 0) {
    return false;
  }
  
  // Must build evenly
  const colorProperties = getPropertiesByColor(properties, property.color);
  const minHouses = Math.min(...colorProperties.map(p => p.houses));
  
  return property.houses === minHouses;
}

/**
 * Check if a hotel can be built on a property
 * @param property Property to check
 * @param properties All properties
 * @param playerId Player ID
 */
export function canBuildHotel(property: Property, properties: Property[], playerId: string): boolean {
  // Must be a regular property
  if (property.type !== 'property' || !property.color) {
    return false;
  }
  
  // Must own all properties in the color group
  if (!ownsAllPropertiesOfColor(properties, playerId, property.color)) {
    return false;
  }
  
  // Cannot build if mortgaged
  if (property.mortgaged) {
    return false;
  }
  
  // Must have 4 houses before building a hotel
  if (property.houses !== 4) {
    return false;
  }
  
  // Cannot build more than 1 hotel
  if (property.hotels >= 1) {
    return false;
  }
  
  // All properties in the color group must have 4 houses
  const colorProperties = getPropertiesByColor(properties, property.color);
  return colorProperties.every(p => p.houses === 4 || p.hotels > 0);
}
