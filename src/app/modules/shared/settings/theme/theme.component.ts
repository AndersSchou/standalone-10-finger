import { SettingsService } from 'src/app/services/settings.service';
import { Component } from '@angular/core';
import { DefaultThemeOptions } from 'src/app/common/constants';
import { KeyboardSettingsDTO } from 'src/app/dto/settings.dto';

/**
 * This component holds the logic for the theme settings view.
 */
@Component({
  selector: 'app-shared-settings-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})
export class AppSharedSettingsThemeComponent {
  // Stores the available themes.
  themes: KeyboardSettingsDTO[] = DefaultThemeOptions;

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param settingsService Reference to SettingsService.
   */
  constructor(
    private readonly settingsService: SettingsService
  ) {
    this.setInitialValues();
  }

  /**
   * Sets the initial values for the settings.
   */
  setInitialValues(): void {
    const mainThemeOption = this.settingsService.getDefaultMainThemeColor();
    const findTheme = this.themes.find(el => el.type === mainThemeOption);
    if (findTheme) {
      findTheme.selected = true;
    }
  }

  /**
   * Sets the selected theme.
   *
   * @param theme Represent the selected theme.
   */
  changeTheme(theme: KeyboardSettingsDTO) {
    this.themes.forEach(el => {
      el.selected = false;
    });
    theme.selected = true;
    this.settingsService.setThemeSetting(theme.type);
  }
}
