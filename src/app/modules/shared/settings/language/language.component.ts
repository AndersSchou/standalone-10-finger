import { Component } from '@angular/core';
import { KeyboardSettingsDTO } from 'src/app/dto/settings.dto';
import { LanguageHelperService } from 'src/app/services/language.service';
import { environment } from 'src/environments/environment';

/**
 * This component holds the logic for the language settings view.
 */
@Component({
  selector: 'app-shared-settings-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class AppSharedSettingsLanguageComponent {
  // Stores the available languages.
  availableLanguages: KeyboardSettingsDTO[] = [];
  // Stores the current language.
  currentLanguage: string;

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param languageHelperService Reference to LanguageHelperService.
   */
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
    const findCurrentLanguage = this.availableLanguages.find(el => el.label === this.currentLanguage);
    if (findCurrentLanguage) {
      findCurrentLanguage.selected = true;
    }
  }

  /**
   * Sets the new selected language.
   *
   * @param lang Represent the new selected language.
   */
  changeLanguage(lang: KeyboardSettingsDTO) {
    this.availableLanguages.forEach(el => {
      el.selected = false;
    });
    lang.selected = true;
    if (lang.label) {
      this.languageHelperService.setLanguage(lang.label, true);
    }
  }
}
