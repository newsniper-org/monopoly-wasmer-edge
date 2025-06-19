/**
 * Roll a single die
 * @returns Random number between 1 and 6
 */
export function rollDie(): number {
  return Math.floor(Math.random() * 6) + 1;
}

/**
 * Roll two dice
 * @returns Array with two random numbers between 1 and 6
 */
export function rollDice(): [number, number] {
  return [rollDie(), rollDie()];
}

/**
 * Check if dice roll is a double
 * @param dice Dice values
 */
export function isDouble(dice: [number, number]): boolean {
  return dice[0] === dice[1];
}

/**
 * Get the sum of dice values
 * @param dice Dice values
 */
export function getDiceSum(dice: [number, number]): number {
  return dice[0] + dice[1];
}
