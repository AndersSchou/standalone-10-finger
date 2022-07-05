import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

/**
 * LanguageHelperService is used to detect any changes regarding user's language.
 * The default language will be the first language from the available languages array.
 * When the user region language is detected or the user changes the language, the app will
 * use the selected language.
 */
@Injectable()
export class LanguageHelperService {
  // Available languages.
  readonly availableLanguages = environment.availableLanguages;

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param translateService Is an instance of TranslateService from TranslateModule.
   */
  constructor(private readonly translateService: TranslateService) {
    // Add languages to the translations array.
    this.translateService.addLangs(this.availableLanguages);

    /**
     * The first language from the available languages array will be used as a fallback when a translation isn't found
     * into the current language.
     */
    this.translateService.setDefaultLang(this.availableLanguages[0]);
    this.translateService.use(this.availableLanguages[0]);
    // TODO: Set the language based on the user region language.
  }

  /**
   * Get the current used language.
   *
   * @returns The current used language as string.s
   */
  getCurrentLanguageAndTranslations(): string {
    return this.translateService.currentLang;
  }

}
