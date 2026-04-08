import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type ShapeVariant = 'basic' | 'modern' | 'advanced';

@Component({
  selector: 'app-meteor-building',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg viewBox="0 0 200 200" class="building-svg meteor-building">
      <!-- Basic: Observatory dome -->
      <ng-container *ngIf="variant === 'basic'">
        <!-- Base -->
        <rect x="30" y="130" width="140" height="50" [attr.fill]="primaryColor" stroke="#333" stroke-width="2" />
        <!-- Door -->
        <rect x="85" y="145" width="30" height="35" fill="#8B4513" />
        <!-- Windows -->
        <rect x="50" y="140" width="10" height="10" fill="#FFD700" stroke="#333" stroke-width="1" />
        <rect x="70" y="140" width="10" height="10" fill="#FFD700" stroke="#333" stroke-width="1" />
        <rect x="120" y="140" width="10" height="10" fill="#FFD700" stroke="#333" stroke-width="1" />
        <rect x="140" y="140" width="10" height="10" fill="#FFD700" stroke="#333" stroke-width="1" />
        <!-- Observatory dome -->
        <path d="M 60 80 Q 70 60 100 60 Q 130 60 140 80 Z" [attr.fill]="accentColor" stroke="#333" stroke-width="2" />
        <!-- Dome slit (telescope opening) -->
        <line x1="100" y1="65" x2="100" y2="90" stroke="#333" stroke-width="2" />
        <!-- Telescope -->
        <line x1="100" y1="70" x2="120" y2="50" stroke="#333" stroke-width="2" />
      </ng-container>

      <!-- Modern: Sleek observatory -->
      <ng-container *ngIf="variant === 'modern'">
        <!-- Base -->
        <rect x="35" y="125" width="130" height="55" rx="10" [attr.fill]="primaryColor" stroke="#333" stroke-width="2" />
        <!-- Main section -->
        <rect x="35" y="115" width="130" height="70" rx="10" [attr.fill]="primaryColor" stroke="#333" stroke-width="2" />
        <!-- Door modern -->
        <rect x="80" y="135" width="40" height="50" rx="8" fill="#8B4513" stroke="#333" stroke-width="1" />
        <circle cx="115" cy="160" r="3" fill="#FFD700" />
        <!-- Windows modern -->
        <circle cx="50" cy="130" r="6" fill="#FFD700" stroke="#333" stroke-width="1" />
        <circle cx="70" cy="130" r="6" fill="#FFD700" stroke="#333" stroke-width="1" />
        <circle cx="130" cy="130" r="6" fill="#FFD700" stroke="#333" stroke-width="1" />
        <circle cx="150" cy="130" r="6" fill="#FFD700" stroke="#333" stroke-width="1" />
        <!-- Modern dome -->
        <circle cx="100" cy="85" r="22" [attr.fill]="accentColor" stroke="#333" stroke-width="2" />
        <path d="M 85 85 L 100 70 L 115 85" fill="none" stroke="#333" stroke-width="1" />
        <!-- Telescope on dome -->
        <line x1="95" y1="75" x2="85" y2="55" stroke="#333" stroke-width="2" />
        <circle cx="85" cy="55" r="4" stroke="#333" stroke-width="2" fill="none" />
      </ng-container>

      <!-- Advanced: Futuristic observatory -->
      <ng-container *ngIf="variant === 'advanced'">
        <defs>
          <radialGradient id="meteorGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" [attr.stop-color]="secondaryColor" stop-opacity="0.8" />
            <stop offset="100%" [attr.stop-color]="primaryColor" stop-opacity="0.2" />
          </radialGradient>
        </defs>
        <!-- Base -->
        <path d="M 35 130 L 40 125 L 160 125 L 165 130 L 165 175 Q 165 180 160 180 L 40 180 Q 35 180 35 175 Z" 
          [attr.fill]="primaryColor" stroke="#FFD700" stroke-width="2" />
        <!-- Glow -->
        <ellipse cx="100" cy="155" rx="75" ry="35" fill="url(#meteorGlow)" />
        <!-- Main section -->
        <rect x="40" y="115" width="120" height="70" rx="10" [attr.fill]="primaryColor" stroke="#FFD700" stroke-width="2" />
        <!-- Tech door -->
        <path d="M 78 140 L 122 140 L 122 170 Q 122 175 117 175 L 83 175 Q 78 175 78 170 Z" 
          fill="#8B4513" stroke="#FFD700" stroke-width="2" />
        <circle cx="100" cy="157" r="2" fill="#FFD700" />
        <!-- Tech windows -->
        <circle cx="50" cy="135" r="7" fill="#FFD700" stroke="#FFD700" stroke-width="2" />
        <circle cx="72" cy="135" r="7" fill="#FFD700" stroke="#FFD700" stroke-width="2" />
        <circle cx="128" cy="135" r="7" fill="#FFD700" stroke="#FFD700" stroke-width="2" />
        <circle cx="150" cy="135" r="7" fill="#FFD700" stroke="#FFD700" stroke-width="2" />
        <!-- Advanced dome with rings -->
        <circle cx="100" cy="80" r="25" [attr.fill]="accentColor" stroke="#FFD700" stroke-width="2" />
        <circle cx="100" cy="80" r="30" fill="none" stroke="#FFD700" stroke-width="1" opacity="0.5" />
        <circle cx="100" cy="80" r="35" fill="none" stroke="#FFD700" stroke-width="1" opacity="0.3" />
        <!-- Advanced telescope -->
        <line x1="92" y1="72" x2="70" y2="40" stroke="#FFD700" stroke-width="2" />
        <circle cx="70" cy="40" r="5" fill="none" stroke="#FFD700" stroke-width="2" />
        <circle cx="70" cy="40" r="7" fill="none" stroke="#FFD700" stroke-width="1" opacity="0.5" />
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
export class MeteorBuildingComponent {
  @Input() variant: ShapeVariant = 'basic';
  @Input() primaryColor = '#FF8C00';
  @Input() secondaryColor = '#FFD700';
  @Input() accentColor = '#FF4500';
}
