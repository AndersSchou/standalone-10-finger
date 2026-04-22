import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackgroundCustomizationService {
  private readonly STAR_COLOR_KEY = 'planet10finger_star_color';
  private readonly PLANET_COLOR_KEY = 'planet10finger_planet_color';

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
    { id: 'grey', label: 'Grå', mainColor: '#808080', lightColor: '#909090', darkColor: '#707070' },
    { id: 'red-grey', label: 'Rødgrå', mainColor: '#998080', lightColor: '#a99090', darkColor: '#896070' },
    { id: 'blue-grey', label: 'Blågrå', mainColor: '#7a8c99', lightColor: '#8a9caa', darkColor: '#6a7c89' },
    { id: 'green-grey', label: 'Grøngrå', mainColor: '#7a9980', lightColor: '#8aa990', darkColor: '#6a8970' },
    { id: 'purple-grey', label: 'Lillagrå', mainColor: '#8a7a99', lightColor: '#9a8aaa', darkColor: '#7a6a89' },
    { id: 'orange-grey', label: 'Orangegrå', mainColor: '#998a80', lightColor: '#a99a90', darkColor: '#897a70' },
    { id: 'cyan-grey', label: 'Cyangrå', mainColor: '#788a9a', lightColor: '#88aaaa', darkColor: '#68797a' },
    { id: 'yellow-grey', label: 'Gulgrå', mainColor: '#9a9a78', lightColor: '#aaaa88', darkColor: '#8a8a68' },
    { id: 'pink-grey', label: 'Pinkgrå', mainColor: '#a08888', lightColor: '#b09898', darkColor: '#907878' },
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
}
