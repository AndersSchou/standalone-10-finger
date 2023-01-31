import { Component } from '@angular/core';
import { DefaultReadLetterOptions, DefaultReadTextOptions } from 'src/app/common/constants';
import { TEXT_SETTINGS_TYPE } from 'src/app/common/enums';
import { KeyboardSettingsDTO } from 'src/app/dto/settings.dto';
import { SettingsService } from 'src/app/services/settings.service';

/**
 * This component holds the logic for the reading settings view.
 */
@Component({
  selector: 'app-shared-settings-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.scss']
})
export class AppSharedSettingsReadComponent {
  // Stores the default read letter options.
  readLetterOptions: KeyboardSettingsDTO[] = DefaultReadLetterOptions;
  // Stores the default read text options.
  readTextOptions: KeyboardSettingsDTO[] = [];

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
  setInitialValues() {
    // Set read letter initial value.
    const readLetterOption = this.settingsService.getDefaultReadLetter();
    const findLetter = this.readLetterOptions.find(el => el.type === readLetterOption.type);
    if (findLetter) {
      findLetter.selected = true;
    }

    // Set read text initial value.
    const readTextOption = this.settingsService.getDefaultReadText();
    this.readTextOptions = readTextOption;
  }

  /**
   * Selects the read letter option.
   *
   * @param option Represents the selected option.
   */
  selectReadLetterOption(option: KeyboardSettingsDTO) {
    this.readLetterOptions.forEach(o => o.selected = false);
    option.selected = true;
    localStorage.setItem(TEXT_SETTINGS_TYPE.READ_LETTER, JSON.stringify(option));
    this.settingsService.setTextSetting({
      type: TEXT_SETTINGS_TYPE.READ_LETTER,
      value: option.type
    });
  }

  /**
   * Toggles the read text option.
   *
   * @param option Represents the selected option.
   */
  selectReadTextOption(option: KeyboardSettingsDTO) {
    option.selected = !option.selected;
    localStorage.setItem(TEXT_SETTINGS_TYPE.READ_TEXT, JSON.stringify(this.readTextOptions));
    this.settingsService.setTextSetting({
      type: TEXT_SETTINGS_TYPE.READ_TEXT,
      value: option.type
    });
  }
}
