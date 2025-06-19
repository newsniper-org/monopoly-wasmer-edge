import type { Card } from '../types';

/**
 * Initial Community Chest cards for a new game
 */
export const initialCommunityChestCards: Card[] = [
  {
    id: 'cc1',
    type: 'community',
    title: 'Bank error in your favor',
    description: 'Collect $200',
    action: {type: 'COLLECT',
    value: 200}
  },
  {
    id: 'cc2',
    type: 'community',
    title: 'Doctor\'s fee',
    description: 'Pay $50',
    action:  {type: 'PAY',
    value: 50}
  },
  {
    id: 'cc3',
    type: 'community',
    title: 'From sale of stock',
    description: 'You get $50',
    action: {type: 'COLLECT',
    value: 50}
  },
  {
    id: 'cc4',
    type: 'community',
    title: 'Get Out of Jail Free',
    description: 'This card may be kept until needed or sold',
    action: {type: 'GET_OUT_OF_JAIL'}
  },
  {
    id: 'cc5',
    type: 'community',
    title: 'Go to Jail',
    description: 'Go directly to Jail, do not pass Go, do not collect $200',
    action: {type: 'GO_TO_JAIL'}
  },
  {
    id: 'cc6',
    type: 'community',
    title: 'Grand Opera Night',
    description: 'Collect $50 from every player for opening night seats',
    action: {type: 'COLLECT_FROM_PLAYERS',
    value: 50}
  },
  {
    id: 'cc7',
    type: 'community',
    title: 'Holiday Fund matures',
    description: 'Collect $100',
    action: {type: 'COLLECT',
    value: 100}
  },
  {
    id: 'cc8',
    type: 'community',
    title: 'Income tax refund',
    description: 'Collect $20',
    action: {type: 'COLLECT',
    value: 20}
  },
  {
    id: 'cc9',
    type: 'community',
    title: 'It\'s your birthday',
    description: 'Collect $10 from every player',
    action: {type: 'COLLECT_FROM_PLAYERS',
    value: 10}
  },
  {
    id: 'cc10',
    type: 'community',
    title: 'Life insurance matures',
    description: 'Collect $100',
    action: {type: 'COLLECT',
    value: 100}
  },
  {
    id: 'cc11',
    type: 'community',
    title: 'Hospital fees',
    description: 'Pay $50',
    action: {type: 'PAY',
    value: 50}
  },
  {
    id: 'cc12',
    type: 'community',
    title: 'School fees',
    description: 'Pay $50',
    action: {type: 'PAY',
    value: 50}
  },
  {
    id: 'cc13',
    type: 'community',
    title: 'Receive consultancy fee',
    description: 'Collect $25',
    action: {type: 'COLLECT',
    value: 25}
  },
  {
    id: 'cc14',
    type: 'community',
    title: 'You are assessed for street repairs',
    description: '$40 per house, $115 per hotel',
    action: {type: 'REPAIRS',
    value: { house: 40, hotel: 115 }}
  },
  {
    id: 'cc15',
    type: 'community',
    title: 'You have won second prize in a beauty contest',
    description: 'Collect $10',
    action: {type: 'COLLECT',
    value: 10}
  },
  {
    id: 'cc16',
    type: 'community',
    title: 'You inherit',
    description: 'Collect $100',
    action: {type: 'COLLECT',
    value: 100}
  }
];

/**
 * Initial Chance cards for a new game
 */
export const initialChanceCards: Card[] = [
  {
    id: 'ch1',
    type: 'chance',
    title: 'Advance to Go',
    description: 'Collect $200',
    action: {type: 'ADVANCE_TO',
    value: 0}
  },
  {
    id: 'ch2',
    type: 'chance',
    title: 'Advance to Illinois Avenue',
    description: 'If you pass Go, collect $200',
    action: {type: 'ADVANCE_TO',
    value: 24}
  },
  {
    id: 'ch3',
    type: 'chance',
    title: 'Advance to St. Charles Place',
    description: 'If you pass Go, collect $200',
    action: {type: 'ADVANCE_TO',
    value: 11}
  },
  {
    id: 'ch4',
    type: 'chance',
    title: 'Advance to nearest Utility',
    description: 'If unowned, you may buy it from the Bank. If owned, throw dice and pay owner 10 times the amount thrown.',
    action: {type: 'ADVANCE_TO_NEAREST',
    value: 'utility'}
  },
  {
    id: 'ch5',
    type: 'chance',
    title: 'Advance to nearest Railroad',
    description: 'If unowned, you may buy it from the Bank. If owned, pay owner twice the rental to which they are otherwise entitled.',
    action: {type: 'ADVANCE_TO_NEAREST',
    value: 'railroad'}
  },
  {
    id: 'ch6',
    type: 'chance',
    title: 'Bank pays you dividend',
    description: 'Collect $50',
    action: {type: 'COLLECT',
    value: 50}
  },
  {
    id: 'ch7',
    type: 'chance',
    title: 'Get Out of Jail Free',
    description: '<pivotalAction type="file" filePath="packages/monopoly-core/src/constants/cards.ts">This card may be kept until needed or sold',
    action: {type: 'GET_OUT_OF_JAIL'}
  },
  {
    id: 'ch8',
    type: 'chance',
    title: 'Go back 3 spaces',
    description: 'Move back 3 spaces',
    action: {type: 'MOVE_BACK',
    value: 3}
  },
  {
    id: 'ch9',
    type: 'chance',
    title: 'Go to Jail',
    description: 'Go directly to Jail, do not pass Go, do not collect $200',
    action: {type: 'GO_TO_JAIL'}
  },
  {
    id: 'ch10',
    type: 'chance',
    title: 'Make general repairs on all your property',
    description: '$25 per house, $100 per hotel',
    action: {type: 'REPAIRS',
    value: { house: 25, hotel: 100 }}
  },
  {
    id: 'ch11',
    type: 'chance',
    title: 'Speeding fine',
    description: 'Pay $15',
    action: {type: 'PAY',
    value: 15}
  },
  {
    id: 'ch12',
    type: 'chance',
    title: 'Take a trip to Reading Railroad',
    description: 'If you pass Go, collect $200',
    action: {type: 'ADVANCE_TO',
    value: 5}
  },
  {
    id: 'ch13',
    type: 'chance',
    title: 'Take a walk on the Boardwalk',
    description: 'Advance to Boardwalk',
    action: {type: 'ADVANCE_TO',
    value: 39}
  },
  {
    id: 'ch14',
    type: 'chance',
    title: 'You have been elected Chairman of the Board',
    description: 'Pay each player $50',
    action: {type: 'PAY_TO_PLAYERS',
    value: 50}
  },
  {
    id: 'ch15',
    type: 'chance',
    title: 'Your building loan matures',
    description: 'Collect $150',
    action: {type: 'COLLECT',
    value: 150}
  },
  {
    id: 'ch16',
    type: 'chance',
    title: 'You have won a crossword competition',
    description: 'Collect $100',
    action: {type: 'COLLECT',
    value: 100}
  }
];
