// Stores the default levels definitions.
export const LevelDefinitionsData = [
  /**
   * Level 1: Goal: 10 - 100% Category 1.
   * Level 2: Goal: 20 - 90% Category 1, 10% category 2.
   * Level 3: Goal: 40 - 60% Category 1, 30% category 2, 10% category 3.
   * Level 4: Goal: 60 - 50% Category 1, 30% category 2, 20% category 3.
   * Level 5: Goal: 75 - 45% Category 1, 25% category 2, 20% category 3, 10% category 4, 1 category 5.
   * Level 6: Goal: 90 - 40% Category 1, 20% category 2, 25% category 3, 15% category 4, 1 category 5.
   * Level 7: Goal: 110 - 30% Category 1, 20% category 2, 30% category 3, 20% category 4, 1 category 5.
   * Level 8: Goal: 125 - 30% Category 1, 15% category 2, 35% category 3, 20% category 4, 2 category 5.
   * Level 9: Goal: 150 - 25% Category 1, 10% category 2, 40% category 3, 25% category 4, 2 category 5.
   * Level 10: Goal: 175 - 15% Category 1, 15% category 2, 40% category 3, 30% category 4, 3 category 5.
   */
  { id: 0, name: 'Level 1', goal: 10, wordsToDisplay: 4, categoryPercentage: { 1: 10 }, bonusCategory: {} },
  { id: 1, name: 'Level 2', goal: 20, wordsToDisplay: 4, categoryPercentage: { 1: 18, 2: 1 }, bonusCategory: {} },
  { id: 2, name: 'Level 3', goal: 40, wordsToDisplay: 4, categoryPercentage: { 1: 24, 2: 6, 3: 3 }, bonusCategory: {} },
  { id: 3, name: 'Level 4', goal: 60, wordsToDisplay: 3, categoryPercentage: { 1: 30, 2: 9, 3: 3 }, bonusCategory: {} },
  { id: 4, name: 'Level 5', goal: 75, wordsToDisplay: 3, categoryPercentage: { 1: 34, 2: 10, 3: 4, 4: 2 }, bonusCategory: { 5: 1 } },
  { id: 5, name: 'Level 6', goal: 90, wordsToDisplay: 2, categoryPercentage: { 1: 36, 2: 9, 3: 6, 4: 3 }, bonusCategory: { 5: 1 } },
  { id: 6, name: 'Level 7', goal: 110, wordsToDisplay: 2, categoryPercentage: { 1: 33, 2: 11, 3: 9, 4: 5 }, bonusCategory: { 5: 1 } },
  { id: 7, name: 'Level 8', goal: 125, wordsToDisplay: 1, categoryPercentage: { 1: 38, 2: 10, 3: 11, 4: 5 }, bonusCategory: { 5: 2 } },
  { id: 8, name: 'Level 9', goal: 150, wordsToDisplay: 1, categoryPercentage: { 1: 38, 2: 8, 3: 15, 4: 8 }, bonusCategory: { 5: 2 } },
  { id: 9, name: 'Level 10', goal: 175, wordsToDisplay: 1, categoryPercentage: { 1: 27, 2: 14, 3: 18, 4: 11 }, bonusCategory: { 5: 3 } }
];
