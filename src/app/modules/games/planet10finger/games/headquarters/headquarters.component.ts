import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementsDisplayComponent } from '../../components/achievements-display.component';
import { StatsDisplayComponent } from '../../components/stats-display.component';
import { PlanetNameColorCustomizerComponent } from '../../components/planet-name-color-customizer.component';
import { PlanetNameEditorComponent } from '../../components/planet-name-editor.component';
import { BackgroundCustomizerComponent } from '../../components/background-customizer.component';
import { ShopAccessoriesComponent } from '../../components/shop-accessories.component';
import { PlanetNameCustomizationService } from '../../services/planet-name-customization.service';
import { AchievementService } from '../../services/achievement.service';

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
  @Input() nextTabInGuide: string | null = null;
  @Input() purchasedGames: Set<string> = new Set();
  @Output() gameClose = new EventEmitter<void>();
  @Output() coinsChanged = new EventEmitter<number>();
  @Output() planetNameChanged = new EventEmitter<string>();
  @Output() planetColorChanged = new EventEmitter<void>();
  @Output() tabVisited = new EventEmitter<string>();
  @Output() gamePurchaseRequested = new EventEmitter<{ game: string; cost: number }>();
  @Output() colorPurchased = new EventEmitter<string>();

  activeTab: Tab = 'information';
  currentNameColorHex: string = '#FFFFFF';

  tabs: { id: Tab; label: string }[] = [
    { id: 'information',  label: 'Information'  },
    { id: 'achievements', label: 'Præstationer' },
    { id: 'stats',        label: 'Statistik'    },
    { id: 'shop',         label: 'Shop'         },
  ];

  constructor(
    private planetNameCustomizationService: PlanetNameCustomizationService,
    private achievementService: AchievementService
  ) {}

  ngOnInit(): void {
    const customization = this.planetNameCustomizationService.getCustomization();
    this.currentNameColorHex = customization.color;
  }

  selectTab(tab: Tab): void {
    this.activeTab = tab;
    // Notify parent if this is the guided tab
    if (tab === this.nextTabInGuide) {
      this.tabVisited.emit(tab);
    }
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

  onColorPurchased(colorType: string): void {
    // Unlock specific color achievement
    if (colorType === 'name_color') {
      this.achievementService.unlockAchievement('buy_name_color');
    } else if (colorType === 'star_color') {
      this.achievementService.unlockAchievement('buy_star_color');
    } else if (colorType === 'planet_color') {
      this.achievementService.unlockAchievement('buy_planet_color');
    }

    // Check if all 3 colors purchased to unlock "Kunstner"
    if (
      this.achievementService.isUnlocked('buy_name_color') &&
      this.achievementService.isUnlocked('buy_star_color') &&
      this.achievementService.isUnlocked('buy_planet_color')
    ) {
      this.achievementService.unlockAchievement('all_colors');
    }

    // Emit event to propagate to parent
    this.colorPurchased.emit(colorType);
  }
}
