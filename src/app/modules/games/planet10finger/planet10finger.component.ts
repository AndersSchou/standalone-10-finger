import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { PowerComponent } from './games/power/power.component';
import { OxygenComponent } from './games/oxygen/oxygen.component';
import { MeteorComponent } from './games/meteor/meteor.component';
import { FactoryComponent } from './games/factory/factory.component';
import { AssemblingComponent } from './games/assembling/assembling.component';

/**
 * Hub component for the Planet 10 finger game.
 * Renders the game grid and manages which game popup is open.
 */
@Component({
  selector: 'app-planet10finger',
  templateUrl: './planet10finger.component.html',
  styleUrls: ['./planet10finger.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    PowerComponent,
    OxygenComponent,
    MeteorComponent,
    FactoryComponent,
    AssemblingComponent,
  ],
})
export class Planet10fingerComponent {
  activePopup: string | null = null;

  constructor(private readonly router: Router) {}

  openPopup(game: string): void {
    this.activePopup = game;
  }

  closePopup(): void {
    this.activePopup = null;
  }

  navigateToGame(game: string): void {
    this.router.navigate(['/games/planet10finger/' + game]);
  }
}
