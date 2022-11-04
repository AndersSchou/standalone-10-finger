import { Injectable } from '@angular/core';
import { FishDetailsDTO } from '../dto/fish.dto';
import { LevelDefinitionsData } from '../games/fish/level-definition';
import { FishDefinitionsData } from '../games/fish/fish-definition';

class LevelDefinition {
  /**
   *
   * @param name Represents the name of the level.
   * @param goal Represents the goal score of the level.
   * @param wordsToDisplay Represents the number of words to display for each level.
   * @param categoryPercentage Represents the number of words based on the category percentage.
   * @param bonusCategory Represents the number of words from category 5 (bonus category).
   */
  constructor(
    protected id: number,
    protected name: string,
    protected goal: number,
    protected wordsToDisplay: number,
    protected categoryPercentage: { [key: number]: number },
    protected bonusCategory: { [key: number]: number }) { }

  /**
   * Get the maximum category number for current level.
   *
   * @returns The maximum category number for the current level.
   */
  getLevelMaxFishCategory(): number {
    if (Object.keys(this.bonusCategory).length > 0) {
      return Math.max(...Object.keys(this.bonusCategory).map(n => parseInt(n)));
    } else {
      return Math.max(...Object.keys(this.categoryPercentage).map(n => parseInt(n)));
    }
  }

  /**
   * Get all the available fish categories for the current level.
   *
   * @returns An array of all the available fish categories for the current level.
   */
  getAvailableCategories(): number[] {
    let catPercentage = this.categoryPercentage;
    if (Object.keys(this.bonusCategory).length > 0) {
      catPercentage[Number(Object.keys(this.bonusCategory))] = this.bonusCategory[Number(Object.keys(this.bonusCategory))];
    }
    return Object.keys(catPercentage).map(n => parseInt(n));
  }

  /**
   * Get the number of words for the current category.
   *
   * @param category Represents the category number.
   *
   * @returns The number of words for the current category.
   */
  getCategoryPercentage(category: number): number {
    if (this.categoryPercentage[category]) {
      return this.categoryPercentage[category];
    }
    return 0;
  }

  /**
   * Get level details.
   *
   * @returns The current level as LevelDefinition.
   */
  getLevel(): LevelDefinition {
    return this;
  }

}

class FishDefinition {
  constructor(
    protected category: number,
    protected name: string,
    protected wordMinSize: number,
    protected wordMaxSize: number,
    protected maxErrors: number,
    protected extraTime: number,
    protected reward: number,
    protected images: FishDetailsDTO[],
  ) { }

  getCategoryId(): number {
    return this.category;
  }

  getName(): string {
    return this.name;
  }

  getWordMinSize(): number {
    return this.wordMinSize;
  }

  getWordMaxSize(): number {
    return this.wordMaxSize;
  }

  getImages(): FishDetailsDTO[] {
    return this.images;
  }
}

class FishWithWord {
  protected fishImage: FishDetailsDTO;
  constructor(
    protected fish: FishDefinition,
    protected word: string,
  ) {
    this.fishImage = fish.getImages()[Math.floor(Math.random() * fish.getImages().length)];
  }

  getFish(): FishDefinition {
    return this.fish;
  }

  getWord(): string {
    return this.word;
  }
}

class FishDefinitions {
  constructor(
    protected fishDefinitions: FishDefinition[],
  ) { }

  getFishLevelByWordSize(wordSize: number): FishDefinition | undefined {
    return this.fishDefinitions.find(fish => wordSize >= fish.getWordMinSize() && wordSize <= fish.getWordMaxSize());
  }

  getFishDefinition(name: string): FishDefinition | undefined {
    return this.fishDefinitions.find(fish => fish.getName() === name);
  }

  getFishDefinitions(): FishDefinition[] {
    return this.fishDefinitions;
  }

  getFishCategory(index: number): FishDefinition {
    return this.fishDefinitions[index];
  }

  getMaxWordSize(): number {
    return Math.max(...this.fishDefinitions.map(fish => fish.getWordMaxSize()));
  }

  getMinWordSize(): number {
    return Math.min(...this.fishDefinitions.map(fish => fish.getWordMinSize()));
  }
}

@Injectable()
export class LevelService {
  /**
   * Level 1: Goal: 10 - 100% Category 1
   * Level 2: Goal: 20 - 90% Category 1, 10% category 2
   * Level 3: Goal: 40 - 60% Category 1, 30% category 2, 10% category 3
   * Level 4: Goal: 60 - 50% Category 1, 30% category 2, 20% category 3
   * Level 5: Goal: 75 - 45% Category 1, 25% category 2, 20% category 3, 10% category 4, 1 category 5
   * Level 6: Goal: 90 - 40% Category 1, 20% category 2, 25% category 3, 15% category 4, 1 category 5
   * Level 7: Goal: 110 - 30% Category 1, 20% category 2, 30% category 3, 20% category 4, 1 category 5
   * Level 8: Goal: 125 - 30% Category 1, 15% category 2, 35% category 3, 20% category 4, 2 category 5
   * Level 9: Goal: 150 - 25% Category 1, 10% category 2, 40% category 3, 25% category 4, 2 category 5
   * Level 10: Goal: 175 - 15% Category 1, 15% category 2, 40% category 3, 30% category 4, 3 category 5
   */
  // protected levels: LevelDefinition[] = [
  //   new LevelDefinition('Level 1', 10, 4, { 1: 10 }, {}),
  //   new LevelDefinition('Level 2', 20, 4, { 1: 18, 2: 1 }, {}),
  //   new LevelDefinition('Level 3', 40, 4, { 1: 24, 2: 6, 3: 3 }, {}),
  //   new LevelDefinition('Level 4', 60, 3, { 1: 30, 2: 9, 3: 3 }, {}),
  //   new LevelDefinition('Level 5', 75, 3, { 1: 34, 2: 10, 3: 4, 4: 2 }, { 5: 1 }),
  //   new LevelDefinition('Level 6', 90, 2, { 1: 36, 2: 9, 3: 6, 4: 3 }, { 5: 1 }),
  //   new LevelDefinition('Level 7', 110, 2, { 1: 33, 2: 11, 3: 9, 4: 5 }, { 5: 1 }),
  //   new LevelDefinition('Level 8', 125, 1, { 1: 38, 2: 10, 3: 11, 4: 5 }, { 5: 2 }),
  //   new LevelDefinition('Level 9', 150, 1, { 1: 38, 2: 8, 3: 15, 4: 8 }, { 5: 2 }),
  //   new LevelDefinition('Level 10', 175, 1, { 1: 27, 2: 14, 3: 18, 4: 11 }, { 5: 3 }),
  // ];

  /**
   * Fish category 1 - Word length max 3 (max 2 errors)
   * marine_fish - Reward: 1
   * marine_fish_1 - Reward: 1
   * blue_fish_1 - Reward: 1
   * blue_fish_2 - Reward: 1
   *
   * Fish category 2 - Word length 4-6 (max 1 error)
   * striped_fish - Reward: 2
   * striped_fish_1 - Reward: 2
   * red_fish - Reward: 2
   *
   * Fish category 3 - Word length 7-9 (no error)
   * koi_white_red_1 - Reward: 4
   * koi_red_black - Reward: 4
   * koi_orange_white - Reward: 4
   * koi_orange_white_1 - Reward: 4
   * koi_orange_black - Reward: 4
   *
   * Fish category 4 Word length 10+ (no error)
   * koi_black - Reward: 5
   * koi_yellow - Reward: 5
   * crap - Reward: 5
   *
   * Fish category 5 Word length 12+ (1 error)
   * chest - Reward: 10
   */
  // protected fish: FishDefinitions = new FishDefinitions([
  //   new FishDefinition(1, 'Category 1', 1, 3, 2, 0, 1, [
  //     { name: 'marine_fish', width: 9, height: 4 },
  //     { name: 'marine_fish_1', width: 5, height: 3 },
  //     { name: 'blue_fish_1', width: 8, height: 4 },
  //     { name: 'blue_fish_2', width: 8, height: 4 },
  //   ]),
  //   new FishDefinition(2, 'Category 2', 4, 6, 1, 0, 2, [
  //     { name: 'striped_fish', width: 6, height: 6 },
  //     { name: 'striped_fish_1', width: 6, height: 4 },
  //     { name: 'red_fish', width: 5, height: 3 },
  //   ]),
  //   new FishDefinition(3, 'Category 3', 7, 9, 0, 0, 4, [
  //     { name: 'koi_white_red_1', width: 5, height: 4 },
  //     { name: 'koi_red_black', width: 6, height: 4 },
  //     { name: 'koi_orange_white', width: 6, height: 4 },
  //     { name: 'koi_orange_white_1', width: 5, height: 5 },
  //     { name: 'koi_orange_black', width: 3, height: 6 },
  //   ]),
  //   new FishDefinition(4, 'Category 4', 10, 11, 0, 0, 5, [
  //     { name: 'koi_black', width: 6, height: 5 },
  //     { name: 'koi_yellow', width: 6, height: 5 },
  //     { name: 'crab', width: 5, height: 5, xPos: 14, yPos: 6 },
  //   ]),
  //   new FishDefinition(5, 'Category 5', 12, 100, 1, 0, 10, [
  //     { name: 'chest', width: 5, height: 4, xPos: 23, yPos: 3 }
  //   ]),
  // ]);
  protected levels: LevelDefinition[] = [];
  protected fish: FishDefinitions;

  constructor() {
    this.levels = LevelDefinitionsData.map(el => {
      const level = new LevelDefinition(el.id, el.name, el.goal, el.wordsToDisplay, el.categoryPercentage as { [key: number]: number },
        el.bonusCategory as { [key: number]: number });
      return level;
    });

    this.fish = new FishDefinitions(FishDefinitionsData.map(el => {
      const fish = new FishDefinition(el.id, el.categoryName, el.wordMinSize, el.wordMaxSize, el.maxErrors, el.extraTime,
        el.reward, el.images as FishDetailsDTO[]);
      return fish;
    }));
  }

  /**
   * Calculate the number of words based on the goal and category percentage.
   *
   * @param goal Represents the level's goal.
   * @param precentage Represents the percentage of the goal for each category.
   * @param reward Represens the reward for each category.
   *
   * @returns The number of words for each category.
   */
  protected calculateWordCount(goal: number, precentage: number, reward: number): number {
    return Math.ceil((goal * precentage) / (reward * 100));
  }

  getLevels(): LevelDefinition[] {
    return this.levels;
  }

  /**
   *
   * @param levelNumber Array index
   * @returns
   */
  generateLevel(levelNumber: number, words: string[]): Level | undefined {
    const level = this.getLevel(levelNumber);
    if (!level) {
      return undefined;
    }
    return new Level(level, words, this.fish);
  }

  protected getLevel(level: number): LevelDefinition | undefined {
    if (level > 0 && level <= this.levels.length) {
      return this.levels[level - 1];
    }
    return undefined;
  }
}

class Level {
  // The word pool containing all available words for each fish category.
  wordPool: { [key: number]: FishWithWord[] } = {};
  // Remember the list of fish categories we added to the word pool.
  wordLevels: number[] = [];

  usedWordsByFishCategory: { [key: number]: FishWithWord[] } = {};

  constructor(
    private levelDefinition: LevelDefinition,
    words: string[],
    fishDefinitions: FishDefinitions,
  ) {
    // Parse all the available words into the word pool.
    for (const word of words) {
      const wordLength = word.length;
      const currentWordFishDefinition = fishDefinitions.getFishLevelByWordSize(wordLength);
      if (currentWordFishDefinition) {
        if (currentWordFishDefinition.getCategoryId() <= levelDefinition.getLevelMaxFishCategory()) {
          if (!this.wordPool[currentWordFishDefinition.getCategoryId()]) {
            this.wordPool[currentWordFishDefinition.getCategoryId()] = [];
            this.wordLevels.push(currentWordFishDefinition.getCategoryId());
          }
          this.wordPool[currentWordFishDefinition.getCategoryId()].push(new FishWithWord(currentWordFishDefinition, word));
        }
      }
    }

    // Shufle all words arrays.
    for (const wordLevel of this.wordLevels) {
      this.wordPool[wordLevel] = this.shuffle(this.wordPool[wordLevel]);
    }
  }

  getWordPool(): { [key: string]: FishWithWord[] } {
    return this.wordPool;
  }

  /**
   *
   * @param level Fish level
   * @returns
   */
  extractWordByLevel(fishCategory?: number): FishWithWord | undefined {
    if (!fishCategory) {
      fishCategory = this.wordLevels[Math.floor(Math.random() * this.wordLevels.length)];
    }
    if (this.wordPool[fishCategory]) {
      if (this.wordPool[fishCategory].length === 0) {
        // Replace the pool with the used fish.
        if (fishCategory in this.usedWordsByFishCategory && this.usedWordsByFishCategory[fishCategory].length > 0) {
          this.wordPool[fishCategory] = this.shuffle(this.usedWordsByFishCategory[fishCategory]);
          this.usedWordsByFishCategory[fishCategory] = [];
        }
      }
      const selectedWord = this.wordPool[fishCategory].pop();
      if (selectedWord) {
        if (!(fishCategory in this.usedWordsByFishCategory)) {
          this.usedWordsByFishCategory[fishCategory] = [];
        }
        this.usedWordsByFishCategory[fishCategory].push(selectedWord);
      }
      return selectedWord;
    }
    return undefined;
  }

  extractAllLevelWords(): FishWithWord[] {
    const words: FishWithWord[] = [];
    for (const fishCategory of this.levelDefinition.getAvailableCategories()) {
      const wordCategoryCount = this.levelDefinition.getCategoryPercentage(fishCategory);
      for (let i = 0; i < wordCategoryCount; i++) {
        const word = this.extractWordByLevel(fishCategory);
        if (word) {
          words.push(word);
        }
      }
    }
    return this.shuffle(words);
  }

  /**
   * Shuffle the words in the word pool.
   *
   * @param words Represents the array of words to shuffle.
   *
   * @returns An array of words shuffled.
   */
  protected shuffle<T>(words: T[]): T[] {
    let currentIndex = words.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [words[currentIndex], words[randomIndex]] = [
        words[randomIndex], words[currentIndex]];
    }

    return words;
  }
}
