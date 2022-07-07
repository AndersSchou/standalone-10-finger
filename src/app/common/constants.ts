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
  'chevron_left',
  'courses',
  'error',
  'games',
  'icon_read',
  'icon_replay',
  'icon_sound',
  'icon_speed',
  'icon_symbol',
  'info',
  'keyboard',
  'logo_10_finger',
  'logo_10_finger_text',
  'rocket',
  'settings'
];
