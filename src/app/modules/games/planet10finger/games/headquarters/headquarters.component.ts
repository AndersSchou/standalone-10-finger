import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementsDisplayComponent } from '../../components/achievements-display.component';
import { StatsDisplayComponent } from '../../components/stats-display.component';
import { PlanetNameColorCustomizerComponent } from '../../components/planet-name-color-customizer.component';
import { PlanetNameEditorComponent } from '../../components/planet-name-editor.component';
import { BackgroundCustomizerComponent } from '../../components/background-customizer.component';
import { ShopAccessoriesComponent } from '../../components/shop-accessories.component';
import { PlanetNameCustomizationService } from '../../services/planet-name-customization.service';

type Tab = 'information' | 'achievements' | 'stats' | 'shop';

@Component({
  selector: 'app-planet10finger-headquarters',
  templateUrl: './headquarters.component.html',
  styleUrl: './headquarters.component.scss',
  standalone: true,
  imports: [CommonModule, AchievementsDisplayComponent, StatsDisplayComponent, PlanetNameColorCustomizerComponent, PlanetNameEditorComponent, BackgroundCustomizerComponent, ShopAccessoriesComponent],
})
export class HeadquartersComponent implements OnInit {
  @Input() coins: number = 0;
  @Input() planetName: string = 'Planet';
  @Output() gameClose = new EventEmitter<void>();
  @Output() coinsChanged = new EventEmitter<number>();
  @Output() planetNameChanged = new EventEmitter<string>();
  @Output() planetColorChanged = new EventEmitter<void>();

  activeTab: Tab = 'information';
  currentNameColorHex: string = '#FFFFFF';

  tabs: { id: Tab; label: string }[] = [
    { id: 'information',  label: 'Information'  },
    { id: 'achievements', label: 'Præstationer' },
    { id: 'stats',        label: 'Statistik'    },
    { id: 'shop',         label: 'Shop'         },
  ];

  constructor(private planetNameCustomizationService: PlanetNameCustomizationService) {}

  ngOnInit(): void {
    const customization = this.planetNameCustomizationService.getCustomization();
    this.currentNameColorHex = customization.color;
  }

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
