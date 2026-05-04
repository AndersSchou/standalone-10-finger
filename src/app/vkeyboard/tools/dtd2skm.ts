import * as DTDTypes from "../helpers/dtd.type";

/**
 * Keyboard definition for the virtual keyboard.
 */
export interface KeyboardDefinitionDTO {
  [key: string]: {
    key: string;
    value: string;
    shift: boolean;
    alt: boolean;
  }
}

/**
 * Maps the keyboard raw data into a KeyboardDefinitionDTO object.
 *
 * @param keyboard Represents the keyboard object.
 *
 * @returns A map with the index as the key.
 */
export function dtd2conf(keyboard: {
  keymapper: { i: number, m: '' | 'shift' | 'alt' }[],
  DTDKeyboardLayout: DTDTypes.RootObject
}): KeyboardDefinitionDTO {
  const arr = dtd2array(keyboard);
  const mapObject: KeyboardDefinitionDTO = {};
  for (let i = 0; i < arr.length; i++) {
    mapObject[`${arr[i].line}-${arr[i].line == 4 ? arr[i].row + 1 : arr[i].row}-${arr[i].modifier}`] = {
      // Shift key is not calculated in row 4.
      key: `${arr[i].line}-${arr[i].line == 4 ? arr[i].row + 1 : arr[i].row}`,
      value: arr[i].value,
      shift: arr[i].modifier === 'shift',
      alt: arr[i].modifier === 'alt',
    }
  }
  return mapObject;
}

/**
 * Maps the keyboard raw data into a KeyboardDefinitionDTO object.
 *
 * @param keyboard Represents the keyboard object.
 *
 * @returns A map with the value as the key.
 */
export function dtd2skm(keyboard: {
  keymapper: { i: number, m: '' | 'shift' | 'alt' }[],
  DTDKeyboardLayout: DTDTypes.RootObject
}): KeyboardDefinitionDTO {
  const arr = dtd2array(keyboard);
  const mapObject: KeyboardDefinitionDTO = {};
  for (let i = 0; i < arr.length; i++) {
    mapObject[arr[i].value] = {
      // Shift key is not calculated in row 4.
      key: `${arr[i].line}-${arr[i].line == 4 ? arr[i].row + 1 : arr[i].row}`,
      value: arr[i].value,
      shift: arr[i].modifier === 'shift',
      alt: arr[i].modifier === 'alt',
    }
  }
  return mapObject;
}

/**
 * Maps the keyboard raw data into a KeyboardDefinitionDTO object.
 *
 * @param keyboard Represents the keyboard object.
 *
 * @returns An array with the parsed data for each key.
 */
function dtd2array(keyboard: { keymapper: { i: number, m: '' | 'shift' | 'alt' }[], DTDKeyboardLayout: DTDTypes.RootObject }): any[] {
  return arrayOfArrayToArray(keyboard.keymapper.map(el => {
    const map = keyboard.DTDKeyboardLayout.keyboard.keyMap[el.i];
    const modifier = el.m;
    return parseMap(map.map, modifier);
  }));
}

/**
 * Map the raw data for each key.
 *
 * @param map Represents the raw data of the key that will be parsed.
 * @param modifier Represents the key modifier (shift, alt, etc.).
 *
 * @returns An array of objects for each key with the following structure: { line: number, row: number, value: string, modifier: string }.
 */
function parseMap(map: DTDTypes.Map[] | DTDTypes.Map, modifier = ''): Array<{
  line: number;
  row: number;
  value: string;
  modifier: '' | 'shift' | 'alt';
}> {
  if (!('length' in map)) {
    map = [map];
  }
  return map.map(el => {
    if (el['-iso']) {
      // LINES E D C B.
      const group = el['-iso'][0];
      let key = Number(el['-iso'][2]) * 1;
      if (el['-iso'][1] !== '0') {
        key += 10;
      }
      return {
        line: lineCodeToLine(group),
        row: key + 1,
        value: el["-to"],
        modifier
      };
    }
    return false;
  }).filter(el => el && el.line) as any;
}

/**
 * Convert a line code to a line number (ex. key with "-iso: E00" is located in the first row at position 0).
 *
 * @param code Represents the line code.
 *
 * @returns The line number.
 */
function lineCodeToLine(code: 'E' | 'D' | 'C' | 'B' | 'A' | string): number {
  switch (code) {
    case 'E':
      return 1;
    case 'D':
      return 2;
    case 'C':
      return 3;
    case 'B':
      return 4;
    case 'A':
      return 5;
  }
  return 0;
}

/**
 * Transforms an array of arrays into a single array.
 *
 * @param arr Represents the array of arrays.
 *
 * @returns An array with the elements of the array of arrays.
 */
function arrayOfArrayToArray(arr: any[][]) {
  return arr.reduce((acc, el) => {
    return [...acc, ...el];
  }, []);
}
