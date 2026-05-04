/**
 * Version interface.
 */
export interface Version {
  "-platform": string;
  "-number": string;
  "-self-closing": string;
}

/**
 * Name interface.
 */
export interface Name {
  "-value": string;
  "-self-closing": string;
}

/**
 * Names interface.
 */
export interface Names {
  name: Name;
}

/**
 * Settings interface.
 */
export interface Settings {
  "-fallback": string;
  "-transformPartial": string;
  "-self-closing": string;
}

/**
 * Items interface.
 */
export interface Item {
  "#comment": string;
}

/**
 * Map interface.
 */
export interface Map {
  "-iso": string;
  "-to": string;
  "-self-closing": string;
  "#item": Item;
}

/**
 * KeyMap interface.
 */
export interface KeyMap {
  map: Map[];
  "#comment": string;
  "-modifiers": string;
}

/**
 * Transform interface.
 */
export interface Transform {
  "-from": string;
  "-to": string;
  "-self-closing": string;
}

/**
 * Transforms interface.
 */
export interface Transforms {
  "-type": string;
  transform: Transform[];
}

/**
 * Keyboard interface.
 */
export interface Keyboard {
  "-locale": string;
  version: Version;
  names: Names;
  settings: Settings;
  keyMap: KeyMap[];
  transforms: Transforms;
}

/**
 * RootObject interface.
 */
export interface RootObject {
  "!DOCTYPE": string;
  keyboard: Keyboard;
}
