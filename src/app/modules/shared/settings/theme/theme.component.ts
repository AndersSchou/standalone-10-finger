import { SettingsService } from 'src/app/services/settings.service';
import { Component } from '@angular/core';
import { DefaultThemeOptions } from 'src/app/common/constants';
import { STORAGE_KEY_TYPE } from 'src/app/common/enums';
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
    if (localStorage.getItem(STORAGE_KEY_TYPE.MAIN_THEME_COLOR)) {
      const mainThemeOption = localStorage.getItem(STORAGE_KEY_TYPE.MAIN_THEME_COLOR);
      const findTheme = this.themes.find(el => el.type === mainThemeOption);
      if (findTheme) {
        findTheme.selected = true;
      }
    } else {
      this.themes[0].selected = true;
      this.changeTheme(this.themes[0]);
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
