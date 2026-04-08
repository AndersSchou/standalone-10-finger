import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type ShapeVariant = 'basic' | 'modern' | 'advanced';

@Component({
  selector: 'app-factory-building',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg viewBox="0 0 200 200" class="building-svg factory-building">
      <!-- Basic: Industrial factory -->
      <ng-container *ngIf="variant === 'basic'">
        <!-- Base -->
        <rect x="25" y="120" width="150" height="60" [attr.fill]="primaryColor" stroke="#333" stroke-width="2" />
        <!-- Main factory body -->
        <rect x="30" y="100" width="140" height="30" [attr.fill]="primaryColor" stroke="#333" stroke-width="2" />
        <!-- Door -->
        <rect x="85" y="130" width="30" height="50" fill="#DC143C" />
        <!-- Windows on side -->
        <rect x="45" y="130" width="12" height="12" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
        <rect x="143" y="130" width="12" height="12" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
        <!-- Assembly belt/conveyor (on top) -->
        <rect x="40" y="100" width="120" height="5" [attr.fill]="accentColor" stroke="#333" stroke-width="1" />
        <!-- Large gear/wheel -->
        <circle cx="70" cy="80" r="12" fill="none" stroke="#333" stroke-width="2" />
        <circle cx="70" cy="80" r="4" [attr.fill]="accentColor" />
        <!-- Smaller gear -->
        <circle cx="130" cy="80" r="10" fill="none" stroke="#333" stroke-width="2" />
        <circle cx="130" cy="80" r="3" [attr.fill]="accentColor" />
      </ng-container>

      <!-- Modern: Sleek factory -->
      <ng-container *ngIf="variant === 'modern'">
        <!-- Base -->
        <rect x="30" y="120" width="140" height="60" rx="10" [attr.fill]="primaryColor" stroke="#333" stroke-width="2" />
        <!-- Main factory body -->
        <rect x="35" y="100" width="130" height="30" rx="8" [attr.fill]="primaryColor" stroke="#333" stroke-width="2" />
        <!-- Door modern -->
        <rect x="80" y="130" width="40" height="50" rx="8" fill="#DC143C" stroke="#333" stroke-width="1" />
        <circle cx="115" cy="155" r="3" fill="#FFD700" />
        <!-- Windows modern -->
        <circle cx="50" cy="135" r="6" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
        <circle cx="150" cy="135" r="6" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
        <!-- Conveyor belt modern -->
        <rect x="40" y="102" width="120" height="6" rx="3" [attr.fill]="accentColor" stroke="#333" stroke-width="1" />
        <!-- Belt segments -->
        <line x1="50" y1="105" x2="50" y2="95" stroke="#333" stroke-width="1" />
        <line x1="75" y1="105" x2="75" y2="95" stroke="#333" stroke-width="1" />
        <line x1="100" y1="105" x2="100" y2="95" stroke="#333" stroke-width="1" />
        <line x1="125" y1="105" x2="125" y2="95" stroke="#333" stroke-width="1" />
        <line x1="150" y1="105" x2="150" y2="95" stroke="#333" stroke-width="1" />
        <!-- Gears -->
        <circle cx="60" cy="75" r="12" fill="none" stroke="#333" stroke-width="2" />
        <circle cx="60" cy="75" r="5" [attr.fill]="accentColor" />
        <circle cx="140" cy="75" r="12" fill="none" stroke="#333" stroke-width="2" />
        <circle cx="140" cy="75" r="5" [attr.fill]="accentColor" />
      </ng-container>

      <!-- Advanced: Futuristic factory -->
      <ng-container *ngIf="variant === 'advanced'">
        <defs>
          <radialGradient id="factoryGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" [attr.stop-color]="secondaryColor" stop-opacity="0.8" />
            <stop offset="100%" [attr.stop-color]="primaryColor" stop-opacity="0.2" />
          </radialGradient>
        </defs>
        <!-- Base -->
        <path d="M 30 125 L 35 120 L 165 120 L 170 125 L 170 175 Q 170 180 165 180 L 35 180 Q 30 180 30 175 Z" 
          [attr.fill]="primaryColor" stroke="#FFD700" stroke-width="2" />
        <!-- Glow -->
        <ellipse cx="100" cy="150" rx="75" ry="35" fill="url(#factoryGlow)" />
        <!-- Main factory body -->
        <rect x="40" y="105" width="120" height="30" rx="8" [attr.fill]="primaryColor" stroke="#FFD700" stroke-width="2" />
        <!-- Tech door -->
        <path d="M 78 135 L 122 135 L 122 170 Q 122 175 117 175 L 83 175 Q 78 175 78 170 Z" 
          fill="#DC143C" stroke="#FFD700" stroke-width="2" />
        <circle cx="100" cy="152" r="2" fill="#FFD700" />
        <!-- Tech windows -->
        <circle cx="50" cy="130" r="7" [attr.fill]="secondaryColor" stroke="#FFD700" stroke-width="2" />
        <circle cx="150" cy="130" r="7" [attr.fill]="secondaryColor" stroke="#FFD700" stroke-width="2" />
        <!-- Advanced conveyor with energy -->
        <rect x="45" y="103" width="110" height="8" rx="4" [attr.fill]="accentColor" stroke="#FFD700" stroke-width="2" />
        <!-- Energy flow -->
        <circle cx="55" cy="107" r="2" fill="#FFD700" />
        <circle cx="80" cy="107" r="2" fill="#FFD700" />
        <circle cx="105" cy="107" r="2" fill="#FFD700" />
        <circle cx="130" cy="107" r="2" fill="#FFD700" />
        <circle cx="155" cy="107" r="2" fill="#FFD700" />
        <!-- Advanced gears with rings -->
        <g transform="translate(60, 70)">
          <circle cx="0" cy="0" r="12" fill="none" stroke="#FFD700" stroke-width="2" />
          <circle cx="0" cy="0" r="16" fill="none" stroke="#FFD700" stroke-width="1" opacity="0.5" />
          <circle cx="0" cy="0" r="6" [attr.fill]="accentColor" />
        </g>
        <g transform="translate(140, 70)">
          <circle cx="0" cy="0" r="12" fill="none" stroke="#FFD700" stroke-width="2" />
          <circle cx="0" cy="0" r="16" fill="none" stroke="#FFD700" stroke-width="1" opacity="0.5" />
          <circle cx="0" cy="0" r="6" [attr.fill]="accentColor" />
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
export class FactoryBuildingComponent {
  @Input() variant: ShapeVariant = 'basic';
  @Input() primaryColor = '#808080';
  @Input() secondaryColor = '#A9A9A9';
  @Input() accentColor = '#555555';
}
