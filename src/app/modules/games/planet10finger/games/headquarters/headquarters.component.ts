import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

type Tab = 'information' | 'achievements' | 'stats' | 'shop';

@Component({
  selector: 'app-planet10finger-headquarters',
  templateUrl: './headquarters.component.html',
  styleUrl: './headquarters.component.scss',
  standalone: true,
  imports: [CommonModule],
})
export class HeadquartersComponent {
  @Output() gameClose = new EventEmitter<void>();

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
}
