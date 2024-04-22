import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { createFishWithWordDTO, FishWithWordDTO } from 'src/app/dto/fish.dto';
import { AppGamesFishingWordFishComponent } from '../word-fish/word-fish.component';
import {
  Level,
  FishWithWord,
  LevelService,
} from 'src/app/services/level.service';
import { ReplaySubject, takeUntil, timer } from 'rxjs';
import { GridService } from 'src/app/services/grid.service';
import { ScoreUpdateDTO } from 'src/app/dto/game.dto';
import { NgIf, NgFor } from '@angular/common';

/**
 * Component responsible for displaying the school of fish.
 */
@Component({
  selector: 'app-modules-games-fishing-school-fish',
  templateUrl: './school-fish.component.html',
  styleUrls: ['./school-fish.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, AppGamesFishingWordFishComponent],
})
export class AppGamesFishingSchoolFishComponent implements OnInit {
  @ViewChildren('fishList')
  fishList?: QueryList<AppGamesFishingWordFishComponent>;
  @Input() isPaused: boolean = false;
  @Input() isGameOver: boolean = false;
  @Input() playSound: boolean = false;
  // Stores the maximum number of words/fish that can be displayed.
  maxFishInSchool = 0;
  // Stores all the initial words for the current level.
  allAvailableFishes: FishWithWordDTO[] = [];
  // Stores the words that are currently displayed.
  availableFishes: FishWithWordDTO[] = [];
  // Stores the current active fish/word.
  activeFish?: FishWithWordDTO;
  // Stores the current score.
  score = 0;
  // Stores the number of fish/words that were completed.
  completedFishes = 0;
  // Stores the level's goal.
  goal = 0;
  // Stores the level.
  currentLevel?: Level;
  // Stores the number of words that will be used for adding a new word by default.
  fishCountToShow = 1;
  // Stores the number of correct typed characters.
  correctChars = 0;
  // Outputs the event when the word is completed.
  @Output() currentScore: EventEmitter<ScoreUpdateDTO> =
    new EventEmitter<ScoreUpdateDTO>();
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<boolean>();
  // Default time for checking the user's interaction with the displayed fish.
  private gameFrameInterval = 500;
  // Stores the number of errors.
  errors = 0;

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param gridService Reference to GridService.
   * @param levelService Reference to LevelService.
   */
  constructor(
    private readonly gridService: GridService,
    private readonly levelService: LevelService
  ) {}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    // We create a gameFrameInterval interval to check if we need to increment the fish count.
    // Used to check if the user didn't interact with each displayed fish.
    timer(0, this.gameFrameInterval)
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this.removeFishes();
        this.renderNextFish();
      });
  }

  /**
   * Empties the space on the grid when the word/fish is removed from the screen.
   *
   * @param currentWord Represents the current word.
   */
  unoccupySpace(currentWord: FishWithWordDTO): void {
    this.gridService.occupySpace(
      currentWord._x,
      currentWord._y,
      currentWord._w,
      currentWord._h,
      'empty'
    );
  }

  /**
   * Occupies the space on the grid when the word/fish is displayed on the screen.
   *
   * @param currentWord Represents the current word.
   */
  occupySpace(currentWord: FishWithWordDTO): void {
    // Add additional width for word.
    let maxWidth = this.getMaxWidthFishWord(currentWord) + 1;
    // Add additional height for word to give the fish space to wiggle.
    let maxHeight = currentWord.fishImage.height + 2;
    if (
      currentWord.fishImage.name === 'crab' ||
      currentWord.fishImage.name === 'chest'
    ) {
      if (currentWord.fishImage.xPos && currentWord.fishImage.yPos) {
        this.gridService.occupySpace(
          currentWord.fishImage.xPos,
          currentWord.fishImage.yPos,
          maxWidth,
          maxHeight + 2,
          'fish'
        );
        currentWord.left =
          currentWord.fishImage.xPos * this.gridService.gridSize + 'px';
        currentWord.top =
          currentWord.fishImage.yPos * this.gridService.gridSize + 'px';
      }
    } else {
      let space = this.gridService.pickRandomEmptySpace(maxWidth, maxHeight);
      if (space) {
        this.gridService.occupySpace(
          space.x,
          space.y,
          maxWidth,
          maxHeight,
          'fish'
        );
        currentWord.left = space.x * this.gridService.gridSize + 'px';
        currentWord.top = space.y * this.gridService.gridSize + 'px';
        currentWord._x = space.x;
        currentWord._y = space.y;
        currentWord._w = maxWidth;
        currentWord._h = maxHeight;
      }
    }
  }

  /**
   * Get the maximum width between the word length and the fish width.
   *
   * @param wordFishToDisplay Represents the current word.
   *
   * @returns The maximum width.
   */
  getMaxWidthFishWord(wordFishToDisplay: FishWithWordDTO): number {
    return Math.max(
      wordFishToDisplay.fishImage.width,
      wordFishToDisplay.word.length
    );
  }

  /**
   * Event listener for when a word/fish was removed from the screen.
   *
   * @param completed Tells if the word was completed or not.
   */
  completedWord(completed: boolean): void {
    this.availableFishes = this.availableFishes.filter(
      (el) => !el.leftTheSchool
    );

    if (completed && this.activeFish) {
      this.completedFishes++;
      this.correctChars += this.activeFish.word.length;
      this.score += this.activeFish.fish.reward;
      const dataUpdate: ScoreUpdateDTO = {
        score: this.score,
        completedWords: this.completedFishes,
        chars: this.correctChars,
        errors: this.errors,
      };
      this.currentScore.emit(dataUpdate);
    }
  }

  /**
   * Set the current active fish/word.
   *
   * @param key Represents the key that was pressed.
   */
  setActiveFish(key?: string): void {
    if (key === undefined) {
      this.activeFish = undefined;
      return;
    }
    if (
      this.activeFish &&
      this.activeFish.active &&
      this.activeFish.available
    ) {
      return;
    }

    // Set curently active fish.
    let findActiveWord = this.availableFishes.find(
      (el) => el.active && el.available
    );
    if (!findActiveWord) {
      // If there is no active word then find the first word that starts with the same letter as the input key.
      findActiveWord = this.availableFishes.find((el: FishWithWordDTO) =>
        el.word.toLowerCase().startsWith(key)
      );
      if (findActiveWord) {
        // If there is a word that starts with the same letter as the input key then set that word as active.
        findActiveWord.active = true;
      }
    }
    this.activeFish = findActiveWord;
    if (!this.activeFish) {
      this.errors++;
    }
  }

  /**
   * Update the error count.
   *
   * @param event Represents the event.
   */
  updateErrorCount(event: boolean): void {
    if (event) {
      this.errors++;
    }
  }

  /**
   * Keydown method.
   *
   * @param key Represents the key that was pressed.
   */
  keyDown(key: string): void {
    // Set curently active fish.
    this.setActiveFish(key);
    if (this.fishList) {
      if (this.activeFish) {
        const activeFishComponent = this.fishList.get(
          this.availableFishes.indexOf(this.activeFish)
        );
        if (activeFishComponent) {
          activeFishComponent.keyDown(key);
          if (!activeFishComponent.currentWord.available) {
            this.removeFishes();
            this.renderNextFish();
          }
        }
      }
    }
  }

  /**
   * Initialize the school of fishes/words.
   *
   * @param arr Represents the array of fishes.
   * @param currentLevel Represents the current level.
   */
  initSchool(arr: FishWithWordDTO[], currentLevel: Level): void {
    this.maxFishInSchool = currentLevel.levelDefinition.wordsToDisplay;
    this.currentLevel = currentLevel;
    this.goal = currentLevel.levelDefinition.goal;
    if (arr.length > 0) {
      this.allAvailableFishes = [...arr];
    }
    this.renderNextFish();
  }

  /**
   * Progresive calculation starting from one fish and adding one fish after a percentage of fishes are completed.
   *
   * @param percentValueDone Represents the completed percentage.
   * @param min Represents the minimum number of fishes to show.
   * @param max Represents the maximum number of fishes to show.
   * @param percentValueMax Represents the total number of fishes to show(based on the level's goal).
   *
   * @returns The number of fishes to show.
   */
  calculateMaxFishInSchool(
    percentValueDone: number,
    min: number,
    max: number,
    percentValueMax: number
  ): number {
    const percentage = percentValueDone / percentValueMax;
    const maxFish = Math.ceil((max - min) * percentage + min);
    return maxFish < min ? min : maxFish > max ? max : maxFish;
  }

  /**
   * Render the next fish/word.
   */
  renderNextFish(): void {
    if (this.isGameOver) {
      return;
    }
    if (this.allAvailableFishes.length <= 0 && this.currentLevel) {
      this.allAvailableFishes = this.currentLevel
        .extractAllLevelWords()
        .map((el: FishWithWord) => {
          const word: FishWithWordDTO = createFishWithWordDTO({
            fish: el.fish.toDTO(),
            word: el.word,
            fishImage: el.fishImage,
            active: false,
          });
          return word;
        });
    }
    this.fishCountToShow = this.calculateMaxFishInSchool(
      this.score,
      1,
      this.maxFishInSchool,
      this.goal
    );
    for (
      let i = this.availableFishes.filter((f) => !f.leftTheSchool).length;
      i < this.fishCountToShow;
      i++
    ) {
      this.addFishToAvailableFishes();
    }
  }

  /**
   * Get the new word to be displayed.
   *
   * @returns The new word to be displayed if found, undefined otherwise.
   */
  getNewWord(): FishWithWordDTO | undefined {
    if (this.currentLevel) {
      // Try and get a new word for each available word level. If this fail reuse a random used word.
      const levelWordShuffled = this.levelService.shuffle([
        ...this.currentLevel.wordLevels,
      ]);
      for (let i = 0; i < levelWordShuffled.length; i++) {
        // TODO: pass the letter array to be excluded in the search and all the levels it should search for.
        const newWord = this.currentLevel.extractWordByLevel(
          levelWordShuffled[i]
        );
        if (newWord) {
          const word: FishWithWordDTO = createFishWithWordDTO({
            fish: newWord.fish.toDTO(),
            word: newWord.word,
            fishImage: newWord.fishImage,
            active: false,
          });
          return word;
        }
      }
    }
    return undefined;
  }

  /**
   * Gets a new word that doesn't start with the same letter as any of the available words.
   *
   * @param cnt Represents the number of times the method was called.
   *
   * @returns A new word that doesn't start with the same letter as any of the available words.
   */
  getWordWithDifferentLetter(cnt = 0): FishWithWordDTO | undefined {
    if (cnt > 10) {
      // We could not find one.
      return undefined;
    }
    // TODO: pass the letter array to be excluded in the search.
    const newWord = this.getNewWord();
    if (newWord) {
      const fishesDisplayed = this.availableFishes.filter(
        (fish) => !fish.leftTheSchool
      );
      if (
        newWord.fishImage.name === 'chest' ||
        newWord.fishImage.name === 'crab'
      ) {
        // Check if there is a fish in the school with the same fish image name. Crab and chest can't be displayed multiple times
        // while their grid space is occupied.
        const findDisplayedFishWithSameImageName = fishesDisplayed.find(
          (el: FishWithWordDTO) => {
            return el.fishImage.name === newWord.fishImage.name;
          }
        );
        if (!findDisplayedFishWithSameImageName) {
          // Check if it doesn't start with the same letter as any of the available words.
          const foundWordWithSameStartingLetter = fishesDisplayed.find(
            (el: FishWithWordDTO) => el.word[0] === newWord.word[0]
          );
          if (!foundWordWithSameStartingLetter) {
            return newWord;
          }
        }
      } else {
        const foundWordWithSameStartingLetter = fishesDisplayed.find(
          (el: FishWithWordDTO) => el.word[0] === newWord.word[0]
        );
        if (!foundWordWithSameStartingLetter) {
          return newWord;
        }
      }
    }
    return this.getWordWithDifferentLetter(cnt + 1);
  }

  /**
   * Add a new fish/word to the available fishes.
   */
  addFishToAvailableFishes(): void {
    let fish;
    // Try and find a new word. If this fails, then reuse a random word.
    const newWord = this.getWordWithDifferentLetter();
    if (newWord) {
      fish = newWord;
    } else if (this.allAvailableFishes.length > 0) {
      // Failsafe, should not happen.
      fish = this.allAvailableFishes.shift();
    }
    if (fish) {
      fish.available = true;
      this.availableFishes.push(fish);
      this.occupySpace(fish);
    } else {
      console.log('No more words to add');
    }
  }

  /**
   * Remove the fishes that are not available anymore.
   */
  removeFishes(): void {
    for (const fish of this.availableFishes) {
      if (fish && !fish.available && !fish.leftTheSchool) {
        this.unoccupySpace(fish);
        fish.leftTheSchool = true;
      }
    }
  }
}
