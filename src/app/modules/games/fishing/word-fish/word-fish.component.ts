import { Component, ElementRef, Input, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { DefaultFishesArray } from 'src/app/common/constants';
import { createEmptyFishWithWordDTO, FishDTO, FishWithWordDTO } from 'src/app/dto/fish.dto';
import { AppGamesFishComponent } from '../fish/fish.component';

@Component({
  selector: 'app-modules-games-fishing-word-fish',
  templateUrl: './word-fish.component.html',
  styleUrls: ['./word-fish.component.scss']
})
export class AppGamesFishingWordFishComponent implements OnDestroy, AfterViewInit {
  @ViewChild('fishComp') fishComponent?: AppGamesFishComponent;
  @ViewChild('wordHld') wordHld?: ElementRef;
  @Input()
  set word(text: FishWithWordDTO) {
    this.currentWord = text;
    // this.currentWord.component = this;
  }
  get word(): FishWithWordDTO {
    return this.currentWord;
  }
  @Input() index: number = 0;
  @Input() numberOfwords: number = 0;

  keyDown(char: string) {
    this.typedCharacter = char;
    if (this.currentCharIndex === 0) {
      this.currentPosition();
    }
    if (this.currentWord.word[this.currentCharIndex] === this.typedCharacter) {
      this.markAsCompleted();
      this.updateCurrentPosition();
    } else {
      // check for nbr of mistakes and if it is more than fish maxErrors then remove the word.
      this.countError++;
      console.log('---', this.currentWord, this.countError, this.currentWord.fish.maxErrors);
      this.markAsMistake();
      if (this.countError > this.currentWord.fish.maxErrors) {
        // console.log('numberOfwords', this.numberOfwords);
        this.removeWordFish(true);
        // if (this.numberOfwords === 1) {
        //   this.completedWordIndex.emit(true);
        // }
        // this.completedWordIndex.emit(t);
      }
    }
  }

  currentWord: FishWithWordDTO = createEmptyFishWithWordDTO();
  defaultFishesArray: FishDTO[] = DefaultFishesArray;
  // Stores the HTMLElement for the current fish and word.
  gameFishDivElement?: Element;
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<boolean>();
  defaultStyles: any[] = [];

  // Stores the current Element.
  currentFishActiveElement?: Element;
  // Stores the current character's index.
  currentCharIndex: number = 0;
  // Stores the current character.
  currentChar: string = '';
  typedCharacter: string = '';
  countError = 0;
  @Output() completedWordIndex: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    this.createHTML();
  }

  /**
   * Unsubscribe Observables and detach event handlers to avoid memory leaks.
   */
  ngOnDestroy(): void {
    // this.clearDomElements();
    this.destroyed.next(true);
  }
  currentFishImage = '';
  /**
   * Create the HTML elements.
   */
  createHTML(): void {
    console.log('createHTML', this.currentWord.word);
    if (this.wordHld && this.currentWord) {
      const wordHld = this.wordHld.nativeElement;
      this.currentFishImage = `assets/svg/${this.currentWord.fishImage.name}.svg`;
      // const addFishSubs = this.fishComponent.addFish(`assets/svg/${this.currentWord.fishImage.name}.svg`)
      //   .pipe(takeUntil(this.destroyed))
      //   .subscribe(() => {
      //     addFishSubs.unsubscribe();
      //   });
      this.gameFishDivElement = document.createElement('div');
      this.gameFishDivElement.classList.add('flex-v-align');

      for (let i = 0; i < this.currentWord.word.length; i++) {
        const letterElement = document.createElement('span');
        const keyDefaultClass = ['key-fish-hld', i.toString()];
        letterElement.classList.add(...keyDefaultClass);
        letterElement.innerText = this.currentWord.word[i];
        this.gameFishDivElement.appendChild(letterElement);
      }
      wordHld.appendChild(this.gameFishDivElement);
    }
  }

  /**
  * Update the letter/word index based on the current position.
  */
  updateCurrentPosition(): void {
    if (this.currentWord.active) {
      if (this.currentCharIndex < this.currentWord.word.length - 1) {
        // Update the current letter index.
        this.currentCharIndex++;
        this.currentChar = this.currentWord.word[this.currentCharIndex];
        this.currentPosition();
      } else {
        console.log('else');
        // remove word.
        this.markWordAsCompleted();
      }
    }
  }

  markWordAsCompleted(): void {
    this.removeWordFish();
  }

  removeWordFish(escaped: boolean = false): void {
    if (this.fishComponent) {
      if (!escaped) {
        const caughtSub = this.fishComponent.caught()
          .pipe(takeUntil(this.destroyed))
          .subscribe(() => {
            this.completedWordIndex.emit(true);
            caughtSub.unsubscribe();
          });
      } else {
        const escapeSubs = this.fishComponent.escaped()
          .pipe(takeUntil(this.destroyed))
          .subscribe(() => {
            this.completedWordIndex.emit(false);
            escapeSubs.unsubscribe();
          });
      }
    }
    this.currentCharIndex = 0;
    this.countError = 0;
    this.currentWord.active = false;
    this.currentWord.available = false;
    // this.currentWord.leftTheSchool = true;
    this.clearDomElements();
  }

  /**
   * Display the current position of the active character.
   */
  currentPosition(): void {
    const htmlElems = document.getElementsByClassName('animation-hld ');
    if (htmlElems && htmlElems.length > 0) {
      const parentElement = document.getElementsByClassName('animation-hld')[this.index];
      if (parentElement) {
        const findSpanEl = parentElement.getElementsByClassName('key-fish-hld ' + this.currentCharIndex)[0];
        if (findSpanEl) {
          findSpanEl.classList.add('active');
          this.currentFishActiveElement = findSpanEl;
        }
      }
    }
  }

  /**
   * Mark the current character as completed.
   */
  markAsCompleted(): void {
    if (this.currentWord.active) {
      if (this.currentFishActiveElement && this.currentFishActiveElement.classList.contains('active')) {
        this.currentFishActiveElement.classList.remove('active');
        // Add completed class (used to change the background for the completed character) to the current character.
        this.currentFishActiveElement.classList.add('completed');
      }
    }
  }

  /**
   * Mark the current character as mistake and count the number of mistakes.
   */
  markAsMistake(): void {
    console.log('this.currentFishActiveElement', this.currentFishActiveElement);
    if (this.currentFishActiveElement && !this.currentFishActiveElement.classList.contains('error')) {
      this.currentFishActiveElement.classList.add('error');
    }
  }

  /**
   * Clear the DOM elements.
   */
  clearDomElements(): void {
    // console.log('this.wordHld', this.wordHld);
    // console.log('this.gameFishDivElement', this.gameFishDivElement);
    if (this.wordHld && this.gameFishDivElement && this.gameFishDivElement.hasChildNodes()) {
      // console.log('this.gameFishDivElement.hasChildNodes()', this.gameFishDivElement.hasChildNodes());
      this.wordHld.nativeElement.removeChild(this.gameFishDivElement);
    }
  }
}
