import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { KEYBOARD_COLOR_GROUP_TYPE, KEYBOARD_LAYOUT_GROUP_TYPE, TextSettings } from "../common/types";

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
}
