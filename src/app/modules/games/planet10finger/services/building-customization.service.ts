import { Injectable } from '@angular/core';

export type ShapeVariant = 'basic' | 'modern' | 'advanced';

export interface GameBuildingCustomization {
  colorScheme: string;
  shapeVariant: ShapeVariant;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export interface CustomizationState {
  power: GameBuildingCustomization;
  oxygen: GameBuildingCustomization;
  meteor: GameBuildingCustomization;
  factory: GameBuildingCustomization;
  assembling: GameBuildingCustomization;
}

export const COLOR_SCHEMES: Record<string, {
  label: string;
  primary: string;
  secondary: string;
  accent: string;
}> = {
  red: { label: 'Rød', primary: '#FF6B6B', secondary: '#FFE66D', accent: '#FF8C42' },
  blue: { label: 'Blå', primary: '#4ECDC4', secondary: '#A8E6CF', accent: '#0064FF' },
  green: { label: 'Grøn', primary: '#44AF69', secondary: '#90EE90', accent: '#228B22' },
  purple: { label: 'Lilla', primary: '#9632C8', secondary: '#D8BFD8', accent: '#FF69B4' },
  orange: { label: 'Orange', primary: '#FF8C00', secondary: '#FFD700', accent: '#FF4500' },
  cyan: { label: 'Cyan', primary: '#00CED1', secondary: '#E0FFFF', accent: '#008B8B' },
  yellow: { label: 'Gul', primary: '#FFD700', secondary: '#FFFFE0', accent: '#FFA500' },
  pink: { label: 'Pink', primary: '#FF1493', secondary: '#FFB6C1', accent: '#FF69B4' },
};

const SHAPE_VARIANTS: ShapeVariant[] = ['basic', 'modern', 'advanced'];

@Injectable({
  providedIn: 'root'
})
export class BuildingCustomizationService {
  private readonly CUSTOMIZATION_KEY = 'planet10finger_building_customization';

  private defaultState: CustomizationState = {
    power: this.createBuildingCustomization('red', 'basic'),
    oxygen: this.createBuildingCustomization('blue', 'basic'),
    meteor: this.createBuildingCustomization('orange', 'basic'),
    factory: this.createBuildingCustomization('green', 'basic'),
    assembling: this.createBuildingCustomization('purple', 'basic'),
  };

  constructor() {}

  /**
   * Get all customization state from localStorage or defaults.
   */
  getCustomizationState(): CustomizationState {
    const saved = localStorage.getItem(this.CUSTOMIZATION_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return this.defaultState;
      }
    }
    return this.defaultState;
  }

  /**
   * Get customization for a specific game building.
   */
  getBuildingCustomization(gameId: keyof CustomizationState): GameBuildingCustomization {
    return this.getCustomizationState()[gameId];
  }

  /**
   * Update customization for a specific building.
   */
  updateBuildingCustomization(
    gameId: keyof CustomizationState,
    colorScheme: string,
    shapeVariant: ShapeVariant
  ): void {
    const state = this.getCustomizationState();
    state[gameId] = this.createBuildingCustomization(colorScheme, shapeVariant);
    localStorage.setItem(this.CUSTOMIZATION_KEY, JSON.stringify(state));
  }

  /**
   * Get available color schemes.
   */
  getColorSchemes() {
    return Object.entries(COLOR_SCHEMES).map(([id, config]) => ({
      id,
      ...config
    }));
  }

  /**
   * Get available shape variants.
   */
  getShapeVariants() {
    return SHAPE_VARIANTS;
  }

  /**
   * Helper to create a building customization object.
   */
  private createBuildingCustomization(
    colorScheme: string,
    shapeVariant: ShapeVariant
  ): GameBuildingCustomization {
    const colors = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES['red'];
    return {
      colorScheme,
      shapeVariant,
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
      accentColor: colors.accent,
    };
  }
}
