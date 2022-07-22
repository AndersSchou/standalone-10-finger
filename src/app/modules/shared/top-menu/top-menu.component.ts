import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

/**
 * This component holds the logic for the toolbar.
 */
@Component({
  selector: 'app-shared-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class AppSharedTopMenuComponent implements OnInit {
  isActive: boolean = false;
  constructor(
    private readonly settingsService: SettingsService
  ) { }

  ngOnInit(): void {
    this.settingsService.viewSettingsAction.subscribe((viewSettings: boolean) => { this.isActive = viewSettings; });
  }

  toggleSettings() {
    this.isActive = !this.isActive;
    this.settingsService.toggleSettings(this.isActive);
  }
}
