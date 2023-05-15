import { fromEvent, ReplaySubject, Subscription, takeUntil, timer } from 'rxjs';
import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageHelperService } from 'src/app/services/language.service';
import { FishGame } from 'src/app/games/fish';
import { createEmptyLevelDTO, GameDTO, GameStorageDTO, ScoreUpdateDTO } from 'src/app/dto/game.dto';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { AppGamesFishingGameOverComponent } from '../game-over/game-over.component';
import { FISH_GAME_SOUND_TYPE, STORAGE_KEY_TYPE } from 'src/app/common/enums';
import { environment } from 'src/environments/environment';
import { ResultDTO } from 'src/app/dto/course.dto';
import { FishWithWordDTO, createFishWithWordDTO } from 'src/app/dto/fish.dto';
import { GridService } from 'src/app/services/grid.service';
import { Level, LevelService, FishWithWord } from 'src/app/services/level.service';
import { AppGamesFishingSchoolFishComponent } from '../school-fish/school-fish.component';
import { SpeechService } from 'src/app/services/speech.service';
import { SettingsService } from 'src/app/services/settings.service';

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
  // Stores the time in seconds.
  timeInSec: number = 0;
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
  // Tells if it should play the countdown sound or not.
  playCountdownSound = false;
  // Stores the name of the sound icon.
  soundIcon = '';
  // Tells if the sound is muted or not.
  soundMuted = false;
  // Stores the total number of errors.
  errorCount = 0;
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
   * @param speechService Reference to SpeechService.
   * @param settingsService Reference to SettingsService.
   */
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly languageHelperService: LanguageHelperService,
    private readonly gridService: GridService,
    private readonly cdr: ChangeDetectorRef,
    private readonly dialog: MatDialog,
    protected readonly levelService: LevelService,
    private readonly speechService: SpeechService,
    private readonly settingsService: SettingsService,
  ) {
    this.currentLanguage = this.languageHelperService.currentLangUsed;
    const timeArray = environment.gameTime.split(':');
    this.timeInSec = Number(timeArray[0]) * 60 + Number(timeArray[1]);
    const mins = timeArray[0].split('');
    const secs = timeArray[1].split('');
    this.tensOfMinutes = Number(mins[0]);
    this.minutes = Number(mins[1]);
    this.tensOfSeconds = Number(secs[0]);
    this.seconds = Number(secs[1]);

    if (this.settingsService.getDefaultGameSoundOption() === 'on') {
      this.soundMuted = false;
      this.soundIcon = 'sound_on'
    } else {
      this.soundIcon = 'sound_off';
      this.soundMuted = true;
    }
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
    if (this.speechService.isPlaying()) {
      this.speechService.unload();
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
    this.speechService.playFishGameSound(FISH_GAME_SOUND_TYPE.COUNTDOWN, this.soundMuted);
    this.countdownSubscription = timer(1000, 1000).pipe(takeUntil(this.destroyed)).subscribe(() => {
      if (this.countdownNbr > 0) {
        if (this.countdownNbr === 1) {
          this.speechService.unload();
        }
        this.countdownNbr--;
      } else {
        this.countdownSubscription.unsubscribe();
        this.createCounter();
        this.speechService.playFishGameSound(FISH_GAME_SOUND_TYPE.BACKGROUND, this.soundMuted);
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
            this.schoolFish.keyDown(event.key);
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
      if (this.timeInSec > 0) {
        this.timeInSec--;
        this.convertFromSecToMinAndSec();
        if (this.timeInSec === 10) {
          this.playCountdownSound = true;
          this.speechService.playFishGameSound(FISH_GAME_SOUND_TYPE.TIMER, this.soundMuted);
        }
      } else {
        this.gameOver(true);
      }
    });
  }

  /**
   * Converts seconds to minutes and seconds.
   */
  convertFromSecToMinAndSec(): void {
    this.minutes = Math.floor(this.timeInSec / 60);
    const seconds = this.timeInSec - this.minutes * 60;
    this.tensOfSeconds = Math.floor(seconds / 10);
    this.seconds = seconds - this.tensOfSeconds * 10;
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
    this.speechService.unload();
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
      data: {
        level: this.gameLevel,
        wordsCount: this.completedWords,
        language: this.currentLanguage,
        showNext: showNextButton,
        timeOut: timeOut
      }
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
      mistakes: this.errorCount,
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
        if (this.speechService.isPlaying()) {
          // Unload the sound if the countdown is playing (this is needed to match the time with the timer sound).
          this.playCountdownSound ? this.speechService.unload() : this.speechService.pause();
        }
        this.activeIcon = 'play';
        this.pause();
        this.pauseCount++;
      }
    } else {
      this.activeIcon = 'pause';
      this.play();
      this.speechService.playFishGameSound(this.playCountdownSound ? FISH_GAME_SOUND_TYPE.TIMER : FISH_GAME_SOUND_TYPE.BACKGROUND, this.soundMuted);
    }
  }

  /**
   * Toggle sound on/off.
   */
  toggleSoundState(): void {
    if (this.soundIcon === 'sound_on') {
      this.soundIcon = 'sound_off';
      this.soundMuted = true;
    } else {
      this.soundIcon = 'sound_on';
      this.soundMuted = false;
    }
    if (this.activeIcon === 'pause') {
      this.speechService.playFishGameSound(this.playCountdownSound ? FISH_GAME_SOUND_TYPE.TIMER : FISH_GAME_SOUND_TYPE.BACKGROUND, this.soundMuted);
    }
    localStorage.setItem(STORAGE_KEY_TYPE.GAME_SOUND_OPTION, this.soundMuted ? 'off' : 'on');
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
    this.errorCount = scoreData.errors;

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
