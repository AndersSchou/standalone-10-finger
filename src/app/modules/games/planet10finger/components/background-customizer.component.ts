import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackgroundCustomizationService, COLOR_COST } from '../services/background-customization.service';

@Component({
  selector: 'app-background-customizer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="star-section-wrapper">
      <h3><strong>Skift stjernernes farve</strong></h3>
      <div class="star-color-section">
        <div class="color-options">
          <button
            *ngFor="let color of starColors"
            [class.selected]="isSelectedStar(color.id)"
            [class.previewed]="previewStarColorId === color.id"
            [class.locked]="!isStarColorPurchased(color.id)"
            [style.--preview-color]="color.hexValue"
            (click)="selectStarColor(color.id)"
            [title]="color.label"
            class="color-btn"
          >
            <span class="color-preview"></span>
            <span class="color-label">{{ color.label }}</span>
            <span *ngIf="!isStarColorPurchased(color.id)" class="lock-icon">🔒</span>
          </button>
        </div>

        <!-- Star Color Preview -->
        <div class="preview-section">
          <div class="star-preview-container">
            <svg viewBox="0 0 300 100" class="star-preview">
              <circle cx="30" cy="30" r="4" [style.fill]="previewStarColor || selectedStarColor" />
              <circle cx="70" cy="20" r="3" [style.fill]="previewStarColor || selectedStarColor" />
              <circle cx="110" cy="40" r="4" [style.fill]="previewStarColor || selectedStarColor" />
              <circle cx="150" cy="25" r="3" [style.fill]="previewStarColor || selectedStarColor" />
              <circle cx="190" cy="35" r="4" [style.fill]="previewStarColor || selectedStarColor" />
              <circle cx="230" cy="20" r="3" [style.fill]="previewStarColor || selectedStarColor" />
              <circle cx="270" cy="30" r="4" [style.fill]="previewStarColor || selectedStarColor" />
            </svg>
            <p class="star-label">{{ previewStarLabel || selectedStarLabel }}</p>
            <div *ngIf="previewStarColorId" class="purchase-section">
              <button (click)="buyStarColor()" class="buy-btn">Køb for 🪙 {{ colorCost }}</button>
            </div>
            <p *ngIf="purchaseMessage && purchaseType === 'star'" [class]="'purchase-message ' + purchaseMessageType">{{ purchaseMessage }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="planet-section-wrapper">
      <h4><strong>Skift planetens farve</strong></h4>
      <div class="planet-color-section">
        <div class="color-options">
          <button
            *ngFor="let color of planetColors"
            [class.selected]="isSelectedPlanet(color.id)"
            [class.previewed]="previewPlanetColorId === color.id"
            [class.locked]="!isPlanetColorPurchased(color.id)"
            [style.--preview-color]="color.mainColor"
            (click)="selectPlanetColor(color.id)"
            [title]="color.label"
            class="color-btn"
          >
            <span class="color-preview"></span>
            <span class="color-label">{{ color.label }}</span>
            <span *ngIf="!isPlanetColorPurchased(color.id)" class="lock-icon">🔒</span>
          </button>
        </div>

        <!-- Planet Color Preview -->
        <div class="preview-section">
          <div class="planet-preview-container">
            <svg viewBox="0 0 200 200" class="planet-preview">
              <circle cx="100" cy="100" r="80" [style.fill]="previewPlanetMainColor || selectedPlanetMainColor" />
              <circle cx="70" cy="80" r="15" [style.fill]="previewPlanetLightColor || selectedPlanetLightColor" />
              <circle cx="130" cy="90" r="12" [style.fill]="previewPlanetDarkColor || selectedPlanetDarkColor" />
              <circle cx="100" cy="140" r="14" [style.fill]="previewPlanetLightColor || selectedPlanetLightColor" />
            </svg>
            <p class="planet-label">{{ previewPlanetLabel || selectedPlanetLabel }}</p>
            <div *ngIf="previewPlanetColorId" class="purchase-section">
              <button (click)="buyPlanetColor()" class="buy-btn">Køb for 🪙 {{ colorCost }}</button>
            </div>
            <p *ngIf="purchaseMessage && purchaseType === 'planet'" [class]="'purchase-message ' + purchaseMessageType">{{ purchaseMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .star-section-wrapper {
      margin: 20px 0;
    }

    .planet-section-wrapper {
      margin: 20px 0;
    }

    .star-color-section {
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 20px;
    }

    .planet-color-section {
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 20px;
    }

    h3 {
      margin: 0 0 12px 0;
      color: #333;
      font-size: 1.1rem;
      border-bottom: 3px solid #667eea;
      padding-bottom: 10px;
    }

    h4 {
      margin: 0 0 12px 0;
      color: #333;
      font-size: 1.1rem;
      border-bottom: 3px solid #667eea;
      padding-bottom: 10px;
    }

    .color-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }

    .color-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 12px;
      border: 3px solid #ddd;
      border-radius: 8px;
      background: #f8f8f8;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.95rem;
      font-weight: 500;
      color: #333;
      position: relative;
    }

    .color-btn:hover:not(.locked) {
      border-color: #667eea;
      background: #f0f0f0;
      transform: translateY(-2px);
    }

    .color-btn.selected {
      border-color: #333;
      border-width: 3px;
      box-shadow: 0 0 0 1px white, 0 0 0 3px #333;
      background: #f8f8f8;
      font-weight: 700;
    }

    .color-btn.previewed {
      border-color: #667eea;
      border-width: 2px;
      box-shadow: 0 0 0 1px white, 0 0 0 2px #667eea;
    }

    .color-btn.locked {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .color-preview {
      width: 50px;
      height: 50px;
      border-radius: 8px;
      background: var(--preview-color);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .color-label {
      font-size: 0.95rem;
      font-weight: 600;
      color: #333;
    }

    .lock-icon {
      position: absolute;
      top: 4px;
      right: 4px;
      font-size: 1.2rem;
    }

    .preview-section {
      background: #f8f8f8;
      border-radius: 8px;
      padding: 12px;
      margin-top: 16px;
    }

    .star-preview-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #000000;
      border-radius: 8px;
      border: 2px solid #333333;
    }

    .star-preview {
      width: 100%;
      max-width: 300px;
      height: auto;
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
    }

    .star-label {
      margin: 0;
      color: #ffffff;
      font-size: 1rem;
      font-weight: 600;
    }

    .planet-preview-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #000000;
      border-radius: 8px;
      border: 2px solid #333333;
    }

    .planet-preview {
      width: 150px;
      height: 150px;
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
    }

    .planet-label {
      margin: 0;
      color: #ffffff;
      font-size: 1rem;
      font-weight: 600;
    }

    .purchase-section {
      display: flex;
      justify-content: center;
      margin-top: 12px;
    }

    .buy-btn {
      padding: 10px 20px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s ease;
      font-size: 0.95rem;
    }

    .buy-btn:hover {
      background: #5568d3;
    }

    .purchase-message {
      font-weight: 600;
      text-align: center;
      padding: 8px 12px;
      border-radius: 6px;
      margin-top: 8px;
    }

    .purchase-message.success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .purchase-message.error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    @media (max-width: 600px) {
      .color-options {
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
      }

      .color-btn {
        padding: 8px;
      }

      .color-preview {
        width: 40px;
        height: 40px;
      }

      .color-label {
        font-size: 0.75rem;
      }

      .star-preview {
        width: 100%;
        max-width: 280px;
        height: auto;
      }

      .star-preview-container {
        padding: 16px;
      }

      .planet-preview {
        width: 100px;
        height: 100px;
      }
    }
  `]
})
export class BackgroundCustomizerComponent implements OnInit {
  @Input() coins = 0;
  @Output() coinsChanged = new EventEmitter<number>();
  @Output() planetColorChanged = new EventEmitter<void>();

  starColors = this.backgroundCustomization.starColors;
  planetColors = this.backgroundCustomization.planetColors;

  selectedStarColor = '#FFFFFF';
  selectedStarLabel = 'Hvid';
  previewStarColor = '';
  previewStarLabel = '';
  previewStarColorId = '';

  selectedPlanetMainColor = '#5A5A5A';
  selectedPlanetLightColor = '#7A7A7A';
  selectedPlanetDarkColor = '#3A3A3A';
  selectedPlanetLabel = 'Grå';
  previewPlanetMainColor = '';
  previewPlanetLightColor = '';
  previewPlanetDarkColor = '';
  previewPlanetLabel = '';
  previewPlanetColorId = '';

  colorCost = COLOR_COST;
  purchaseMessage = '';
  purchaseMessageType: 'success' | 'error' = 'success';
  purchaseType: 'star' | 'planet' | '' = '';

  constructor(private backgroundCustomization: BackgroundCustomizationService) {}

  ngOnInit(): void {
    // Initialize preview with current selections
    const currentStarColor = this.backgroundCustomization.getCurrentStarColor();
    this.updateStarPreview(currentStarColor);
    
    const currentPlanetColor = this.backgroundCustomization.getCurrentPlanetColor();
    this.updatePlanetPreview(currentPlanetColor);
  }

  isSelectedStar(colorId: string): boolean {
    return this.backgroundCustomization.getCurrentStarColor().id === colorId;
  }

  isStarColorPurchased(colorId: string): boolean {
    return this.backgroundCustomization.isStarColorPurchased(colorId);
  }

  selectStarColor(colorId: string): void {
    const color = this.starColors.find(c => c.id === colorId);
    if (!color) return;

    if (colorId === 'white' || this.isStarColorPurchased(colorId)) {
      this.backgroundCustomization.setStarColor(colorId);
      this.updateStarPreview(color);
      this.previewStarColor = '';
      this.previewStarLabel = '';
      this.previewStarColorId = '';
      return;
    }

    this.previewStarColorId = colorId;
    this.previewStarColor = color.hexValue;
    this.previewStarLabel = color.label;
  }

  buyStarColor(): void {
    if (!this.previewStarColorId) return;

    const color = this.starColors.find(c => c.id === this.previewStarColorId);
    if (!color) return;

    // Check if user has enough coins
    if (this.coins < COLOR_COST) {
      const needed = COLOR_COST - this.coins;
      this.purchaseMessage = `✗ Du mangler 🪙 ${needed} mønter for at låse denne farve op.`;
      this.purchaseMessageType = 'error';
      this.purchaseType = 'star';
      setTimeout(() => (this.purchaseMessage = ''), 3000);
      return;
    }

    // Purchase the color
    this.backgroundCustomization.purchaseStarColor(this.previewStarColorId);
    this.coins -= COLOR_COST;
    this.coinsChanged.emit(this.coins);

    // Update current color to the purchased one
    this.backgroundCustomization.setStarColor(this.previewStarColorId);
    this.updateStarPreview(color);
    this.previewStarColor = '';
    this.previewStarLabel = '';
    this.previewStarColorId = '';

    this.purchaseMessage = `✓ Farve låst op! Du brugte 🪙 ${COLOR_COST} mønter.`;
    this.purchaseMessageType = 'success';
    this.purchaseType = 'star';
    setTimeout(() => (this.purchaseMessage = ''), 3000);
  }

  isSelectedPlanet(colorId: string): boolean {
    return this.backgroundCustomization.getCurrentPlanetColor().id === colorId;
  }

  isPlanetColorPurchased(colorId: string): boolean {
    return this.backgroundCustomization.isPlanetColorPurchased(colorId);
  }

  selectPlanetColor(colorId: string): void {
    const color = this.planetColors.find(c => c.id === colorId);
    if (!color) return;

    if (colorId === 'grey' || this.isPlanetColorPurchased(colorId)) {
      this.backgroundCustomization.setPlanetColor(colorId);
      this.updatePlanetPreview(color);
      this.updateSVGColors(color);
      this.planetColorChanged.emit();
      this.previewPlanetMainColor = '';
      this.previewPlanetLightColor = '';
      this.previewPlanetDarkColor = '';
      this.previewPlanetLabel = '';
      this.previewPlanetColorId = '';
      return;
    }

    this.previewPlanetColorId = colorId;
    this.previewPlanetMainColor = color.mainColor;
    this.previewPlanetLightColor = color.lightColor;
    this.previewPlanetDarkColor = color.darkColor;
    this.previewPlanetLabel = color.label;
  }

  buyPlanetColor(): void {
    if (!this.previewPlanetColorId) return;

    const color = this.planetColors.find(c => c.id === this.previewPlanetColorId);
    if (!color) return;

    // Check if user has enough coins
    if (this.coins < COLOR_COST) {
      const needed = COLOR_COST - this.coins;
      this.purchaseMessage = `✗ Du mangler 🪙 ${needed} mønter for at låse denne farve op.`;
      this.purchaseMessageType = 'error';
      this.purchaseType = 'planet';
      setTimeout(() => (this.purchaseMessage = ''), 3000);
      return;
    }

    // Purchase the color
    this.backgroundCustomization.purchasePlanetColor(this.previewPlanetColorId);
    this.coins -= COLOR_COST;
    this.coinsChanged.emit(this.coins);

    // Update current color to the purchased one
    this.backgroundCustomization.setPlanetColor(this.previewPlanetColorId);
    this.updatePlanetPreview(color);
    this.updateSVGColors(color);
    this.planetColorChanged.emit();
    this.previewPlanetMainColor = '';
    this.previewPlanetLightColor = '';
    this.previewPlanetDarkColor = '';
    this.previewPlanetLabel = '';
    this.previewPlanetColorId = '';

    this.purchaseMessage = `✓ Farve låst op! Du brugte 🪙 ${COLOR_COST} mønter.`;
    this.purchaseMessageType = 'success';
    this.purchaseType = 'planet';
    setTimeout(() => (this.purchaseMessage = ''), 3000);
  }

  private updateStarPreview(color: { id: string; label: string; hexValue: string }): void {
    this.selectedStarColor = color.hexValue;
    this.selectedStarLabel = color.label;
  }

  private updatePlanetPreview(color: { id: string; label: string; mainColor: string; lightColor: string; darkColor: string }): void {
    this.selectedPlanetMainColor = color.mainColor;
    this.selectedPlanetLightColor = color.lightColor;
    this.selectedPlanetDarkColor = color.darkColor;
    this.selectedPlanetLabel = color.label;
  }

  private updateSVGColors(color: { mainColor: string; lightColor: string; darkColor: string }): void {
    // Apply colors to CSS variables
    document.documentElement.style.setProperty('--planet-main-color', color.mainColor);
    document.documentElement.style.setProperty('--planet-light-color', color.lightColor);
    document.documentElement.style.setProperty('--planet-dark-color', color.darkColor);
  }
}
