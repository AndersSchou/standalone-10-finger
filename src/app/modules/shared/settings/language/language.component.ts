import { Component } from '@angular/core';
import { KeyboardSettingsDTO } from 'src/app/dto/settings.dto';
import { LanguageHelperService } from 'src/app/services/language.service';
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
  availableLanguages: KeyboardSettingsDTO[] = [];
  currentLanguage: string;

  constructor(
    private readonly languageHelperService: LanguageHelperService
  ) {
    this.availableLanguages = environment.availableLanguages.map(lang => {
      const el: KeyboardSettingsDTO = {
        type: 'lang-' + lang,
        label: lang,
        selected: false
      };
      return el;
    });

    this.currentLanguage = this.languageHelperService.currentLangUsed;
    const findCurrentLanguage = this.availableLanguages.find(el => el.label === this.languageHelperService.currentLangUsed);
    if (findCurrentLanguage) {
      findCurrentLanguage.selected = true;
    } else {
      this.availableLanguages[0].selected = true;
    }
  }

  changeLanguage(lang: KeyboardSettingsDTO) {
    this.availableLanguages.forEach(el => {
      el.selected = false;
    });
    lang.selected = true;
    if (lang.label) {
      this.languageHelperService.setLanguage(lang.label);
    }
  }
}
