import {
  AfterViewInit,
  Component,
  ElementRef,
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

interface Meteor {
  id: number;
  word: string;
  /** Vertical position in px from the top of the game area. */
  top: number;
  direction: 'ltr' | 'rtl';
  /** Time in seconds to cross the full screen. */
  duration: number;
  /** Set to false when the player hits it — triggers the burst animation. */
  visible: boolean;
  /** Timestamp when meteor was spawned. */
  spawnTime: number;
}

/**
 * Meteor Defense minigame.
 * Circles with short words fly left↔right across the screen.
 * Type a word correctly to destroy the meteor and earn 1 point.
 * After 15 seconds the game ends and the score is shown.
 */
@Component({
  selector: 'app-planet10finger-meteor',
  templateUrl: './meteor.component.html',
  styleUrl: './meteor.component.scss',
  standalone: true,
  imports: [CommonModule, VKeyboardComponent],
})
export class MeteorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(VKeyboardComponent) vkeyboard?: VKeyboardComponent;
  @ViewChild('gameAreaRef') gameAreaRef?: ElementRef<HTMLElement>;
  @Input() coinsEarned = 0;
  @Input() difficulty: 1 | 2 | 3 = 2;
  @Output() gameClose = new EventEmitter<void>();

  meteors: Meteor[] = [];
  score = 0;
  timeLeft = 15;
  gameOver = false;
  /** Word the player is currently building up by typing. */
  typedWord = '';

  private words: string[] = [];
  private nextId = 0;
  private spawnIntervalRef: ReturnType<typeof setInterval> | null = null;
  private timerIntervalRef: ReturnType<typeof setInterval> | null = null;
  private keydownListener: ((e: KeyboardEvent) => void) | null = null;
  private wordSpawnTime = 0;
  private fastWordUnlocked = false;

  private readonly meteorSizePx = 115;
  private readonly edgePaddingPx = 14;

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
    this.http
      .get<{ words: string[] }>('assets/games/meteor-words.json')
      .subscribe((data) => {
        this.words = data.words;
        this.startGame();
      });
  }

  // ── Public template helpers ──────────────────────────────

  /** Called by (animationend) on the meteor element — removes it after it flies off screen. */
  onMeteorAnimationEnd(meteor: Meteor): void {
    if (!meteor.visible) return; // already removed by a hit
    this.meteors = this.meteors.filter((m) => m.id !== meteor.id);
  }

  restartGame(): void {
    this.clearIntervals();
    this.startGame();
  }

  close(): void {
    this.gameClose.emit();
  }

  // ── Game lifecycle ────────────────────────────────────────

  private startGame(): void {
    this.score = 0;
    // Set time based on difficulty: 1=20s, 2=15s, 3=10s
    this.timeLeft = this.difficulty === 1 ? 20 : this.difficulty === 3 ? 10 : 15;
    this.gameOver = false;
    this.typedWord = '';
    this.meteors = [];
    this.nextId = 0;

    // Spawn one meteor right away, then every 1.5 s
    this.spawnMeteor();
    this.spawnIntervalRef = setInterval(() => this.spawnMeteor(), 1500);

    // Countdown (ticks every second)
    this.timerIntervalRef = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);

    this.attachKeyListener();
  }

  private spawnMeteor(): void {
    if (this.gameOver || this.words.length === 0) return;

    const word = this.words[Math.floor(Math.random() * this.words.length)];
    const top = this.getRandomSafeTop();
    const direction: 'ltr' | 'rtl' = Math.random() > 0.5 ? 'ltr' : 'rtl';
    const duration = 5; // seconds to cross the full screen

    this.meteors.push({
      id: this.nextId++,
      word,
      top,
      direction,
      duration,
      visible: true,
      spawnTime: Date.now(),
    });
  }

  /** Pick a top position where the full meteor remains visible and away from HUD/keyboard areas. */
  private getRandomSafeTop(): number {
    const areaHeight = this.gameAreaRef?.nativeElement.clientHeight ?? 320;
    const minTop = this.edgePaddingPx;
    const upperHalfHeight = areaHeight / 2;
    const maxTop = upperHalfHeight - this.meteorSizePx - this.edgePaddingPx;

    if (maxTop <= minTop) {
      return minTop;
    }

    return minTop + Math.random() * (maxTop - minTop);
  }

  private attachKeyListener(): void {
    const readyAt = Date.now() + 400;
    this.keydownListener = (e: KeyboardEvent) => {
      if (Date.now() < readyAt) return;
      if (this.gameOver) return;

      if (e.key === 'Backspace') {
        this.typedWord = this.typedWord.slice(0, -1);
        return;
      }

      // Ignore non-printable keys
      if (e.key.length !== 1) return;

      this.typedWord += e.key;

      // Exact match → destroy meteor
      const hit = this.meteors.find(
        (m) => m.visible && m.word.toLowerCase() === this.typedWord.toLowerCase()
      );
      if (hit) {
        hit.visible = false;
        this.score++;
        
        // Check for fast word achievement (typed within 3 seconds of spawn)
        const timeSinceSpawn = (Date.now() - hit.spawnTime) / 1000;
        if (timeSinceSpawn <= 3 && !this.fastWordUnlocked) {
          this.achievementService.unlockAchievement(`meteor_lvl${this.difficulty}_fast_word`);
          this.fastWordUnlocked = true;
        }

        // Check for 5 points achievement
        if (this.score >= 5) {
          this.achievementService.unlockAchievement(`meteor_lvl${this.difficulty}_5points`);
        }

        this.typedWord = '';
        // Remove from array after the burst animation (0.4 s)
        setTimeout(() => {
          this.meteors = this.meteors.filter((m) => m.id !== hit.id);
        }, 400);
        return;
      }

      // No meteor word starts with the typed prefix → reset to last char
      const partialMatch = this.meteors.some(
        (m) => m.visible && m.word.toLowerCase().startsWith(this.typedWord.toLowerCase())
      );
      if (!partialMatch) {
        this.typedWord = e.key;
      }
    };

    document.addEventListener('keydown', this.keydownListener);
  }

  private endGame(): void {
    this.gameOver = true;
    this.clearIntervals();
    // Record game completion with score
    this.statsService.recordGameCompletion('meteor', { score: this.score, difficulty: this.difficulty });
    this.achievementService.unlockAchievement(`meteor_lvl${this.difficulty}_complete`);
    if (this.keydownListener) {
      document.removeEventListener('keydown', this.keydownListener);
      this.keydownListener = null;
    }
  }

  private clearIntervals(): void {
    if (this.spawnIntervalRef) { clearInterval(this.spawnIntervalRef); this.spawnIntervalRef = null; }
    if (this.timerIntervalRef) { clearInterval(this.timerIntervalRef); this.timerIntervalRef = null; }
  }

  ngOnDestroy(): void {
    this.clearIntervals();
    if (this.keydownListener) {
      document.removeEventListener('keydown', this.keydownListener);
    }
  }
}

