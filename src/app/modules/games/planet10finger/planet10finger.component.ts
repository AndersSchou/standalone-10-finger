import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { PowerComponent } from './games/power/power.component';
import { OxygenComponent } from './games/oxygen/oxygen.component';
import { MeteorComponent } from './games/meteor/meteor.component';
import { FactoryComponent } from './games/factory/factory.component';
import { AssemblingComponent } from './games/assembling/assembling.component';
import { HeadquartersComponent } from './games/headquarters/headquarters.component';
import { VKeyboardComponent } from 'src/app/vkeyboard/vkeyboard.component';

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
    FormsModule,
    MatIcon,
    PowerComponent,
    OxygenComponent,
    MeteorComponent,
    FactoryComponent,
    AssemblingComponent,
    HeadquartersComponent,
    VKeyboardComponent,
  ],
})
export class Planet10fingerComponent implements OnInit, OnDestroy {
  @ViewChild(VKeyboardComponent) fjKeyboard?: VKeyboardComponent;

  activePopup: string | null = null;
  /** True once the player has held F+J for 1 second. */
  gameReady = false;
  /** Hold progress 0–100 for the progress bar. */
  holdProgress = 0;
  /** Show welcome popup on first visit. */
  showWelcome = false;
  /** Planet name input during welcome. */
  planetNameInput = '';
  /** Stored planet name to display on main screen. */
  planetName = '';
  /** Show game intro popup. */
  showGameIntro = false;
  /** Whether "do not show again" is checked for current game intro. */
  doNotShowAgainChecked = false;

  private readonly WELCOME_KEY = 'planet10finger_welcome_seen';
  private readonly PLANET_NAME_KEY = 'planet10finger_name';
  private heldKeys = new Set<string>();
  private holdInterval: ReturnType<typeof setInterval> | null = null;
  private keydownListener: ((e: KeyboardEvent) => void) | null = null;
  private keyupListener:   ((e: KeyboardEvent) => void) | null = null;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    const hasSeenWelcome = localStorage.getItem(this.WELCOME_KEY);
    const storedPlanetName = localStorage.getItem(this.PLANET_NAME_KEY);
    if (storedPlanetName) {
      this.planetName = storedPlanetName;
    }
    if (!hasSeenWelcome) {
      this.showWelcome = true;
    }
  }

  dismissWelcome(): void {
    if (this.planetNameInput.trim()) {
      localStorage.setItem(this.WELCOME_KEY, 'true');
      localStorage.setItem(this.PLANET_NAME_KEY, this.planetNameInput.trim());
      this.planetName = this.planetNameInput.trim();
      this.showWelcome = false;
    }
  }

  reopenWelcome(): void {
    this.planetNameInput = this.planetName;
    this.showWelcome = true;
  }

  getGameIntroText(): string {
    switch (this.activePopup) {
      case 'power':
        return 'I dette spil skal du holde de viste knapper nede med de viste fingre for at generere strøm til din månebase';
      case 'oxygen':
        return 'I dette spil skal du trykke på de vidste knapper med de viste fingre, i den rigtige rækkefølge for at generere ilt til din månebase!';
      case 'meteor':
        return 'I dette spil skal du skrive ordet inde i meteoerne for at skyde dem i stykker og få point';
      case 'factory':
        return 'I dette spil skal du skrive ord med 10 finger metoden. tag dig tid og brug den rigtige metode';
      case 'assembling':
        return 'I dette spil skal du skrive korte tekster med 10 finger metoden. Fokuser på at skrive korrekt frem for hurtigt';
      default:
        return '';
    }
  }

  continueFromIntro(): void {
    if (this.doNotShowAgainChecked && this.activePopup) {
      const key = `game_intro_${this.activePopup}_hidden`;
      localStorage.setItem(key, 'true');
    }
    this.showGameIntro = false;
    this.doNotShowAgainChecked = false;
    this.attachHoldListeners();
    setTimeout(() => {
      this.fjKeyboard?.setTheme('color-group');
      this.fjKeyboard?.setMode('partial');
    });
  }

  reopenGameIntro(): void {
    if (!this.activePopup) return;
    
    // Remove the "do not show again" flag so popup appears next time game is opened
    const introHiddenKey = `game_intro_${this.activePopup}_hidden`;
    localStorage.removeItem(introHiddenKey);
    
    // Show the popup immediately
    this.showGameIntro = true;
    this.doNotShowAgainChecked = false;
  }

  openPopup(game: string): void {
    this.activePopup = game;
    this.gameReady = false;
    this.holdProgress = 0;
    this.heldKeys.clear();
    this.doNotShowAgainChecked = false;
    
    // Check if intro for this game has been hidden
    const introHiddenKey = `game_intro_${game}_hidden`;
    const isIntroHidden = localStorage.getItem(introHiddenKey) === 'true';
    
    if (!isIntroHidden && game !== 'headquarters') {
      this.showGameIntro = true;
    } else {
      this.attachHoldListeners();
      setTimeout(() => {
        this.fjKeyboard?.setTheme('color-group');
        this.fjKeyboard?.setMode('partial');
      });
    }
  }

  closePopup(): void {
    this.activePopup = null;
    this.gameReady = false;
    this.holdProgress = 0;
    this.showGameIntro = false;
    this.doNotShowAgainChecked = false;
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
