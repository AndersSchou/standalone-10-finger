import { GridService } from './../../../../services/grid.service';
import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { FishWithWordDTO } from 'src/app/dto/fish.dto';
import { AppGamesFishingWordFishComponent } from '../word-fish/word-fish.component';

@Component({
  selector: 'app-modules-games-fishing-school-fish',
  templateUrl: './school-fish.component.html',
  styleUrls: ['./school-fish.component.scss']
})
export class AppGamesFishingSchoolFishComponent {
  @Input() goal: number = 0;
  maxFishInSchool = 0;
  allAvailableFishes: FishWithWordDTO[] = [];
  availableFishes: FishWithWordDTO[] = [];

  @Output() wordsProgress: EventEmitter<FishWithWordDTO> = new EventEmitter<FishWithWordDTO>();
  /** Get handle on cmp tags in the template */
  @ViewChildren('fishList') fishList?: QueryList<AppGamesFishingWordFishComponent>;

  activeFish?: FishWithWordDTO;
  score = 0;

  constructor(
    private readonly gridService: GridService,
  ) { }

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
    console.log('++++completedWord', completed);
    // 1. empty availableFishes array
    // 2. render next fishes if goal isn't reached.
    this.availableFishes = this.availableFishes.filter((el) => !el.leftTheSchool);

    console.log('this.activeFish', this.activeFish);
    console.log('this.availableFishes', this.availableFishes);
    console.log('this.maxFishInSchool', this.maxFishInSchool);
    // score

    if (completed && this.activeFish) {
      this.score += this.activeFish.fish.reward;
    }
    if (this.availableFishes.length === 0) {
      this.renderFish();
    }
    console.log('this.score', this.score);
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
    console.log('findActiveWord', findActiveWord);
    if (!findActiveWord) {
      // If there is no active word then find the first word that starts with the same letter as the input key.
      findActiveWord = this.availableFishes.find((el: FishWithWordDTO) =>
        el.word.toLowerCase().startsWith(key));
      if (findActiveWord) {
        // If there is a word that starts with the same letter as the input key then set that word as active.
        findActiveWord.active = true;
      }
    }
    this.activeFish = findActiveWord;
  }

  keyDown(key: string) {
    // Set curently active fish.
    this.setActiveFish(key);
    if (this.activeFish && this.fishList) {
      const activeFishComponent = this.fishList.get(this.availableFishes.indexOf(this.activeFish));
      console.log('----', activeFishComponent);
      if (activeFishComponent) {
        activeFishComponent.keyDown(key);
        console.log('activeFishComponent.currentWord', activeFishComponent.currentWord);
        if (!activeFishComponent.currentWord.available) {
          console.log('======');
          // this.availableFishes = this.availableFishes.filter((el) => !el.leftTheSchool);
          this.removeFishes();
          // setTimeout(() => {
          //   if (this.activeFish) {
          //     this.activeFish.available = false;
          //     this.renderFish();
          //   }
          // }, 1500);
        }
      }
    }
  }

  initSchool(arr: FishWithWordDTO[], maxFishInSchool: number) {
    this.maxFishInSchool = maxFishInSchool;
    if (arr.length > 0) {
      console.log('arr', arr);
      this.allAvailableFishes = [...arr];
      console.log('this.allAvailableFishes', this.allAvailableFishes);
    }
    this.renderFish();
  }

  renderFish(): void {
    console.log('this.availableFishes', this.availableFishes);
    for (const fish of this.availableFishes) {
      if (fish && !fish.available && !fish.leftTheSchool) {
        this.unoccupySpace(fish);
        fish.leftTheSchool = true;
        // Remove fish from availableFishes.
        // this.availableFishes = this.availableFishes.filter((el) => el !== fish);
        // this.maxFishInSchool++;
      }
    }
    // Add fish to availableFishes from allAvailableFishes until we have maxFishInSchool fish.
    for (let i = this.availableFishes.length; i < this.maxFishInSchool; i++) {
      if (this.allAvailableFishes.length > 0) {
        let fish = this.allAvailableFishes.shift();
        if (fish) {
          fish.available = true;
          this.availableFishes.push(fish);
          this.occupySpace(fish);
        }
      }
    }
  }

  removeFishes(): void {
    console.log('1');
    // if (this.availableFishes.length > 0) {
    console.log('2', this.availableFishes);
    for (const fish of this.availableFishes) {
      if (fish && !fish.available && !fish.leftTheSchool) {
        this.unoccupySpace(fish);
        fish.leftTheSchool = true;
        // Remove fish from availableFishes.
        // setTimeout(() => {
        // this.availableFishes = this.availableFishes.filter((el) => el !== fish);
        // this.maxFishInSchool++;
        // }, 1000);
      }
    }
    console.log('this.availableFishes', this.availableFishes);
    // } else {
    //   console.log('3');
    //   setTimeout(() => {
    //     this.renderFish();
    //   }, 1000);
    // }
  }
}
