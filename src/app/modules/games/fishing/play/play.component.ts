import { AppGamesFishComponent } from './../fish/fish.component';
import { fromEvent, ReplaySubject, Subscription, takeUntil, timer } from 'rxjs';
import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageHelperService } from 'src/app/services/language.service';
import { FishGame } from 'src/app/games/fish';
import { createEmptyLevelDTO, GameDTO, GameResultDTO, GameStorageDTO } from 'src/app/dto/game.dto';
import { MatDialog } from '@angular/material/dialog';
import { AppGamesFishingGameOverComponent } from '../game-over/game-over.component';
import { STORAGE_KEY_TYPE } from 'src/app/common/enums';

@Component({
  selector: 'app-modules-games-fish-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class AppGamesFishPlayComponent implements OnInit, AfterViewInit, OnDestroy {
  // @ViewChild('fishHolder') fishHolder?: ElementRef;
  @ViewChild('fishComp') fishComponent?: AppGamesFishComponent;
  @ViewChild('wordHld') wordHld?: ElementRef;
  minutes: number = 0;
  seconds: number = 3;
  gameLevel: GameDTO = createEmptyLevelDTO();
  timerSubscription: Subscription = Subscription.EMPTY;
  activeIcon: string = 'pause';
  // Stores the current language.
  currentLanguage: string;
  currentWord: string = '';
  currentWordIndex: number = 0;
  currentChar: string = '';
  currentCharIndex: number = 0;
  nbrOfMistakes: number = 0;
  // Stores the current Element.
  currentFishActiveElement?: Element;
  gameFishDivElement?: Element;
  completedWords: number = 0;
  countdownNbr: number = 3;
  isTimeOut: boolean = false;
  countdownSubscription: Subscription = Subscription.EMPTY;
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<boolean>();
  fishesArray: string[] = ['blue_fish_1', 'blue_fish_2', 'koi_black', 'koi_orange_black', 'koi_orange_white', 'koi_orange_white_1',
    'koi_white_red_1', 'koi_yellow', 'marine_fish_1', 'marine_fish', 'red_fish', 'striped_fish', 'striped_fish_1'];

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly languageHelperService: LanguageHelperService,
    private readonly cdr: ChangeDetectorRef,
    private readonly dialog: MatDialog,
  ) {
    this.currentLanguage = this.languageHelperService.currentLangUsed;
  }

  ngOnInit(): void {
    // Listens for any changes regarding the current used language.
    this.languageHelperService.OnLanguageChanged
      .pipe(takeUntil(this.destroyed)).subscribe(() => {
        this.currentLanguage = this.languageHelperService.currentLangUsed;
        this.getFishGameData();
      });

    this.keyDownListener();
  }

  ngAfterViewInit(): void {
    console.log('aaa');

    this.startReadyCountdown();
    // if (this.currentLanguage && this.currentLanguage.length > 0) {
    //   this.getFishGameData();
    // }
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
            this.markAsCompleted();
            this.updateCurrentPosition();
          } else {
            if ((event as KeyboardEvent).key !== 'Shift') {
              this.markAsMistake();
            }
          }
        }
      });
  }

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

  loadGameGata(levelID: number): void {
    if (this.currentLanguage && this.currentLanguage.length > 0) {
      const lang = this.currentLanguage.split('-')[0];
      if (lang in FishGame) {
        const cat = FishGame[lang];
        if (cat) {
          const findLevel = cat.find((level: GameDTO) => level.id === Number(levelID));
          if (findLevel) {
            this.gameLevel = findLevel;
            this.currentWord = this.gameLevel.words[0];
            this.currentChar = this.currentWord[0];
            this.createHTML();
            this.currentPosition();
          }
        }
      }
    }
  }

  createCounter(): void {
    this.timerSubscription = timer(1000, 1000).pipe(takeUntil(this.destroyed)).subscribe(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else {
        if (this.minutes > 0) {
          this.seconds = 59;
          this.minutes--;
        } else {
          console.log('game over');
          this.gameOver();
        }
      }
    });
  }

  createHTML(): void {
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
  * Update the letter/line/exercise index based on the current position.
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
        console.log('game finished');
      }
    }
  }

  /**
   * Display the current position of the selected character.
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
   *
   * @param isSpace Tells if the current character is a space or not.
   */
  markAsCompleted(): void {
    if (this.currentFishActiveElement && this.currentFishActiveElement.classList.contains('active')) {
      this.currentFishActiveElement.classList.remove('active');
      // Add completed class (used to change the background for the completed character) to the current character (all chars except space).
      this.currentFishActiveElement.classList.add('completed');
    }
  }

  /**
   * Mark the current character as mistake and count the number of mistakes.
   */
  markAsMistake(): void {
    this.nbrOfMistakes++;
    if (this.nbrOfMistakes > 1) {
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

  pause(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  play(): void {
    this.createCounter();
  }

  replay(): void {
    this.router.onSameUrlNavigation = 'reload';
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    this.router.navigate(['/games/fish/level/', this.gameLevel.id]);
  }

  gameOver(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.isTimeOut = true;
    this.updateLocalStorage();
    const dialogRef = this.dialog.open(AppGamesFishingGameOverComponent, {
      panelClass: 'game-over-class',
      backdropClass: 'game-over-backdrop',
      disableClose: true,
      data: { level: this.gameLevel, wordsCount: this.completedWords, language: this.currentLanguage }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === 'replay') {
          this.replay();
        } else if (result === 'next') {
          // this.router.navigate(['/games/fish/level/', this.gameLevel.id + 1]);
        }
      }
    });
  }

  updateLocalStorage(): void {
    const levelResult: GameResultDTO = {
      numberOfWords: this.completedWords,
      updatedAt: new Date()
    };
    this.gameLevel.updatedAt = new Date();

    if (localStorage.getItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS)) {
      // localStorage.setItem('gameLevel', JSON.stringify(this.gameLevel));
      const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS) as string);
      console.log('storedData', storedData);
      if (storedData) {
        const findLanguage = storedData.find((item: GameStorageDTO) => item.language === this.currentLanguage);
        console.log('findLanguage', findLanguage);
        if (findLanguage) {
          const findLevel = findLanguage.data.find((item: GameDTO) => item.id === this.gameLevel.id);
          if (findLevel) {
            findLevel.result.push(levelResult);
          } else {
            this.gameLevel.result = [levelResult];
            findLanguage.data.push(this.gameLevel);
          }
          console.log('storedData', storedData);
        } else {
          storedData.push({ language: this.currentLanguage, data: [this.updateResult(levelResult)] });
        }
        localStorage.setItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS, JSON.stringify(storedData));
      }
    } else {
      localStorage.setItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS, JSON.stringify([this.updateResult(levelResult)]));
    }
  }

  updateResult(levelResult: GameResultDTO): GameStorageDTO {
    this.gameLevel.result = [levelResult];
    const gameProgress: GameStorageDTO = {
      language: this.currentLanguage,
      data: [this.gameLevel]
    };
    return gameProgress;
  }

  togglePlayState(): void {
    if (this.activeIcon === 'pause') {
      this.activeIcon = 'play';
      this.pause();
    } else {
      this.activeIcon = 'pause';
      this.play();
    }
  }

  backToGames(): void {
    this.router.navigate(['/games']);
  }

  clearDomElements(): void {
    if (this.wordHld && this.gameFishDivElement && this.gameFishDivElement.hasChildNodes()) {
      this.wordHld.nativeElement.removeChild(this.gameFishDivElement);
    }
  }

  selectLevel(): void {
    this.router.navigate(['/games/fish/level']);
  }
}
