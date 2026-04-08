import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PowerComponent } from './games/power/power.component';
import { OxygenComponent } from './games/oxygen/oxygen.component';
import { MeteorComponent } from './games/meteor/meteor.component';
import { FactoryComponent } from './games/factory/factory.component';
import { AssemblingComponent } from './games/assembling/assembling.component';
import { HeadquartersComponent } from './games/headquarters/headquarters.component';
import { VKeyboardComponent } from 'src/app/vkeyboard/vkeyboard.component';
import { BuildingCustomizationService } from './services/building-customization.service';
import { PowerBuildingComponent } from 'src/app/shared/svgs/power-building.component';
import { OxygenBuildingComponent } from 'src/app/shared/svgs/oxygen-building.component';
import { MeteorBuildingComponent } from 'src/app/shared/svgs/meteor-building.component';
import { FactoryBuildingComponent } from 'src/app/shared/svgs/factory-building.component';
import { AssemblingBuildingComponent } from 'src/app/shared/svgs/assembling-building.component';

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
    PowerComponent,
    OxygenComponent,
    MeteorComponent,
    FactoryComponent,
    AssemblingComponent,
    HeadquartersComponent,
    VKeyboardComponent,
    PowerBuildingComponent,
    OxygenBuildingComponent,
    MeteorBuildingComponent,
    FactoryBuildingComponent,
    AssemblingBuildingComponent,
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
  /** Coin count. */
  coins = 0;
  /** Coins to be awarded in current game. */
  coinsEarned = 0;
  /** Show planet name edit dialog. */
  editingPlanetName = false;
  /** Planet name input while editing. */
  editingPlanetInput = '';
  /** Error message for planet name edit. */
  planetNameEditError = '';
  /** Building customization state */
  buildingCustomization: any = {};

  private readonly WELCOME_KEY = 'planet10finger_welcome_seen';
  private readonly PLANET_NAME_KEY = 'planet10finger_name';
  private readonly COINS_KEY = 'planet10finger_coins';
  private heldKeys = new Set<string>();
  private holdInterval: ReturnType<typeof setInterval> | null = null;
  private keydownListener: ((e: KeyboardEvent) => void) | null = null;
  private keyupListener:   ((e: KeyboardEvent) => void) | null = null;

  constructor(
    private readonly router: Router,
    private readonly buildingCustomizationService: BuildingCustomizationService
  ) {}

  ngOnInit(): void {
    const hasSeenWelcome = localStorage.getItem(this.WELCOME_KEY);
    const storedPlanetName = localStorage.getItem(this.PLANET_NAME_KEY);
    const storedCoins = localStorage.getItem(this.COINS_KEY);
    
    if (storedPlanetName) {
      this.planetName = storedPlanetName;
    }
    if (storedCoins) {
      this.coins = parseInt(storedCoins, 10);
    }
    if (!hasSeenWelcome) {
      this.showWelcome = true;
    }

    // Load building customizations
    this.buildingCustomization = this.buildingCustomizationService.getCustomizationState();
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

  startEditPlanetName(): void {
    this.editingPlanetInput = this.planetName;
    this.editingPlanetName = true;
    this.planetNameEditError = '';
  }

  savePlanetName(): void {
    const PLANET_NAME_COST = 10;
    
    if (this.coins < PLANET_NAME_COST) {
      this.planetNameEditError = `Du har ikke nok mønter. Du mangler ${PLANET_NAME_COST - this.coins} mønter.`;
      return;
    }

    if (this.editingPlanetInput.trim()) {
      // Deduct coins
      this.coins -= PLANET_NAME_COST;
      localStorage.setItem(this.COINS_KEY, this.coins.toString());
      
      // Save new planet name
      localStorage.setItem(this.PLANET_NAME_KEY, this.editingPlanetInput.trim());
      this.planetName = this.editingPlanetInput.trim();
      this.editingPlanetName = false;
      this.planetNameEditError = '';
    }
  }

  cancelEditPlanetName(): void {
    this.editingPlanetInput = '';
    this.editingPlanetName = false;
    this.planetNameEditError = '';
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
    
    // Set coins to be earned (1 for meteor, factory, assembling; 0 for others)
    this.coinsEarned = ['meteor', 'factory', 'assembling'].includes(game) ? 1 : 0;
    
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
    this.coinsEarned = 0;
    this.removeHoldListeners();
    // Refresh building customizations when closing headquarters
    this.buildingCustomization = this.buildingCustomizationService.getCustomizationState();
  }

  closePopupWithCoin(): void {
    // Award a coin for meteor, factory, and assembling games
    if (['meteor', 'factory', 'assembling'].includes(this.activePopup || '')) {
      this.coins += 1;
      localStorage.setItem(this.COINS_KEY, this.coins.toString());
    }
    this.closePopup();
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
