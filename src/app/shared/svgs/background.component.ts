import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-background-svg',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg viewBox="0 0 1200 800" class="background-svg" preserveAspectRatio="xMidYMid slice">
      <!-- Sky gradient -->
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" [attr.stop-color]="skyColorDark" />
          <stop offset="100%" [attr.stop-color]="skyColorLight" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="1200" height="800" fill="url(#skyGradient)" />

      <!-- Stars -->
      <circle cx="100" cy="80" r="2" [attr.fill]="starColor" opacity="0.8" />
      <circle cx="200" cy="120" r="2.5" [attr.fill]="starColor" opacity="0.6" />
      <circle cx="350" cy="60" r="1.5" [attr.fill]="starColor" opacity="0.9" />
      <circle cx="500" cy="100" r="2" [attr.fill]="starColor" opacity="0.7" />
      <circle cx="650" cy="80" r="1.5" [attr.fill]="starColor" opacity="0.8" />
      <circle cx="800" cy="110" r="2" [attr.fill]="starColor" opacity="0.6" />
      <circle cx="950" cy="90" r="2.5" [attr.fill]="starColor" opacity="0.8" />
      <circle cx="1100" cy="70" r="1.5" [attr.fill]="starColor" opacity="0.7" />

      <!-- Moon -->
      <circle cx="150" cy="100" r="60" [attr.fill]="moonColor" />
      <circle cx="155" cy="95" r="8" fill="rgba(0,0,0,0.1)" />
      <circle cx="140" cy="115" r="5" fill="rgba(0,0,0,0.15)" />

      <!-- Optional: subtle craters on moon -->
      <circle cx="150" cy="100" r="60" fill="none" [attr.stroke]="moonAccent" stroke-width="0.5" opacity="0.3" />
    </svg>
  `,
  styles: [`
    .background-svg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      object-fit: cover;
    }
  `]
})
export class BackgroundSvgComponent {
  @Input() skyColorDark = '#0a0e27';
  @Input() skyColorLight = '#1a1f3a';
  @Input() starColor = '#ffffff';
  @Input() moonColor = '#c0c0c0';
  @Input() moonAccent = '#a0a0a0';
}
