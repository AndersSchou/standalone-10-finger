import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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
  imports: [CommonModule],
})
export class PowerComponent implements OnDestroy {
  /** Emitted when the user closes the training-complete screen. */
  @Output() gameClose = new EventEmitter<void>();

  powerRounds: PowerRound[] = [];
  allPairs: string[][] = [];
  currentPairIndex = 0;
  heldKeys = new Set<string>();
  holdProgress = 0;
  holdDuration = 2;
  roundsCompleted = 0;
  roundSuccess = false;
  trainingComplete = false;

  private holdInterval: ReturnType<typeof setInterval> | null = null;
  private holdStart: number | null = null;
  private keydownListener: ((e: KeyboardEvent) => void) | null = null;
  private keyupListener: ((e: KeyboardEvent) => void) | null = null;

  constructor(private readonly http: HttpClient) {
    this.startPowerGame();
  }

  // ── Public helpers for template ───────────────────────────

  get currentKeys(): string[] {
    return this.allPairs[this.currentPairIndex] ?? [];
  }

  isPairDone(pairIdx: number): boolean {
    return pairIdx < this.currentPairIndex;
  }

  isPairActive(pairIdx: number): boolean {
    return pairIdx === this.currentPairIndex;
  }

  isKeyHeld(key: string): boolean {
    return this.heldKeys.has(key.toUpperCase());
  }

  close(): void {
    this.gameClose.emit();
  }

  // ── Game lifecycle ────────────────────────────────────────

  private startPowerGame(): void {
    this.roundsCompleted = 0;
    this.trainingComplete = false;
    this.http
      .get<{ rounds: PowerRound[] }>('assets/games/power-generation.json')
      .subscribe((data) => {
        this.powerRounds = data.rounds;
        this.pickNewRound();
        this.attachKeyListeners();
      });
  }

  private pickNewRound(): void {
    this.clearHoldTimer();
    this.heldKeys = new Set();
    this.holdProgress = 0;
    this.roundSuccess = false;
    this.currentPairIndex = 0;
    const idx = Math.floor(Math.random() * this.powerRounds.length);
    this.allPairs = this.powerRounds[idx].pairs;
    this.holdDuration = this.powerRounds[idx].holdDuration;
  }

  private get allKeysHeld(): boolean {
    return this.currentKeys.every((k) => this.heldKeys.has(k.toUpperCase()));
  }

  // ── Key listeners ─────────────────────────────────────────

  private attachKeyListeners(): void {
    this.keydownListener = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (this.currentKeys.includes(key) && !this.heldKeys.has(key)) {
        const next = new Set(this.heldKeys);
        next.add(key);
        this.heldKeys = next;
        if (this.allKeysHeld) {
          this.startHoldTimer();
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
        if (this.currentPairIndex < this.allPairs.length - 1) {
          this.currentPairIndex++;
        } else {
          this.roundsCompleted++;
          this.roundSuccess = true;
          if (this.roundsCompleted >= 5) {
            this.trainingComplete = true;
            this.detachKeyListeners();
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

  ngOnDestroy(): void {
    this.clearHoldTimer();
    this.detachKeyListeners();
  }
}
