import { TEXT_SETTINGS_TYPE } from "./enums";

export type KEYBOARD_COLOR_GROUP_TYPE = '' | 'color-group' | 'single-color-group';

export type KEYBOARD_LAYOUT_GROUP_TYPE = 'full' | 'partial' | 'minimal';

// export type KEYBOARD_LAYOUT_MODE_TYPE = 'full' | 'partial' | 'minimal' | 'numbers' | 'no-numbers';

export type KEYBOARD_LANGUAGE = 'da' | 'sv' | 'nn' | 'nb' | 'ro';

export type TextSettings =
  | TextSettingsColor
  | TextSettingsSize
  | TextSettingsRepeat
  | TextSettingsFamily
  | TextSettingsDisplayLayout
  | TextSettingsReadLetter
  | TextSettingsReadText;

/**
 * Tool type definition for loading from url.
 */
export interface TextSettingsColor {
  type: TEXT_SETTINGS_TYPE.TEXT_COLOR;
  value: string;
}
export interface TextSettingsSize {
  type: TEXT_SETTINGS_TYPE.TEXT_SIZE;
  value: string;
}
export interface TextSettingsRepeat {
  type: TEXT_SETTINGS_TYPE.TEXT_REPEAT;
  value: string;
}
export interface TextSettingsFamily {
  type: TEXT_SETTINGS_TYPE.TEXT_FAMILY;
  value: string;
}
export interface TextSettingsDisplayLayout {
  type: TEXT_SETTINGS_TYPE.TEXT_DISPLAY_LAYOUT;
  value: string;
}
export interface TextSettingsReadLetter {
  type: TEXT_SETTINGS_TYPE.READ_LETTER;
  value: string;
}
export interface TextSettingsReadText {
  type: TEXT_SETTINGS_TYPE.READ_TEXT;
  value: string;
}
