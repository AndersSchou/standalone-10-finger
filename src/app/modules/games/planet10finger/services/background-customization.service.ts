import { Injectable } from '@angular/core';

export const COLOR_COST = 10; // Cost in coins per color

@Injectable({
  providedIn: 'root'
})
export class BackgroundCustomizationService {
  private readonly STAR_COLOR_KEY = 'planet10finger_star_color';
  private readonly PLANET_COLOR_KEY = 'planet10finger_planet_color';
  private readonly PURCHASED_STAR_COLORS_KEY = 'planet10finger_purchased_star_colors';
  private readonly PURCHASED_PLANET_COLORS_KEY = 'planet10finger_purchased_planet_colors';

  readonly starColors = [
    { id: 'white', label: 'Hvid', hexValue: '#FFFFFF' },
    { id: 'red', label: 'Rød', hexValue: '#FF6B6B' },
    { id: 'yellow', label: 'Gul', hexValue: '#FFD700' },
    { id: 'orange', label: 'Orange', hexValue: '#FF8C00' },
    { id: 'green', label: 'Grøn', hexValue: '#44AF69' },
    { id: 'cyan', label: 'Cyan', hexValue: '#00CED1' },
    { id: 'blue', label: 'Blå', hexValue: '#4ECDC4' },
    { id: 'purple', label: 'Lilla', hexValue: '#9632C8' },
    { id: 'pink', label: 'Pink', hexValue: '#FF1493' },
  ];

  readonly planetColors = [
    { id: 'grey', label: 'Grå', mainColor: '#5A5A5A', lightColor: '#7A7A7A', darkColor: '#3A3A3A' },
    { id: 'red-grey', label: 'Rød', mainColor: '#E63946', lightColor: '#FF6B6B', darkColor: '#C1121F' },
    { id: 'blue-grey', label: 'Blå', mainColor: '#1D3557', lightColor: '#457B9D', darkColor: '#0F1F2C' },
    { id: 'green-grey', label: 'Grøn', mainColor: '#2A9D8F', lightColor: '#52B788', darkColor: '#1B5E5A' },
    { id: 'purple-grey', label: 'Lilla', mainColor: '#7209B7', lightColor: '#B5A7FF', darkColor: '#460FA3' },
    { id: 'orange-grey', label: 'Orange', mainColor: '#FF8C42', lightColor: '#FFB84D', darkColor: '#E07B39' },
    { id: 'cyan-grey', label: 'Cyan', mainColor: '#00D4FF', lightColor: '#37E7FF', darkColor: '#00A3CC' },
    { id: 'yellow-grey', label: 'Gul', mainColor: '#FFD60A', lightColor: '#FFED4E', darkColor: '#FFC300' },
    { id: 'pink-grey', label: 'Pink', mainColor: '#FF006E', lightColor: '#FF4D7D', darkColor: '#D6004A' },
  ];

  constructor() {}

  /**
   * Get the currently selected star color from localStorage.
   * Defaults to 'white' if not set.
   */
  getCurrentStarColor(): { id: string; label: string; hexValue: string } {
    const saved = localStorage.getItem(this.STAR_COLOR_KEY) || 'white';
    return this.starColors.find(c => c.id === saved) || this.starColors[0];
  }

  /**
   * Set the star color preference and save to localStorage.
   */
  setStarColor(colorId: string): void {
    const color = this.starColors.find(c => c.id === colorId);
    if (color) {
      localStorage.setItem(this.STAR_COLOR_KEY, colorId);
    }
  }

  /**
   * Get the hex value for the current star color.
   */
  getStarColorValue(): string {
    return this.getCurrentStarColor().hexValue;
  }

  /**
   * Get the currently selected planet color from localStorage.
   * Defaults to 'grey' if not set.
   */
  getCurrentPlanetColor(): { id: string; label: string; mainColor: string; lightColor: string; darkColor: string } {
    const saved = localStorage.getItem(this.PLANET_COLOR_KEY) || 'grey';
    return this.planetColors.find(c => c.id === saved) || this.planetColors[0];
  }

  /**
   * Set the planet color preference and save to localStorage.
   */
  setPlanetColor(colorId: string): void {
    const color = this.planetColors.find(c => c.id === colorId);
    if (color) {
      localStorage.setItem(this.PLANET_COLOR_KEY, colorId);
    }
  }

  /**
   * Get the main color value for the current planet color.
   */
  getPlanetMainColor(): string {
    return this.getCurrentPlanetColor().mainColor;
  }

  /**
   * Get the light color value for the current planet color.
   */
  getPlanetLightColor(): string {
    return this.getCurrentPlanetColor().lightColor;
  }

  /**
   * Get the dark color value for the current planet color.
   */
  getPlanetDarkColor(): string {
    return this.getCurrentPlanetColor().darkColor;
  }

  /**
   * Get list of purchased star colors.
   */
  getPurchasedStarColors(): string[] {
    const saved = localStorage.getItem(this.PURCHASED_STAR_COLORS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return ['white']; // White is always free
      }
    }
    return ['white']; // White is always free
  }

  /**
   * Check if a star color has been purchased.
   */
  isStarColorPurchased(colorId: string): boolean {
    if (colorId === 'white') return true; // White is always free
    return this.getPurchasedStarColors().includes(colorId);
  }

  /**
   * Purchase a star color.
   */
  purchaseStarColor(colorId: string): void {
    if (colorId !== 'white') {
      const purchased = this.getPurchasedStarColors();
      if (!purchased.includes(colorId)) {
        purchased.push(colorId);
        localStorage.setItem(this.PURCHASED_STAR_COLORS_KEY, JSON.stringify(purchased));
      }
    }
  }

  /**
   * Get list of purchased planet colors.
   */
  getPurchasedPlanetColors(): string[] {
    const saved = localStorage.getItem(this.PURCHASED_PLANET_COLORS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return ['grey']; // Grey is always free
      }
    }
    return ['grey']; // Grey is always free
  }

  /**
   * Check if a planet color has been purchased.
   */
  isPlanetColorPurchased(colorId: string): boolean {
    if (colorId === 'grey') return true; // Grey is always free
    return this.getPurchasedPlanetColors().includes(colorId);
  }

  /**
   * Purchase a planet color.
   */
  purchasePlanetColor(colorId: string): void {
    if (colorId !== 'grey') {
      const purchased = this.getPurchasedPlanetColors();
      if (!purchased.includes(colorId)) {
        purchased.push(colorId);
        localStorage.setItem(this.PURCHASED_PLANET_COLORS_KEY, JSON.stringify(purchased));
      }
    }
  }
}
