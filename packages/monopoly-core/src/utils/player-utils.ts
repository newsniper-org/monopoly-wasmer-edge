import type { Player, Property } from '../types';
import { getPropertiesByOwner, calculateRent } from './property-utils';

/**
 * Calculate player's net worth (money + property values)
 * @param player Player to calculate net worth for
 * @param properties All properties
 */
export function calculateNetWorth(player: Player, properties: Property[]): number {
  const ownedProperties = getPropertiesByOwner(properties, player.id);
  
  const propertyValue = ownedProperties.reduce((total, property) => {
    let value = property.mortgaged ? property.mortgageValue : property.price;
    
    // Add value of houses and hotels
    if (property.type === 'property') {
      value += (property.houses * (property.houseCost || 0));
      value += (property.hotels * (property.hotelCost || 0));
    }
    
    return total + value;
  }, 0);
  
  return player.money + propertyValue;
}

/**
 * Check if a player is bankrupt
 * @param player Player to check
 * @param amount Amount player needs to pay
 * @param properties All properties
 */
export function isBankrupt(player: Player, amount: number, properties: Property[]): boolean {
  const ownedProperties = getPropertiesByOwner(properties, player.id);
  
  // If player has enough cash, they're not bankrupt
  if (player.money >= amount) {
    return false;
  }
  
  // Calculate how much money player could raise by mortgaging properties
  const potentialMortgageValue = ownedProperties.reduce((total, property) => {
    if (!property.mortgaged) {
      return total + property.mortgageValue;
    }
    return total;
  }, 0);
  
  // Check if player could raise enough money by mortgaging
  return (player.money + potentialMortgageValue) < amount;
}

/**
 * Get all players who owe rent to the current player
 * @param currentPlayer Current player
 * @param allPlayers All players
 * @param properties All properties
 */
export function getPlayersOwingRent(currentPlayer: Player, allPlayers: Player[], properties: Property[]): { player: Player, amount: number }[] {
  const result: { player: Player, amount: number }[] = [];
  
  for (const player of allPlayers) {
    if (player.id === currentPlayer.id || !player.isActive) {
      continue;
    }
    
    // Find properties where this player is standing
    const propertyAtPosition = properties.find(p => p.id === player.position);
    
    if (propertyAtPosition && propertyAtPosition.owner === currentPlayer.id) {
      const rentAmount = calculateRent(propertyAtPosition, properties);
      result.push({ player, amount: rentAmount });
    }
  }
  
  return result;
}

/**
 * Check if a player can afford to buy a property
 * @param player Player to check
 * @param property Property to buy
 */
export function canAffordProperty(player: Player, property: Property): boolean {
  return player.money >= property.price;
}

/**
 * Check if a player can get out of jail
 * @param player Player to check
 */
export function canGetOutOfJail(player: Player): boolean {
  return player.money >= 50; // Cost to get out of jail
}
