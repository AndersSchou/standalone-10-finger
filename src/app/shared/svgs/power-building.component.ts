import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type ShapeVariant = 'basic' | 'modern' | 'advanced';

@Component({
  selector: 'app-power-building',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg viewBox="0 0 200 200" class="building-svg power-building">
      <!-- Basic: Simple industrial building with stacks -->
      <ng-container *ngIf="variant === 'basic'">
        <!-- Base -->
        <rect x="30" y="120" width="140" height="60" [attr.fill]="primaryColor" stroke="#333" stroke-width="2" />
        <!-- Door -->
        <rect x="85" y="140" width="30" height="40" fill="#8B0000" />
        <!-- Windows -->
        <rect x="50" y="130" width="12" height="12" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
        <rect x="70" y="130" width="12" height="12" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
        <rect x="120" y="130" width="12" height="12" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
        <rect x="140" y="130" width="12" height="12" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
        <!-- Stacks (smokestacks) -->
        <rect x="50" y="60" width="12" height="60" [attr.fill]="accentColor" stroke="#333" stroke-width="1" />
        <rect x="94" y="50" width="12" height="70" [attr.fill]="accentColor" stroke="#333" stroke-width="1" />
        <rect x="138" y="65" width="12" height="55" [attr.fill]="accentColor" stroke="#333" stroke-width="1" />
        <!-- Smoke effect (circles) -->
        <circle cx="56" cy="50" r="4" fill="#999" opacity="0.6" />
        <circle cx="100" cy="40" r="4" fill="#999" opacity="0.6" />
        <circle cx="144" cy="55" r="4" fill="#999" opacity="0.6" />
      </ng-container>

      <!-- Modern: Sleek design with rounded edges -->
      <ng-container *ngIf="variant === 'modern'">
        <!-- Base with rounded corners -->
        <path d="M 40 120 Q 30 120 30 130 L 30 170 Q 30 180 40 180 L 160 180 Q 170 180 170 170 L 170 130 Q 170 120 160 120 Z" 
          [attr.fill]="primaryColor" stroke="#333" stroke-width="2" />
        <!-- Main section -->
        <rect x="35" y="110" width="130" height="70" rx="10" [attr.fill]="primaryColor" stroke="#333" stroke-width="2" />
        <!-- Door modern style -->
        <rect x="80" y="130" width="40" height="50" rx="5" fill="#C41E3A" stroke="#333" stroke-width="1" />
        <circle cx="115" cy="155" r="3" fill="#FFD700" />
        <!-- Windows modern style -->
        <rect x="45" y="125" width="15" height="15" rx="3" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
        <rect x="70" y="125" width="15" height="15" rx="3" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
        <rect x="125" y="125" width="15" height="15" rx="3" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
        <rect x="150" y="125" width="15" height="15" rx="3" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
        <!-- Modern stacks (turbines) -->
        <g transform="translate(60, 70)">
          <circle cx="0" cy="0" r="8" [attr.fill]="accentColor" stroke="#333" stroke-width="1" />
          <line x1="0" y1="-8" x2="0" y2="-20" stroke="#333" stroke-width="2" />
        </g>
        <g transform="translate(100, 60)">
          <circle cx="0" cy="0" r="8" [attr.fill]="accentColor" stroke="#333" stroke-width="1" />
          <line x1="0" y1="-8" x2="0" y2="-25" stroke="#333" stroke-width="2" />
        </g>
        <g transform="translate(140, 75)">
          <circle cx="0" cy="0" r="8" [attr.fill]="accentColor" stroke="#333" stroke-width="1" />
          <line x1="0" y1="-8" x2="0" y2="-18" stroke="#333" stroke-width="2" />
        </g>
      </ng-container>

      <!-- Advanced: Futuristic design with glow effects -->
      <ng-container *ngIf="variant === 'advanced'">
        <defs>
          <radialGradient id="powerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" [attr.stop-color]="secondaryColor" stop-opacity="0.8" />
            <stop offset="100%" [attr.stop-color]="primaryColor" stop-opacity="0.2" />
          </radialGradient>
        </defs>
        <!-- Base -->
        <path d="M 35 125 L 40 120 L 160 120 L 165 125 L 165 175 Q 165 180 160 180 L 40 180 Q 35 180 35 175 Z" 
          [attr.fill]="primaryColor" stroke="#FFD700" stroke-width="2" />
        <!-- Glow effect -->
        <ellipse cx="100" cy="150" rx="75" ry="35" fill="url(#powerGlow)" />
        <!-- Core section -->
        <rect x="45" y="115" width="110" height="65" rx="8" [attr.fill]="primaryColor" stroke="#FFD700" stroke-width="2" />
        <!-- Tech door -->
        <path d="M 80 135 L 120 135 L 120 165 Q 120 170 115 170 L 85 170 Q 80 170 80 165 Z" 
          fill="#FF1493" stroke="#FFD700" stroke-width="2" />
        <circle cx="100" cy="150" r="2" fill="#FFD700" />
        <!-- Tech windows -->
        <circle cx="50" cy="130" r="6" [attr.fill]="secondaryColor" stroke="#FFD700" stroke-width="1" />
        <circle cx="70" cy="130" r="6" [attr.fill]="secondaryColor" stroke="#FFD700" stroke-width="1" />
        <circle cx="130" cy="130" r="6" [attr.fill]="secondaryColor" stroke="#FFD700" stroke-width="1" />
        <circle cx="150" cy="130" r="6" [attr.fill]="secondaryColor" stroke="#FFD700" stroke-width="1" />
        <!-- Advanced turbines with energy rings -->
        <g transform="translate(60, 70)">
          <circle cx="0" cy="0" r="10" [attr.fill]="accentColor" stroke="#FFD700" stroke-width="2" />
          <circle cx="0" cy="0" r="14" fill="none" stroke="#FFD700" stroke-width="1" opacity="0.5" />
          <line x1="0" y1="-10" x2="0" y2="-25" stroke="#FFD700" stroke-width="2" />
        </g>
        <g transform="translate(100, 55)">
          <circle cx="0" cy="0" r="10" [attr.fill]="accentColor" stroke="#FFD700" stroke-width="2" />
          <circle cx="0" cy="0" r="14" fill="none" stroke="#FFD700" stroke-width="1" opacity="0.5" />
          <line x1="0" y1="-10" x2="0" y2="-30" stroke="#FFD700" stroke-width="2" />
        </g>
        <g transform="translate(140, 75)">
          <circle cx="0" cy="0" r="10" [attr.fill]="accentColor" stroke="#FFD700" stroke-width="2" />
          <circle cx="0" cy="0" r="14" fill="none" stroke="#FFD700" stroke-width="1" opacity="0.5" />
          <line x1="0" y1="-10" x2="0" y2="-20" stroke="#FFD700" stroke-width="2" />
        </g>
      </ng-container>
    </svg>
  `,
  styles: [`
    .building-svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
    }
  `]
})
export class PowerBuildingComponent {
  @Input() variant: ShapeVariant = 'basic';
  @Input() primaryColor = '#808080';
  @Input() secondaryColor = '#A9A9A9';
  @Input() accentColor = '#555555';
}
