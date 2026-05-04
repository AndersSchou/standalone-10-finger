import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type ShapeVariant = 'basic' | 'modern' | 'advanced';

@Component({
  selector: 'app-headquarters-building',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="headquarters-container">
      <!-- Info icon above -->
      <div class="info-icon-container">
        <svg viewBox="0 0 64 64" class="info-icon">
          <!-- Circle background -->
          <circle cx="32" cy="32" r="28" fill="#667eea" stroke="#333" stroke-width="2"/>
          <!-- Info symbol -->
          <circle cx="32" cy="20" r="3" fill="white"/>
          <rect x="30" y="28" width="4" height="20" fill="white"/>
        </svg>
      </div>

      <!-- Main headquarters building -->
      <svg viewBox="0 0 200 200" class="building-svg headquarters-building">
        <!-- Basic: Simple control tower -->
        <ng-container *ngIf="variant === 'basic'">
          <!-- Base structure -->
          <rect x="40" y="100" width="120" height="80" [attr.fill]="primaryColor" stroke="#333" stroke-width="2" />
          <!-- Main entrance -->
          <rect x="80" y="120" width="40" height="60" fill="#8B4513" stroke="#333" stroke-width="2" />
          <circle cx="100" cy="165" r="4" fill="#FFD700" />
          <!-- Windows -->
          <rect x="50" y="110" width="15" height="15" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
          <rect x="75" y="110" width="15" height="15" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
          <rect x="110" y="110" width="15" height="15" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
          <rect x="135" y="110" width="15" height="15" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
          <!-- Control tower -->
          <rect x="75" y="40" width="50" height="70" [attr.fill]="primaryColor" stroke="#333" stroke-width="2" />
          <!-- Tower top (antenna) -->
          <polygon points="100,30 110,40 90,40" [attr.fill]="accentColor" stroke="#333" stroke-width="2" />
          <line x1="100" y1="30" x2="100" y2="10" stroke="#FF0000" stroke-width="3" />
          <!-- Tower windows -->
          <rect x="80" y="50" width="12" height="12" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
          <rect x="108" y="50" width="12" height="12" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
          <rect x="80" y="70" width="12" height="12" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
          <rect x="108" y="70" width="12" height="12" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
        </ng-container>

        <!-- Modern: Sleek control center -->
        <ng-container *ngIf="variant === 'modern'">
          <!-- Base building with rounded corners -->
          <path d="M 40 105 Q 35 105 35 115 L 35 175 Q 35 180 40 180 L 160 180 Q 165 180 165 175 L 165 115 Q 165 105 160 105 Z" 
            [attr.fill]="primaryColor" stroke="#333" stroke-width="2" />
          <!-- Entrance -->
          <rect x="75" y="125" width="50" height="55" rx="5" fill="#2C2C2C" stroke="#333" stroke-width="2" />
          <circle cx="100" cy="168" r="5" fill="#FFD700" />
          <!-- Windows in base -->
          <rect x="45" y="115" width="14" height="14" rx="2" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
          <rect x="65" y="115" width="14" height="14" rx="2" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
          <rect x="120" y="115" width="14" height="14" rx="2" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
          <rect x="140" y="115" width="14" height="14" rx="2" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
          <!-- Control tower with antenna -->
          <rect x="70" y="35" width="60" height="75" rx="5" [attr.fill]="primaryColor" stroke="#333" stroke-width="2" />
          <!-- Tower windows -->
          <rect x="80" y="50" width="12" height="12" rx="2" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
          <rect x="108" y="50" width="12" height="12" rx="2" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
          <rect x="80" y="70" width="12" height="12" rx="2" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
          <rect x="108" y="70" width="12" height="12" rx="2" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
          <!-- Modern antenna -->
          <line x1="100" y1="35" x2="100" y2="15" stroke="#FF0000" stroke-width="3" stroke-linecap="round" />
          <circle cx="100" cy="12" r="4" fill="#FF0000" />
        </ng-container>

        <!-- Advanced: Futuristic command center -->
        <ng-container *ngIf="variant === 'advanced'">
          <defs>
            <radialGradient id="hqGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" [attr.stop-color]="secondaryColor" stop-opacity="0.8" />
              <stop offset="100%" [attr.stop-color]="primaryColor" stop-opacity="0.2" />
            </radialGradient>
            <filter id="hqShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#00FF00" flood-opacity="0.5"/>
            </filter>
          </defs>
          <!-- Glow effect -->
          <ellipse cx="100" cy="140" rx="80" ry="45" fill="url(#hqGlow)" />
          <!-- Base structure with glow -->
          <path d="M 35 110 L 42 105 L 158 105 L 165 110 L 165 175 Q 165 180 160 180 L 40 180 Q 35 180 35 175 Z" 
            [attr.fill]="primaryColor" stroke="#00FF00" stroke-width="2.5" filter="url(#hqShadow)" />
          <!-- High-tech entrance -->
          <path d="M 75 130 L 125 130 L 125 165 Q 125 170 120 170 L 80 170 Q 75 170 75 165 Z" 
            fill="#001a4d" stroke="#00FF00" stroke-width="2" />
          <!-- Tech door details -->
          <circle cx="100" cy="155" r="3" fill="#00FF00" />
          <line x1="100" y1="140" x2="100" y2="170" stroke="#00FF00" stroke-width="1" opacity="0.5" />
          <!-- Advanced windows -->
          <circle cx="50" cy="120" r="7" [attr.fill]="secondaryColor" stroke="#00FF00" stroke-width="1.5" />
          <circle cx="70" cy="120" r="7" [attr.fill]="secondaryColor" stroke="#00FF00" stroke-width="1.5" />
          <circle cx="130" cy="120" r="7" [attr.fill]="secondaryColor" stroke="#00FF00" stroke-width="1.5" />
          <circle cx="150" cy="120" r="7" [attr.fill]="secondaryColor" stroke="#00FF00" stroke-width="1.5" />
          <!-- Command tower -->
          <path d="M 70 35 L 75 32 L 125 32 L 130 35 L 130 110 L 70 110 Z" 
            [attr.fill]="primaryColor" stroke="#00FF00" stroke-width="2" />
          <!-- Tower tech windows -->
          <rect x="80" y="50" width="11" height="11" [attr.fill]="secondaryColor" stroke="#00FF00" stroke-width="1" />
          <rect x="109" y="50" width="11" height="11" [attr.fill]="secondaryColor" stroke="#00FF00" stroke-width="1" />
          <rect x="80" y="75" width="11" height="11" [attr.fill]="secondaryColor" stroke="#00FF00" stroke-width="1" />
          <rect x="109" y="75" width="11" height="11" [attr.fill]="secondaryColor" stroke="#00FF00" stroke-width="1" />
          <!-- Futuristic antenna with energy rings -->
          <circle cx="100" cy="25" r="5" fill="none" stroke="#00FF00" stroke-width="1.5" opacity="0.6" />
          <circle cx="100" cy="25" r="8" fill="none" stroke="#00FF00" stroke-width="1" opacity="0.3" />
          <line x1="100" y1="20" x2="100" y2="5" stroke="#FF00FF" stroke-width="2.5" />
          <circle cx="100" cy="3" r="3" fill="#FF00FF" />
        </ng-container>
      </svg>
    </div>
  `,
  styles: [`
    .headquarters-container {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .info-icon-container {
      position: absolute;
      top: -40px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
    }

    .info-icon {
      width: 36px;
      height: 36px;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    }

    .building-svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
    }
  `]
})
export class HeadquartersBuildingComponent {
  @Input() variant: ShapeVariant = 'basic';
  @Input() primaryColor = '#808080';
  @Input() secondaryColor = '#A9A9A9';
  @Input() accentColor = '#555555';
}
