import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type ShapeVariant = 'basic' | 'modern' | 'advanced';

@Component({
  selector: 'app-oxygen-building',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg viewBox="0 0 200 200" class="building-svg oxygen-building">
      <!-- Basic: Chemistry lab with beakers -->
      <ng-container *ngIf="variant === 'basic'">
        <!-- Base -->
        <rect x="30" y="130" width="140" height="50" [attr.fill]="primaryColor" stroke="#333" stroke-width="2" />
        <!-- Door -->
        <rect x="85" y="145" width="30" height="35" fill="#1E90FF" />
        <!-- Windows -->
        <rect x="50" y="140" width="10" height="10" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
        <rect x="70" y="140" width="10" height="10" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
        <rect x="120" y="140" width="10" height="10" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
        <rect x="140" y="140" width="10" height="10" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
        <!-- Beaker towers -->
        <path d="M 50 90 L 45 130 L 55 130 Z" [attr.fill]="accentColor" stroke="#333" stroke-width="1" />
        <path d="M 100 80 L 95 130 L 105 130 Z" [attr.fill]="accentColor" stroke="#333" stroke-width="1" />
        <path d="M 150 95 L 145 130 L 155 130 Z" [attr.fill]="accentColor" stroke="#333" stroke-width="1" />
        <!-- Liquid in beakers -->
        <path d="M 46 120 L 50 125 L 54 120 Z" fill="#00FF00" opacity="0.7" />
        <path d="M 96 115 L 100 120 L 104 115 Z" fill="#00FF00" opacity="0.7" />
        <path d="M 146 125 L 150 130 L 154 125 Z" fill="#00FF00" opacity="0.7" />
      </ng-container>

      <!-- Modern: Sleek lab with rounded containers -->
      <ng-container *ngIf="variant === 'modern'">
        <!-- Base -->
        <rect x="35" y="125" width="130" height="55" rx="10" [attr.fill]="primaryColor" stroke="#333" stroke-width="2" />
        <!-- Main section -->
        <rect x="35" y="115" width="130" height="70" rx="10" [attr.fill]="primaryColor" stroke="#333" stroke-width="2" />
        <!-- Door modern -->
        <rect x="80" y="135" width="40" height="50" rx="8" fill="#1E90FF" stroke="#333" stroke-width="1" />
        <circle cx="115" cy="160" r="3" fill="#FFD700" />
        <!-- Windows modern -->
        <circle cx="50" cy="130" r="6" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
        <circle cx="70" cy="130" r="6" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
        <circle cx="130" cy="130" r="6" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
        <circle cx="150" cy="130" r="6" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
        <!-- Rounded beaker towers -->
        <path d="M 55 95 Q 50 100 50 110 L 50 125 L 60 125 L 60 110 Q 60 100 55 95 Z" 
          [attr.fill]="accentColor" stroke="#333" stroke-width="1" />
        <path d="M 100 85 Q 95 90 95 100 L 95 125 L 105 125 L 105 100 Q 105 90 100 85 Z" 
          [attr.fill]="accentColor" stroke="#333" stroke-width="1" />
        <path d="M 145 100 Q 140 105 140 115 L 140 125 L 150 125 L 150 115 Q 150 105 145 100 Z" 
          [attr.fill]="accentColor" stroke="#333" stroke-width="1" />
        <!-- Liquid levels -->
        <ellipse cx="55" cy="120" rx="5" ry="2" fill="#00FF00" opacity="0.8" />
        <ellipse cx="100" cy="118" rx="5" ry="2" fill="#00FF00" opacity="0.8" />
        <ellipse cx="145" cy="122" rx="5" ry="2" fill="#00FF00" opacity="0.8" />
      </ng-container>

      <!-- Advanced: Futuristic lab with glow -->
      <ng-container *ngIf="variant === 'advanced'">
        <defs>
          <radialGradient id="oxygenGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" [attr.stop-color]="secondaryColor" stop-opacity="0.8" />
            <stop offset="100%" [attr.stop-color]="primaryColor" stop-opacity="0.2" />
          </radialGradient>
        </defs>
        <!-- Base -->
        <path d="M 35 130 L 40 125 L 160 125 L 165 130 L 165 175 Q 165 180 160 180 L 40 180 Q 35 180 35 175 Z" 
          [attr.fill]="primaryColor" stroke="#00FF00" stroke-width="2" />
        <!-- Glow -->
        <ellipse cx="100" cy="155" rx="75" ry="35" fill="url(#oxygenGlow)" />
        <!-- Main section -->
        <rect x="40" y="115" width="120" height="70" rx="10" [attr.fill]="primaryColor" stroke="#00FF00" stroke-width="2" />
        <!-- Tech door -->
        <path d="M 78 140 L 122 140 L 122 170 Q 122 175 117 175 L 83 175 Q 78 175 78 170 Z" 
          fill="#1E90FF" stroke="#00FF00" stroke-width="2" />
        <circle cx="100" cy="157" r="2" fill="#00FF00" />
        <!-- Tech windows -->
        <circle cx="50" cy="135" r="7" [attr.fill]="secondaryColor" stroke="#00FF00" stroke-width="2" />
        <circle cx="72" cy="135" r="7" [attr.fill]="secondaryColor" stroke="#00FF00" stroke-width="2" />
        <circle cx="128" cy="135" r="7" [attr.fill]="secondaryColor" stroke="#00FF00" stroke-width="2" />
        <circle cx="150" cy="135" r="7" [attr.fill]="secondaryColor" stroke="#00FF00" stroke-width="2" />
        <!-- Advanced beaker towers with energy -->
        <g transform="translate(55, 95)">
          <path d="M 0 15 Q -8 10 -8 0 L -8 -15 L 8 -15 L 8 0 Q 8 10 0 15 Z" 
            [attr.fill]="accentColor" stroke="#00FF00" stroke-width="2" />
          <circle cx="0" cy="5" r="6" fill="none" stroke="#00FF00" stroke-width="1" opacity="0.6" />
          <ellipse cx="0" cy="12" rx="6" ry="2" fill="#00FF00" opacity="0.8" />
        </g>
        <g transform="translate(100, 85)">
          <path d="M 0 20 Q -8 15 -8 5 L -8 -15 L 8 -15 L 8 5 Q 8 15 0 20 Z" 
            [attr.fill]="accentColor" stroke="#00FF00" stroke-width="2" />
          <circle cx="0" cy="5" r="7" fill="none" stroke="#00FF00" stroke-width="1" opacity="0.6" />
          <ellipse cx="0" cy="17" rx="6" ry="2" fill="#00FF00" opacity="0.8" />
        </g>
        <g transform="translate(145, 100)">
          <path d="M 0 10 Q -8 5 -8 -5 L -8 -15 L 8 -15 L 8 -5 Q 8 5 0 10 Z" 
            [attr.fill]="accentColor" stroke="#00FF00" stroke-width="2" />
          <circle cx="0" cy="0" r="6" fill="none" stroke="#00FF00" stroke-width="1" opacity="0.6" />
          <ellipse cx="0" cy="8" rx="6" ry="2" fill="#00FF00" opacity="0.8" />
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
export class OxygenBuildingComponent {
  @Input() variant: ShapeVariant = 'basic';
  @Input() primaryColor = '#808080';
  @Input() secondaryColor = '#A9A9A9';
  @Input() accentColor = '#555555';
}
