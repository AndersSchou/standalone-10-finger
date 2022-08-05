import { Component } from '@angular/core';
import { DefaultExerciseLayout, DefaultExtraFontFamilies, DefaultFontFamilies, DefaultTextBgColor } from 'src/app/common/constants';
import { TEXT_SETTINGS_TYPE } from 'src/app/common/enums';
import { KeyboardSettingsDTO } from 'src/app/dto/settings.dto';
import { SettingsService } from 'src/app/services/settings.service';

/**
 * This component holds the logic for the keyboard settings view.
 */
@Component({
  selector: 'app-shared-settings-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class AppSharedSettingsTextComponent {
  // Stores the default font sizes.
  fontSizes: number[] = [20, 24, 28, 32];
  // Stores the default font families.
  fontFamilies: KeyboardSettingsDTO[] = DefaultFontFamilies;
  // Stores the extra font families.
  otherFontFam: KeyboardSettingsDTO[] = DefaultExtraFontFamilies;
  // Stores the text color background options.
  textColorBgOptions: KeyboardSettingsDTO[] = DefaultTextBgColor;
  // Stores the layout types.
  layoutTypes: KeyboardSettingsDTO[] = DefaultExerciseLayout;
  // Stores the default numbers for word to repeat.
  wordToRepeat: number[] = [];
  // Stores the selected font size.
  selectedFontSize: number = 24;
  // Stores the selected number of word to repeat.
  selectedWordRepeat: number;
  // Stores the selected extra font family.
  selectedExtraFontFamily: KeyboardSettingsDTO = {} as KeyboardSettingsDTO;
  textStyle = {
    fontSize: '24px',
    fontFamily: 'Roboto'
  };

  constructor(
    private readonly settingsService: SettingsService
  ) {
    for (let i = 0; i < 9; i++) {
      this.wordToRepeat.push(i);
    }
    this.setInitialValues();
    this.selectedWordRepeat = this.wordToRepeat[2];
  }

  setInitialValues(): void {
    // Set the selected font size and font family based on the saved settings.
    if (localStorage.getItem(TEXT_SETTINGS_TYPE.TEXT_SIZE)) {
      // Set font size.
      this.textStyle = JSON.parse(localStorage.getItem(TEXT_SETTINGS_TYPE.TEXT_SIZE) as string);
      this.selectedFontSize = Number(this.textStyle['fontSize'].split(/\D/g)[0]);
      // Set font family.
      const findFamily = this.fontFamilies.find(el => el.label === this.textStyle['fontFamily']);
      if (findFamily) {
        findFamily.selected = true;
        this.selectedExtraFontFamily = this.otherFontFam[0];
      } else {
        const findOtherFamily = this.otherFontFam.find(el => el.label === this.textStyle['fontFamily']);
        if (findOtherFamily) {
          this.fontFamilies[this.fontFamilies.length - 1].selected = true;
          findOtherFamily.selected = true;
          this.selectedExtraFontFamily = findOtherFamily;
        }
      }
    } else {
      this.fontFamilies[0].selected = true;
      this.selectedExtraFontFamily = this.otherFontFam[0];
    }

    // Set the selected text color option based on the saved settings.
    if (localStorage.getItem(TEXT_SETTINGS_TYPE.TEXT_COLOR)) {
      const textTheme = JSON.parse(localStorage.getItem(TEXT_SETTINGS_TYPE.TEXT_COLOR) as string);
      const findSelectedTheme = this.textColorBgOptions.find(item => item.type === textTheme);
      if (findSelectedTheme) {
        findSelectedTheme.selected = true;
      } else {
        this.textColorBgOptions[1].selected = true;
      }
    } else {
      this.textColorBgOptions[1].selected = true;
    }

    // Set the layout display.
    if (localStorage.getItem(TEXT_SETTINGS_TYPE.TEXT_DISPLAY_LAYOUT)) {
      const textLayout = JSON.parse(localStorage.getItem(TEXT_SETTINGS_TYPE.TEXT_DISPLAY_LAYOUT) as string);
      const findSelectedLayout = this.layoutTypes.find(item => item.type === textLayout);
      if (findSelectedLayout) {
        findSelectedLayout.selected = true;
      } else {
        this.layoutTypes[0].selected = true;
      }
    } else {
      this.layoutTypes[0].selected = true;
    }
  }

  /**
   * Selects the font family.
   *
   * @param opt The selected font family.
   * @param isOther Tells if other option was selected or not.
   */
  selectFontFamily(opt: KeyboardSettingsDTO, isOther = false): void {
    if (isOther) {
      this.otherFontFam.forEach(item => {
        item.selected = false;
      });
      this.selectedExtraFontFamily = opt;
    } else {
      this.fontFamilies.forEach(item => {
        item.selected = false;
      });
    }
    opt.selected = true;
    if (opt.type !== 'other') {
      this.textStyle['fontFamily'] = opt.label as string;
      this.settingsService.setTextSetting({
        type: TEXT_SETTINGS_TYPE.TEXT_FAMILY,
        value: opt.label ? opt.label : ''
      });
    } else {
      this.textStyle['fontFamily'] = this.otherFontFam[0].label as string;
      this.settingsService.setTextSetting({
        type: TEXT_SETTINGS_TYPE.TEXT_FAMILY,
        value: this.otherFontFam[0].label ? this.otherFontFam[0].label : ''
      });
    }
    localStorage.setItem(TEXT_SETTINGS_TYPE.TEXT_SIZE, JSON.stringify(this.textStyle));
  }

  /**
   * Selects the font size.
   *
   * @param opt The selected font size.
   */
  selectFontSize(opt: number): void {
    this.selectedFontSize = opt;
    this.textStyle['fontSize'] = `${opt}px`;
    localStorage.setItem(TEXT_SETTINGS_TYPE.TEXT_SIZE, JSON.stringify(this.textStyle));
    this.settingsService.setTextSetting({
      type: TEXT_SETTINGS_TYPE.TEXT_SIZE,
      value: opt.toString()
    });
  }

  /**
   * Selects the word to repeat number.
   *
   * @param opt The selected number for word to repeat.
   */
  selectWordRepeat(opt: number): void {
    this.selectedWordRepeat = opt;
    this.settingsService.setTextSetting({
      type: TEXT_SETTINGS_TYPE.TEXT_REPEAT,
      value: (opt + 1).toString()
    });
  }

  /**
   * Selects the text color.
   *
   * @param option The selected text color option.
   */
  selectThemeColor(option: KeyboardSettingsDTO): void {
    this.textColorBgOptions.forEach(item => {
      item.selected = false;
    });
    option.selected = true;
    localStorage.setItem(TEXT_SETTINGS_TYPE.TEXT_COLOR, JSON.stringify(option.type));
    this.settingsService.setTextSetting({
      type: TEXT_SETTINGS_TYPE.TEXT_COLOR,
      value: option.type
    });
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
