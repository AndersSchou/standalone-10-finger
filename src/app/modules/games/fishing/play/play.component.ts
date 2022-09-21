import { AppGamesFishComponent } from './../fish/fish.component';
import { fromEvent, ReplaySubject, Subscription, takeUntil, timer } from 'rxjs';
import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageHelperService } from 'src/app/services/language.service';
import { FishGame } from 'src/app/games/fish';
import { createEmptyLevelDTO, GameDTO, GameStorageDTO } from 'src/app/dto/game.dto';
import { MatDialog } from '@angular/material/dialog';
import { AppGamesFishingGameOverComponent } from '../game-over/game-over.component';
import { STORAGE_KEY_TYPE } from 'src/app/common/enums';
import { environment } from 'src/environments/environment';
import { ResultDTO } from 'src/app/dto/course.dto';

/**
 * This component is the main component for the fishing game.
 */
@Component({
  selector: 'app-modules-games-fish-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class AppGamesFishPlayComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('fishComp') fishComponent?: AppGamesFishComponent;
  @ViewChild('wordHld') wordHld?: ElementRef;
  // Stores the number of minutes.
  minutes: number = 0;
  // Stores the number of tens of minutes.
  tensOfMinutes: number = 0;
  // Stores the number of seconds.
  seconds: number = 0;
  // Stores the number of tens of seconds.
  tensOfSeconds: number = 0;
  // Stores the total game levels.
  totalLevels: number = 0;
  // Stores the level index.
  levelIndex: number = 0;
  // Stores the game levels.
  levels: GameDTO[] = [];
  // Stores the current level.
  gameLevel: GameDTO = createEmptyLevelDTO();
  // Stores the timer subscription.
  timerSubscription: Subscription = Subscription.EMPTY;
  // Stores the name of the play/pause icon.
  activeIcon: string = 'pause';
  // Stores the current language.
  currentLanguage: string;
  // Stores the current word.
  currentWord: string = '';
  // Stores the current word index.
  currentWordIndex: number = 0;
  // Stores the current character.
  currentChar: string = '';
  // Stores the current character's index.
  currentCharIndex: number = 0;
  // Stores the number of mistakes.
  nbrOfMistakes: number = 0;
  // Stores the current Element.
  currentFishActiveElement?: Element;
  // Stores the HTMLElement for the current fish and word.
  gameFishDivElement?: Element;
  // Stores the number of completed words.
  completedWords: number = 0;
  // Stores the countdown number (3 seconds by default).
  countdownNbr: number = 3;
  // Tells if the time is over or not.
  isTimeOut: boolean = false;
  // Stores the coundown subscription.
  countdownSubscription: Subscription = Subscription.EMPTY;
  // Stores the total number of typed characters.
  totalChars: number = 0;
  // Stores the total number of mistakes.
  totalMistakes: number = 0;
  // Stores the time in milliseconds.
  timeInMs: number = 0;
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<boolean>();
  // Default fishes array.
  fishesArray: string[] = ['blue_fish_1', 'blue_fish_2', 'koi_black', 'koi_orange_black', 'koi_orange_white', 'koi_orange_white_1',
    'koi_white_red_1', 'koi_yellow', 'marine_fish_1', 'marine_fish', 'red_fish', 'striped_fish', 'striped_fish_1'];
  // Default css stryle for the current fish and word holder.
  fishHldStyle = {
    'left': '0',
    'bottom': '0',
  };

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param router Reference to Router.
   * @param activatedRoute Reference to ActivatedRoute.
   * @param languageHelperService Reference to LanguageHelperService.
   * @param cdr Reference to ChangeDetectorRef.
   * @param dialog Reference to MatDialog.
   */
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly languageHelperService: LanguageHelperService,
    private readonly cdr: ChangeDetectorRef,
    private readonly dialog: MatDialog,
  ) {
    this.currentLanguage = this.languageHelperService.currentLangUsed;
    const timeArray = environment.gameTime.split(':');
    this.timeInMs = Number(timeArray[0]) * 60 * 1000 + Number(timeArray[1]) * 1000;
    const mins = timeArray[0].split('');
    const secs = timeArray[1].split('');
    this.tensOfMinutes = Number(mins[0]);
    this.minutes = Number(mins[1]);
    this.tensOfSeconds = Number(secs[0]);
    this.seconds = Number(secs[1]);
  }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    // Listens for any changes regarding the current used language.
    this.languageHelperService.OnLanguageChanged
      .pipe(takeUntil(this.destroyed)).subscribe(() => {
        this.currentLanguage = this.languageHelperService.currentLangUsed;
        this.getFishGameData();
      });

    this.keyDownListener();
  }

  /**
   * A lifecycle hook that is called after Angular has fully initialized a component's view.
   */
  ngAfterViewInit(): void {
    this.startReadyCountdown();
  }

  /**
     * Unsubscribe Observables and detach event handlers to avoid memory leaks.
     */
  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.clearDomElements();
    this.destroyed.next(true);
  }

  /**
   * Starts the ready countdown.
   */
  startReadyCountdown(): void {
    if (this.currentLanguage && this.currentLanguage.length > 0) {
      this.getFishGameData();
    }
    this.countdownSubscription = timer(1000, 1000).pipe(takeUntil(this.destroyed)).subscribe(() => {
      if (this.countdownNbr > 0) {
        this.countdownNbr--;
      } else {
        this.countdownSubscription.unsubscribe();
        this.createCounter();
      }
    });
  }

  /**
   * Keydown event listener.
   */
  keyDownListener(): void {
    fromEvent(document, 'keydown')
      .pipe(takeUntil(this.destroyed)).subscribe((event) => {
        if (this.activeIcon === 'pause' && !this.isTimeOut) {
          if ((event as KeyboardEvent).key === ' ') {
            // Prevent auto scroll on space.
            event.preventDefault();
          }

          if (this.currentChar.toLowerCase() === (event as KeyboardEvent).key.toLowerCase()) {
            this.totalChars++;
            this.markAsCompleted();
            this.updateCurrentPosition();
          } else {
            if ((event as KeyboardEvent).key !== 'Shift') {
              this.totalMistakes++;
              this.markAsMistake();
            }
          }
        }
      });
  }

  /**
   * Gets the game data.
   */
  getFishGameData(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.destroyed))
      .subscribe((param) => {
        const levelID = param.get('id');
        if (levelID) {
          this.loadGameGata(Number(levelID));
        }
      });
    this.cdr.detectChanges();
  }

  /**
   * Get the game level data.
   *
   * @param levelID Represents the level ID.
   */
  loadGameGata(levelID: number): void {
    if (this.currentLanguage && this.currentLanguage.length > 0) {
      const lang = this.currentLanguage.split('-')[0];
      if (lang in FishGame) {
        const cat = FishGame[lang];
        if (cat) {
          this.totalLevels = cat.length;
          this.levels = cat;
          const findLevel = cat.find((level: GameDTO) => level.id === Number(levelID));
          if (findLevel) {
            this.levelIndex = cat.indexOf(findLevel);
            this.gameLevel = findLevel;
            this.currentWord = this.gameLevel.words[0];
            this.currentChar = this.currentWord[0];
            this.createHTML();
            this.currentPosition();
          } else {
            this.router.navigate(['/games']);
          }
        }
      }
    }
  }

  /**
   * Create the time counter.
   */
  createCounter(): void {
    this.timerSubscription = timer(0, 1000).pipe(takeUntil(this.destroyed)).subscribe(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else {
        if (this.tensOfSeconds > 0) {
          this.tensOfSeconds--;
        } else {
          if (this.minutes > 0) {
            this.minutes--;
          } else {
            this.gameOver();
          }
          this.tensOfSeconds = !this.isTimeOut ? 5 : 0;
        }
        this.seconds = !this.isTimeOut ? 9 : 0;
      }
    });
  }

  /**
   * Create the HTML elements.
   */
  createHTML(): void {
    this.updateFishHolderStyle();
    if (this.fishComponent && this.wordHld) {
      const wordHld = this.wordHld.nativeElement;
      const addFishSubs = this.fishComponent.addFish(`assets/svg/${this.fishesArray[Math.floor(Math.random() * this.fishesArray.length)]}.svg`)
        .pipe(takeUntil(this.destroyed))
        .subscribe(() => {
          console.log('fish added');
          addFishSubs.unsubscribe();
        });
      this.gameFishDivElement = document.createElement('div');
      this.gameFishDivElement.classList.add('flex-v-align');

      for (let i = 0; i < this.currentWord.length; i++) {
        const letterElement = document.createElement('span');
        const keyDefaultClass = ['key-fish-hld', i.toString()];
        letterElement.classList.add(...keyDefaultClass);
        letterElement.innerText = this.currentWord[i];
        this.gameFishDivElement.appendChild(letterElement);
      }
      wordHld.appendChild(this.gameFishDivElement);
    }
  }

  /**
   * Update the current position of the fish and text holder.
   */
  updateFishHolderStyle(): void {
    const minY = window.innerHeight * 0.02;
    const maxY = window.innerHeight - 520;
    const randomX = Math.random();
    const widthFixed = Math.round((window.innerWidth - 382) / 2);
    const xPos = randomX > 0.5 ? Math.floor(randomX * widthFixed / 2) : Math.floor((randomX * (window.innerWidth / 2 - 100)) + window.innerWidth / 2);
    const yPos = Math.floor(Math.random() * (maxY - minY) + minY);
    this.fishHldStyle = {
      'left': xPos + 'px',
      'bottom': yPos + 'px',
    };
  }

  /**
  * Update the letter/word index based on the current position.
  */
  updateCurrentPosition(): void {
    if (this.currentCharIndex < this.currentWord.length - 1) {
      // Update the current letter index.
      this.currentCharIndex++;
      this.currentChar = this.currentWord[this.currentCharIndex];
      this.currentPosition();
    } else {
      // Update the current word index.
      this.currentWordIndex++;
      this.completedWords++;
      if (this.currentWordIndex < this.gameLevel.words.length) {
        this.currentWord = this.gameLevel.words[this.currentWordIndex];
        this.currentCharIndex = 0;
        this.currentChar = this.currentWord[this.currentCharIndex];
        this.clearDomElements();

        if (this.fishComponent) {
          const caughtSub = this.fishComponent.caught()
            .pipe(takeUntil(this.destroyed))
            .subscribe(() => {
              caughtSub.unsubscribe();
              this.createHTML();
              this.currentPosition();
            });
        }
      } else {
        // Should not happen. We should have enough words for a certain level to avoid this situation
        // (for 2 minutes we need around 420 words).
        console.log('game finished');
      }
    }
  }

  /**
   * Display the current position of the active character.
   */
  currentPosition(): void {
    const findSpanEl = document.getElementsByClassName('key-fish-hld ' + this.currentCharIndex)[0];
    if (findSpanEl) {
      findSpanEl.classList.add('active');
      this.currentFishActiveElement = findSpanEl;
    }
  }

  /**
   * Mark the current character as completed.
   */
  markAsCompleted(): void {
    if (this.currentFishActiveElement && this.currentFishActiveElement.classList.contains('active')) {
      this.currentFishActiveElement.classList.remove('active');
      // Add completed class (used to change the background for the completed character) to the current character.
      this.currentFishActiveElement.classList.add('completed');
    }
  }

  /**
   * Mark the current character as mistake and count the number of mistakes.
   */
  markAsMistake(): void {
    this.nbrOfMistakes++;
    if (this.nbrOfMistakes > 1) {
      // More than 1 mistake, the fish will swim away.
      if (this.fishComponent) {
        const escapeSubs = this.fishComponent.escaped()
          .pipe(takeUntil(this.destroyed))
          .subscribe(() => {
            escapeSubs.unsubscribe();
            this.currentWordIndex++;
            if (this.currentWordIndex < this.gameLevel.words.length) {
              this.currentWord = this.gameLevel.words[this.currentWordIndex];
              this.currentCharIndex = 0;
              this.currentChar = this.currentWord[this.currentCharIndex];
              this.clearDomElements();
              this.createHTML();
              this.currentPosition();
            } else {
              // Should not happen. We should have enough words for a certain level to avoid this situation.
              console.log('game finished');
            }
            this.nbrOfMistakes = 0;
          });
      }
    } else {
      if (this.currentFishActiveElement && !this.currentFishActiveElement.classList.contains('error')) {
        this.currentFishActiveElement.classList.add('error');
      }
    }
  }

  /**
   * Pause time.
   */
  pause(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  /**
   * Resume time.
   */
  play(): void {
    this.createCounter();
  }

  /**
   * Replay current level.
   *
   * @param id Represents the level id.
   */
  replay(id: number): void {
    this.router.onSameUrlNavigation = 'reload';
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    this.router.navigate(['/games/fish/level/', id]);
  }

  /**
   * Opens the game over modal.
   */
  gameOver(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.isTimeOut = true;
    const showNextButton = (this.levelIndex < this.totalLevels - 1) ? true : false;
    this.updateLocalStorage();
    const dialogRef = this.dialog.open(AppGamesFishingGameOverComponent, {
      panelClass: 'game-over-class',
      backdropClass: 'game-over-backdrop',
      disableClose: true,
      data: { level: this.gameLevel, wordsCount: this.completedWords, language: this.currentLanguage, showNext: showNextButton }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === 'replay') {
          this.replay(this.gameLevel.id);
        } else if (result === 'next') {
          this.replay(this.levels[this.levelIndex + 1].id);
        }
      }
    });
  }

  /**
   * Update the local storage with the result for the current level.
   */
  updateLocalStorage(): void {
    const levelResult: ResultDTO = {
      numberOfWords: this.completedWords,
      characters: this.totalChars,
      mistakes: this.totalMistakes,
      time: this.timeInMs,
      updatedAt: new Date()
    };
    this.gameLevel.updatedAt = new Date();

    if (localStorage.getItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS)) {
      const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS) as string);
      if (storedData) {
        const findLanguage = storedData.find((item: GameStorageDTO) => item.language === this.currentLanguage);
        if (findLanguage) {
          findLanguage.totalLevels = this.totalLevels;
          const findLevel = findLanguage.data.find((item: GameDTO) => item.id === this.gameLevel.id);
          if (findLevel) {
            findLevel.results.push(levelResult);
          } else {
            this.gameLevel.results = [levelResult];
            findLanguage.data.push(this.gameLevel);
          }
        } else {
          storedData.push(this.gameProgressResult(levelResult));
        }
        localStorage.setItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS, JSON.stringify(storedData));
      }
    } else {
      localStorage.setItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS, JSON.stringify([this.gameProgressResult(levelResult)]));
    }
  }

  /**
   * Map game progress.
   *
   * @param levelResult Represents the result for the current level.
   *
   * @returns The game progress result as GameStorageDTO.
   */
  gameProgressResult(levelResult: ResultDTO): GameStorageDTO {
    this.gameLevel.results = [levelResult];
    const gameProgress: GameStorageDTO = {
      language: this.currentLanguage,
      totalLevels: this.totalLevels,
      data: [this.gameLevel]
    };
    return gameProgress;
  }

  /**
   * Toggle pause/play.
   */
  togglePlayState(): void {
    if (this.activeIcon === 'pause') {
      this.activeIcon = 'play';
      this.pause();
    } else {
      this.activeIcon = 'pause';
      this.play();
    }
  }

  /**
   * Navigate to games view.
   */
  backToGames(): void {
    this.router.navigate(['/games']);
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
   * Navigate to select level view.
   */
  selectLevel(): void {
    this.router.navigate(['/games/fish/level']);
  }
}
