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
   * Set default settings if they're not set.
   */
  setDefaultSettings(): void {
    if (!localStorage.getItem(TEXT_SETTINGS_TYPE.TEXT_SIZE)) {
      localStorage.setItem(TEXT_SETTINGS_TYPE.TEXT_SIZE, JSON.stringify(
        {
          fontSize: '24px',
          fontFamily: 'Roboto'
        }
      ));
    }

    if (!localStorage.getItem(TEXT_SETTINGS_TYPE.TEXT_COLOR)) {
      localStorage.setItem(TEXT_SETTINGS_TYPE.TEXT_COLOR, JSON.stringify('no-color'));
    }

    if (!localStorage.getItem(TEXT_SETTINGS_TYPE.TEXT_DISPLAY_LAYOUT)) {
      localStorage.setItem(TEXT_SETTINGS_TYPE.TEXT_DISPLAY_LAYOUT, JSON.stringify('bottom'));
    }

    if (!localStorage.getItem(TEXT_SETTINGS_TYPE.READ_LETTER)) {
      const readLetter = DefaultReadLetterOptions[DefaultReadLetterOptions.length - 1];
      readLetter.selected = true;
      localStorage.setItem(TEXT_SETTINGS_TYPE.READ_LETTER, JSON.stringify(readLetter));
    }

    if (!localStorage.getItem(TEXT_SETTINGS_TYPE.READ_TEXT)) {
      const readText = DefaultReadTextOptions;
      for (const opt of readText) {
        opt.selected = true;
      }
      localStorage.setItem(TEXT_SETTINGS_TYPE.READ_TEXT, JSON.stringify(readText));
    }

    if (!localStorage.getItem(STORAGE_KEY_TYPE.KEYBOARD_THEME_COLOR)) {
      localStorage.setItem(STORAGE_KEY_TYPE.KEYBOARD_THEME_COLOR, '');
    }

    if (!localStorage.getItem(STORAGE_KEY_TYPE.KEYBOARD_PRIMARY_LAYOUT)) {
      localStorage.setItem(STORAGE_KEY_TYPE.KEYBOARD_PRIMARY_LAYOUT, 'full');
    }
  }

  /**
   * Cleans up the local storage.
   */
  storageCleanup(): void {
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
  }

}
