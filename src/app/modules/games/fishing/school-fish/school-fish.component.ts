import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FishWithWordDTO } from 'src/app/dto/fish.dto';
import { AppGamesFishingWordFishComponent } from '../word-fish/word-fish.component';
import { Level, LevelService } from 'src/app/services/level.service';
import { ReplaySubject, Subscription, takeUntil, timer } from 'rxjs';
import { GridService } from 'src/app/services/grid.service';
import { WPSService } from 'src/app/services/wps.service';

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
  @Output() currentScore: EventEmitter<number> = new EventEmitter<number>();
  /** Get handle on cmp tags in the template */
  @ViewChildren('fishList') fishList?: QueryList<AppGamesFishingWordFishComponent>;

  activeFish?: FishWithWordDTO;
  score = 0;
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

  completedWord(completed: boolean): void {
    // console.log('++++completedWord', completed);
    // 1. empty availableFishes array
    this.availableFishes = this.availableFishes.filter((el) => !el.leftTheSchool);

    if (completed && this.activeFish) {
      this.score += this.activeFish.fish.reward;
      this.currentScore.emit(this.score);
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
    console.log('currentLevel init school', currentLevel);
    // show one fish and after a default time(average user speed) add another fish.
    this.maxFishInSchool = currentLevel.levelDefinition.wordsToDisplay;
    this.currentLevel = currentLevel;
    this.goal = currentLevel.levelDefinition.goal;
    // this.fishCountToShow = Math.ceil(this.goal / this.maxFishInSchool);
    console.log('this.defaultNumberOfWords', this.fishCountToShow);
    if (arr.length > 0) {
      this.allAvailableFishes = [...arr];
      // console.log('this.allAvailableFishes', this.allAvailableFishes);
    }
    this.renderNextFish();
  }

  renderNextFish(): void {
    if (this.allAvailableFishes.length <= 0) {
      this.allAvailableFishes = this.currentLevel.extractAllLevelWords().map((el: FishWithWordDTO) => {
        const word: FishWithWordDTO = el;
        word.active = false;
        return word;
      });
    }
    for (let i = this.availableFishes.filter(f => !f.leftTheSchool).length; i < this.fishCountToShow; i++) {
      this.addFishToAvailableFishes();
    }
  }

  getNewWord(rec = 0): FishWithWordDTO | undefined {
    if (rec > 30) {
      return undefined;
    }
    const newWord = this.currentLevel.extractWordByLevel(this.allAvailableFishes.length ? this.allAvailableFishes[0].fish.category : 0);
    if (newWord) {
      const findWord = this.availableFishes.find((el: FishWithWordDTO) => newWord.word.toLowerCase().startsWith(el.word[0]));
      if (!findWord) {
        // Remove the first fish element from allAvailableFishes since it's category was already used (this is needed to
        // keep the category percentage the same).
        this.allAvailableFishes.shift();
        return newWord;
      }
    }
    return this.getNewWord(rec++);
  }

  addFishToAvailableFishes(): void {
    let fish;
    if (this.availableFishes.length > 0) {
      const findWord = this.allAvailableFishes.find((el: FishWithWordDTO) => {
        for (const word of this.availableFishes) {
          if (!el.word.toLowerCase().startsWith(word.word[0])) {
            return el;
          }
        }
        return null;
      });
      // console.log('findWord', findWord);
      if (findWord) {
        this.allAvailableFishes = this.allAvailableFishes.filter((el) => el !== findWord);
        fish = findWord;
      } else {
        // console.log('else error', this.allAvailableFishes.length, this.availableFishes.length);
        let newWord = this.getNewWord();
        if (newWord) {
          fish = newWord;
        }
        // console.log('newW', newWord);
      }
    } else {
      fish = this.allAvailableFishes.shift();
    }
    // console.log('fish', fish);
    if (fish) {
      fish.available = true;
      this.availableFishes.push(fish);
      this.occupySpace(fish);
      this.fishAdded = true;
      this.addedWords++;
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
}
