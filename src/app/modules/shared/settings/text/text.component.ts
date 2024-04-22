import { Component } from '@angular/core';
import {
  DefaultExtraFontFamilies,
  DefaultFontFamilies,
  DefaultTextBgColor,
} from 'src/app/common/constants';
import { TEXT_SETTINGS_TYPE } from 'src/app/common/enums';
import {
  KeyboardSettingsDTO,
  TextSettingsSizeDTO,
} from 'src/app/dto/settings.dto';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';

/**
 * This component holds the logic for the text settings view.
 */
@Component({
  selector: 'app-shared-settings-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  standalone: true,
  imports: [
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    NgFor,
    MatMenuItem,
    NgClass,
    NgIf,
    TranslateModule,
  ],
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
  // Stores the selected font size.
  selectedFontSize: number = 24;
  // Stores the selected extra font family.
  selectedExtraFontFamily: KeyboardSettingsDTO = {} as KeyboardSettingsDTO;
  // Stores the selected font size and font family options.
  textStyle: TextSettingsSizeDTO = {
    fontSize: '24px',
    fontFamily: 'Roboto',
  };

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param settingsService Reference to SettingsService.
   */
  constructor(private readonly settingsService: SettingsService) {
    this.setInitialValues();
  }

  /**
   * Sets the initial values for the settings.
   */
  setInitialValues(): void {
    // Set the selected font size and font family based on the saved settings.
    // Set font size.
    this.textStyle = this.settingsService.getDefaultTextSize();
    if (this.textStyle) {
      this.selectedFontSize = Number(
        this.textStyle['fontSize'].split(/\D/g)[0]
      );
      // Set font family.
      this.fontFamilies.forEach((item) => {
        item.selected = false;
      });
      this.otherFontFam.forEach((item) => {
        item.selected = false;
      });
      const findFamily = this.fontFamilies.find(
        (el) => el.label === this.textStyle['fontFamily']
      );
      if (findFamily) {
        findFamily.selected = true;
        this.selectedExtraFontFamily = this.otherFontFam[0];
      } else {
        const findOtherFamily = this.otherFontFam.find(
          (el) => el.label === this.textStyle['fontFamily']
        );
        if (findOtherFamily) {
          this.fontFamilies[this.fontFamilies.length - 1].selected = true;
          findOtherFamily.selected = true;
          this.selectedExtraFontFamily = findOtherFamily;
        }
      }
    }

    // Set the selected text color option based on the saved settings.
    this.textColorBgOptions.forEach((item) => {
      item.selected = false;
    });
    const textTheme = this.settingsService.getDefaultTextColor();
    const findSelectedTheme = this.textColorBgOptions.find(
      (item) => item.type === textTheme
    );
    if (findSelectedTheme) {
      findSelectedTheme.selected = true;
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
      this.otherFontFam.forEach((item) => {
        item.selected = false;
      });
      this.selectedExtraFontFamily = opt;
    } else {
      this.fontFamilies.forEach((item) => {
        item.selected = false;
      });
    }
    opt.selected = true;
    if (opt.type !== 'other') {
      this.textStyle['fontFamily'] = opt.label as string;
      this.settingsService.setTextSetting({
        type: TEXT_SETTINGS_TYPE.TEXT_FAMILY,
        value: opt.label ? opt.label : '',
      });
    } else {
      this.textStyle['fontFamily'] = this.otherFontFam[0].label as string;
      this.settingsService.setTextSetting({
        type: TEXT_SETTINGS_TYPE.TEXT_FAMILY,
        value: this.otherFontFam[0].label ? this.otherFontFam[0].label : '',
      });
    }
    localStorage.setItem(
      TEXT_SETTINGS_TYPE.TEXT_SIZE,
      JSON.stringify(this.textStyle)
    );
  }

  /**
   * Selects the font size.
   *
   * @param opt The selected font size.
   */
  selectFontSize(opt: number): void {
    this.selectedFontSize = opt;
    this.textStyle['fontSize'] = `${opt}px`;
    localStorage.setItem(
      TEXT_SETTINGS_TYPE.TEXT_SIZE,
      JSON.stringify(this.textStyle)
    );
    this.settingsService.setTextSetting({
      type: TEXT_SETTINGS_TYPE.TEXT_SIZE,
      value: opt.toString(),
    });
  }

  /**
   * Selects the text color.
   *
   * @param option The selected text color option.
   */
  selectThemeColor(option: KeyboardSettingsDTO): void {
    this.textColorBgOptions.forEach((item) => {
      item.selected = false;
    });
    option.selected = true;
    localStorage.setItem(
      TEXT_SETTINGS_TYPE.TEXT_COLOR,
      JSON.stringify(option.type)
    );
    this.settingsService.setTextSetting({
      type: TEXT_SETTINGS_TYPE.TEXT_COLOR,
      value: option.type,
    });
  }
}
