import { Component, AfterViewInit, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { VKeyboardComponent } from 'src/app/vkeyboard/vkeyboard.component';
import { AchievementService } from '../../services/achievement.service';
import { StatsService } from '../../services/stats.service';
import {
  FingerName,
  HandSide,
  isFingerExpectedForAnyKey,
} from '../shared/finger-indicator.util';

interface PowerRound {
  pairs: string[][]; // 4 pairs of 2 keys each
  holdDuration: number; // seconds per pair
}

/**
 * Power Generation minigame component.
 * Player holds key pairs sequentially to generate power.
 */
@Component({
  selector: 'app-planet10finger-power',
  templateUrl: './power.component.html',
  styleUrls: ['./power.component.scss'],
  standalone: true,
  imports: [CommonModule, VKeyboardComponent],
})
export class PowerComponent implements AfterViewInit, OnDestroy {
  @ViewChild(VKeyboardComponent) vkeyboard?: VKeyboardComponent;
  @Input() coinsEarned = 0;
  @Input() difficulty: 1 | 2 | 3 = 2;
  /** Emitted when the user closes the training-complete screen. */
  @Output() gameClose = new EventEmitter<void>();

  powerRounds: PowerRound[] = [];
  allPairs: string[][] = [];
  currentPairIndex = 0;
  heldKeys = new Set<string>();
  holdProgress = 0;
  holdDuration = 2;
  roundsCompleted = 0;
  totalRounds = 6;
  roundSuccess = false;
  trainingComplete = false;
  wrongPressCount = 0;
  isCountingWrong = true;

  private holdInterval: ReturnType<typeof setInterval> | null = null;
  private holdStart: number | null = null;
  private cooldownTimer: ReturnType<typeof setTimeout> | null = null;
  private keydownListener: ((e: KeyboardEvent) => void) | null = null;
  private keyupListener: ((e: KeyboardEvent) => void) | null = null;
  private remainingRoundIndices: number[] = [];

  constructor(
    private readonly http: HttpClient,
    private readonly achievementService: AchievementService,
    private readonly statsService: StatsService
  ) {
    this.startPowerGame();
  }

  ngAfterViewInit(): void {
    this.vkeyboard?.setTheme('color-group');
    this.vkeyboard?.setMode('partial');
  }

  // ── Public helpers for template ───────────────────────────

  get currentKeys(): string[] {
    return this.allPairs[this.currentPairIndex] ?? [];
  }

  isPairDone(pairIdx: number): boolean {
    return pairIdx < this.currentPairIndex ||
      (this.roundSuccess && pairIdx === this.currentPairIndex);
  }

  isPairActive(pairIdx: number): boolean {
    return !this.roundSuccess && pairIdx === this.currentPairIndex;
  }

  isKeyHeld(key: string): boolean {
    return this.heldKeys.has(key.toUpperCase());
  }

  isFingerExpected(hand: HandSide, finger: FingerName): boolean {
    if (this.roundSuccess) return false;
    return isFingerExpectedForAnyKey(this.currentKeys, hand, finger);
  }

  close(): void {
    this.gameClose.emit();
  }

  // ── Game lifecycle ────────────────────────────────────────

  private startPowerGame(): void {
    this.roundsCompleted = 0;
    this.trainingComplete = false;
    this.wrongPressCount = 0;
    
    // Set total rounds based on difficulty
    // Difficulty 1: 3 rounds, Difficulty 2: 6 rounds, Difficulty 3: 9 rounds
    this.totalRounds = this.difficulty === 1 ? 3 : this.difficulty === 3 ? 9 : 6;
    
    this.http
      .get<{ rounds: PowerRound[] }>('assets/games/power-generation.json')
      .subscribe((data) => {
        this.powerRounds = data.rounds;
        this.totalRounds = Math.min(this.totalRounds, this.powerRounds.length);
        this.remainingRoundIndices = this.getRandomRoundOrder().slice(
          0,
          this.totalRounds
        );
        this.pickNewRound();
        this.attachKeyListeners();
      });
  }

  private pickNewRound(): void {
    this.clearHoldTimer();
    this.clearCooldownTimer();
    this.heldKeys = new Set();
    this.holdProgress = 0;
    this.roundSuccess = false;
    this.currentPairIndex = 0;
    this.isCountingWrong = true;

    if (this.remainingRoundIndices.length === 0) {
      this.trainingComplete = true;
      this.detachKeyListeners();
      return;
    }

    const idx = this.remainingRoundIndices.shift() ?? 0;
    this.allPairs = this.powerRounds[idx].pairs;
    this.holdDuration = this.powerRounds[idx].holdDuration;
  }

  /** Fisher-Yates shuffle for a random, non-repeating round order. */
  private getRandomRoundOrder(): number[] {
    const indices = this.powerRounds.map((_, idx) => idx);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }

  private get allKeysHeld(): boolean {
    return this.currentKeys.every((k) => this.heldKeys.has(k.toUpperCase()));
  }

  // ── Key listeners ─────────────────────────────────────────

  private attachKeyListeners(): void {
    const readyAt = Date.now() + 400;
    this.keydownListener = (e: KeyboardEvent) => {
      if (Date.now() < readyAt) return;
      const key = e.key.toUpperCase();
      if (this.currentKeys.includes(key) && !this.heldKeys.has(key)) {
        const next = new Set(this.heldKeys);
        next.add(key);
        this.heldKeys = next;
        if (this.allKeysHeld) {
          this.startHoldTimer();
        }
      } else if (!this.currentKeys.includes(key) && this.currentKeys.length > 0) {
        // Wrong key pressed (only count if not in cooldown period)
        if (this.isCountingWrong) {
          this.wrongPressCount++;
        }
      }
    };
    this.keyupListener = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (this.heldKeys.has(key)) {
        const next = new Set(this.heldKeys);
        next.delete(key);
        this.heldKeys = next;
        this.clearHoldTimer();
        this.holdProgress = 0;
      }
    };
    document.addEventListener('keydown', this.keydownListener);
    document.addEventListener('keyup', this.keyupListener);
  }

  private detachKeyListeners(): void {
    if (this.keydownListener)
      document.removeEventListener('keydown', this.keydownListener);
    if (this.keyupListener)
      document.removeEventListener('keyup', this.keyupListener);
    this.keydownListener = null;
    this.keyupListener = null;
  }

  // ── Hold timer ────────────────────────────────────────────

  private startHoldTimer(): void {
    this.holdStart = Date.now();
    const totalMs = this.holdDuration * 1000;
    this.holdInterval = setInterval(() => {
      const elapsed = Date.now() - (this.holdStart ?? Date.now());
      this.holdProgress = Math.min((elapsed / totalMs) * 100, 100);
      if (this.holdProgress >= 100) {
        this.clearHoldTimer();
        this.heldKeys = new Set();
        this.holdProgress = 0;
        // Start cooldown period where wrong presses don't count
        this.startCooldownPeriod();
        if (this.currentPairIndex < this.allPairs.length - 1) {
          this.currentPairIndex++;
        } else {
          this.roundsCompleted++;
          this.roundSuccess = true;
          if (this.roundsCompleted >= this.totalRounds) {
            this.trainingComplete = true;
            this.detachKeyListeners();
            // Record game completion
            this.statsService.recordGameCompletion('power', { 
              isPerfect: this.wrongPressCount === 0,
              difficulty: this.difficulty
            });
            // Unlock achievements
            this.achievementService.unlockAchievement(`power_lvl${this.difficulty}_complete`);
            if (this.wrongPressCount === 0) {
              this.achievementService.unlockAchievement(`power_lvl${this.difficulty}_perfect`);
            }
          } else {
            setTimeout(() => this.pickNewRound(), 900);
          }
        }
      }
    }, 50);
  }

  private clearHoldTimer(): void {
    if (this.holdInterval !== null) {
      clearInterval(this.holdInterval);
      this.holdInterval = null;
    }
    this.holdStart = null;
  }

  private startCooldownPeriod(): void {
    this.isCountingWrong = false;
    if (this.cooldownTimer) {
      clearTimeout(this.cooldownTimer);
    }
    this.cooldownTimer = setTimeout(() => {
      this.isCountingWrong = true;
      this.cooldownTimer = null;
    }, 1000); // 1 second cooldown
  }

  private clearCooldownTimer(): void {
    if (this.cooldownTimer) {
      clearTimeout(this.cooldownTimer);
      this.cooldownTimer = null;
    }
  }

  ngOnDestroy(): void {
    this.clearHoldTimer();
    this.clearCooldownTimer();
    this.detachKeyListeners();
  }
}
