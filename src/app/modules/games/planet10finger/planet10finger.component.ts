import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { PowerComponent } from './games/power/power.component';
import { OxygenComponent } from './games/oxygen/oxygen.component';
import { MeteorComponent } from './games/meteor/meteor.component';
import { FactoryComponent } from './games/factory/factory.component';
import { AssemblingComponent } from './games/assembling/assembling.component';

/**
 * Hub component for the Planet 10 finger game.
 * Renders the game grid and manages which game popup is open.
 */
@Component({
  selector: 'app-planet10finger',
  templateUrl: './planet10finger.component.html',
  styleUrls: ['./planet10finger.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    PowerComponent,
    OxygenComponent,
    MeteorComponent,
    FactoryComponent,
    AssemblingComponent,
  ],
})
export class Planet10fingerComponent implements OnDestroy {
  activePopup: string | null = null;
  /** True once the player has held F+J for 1 second. */
  gameReady = false;
  /** Hold progress 0–100 for the progress bar. */
  holdProgress = 0;

  private heldKeys = new Set<string>();
  private holdInterval: ReturnType<typeof setInterval> | null = null;
  private keydownListener: ((e: KeyboardEvent) => void) | null = null;
  private keyupListener:   ((e: KeyboardEvent) => void) | null = null;

  constructor(private readonly router: Router) {}

  openPopup(game: string): void {
    this.activePopup = game;
    this.gameReady = false;
    this.holdProgress = 0;
    this.heldKeys.clear();
    this.attachHoldListeners();
  }

  closePopup(): void {
    this.activePopup = null;
    this.gameReady = false;
    this.holdProgress = 0;
    this.removeHoldListeners();
  }

  navigateToGame(game: string): void {
    this.router.navigate(['/games/planet10finger/' + game]);
  }

  ngOnDestroy(): void {
    this.removeHoldListeners();
  }

  // ── F+J hold gate ──────────────────────────────────────────────────────

  private attachHoldListeners(): void {
    this.keydownListener = (e: KeyboardEvent) => {
      this.heldKeys.add(e.key.toUpperCase());
      if (this.heldKeys.has('F') && this.heldKeys.has('J') && !this.holdInterval) {
        this.holdInterval = setInterval(() => {
          this.holdProgress += 10; // 10 steps × 100 ms = 1 second
          if (this.holdProgress >= 100) {
            this.removeHoldListeners();
            setTimeout(() => { this.gameReady = true; }, 500);
          }
        }, 100);
      }
    };

    this.keyupListener = (e: KeyboardEvent) => {
      this.heldKeys.delete(e.key.toUpperCase());
      if (!this.heldKeys.has('F') || !this.heldKeys.has('J')) {
        this.clearHoldInterval();
        this.holdProgress = 0;
      }
    };

    document.addEventListener('keydown', this.keydownListener);
    document.addEventListener('keyup',   this.keyupListener);
  }

  private removeHoldListeners(): void {
    this.clearHoldInterval();
    if (this.keydownListener) { document.removeEventListener('keydown', this.keydownListener); this.keydownListener = null; }
    if (this.keyupListener)   { document.removeEventListener('keyup',   this.keyupListener);   this.keyupListener   = null; }
    this.heldKeys.clear();
  }

  private clearHoldInterval(): void {
    if (this.holdInterval) { clearInterval(this.holdInterval); this.holdInterval = null; }
  }
}
