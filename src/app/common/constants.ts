import { KeyboardSettingsDTO } from '../dto/settings.dto';
import { Color } from './enums';

// Default debounce time.
export const DEFAULT_DEBOUNCE_MIN_TIME = 300;
// Error code for SessionID has timed out.
export const SESSIONID_TIMEOUT = 699665;
// Error code for something wrong with sessionID.
export const SESSIONID_NOT_VALID = 164887;
// Error code for inappropriate character from speak api.
export const SPEAK_NOT_VALID = 365123;

// Array with all the names of the svgs that will be used with mat-icon.
// IMPORTANT: Every time a new svg that will be used with mat-icon, is added to the app, add the name of the svg in this array.
// DO NOT add the svgs that will be used only in scss files, and not in HTML with mat-icon.
// This array is used only for fetching all the svgs only once, when the app loads.
// This was done to avoid the errors thrown by MatIconRegistry when it can't find/fetch the svg (on internet connection issues).
export const APP_ICONS = [
  'achivements',
  'checkbox_checked',
  'checkbox_unchecked',
  'chevron_down',
  'chevron_left',
  'courses',
  'drag_drop',
  'error',
  'games',
  'icon_close',
  'icon_language',
  'icon_logout',
  'icon_read',
  'icon_replay',
  'icon_sound',
  'icon_speed',
  'icon_symbol',
  'icon_text',
  'info',
  'keyboard',
  'keyboard_1',
  'keyboard_2',
  'keyboard_3',
  'keyboard_mode_1',
  'keyboard_mode_2',
  'keyboard_mode_3',
  'logo_10_finger',
  'logo_10_finger_text',
  'radio_checked',
  'radio_unchecked',
  'reset',
  'rocket',
  'settings'
];

// Colors map based on the key position.
export const colorsMap: { [key: string]: { [key: string]: Color } } = {
  '1': {
    // Row 1 -> Keys 1 2 11 12 13.
    '1': Color.Color1, '2': Color.Color1, '11': Color.Color1, '12': Color.Color1, '13': Color.Color1,
    // Row 1 -> Keys 3 10.
    '3': Color.Color2, '10': Color.Color2,
    // Row 1 -> Keys 4 9.
    '4': Color.Color3, '9': Color.Color3,
    // Row 1 -> Keys 5 6.
    '5': Color.Color4, '6': Color.Color4,
    // Row 1 -> Keys 7 8.
    '7': Color.Color5, '8': Color.Color5,
  },
  '2': {
    // Row 2 -> Keys 2 11 12 13.
    '2': Color.Color1, '11': Color.Color1, '12': Color.Color1, '13': Color.Color1,
    // Row 2 -> Keys 3 10.
    '3': Color.Color2, '10': Color.Color2,
    // Row 2 -> Keys 4 9.
    '4': Color.Color3, '9': Color.Color3,
    // Row 2 -> Keys 5 6.
    '5': Color.Color4, '6': Color.Color4,
    // Row 2 -> Keys 7 8.
    '7': Color.Color5, '8': Color.Color5,
  },
  '3': {
    // Row 3 -> Keys 2 11 12 13.
    '2': Color.Color1, '11': Color.Color1, '12': Color.Color1, '13': Color.Color1,
    // Row 3 -> Keys 3 10.
    '3': Color.Color2, '10': Color.Color2,
    // Row 3 -> Keys 4 9.
    '4': Color.Color3, '9': Color.Color3,
    // Row 3 -> Keys 5 6.
    '5': Color.Color4, '6': Color.Color4,
    // Row 3 -> Keys 7 8.
    '7': Color.Color5, '8': Color.Color5,
  },
  '4': {
    // Row 4 -> Keys 3 12.
    '3': Color.Color1, '12': Color.Color1,
    // Row 4 -> Keys 4 11.
    '4': Color.Color2, '11': Color.Color2,
    // Row 4 -> Keys 5 10.
    '5': Color.Color3, '10': Color.Color3,
    // Row 4 -> Keys 6 7.
    '6': Color.Color4, '7': Color.Color4,
    // Row 4 -> Keys 8 9.
    '8': Color.Color5, '9': Color.Color5,
  },
};


export const DefaultFontFamilies: KeyboardSettingsDTO[] = [
  { type: 'roboto', label: 'Roboto', selected: false },
  { type: 'arial', label: 'Arial', selected: false },
  { type: 'georgia', label: 'Georgia', selected: false },
  { type: 'other', label: 'Other', selected: false },
]

export const DefaultExtraFontFamilies: KeyboardSettingsDTO[] = [
  { type: 'times', label: 'Times New Roman', selected: false },
  { type: 'verdana', label: 'Verdana', selected: false },
  { type: 'tahoma', label: 'Tahoma', selected: false },
  { type: 'calibri', label: 'Calibri', selected: false },
];

export const DefaultTextBgColor: KeyboardSettingsDTO[] = [
  { type: 'color', label: 'Colored text', selected: false },
  { type: 'no-color', label: 'No colored text', selected: false },
];

export const DefaultExerciseLayout: KeyboardSettingsDTO[] = [
  { type: 'top', label: 'ABCDE', selected: false },
  { type: 'bottom', label: 'ABCDE', selected: false },
];
