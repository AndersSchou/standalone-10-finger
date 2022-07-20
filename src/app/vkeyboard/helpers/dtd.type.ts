export interface Version {
    "-platform": string;
    "-number": string;
    "-self-closing": string;
}

export interface Name {
    "-value": string;
    "-self-closing": string;
}

export interface Names {
    name: Name;
}

export interface Settings {
    "-fallback": string;
    "-transformPartial": string;
    "-self-closing": string;
}

export interface Item {
    "#comment": string;
}

export interface Map {
    "-iso": string;
    "-to": string;
    "-self-closing": string;
    "#item": Item;
}

export interface KeyMap {
    map: Map[];
    "#comment": string;
    "-modifiers": string;
}

export interface Transform {
    "-from": string;
    "-to": string;
    "-self-closing": string;
}

export interface Transforms {
    "-type": string;
    transform: Transform[];
}

export interface Keyboard {
    "-locale": string;
    version: Version;
    names: Names;
    settings: Settings;
    keyMap: KeyMap[];
    transforms: Transforms;
}

export interface RootObject {
    "!DOCTYPE": string;
    keyboard: Keyboard;
}


