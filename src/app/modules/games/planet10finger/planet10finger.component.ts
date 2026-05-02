import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PowerComponent } from './games/power/power.component';
import { OxygenComponent } from './games/oxygen/oxygen.component';
import { MeteorComponent } from './games/meteor/meteor.component';
import { FactoryComponent } from './games/factory/factory.component';
import { AssemblingComponent } from './games/assembling/assembling.component';
import { MoonraceComponent } from './games/moonrace/moonrace.component';
import { HeadquartersComponent } from './games/headquarters/headquarters.component';
import { VKeyboardComponent } from 'src/app/vkeyboard/vkeyboard.component';
import { BuildingCustomizationService } from './services/building-customization.service';
import { BackgroundCustomizationService } from './services/background-customization.service';
import { PlanetNameCustomizationService } from './services/planet-name-customization.service';
import { CharacterCustomizationService } from './services/character-customization.service';
import { AchievementService } from './services/achievement.service';
import { UserSessionService } from './services/user-session.service';
import { OxygenBuildingComponent } from 'src/app/shared/svgs/oxygen-building.component';
import { MeteorBuildingComponent } from 'src/app/shared/svgs/meteor-building.component';
import { FactoryBuildingComponent } from 'src/app/shared/svgs/factory-building.component';
import { AssemblingBuildingComponent } from 'src/app/shared/svgs/assembling-building.component';
import { HeadquartersBuildingComponent } from 'src/app/shared/svgs/headquarters-building.component';

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
    MoonraceComponent,
    HeadquartersComponent,
    VKeyboardComponent,
    OxygenBuildingComponent,
    MeteorBuildingComponent,
    FactoryBuildingComponent,
    AssemblingBuildingComponent,
    HeadquartersBuildingComponent,
  ],
})
export class Planet10fingerComponent implements OnInit, OnDestroy {
  @ViewChild(VKeyboardComponent) fjKeyboard?: VKeyboardComponent;

  activePopup: string | null = null;
  /** Dynamic SVG background URL with planet colors */
  planetBackgroundUrl = '/assets/svg/Moon_background.svg';
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
  /** Whether currently viewing game intro (prevents planet name editing). */
  inGameIntro = false;
  /** Whether "do not show again" is checked for current game intro. */
  doNotShowAgainChecked = false;
  /** Coin count. */
  coins = 0;
  /** Batteries collected from power game. */
  batteries = 0;
  /** Oxygen tanks collected from oxygen game. */
  oxygenTanks = 0;
  /** Coins to be awarded in current game. */
  coinsEarned = 0;
  /** Show planet name edit dialog. */
  editingPlanetName = false;
  /** Planet name input while editing. */
  editingPlanetInput = '';
  /** Error message for planet name edit. */
  planetNameEditError = '';
  /** Star color */
  starColor = '#FFFFFF';
  /** Show cheat code dialog. */
  showCheatDialog = false;
  /** Cheat code input. */
  cheatCodeInput = '';
  /** Cheat code message. */
  cheatMessage = '';
  /** Cheat message type (success or error). */
  cheatMessageType: 'success' | 'error' = 'success';
  /** Planet name color */
  planetNameColor = '#FFFFFF';
  /** Show difficulty selector dialog. */
  showDifficultySelector = false;
  /** Current game difficulty (1-3) */
  gameDifficulty: 1 | 2 | 3 = 1;
  /** Error message for insufficient resources */
  resourceError = '';
  /** Show resource error message */
  showResourceError = false;
  /** Placed characters */
  placedCharacters: any[] = [];

  // Guided mode for first-time players
  private readonly GUIDED_MODE_KEY = 'planet10finger_guided_completed_games';
  private readonly guidedGameOrder: string[] = ['oxygen', 'power', 'factory', 'assembling'];
  private readonly HQ_TABS_KEY = 'planet10finger_guided_hq_tabs_completed';
  private readonly hqTabOrder: string[] = ['achievements', 'stats', 'shop'];
  completedGames: Set<string> = new Set();
  completedHQTabs: Set<string> = new Set();
  isGuidedMode = false;
  nextGameInGuide: string | null = null;
  nextHQTabInGuide: string | null = null;
  guidanceMessage = '';

  private readonly WELCOME_KEY = 'planet10finger_welcome_seen';
  private readonly PLANET_NAME_KEY = 'planet10finger_name';
  private readonly COINS_KEY = 'planet10finger_coins';
  private readonly BATTERIES_KEY = 'planet10finger_batteries';
  private readonly OXYGEN_TANKS_KEY = 'planet10finger_oxygen_tanks';
  private readonly PURCHASED_GAMES_KEY = 'planet10finger_purchased_games';
  purchasedGames: Set<string> = new Set();
  private heldKeys = new Set<string>();
  private holdInterval: ReturnType<typeof setInterval> | null = null;
  private keydownListener: ((e: KeyboardEvent) => void) | null = null;
  private keyupListener:   ((e: KeyboardEvent) => void) | null = null;

  constructor(
    private readonly router: Router,
    private readonly backgroundCustomizationService: BackgroundCustomizationService,
    private readonly planetNameCustomizationService: PlanetNameCustomizationService,
    private readonly characterCustomizationService: CharacterCustomizationService,
    private readonly achievementService: AchievementService,
    private readonly userSessionService: UserSessionService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const hasSeenWelcome = localStorage.getItem(this.WELCOME_KEY);
    const storedPlanetName = localStorage.getItem(this.PLANET_NAME_KEY);
    const storedCoins = localStorage.getItem(this.COINS_KEY);
    const storedBatteries = localStorage.getItem(this.BATTERIES_KEY);
    const storedOxygenTanks = localStorage.getItem(this.OXYGEN_TANKS_KEY);
    
    if (storedPlanetName) {
      this.planetName = storedPlanetName;
    }
    if (storedCoins) {
      this.coins = parseInt(storedCoins, 10);
    }
    if (storedBatteries) {
      this.batteries = parseInt(storedBatteries, 10);
    }
    if (storedOxygenTanks) {
      this.oxygenTanks = parseInt(storedOxygenTanks, 10);
    }
    if (!hasSeenWelcome) {
      this.showWelcome = true;
      this.isGuidedMode = true; // New users start in guided mode
    }

    // Load guided mode status and completed games
    this.loadHQTabsStatus();
    this.loadGuidedModeStatus();
    this.loadPurchasedGames();
    this.loadPlacedCharacters();
    this.updateNextGameInGuide();
    this.updateNextHQTabInGuide();

    // Load planet name color customization
    const planetNameCustomization = this.planetNameCustomizationService.getCustomization();
    this.planetNameColor = planetNameCustomization.color;

    // Load star color customization
    this.starColor = this.backgroundCustomizationService.getStarColorValue();
    // Apply star color to CSS variable
    document.documentElement.style.setProperty('--star-color', this.starColor);

    // Load planet color customization
    const planetMainColor = this.backgroundCustomizationService.getPlanetMainColor();
    const planetLightColor = this.backgroundCustomizationService.getPlanetLightColor();
    const planetDarkColor = this.backgroundCustomizationService.getPlanetDarkColor();
    document.documentElement.style.setProperty('--planet-main-color', planetMainColor);
    document.documentElement.style.setProperty('--planet-light-color', planetLightColor);
    document.documentElement.style.setProperty('--planet-dark-color', planetDarkColor);

    // Load SVG with custom planet colors
    this.loadSVGWithPlanetColors(planetMainColor, planetLightColor, planetDarkColor);
  }

  private loadSVGWithPlanetColors(mainColor: string, lightColor: string, darkColor: string): void {
    fetch('/assets/svg/Moon_background.svg')
      .then(response => response.text())
      .then(svgText => {
        // Replace colors in the SVG
        let modifiedSvg = svgText
          .replace(/#8a8a8a/g, mainColor)  // main circle color
          .replace(/#9a9a9a/g, lightColor) // light circles
          .replace(/#7a7a7a/g, darkColor); // dark circles
        
        // Create data URI
        const blob = new Blob([modifiedSvg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        this.planetBackgroundUrl = url;
      })
      .catch(err => console.error('Failed to load SVG:', err));
  }

  private loadGuidedModeStatus(): void {
    const completedGamesStr = localStorage.getItem(this.GUIDED_MODE_KEY);
    if (completedGamesStr) {
      try {
        const completed = JSON.parse(completedGamesStr);
        this.completedGames = new Set(completed);
        // Still in guided mode if not all games are completed OR not all HQ tabs are visited
        const allGamesCompleted = this.completedGames.size === this.guidedGameOrder.length;
        const allHQTabsCompleted = this.completedHQTabs.size === this.hqTabOrder.length;
        this.isGuidedMode = !allGamesCompleted || (allGamesCompleted && !allHQTabsCompleted);
      } catch {
        this.completedGames = new Set();
        this.isGuidedMode = true;
      }
    } else if (localStorage.getItem(this.WELCOME_KEY)) {
      // User has seen welcome but no completed games record - they're in guided mode
      this.isGuidedMode = true;
    }
  }

  private updateNextGameInGuide(): void {
    for (const game of this.guidedGameOrder) {
      if (!this.completedGames.has(game)) {
        this.nextGameInGuide = game;
        this.updateGuidanceMessage();
        return;
      }
    }
    // All games completed - point to headquarters
    this.nextGameInGuide = 'headquarters';
    this.updateGuidanceMessage();
  }

  private updateGuidanceMessage(): void {
    // Show message if pointing to headquarters after all games
    if (this.nextGameInGuide === 'headquarters' && this.completedGames.size === this.guidedGameOrder.length) {
      // If in HQ and there are tabs to visit
      if (this.nextHQTabInGuide) {
        const tabNames: Record<string, string> = {
          information: 'Information',
          achievements: 'Præstationer',
          stats: 'Statistik',
          shop: 'Butik',
        };
        const tabName = tabNames[this.nextHQTabInGuide] || this.nextHQTabInGuide;
        this.guidanceMessage = `Besøg fanen "${tabName}"`;
      } else {
        this.guidanceMessage = 'Besøg hovedkvarteret og gennemse hver fane for at lære mere!';
      }
      return;
    }

    if (!this.isGuidedMode || !this.nextGameInGuide) {
      this.guidanceMessage = '';
      return;
    }

    const gameNames: Record<string, string> = {
      oxygen: 'Ilt',
      power: 'Strøm',
      factory: 'Fabrik',
      assembling: 'Samling',
      moonrace: 'Måneræs',
      meteor: 'Meteor',
    };
    const gameName = gameNames[this.nextGameInGuide] || this.nextGameInGuide;
    this.guidanceMessage = `Spil ${gameName}`;
  }

  private loadHQTabsStatus(): void {
    const completedTabsStr = localStorage.getItem(this.HQ_TABS_KEY);
    if (completedTabsStr) {
      try {
        const completed = JSON.parse(completedTabsStr);
        this.completedHQTabs = new Set(completed);
      } catch {
        this.completedHQTabs = new Set();
      }
    }
  }

  private updateNextHQTabInGuide(): void {
    if (this.nextGameInGuide !== 'headquarters' || this.completedGames.size !== this.guidedGameOrder.length) {
      this.nextHQTabInGuide = null;
      return;
    }
    // Only set next tab if all games are completed and we're in HQ guide mode
    for (const tab of this.hqTabOrder) {
      if (!this.completedHQTabs.has(tab)) {
        this.nextHQTabInGuide = tab;
        return;
      }
    }
    // All HQ tabs completed - guidance is done
    this.nextHQTabInGuide = null;
    this.isGuidedMode = false;
  }

  markHQTabAsVisited(tab: string): void {
    if (tab === this.nextHQTabInGuide) {
      this.completedHQTabs.add(tab);
      localStorage.setItem(this.HQ_TABS_KEY, JSON.stringify(Array.from(this.completedHQTabs)));
      this.updateNextHQTabInGuide();
      this.updateGuidanceMessage();
    }
  }

  getAstronautMessage(): string {
    // Check if all guided games are completed
    if (this.completedGames.size === this.guidedGameOrder.length) {
      return 'Godt arbejde!';
    }

    const messages: Record<string, string> = {
      power: 'Lav strøm!',
      headquarters: 'Byg hovedkvarter!',
      oxygen: 'Lav ilt!',
      meteor: 'Beskyt planeten!',
      factory: 'Skriv ord!',
      assembling: 'Skriv sætninger!',
      moonrace: 'Kjør måneræs!',
    };
    return messages[this.activePopup || this.nextGameInGuide || ''] || 'Spil og byg!';
  }

  isGameNextInGuide(game: string): boolean {
    return this.isGuidedMode && this.nextGameInGuide === game;
  }

  isGameLockedInGuide(game: string): boolean {
    // Headquarters is always unlocked
    if (game === 'headquarters') {
      return false;
    }
    // Meteor and Moonrace require purchase
    if ((game === 'meteor' || game === 'moonrace') && !this.purchasedGames.has(game)) {
      return true;
    }
    return this.isGuidedMode && this.nextGameInGuide !== game && !this.completedGames.has(game);
  }

  private loadPurchasedGames(): void {
    const purchasedStr = localStorage.getItem(this.PURCHASED_GAMES_KEY);
    if (purchasedStr) {
      try {
        const purchased = JSON.parse(purchasedStr);
        this.purchasedGames = new Set(purchased);
      } catch {
        this.purchasedGames = new Set();
      }
    }
  }

  private loadPlacedCharacters(): void {
    this.placedCharacters = this.characterCustomizationService.getPlacedCharacterObjects();
    this.cdr.detectChanges();
  }

  toggleCharacterPlacement(characterId: string): void {
    const charObj = this.characterCustomizationService.getCharacterById(characterId);
    if (!charObj) return;

    const isPlaced = this.characterCustomizationService.getPlacedCharacters().includes(characterId);
    
    if (isPlaced) {
      this.characterCustomizationService.removeCharacter(characterId);
    } else {
      this.characterCustomizationService.placeCharacter(characterId);
    }
    
    this.loadPlacedCharacters();
  }

  purchaseGame(game: string, cost: number): boolean {
    if (this.coins >= cost && !this.purchasedGames.has(game)) {
      this.coins -= cost;
      this.purchasedGames.add(game);
      localStorage.setItem(this.COINS_KEY, this.coins.toString());
      localStorage.setItem(this.PURCHASED_GAMES_KEY, JSON.stringify(Array.from(this.purchasedGames)));
      return true;
    }
    return false;
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
      case 'moonrace':
        return 'I dette spil skal du skrive de grønne bogstaver for at fuldføre alle banerne inden tidens løb';
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
    this.inGameIntro = false;
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
    
    // Show the popup immediately and disable planet name editing
    this.showGameIntro = true;
    this.inGameIntro = true;
    this.doNotShowAgainChecked = false;
  }

  openPopup(game: string): void {
    // Check if in guided mode and game is not the next one
    if (this.isGameLockedInGuide(game)) {
      return; // Don't open locked games
    }

    // Check resources for factory and assembling games (deduction happens after F+J gate)
    if (['factory', 'assembling'].includes(game)) {
      if (this.batteries < 1 || this.oxygenTanks < 1) {
        this.resourceError = 'Du skal have mindst 1 batteri og 1 ilt tank for at spille dette spil!';
        this.showResourceError = true;
        setTimeout(() => {
          this.showResourceError = false;
        }, 3000);
        return;
      }
    }

    this.activePopup = game;
    this.gameReady = false;
    this.holdProgress = 0;
    this.heldKeys.clear();
    this.doNotShowAgainChecked = false;
    this.gameDifficulty = 1; // Reset to default
    
    // Set coins to be earned (1 for meteor, factory, assembling, moonrace; 0 for others)
    this.coinsEarned = ['meteor', 'factory', 'assembling', 'moonrace'].includes(game) ? 1 : 0;
    
    // Check if intro for this game has been hidden
    const introHiddenKey = `game_intro_${this.activePopup}_hidden`;
    const isIntroHidden = localStorage.getItem(introHiddenKey) === 'true';
    
    if (!isIntroHidden && this.activePopup !== 'headquarters') {
      this.showGameIntro = true;
    } else {
      this.attachHoldListeners();
      setTimeout(() => {
        this.fjKeyboard?.setTheme('color-group');
        this.fjKeyboard?.setMode('partial');
      });
    }
  }

  selectDifficulty(difficulty: 1 | 2 | 3): void {
    this.gameDifficulty = difficulty;
    this.attachHoldListeners();
    setTimeout(() => {
      this.fjKeyboard?.setTheme('color-group');
      this.fjKeyboard?.setMode('partial');
    });
  }

  closePopup(): void {
    this.activePopup = null;
    this.gameReady = false;
    this.holdProgress = 0;
    this.showGameIntro = false;
    this.inGameIntro = false;
    this.showDifficultySelector = false;
    this.doNotShowAgainChecked = false;
    this.coinsEarned = 0;
    this.gameDifficulty = 1;
    this.removeHoldListeners();
    // Refresh planet name color when closing headquarters
    const planetNameCustomization = this.planetNameCustomizationService.getCustomization();
    this.planetNameColor = planetNameCustomization.color;
    // Refresh star color
    this.starColor = this.backgroundCustomizationService.getStarColorValue();
    document.documentElement.style.setProperty('--star-color', this.starColor);
    // Refresh planet background colors
    const planetMainColor = this.backgroundCustomizationService.getPlanetMainColor();
    const planetLightColor = this.backgroundCustomizationService.getPlanetLightColor();
    // Reload placed characters in case any were purchased
    this.loadPlacedCharacters();
    const planetDarkColor = this.backgroundCustomizationService.getPlanetDarkColor();
    document.documentElement.style.setProperty('--planet-main-color', planetMainColor);
    document.documentElement.style.setProperty('--planet-light-color', planetLightColor);
    document.documentElement.style.setProperty('--planet-dark-color', planetDarkColor);
    this.loadSVGWithPlanetColors(planetMainColor, planetLightColor, planetDarkColor);
  }

  onHQCoinsChanged(newCoins: number): void {
    this.coins = newCoins;
  }

  onGamePurchaseRequested(request: { game: string; cost: number }): void {
    if (this.purchaseGame(request.game, request.cost)) {
      // Unlock achievement based on which game was purchased
      if (request.game === 'meteor') {
        this.achievementService.unlockAchievement('buy_meteor');
      } else if (request.game === 'moonrace') {
        this.achievementService.unlockAchievement('buy_moonrace');
      }
    }
  }

  onColorPurchased(_colorType: string): void {
    // Color purchases are handled in the headquarters component
    // This method is just for propagating the event if needed
  }

  onCharacterPurchaseRequested(request: { character: string; cost: number }): void {
    // Character purchase is already handled in shop component via characterService
    // Just reload the placed characters to reflect the purchase
    this.loadPlacedCharacters();
  }

  onHQPlanetNameChanged(newName: string): void {
    this.planetName = newName;
  }

  onPlanetColorChanged(): void {
    const planetNameCustomization = this.planetNameCustomizationService.getCustomization();
    this.planetNameColor = planetNameCustomization.color;
    
    // Reload planet background SVG with new colors
    const planetMainColor = this.backgroundCustomizationService.getPlanetMainColor();
    const planetLightColor = this.backgroundCustomizationService.getPlanetLightColor();
    const planetDarkColor = this.backgroundCustomizationService.getPlanetDarkColor();
    document.documentElement.style.setProperty('--planet-main-color', planetMainColor);
    document.documentElement.style.setProperty('--planet-light-color', planetLightColor);
    document.documentElement.style.setProperty('--planet-dark-color', planetDarkColor);
    this.loadSVGWithPlanetColors(planetMainColor, planetLightColor, planetDarkColor);
  }

  closePopupWithCoin(): void {
    const gameToClose = this.activePopup;
    
    // Calculate coin reward based on difficulty level
    // Games that give coins: meteor, factory, assembling, moonrace
    if (['meteor', 'factory', 'assembling', 'moonrace'].includes(gameToClose || '')) {
      const coinsToAdd = this.gameDifficulty === 1 ? 1 : this.gameDifficulty === 2 ? 2 : 3;
      this.coins += coinsToAdd;
      localStorage.setItem(this.COINS_KEY, this.coins.toString());
    }
    
    // Award battery for power game based on difficulty
    if (gameToClose === 'power') {
      const batteriesToAdd = this.gameDifficulty === 1 ? 3 : this.gameDifficulty === 2 ? 4 : 5;
      this.batteries += batteriesToAdd;
      localStorage.setItem(this.BATTERIES_KEY, this.batteries.toString());
    }
    
    // Award oxygen tank for oxygen game based on difficulty
    if (gameToClose === 'oxygen') {
      const oxygenToAdd = this.gameDifficulty === 1 ? 3 : this.gameDifficulty === 2 ? 4 : 5;
      this.oxygenTanks += oxygenToAdd;
      localStorage.setItem(this.OXYGEN_TANKS_KEY, this.oxygenTanks.toString());
    }
    
    // Track game completion in guided mode
    if (gameToClose && this.isGuidedMode) {
      this.completedGames.add(gameToClose);
      localStorage.setItem(this.GUIDED_MODE_KEY, JSON.stringify(Array.from(this.completedGames)));
      this.updateNextGameInGuide();
      this.updateGuidanceMessage();
    }

    // Record daily game performance
    this.recordDailyGamePerformance(gameToClose);
    
    this.closePopup();
  }

  onGameRestart(): void {
    // Deduct resources when restarting factory or assembling games
    if (['factory', 'assembling'].includes(this.activePopup || '')) {
      this.batteries -= 1;
      this.oxygenTanks -= 1;
      localStorage.setItem(this.BATTERIES_KEY, this.batteries.toString());
      localStorage.setItem(this.OXYGEN_TANKS_KEY, this.oxygenTanks.toString());
    }
  }

  private recordDailyGamePerformance(gameId: string | null): void {
    if (!gameId) return;

    // Map game IDs to display names
    const gameNames: { [key: string]: string } = {
      power: 'Strøm',
      oxygen: 'Ilt',
      meteor: 'Meteor forsvar',
      factory: 'Fabrikken',
      assembling: 'Samle Hangaren',
      moonrace: 'Måneræs',
    };

    const gameName = gameNames[gameId] || gameId;

    // Record game performance - pass basic completion time to ensure data is tracked
    this.userSessionService.recordDailyGamePerformance(gameId, gameName, {
      completionTimeSeconds: 60, // Default 60 seconds for now
    });
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
            // Deduct resources for factory and assembling games when passing F+J gate
            if (['factory', 'assembling'].includes(this.activePopup || '')) {
              this.batteries -= 1;
              this.oxygenTanks -= 1;
              localStorage.setItem(this.BATTERIES_KEY, this.batteries.toString());
              localStorage.setItem(this.OXYGEN_TANKS_KEY, this.oxygenTanks.toString());
            }
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

  openCheatDialog(): void {
    this.showCheatDialog = true;
    this.cheatCodeInput = '';
    this.cheatMessage = '';
  }

  closeCheatDialog(): void {
    this.showCheatDialog = false;
    this.cheatCodeInput = '';
    this.cheatMessage = '';
  }

  executeCheatCode(): void {
    const code = this.cheatCodeInput.toLowerCase().trim();
    
    if (!code) {
      this.cheatMessage = 'Please enter a cheat code';
      this.cheatMessageType = 'error';
      return;
    }

    // Add 100 coins
    if (code === 'coins100') {
      this.coins += 100;
      localStorage.setItem(this.COINS_KEY, this.coins.toString());
      this.cheatMessage = `✓ Added 100 coins! Total: ${this.coins}`;
      this.cheatMessageType = 'success';
      this.cheatCodeInput = '';
      return;
    }

    // Add 10 batteries and 10 oxygen tanks
    if (code === 'resources10') {
      this.batteries += 10;
      this.oxygenTanks += 10;
      localStorage.setItem(this.BATTERIES_KEY, this.batteries.toString());
      localStorage.setItem(this.OXYGEN_TANKS_KEY, this.oxygenTanks.toString());
      this.cheatMessage = `✓ Added 10 batteries and 10 oxygen tanks! Batteries: ${this.batteries}, Oxygen: ${this.oxygenTanks}`;
      this.cheatMessageType = 'success';
      this.cheatCodeInput = '';
      return;
    }

    // Reset game
    if (code === 'resetgame') {
      const confirm = window.confirm('Are you sure? This will reset ALL Planet 10 Finger progress and show the welcome screen like a fresh start.');
      if (confirm) {
        // Clear all planet10finger-specific data
        localStorage.removeItem(this.COINS_KEY);
        localStorage.removeItem(this.BATTERIES_KEY);
        localStorage.removeItem(this.OXYGEN_TANKS_KEY);
        localStorage.removeItem('planet10finger_achievements');
        localStorage.removeItem('planet10finger_stats');
        localStorage.removeItem('planet10finger_building_customization');
        localStorage.removeItem('planet10finger_planet_name');
        localStorage.removeItem('planet10finger_planet_name_color');
        localStorage.removeItem(this.WELCOME_KEY);
        localStorage.removeItem(this.GUIDED_MODE_KEY);
        localStorage.removeItem(this.HQ_TABS_KEY);
        
        // Clear all game intro hidden flags
        const games = ['power', 'oxygen', 'meteor', 'factory', 'assembling', 'moonrace'];
        games.forEach(game => {
          localStorage.removeItem(`game_intro_${game}_hidden`);
        });
        
        // Reset component state to first-time state
        this.coins = 0;
        this.batteries = 0;
        this.oxygenTanks = 0;
        this.planetName = '';
        this.planetNameColor = '#FFFFFF';
        this.showWelcome = true;
        this.completedGames.clear();
        this.completedHQTabs.clear();
        this.isGuidedMode = false;
        this.nextGameInGuide = null;
        this.activePopup = null;
        this.gameReady = false;
        this.holdProgress = 0;
        
        this.cheatMessage = '✓ Game reset! Welcome screen will reappear.';
        this.cheatMessageType = 'success';
        this.cheatCodeInput = '';
        this.showCheatDialog = false;
        
        // Reload page after a short delay to fully reset state
        setTimeout(() => {
          location.reload();
        }, 500);
        return;
      }
    }

    // Reset shop
    if (code === 'resetshop') {
      const confirm = window.confirm('Are you sure? This will reset all shop purchases (colors, games, and characters).');
      if (confirm) {
        // Clear purchased colors
        localStorage.removeItem('planet10finger_purchased_colors');
        // Reset planet name color back to white
        localStorage.removeItem('planet10finger_planet_name_color');
        this.planetNameColor = '#FFFFFF';
        // Clear purchased games
        localStorage.removeItem(this.PURCHASED_GAMES_KEY);
        this.purchasedGames.clear();
        // Clear purchased characters
        localStorage.removeItem('planet10finger_purchased_characters');
        // Clear placed characters
        localStorage.removeItem('planet10finger_placed_characters');
        // Reload placed characters to reflect changes
        this.loadPlacedCharacters();
        this.cheatMessage = '✓ Shop reset! All purchases (colors, games, and characters) have been cleared.';
        this.cheatMessageType = 'success';
        this.cheatCodeInput = '';
        return;
      }
    }

    // Unlock all games
    if (code === 'unlockall') {
      this.completedGames = new Set(this.guidedGameOrder);
      localStorage.setItem(this.GUIDED_MODE_KEY, JSON.stringify(Array.from(this.completedGames)));
      this.cheatMessage = '✓ All games unlocked!';
      this.cheatMessageType = 'success';
      this.cheatCodeInput = '';
      return;
    }

    // Unknown cheat
    this.cheatMessage = '✗ Unknown cheat code';
    this.cheatMessageType = 'error';
  }
}
