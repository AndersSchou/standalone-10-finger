import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';


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
  imports: [CommonModule],
})
export class AssemblingComponent implements OnInit, AfterViewInit {
  @ViewChild('typingArea') typingAreaRef!: ElementRef<HTMLTextAreaElement>;
  @Output() gameClose = new EventEmitter<void>();

  stories: string[] = [];
  currentStory = '';
  typed = '';
  score = 0;
  goal = GOAL;
  gameOver = false;
  showError = false;

  /** Each character with its current display state. */
  get chars(): { char: string; state: 'pending' | 'correct' | 'current' }[] {
    return this.currentStory.split('').map((char, i) => {
      if (i < this.typed.length) return { char, state: 'correct' };
      if (i === this.typed.length) return { char, state: 'current' };
      return { char, state: 'pending' };
    });
  }

  private usedIndices = new Set<number>();

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<{ stories: string[] }>('assets/games/assembling-stories.json')
      .subscribe((data) => {
        this.stories = data.stories;
        this.nextStory();
      });
  }

  ngAfterViewInit(): void {
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
      textarea.value = this.typed;
      this.showError = true;
      setTimeout(() => { this.showError = false; }, 400);
      return;
    }

    this.typed = value;

    if (this.typed === this.currentStory) {
      this.score++;
      if (this.score >= this.goal) {
        this.gameOver = true;
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
    this.usedIndices.clear();
    this.nextStory();
    setTimeout(() => this.focusField());
  }

  close(): void {
    this.gameClose.emit();
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
