import { Component } from '@angular/core';
import { KeyboardSettingsDTO } from 'src/app/dto/settings.dto';
import { environment } from 'src/environments/environment';

/**
 * This component holds the logic for the keyboard settings view.
 */
@Component({
  selector: 'app-shared-settings-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class AppSharedSettingsLanguageComponent {
  availablelanguages: KeyboardSettingsDTO[] = [];

  constructor() {
    this.availablelanguages = environment.availableLanguages.map(lang => {
      const el: KeyboardSettingsDTO = {
        type: 'lang-' + lang,
        label: lang,
        selected: false
      };
      return el;
    });

    this.availablelanguages[0].selected = true;
  }
}
