import { Component } from '@angular/core';
import { DefaultExerciseLayout, DefaultKeyboardThemeOptions, DefaultKeyboardViewModeOptions } from 'src/app/common/constants';
import { STORAGE_KEY_TYPE, TEXT_SETTINGS_TYPE } from 'src/app/common/enums';
import { KEYBOARD_COLOR_GROUP_TYPE, KEYBOARD_LAYOUT_GROUP_TYPE } from 'src/app/common/types';
import { KeyboardSettingsDTO } from 'src/app/dto/settings.dto';
import { SettingsService } from 'src/app/services/settings.service';

/**
 * This component holds the logic for the keyboard settings view.
 */
@Component({
  selector: 'app-shared-settings-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class AppSharedSettingsKeyboardComponent {
  // Stores the default keyboard theme options.
  keyboardTheme: KeyboardSettingsDTO[] = DefaultKeyboardThemeOptions;
  // Stores the available keyboard layout options.
  keyboardViewMode: KeyboardSettingsDTO[] = DefaultKeyboardViewModeOptions;
  // Stores the layout types.
  layoutTypes: KeyboardSettingsDTO[] = DefaultExerciseLayout;

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
    // Set keyboard theme color initial value.
    this.keyboardTheme.forEach(opt => {
      opt.selected = false;
    });
    const findThemeOption = this.keyboardTheme.find(opt => opt.type === this.settingsService.getDefaultKeyboardThemeColor());
    if (findThemeOption) {
      findThemeOption.selected = true;
    }

    // Set keyboard layout mode initial value.
    this.keyboardViewMode.forEach(opt => {
      opt.selected = false;
    });
    const findPrimaryLayout = this.keyboardViewMode.find(opt => opt.type === this.settingsService.getDefaultKeyboardPrimaryLayout());
    if (findPrimaryLayout) {
      findPrimaryLayout.selected = true;
    }

    // Set the layout display.
    this.layoutTypes.forEach(item => {
      item.selected = false;
    });
    const textLayout = this.settingsService.getDefaultTextDisplayLayout();
    const findSelectedLayout = this.layoutTypes.find(item => item.type === textLayout);
    if (findSelectedLayout) {
      findSelectedLayout.selected = true;
    }
  }

  /**
   * Set the keyboard color theme.
   *
   * @param option Represents the keyboard color theme.
   */
  selectThemeColor(option: KeyboardSettingsDTO): void {
    this.keyboardTheme.forEach(opt => {
      opt.selected = false;
    });
    option.selected = true;
    this.settingsService.setKeyboardThemeColor(option.type as KEYBOARD_COLOR_GROUP_TYPE);
    localStorage.setItem(STORAGE_KEY_TYPE.KEYBOARD_THEME_COLOR, option.type as KEYBOARD_COLOR_GROUP_TYPE);
  }

  /**
   * Set the keyboard layout mode.
   *
   * @param option Represents the keyboard layout mode.
   */
  selectKeyboardMode(option: KeyboardSettingsDTO): void {
    this.keyboardViewMode.forEach(opt => {
      opt.selected = false;
    });
    option.selected = true;
    this.settingsService.setKeyboardPrimaryMode(option.type as KEYBOARD_LAYOUT_GROUP_TYPE);
    localStorage.setItem(STORAGE_KEY_TYPE.KEYBOARD_PRIMARY_LAYOUT, option.type as KEYBOARD_LAYOUT_GROUP_TYPE);
  }

  /**
   * Selects the layout type.
   *
   * @param option The selected layout type.
   */
  selectDisplayLayout(option: KeyboardSettingsDTO): void {
    this.layoutTypes.forEach(item => {
      item.selected = false;
    });
    option.selected = true;
    localStorage.setItem(TEXT_SETTINGS_TYPE.TEXT_DISPLAY_LAYOUT, JSON.stringify(option.type));
    this.settingsService.setTextSetting({
      type: TEXT_SETTINGS_TYPE.TEXT_DISPLAY_LAYOUT,
      value: option.type
    });
  }

}
