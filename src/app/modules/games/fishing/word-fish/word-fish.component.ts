import { WPSService } from 'src/app/services/wps.service';
import { Component, ElementRef, Input, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ChangeDetectorRef, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { createEmptyFishWithWordDTO, FishWithWordDTO } from 'src/app/dto/fish.dto';
import { AppGamesFishComponent } from '../fish/fish.component';

@Component({
  selector: 'app-modules-games-fishing-word-fish',
  templateUrl: './word-fish.component.html',
  styleUrls: ['./word-fish.component.scss']
})
export class AppGamesFishingWordFishComponent implements OnDestroy, AfterViewInit, OnInit {
  @ViewChild('fishComp') fishComponent?: AppGamesFishComponent;
  @ViewChild('wordHld') wordHld?: ElementRef;
  @Input()
  set word(text: FishWithWordDTO) {
    this.currentWord = text;
  }
  get word(): FishWithWordDTO {
    return this.currentWord;
  }

  @Input() index: number = 0;
  // Stores the current word and fish.
  currentWord: FishWithWordDTO = createEmptyFishWithWordDTO();
  // Stores the HTMLElement for the current fish and word.
  gameFishDivElement?: Element;
  // Stores the current Element.
  currentFishActiveElement?: Element;
  // Stores the current character's index.
  currentCharIndex: number = 0;
  // Stores the current character.
  currentChar: string = '';
  // Stores the current typed character.
  typedCharacter: string = '';
  // Stores the number of errors.
  countError = 0;
  // Stores the current fish image.
  currentFishImage = '';
  // Stores the time for typing the word.
  timerWords = new Date();
  // Stores the time for typing the letter.
  timerLetters = new Date();
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<boolean>();
  // Outputs the event when the word is completed.
  @Output() isWordCompleted: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param wpsService Reference to WPSService.
   */
  constructor(
    private readonly wpsService: WPSService
  ) { }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit() {
    if (this.currentWord) {
      this.currentFishImage = `assets/svg/${this.currentWord.fishImage.name}.svg`;
    }
  }

  /**
   * A lifecycle hook that is called after Angular has fully initialized a component's view.
   */
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

  /**
   * Key down method.
   *
   * @param char Represents the character that was typed.
   * @param shouldRemoveWord Tells if the current word should be removed or not.
   */
  keyDown(char: string, shouldRemoveWord: boolean = false): void {
    // console.log('this.currentWord', this.currentWord);
    if (shouldRemoveWord) {
      this.removeWordFish(true);
      return;
    }
    this.typedCharacter = char;
    if (this.currentCharIndex === 0) {
      this.currentPosition();
      this.timerWords = new Date();
      this.timerLetters = new Date();
    }
    let diff = this.wpsService.calculateTimeDiff(this.timerLetters, new Date());
    if (this.currentWord.word[this.currentCharIndex] === this.typedCharacter) {
      this.markAsCompleted();
      this.updateCurrentPosition();
      this.wpsService.updateCLPS(diff);
      this.updateWordTime();
    } else {
      this.updateWordTime();
      this.countError++;
      this.markAsMistake();
      this.wpsService.updateWLPS(diff);
      // Check for nbr of mistakes and if it's greater than fish maxErrors remove the word.
      if (this.countError > this.currentWord.fish.maxErrors) {
        this.removeWordFish(true);
      }
    }
  }

  /**
   * Create the HTML elements.
   */
  createHTML(): void {
    if (this.wordHld && this.currentWord) {
      const wordHld = this.wordHld.nativeElement;
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
        this.removeWordFish();
      }
    }
  }

  /**
   * Remove the current word and fish.
   *
   * @param escaped Tells if the fish (the word was mispelled) escaped or not.
   */
  removeWordFish(escaped: boolean = false): void {
    if (this.fishComponent) {
      if (!escaped) {
        const caughtSub = this.fishComponent.caught()
          .pipe(takeUntil(this.destroyed))
          .subscribe(() => {
            this.isWordCompleted.emit(true);
            caughtSub.unsubscribe();
          });
      } else {
        const escapeSubs = this.fishComponent.escaped()
          .pipe(takeUntil(this.destroyed))
          .subscribe(() => {
            this.isWordCompleted.emit(false);
            escapeSubs.unsubscribe();
          });
      }
    }
    this.currentCharIndex = 0;
    this.countError = 0;
    this.currentWord.active = false;
    this.currentWord.available = false;
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
    if (this.currentFishActiveElement && !this.currentFishActiveElement.classList.contains('error')) {
      this.currentFishActiveElement.classList.add('error');
    }
  }

  /**
   * Clear the DOM elements.
   */
  clearDomElements(): void {
    if (this.wordHld && this.gameFishDivElement && this.gameFishDivElement.hasChildNodes()) {
      this.wordHld.nativeElement.removeChild(this.gameFishDivElement);
    }
  }

  /**
   * Updates the time when the current word is completed or not.
   */
  updateWordTime(): void {
    if (this.currentCharIndex === this.currentWord.word.length - 1) {
      const diffWord = this.wpsService.calculateTimeDiff(this.timerWords, new Date());
      this.wpsService.updateWWPS(diffWord);
    }
  }
}
