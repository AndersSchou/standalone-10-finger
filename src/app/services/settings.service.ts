import { KeyboardSettingsDTO, TextSettingsSizeDTO } from 'src/app/dto/settings.dto';
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { DefaultReadLetterOptions, DefaultReadTextOptions } from "../common/constants";
import { STORAGE_KEY_TYPE, TEXT_SETTINGS_TYPE } from "../common/enums";
import { KEYBOARD_COLOR_GROUP_TYPE, KEYBOARD_LAYOUT_GROUP_TYPE, TextSettings } from "../common/types";

/**
 * TextSettingsService is used to handle all the settings.
 */
@Injectable()
export class SettingsService {
  // The subject used to controls the service communication.
  private viewSettingsSource = new Subject<boolean>();
  // Observable instance of the source object.
  private viewSettingsObservable = this.viewSettingsSource.asObservable();
  // The subject used to controls the service communication.
  private keyboardThemeColorSource = new Subject<KEYBOARD_COLOR_GROUP_TYPE>();
  // Observable instance of the source object.
  private keyboardThemeColorObservable = this.keyboardThemeColorSource.asObservable();
  // The subject used to controls the service communication.
  private keyboardPrimaryModeSource = new Subject<KEYBOARD_LAYOUT_GROUP_TYPE>();
  // Observable instance of the source object.
  private keyboardPrimaryObservable = this.keyboardPrimaryModeSource.asObservable();
  // The subject used to controls the service communication.
  private textSettingsSource = new Subject<TextSettings>();
  // Observable instance of the source object.
  private textSettingsObservable = this.textSettingsSource.asObservable();
  // The subject used to controls the service communication.
  private themeSettingsSource = new Subject<string>();
  // Observable instance of the source object.
  private themeSettingsObservable = this.themeSettingsSource.asObservable();

  /**
   * Getter function for private viewSettings Observable.
   *
   * @return Observable<boolean> That listens for any actions.
   */
  public get viewSettingsAction(): Observable<boolean> {
    return this.viewSettingsObservable;
  }

  /**
   * Getter function for private viewSettings Observable.
   *
   * @return Observable<KEYBOARD_COLOR_GROUP_TYPE> That listens for any actions.
   */
  public get keyboardThemeColorAction(): Observable<KEYBOARD_COLOR_GROUP_TYPE> {
    return this.keyboardThemeColorObservable;
  }

  /**
   * Getter function for private viewSettings Observable.
   *
   * @return Observable<KEYBOARD_LAYOUT_GROUP_TYPE> That listens for any actions.
   */
  public get keyboardPrimaryModeAction(): Observable<KEYBOARD_LAYOUT_GROUP_TYPE> {
    return this.keyboardPrimaryObservable;
  }

  /**
   * Getter function for private viewSettings Observable.
   *
   * @return Observable<TextSettings> That listens for any actions.
   */
  public get textSettingsAction(): Observable<TextSettings> {
    return this.textSettingsObservable;
  }

  /**
   * Getter function for private viewSettings Observable.
   *
   * @return Observable<string> That listens for any actions.
   */
  public get themeSettingsAction(): Observable<string> {
    return this.themeSettingsObservable;
  }

  /**
   * Calls the source of the observable and cascades the action.
   *
   * @param value Is the action object you want to cascade.
   */
  toggleSettings(value: boolean): void {
    this.viewSettingsSource.next(value);
  }

  /**
   * Calls the source of the observable and cascades the action.
   *
   * @param value Is the action object you want to cascade.
   */
  setKeyboardThemeColor(value: KEYBOARD_COLOR_GROUP_TYPE): void {
    this.keyboardThemeColorSource.next(value);
  }

  /**
   * Calls the source of the observable and cascades the action.
   *
   * @param value Is the action object you want to cascade.
   */
  setKeyboardPrimaryMode(value: KEYBOARD_LAYOUT_GROUP_TYPE): void {
    this.keyboardPrimaryModeSource.next(value);
  }

  /**
   * Calls the source of the observable and cascades the action.
   *
   * @param value Is the action object you want to cascade.
   */
  setTextSetting(value: TextSettings): void {
    this.textSettingsSource.next(value);
  }

  /**
   * Calls the source of the observable and cascades the action.
   *
   * @param value Is the action object you want to cascade.
   */
  setThemeSetting(value: string): void {
    this.themeSettingsSource.next(value);
  }

  /**
   * Set default settings if they're not set.
   */
  setDefaultSettings(): void {
    this.setDefaultTextSize();
    this.setDefaultTextColor();
    this.setDefaultTextDisplayLayout();
    this.setDefaultReadLetter();
    this.setDefaultReadText();
    this.setDefaultKeyboardThemeColor();
    this.setDefaultKeyboardPrimaryLayout();
    this.setDefaultThemeColor();
    this.setDefaultGameSoundOption();
  }

  /**
   * Cleans up the local storage.
   */
  storageCleanup(): void {
    if (localStorage.getItem(STORAGE_KEY_TYPE.CURRENT_LANGUAGE)) {
      localStorage.removeItem(STORAGE_KEY_TYPE.CURRENT_LANGUAGE);
    }
    if (localStorage.getItem(TEXT_SETTINGS_TYPE.TEXT_SIZE)) {
      localStorage.removeItem(TEXT_SETTINGS_TYPE.TEXT_SIZE);
    }
    if (localStorage.getItem(TEXT_SETTINGS_TYPE.TEXT_COLOR)) {
      localStorage.removeItem(TEXT_SETTINGS_TYPE.TEXT_COLOR);
    }
    if (localStorage.getItem(TEXT_SETTINGS_TYPE.TEXT_DISPLAY_LAYOUT)) {
      localStorage.removeItem(TEXT_SETTINGS_TYPE.TEXT_DISPLAY_LAYOUT);
    }
    if (localStorage.getItem(TEXT_SETTINGS_TYPE.READ_LETTER)) {
      localStorage.removeItem(TEXT_SETTINGS_TYPE.READ_LETTER);
    }
    if (localStorage.getItem(TEXT_SETTINGS_TYPE.READ_TEXT)) {
      localStorage.removeItem(TEXT_SETTINGS_TYPE.READ_TEXT);
    }
    if (localStorage.getItem(STORAGE_KEY_TYPE.COURSES_PROGRESS)) {
      localStorage.removeItem(STORAGE_KEY_TYPE.COURSES_PROGRESS);
    }
    if (localStorage.getItem(STORAGE_KEY_TYPE.KEYBOARD_THEME_COLOR)) {
      localStorage.removeItem(STORAGE_KEY_TYPE.KEYBOARD_THEME_COLOR);
    }
    if (localStorage.getItem(STORAGE_KEY_TYPE.KEYBOARD_PRIMARY_LAYOUT)) {
      localStorage.removeItem(STORAGE_KEY_TYPE.KEYBOARD_PRIMARY_LAYOUT);
    }
    if (localStorage.getItem(STORAGE_KEY_TYPE.GAME_SOUND_OPTION)) {
      localStorage.removeItem(STORAGE_KEY_TYPE.GAME_SOUND_OPTION);
    }
    if (localStorage.getItem(STORAGE_KEY_TYPE.MAIN_THEME_COLOR)) {
      localStorage.removeItem(STORAGE_KEY_TYPE.MAIN_THEME_COLOR);
    }
    if (localStorage.getItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS)) {
      localStorage.removeItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS);
    }
  }

  /**
   * Set default game sound option if it's not set.
   */
  setDefaultGameSoundOption(): void {
    if (!localStorage.getItem(STORAGE_KEY_TYPE.GAME_SOUND_OPTION)) {
      localStorage.setItem(STORAGE_KEY_TYPE.GAME_SOUND_OPTION, 'on');
    }
  }

  /**
   * Set default text size.
   */
  setDefaultTextSize(): void {
    if (!localStorage.getItem(TEXT_SETTINGS_TYPE.TEXT_SIZE)) {
      localStorage.setItem(TEXT_SETTINGS_TYPE.TEXT_SIZE, JSON.stringify(
        {
          fontSize: '24px',
          fontFamily: 'Roboto'
        }
      ));
    }
  }

  /**
   * Get the default game sound option.
   *
   * @returns The game sound option.
   */
  getDefaultGameSoundOption(): string {
    this.setDefaultGameSoundOption();
    return localStorage.getItem(STORAGE_KEY_TYPE.GAME_SOUND_OPTION) as string;
  }

  /**
   * Set default text color.
   */
  setDefaultTextColor(): void {
    if (!localStorage.getItem(TEXT_SETTINGS_TYPE.TEXT_COLOR)) {
      localStorage.setItem(TEXT_SETTINGS_TYPE.TEXT_COLOR, JSON.stringify('no-color'));
    }
  }

  /**
   * Set default text display layout.
   */
  setDefaultTextDisplayLayout(): void {
    if (!localStorage.getItem(TEXT_SETTINGS_TYPE.TEXT_DISPLAY_LAYOUT)) {
      localStorage.setItem(TEXT_SETTINGS_TYPE.TEXT_DISPLAY_LAYOUT, JSON.stringify('top'));
    }
  }

  /**
   * Set default read letter.
   */
  setDefaultReadLetter(): void {
    if (!localStorage.getItem(TEXT_SETTINGS_TYPE.READ_LETTER)) {
      const readLetter = DefaultReadLetterOptions[DefaultReadLetterOptions.length - 1];
      readLetter.selected = true;
      localStorage.setItem(TEXT_SETTINGS_TYPE.READ_LETTER, JSON.stringify(readLetter));
    }
  }

  /**
   * Set default read text.
   */
  setDefaultReadText(): void {
    if (!localStorage.getItem(TEXT_SETTINGS_TYPE.READ_TEXT)) {
      const readText = DefaultReadTextOptions;
      for (const opt of readText) {
        opt.selected = true;
      }
      localStorage.setItem(TEXT_SETTINGS_TYPE.READ_TEXT, JSON.stringify(readText));
    }
  }

  /**
   * Set default keyboard theme color.
   */
  setDefaultKeyboardThemeColor(): void {
    if (!localStorage.getItem(STORAGE_KEY_TYPE.KEYBOARD_THEME_COLOR)) {
      localStorage.setItem(STORAGE_KEY_TYPE.KEYBOARD_THEME_COLOR, 'single-color-group');
    }
  }

  /**
   * Set default keyboard primary layout.
   */
  setDefaultKeyboardPrimaryLayout(): void {
    if (!localStorage.getItem(STORAGE_KEY_TYPE.KEYBOARD_PRIMARY_LAYOUT)) {
      localStorage.setItem(STORAGE_KEY_TYPE.KEYBOARD_PRIMARY_LAYOUT, 'partial');
    }
  }

  /**
   * Set default theme color.
   */
  setDefaultThemeColor(): void {
    if (!localStorage.getItem(STORAGE_KEY_TYPE.MAIN_THEME_COLOR)) {
      localStorage.setItem(STORAGE_KEY_TYPE.MAIN_THEME_COLOR, 'blue');
    }
  }

  /**
   * Get default text size settings.
   *
   * @returns The default text size settings.
   */
  getDefaultTextSize(): TextSettingsSizeDTO {
    this.setDefaultTextSize();
    return JSON.parse(localStorage.getItem(TEXT_SETTINGS_TYPE.TEXT_SIZE) as string);
  }

  /**
   * Get default text color settings.
   *
   * @returns The default text color settings.
   */
  getDefaultTextColor(): string {
    this.setDefaultTextColor();
    return JSON.parse(localStorage.getItem(TEXT_SETTINGS_TYPE.TEXT_COLOR) as string);
  }

  /**
   * Get default text display layout settings
   *
   * @returns The default text display layout settings.
   */
  getDefaultTextDisplayLayout(): string {
    this.setDefaultTextDisplayLayout();
    return JSON.parse(localStorage.getItem(TEXT_SETTINGS_TYPE.TEXT_DISPLAY_LAYOUT) as string);
  }

  /**
   * Get default read letter settings.
   *
   * @returns The default read letter settings.
   */
  getDefaultReadLetter(): KeyboardSettingsDTO {
    this.setDefaultReadLetter();
    return JSON.parse(localStorage.getItem(TEXT_SETTINGS_TYPE.READ_LETTER) as string);
  }

  /**
   * Get default read text settings.
   *
   * @returns The default read text settings.
   */
  getDefaultReadText(): KeyboardSettingsDTO[] {
    this.setDefaultReadText();
    return JSON.parse(localStorage.getItem(TEXT_SETTINGS_TYPE.READ_TEXT) as string);
  }

  /**
   * Get default keyboard theme color settings.
   *
   * @returns The default keyboard theme color settings.
   */
  getDefaultKeyboardThemeColor(): string {
    this.setDefaultKeyboardThemeColor();
    return localStorage.getItem(STORAGE_KEY_TYPE.KEYBOARD_THEME_COLOR) as string;
  }

  /**
   * Get default keyboard primary layout settings.
   *
   * @returns The default keyboard primary layout settings.
   */
  getDefaultKeyboardPrimaryLayout(): string {
    this.setDefaultKeyboardPrimaryLayout();
    return localStorage.getItem(STORAGE_KEY_TYPE.KEYBOARD_PRIMARY_LAYOUT) as string;
  }

  /**
   * Get default main theme color settings.
   *
   * @returns The default main theme color settings.
   */
  getDefaultMainThemeColor(): string {
    this.setDefaultThemeColor();
    return localStorage.getItem(STORAGE_KEY_TYPE.MAIN_THEME_COLOR) as string;
  }

}
