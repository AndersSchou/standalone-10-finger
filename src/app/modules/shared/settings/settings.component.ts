import { Component, OnInit } from '@angular/core';
import { KeyboardSettingsDTO } from 'src/app/dto/settings.dto';
import { SettingsService } from 'src/app/services/settings.service';

/**
 * This component holds the logic for the settings view.
 */
@Component({
  selector: 'app-shared-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class AppSharedSettingsComponent implements OnInit {
  selectedOption: KeyboardSettingsDTO = {} as KeyboardSettingsDTO;
  settingsOptions: KeyboardSettingsDTO[] = [
    { type: 'keyboard', icon: 'keyboard', label: 'Keyboard', selected: true },
    { type: 'text', icon: 'icon_text', label: 'Text', selected: false },
    { type: 'read', icon: 'icon_read', label: 'Read', selected: false },
    { type: 'language', icon: 'icon_language', label: 'Language', selected: false },
    { type: 'logout', icon: 'icon_logout', label: 'Logout', selected: false },
    { type: 'reset', icon: 'reset', label: 'Reset all', selected: false },
  ];

  constructor(
    private readonly settingsService: SettingsService
  ) { }

  ngOnInit(): void {
    this.selectedOption = this.settingsOptions[0];
  }

  selectOption(option: KeyboardSettingsDTO) {
    this.settingsOptions.forEach(opt => {
      opt.selected = false;
    });
    option.selected = true;
    this.selectedOption = option;
  }

  close(): void {
    this.settingsService.toggleSettings(false);
  }
}
