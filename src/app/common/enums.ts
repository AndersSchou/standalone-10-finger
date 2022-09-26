// Colors enum.
export enum Color {
  Color1 = 1,
  Color2 = 2,
  Color3 = 3,
  Color4 = 4,
  Color5 = 5
}

// Storage keys enum.
// KEYBOARD_THEME_COLOR is the name for the keyboard theme color.
// KEYBOARD_PRIMARY_LAYOUT is the name for the keyboard primary layout.
// CURRENT_LANGUAGE is the name for the current language.
// COURSES_PROGRESS is the name for the courses progress.
// FISH_GAME_PROGRESS is the name for the fish game progress.
export enum STORAGE_KEY_TYPE {
  KEYBOARD_THEME_COLOR = 'keyboardThemeColor',
  KEYBOARD_PRIMARY_LAYOUT = 'keyboardPrimaryLayout',
  CURRENT_LANGUAGE = 'activeLanguage',
  COURSES_PROGRESS = 'coursesProgress',
  FISH_GAME_PROGRESS = 'fishGameProgress',
}

// Text settings types.
export enum TEXT_SETTINGS_TYPE {
  TEXT_COLOR = 'textColor',
  TEXT_SIZE = 'textSize',
  TEXT_REPEAT = 'textRepeat',
  TEXT_FAMILY = 'textFamily',
  TEXT_DISPLAY_LAYOUT = 'textDisplayLayout',
  READ_LETTER = 'readLetter',
  READ_TEXT = 'readText',
}

/**
 * Enum that holds the reading options.
 */
export enum READING_IDENTIFIER {
  READ_WORD = 'READ_WORD',
  READ_SENTENCE = 'READ_SENTENCE',
  READ_CHARACTER = 'READ_CHARACTER',
}
