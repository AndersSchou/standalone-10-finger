import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackgroundCustomizationService } from '../services/background-customization.service';

@Component({
  selector: 'app-background-customizer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="star-color-section">
      <div class="color-options">
        <button
          *ngFor="let color of starColors"
          [class.selected]="isSelectedStar(color.id)"
          [style.--preview-color]="color.hexValue"
          (click)="selectStarColor(color.id)"
          [title]="color.label"
          class="color-btn"
        >
          <span class="color-preview"></span>
          <span class="color-label">{{ color.label }}</span>
        </button>
      </div>

      <!-- Star Color Preview -->
      <div class="preview-section">
        <div class="star-preview-container">
          <svg viewBox="0 0 300 100" class="star-preview">
            <circle cx="30" cy="30" r="4" [style.fill]="selectedStarColor" />
            <circle cx="70" cy="20" r="3" [style.fill]="selectedStarColor" />
            <circle cx="110" cy="40" r="4" [style.fill]="selectedStarColor" />
            <circle cx="150" cy="25" r="3" [style.fill]="selectedStarColor" />
            <circle cx="190" cy="35" r="4" [style.fill]="selectedStarColor" />
            <circle cx="230" cy="20" r="3" [style.fill]="selectedStarColor" />
            <circle cx="270" cy="30" r="4" [style.fill]="selectedStarColor" />
          </svg>
          <p class="star-label">{{ selectedStarLabel }}</p>
        </div>
      </div>
    </div>

    <h4><strong>Skift planetens farve</strong></h4>
    <div class="planet-color-section">
      <div class="color-options">
        <button
          *ngFor="let color of planetColors"
          [class.selected]="isSelectedPlanet(color.id)"
          [style.--preview-color]="color.mainColor"
          (click)="selectPlanetColor(color.id)"
          [title]="color.label"
          class="color-btn"
        >
          <span class="color-preview"></span>
          <span class="color-label">{{ color.label }}</span>
        </button>
      </div>

      <!-- Planet Color Preview -->
      <div class="preview-section">
        <div class="planet-preview-container">
          <svg viewBox="0 0 200 200" class="planet-preview">
            <circle cx="100" cy="100" r="80" [style.fill]="selectedPlanetMainColor" />
            <circle cx="70" cy="80" r="15" [style.fill]="selectedPlanetLightColor" />
            <circle cx="130" cy="90" r="12" [style.fill]="selectedPlanetDarkColor" />
            <circle cx="100" cy="140" r="14" [style.fill]="selectedPlanetLightColor" />
          </svg>
          <p class="planet-label">{{ selectedPlanetLabel }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .star-color-section {
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }

    .planet-color-section {
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }

    h3 {
      margin: 0 0 16px 0;
      color: #333;
      font-size: 1.1rem;
      border-bottom: 3px solid #667eea;
      padding-bottom: 10px;
    }

    h4 {
      margin: 20px 0 16px 0;
      color: #333;
      font-size: 1.1rem;
      border-bottom: 2px solid #cfd8dc;
      padding-bottom: 10px;
    }

    .planet-color-section h3 {
      margin-top: 0;
    }

    .color-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 12px;
    }

    .color-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 12px;
      border: 3px solid #ddd;
      border-radius: 10px;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        border-color: #667eea;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
      }

      &.selected {
        border-color: #667eea;
        background: #e8eaf6;
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);

        .color-preview {
          box-shadow: 0 0 10px rgba(102, 126, 234, 0.6);
        }
      }
    }

    .color-preview {
      width: 50px;
      height: 50px;
      border-radius: 8px;
      background: linear-gradient(135deg, var(--preview-color) 0%, var(--preview-color) 100%);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transition: box-shadow 0.3s ease;
    }

    .color-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #333;
      text-align: center;
    }

    .preview-section {
      margin-top: 24px;
      padding: 20px;
      background: white;
      border-radius: 8px;
      display: flex;
      justify-content: center;
    }

    .star-preview-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      background: #000000;
      padding: 20px;
      border-radius: 8px;
      width: 100%;
    }

    .star-preview {
      width: 300px;
      height: 80px;
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15));
    }

    .star-label {
      margin: 0;
      color: #ffffff;
      font-size: 0.95rem;
      font-weight: 600;
    }

    .planet-preview-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .planet-preview {
      width: 150px;
      height: 150px;
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
    }

    .planet-label {
      margin: 0;
      color: #333;
      font-size: 1rem;
      font-weight: 600;
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
  starColors = this.backgroundCustomization.starColors;
  planetColors = this.backgroundCustomization.planetColors;

  selectedStarColor = '#FFFFFF';
  selectedStarLabel = 'Hvid';
  selectedPlanetMainColor = '#8a8a8a';
  selectedPlanetLightColor = '#9a9a9a';
  selectedPlanetDarkColor = '#7a7a7a';
  selectedPlanetLabel = 'Grå';

  @Output() planetColorChanged = new EventEmitter<void>();

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

  selectStarColor(colorId: string): void {
    this.backgroundCustomization.setStarColor(colorId);
    const selectedColor = this.backgroundCustomization.getCurrentStarColor();
    this.updateStarPreview(selectedColor);
  }

  isSelectedPlanet(colorId: string): boolean {
    return this.backgroundCustomization.getCurrentPlanetColor().id === colorId;
  }

  selectPlanetColor(colorId: string): void {
    this.backgroundCustomization.setPlanetColor(colorId);
    const selectedColor = this.backgroundCustomization.getCurrentPlanetColor();
    this.updatePlanetPreview(selectedColor);
    // Refresh the SVG with new colors
    this.updateSVGColors(selectedColor);
    // Notify parent component
    this.planetColorChanged.emit();
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
