import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { VKeyboardComponent } from 'src/app/vkeyboard/vkeyboard.component';
import { AchievementService } from '../../services/achievement.service';
import { StatsService } from '../../services/stats.service';
import { FingerName, HandSide, isFingerExpectedForKey } from '../shared/finger-indicator.util';

interface Lane {
  id: number;
  correctLetter: string;
  incorrectLetters: string[];
  displayedLetters: string[]; // shuffled order
  finished: boolean;
  showError?: boolean; // true when wrong letter pressed
  spawnTime: number; // timestamp when lane was created
}

/**
 * Moon Race minigame.
 * Multiple lanes with letters are displayed.
 * The player must type the correct letter in each lane to advance and earn points.
 * Level 1: 3 lanes, 5 seconds | Level 2: 5 lanes, 4 seconds | Level 3: 7 lanes, 3 seconds
 */
@Component({
  selector: 'app-planet10finger-moonrace',
  templateUrl: './moonrace.component.html',
  styleUrl: './moonrace.component.scss',
  standalone: true,
  imports: [CommonModule, VKeyboardComponent],
})
export class MoonraceComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(VKeyboardComponent) vkeyboard?: VKeyboardComponent;
  @Input() coinsEarned = 0;
  @Input() difficulty: 1 | 2 | 3 = 2;
  @Output() gameClose = new EventEmitter<void>();
  @Output() gameRestart = new EventEmitter<void>();

  lanes: Lane[] = [];
  score = 0;
  timeLeft = 5;
  gameOver = false;
  private keyboardLocked = false;
  private fastLetterUnlocked = false;

  private timerIntervalRef: ReturnType<typeof setInterval> | null = null;
  private keydownListener: ((e: KeyboardEvent) => void) | null = null;
  private allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ'.split('');
  private nextId = 0;

  constructor(
    private readonly http: HttpClient,
    private readonly achievementService: AchievementService,
    private readonly statsService: StatsService
  ) {}

  ngAfterViewInit(): void {
    this.vkeyboard?.setTheme('color-group');
    this.vkeyboard?.setMode('partial');
  }

  ngOnInit(): void {
    this.startGame();
  }

  ngOnDestroy(): void {
    this.clearIntervals();
    this.detachKeyListener();
  }

  close(): void {
    this.gameClose.emit();
  }

  restartGame(): void {
    this.clearIntervals();
    this.detachKeyListener();
    this.startGame();
  }

  private startGame(): void {
    this.score = 0;
    // Set time based on difficulty
    const timeLimit = 20;
    this.timeLeft = timeLimit;
    this.gameOver = false;
    this.nextId = 0;
    this.fastLetterUnlocked = false;

    // Generate the first lane
    this.generateLane();

    // Countdown (ticks every second)
    this.timerIntervalRef = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);

    this.attachKeyListener();
  }

  private generateLane(): void {
    const correctLetter = this.allLetters[Math.floor(Math.random() * this.allLetters.length)];
    // Determine number of wrong letters based on difficulty
    const wrongLetterCount = this.difficulty === 1 ? 2 : this.difficulty === 2 ? 4 : 6;
    let incorrectLetters = this.getRandomIncorrectLetters(correctLetter, wrongLetterCount);
    
    // Ensure all letters are unique (no duplicates)
    let displayedLetters = this.shuffleArray([correctLetter, ...incorrectLetters]);
    while (new Set(displayedLetters).size !== displayedLetters.length) {
      // If duplicates found, regenerate incorrect letters
      incorrectLetters = this.getRandomIncorrectLetters(correctLetter, wrongLetterCount);
      displayedLetters = this.shuffleArray([correctLetter, ...incorrectLetters]);
    }

    this.lanes.push({
      id: this.nextId++,
      correctLetter,
      incorrectLetters,
      displayedLetters,
      finished: false,
      spawnTime: Date.now(),
    });
  }

  private getRandomIncorrectLetters(exclude: string, count: number): string[] {
    const available = this.allLetters.filter((l) => l !== exclude);
    const result = [];
    for (let i = 0; i < count && available.length > 0; i++) {
      const idx = Math.floor(Math.random() * available.length);
      result.push(available[idx]);
      available.splice(idx, 1);
    }
    return result;
  }

  private attachKeyListener(): void {
    this.detachKeyListener();
    const readyAt = Date.now() + 400;
    this.keydownListener = (e: KeyboardEvent) => {
      if (Date.now() < readyAt) return;
      if (this.gameOver) return;
      if (this.keyboardLocked) return;

      const key = e.key.toUpperCase();
      if (key.length !== 1 || !/[A-ZÆØÅ]/.test(key)) return;

      // Check if the key matches any unfinished lane
      let foundMatch = false;
      for (const lane of this.lanes) {
        if (!lane.finished && lane.correctLetter === key) {
          lane.finished = true;
          this.score++;
          foundMatch = true;

          // Check for fast letter achievement (answered within 2 seconds of spawn)
          const timeSinceSpawn = (Date.now() - lane.spawnTime) / 1000;
          if (timeSinceSpawn <= 2 && !this.fastLetterUnlocked) {
            this.achievementService.unlockAchievement(`moonrace_lvl${this.difficulty}_fast_letter`);
            this.fastLetterUnlocked = true;
          }

          // Remove finished lane and generate next one if game is still running
          setTimeout(() => {
            this.lanes = this.lanes.filter((l) => !l.finished);
            if (!this.gameOver) {
              this.generateLane();
            }
          }, 300);
          break;
        }
      }

      // If no correct match, show error state and regenerate letters after 1 second
      if (!foundMatch) {
        this.keyboardLocked = true;
        for (const lane of this.lanes) {
          if (!lane.finished) {
            lane.showError = true;
            
            setTimeout(() => {
              this.keyboardLocked = false;
              lane.showError = false;
              // Change to a new correct letter (not the same as before)
              const oldCorrectLetter = lane.correctLetter;
              let newCorrectLetter = this.allLetters[Math.floor(Math.random() * this.allLetters.length)];
              // Ensure new letter is different from the old one
              while (newCorrectLetter === oldCorrectLetter) {
                newCorrectLetter = this.allLetters[Math.floor(Math.random() * this.allLetters.length)];
              }
              lane.correctLetter = newCorrectLetter;
              // Generate new incorrect letters based on difficulty
              const wrongLetterCount = this.difficulty === 1 ? 2 : this.difficulty === 2 ? 4 : 6;
              let newIncorrectLetters = this.getRandomIncorrectLetters(newCorrectLetter, wrongLetterCount);
              // Ensure all letters are unique
              let newDisplayedLetters = this.shuffleArray([newCorrectLetter, ...newIncorrectLetters]);
              while (new Set(newDisplayedLetters).size !== newDisplayedLetters.length) {
                newIncorrectLetters = this.getRandomIncorrectLetters(newCorrectLetter, wrongLetterCount);
                newDisplayedLetters = this.shuffleArray([newCorrectLetter, ...newIncorrectLetters]);
              }
              lane.incorrectLetters = newIncorrectLetters;
              lane.displayedLetters = newDisplayedLetters;
            }, 1000);
            break;
          }
        }
      }
    };
    document.addEventListener('keydown', this.keydownListener);
  }

  private detachKeyListener(): void {
    if (this.keydownListener) {
      document.removeEventListener('keydown', this.keydownListener);
      this.keydownListener = null;
    }
  }

  private endGame(): void {
    this.gameOver = true;
    this.clearIntervals();
    this.detachKeyListener();

    // Record game completion
    this.statsService.recordGameCompletion('moonrace', {
      score: this.score,
      laneCount: this.lanes.length,
      difficulty: this.difficulty,
    });

    // Unlock achievements
    this.achievementService.unlockAchievement(`moonrace_lvl${this.difficulty}_complete`);
    if (this.score >= 10) {
      this.achievementService.unlockAchievement(`moonrace_lvl${this.difficulty}_10points`);
    }
  }

  private clearIntervals(): void {
    if (this.timerIntervalRef) {
      clearInterval(this.timerIntervalRef);
      this.timerIntervalRef = null;
    }
  }

  private shuffleArray<T>(arr: T[]): T[] {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  getLetterButtonClass(lane: Lane, letter: string): string {
    if (lane.finished) return 'finished';
    if (letter === lane.correctLetter) return 'correct';
    return 'incorrect';
  }

  isFingerExpected(hand: HandSide, finger: FingerName): boolean {
    // Check if any unfinished lane's correct letter needs this finger
    for (const lane of this.lanes) {
      if (!lane.finished && isFingerExpectedForKey(lane.correctLetter, hand, finger)) {
        return true;
      }
    }
    return false;
  }
}
