import * as DTDTypes from "../helpers/dtd.type";

// returns a map with the index as the key
export function dtd2conf(keyboard: { keymapper: { i: number, m: '' | 'shift' | 'alt' }[], DTDKeyboardLayout: DTDTypes.RootObject }) {
  const arr = dtd2array(keyboard);
  const mapObject: {
    [key: string]: {
      key: string;
      value: string;
      shift: boolean;
      alt: boolean;
    }
  } = {};
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

// returns a map with the value as the key
export function dtd2skm(keyboard: { keymapper: { i: number, m: '' | 'shift' | 'alt' }[], DTDKeyboardLayout: DTDTypes.RootObject }) {
  const arr = dtd2array(keyboard);
  const mapObject: {
    [key: string]: {
      key: string;
      value: string;
      shift: boolean;
      alt: boolean;
    }
  } = {};
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

function dtd2array(keyboard: { keymapper: { i: number, m: '' | 'shift' | 'alt' }[], DTDKeyboardLayout: DTDTypes.RootObject }) {
  return arrayOfArrayToArray(keyboard.keymapper.map(el => {
    const map = keyboard.DTDKeyboardLayout.keyboard.keyMap[el.i];
    const modifier = el.m;
    return parseMap(map.map, modifier);
  }));
}

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
      // LINES E D C B
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

function lineCodeToLine(code: 'E' | 'D' | 'C' | 'B' | 'A' | string) {
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

function arrayOfArrayToArray(arr: any[][]) {
  return arr.reduce((acc, el) => {
    return [...acc, ...el];
  }, []);
}
