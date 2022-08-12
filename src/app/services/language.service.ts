import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { STORAGE_KEY_TYPE } from '../common/enums';
import { TranslationsDTO, TranslationsResponseDTO } from '../dto/translation.dto';

/**
 * LanguageHelperService is used to detect any changes regarding user's language.
 * The default language will be the first language from the available languages array.
 * When the user region language is detected or the user changes the language, the app will
 * use the selected language.
 */
@Injectable()
export class LanguageHelperService {
  // Stores the translations.
  private translationsStrings: TranslationsDTO = {};
  // Current language.
  private currentLanguage: string = '';
  // Available languages.
  readonly availableLanguages = environment.availableLanguages;
  private getTransSource = new Subject<TranslationsDTO>();
  /**
   * Observable instance of the source object.
   */
  public OnLanguageChanged = this.getTransSource.asObservable();

  /**
   * Gets the translations object.
   */
  get translationObject(): TranslationsDTO {
    return this.translationsStrings;
  }

  /**
   * Gets the current language.
   */
  get currentLangUsed(): string {
    return this.currentLanguage;
  }

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param translateService Is an instance of TranslateService from TranslateModule.
   */
  constructor(private readonly translateService: TranslateService) {
    this.translateService.onLangChange.subscribe((data) => {
      return this.getCurrentLanguageAndTranslations(data);
    });
    // Add languages to the translations array.
    this.translateService.addLangs(this.availableLanguages);

    const userSavedLang = window.localStorage.getItem(STORAGE_KEY_TYPE.CURRENT_LANGUAGE);

    // Checks if the user language was saved locally.
    if (userSavedLang) {
      this.setLanguage(userSavedLang);
    } else {
      /**
     * The first language from the available languages array will be used as a fallback when a translation isn't found
     * into the current language.
     */
      this.translateService.setDefaultLang(this.availableLanguages[0]);
      this.translateService.use(this.availableLanguages[0]);
    }


    // TODO: Set the language based on the user region language.
  }

  /**
   * Get the current used language.
   *
   * @returns The current used language as string.s
   */
  getCurrentLanguageAndTranslations(language: TranslationsResponseDTO): void {
    this.currentLanguage = this.translateService.currentLang;
    this.translationsStrings = language.translations;
    this.getTransSource.next(this.translationsStrings);
  }

  /**
   * Changes the language currently used.
   *
   * @param language Represents the selected language.
   */
  setLanguage(language: string): void {
    this.translateService.use(language);
    window.localStorage.setItem(STORAGE_KEY_TYPE.CURRENT_LANGUAGE, language);
  }

}
