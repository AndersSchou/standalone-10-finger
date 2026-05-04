import { Injectable } from '@angular/core';

export interface PlanetNameCCustomization {
  colorScheme: string;
  color: string;
}

export const PLANET_NAME_COLORS: Record<string, {
  label: string;
  color: string;
}> = {
  white: { label: 'Hvid', color: '#FFFFFF' },
  red: { label: 'Rød', color: '#FF6B6B' },
  blue: { label: 'Blå', color: '#4ECDC4' },
  green: { label: 'Grøn', color: '#44AF69' },
  yellow: { label: 'Gul', color: '#FFD700' },
  orange: { label: 'Orange', color: '#FF8C00' },
  purple: { label: 'Lilla', color: '#9632C8' },
  pink: { label: 'Pink', color: '#FF1493' },
  cyan: { label: 'Cyan', color: '#00CED1' },
};

export const COLOR_COST = 10; // Cost in coins per color

@Injectable({
  providedIn: 'root'
})
export class PlanetNameCustomizationService {
  private readonly CUSTOMIZATION_KEY = 'planet10finger_planet_name_color';
  private readonly PURCHASED_COLORS_KEY = 'planet10finger_purchased_colors';

  private defaultCustomization: PlanetNameCCustomization = {
    colorScheme: 'white',
    color: PLANET_NAME_COLORS['white'].color,
  };

  constructor() {}

  /**
   * Get planet name color customization from localStorage or defaults.
   */
  getCustomization(): PlanetNameCCustomization {
    const saved = localStorage.getItem(this.CUSTOMIZATION_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return this.defaultCustomization;
      }
    }
    return this.defaultCustomization;
  }

  /**
   * Get list of purchased color schemes.
   */
  getPurchasedColors(): string[] {
    const saved = localStorage.getItem(this.PURCHASED_COLORS_KEY);
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
   * Check if a color has been purchased.
   */
  isColorPurchased(colorId: string): boolean {
    if (colorId === 'white') return true; // White is always free
    return this.getPurchasedColors().includes(colorId);
  }

  /**
   * Purchase a color (deduct coins and unlock color).
   */
  purchaseColor(colorId: string): void {
    if (colorId !== 'white') {
      const purchased = this.getPurchasedColors();
      if (!purchased.includes(colorId)) {
        purchased.push(colorId);
        localStorage.setItem(this.PURCHASED_COLORS_KEY, JSON.stringify(purchased));
      }
    }
  }

  /**
   * Update planet name color customization.
   */
  updateCustomization(colorScheme: string): void {
    const colors = PLANET_NAME_COLORS[colorScheme] || PLANET_NAME_COLORS['white'];
    const customization: PlanetNameCCustomization = {
      colorScheme,
      color: colors.color,
    };
    localStorage.setItem(this.CUSTOMIZATION_KEY, JSON.stringify(customization));
  }

  /**
   * Get available color schemes.
   */
  getColorSchemes() {
    return Object.entries(PLANET_NAME_COLORS).map(([id, config]) => ({
      id,
      ...config
    }));
  }
}
