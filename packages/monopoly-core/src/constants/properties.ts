import type { Property } from '../types';

/**
 * Initial properties data for a new game
 */
export const initialProperties: Property[] = [
  // Corner spaces
  { id: 0, name: "GO", type: "special", price: 0, rent: [], mortgageValue: 0, houses: 0, hotels: 0, mortgaged: false },
  
  // Brown properties
  { id: 1, name: "Mediterranean Avenue", type: "property", color: "brown", price: 60, rent: [2, 10, 30, 90, 160, 250], mortgageValue: 30, houseCost: 50, hotelCost: 50, houses: 0, hotels: 0, mortgaged: false },
  { id: 2, name: "Community Chest", type: "special", price: 0, rent: [], mortgageValue: 0, houses: 0, hotels: 0, mortgaged: false },
  { id: 3, name: "Baltic Avenue", type: "property", color: "brown", price: 60, rent: [4, 20, 60, 180, 320, 450], mortgageValue: 30, houseCost: 50, hotelCost: 50, houses: 0, hotels: 0, mortgaged: false },
  { id: 4, name: "Income Tax", type: "special", price: 0, rent: [], mortgageValue: 0, houses: 0, hotels: 0, mortgaged: false },
  
  // Railroad
  { id: 5, name: "Reading Railroad", type: "railroad", price: 200, rent: [25, 50, 100, 200], mortgageValue: 100, houses: 0, hotels: 0, mortgaged: false },
  
  // Light Blue properties
  { id: 6, name: "Oriental Avenue", type: "property", color: "lightblue", price: 100, rent: [6, 30, 90, 270, 400, 550], mortgageValue: 50, houseCost: 50, hotelCost: 50, houses: 0, hotels: 0, mortgaged: false },
  { id: 7, name: "Chance", type: "special", price: 0, rent: [], mortgageValue: 0, houses: 0, hotels: 0, mortgaged: false },
  { id: 8, name: "Vermont Avenue", type: "property", color: "lightblue", price: 100, rent: [6, 30, 90, 270, 400, 550], mortgageValue: 50, houseCost: 50, hotelCost: 50, houses: 0, hotels: 0, mortgaged: false },
  { id: 9, name: "Connecticut Avenue", type: "property", color: "lightblue", price: 120, rent: [8, 40, 100, 300, 450, 600], mortgageValue: 60, houseCost: 50, hotelCost: 50, houses: 0, hotels: 0, mortgaged: false },
  
  // Jail
  { id: 10, name: "Jail", type: "special", price: 0, rent: [], mortgageValue: 0, houses: 0, hotels: 0, mortgaged: false },
  
  // Pink properties
  { id: 11, name: "St. Charles Place", type: "property", color: "purple", price: 140, rent: [10, 50, 150, 450, 625, 750], mortgageValue: 70, houseCost: 100, hotelCost: 100, houses: 0, hotels: 0, mortgaged: false },
  { id: 12, name: "Electric Company", type: "utility", price: 150, rent: [4, 10], mortgageValue: 75, houses: 0, hotels: 0, mortgaged: false },
  { id: 13, name: "States Avenue", type: "property", color: "purple", price: 140, rent: [10, 50, 150, 450, 625, 750], mortgageValue: 70, houseCost: 100, hotelCost: 100, houses: 0, hotels: 0, mortgaged: false },
  { id: 14, name: "Virginia Avenue", type: "property", color: "purple", price: 160, rent: [12, 60, 180, 500, 700, 900], mortgageValue: 80, houseCost: 100, hotelCost: 100, houses: 0, hotels: 0, mortgaged: false },
  
  // Railroad
  { id: 15, name: "Pennsylvania Railroad", type: "railroad", price: 200, rent: [25, 50, 100, 200], mortgageValue: 100, houses: 0, hotels: 0, mortgaged: false },
  
  // Orange properties
  { id: 16, name: "St. James Place", type: "property", color: "orange", price: 180, rent: [14, 70, 200, 550, 750, 950], mortgageValue: 90, houseCost: 100, hotelCost: 100, houses: 0, hotels: 0, mortgaged: false },
  { id: 17, name: "Community Chest", type: "special", price: 0, rent: [], mortgageValue: 0, houses: 0, hotels: 0, mortgaged: false },
  { id: 18, name: "Tennessee Avenue", type: "property", color: "orange", price: 180, rent: [14, 70, 200, 550, 750, 950], mortgageValue: 90, houseCost: 100, hotelCost: 100, houses: 0, hotels: 0, mortgaged: false },
  { id: 19, name: "New York Avenue", type: "property", color: "orange", price: 200, rent: [16, 80, 220, 600, 800, 1000], mortgageValue: 100, houseCost: 100, hotelCost: 100, houses: 0, hotels: 0, mortgaged: false },
  
  // Free Parking
  { id: 20, name: "Free Parking", type: "special", price: 0, rent: [], mortgageValue: 0, houses: 0, hotels: 0, mortgaged: false },
  
  // Red properties
  { id: 21, name: "Kentucky Avenue", type: "property", color: "red", price: 220, rent: [18, 90, 250, 700, 875, 1050], mortgageValue: 110, houseCost: 150, hotelCost: 150, houses: 0, hotels: 0, mortgaged: false },
  { id: 22, name: "Chance", type: "special", price: 0, rent: [], mortgageValue: 0, houses: 0, hotels: 0, mortgaged: false },
  { id: 23, name: "Indiana Avenue", type: "property", color: "red", price: 220, rent: [18, 90, 250, 700, 875, 1050], mortgageValue: 110, houseCost: 150, hotelCost: 150, houses: 0, hotels: 0, mortgaged: false },
  { id: 24, name: "Illinois Avenue", type: "property", color: "red", price: 240, rent: [20, 100, 300, 750, 925, 1100], mortgageValue: 120, houseCost: 150, hotelCost: 150, houses: 0, hotels: 0, mortgaged: false },
  
  // Railroad
  { id: 25, name: "B. & O. Railroad", type: "railroad", price: 200, rent: [25, 50, 100, 200], mortgageValue: 100, houses: 0, hotels: 0, mortgaged: false },
  
  // Yellow properties
  { id: 26, name: "Atlantic Avenue", type: "property", color: "yellow", price: 260, rent: [22, 110, 330, 800, 975, 1150], mortgageValue: 130, houseCost: 150, hotelCost: 150, houses: 0, hotels: 0, mortgaged: false },
  { id: 27, name: "Ventnor Avenue", type: "property", color: "yellow", price: 260, rent: [22, 110, 330, 800, 975, 1150], mortgageValue: 130, houseCost: 150, hotelCost: 150, houses: 0, hotels: 0, mortgaged: false },
  { id: 28, name: "Water Works", type: "utility", price: 150, rent: [4, 10], mortgageValue: 75, houses: 0, hotels: 0, mortgaged: false },
  { id: 29, name: "Marvin Gardens", type: "property", color: "yellow", price: 280, rent: [24, 120, 360, 850, 1025, 1200], mortgageValue: 140, houseCost: 150, hotelCost: 150, houses: 0, hotels: 0, mortgaged: false },
  
  // Go to Jail
  { id: 30, name: "Go to Jail", type: "special", price: 0, rent: [], mortgageValue: 0, houses: 0, hotels: 0, mortgaged: false },
  
  // Green properties
  { id: 31, name: "Pacific Avenue", type: "property", color: "green", price: 300, rent: [26, 130, 390, 900, 1100, 1275], mortgageValue: 150, houseCost: 200, hotelCost: 200, houses: 0, hotels: 0, mortgaged: false },
  { id: 32, name: "North Carolina Avenue", type: "property", color: "green", price: 300, rent: [26, 130, 390, 900, 1100, 1275], mortgageValue: 150, houseCost: 200, hotelCost: 200, houses: 0, hotels: 0, mortgaged: false },
  { id: 33, name: "Community Chest", type: "special", price: 0, rent: [], mortgageValue: 0, houses: 0, hotels: 0, mortgaged: false },
  { id: 34, name: "Pennsylvania Avenue", type: "property", color: "green", price: 320, rent: [28, 150, 450, 1000, 1200, 1400], mortgageValue: 160, houseCost: 200, hotelCost: 200, houses: 0, hotels: 0, mortgaged: false },
  
  // Railroad
  { id: 35, name: "Short Line", type: "railroad", price: 200, rent: [25, 50, 100, 200], mortgageValue: 100, houses: 0, hotels: 0, mortgaged: false },
  
  // Chance
  { id: 36, name: "Chance", type: "special", price: 0, rent: [], mortgageValue: 0, houses: 0, hotels: 0, mortgaged: false },
  
  // Blue properties
  { id: 37, name: "Park Place", type: "property", color: "blue", price: 350, rent: [35, 175, 500, 1100, 1300, 1500], mortgageValue: 175, houseCost: 200, hotelCost: 200, houses: 0, hotels: 0, mortgaged: false },
  { id: 38, name: "Luxury Tax", type: "special", price: 0, rent: [], mortgageValue: 0, houses: 0, hotels: 0, mortgaged: false },
  { id: 39, name: "Boardwalk", type: "property", color: "blue", price: 400, rent: [50, 200, 600, 1400, 1700, 2000], mortgageValue: 200, houseCost: 200, hotelCost: 200, houses: 0, hotels: 0, mortgaged: false }
];
