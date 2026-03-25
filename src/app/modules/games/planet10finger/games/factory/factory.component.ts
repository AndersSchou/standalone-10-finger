import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { VKeyboardComponent } from 'src/app/vkeyboard/vkeyboard.component';
import {
  FingerName,
  HandSide,
  isFingerExpectedForKey,
} from '../shared/finger-indicator.util';

const GOAL = 5;

/**
 * Factory minigame.
 * A sentence is displayed; the player types it exactly to earn a point.
 * First to 5 points wins.
 */
@Component({
  selector: 'app-planet10finger-factory',
  templateUrl: './factory.component.html',
  styleUrl: './factory.component.scss',
  standalone: true,
  imports: [CommonModule, VKeyboardComponent],
})
export class FactoryComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(VKeyboardComponent) vkeyboard?: VKeyboardComponent;
  @Output() gameClose = new EventEmitter<void>();

  sentences: string[] = [];
  currentSentence = '';
  typed = '';
  score = 0;
  goal = GOAL;
  gameOver = false;
  showError = false;
  /** Per-character state for the current sentence. */
  get chars(): { char: string; state: 'pending' | 'correct' | 'error' }[] {
    return this.currentSentence.split('').map((char, i) => {
      if (i > this.typed.length) return { char, state: 'pending' };
      if (i === this.typed.length) return { char, state: this.showError ? 'error' : 'pending' };
      return { char, state: this.typed[i] === char ? 'correct' : 'error' };
    });
  }

  /** Characters grouped into words (splitting on spaces), preserving global index. */
  get words(): { char: string; state: 'pending' | 'correct' | 'error'; index: number }[][] {
    const all = this.chars.map((c, i) => ({ ...c, index: i }));
    const groups: { char: string; state: 'pending' | 'correct' | 'error'; index: number }[][] = [];
    let current: typeof all = [];
    for (const c of all) {
      if (c.char === ' ') {
        if (current.length) groups.push(current);
        groups.push([{ ...c }]); // space as its own group
        current = [];
      } else {
        current.push(c);
      }
    }
    if (current.length) groups.push(current);
    return groups;
  }

  private usedIndices = new Set<number>();
  private keydownListener: ((e: KeyboardEvent) => void) | null = null;

  constructor(private readonly http: HttpClient) {}

  ngAfterViewInit(): void {
    this.vkeyboard?.setTheme('color-group');
    this.vkeyboard?.setMode('partial');
  }

  ngOnInit(): void {
    this.http
      .get<{ sentences: string[] }>('assets/games/factory-sentences.json')
      .subscribe((data) => {
        this.sentences = data.sentences;
        this.nextSentence();
        this.attachKeyListener();
      });
  }

  restartGame(): void {
    this.score = 0;
    this.typed = '';
    this.gameOver = false;
    this.showError = false;
    this.usedIndices.clear();
    this.nextSentence();
    this.attachKeyListener();
  }

  close(): void {
    this.gameClose.emit();
  }

  isFingerExpected(hand: HandSide, finger: FingerName): boolean {
    const expected = this.currentSentence[this.typed.length];
    return isFingerExpectedForKey(expected, hand, finger);
  }

  // ── Helpers ──────────────────────────────────────────────

  private nextSentence(): void {
    this.typed = '';
    this.showError = false;
    if (this.usedIndices.size >= this.sentences.length) {
      this.usedIndices.clear();
    }
    let idx: number;
    do {
      idx = Math.floor(Math.random() * this.sentences.length);
    } while (this.usedIndices.has(idx));
    this.usedIndices.add(idx);
    this.currentSentence = this.sentences[idx];
  }

  private attachKeyListener(): void {
    this.detachKeyListener();
    const readyAt = Date.now() + 400;
    this.keydownListener = (e: KeyboardEvent) => {
      if (Date.now() < readyAt) return;
      if (this.gameOver) return;
      if (e.key === 'Backspace') {
        this.typed = this.typed.slice(0, -1);
        return;
      }
      if (e.key.length !== 1) return;

      const expected = this.currentSentence[this.typed.length];
      if (e.key !== expected) {
        // Wrong key — flash red without appending
        this.showError = true;
        setTimeout(() => { this.showError = false; }, 400);
        return;
      }

      this.typed += e.key;

      if (this.typed === this.currentSentence) {
        this.score++;
        if (this.score >= this.goal) {
          this.gameOver = true;
          this.detachKeyListener();
        } else {
          setTimeout(() => this.nextSentence(), 400);
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

  ngOnDestroy(): void {
    this.detachKeyListener();
  }
}
