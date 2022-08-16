import { TEXT_SETTINGS_TYPE } from "./enums";

// Keyboard color group types.
export type KEYBOARD_COLOR_GROUP_TYPE = '' | 'color-group' | 'single-color-group';
// Keyboard layout types.
export type KEYBOARD_LAYOUT_GROUP_TYPE = 'full' | 'partial' | 'minimal';

// export type KEYBOARD_LAYOUT_MODE_TYPE = 'full' | 'partial' | 'minimal' | 'numbers' | 'no-numbers';
// Keyboard language.
export type KEYBOARD_LANGUAGE = 'da' | 'sv' | 'nn' | 'nb';

// Text settings types.
export type TextSettings =
  | TextSettingsColor
  | TextSettingsSize
  | TextSettingsRepeat
  | TextSettingsFamily
  | TextSettingsDisplayLayout
  | TextSettingsReadLetter
  | TextSettingsReadText;

/**
 * Text setting type definition for text color.
 */
export interface TextSettingsColor {
  type: TEXT_SETTINGS_TYPE.TEXT_COLOR;
  value: string;
}

/**
 * Text setting type definition for text font size.
 */
export interface TextSettingsSize {
  type: TEXT_SETTINGS_TYPE.TEXT_SIZE;
  value: string;
}

/**
 * Text setting type definition for text word repeat.
 */
export interface TextSettingsRepeat {
  type: TEXT_SETTINGS_TYPE.TEXT_REPEAT;
  value: string;
}

/**
 * Text setting type definition for text font family.
 */
export interface TextSettingsFamily {
  type: TEXT_SETTINGS_TYPE.TEXT_FAMILY;
  value: string;
}

/**
 * Text setting type definition for layout display.
 */
export interface TextSettingsDisplayLayout {
  type: TEXT_SETTINGS_TYPE.TEXT_DISPLAY_LAYOUT;
  value: string;
}

/**
 * Text setting type definition for read letter options.
 */
export interface TextSettingsReadLetter {
  type: TEXT_SETTINGS_TYPE.READ_LETTER;
  value: string;
}

/**
 * Text setting type definition for read text options.
 */
export interface TextSettingsReadText {
  type: TEXT_SETTINGS_TYPE.READ_TEXT;
  value: string;
}
