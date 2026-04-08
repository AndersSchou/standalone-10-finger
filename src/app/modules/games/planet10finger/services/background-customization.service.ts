import { Injectable } from '@angular/core';

export interface BackgroundColor {
  id: string;
  label: string;
  overlayColor: string; // rgba color for overlay
  hexPreview: string;   // hex for color preview
}

@Injectable({
  providedIn: 'root'
})
export class BackgroundCustomizationService {
  private readonly BACKGROUND_COLOR_KEY = 'planet10finger_background_color';

  // Available background color options with rgba overlays
  readonly backgroundColors: BackgroundColor[] = [
    { id: 'original', label: 'Original (Grå)', overlayColor: 'rgba(0, 0, 0, 0)', hexPreview: '#808080' },
    { id: 'red', label: 'Rød', overlayColor: 'rgba(255, 0, 0, 0.25)', hexPreview: '#FF0000' },
    { id: 'blue', label: 'Blå', overlayColor: 'rgba(0, 100, 255, 0.25)', hexPreview: '#0064FF' },
    { id: 'green', label: 'Grøn', overlayColor: 'rgba(0, 200, 100, 0.25)', hexPreview: '#00C864' },
    { id: 'purple', label: 'Lilla', overlayColor: 'rgba(150, 50, 200, 0.25)', hexPreview: '#9632C8' },
    { id: 'orange', label: 'Orange', overlayColor: 'rgba(255, 140, 0, 0.25)', hexPreview: '#FF8C00' },
    { id: 'pink', label: 'Pink', overlayColor: 'rgba(255, 100, 180, 0.25)', hexPreview: '#FF64B4' },
    { id: 'cyan', label: 'Cyan', overlayColor: 'rgba(0, 200, 255, 0.25)', hexPreview: '#00C8FF' },
    { id: 'yellow', label: 'Gul', overlayColor: 'rgba(255, 200, 0, 0.15)', hexPreview: '#FFC800' },
  ];

  constructor() {}

  /**
   * Get the currently selected background color from localStorage.
   * Defaults to 'original' if not set.
   */
  getCurrentBackgroundColor(): BackgroundColor {
    const saved = localStorage.getItem(this.BACKGROUND_COLOR_KEY) || 'original';
    return this.backgroundColors.find(c => c.id === saved) || this.backgroundColors[0];
  }

  /**
   * Set the background color preference and save to localStorage.
   */
  setBackgroundColor(colorId: string): void {
    const color = this.backgroundColors.find(c => c.id === colorId);
    if (color) {
      localStorage.setItem(this.BACKGROUND_COLOR_KEY, colorId);
    }
  }

  /**
   * Get the overlay color rgba value for the current background color.
   */
  getBackgroundOverlayColor(): string {
    return this.getCurrentBackgroundColor().overlayColor;
  }
}
