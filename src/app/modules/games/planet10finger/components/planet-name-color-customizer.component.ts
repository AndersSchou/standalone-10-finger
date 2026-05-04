import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanetNameCustomizationService, COLOR_COST } from '../services/planet-name-customization.service';

@Component({
  selector: 'app-planet-name-color-customizer',
  template: `
    <div class="planet-name-color-customizer">
      <h4>Skift farven på din planets navn</h4>
      <div class="color-change-section">
        <p class="customizer-subtitle"><strong>Vælg mellem disse farver for 10 mønter</strong></p>
      
        <div class="color-grid">
        <button
          *ngFor="let color of colorSchemes"
          class="color-button"
          [style.background-color]="color.color"
          [class.selected]="isSelected(color.id)"
          [class.previewed]="isPreviewed(color.id)"
          [class.locked]="!isPurchased(color.id)"
          (click)="selectColor(color.id)"
          [title]="isPurchased(color.id) ? color.label : color.label + ' - 🪙 ' + colorCost + ' mønter'"
        >
          <span class="lock-icon" *ngIf="!isPurchased(color.id)">🔒</span>
        </button>
      </div>
      
      <div class="preview-section">
        <h3 class="name-preview" [style.color]="previewColorHex">Planet {{ planetName }}</h3>
      </div>

      <div class="action-section" *ngIf="previewColorId && previewColorId !== 'white' && !isPurchased(previewColorId) && previewColorId !== currentColor">
        <button class="buy-button" (click)="buyColor()">
          Køb farve - 🪙 {{ colorCost }} mønter
        </button>
      </div>

      <!-- Purchase Message for Color Purchase -->
      <div *ngIf="purchaseMessage" class="purchase-message" [ngClass]="{ 'message-success': purchaseMessageType === 'success', 'message-error': purchaseMessageType === 'error' }">
        {{ purchaseMessage }}
      </div>
      </div>
    </div>
  `,
  styles: [`
    .planet-name-color-customizer {
      background: white;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
    }

    h4 {
      margin: 0 0 12px;
      color: #1a1a2e;
      font-size: 1.2rem;
      font-weight: 600;
      border-bottom: 2px solid #cfd8dc;
      padding-bottom: 8px;
    }

    .customizer-subtitle {
      margin: 0 0 16px;
      color: #666;
      font-size: 0.95rem;
    }

    .customizer-subtitle strong {
      font-weight: 700;
    }

    .color-change-section {
      background: #f9f9f9;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
    }

    .color-grid {
      display: grid;
      grid-template-columns: repeat(9, 1fr);
      gap: 10px;
      max-width: 400px;
      margin-bottom: 16px;
    }

    .color-button {
      width: 40px;
      height: 40px;
      border: 2px solid #ddd;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    .color-button:hover:not(.locked) {
      transform: scale(1.2);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .color-button:hover.locked {
      transform: scale(1.1);
    }

    .color-button:active {
      transform: scale(0.9);
    }

    .color-button.selected {
      border-color: #333;
      border-width: 3px;
      box-shadow: 0 0 0 1px white, 0 0 0 3px #333;
    }

    .color-button.previewed {
      border-color: #667eea;
      border-width: 2px;
      box-shadow: 0 0 0 1px white, 0 0 0 2px #667eea;
    }

    .color-button.locked {
      opacity: 0.6;
      filter: grayscale(60%);
    }

    .lock-icon {
      font-size: 1.2rem;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }

    .preview-section {
      background: #000000;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      text-align: center;
      border: 2px solid #333333;
    }

    .name-preview {
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
      transition: color 0.2s ease;
    }

    .action-section {
      margin-bottom: 16px;
      display: flex;
      gap: 8px;
    }

    .buy-button {
      flex: 1;
      padding: 12px 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .buy-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .buy-button:active {
      transform: translateY(0);
    }

    .purchase-message {
      padding: 12px 16px;
      border-radius: 6px;
      font-weight: 500;
      text-align: center;
      animation: slideDown 0.3s ease;
      font-size: 0.9rem;
      margin-top: 12px;
      margin-bottom: 0;
    }

    .purchase-message.message-success {
      background: #c8e6c9;
      color: #2e7d32;
      border: 1px solid #81c784;
    }

    .purchase-message.message-error {
      background: #ffcdd2;
      color: #c62828;
      border: 1px solid #ef5350;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .color-grid {
        max-width: 100%;
      }

      .name-preview {
        font-size: 1.6rem;
      }

      .action-section {
        flex-direction: column;
      }
    }
  `],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class PlanetNameColorCustomizerComponent implements OnInit {
  @Input() coins: number = 0;
  @Input() planetName: string = 'Planet';
  @Output() coinsChanged = new EventEmitter<number>();
  @Output() colorPurchased = new EventEmitter<string>();

  colorSchemes: Array<{ id: string; label: string; color: string }> = [];
  currentColor: string = '';
  currentColorHex: string = '#FFFFFF';
  previewColorId: string = '';
  previewColorHex: string = '#FFFFFF';
  colorCost = COLOR_COST;
  purchaseMessage = '';
  purchaseMessageType: 'success' | 'error' = 'success';

  constructor(private planetNameCustomizationService: PlanetNameCustomizationService) {}

  ngOnInit(): void {
    this.colorSchemes = this.planetNameCustomizationService.getColorSchemes();
    const customization = this.planetNameCustomizationService.getCustomization();
    this.currentColor = customization.colorScheme;
    this.currentColorHex = customization.color;
    this.previewColorHex = customization.color;
  }

  isSelected(colorId: string): boolean {
    return this.currentColor === colorId;
  }

  isPreviewed(colorId: string): boolean {
    return this.previewColorId === colorId;
  }

  isPurchased(colorId: string): boolean {
    return this.planetNameCustomizationService.isColorPurchased(colorId);
  }

  selectColor(colorId: string): void {
    const colorScheme = this.colorSchemes.find(c => c.id === colorId);
    if (!colorScheme) return;

    if (colorId === 'white' || this.isPurchased(colorId)) {
      this.currentColor = colorId;
      this.currentColorHex = colorScheme.color;
      this.previewColorHex = colorScheme.color;
      this.previewColorId = '';
      this.planetNameCustomizationService.updateCustomization(colorId);
      return;
    }

    this.previewColorId = colorId;
    this.previewColorHex = colorScheme.color;
  }

  buyColor(): void {
    if (!this.previewColorId) return;

    const colorScheme = this.colorSchemes.find(c => c.id === this.previewColorId);
    if (!colorScheme) return;

    // Check if user has enough coins
    if (this.coins < COLOR_COST) {
      const needed = COLOR_COST - this.coins;
      this.purchaseMessage = `✗ Du mangler 🪙 ${needed} mønter for at låse denne farve op.`;
      this.purchaseMessageType = 'error';
      setTimeout(() => (this.purchaseMessage = ''), 3000);
      return;
    }

    // Purchase the color
    this.planetNameCustomizationService.purchaseColor(this.previewColorId);
    this.coins -= COLOR_COST;
    this.coinsChanged.emit(this.coins);
    this.colorPurchased.emit('name_color');

    // Update current color to the purchased one
    this.currentColor = this.previewColorId;
    this.currentColorHex = colorScheme.color;
    this.previewColorId = '';
    this.planetNameCustomizationService.updateCustomization(this.currentColor);

    this.purchaseMessage = `✓ Farve låst op! Du brugte 🪙 ${COLOR_COST} mønter.`;
    this.purchaseMessageType = 'success';
    setTimeout(() => (this.purchaseMessage = ''), 3000);
  }
}
