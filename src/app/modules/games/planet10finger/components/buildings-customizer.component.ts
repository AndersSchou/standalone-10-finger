import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuildingCustomizationService, CustomizationState, ShapeVariant, COLOR_COST } from '../services/building-customization.service';
import { PowerBuildingComponent } from 'src/app/shared/svgs/power-building.component';
import { OxygenBuildingComponent } from 'src/app/shared/svgs/oxygen-building.component';
import { MeteorBuildingComponent } from 'src/app/shared/svgs/meteor-building.component';
import { FactoryBuildingComponent } from 'src/app/shared/svgs/factory-building.component';
import { AssemblingBuildingComponent } from 'src/app/shared/svgs/assembling-building.component';

type GameId = 'power' | 'oxygen' | 'meteor' | 'factory' | 'assembling';

interface GameInfo {
  id: GameId;
  label: string;
  component: any;
}

@Component({
  selector: 'app-buildings-customizer',
  standalone: true,
  imports: [
    CommonModule,
    PowerBuildingComponent,
    OxygenBuildingComponent,
    MeteorBuildingComponent,
    FactoryBuildingComponent,
    AssemblingBuildingComponent,
  ],
  template: `
    <div class="buildings-customizer">
      <h3>Tilpas dine bygninger</h3>
      <p class="subtitle">Vælg farve og design til hver bygning</p>

      <!-- Buildings grid -->
      <div class="buildings-grid">
        <div class="building-card" *ngFor="let game of games">
          <!-- Building preview -->
          <div class="building-preview" [class.preview-mode]="!!selectedColorId[game.id]">
            <ng-container [ngSwitch]="game.id">
              <app-power-building
                *ngSwitchCase="'power'"
                [variant]="customization[game.id].shapeVariant"
                [primaryColor]="getPreviewPrimaryColor(game.id)"
                [secondaryColor]="getPreviewSecondaryColor(game.id)"
                [accentColor]="getPreviewAccentColor(game.id)"
              ></app-power-building>
              <app-oxygen-building
                *ngSwitchCase="'oxygen'"
                [variant]="customization[game.id].shapeVariant"
                [primaryColor]="getPreviewPrimaryColor(game.id)"
                [secondaryColor]="getPreviewSecondaryColor(game.id)"
                [accentColor]="getPreviewAccentColor(game.id)"
              ></app-oxygen-building>
              <app-meteor-building
                *ngSwitchCase="'meteor'"
                [variant]="customization[game.id].shapeVariant"
                [primaryColor]="getPreviewPrimaryColor(game.id)"
                [secondaryColor]="getPreviewSecondaryColor(game.id)"
                [accentColor]="getPreviewAccentColor(game.id)"
              ></app-meteor-building>
              <app-factory-building
                *ngSwitchCase="'factory'"
                [variant]="customization[game.id].shapeVariant"
                [primaryColor]="getPreviewPrimaryColor(game.id)"
                [secondaryColor]="getPreviewSecondaryColor(game.id)"
                [accentColor]="getPreviewAccentColor(game.id)"
              ></app-factory-building>
              <app-assembling-building
                *ngSwitchCase="'assembling'"
                [variant]="customization[game.id].shapeVariant"
                [primaryColor]="getPreviewPrimaryColor(game.id)"
                [secondaryColor]="getPreviewSecondaryColor(game.id)"
                [accentColor]="getPreviewAccentColor(game.id)"
              ></app-assembling-building>
            </ng-container>
          </div>

          <!-- Building label -->
          <h4>{{ game.label }}</h4>

          <!-- Color selector -->
          <div class="color-selector">
            <label>Farve:</label>
            <div class="color-options">
              <button
                *ngFor="let color of colorSchemes"
                [class.selected]="customization[game.id].colorScheme === color.id"
                [class.locked]="!isColorPurchased(color.id)"
                [style.--color]="color.primary"
                (click)="selectColor(game.id, color.id)"
                [title]="isColorPurchased(color.id) ? color.label : color.label + ' - 🪙 ' + colorCost + ' mønter'"
                class="color-btn"
              >
                <span class="color-swatch"></span>
                <span class="color-name">{{ color.label }}</span>
                <span class="lock-icon" *ngIf="!isColorPurchased(color.id)">🔒</span>
              </button>
            </div>
          </div>

          <!-- Purchase button for locked colors -->
          <button
            *ngIf="selectedColorId[game.id] && !isColorPurchased(selectedColorId[game.id]) && customization[game.id].colorScheme !== selectedColorId[game.id]"
            class="buy-button"
            (click)="buyBuildingColor(game.id, selectedColorId[game.id])"
          >
            Køb farve - 🪙 {{ colorCost }} mønter
          </button>

          <!-- Shape variant selector -->
          <div class="shape-selector">
            <label>Design:</label>
            <div class="shape-options">
              <button
                *ngFor="let variant of shapeVariants"
                [class.selected]="customization[game.id].shapeVariant === variant"
                (click)="updateShape(game.id, variant)"
                class="shape-btn"
              >
                {{ getShapeLabel(variant) }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .buildings-customizer {
      background: #f9f9f9;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }

    h3 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 1.2rem;
      border-bottom: 3px solid #667eea;
      padding-bottom: 10px;
    }

    .subtitle {
      margin: 0 0 20px 0;
      color: #666;
      font-size: 0.95rem;
      font-style: italic;
    }

    .buildings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .building-card {
      background: white;
      border: 2px solid #ddd;
      border-radius: 10px;
      padding: 15px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: all 0.3s ease;

      &:hover {
        border-color: #667eea;
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.15);
      }
    }

    .building-preview {
      width: 100%;
      height: 140px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      border-radius: 8px;
      border: 1px solid #eee;
      transition: all 0.3s ease;
    }

    .building-preview.preview-mode {
      border: 2px solid #667eea;
      background: #f0f0ff;
      box-shadow: 0 0 12px rgba(102, 126, 234, 0.2);
    }

    h4 {
      margin: 0;
      color: #333;
      font-size: 1rem;
      text-align: center;
    }

    .color-selector,
    .shape-selector {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #555;
    }

    .color-options {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
    }

    .color-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 8px;
      border: 2px solid #ddd;
      border-radius: 6px;
      background: white;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.2s ease;
      position: relative;

      &:hover:not(.locked) {
        border-color: #667eea;
        background: #f0f0f0;
      }

      &:hover.locked {
        border-color: #ddd;
        opacity: 0.7;
      }

      &.selected {
        border-color: #667eea;
        background: #e8eaf6;
        font-weight: 600;
      }

      &.locked {
        opacity: 0.6;
      }
    }

    .color-swatch {
      width: 16px;
      height: 16px;
      border-radius: 3px;
      background-color: var(--color);
      border: 1px solid #999;
    }

    .color-name {
      flex: 1;
      text-align: left;
    }

    .lock-icon {
      font-size: 0.9rem;
    }

    .buy-button {
      width: 100%;
      padding: 8px 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: -8px;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .shape-options {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
    }

    .shape-btn {
      padding: 6px 8px;
      border: 2px solid #ddd;
      border-radius: 6px;
      background: white;
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 500;
      transition: all 0.2s ease;

      &:hover {
        border-color: #667eea;
        background: #f0f0f0;
      }

      &.selected {
        border-color: #667eea;
        background: #e8eaf6;
        font-weight: 700;
      }
    }

    @media (max-width: 768px) {
      .buildings-grid {
        grid-template-columns: 1fr;
      }

      .color-options {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  `]
})
export class BuildingsCustomizerComponent implements OnInit {
  customization: CustomizationState = {
    power: { colorScheme: '', shapeVariant: 'basic', primaryColor: '', secondaryColor: '', accentColor: '' },
    oxygen: { colorScheme: '', shapeVariant: 'basic', primaryColor: '', secondaryColor: '', accentColor: '' },
    meteor: { colorScheme: '', shapeVariant: 'basic', primaryColor: '', secondaryColor: '', accentColor: '' },
    factory: { colorScheme: '', shapeVariant: 'basic', primaryColor: '', secondaryColor: '', accentColor: '' },
    assembling: { colorScheme: '', shapeVariant: 'basic', primaryColor: '', secondaryColor: '', accentColor: '' },
  };

  games: GameInfo[] = [
    { id: 'power', label: 'Strøm - Kraftværk', component: PowerBuildingComponent },
    { id: 'oxygen', label: 'Ilt - Lab', component: OxygenBuildingComponent },
    { id: 'meteor', label: 'Meteor - Observatorium', component: MeteorBuildingComponent },
    { id: 'factory', label: 'Fabrik - Fabrikken', component: FactoryBuildingComponent },
    { id: 'assembling', label: 'Samling - Lager', component: AssemblingBuildingComponent },
  ];

  colorSchemes: any[] = [];
  shapeVariants: ShapeVariant[] = [];
  selectedColorId: Record<GameId, string> = { power: '', oxygen: '', meteor: '', factory: '', assembling: '' };
  colorCost = COLOR_COST;

  @Input() coins: number = 0;
  @Output() coinsChanged = new EventEmitter<number>();

  constructor(private buildingCustomization: BuildingCustomizationService) {}

  ngOnInit(): void {
    this.colorSchemes = this.buildingCustomization.getColorSchemes();
    this.shapeVariants = this.buildingCustomization.getShapeVariants();
    this.customization = this.buildingCustomization.getCustomizationState();
  }

  selectColor(gameId: GameId, colorScheme: string): void {
    // If clicking on same color or grey (always free) or already purchased, apply immediately
    if (this.customization[gameId].colorScheme === colorScheme || colorScheme === 'grey' || this.isColorPurchased(colorScheme)) {
      this.updateColor(gameId, colorScheme);
      this.selectedColorId[gameId] = '';
    } else {
      // Set for preview and show buy button
      this.selectedColorId[gameId] = colorScheme;
    }
  }

  updateColor(gameId: GameId, colorScheme: string): void {
    const current = this.customization[gameId];
    this.buildingCustomization.updateBuildingCustomization(gameId, colorScheme, current.shapeVariant);
    this.customization = this.buildingCustomization.getCustomizationState();
    this.selectedColorId[gameId] = '';
  }

  isColorPurchased(colorId: string): boolean {
    return this.buildingCustomization.isColorPurchased(colorId);
  }

  getPreviewPrimaryColor(gameId: GameId): string {
    const selectedId = this.selectedColorId[gameId];
    if (selectedId) {
      const color = this.colorSchemes.find(c => c.id === selectedId);
      if (color) return color.primary;
    }
    return this.customization[gameId].primaryColor;
  }

  getPreviewSecondaryColor(gameId: GameId): string {
    const selectedId = this.selectedColorId[gameId];
    if (selectedId) {
      const color = this.colorSchemes.find(c => c.id === selectedId);
      if (color) return color.secondary;
    }
    return this.customization[gameId].secondaryColor;
  }

  getPreviewAccentColor(gameId: GameId): string {
    const selectedId = this.selectedColorId[gameId];
    if (selectedId) {
      const color = this.colorSchemes.find(c => c.id === selectedId);
      if (color) return color.accent;
    }
    return this.customization[gameId].accentColor;
  }

  buyBuildingColor(gameId: GameId, colorId: string): void {
    if (!colorId) return;

    const colorScheme = this.colorSchemes.find(c => c.id === colorId);
    if (!colorScheme) return;

    // Check if user has enough coins
    if (this.coins < COLOR_COST) {
      return;
    }

    // Purchase the color
    this.buildingCustomization.purchaseColor(colorId);
    this.coins -= COLOR_COST;
    this.coinsChanged.emit(this.coins);

    // Update building color to the purchased one
    this.updateColor(gameId, colorId);
    this.selectedColorId[gameId] = '';
  }

  updateShape(gameId: GameId, variant: ShapeVariant): void {
    const current = this.customization[gameId];
    this.buildingCustomization.updateBuildingCustomization(gameId, current.colorScheme, variant);
    this.customization = this.buildingCustomization.getCustomizationState();
  }

  getShapeLabel(variant: ShapeVariant): string {
    const labels: Record<ShapeVariant, string> = {
      basic: 'Simpel',
      modern: 'Moderne',
      advanced: 'Futuristisk',
    };
    return labels[variant];
  }
}
