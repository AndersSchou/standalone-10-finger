import { Injectable } from '@angular/core';
import { FishDefinitionDTO, FishDetailsDTO } from '../dto/fish.dto';
import { LevelDefinitionsData } from '../games/fish/level-definition';
import { FishDefinitionsData } from '../games/fish/fish-definition';

export class LevelDefinition {
  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param id Represents the level id.
   * @param name Represents the name of the level.
   * @param goal Represents the goal score of the level.
   * @param wordsToDisplay Represents the number of words to display for each level.
   * @param categoryPercentage Represents the number of words based on the category percentage.
   * @param bonusCategory Represents the number of words from category 5 (bonus category).
   */
  constructor(
    public id: number,
    public name: string,
    public goal: number,
    public wordsToDisplay: number,
    protected categoryPercentage: { [key: number]: number },
    protected bonusCategory: { [key: number]: number }
  ) {}

  /**
   * Get the maximum category number for current level.
   *
   * @returns The maximum category number for the current level.
   */
  getLevelMaxFishCategory(): number {
    if (Object.keys(this.bonusCategory).length > 0) {
      return Math.max(
        ...Object.keys(this.bonusCategory).map((n) => parseInt(n))
      );
    } else {
      return Math.max(
        ...Object.keys(this.categoryPercentage).map((n) => parseInt(n))
      );
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
      catPercentage[Number(Object.keys(this.bonusCategory))] =
        this.bonusCategory[Number(Object.keys(this.bonusCategory))];
    }
    return Object.keys(catPercentage).map((n) => parseInt(n));
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

/**
 * Class used for managing the fish definition.
 */
class FishDefinition {
  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param category Represents the category number of the level.
   * @param name Represents the name of the level.
   * @param wordMinSize Represents the minimum word size for the level.
   * @param wordMaxSize Represents the maximum word size for the level.
   * @param maxErrors Represents the maximum number of errors for the level.
   * @param extraTime Represents the extra time for the level.
   * @param reward Represents the reward for the level.
   * @param images Represents the images for the level.
   */
  constructor(
    protected category: number,
    protected name: string,
    protected wordMinSize: number,
    protected wordMaxSize: number,
    protected maxErrors: number,
    protected extraTime: number,
    protected reward: number,
    protected images: FishDetailsDTO[]
  ) {}

  /**
   * Converts from class to DTO.
   *
   * @returns The fish definition as FishDefinitionDTO.
   */
  toDTO(): FishDefinitionDTO {
    return {
      category: this.category,
      name: this.name,
      wordMinSize: this.wordMinSize,
      wordMaxSize: this.wordMaxSize,
      extraTime: this.extraTime,
      reward: this.reward,
      maxErrors: this.maxErrors,
    };
  }

  /**
   * Get the category id of the level.
   *
   * @returns The category id of the level.
   */
  getCategoryId(): number {
    return this.category;
  }

  /**
   * Get the name of the level.
   *
   * @returns The name of the level.
   */
  getName(): string {
    return this.name;
  }

  /**
   * Get the minimum word size for the level.
   *
   * @returns The minimum word size for the level.
   */
  getWordMinSize(): number {
    return this.wordMinSize;
  }

  /**
   * Get the maximum word size for the level.
   *
   * @returns The maximum word size for the level.
   */
  getWordMaxSize(): number {
    return this.wordMaxSize;
  }

  /**
   * Get the fish details.
   *
   * @returns The fish details.
   */
  getImages(): FishDetailsDTO[] {
    return this.images;
  }
}

/**
 * Class used for managing the fish with word definitions.
 */
export class FishWithWord {
  // Stores the fish image.
  fishImage: FishDetailsDTO;

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param fish Represents the fish definition.
   * @param word Represents the word.
   */
  constructor(public fish: FishDefinition, public word: string) {
    this.fishImage =
      fish.getImages()[Math.floor(Math.random() * fish.getImages().length)];
  }

  /**
   * Get the fish.
   *
   * @returns The fish definition.
   */
  getFish(): FishDefinition {
    return this.fish;
  }

  /**
   * Get the word.
   *
   * @returns The word.
   */
  getWord(): string {
    return this.word;
  }
}

/**
 * Class used for managing the fish definitions.
 */
class FishDefinitions {
  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param fishDefinitions Represents the fish definitions.
   */
  constructor(protected fishDefinitions: FishDefinition[]) {}

  /**
   * Get the fish definition for the given word size.
   *
   * @param wordSize Represents the word size.
   *
   * @returns The fish definition for the given word size.
   */
  getFishLevelByWordSize(wordSize: number): FishDefinition | undefined {
    return this.fishDefinitions.find(
      (fish) =>
        wordSize >= fish.getWordMinSize() && wordSize <= fish.getWordMaxSize()
    );
  }

  /**
   * Get the fish definition for the given name.
   *
   * @param name Represents the name of the fish definition.
   *
   * @returns The fish definition for the given name.
   */
  getFishDefinition(name: string): FishDefinition | undefined {
    return this.fishDefinitions.find((fish) => fish.getName() === name);
  }

  /**
   * Get all the fish definitions.
   *
   * @returns All the fish definitions.
   */
  getFishDefinitions(): FishDefinition[] {
    return this.fishDefinitions;
  }

  /**
   * Get the fish definition for the given index.
   *
   * @param index Represents the index of the fish category.
   *
   * @returns The fish definition for the given index.
   */
  getFishCategory(index: number): FishDefinition {
    return this.fishDefinitions[index];
  }

  /**
   * Get the maximum word size for all the fish definitions.
   *
   * @returns The maximum word size for all the fish definitions.
   */
  getMaxWordSize(): number {
    return Math.max(
      ...this.fishDefinitions.map((fish) => fish.getWordMaxSize())
    );
  }

  /**
   * Get the minimum word size for all the fish definitions.
   *
   * @returns The minimum word size for all the fish definitions.
   */
  getMinWordSize(): number {
    return Math.min(
      ...this.fishDefinitions.map((fish) => fish.getWordMinSize())
    );
  }
}

/**
 * Class used for managing the level information.
 */
export class Level {
  // The word pool containing all available words for each fish category.
  wordPool: { [key: number]: FishWithWord[] } = {};
  // Remember the list of fish categories we added to the word pool.
  wordLevels: number[] = [];
  // Stores the used words for each fish category.
  usedWordsByFishCategory: { [key: number]: FishWithWord[] } = {};

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param levelDefinition Represents the level definition.
   * @param words Represents the list of words.
   * @param fishDefinitions Represents the fish definitions.
   */
  constructor(
    public levelDefinition: LevelDefinition,
    words: string[],
    fishDefinitions: FishDefinitions
  ) {
    // Parse all the available words into the word pool.
    for (const word of words) {
      const wordLength = word.length;
      const currentWordFishDefinition =
        fishDefinitions.getFishLevelByWordSize(wordLength);
      if (currentWordFishDefinition) {
        if (
          currentWordFishDefinition.getCategoryId() <=
          levelDefinition.getLevelMaxFishCategory()
        ) {
          if (!this.wordPool[currentWordFishDefinition.getCategoryId()]) {
            this.wordPool[currentWordFishDefinition.getCategoryId()] = [];
            this.wordLevels.push(currentWordFishDefinition.getCategoryId());
          }
          this.wordPool[currentWordFishDefinition.getCategoryId()].push(
            new FishWithWord(currentWordFishDefinition, word)
          );
        }
      }
    }

    // Shufle all words arrays.
    for (const wordLevel of this.wordLevels) {
      this.wordPool[wordLevel] = this.shuffle(this.wordPool[wordLevel]);
    }
  }

  /**
   * Get the word pool.
   *
   * @returns The word pool.
   */
  getWordPool(): { [key: string]: FishWithWord[] } {
    return this.wordPool;
  }

  /**
   *
   * @param fishCategory Represents the fish category to extract the word from.
   *
   * @returns A word from the word pool as FishWithWord if found, undefined otherwise.
   */
  extractWordByLevel(fishCategory?: number): FishWithWord | undefined {
    if (!fishCategory) {
      fishCategory =
        this.wordLevels[Math.floor(Math.random() * this.wordLevels.length)];
    }
    if (this.wordPool[fishCategory]) {
      if (this.wordPool[fishCategory].length === 0) {
        // Replace the pool with the used fish.
        if (
          fishCategory in this.usedWordsByFishCategory &&
          this.usedWordsByFishCategory[fishCategory].length > 0
        ) {
          this.wordPool[fishCategory] = this.shuffle(
            this.usedWordsByFishCategory[fishCategory]
          );
          this.usedWordsByFishCategory[fishCategory] = [];
        }
      }
      const selectedWord = this.wordPool[fishCategory].pop();
      if (selectedWord) {
        if (!(fishCategory in this.usedWordsByFishCategory)) {
          this.usedWordsByFishCategory[fishCategory] = [];
        }
        this.usedWordsByFishCategory[fishCategory].push(
          new FishWithWord(selectedWord.fish, selectedWord.word)
        );
      }
      return selectedWord;
    }
    return undefined;
  }

  /**
   * Extracts all the words for the level.
   *
   * @returns An array of words as FishWithWord.
   */
  extractAllLevelWords(): FishWithWord[] {
    const words: FishWithWord[] = [];
    for (const fishCategory of this.levelDefinition.getAvailableCategories()) {
      const wordCategoryCount =
        this.levelDefinition.getCategoryPercentage(fishCategory);
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
    let currentIndex = words.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [words[currentIndex], words[randomIndex]] = [
        words[randomIndex],
        words[currentIndex],
      ];
    }

    return words;
  }
}

/**
 * Service used to manage the levels.
 */
@Injectable()
export class LevelService {
  // Levels array.
  protected levels: LevelDefinition[] = [];
  // Fish definitions.
  protected fish: FishDefinitions;

  /**
   * Constructor function responsible for injecting the needed services.
   */
  constructor() {
    this.levels = LevelDefinitionsData.map((el) => {
      const level = new LevelDefinition(
        el.id,
        el.name,
        el.goal,
        el.wordsToDisplay,
        el.categoryPercentage as { [key: number]: number },
        el.bonusCategory as { [key: number]: number }
      );
      return level;
    });

    this.fish = new FishDefinitions(
      FishDefinitionsData.map((el) => {
        const fish = new FishDefinition(
          el.id,
          el.categoryName,
          el.wordMinSize,
          el.wordMaxSize,
          el.maxErrors,
          el.extraTime,
          el.reward,
          el.images as FishDetailsDTO[]
        );
        return fish;
      })
    );
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
  protected calculateWordCount(
    goal: number,
    precentage: number,
    reward: number
  ): number {
    return Math.ceil((goal * precentage) / (reward * 100));
  }

  /**
   * Get the levels.
   *
   * @returns An array of levels.
   */
  getLevels(): LevelDefinition[] {
    return this.levels;
  }

  /**
   * Get the number of levels.
   */
  getNumberOfLevels(): number {
    return this.levels.length;
  }

  /**
   * Generate a level based on the provided id.
   *
   * @param levelNumber Represents the level number.
   *
   * @returns The level or undefined if not found.
   */
  generateLevel(levelNumber: number, words: string[]): Level | undefined {
    const level = this.getLevel(levelNumber);
    if (!level) {
      return undefined;
    }
    return new Level(level, words, this.fish);
  }

  /**
   * Get the level based on the provided id.
   *
   * @param levelId Represents the level number.
   *
   * @returns The level definition or undefined if not found.
   */
  protected getLevel(levelId: number): LevelDefinition | undefined {
    if (levelId > 0 && levelId <= this.levels.length) {
      return this.levels[levelId - 1];
    }
    return undefined;
  }

  /**
   * Calculate time difference in milliseconds.
   *
   * @param start Represents the time when the user started typing.
   * @param end Represents the time when the user stopped typing.
   *
   * @returns The time difference in milliseconds.
   */
  calculateTimeDiff(start: Date, end: Date): number {
    return end.getTime() - start.getTime();
  }

  // TODO: Add in a helper file.
  /**
   * Shuffle the words in the word pool.
   *
   * @param arr Represents the array of words to shuffle.
   *
   * @returns An array of words shuffled.
   */
  shuffle<T>(arr: T[]): T[] {
    let currentIndex = arr.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [arr[currentIndex], arr[randomIndex]] = [
        arr[randomIndex],
        arr[currentIndex],
      ];
    }

    return arr;
  }
}
