import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type ShapeVariant = 'basic' | 'modern' | 'advanced';

@Component({
  selector: 'app-assembling-building',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg viewBox="0 0 200 200" class="building-svg assembling-building">
      <!-- Basic: Warehouse storage -->
      <ng-container *ngIf="variant === 'basic'">
        <!-- Base -->
        <rect x="25" y="110" width="150" height="70" [attr.fill]="primaryColor" stroke="#333" stroke-width="2" />
        <!-- Door -->
        <rect x="80" y="130" width="40" height="50" fill="#8B4513" />
        <!-- Large front windows (storage racks) -->
        <g *ngFor="let row of [0, 1, 2]; let rowIdx = index">
          <rect [attr.x]="35 + rowIdx * 45" y="120" width="12" height="60" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
          <line [attr.x1]="35 + rowIdx * 45" y1="130" [attr.x2]="47 + rowIdx * 45" y2="130" stroke="#333" stroke-width="0.5" />
          <line [attr.x1]="35 + rowIdx * 45" y1="140" [attr.x2]="47 + rowIdx * 45" y2="140" stroke="#333" stroke-width="0.5" />
          <line [attr.x1]="35 + rowIdx * 45" y1="150" [attr.x2]="47 + rowIdx * 45" y2="150" stroke="#333" stroke-width="0.5" />
          <line [attr.x1]="35 + rowIdx * 45" y1="160" [attr.x2]="47 + rowIdx * 45" y2="160" stroke="#333" stroke-width="0.5" />
        </g>
        <!-- Roof -->
        <path d="M 25 110 L 100 70 L 175 110" [attr.fill]="accentColor" stroke="#333" stroke-width="2" />
      </ng-container>

      <!-- Modern: Sleek warehouse -->
      <ng-container *ngIf="variant === 'modern'">
        <!-- Base -->
        <rect x="30" y="115" width="140" height="65" rx="10" [attr.fill]="primaryColor" stroke="#333" stroke-width="2" />
        <!-- Door modern -->
        <rect x="80" y="135" width="40" height="45" rx="8" fill="#8B4513" stroke="#333" stroke-width="1" />
        <circle cx="115" cy="157" r="3" fill="#FFD700" />
        <!-- Modern storage racks -->
        <rect x="40" y="125" width="12" height="50" rx="2" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
        <rect x="60" y="125" width="12" height="50" rx="2" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
        <rect x="148" y="125" width="12" height="50" rx="2" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
        <rect x="168" y="125" width="12" height="50" rx="2" [attr.fill]="secondaryColor" stroke="#333" stroke-width="1" />
        <!-- Shelving lines -->
        <line x1="40" y1="135" x2="52" y2="135" stroke="#666" stroke-width="0.5" />
        <line x1="40" y1="145" x2="52" y2="145" stroke="#666" stroke-width="0.5" />
        <line x1="40" y1="155" x2="52" y2="155" stroke="#666" stroke-width="0.5" />
        <line x1="60" y1="135" x2="72" y2="135" stroke="#666" stroke-width="0.5" />
        <line x1="60" y1="145" x2="72" y2="145" stroke="#666" stroke-width="0.5" />
        <line x1="60" y1="155" x2="72" y2="155" stroke="#666" stroke-width="0.5" />
        <!-- Modern roof -->
        <path d="M 30 115 Q 100 80 170 115" [attr.fill]="accentColor" stroke="#333" stroke-width="2" />
      </ng-container>

      <!-- Advanced: Futuristic warehouse -->
      <ng-container *ngIf="variant === 'advanced'">
        <defs>
          <radialGradient id="assemblingGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" [attr.stop-color]="secondaryColor" stop-opacity="0.8" />
            <stop offset="100%" [attr.stop-color]="primaryColor" stop-opacity="0.2" />
          </radialGradient>
        </defs>
        <!-- Base -->
        <path d="M 30 120 L 35 115 L 165 115 L 170 120 L 170 175 Q 170 180 165 180 L 35 180 Q 30 180 30 175 Z" 
          [attr.fill]="primaryColor" stroke="#FF1493" stroke-width="2" />
        <!-- Glow -->
        <ellipse cx="100" cy="150" rx="75" ry="35" fill="url(#assemblingGlow)" />
        <!-- Tech door -->
        <path d="M 78 140 L 122 140 L 122 170 Q 122 175 117 175 L 83 175 Q 78 175 78 170 Z" 
          fill="#8B4513" stroke="#FF1493" stroke-width="2" />
        <circle cx="100" cy="157" r="2" fill="#FF1493" />
        <!-- Advanced storage racks with glow -->
        <g transform="translate(45, 125)">
          <rect x="0" y="0" width="12" height="50" rx="3" [attr.fill]="secondaryColor" stroke="#FF1493" stroke-width="2" />
          <circle cx="6" cy="10" r="3" fill="none" stroke="#FF1493" stroke-width="1" opacity="0.6" />
          <circle cx="6" cy="25" r="3" fill="none" stroke="#FF1493" stroke-width="1" opacity="0.6" />
          <circle cx="6" cy="40" r="3" fill="none" stroke="#FF1493" stroke-width="1" opacity="0.6" />
        </g>
        <g transform="translate(65, 125)">
          <rect x="0" y="0" width="12" height="50" rx="3" [attr.fill]="secondaryColor" stroke="#FF1493" stroke-width="2" />
          <circle cx="6" cy="10" r="3" fill="none" stroke="#FF1493" stroke-width="1" opacity="0.6" />
          <circle cx="6" cy="25" r="3" fill="none" stroke="#FF1493" stroke-width="1" opacity="0.6" />
          <circle cx="6" cy="40" r="3" fill="none" stroke="#FF1493" stroke-width="1" opacity="0.6" />
        </g>
        <g transform="translate(143, 125)">
          <rect x="0" y="0" width="12" height="50" rx="3" [attr.fill]="secondaryColor" stroke="#FF1493" stroke-width="2" />
          <circle cx="6" cy="10" r="3" fill="none" stroke="#FF1493" stroke-width="1" opacity="0.6" />
          <circle cx="6" cy="25" r="3" fill="none" stroke="#FF1493" stroke-width="1" opacity="0.6" />
          <circle cx="6" cy="40" r="3" fill="none" stroke="#FF1493" stroke-width="1" opacity="0.6" />
        </g>
        <!-- Advanced roof with energy lines -->
        <path d="M 30 120 Q 100 90 170 120" [attr.fill]="accentColor" stroke="#FF1493" stroke-width="2" />
        <line x1="60" y1="105" x2="60" y2="115" stroke="#FF1493" stroke-width="1" />
        <line x1="100" y1="90" x2="100" y2="115" stroke="#FF1493" stroke-width="1" />
        <line x1="140" y1="105" x2="140" y2="115" stroke="#FF1493" stroke-width="1" />
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
export class AssemblingBuildingComponent {
  @Input() variant: ShapeVariant = 'basic';
  @Input() primaryColor = '#808080';
  @Input() secondaryColor = '#A9A9A9';
  @Input() accentColor = '#555555';
}
