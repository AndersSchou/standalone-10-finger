import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface OxygenSequence {
  keys: string[];
}

interface OxygenTrainingSet {
  sequences: OxygenSequence[];
}

type KeyState = 'pending' | 'active' | 'done' | 'error';

/**
 * Oxygen Generation minigame.
 * Press 6 keys in the exact order defined by the training set.
 * Complete all 4 sequences (in order) to finish training.
 */
@Component({
  selector: 'app-planet10finger-oxygen',
  templateUrl: './oxygen.component.html',
  styleUrl: './oxygen.component.scss',
  standalone: true,
  imports: [CommonModule],
})
export class OxygenComponent implements OnDestroy {
  @Output() gameClose = new EventEmitter<void>();
  /** 0-based index of the training set to play (0–4). */
  @Input() trainingSetIndex = 0;

  trainingSets: OxygenTrainingSet[] = [];
  currentSequence: string[] = [];
  currentStep = 0;
  roundsCompleted = 0;
  trainingComplete = false;
  showError = false;

  private keydownListener: ((e: KeyboardEvent) => void) | null = null;

  constructor(private readonly http: HttpClient) {
    this.startGame();
  }

  // ── Template helpers ──────────────────────────────────────

  get totalSequences(): number {
    return this.trainingSets[this.trainingSetIndex]?.sequences.length ?? 6;
  }

  /** State for a key in the currently active sequence row. */
  getKeyState(index: number): KeyState {
    if (this.showError && index === this.currentStep) return 'error';
    if (index < this.currentStep) return 'done';
    if (index === this.currentStep) return 'active';
    return 'pending';
  }

  /** State for any key in any sequence row (used when showing all rows). */
  getKeyStateInRow(seqIndex: number, keyIndex: number): KeyState {
    if (seqIndex < this.roundsCompleted) return 'done';
    if (seqIndex > this.roundsCompleted) return 'pending';
    // active row — delegate to per-key state
    return this.getKeyState(keyIndex);
  }

  close(): void {
    this.gameClose.emit();
  }

  // ── Game lifecycle ────────────────────────────────────────

  private startGame(): void {
    this.roundsCompleted = 0;
    this.trainingComplete = false;
    this.http
      .get<{ trainingSets: OxygenTrainingSet[] }>('assets/games/oxygen-sequences.json')
      .subscribe((data) => {
        this.trainingSets = data.trainingSets;
        this.loadSequenceForRound(0);
        this.attachKeyListener();
      });
  }

  /** Load the sequence at the given index within the active training set. */
  private loadSequenceForRound(roundIndex: number): void {
    this.currentStep = 0;
    this.showError = false;
    const set = this.trainingSets[this.trainingSetIndex];
    this.currentSequence = set?.sequences[roundIndex]?.keys ?? [];
  }

  // ── Key listener ──────────────────────────────────────────

  private attachKeyListener(): void {
    this.keydownListener = (e: KeyboardEvent) => {
      if (this.trainingComplete || this.showError) return;

      const pressed = e.key.toUpperCase();
      const expected = this.currentSequence[this.currentStep]?.toUpperCase();

      if (pressed === expected) {
        this.currentStep++;
        if (this.currentStep >= this.currentSequence.length) {
          // Sequence complete — advance to the next one in order
          this.roundsCompleted++;
          this.currentStep = 0; // reset immediately so next row doesn't show as done
          const totalSequences =
            this.trainingSets[this.trainingSetIndex]?.sequences.length ?? 4;
          if (this.roundsCompleted >= totalSequences) {
            this.trainingComplete = true;
            this.detachKeyListener();
          } else {
            setTimeout(() => this.loadSequenceForRound(this.roundsCompleted), 800);
          }
        }
      } else if (e.key.length === 1) {
        // Wrong key — flash error and reset
        this.showError = true;
        setTimeout(() => {
          this.showError = false;
          this.currentStep = 0;
        }, 700);
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

  ngOnDestroy(): void {
    this.detachKeyListener();
  }
}
