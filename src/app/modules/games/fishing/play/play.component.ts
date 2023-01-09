import { fromEvent, ReplaySubject, Subscription, takeUntil, timer } from 'rxjs';
import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageHelperService } from 'src/app/services/language.service';
import { FishGame } from 'src/app/games/fish';
import { createEmptyLevelDTO, GameDTO, GameStorageDTO, ScoreUpdateDTO } from 'src/app/dto/game.dto';
import { MatDialog } from '@angular/material/dialog';
import { AppGamesFishingGameOverComponent } from '../game-over/game-over.component';
import { STORAGE_KEY_TYPE } from 'src/app/common/enums';
import { environment } from 'src/environments/environment';
import { ResultDTO } from 'src/app/dto/course.dto';
import { FishWithWordDTO, createFishWithWordDTO } from 'src/app/dto/fish.dto';
import { GridService } from 'src/app/services/grid.service';
import { Level, LevelService, FishWithWord } from 'src/app/services/level.service';
import { AppGamesFishingSchoolFishComponent } from '../school-fish/school-fish.component';

/**
 * This component is the main component for the fishing game.
 */
@Component({
  selector: 'app-modules-games-fish-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class AppGamesFishPlayComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('schoolFish') schoolFish?: AppGamesFishingSchoolFishComponent;
  @ViewChild('wordHld') wordHld?: ElementRef;
  @ViewChild('grid') grid?: ElementRef;
  // Stores the number of minutes.
  minutes: number = 0;
  // Stores the number of tens of minutes.
  tensOfMinutes: number = 0;
  // Stores the number of seconds.
  seconds: number = 0;
  // Stores the number of tens of seconds.
  tensOfSeconds: number = 0;
  // Stores the game levels.
  levels: GameDTO[] = [];
  // Stores the level.
  currentLevel?: Level;
  // Stores the current game level.
  gameLevel: GameDTO = createEmptyLevelDTO();
  // Stores the timer subscription.
  timerSubscription: Subscription = Subscription.EMPTY;
  // Stores the name of the play/pause icon.
  activeIcon: string = 'pause';
  // Stores the current language.
  currentLanguage: string;
  // Stores the HTMLElement for the current fish and word.
  gameFishDivElement?: Element;
  // Stores the countdown number (3 seconds by default).
  countdownNbr: number = 3;
  // Tells if the time is over or not.
  isTimeOut: boolean = false;
  // Stores the coundown subscription.
  countdownSubscription: Subscription = Subscription.EMPTY;
  // Stores the time in milliseconds.
  timeInMs: number = 0;
  // Stores the current score.
  score = 0;
  // Stores the number of completed words.
  completedWords: number = 0;
  // Stores the number of characters.
  charNbr = 0;
  // Stores the number of times when the game was paused.
  pauseCount = 0;
  // Stores the time when the user pressed the first key.
  startTime = new Date();
  // Tells if the user started the game by oressing a key or not.
  startTimeCount = false;
  // Stores the total number of levels.
  totalNbrOfLevels = 0;
  // Stores the goal of the game level.
  levelGoal = 0;
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<boolean>();

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param router Reference to Router.
   * @param activatedRoute Reference to ActivatedRoute.
   * @param languageHelperService Reference to LanguageHelperService.
   * @param gridService Reference to GridService.
   * @param cdr Reference to ChangeDetectorRef.
   * @param dialog Reference to MatDialog.
   * @param levelService Reference to LevelService.
   */
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly languageHelperService: LanguageHelperService,
    private readonly gridService: GridService,
    private readonly cdr: ChangeDetectorRef,
    private readonly dialog: MatDialog,
    protected readonly levelService: LevelService,
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
    this.initGrid();
    // Listens for any changes regarding the current used language.
    this.languageHelperService.OnLanguageChanged
      .pipe(takeUntil(this.destroyed)).subscribe(() => {
        this.currentLanguage = this.languageHelperService.currentLangUsed;
        this.getFishGameData();
      });

    this.keyDownListener();
  }

  /**
   * Initializes the grid.
   */
  initGrid() {
    this.gridService.initGrid();
  }

  // TODO: Debug function (to be removed later).
  renderGrid() {
    const grid = this.gridService.getGrid();
    // console.log('grid', grid);
    if (this.grid) {
      const gridElement = this.grid.nativeElement;
      gridElement.innerHTML = '';
      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
          gridElement.appendChild(this.renderCell(grid[i][j].x, grid[i][j].y, grid[i][j].ocupied ? grid[i][j].type : ''));
        }
      }
    }
  }

  // TODO: Debug function (to be removed later).
  renderCell(x: number, y: number, type: string): HTMLElement {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.classList.add(`cell-${x}-${y}`);
    if (type) { cell.classList.add(type); }
    cell.style.left = `${x * this.gridService.gridSize}px`;
    cell.style.top = `${y * this.gridService.gridSize}px`;
    return cell;
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
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(takeUntil(this.destroyed)).subscribe((event) => {
        // Start counting the time only when the user pressed the first key.
        if (!this.startTimeCount) {
          this.startTime = new Date();
        }
        if (this.activeIcon === 'pause' && !this.isTimeOut) {
          if ((event as KeyboardEvent).key === ' ') {
            // Prevent auto scroll on space.
            event.preventDefault();
          }

          if (this.schoolFish) {
            this.schoolFish.keyDown(event.key.toLowerCase());
          }
        }
        this.startTimeCount = true;
      });
  }

  /**
   * Gets the game data based on the id from the URL.
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
        if (cat && cat.length > 0) {
          this.currentLevel = this.levelService.generateLevel(levelID + 1, cat);
          this.totalNbrOfLevels = this.levelService.getNumberOfLevels();
          if (this.currentLevel) {
            this.gameLevel = {
              id: this.currentLevel.levelDefinition.id,
              name: this.currentLevel.levelDefinition.name,
              results: []
            };
            this.levelGoal = this.currentLevel.levelDefinition.goal;
            const words = this.currentLevel.extractAllLevelWords().map((el: FishWithWord) => {
              const word: FishWithWordDTO = createFishWithWordDTO({
                fish: el.fish.toDTO(),
                word: el.word,
                fishImage: el.fishImage,
                active: false,
              });
              return word;
            });
            if (this.schoolFish) {
              this.schoolFish.initSchool(words, this.currentLevel);
            }
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
            this.gameOver(true);
          }
          this.tensOfSeconds = !this.isTimeOut ? 5 : 0;
        }
        this.seconds = !this.isTimeOut ? 9 : 0;
      }
    });
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
  gameOver(timeOut: boolean = false): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.isTimeOut = true;
    const showNextButton = (this.gameLevel.id < this.totalNbrOfLevels - 1) ? true : false;
    this.updateLocalStorage();
    const dialogRef = this.dialog.open(AppGamesFishingGameOverComponent, {
      panelClass: 'game-over-class',
      backdropClass: 'game-over-backdrop',
      disableClose: true,
      data: { level: this.gameLevel, wordsCount: this.completedWords, language: this.currentLanguage, showNext: showNextButton, timeOut: timeOut }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === 'replay') {
          this.replay(this.gameLevel.id);
        } else if (result === 'next') {
          this.replay(this.gameLevel.id + 1);
        }
      }
    });
  }

  /**
   * Update the local storage with the result for the current level.
   */
  updateLocalStorage(): void {
    const timeDiff = this.levelService.calculateTimeDiff(this.startTime, new Date());
    const levelResult: ResultDTO = {
      numberOfWords: this.completedWords,
      characters: this.charNbr,
      mistakes: 0,
      time: timeDiff,
      updatedAt: new Date()
    };
    this.gameLevel.updatedAt = new Date();

    if (localStorage.getItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS)) {
      const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS) as string);
      if (storedData) {
        const findLanguage = storedData.find((item: GameStorageDTO) => item.language === this.currentLanguage);
        if (findLanguage) {
          findLanguage.totalLevels = this.totalNbrOfLevels;
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
      totalLevels: this.totalNbrOfLevels,
      data: [this.gameLevel]
    };
    return gameProgress;
  }

  /**
   * Toggle pause/play.
   */
  togglePlayState(): void {
    if (this.activeIcon === 'pause') {
      // Allow max 3 pauses.
      if (this.pauseCount <= 2) {
        this.activeIcon = 'play';
        this.pause();
        this.pauseCount++;
      }
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
   * Navigate to select level view.
   */
  selectLevel(): void {
    this.router.navigate(['/games/fish/level']);
  }

  /**
   * Update the score.
   *
   * @param scoreData Represents the score data.
   */
  updateScore(scoreData: ScoreUpdateDTO): void {
    this.score = scoreData.score;
    this.completedWords = scoreData.completedWords;
    this.charNbr = scoreData.chars;

    if (this.currentLevel && this.score >= this.currentLevel.levelDefinition.goal) {
      this.gameOver();
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
}
