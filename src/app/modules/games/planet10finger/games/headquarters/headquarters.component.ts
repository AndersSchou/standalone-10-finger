import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementsDisplayComponent } from '../../components/achievements-display.component';
import { StatsDisplayComponent } from '../../components/stats-display.component';
import { BuildingsCustomizerComponent } from '../../components/buildings-customizer.component';
import { PlanetNameCustomizerComponent } from '../../components/planet-name-customizer.component';
import { BackgroundCustomizerComponent } from '../../components/background-customizer.component';

type Tab = 'information' | 'achievements' | 'stats' | 'shop';

@Component({
  selector: 'app-planet10finger-headquarters',
  templateUrl: './headquarters.component.html',
  styleUrl: './headquarters.component.scss',
  standalone: true,
  imports: [CommonModule, AchievementsDisplayComponent, StatsDisplayComponent, BuildingsCustomizerComponent, PlanetNameCustomizerComponent, BackgroundCustomizerComponent],
})
export class HeadquartersComponent {
  @Input() coins: number = 0;
  @Input() planetName: string = 'Planet';
  @Output() gameClose = new EventEmitter<void>();
  @Output() coinsChanged = new EventEmitter<number>();
  @Output() planetNameChanged = new EventEmitter<string>();
  @Output() planetColorChanged = new EventEmitter<void>();

  activeTab: Tab = 'information';

  tabs: { id: Tab; label: string }[] = [
    { id: 'information',  label: 'Information'  },
    { id: 'achievements', label: 'Præstationer' },
    { id: 'stats',        label: 'Statistik'    },
    { id: 'shop',         label: 'Shop'         },
  ];

  selectTab(tab: Tab): void {
    this.activeTab = tab;
  }

  close(): void {
    this.gameClose.emit();
  }

  onCoinsChanged(newCoins: number): void {
    this.coins = newCoins;
    this.coinsChanged.emit(newCoins);
  }

  onPlanetNameChanged(newName: string): void {
    this.planetName = newName;
    this.planetNameChanged.emit(newName);
  }
}
