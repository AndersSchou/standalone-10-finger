import { Component } from '@angular/core';
import { KeyboardSettingsDTO } from 'src/app/dto/settings.dto';

/**
 * This component holds the logic for the keyboard settings view.
 */
@Component({
  selector: 'app-shared-settings-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.scss']
})
export class AppSharedSettingsReadComponent {
  readLetterOptions: KeyboardSettingsDTO[] = [
    { type: 'name', label: 'Letter name', selected: false },
    { type: 'sound', label: 'Letter sound', selected: false },
    { type: 'none', label: 'No sound', selected: true },
  ];

  readTextOptions: KeyboardSettingsDTO[] = [
    { type: 'theme-color', label: 'Read words', selected: false },
    { type: 'theme-min-color', label: 'Read sentences', selected: false }
  ];
}
