import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { VKeyboardComponent } from 'src/app/vkeyboard/vkeyboard.component';
import { AchievementService } from '../../services/achievement.service';
import { StatsService } from '../../services/stats.service';
import {
  FingerName,
  HandSide,
  isFingerExpectedForKey,
} from '../shared/finger-indicator.util';


const GOAL = 3;

/**
 * Assembling minigame.
 * A short story is displayed as flowing text; the player types it in the field below.
 * First to 3 completed stories wins.
 */
@Component({
  selector: 'app-planet10finger-assembling',
  templateUrl: './assembling.component.html',
  styleUrl: './assembling.component.scss',
  standalone: true,
  imports: [CommonModule, VKeyboardComponent],
})
export class AssemblingComponent implements OnInit, AfterViewInit {
  @ViewChild('typingArea') typingAreaRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild(VKeyboardComponent) vkeyboard?: VKeyboardComponent;
  @Input() coinsEarned = 0;
  @Input() difficulty: 1 | 2 | 3 = 2;
  @Output() gameClose = new EventEmitter<void>();
  @Output() gameRestart = new EventEmitter<void>();

  stories: string[] = [];
  currentStory = '';
  typed = '';
  score = 0;
  goal: number;
  gameOver = false;
  showError = false;
  typoCount = 0;
  gameStartTime = 0;
  totalWordsTyped = 0;

  /** Each character with its current display state. */
  get chars(): { char: string; state: 'pending' | 'correct' | 'current' }[] {
    return this.currentStory.split('').map((char, i) => {
      if (i < this.typed.length) return { char, state: 'correct' };
      if (i === this.typed.length) return { char, state: 'current' };
      return { char, state: 'pending' };
    });
  }

  private usedIndices = new Set<number>();

  constructor(
    private readonly http: HttpClient,
    private readonly achievementService: AchievementService,
    private readonly statsService: StatsService
  ) {
    // Set goal based on difficulty: 1=2 stories, 2=3 (default), 3=4 stories
    this.goal = this.difficulty === 1 ? 2 : this.difficulty === 3 ? 4 : 3;
  }

  ngOnInit(): void {
    this.gameStartTime = Date.now();
    this.typoCount = 0;
    this.totalWordsTyped = 0;
    this.http
      .get<{ stories: string[] }>('assets/games/assembling-stories.json')
      .subscribe((data) => {
        this.stories = data.stories;
        this.nextStory();
      });
  }

  ngAfterViewInit(): void {
    this.vkeyboard?.setTheme('color-group');
    this.vkeyboard?.setMode('partial');
    this.focusField();
  }

  onInput(event: Event): void {
    if (this.gameOver) return;
    const textarea = event.target as HTMLTextAreaElement;
    const value = textarea.value;

    // Allow backspace (value shorter than typed)
    if (value.length <= this.typed.length) {
      this.typed = value;
      return;
    }

    const newChar = value[value.length - 1];
    const expected = this.currentStory[this.typed.length];

    if (newChar !== expected) {
      // Reject the wrong character — reset textarea to last good state
      this.typoCount++;
      textarea.value = this.typed;
      this.showError = true;
      setTimeout(() => { this.showError = false; }, 400);
      return;
    }

    this.typed = value;

    if (this.typed === this.currentStory) {
      this.score++;
      // Count words in completed story
      this.totalWordsTyped += this.currentStory.split(/\s+/).filter(w => w.length > 0).length;
      if (this.score >= this.goal) {
        this.gameOver = true;
        // Calculate WPM and accuracy
        const elapsedSeconds = (Date.now() - this.gameStartTime) / 1000;
        const wpm = (this.totalWordsTyped / elapsedSeconds) * 60;
        const correctTyped = this.totalWordsTyped - this.typoCount;
        // Record game completion
        this.statsService.recordGameCompletion('assembling', { 
          score: this.score,
          wpm,
          correctTyped,
          totalTyped: this.totalWordsTyped,
          elapsedSeconds,
          isPerfect: this.typoCount === 0,
          difficulty: this.difficulty
        });
        // Unlock achievements
        this.achievementService.unlockAchievement(`assembling_lvl${this.difficulty}_complete`);
        if (wpm > 20) {
          this.achievementService.unlockAchievement(`assembling_lvl${this.difficulty}_wpm`);
        }
        if (this.typoCount === 0) {
          this.achievementService.unlockAchievement(`assembling_lvl${this.difficulty}_perfect`);
        }
      } else {
        setTimeout(() => {
          this.nextStory();
          this.focusField();
        }, 500);
      }
    }
  }

  restartGame(): void {
    this.score = 0;
    this.typed = '';
    this.gameOver = false;
    this.showError = false;
    this.typoCount = 0;
    this.totalWordsTyped = 0;
    this.gameStartTime = Date.now();
    this.usedIndices.clear();
    this.nextStory();
    setTimeout(() => this.focusField());
    this.gameRestart.emit();
  }

  close(): void {
    this.gameClose.emit();
  }

  isFingerExpected(hand: HandSide, finger: FingerName): boolean {
    const expected = this.currentStory[this.typed.length];
    return isFingerExpectedForKey(expected, hand, finger);
  }

  private nextStory(): void {
    this.typed = '';
    this.showError = false;
    if (this.typingAreaRef) {
      this.typingAreaRef.nativeElement.value = '';
    }
    if (this.usedIndices.size >= this.stories.length) {
      this.usedIndices.clear();
    }
    let idx: number;
    do {
      idx = Math.floor(Math.random() * this.stories.length);
    } while (this.usedIndices.has(idx));
    this.usedIndices.add(idx);
    this.currentStory = this.stories[idx];
  }

  private focusField(): void {
    this.typingAreaRef?.nativeElement.focus();
  }

}
