/**
 * Generate a random integer between min and max (inclusive)
 * @param min Minimum value
 * @param max Maximum value
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Roll a dice
 * @returns A random number between 1 and 6
 */
export function rollDice(): number {
  return randomInt(1, 6);
}

/**
 * Roll two dice
 * @returns An array with two random numbers between 1 and 6
 */
export function rollTwoDice(): [number, number] {
  return [rollDice(), rollDice()];
}

/**
 * Check if a player can afford a price
 * @param playerMoney Player's money
 * @param price Price to check
 */
export function canAfford(playerMoney: number, price: number): boolean {
  return playerMoney >= price;
}

/**
 * Calculate the new position after moving
 * @param currentPosition Current position
 * @param steps Steps to move
 * @param boardSize Board size
 */
export function calculateNewPosition(
  currentPosition: number,
  steps: number,
  boardSize: number = 40
): number {
  return (currentPosition + steps) % boardSize;
}

/**
 * Check if a player passed GO
 * @param oldPosition Old position
 * @param newPosition New position
 */
export function passedGo(oldPosition: number, newPosition: number): boolean {
  return newPosition < oldPosition;
}

/**
 * Calculate rent for a property
 * @param property Property
 */
export function calculateRent(property: {
  type: string;
  rent: number[];
  houses: number;
  hotels: number;
}): number {
  if (property.hotels > 0) {
    return property.rent[5];
  }
  
  return property.rent[property.houses];
}

/**
 * Deep clone an object
 * @param obj Object to clone
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Format money as currency
 * @param amount Amount to format
 */
export function formatMoney(amount: number): string {
  return `$${amount.toLocaleString()}`;
}
