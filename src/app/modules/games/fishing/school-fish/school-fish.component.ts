import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FishWithWordDTO } from 'src/app/dto/fish.dto';
import { AppGamesFishingWordFishComponent } from '../word-fish/word-fish.component';
import { Level, LevelService } from 'src/app/services/level.service';
import { ReplaySubject, Subscription, takeUntil, timer } from 'rxjs';
import { GridService } from 'src/app/services/grid.service';
import { WPSService } from 'src/app/services/wps.service';

export interface ScoreUpdateDTO {
  score: number;
  completedWords: number;
  chars: number;
}

@Component({
  selector: 'app-modules-games-fishing-school-fish',
  templateUrl: './school-fish.component.html',
  styleUrls: ['./school-fish.component.scss']
})
export class AppGamesFishingSchoolFishComponent implements OnInit {
  maxFishInSchool = 0;
  allAvailableFishes: FishWithWordDTO[] = [];
  availableFishes: FishWithWordDTO[] = [];

  // @Output() wordsProgress: EventEmitter<FishWithWordDTO> = new EventEmitter<FishWithWordDTO>();
  @Output() currentScore: EventEmitter<ScoreUpdateDTO> = new EventEmitter<ScoreUpdateDTO>();
  /** Get handle on cmp tags in the template */
  @ViewChildren('fishList') fishList?: QueryList<AppGamesFishingWordFishComponent>;

  activeFish?: FishWithWordDTO;
  score = 0;
  completedFishes = 0;
  goal = 0;
  currentLevel: any;
  // Stores the time to wait before removing the word/words if no correct key was pressed.
  defaultWaitTime = 3000;
  defaultWaitTimeSubscription: Subscription = Subscription.EMPTY;
  // Stores the time to wait before adding a new word (it's based on the user's average typing speed). Initially it's set to 1500ms.
  defaultUserWaitTime = 1500;
  addWordSubscription: Subscription = Subscription.EMPTY;
  // Stores the number of characters typed per second.
  charsPerSec = 0;
  // Stores the number of words that will be used for adding a new word by default.
  fishCountToShow = 1;

  currentTime: Date = new Date();
  // Tells if a fish was added or not.
  fishAdded = false;
  // Stores the number of words that were displayed.
  addedWords = 0;
  correctChars = 0;
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<boolean>();

  constructor(
    private readonly gridService: GridService,
    private readonly wps: WPSService,
  ) { }

  ngOnInit(): void {
    const a = 1;
  }

  unoccupySpace(currentWord: FishWithWordDTO): void {
    this.gridService.occupySpace(currentWord._x, currentWord._y, currentWord._w, currentWord._h, 'empty');
  }

  occupySpace(currentWord: FishWithWordDTO): void {
    let maxWidth = this.getMaxWidthFishWord(currentWord);
    let maxHeight = currentWord.fishImage.height + 2;
    if (currentWord.fishImage.name === 'crab' || currentWord.fishImage.name === 'chest') {
      if (currentWord.fishImage.xPos && currentWord.fishImage.yPos) {
        this.gridService.occupySpace(currentWord.fishImage.xPos, currentWord.fishImage.yPos, maxWidth, maxHeight + 2, 'fish');
        currentWord.left = currentWord.fishImage.xPos * this.gridService.gridSize + 'px';
        currentWord.top = currentWord.fishImage.yPos * this.gridService.gridSize + 'px';
      }
    } else {
      let space = this.gridService.pickRandomEmptySpace(maxWidth, maxHeight);
      if (space) {
        // fishImage.height + 1 (add additional height for word).
        this.gridService.occupySpace(space.x, space.y, maxWidth, maxHeight, 'fish');
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
    return Math.max(wordFishToDisplay.fishImage.width, wordFishToDisplay.word.length);
  }

  /**
   * Event listener for when a word/fish was removed from the screen.
   *
   * @param completed Tells if the word was completed or not.
   */
  completedWord(completed: boolean): void {
    this.availableFishes = this.availableFishes.filter((el) => !el.leftTheSchool);

    if (completed && this.activeFish) {
      // console.log('this.activeFish.word: ', this.activeFish.word);
      this.completedFishes++;
      this.correctChars += this.activeFish.word.length;
      this.score += this.activeFish.fish.reward;
      const dataUpdate: ScoreUpdateDTO = {
        score: this.score,
        completedWords: this.completedFishes,
        chars: this.correctChars
      };
      this.currentScore.emit(dataUpdate);
    }
  }

  setActiveFish(key?: string) {
    if (key === undefined) {
      this.activeFish = undefined;
      return;
    }
    if (this.activeFish && this.activeFish.active && this.activeFish.available) {
      return;
    }

    // Set curently active fish.
    let findActiveWord = this.availableFishes.find((el) => el.active && el.available);
    if (!findActiveWord) {
      // If there is no active word then find the first word that starts with the same letter as the input key.
      findActiveWord = this.availableFishes.find((el: FishWithWordDTO) =>
        el.word.toLowerCase().startsWith(key));
      if (findActiveWord) {
        // If there is a word that starts with the same letter as the input key then set that word as active.
        findActiveWord.active = true;
        if (this.defaultWaitTimeSubscription) {
          this.defaultWaitTimeSubscription.unsubscribe();
        }
      }
    }
    this.activeFish = findActiveWord;
  }

  keyDown(key: string) {
    // Set curently active fish.
    this.setActiveFish(key);
    if (this.fishList) {
      if (this.activeFish) {
        const activeFishComponent = this.fishList.get(this.availableFishes.indexOf(this.activeFish));
        if (activeFishComponent) {
          activeFishComponent.keyDown(key);
          // console.log('-----keyDown');
          if (!activeFishComponent.currentWord.available) {
            // console.log('available');
            this.removeFishes();
            this.renderNextFish();
          }
        }
      } else {
        if (!this.defaultWaitTimeSubscription.closed) {
          // console.log('------');
          // Start timer for incorrect key. If the user didn't press a correct key in the defaultWaitTime, then remove the word/words
          // and add the next word.
          this.defaultWaitTimeSubscription = timer(this.defaultWaitTime)
            .pipe(takeUntil(this.destroyed)).subscribe(() => {
              if (this.fishList) {
                for (const comp of this.fishList) {
                  comp.keyDown(key, true);
                  if (!comp.currentWord.available) {
                    this.removeFishes();
                    this.renderNextFish();
                  }
                }
              }
            });
        }
      }
    }
  }

  initSchool(arr: FishWithWordDTO[], currentLevel: Level): void {
    console.log('AppGamesFishingSchoolFishComponent.initSchool', currentLevel);
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
   * @param alreadyShown Represents the number of fishes that are already shown.
   * @param min Represents the minimum number of fishes to show.
   * @param max Represents the maximum number of fishes to show.
   * @param totalFish Represents the total number of fishes to show.
   *
   * @returns The number of fishes to show.
   */
  calculateMaxFishInSchool(alreadyShown: number, min: number, max: number, totalFish: number): number {
    const percentage = alreadyShown / totalFish;
    const maxFish = Math.ceil((max - min) * percentage + min);
    return maxFish;
  }

  renderNextFish(): void {
    if (this.allAvailableFishes.length <= 0) {
      this.allAvailableFishes = this.currentLevel.extractAllLevelWords().map((el: FishWithWordDTO) => {
        const word: FishWithWordDTO = el;
        word.active = false;
        return word;
      });
    }
    this.fishCountToShow = this.calculateMaxFishInSchool(this.completedFishes, 1, this.maxFishInSchool, this.goal);
    for (let i = this.availableFishes.filter(f => !f.leftTheSchool).length; i < this.fishCountToShow; i++) {
      this.addFishToAvailableFishes();
    }
  }

  getNewWord(): FishWithWordDTO | undefined {
    // Try and get a new word for each available word level. If this fail reuse a random used word.
    const levelWordShuffled = this.shuffle([...this.currentLevel.wordLevels]);
    for (let i = 0; i < levelWordShuffled.length; i++) {
      // TODO: pass the letter array to be excluded in the search and all the levels it should search for.
      const newWord = this.currentLevel.extractWordByLevel(levelWordShuffled[i]);
      if (newWord) {
        return newWord;
      }
    }
    return undefined;
  }

  getWordWithDifferentLetter(cnt = 0): FishWithWordDTO | undefined {
    if (cnt > 10) {
      // We could not find one.
      return undefined;
    }
    // TODO: pass the letter array to be excluded in the search.
    const newWord = this.getNewWord();
    // Check that the new word doesn't start with the same letter as any of the available words.
    if (newWord) {
      const foundWordWithSameStartingLetter = this.availableFishes.filter(
        // Only compare to fish in the school.
        fish => !fish.leftTheSchool
      ).find((el: FishWithWordDTO) =>
        el.word[0].toLowerCase() === newWord.word[0].toLowerCase());
      if (!foundWordWithSameStartingLetter) {
        return newWord;
      }
    }
    return this.getWordWithDifferentLetter(cnt + 1);
  }

  addFishToAvailableFishes(): void {
    let fish;
    // Try and find a new word. If this fails, then reuse a random word.
    const newWord = this.getWordWithDifferentLetter();
    if (newWord) {
      fish = newWord;
      console.log('newWord', fish.word);
    } else if (this.allAvailableFishes.length > 0) {
      // Failsafe, should not happen.
      fish = this.allAvailableFishes.shift();
      console.log('oldWord', fish?.word);
    }
    // console.log('fish', fish);
    if (fish) {
      fish.available = true;
      this.availableFishes.push(fish);
      this.occupySpace(fish);
      this.fishAdded = true;
      this.addedWords++;
      console.log('addedWords', fish.word);
    } else {
      console.log('No more words to add');
    }
  }

  removeFishes(): void {
    // console.log('remove', this.availableFishes);
    for (const fish of this.availableFishes) {
      if (fish && !fish.available && !fish.leftTheSchool) {
        // console.log('empty space');
        this.unoccupySpace(fish);
        fish.leftTheSchool = true;
      }
    }
  }

  // TODO: add in a helper file
  /**
   * Shuffle the words in the word pool.
   *
   * @param words Represents the array of words to shuffle.
   *
   * @returns An array of words shuffled.
   */
  protected shuffle<T>(arr: T[]): T[] {
    let currentIndex = arr.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [arr[currentIndex], arr[randomIndex]] = [
        arr[randomIndex], arr[currentIndex]];
    }

    return arr;
  }
}
