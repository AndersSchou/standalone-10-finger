import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

type Tab = 'overview' | 'stats' | 'crew' | 'missions';

@Component({
  selector: 'app-planet10finger-headquarters',
  templateUrl: './headquarters.component.html',
  styleUrl: './headquarters.component.scss',
  standalone: true,
  imports: [CommonModule],
})
export class HeadquartersComponent {
  @Output() gameClose = new EventEmitter<void>();

  activeTab: Tab = 'overview';

  tabs: { id: Tab; label: string }[] = [
    { id: 'overview',  label: 'Placeholder 1' },
    { id: 'stats',     label: 'Placeholder 2' },
    { id: 'crew',      label: 'Placeholder 3' },
    { id: 'missions',  label: 'Placeholder 4' },
  ];

  selectTab(tab: Tab): void {
    this.activeTab = tab;
  }

  close(): void {
    this.gameClose.emit();
  }
}
