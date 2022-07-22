import { Component } from '@angular/core';
import { KeyboardSettingsDTO } from 'src/app/dto/settings.dto';

/**
 * This component holds the logic for the keyboard settings view.
 */
@Component({
  selector: 'app-shared-settings-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class AppSharedSettingsTextComponent {
  fontSizes: number[] = [24, 28, 32, 36];
  fontFamilies: KeyboardSettingsDTO[] = [];
  otherFontFam: KeyboardSettingsDTO[] = [];
  textColorOptions: KeyboardSettingsDTO[] = [];
  wordToRepeat: number[] = [];
  layoutTypes: KeyboardSettingsDTO[] = [];
  selectedFontSize: number;
  selectedWordRepeat: number;
  // Arial Georgia Other -> Times new roman, Verdana, Tahoma, Calibri//
  constructor() {
    this.fontFamilies = [
      { type: 'arial', label: 'Arial', selected: true },
      { type: 'georgia', label: 'Georgia', selected: false },
      { type: 'other', label: 'Other', selected: false },
    ];
    this.otherFontFam = [
      { type: 'times', label: 'Times New Roman', selected: true },
      { type: 'verdana', label: 'Verdana', selected: false },
      { type: 'tahoma', label: 'Tahoma', selected: false },
      { type: 'calibri', label: 'Calibri', selected: false },
    ];

    this.textColorOptions = [
      { type: 'color', label: 'Colored text', selected: false },
      { type: 'no-color', label: 'No colored text', selected: true },
    ];

    this.layoutTypes = [
      { type: 'top', label: 'ABCDE', selected: true },
      { type: 'bottom', label: 'ABCDE', selected: false },
    ];

    for (let i = 0; i < 9; i++) {
      this.wordToRepeat.push(i);
    }

    this.selectedFontSize = this.fontSizes[2];
    this.selectedWordRepeat = this.wordToRepeat[2];
  }

  selectFontSize(opt: number): void {
    this.selectedFontSize = opt;
  }

  selectWordRepeat(opt: number): void {
    this.selectedWordRepeat = opt;
  }
}
