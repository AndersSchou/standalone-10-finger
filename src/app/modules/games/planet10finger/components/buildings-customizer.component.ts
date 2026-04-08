import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuildingCustomizationService, CustomizationState, ShapeVariant } from '../services/building-customization.service';
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
          <div class="building-preview">
            <ng-container [ngSwitch]="game.id">
              <app-power-building
                *ngSwitchCase="'power'"
                [variant]="customization[game.id].shapeVariant"
                [primaryColor]="customization[game.id].primaryColor"
                [secondaryColor]="customization[game.id].secondaryColor"
                [accentColor]="customization[game.id].accentColor"
              ></app-power-building>
              <app-oxygen-building
                *ngSwitchCase="'oxygen'"
                [variant]="customization[game.id].shapeVariant"
                [primaryColor]="customization[game.id].primaryColor"
                [secondaryColor]="customization[game.id].secondaryColor"
                [accentColor]="customization[game.id].accentColor"
              ></app-oxygen-building>
              <app-meteor-building
                *ngSwitchCase="'meteor'"
                [variant]="customization[game.id].shapeVariant"
                [primaryColor]="customization[game.id].primaryColor"
                [secondaryColor]="customization[game.id].secondaryColor"
                [accentColor]="customization[game.id].accentColor"
              ></app-meteor-building>
              <app-factory-building
                *ngSwitchCase="'factory'"
                [variant]="customization[game.id].shapeVariant"
                [primaryColor]="customization[game.id].primaryColor"
                [secondaryColor]="customization[game.id].secondaryColor"
                [accentColor]="customization[game.id].accentColor"
              ></app-factory-building>
              <app-assembling-building
                *ngSwitchCase="'assembling'"
                [variant]="customization[game.id].shapeVariant"
                [primaryColor]="customization[game.id].primaryColor"
                [secondaryColor]="customization[game.id].secondaryColor"
                [accentColor]="customization[game.id].accentColor"
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
                [style.--color]="color.primary"
                (click)="updateColor(game.id, color.id)"
                [title]="color.label"
                class="color-btn"
              >
                <span class="color-swatch"></span>
                <span class="color-name">{{ color.label }}</span>
              </button>
            </div>
          </div>

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

      &:hover {
        border-color: #667eea;
        background: #f0f0f0;
      }

      &.selected {
        border-color: #667eea;
        background: #e8eaf6;
        font-weight: 600;
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

  constructor(private buildingCustomization: BuildingCustomizationService) {}

  ngOnInit(): void {
    this.colorSchemes = this.buildingCustomization.getColorSchemes();
    this.shapeVariants = this.buildingCustomization.getShapeVariants();
    this.customization = this.buildingCustomization.getCustomizationState();
  }

  updateColor(gameId: GameId, colorScheme: string): void {
    const current = this.customization[gameId];
    this.buildingCustomization.updateBuildingCustomization(gameId, colorScheme, current.shapeVariant);
    this.customization = this.buildingCustomization.getCustomizationState();
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
