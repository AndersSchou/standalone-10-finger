/**
 * Key mapper for Swedish keyboard.
 * -i represents the index of the keys in the keyMap array.
 * -m represents the modifier of the key.
 */
export const keymapper = [{ i: 0, m: '' }, { i: 1, m: 'shift' }, { i: 3, m: 'alt' }];

/**
 * Raw data for the keyboard layout.
 */
export const DTDKeyboardLayout = {
  "!DOCTYPE": "keyboard SYSTEM \"http://github.com/unicode-org/cldr/raw/master/keyboards/dtd/ldmlKeyboard.dtd\"",
  "keyboard": {
    "-locale": "sv-t-k0-windows-kbdsw",
    "version": {
      "-platform": "10",
      "-number": "$Revision 25120$",
      "-self-closing": "true"
    },
    "names": {
      "name": {
        "-value": "Swedish",
        "-self-closing": "true"
      }
    },
    "settings": {
      "-fallback": "omit",
      "-transformPartial": "hide",
      "-self-closing": "true"
    },
    "keyMap": [
      {
        "map": [
          {
            "-iso": "E00",
            "-to": "§",
            "-self-closing": "true"
          },
          {
            "-iso": "E01",
            "-to": "1",
            "-self-closing": "true"
          },
          {
            "-iso": "E02",
            "-to": "2",
            "-self-closing": "true"
          },
          {
            "-iso": "E03",
            "-to": "3",
            "-self-closing": "true"
          },
          {
            "-iso": "E04",
            "-to": "4",
            "-self-closing": "true"
          },
          {
            "-iso": "E05",
            "-to": "5",
            "-self-closing": "true"
          },
          {
            "-iso": "E06",
            "-to": "6",
            "-self-closing": "true"
          },
          {
            "-iso": "E07",
            "-to": "7",
            "-self-closing": "true"
          },
          {
            "-iso": "E08",
            "-to": "8",
            "-self-closing": "true"
          },
          {
            "-iso": "E09",
            "-to": "9",
            "-self-closing": "true"
          },
          {
            "-iso": "E10",
            "-to": "0",
            "-self-closing": "true"
          },
          {
            "-iso": "E11",
            "-to": "+",
            "-self-closing": "true"
          },
          {
            "-iso": "E12",
            "-to": "´",
            "-self-closing": "true"
          },
          {
            "-iso": "D00",
            "-to": "\\u{09}",
            "-self-closing": "true"
          },
          {
            "-iso": "D01",
            "-to": "q",
            "-self-closing": "true"
          },
          {
            "-iso": "D02",
            "-to": "w",
            "-self-closing": "true"
          },
          {
            "-iso": "D03",
            "-to": "e",
            "-self-closing": "true"
          },
          {
            "-iso": "D04",
            "-to": "r",
            "-self-closing": "true"
          },
          {
            "-iso": "D05",
            "-to": "t",
            "-self-closing": "true"
          },
          {
            "-iso": "D06",
            "-to": "y",
            "-self-closing": "true"
          },
          {
            "-iso": "D07",
            "-to": "u",
            "-self-closing": "true"
          },
          {
            "-iso": "D08",
            "-to": "i",
            "-self-closing": "true"
          },
          {
            "-iso": "D09",
            "-to": "o",
            "-self-closing": "true"
          },
          {
            "-iso": "D10",
            "-to": "p",
            "-self-closing": "true"
          },
          {
            "-iso": "D11",
            "-to": "å",
            "-self-closing": "true"
          },
          {
            "-iso": "D12",
            "-to": "¨",
            "-self-closing": "true"
          },
          {
            "-iso": "C01",
            "-to": "a",
            "-self-closing": "true"
          },
          {
            "-iso": "C02",
            "-to": "s",
            "-self-closing": "true"
          },
          {
            "-iso": "C03",
            "-to": "d",
            "-self-closing": "true"
          },
          {
            "-iso": "C04",
            "-to": "f",
            "-self-closing": "true"
          },
          {
            "-iso": "C05",
            "-to": "g",
            "-self-closing": "true"
          },
          {
            "-iso": "C06",
            "-to": "h",
            "-self-closing": "true"
          },
          {
            "-iso": "C07",
            "-to": "j",
            "-self-closing": "true"
          },
          {
            "-iso": "C08",
            "-to": "k",
            "-self-closing": "true"
          },
          {
            "-iso": "C09",
            "-to": "l",
            "-self-closing": "true"
          },
          {
            "-iso": "C10",
            "-to": "ö",
            "-self-closing": "true"
          },
          {
            "-iso": "C11",
            "-to": "ä",
            "-self-closing": "true"
          },
          {
            "-iso": "C12",
            "-to": "'",
            "-self-closing": "true"
          },
          {
            "-iso": "C13",
            "-to": "\\u{0D}",
            "-self-closing": "true"
          },
          {
            "-iso": "B00",
            "-to": "<",
            "-self-closing": "true"
          },
          {
            "-iso": "B01",
            "-to": "z",
            "-self-closing": "true"
          },
          {
            "-iso": "B02",
            "-to": "x",
            "-self-closing": "true"
          },
          {
            "-iso": "B03",
            "-to": "c",
            "-self-closing": "true"
          },
          {
            "-iso": "B04",
            "-to": "v",
            "-self-closing": "true"
          },
          {
            "-iso": "B05",
            "-to": "b",
            "-self-closing": "true"
          },
          {
            "-iso": "B06",
            "-to": "n",
            "-self-closing": "true"
          },
          {
            "-iso": "B07",
            "-to": "m",
            "-self-closing": "true"
          },
          {
            "-iso": "B08",
            "-to": ",",
            "-self-closing": "true"
          },
          {
            "-iso": "B09",
            "-to": ".",
            "-self-closing": "true"
          },
          {
            "-iso": "B10",
            "-to": "-",
            "-self-closing": "true"
          },
          {
            "-iso": "A03",
            "-to": " ",
            "-self-closing": "true"
          }
        ]
      },
      {
        "-modifiers": "shift",
        "map": [
          {
            "-iso": "E00",
            "-to": "½",
            "-self-closing": "true"
          },
          {
            "-iso": "E01",
            "-to": "!",
            "-self-closing": "true"
          },
          {
            "-iso": "E02",
            "-to": "\"",
            "-self-closing": "true"
          },
          {
            "-iso": "E03",
            "-to": "#",
            "-self-closing": "true"
          },
          {
            "-iso": "E04",
            "-to": "¤",
            "-self-closing": "true"
          },
          {
            "-iso": "E05",
            "-to": "%",
            "-self-closing": "true"
          },
          {
            "-iso": "E06",
            "-to": "&",
            "-self-closing": "true"
          },
          {
            "-iso": "E07",
            "-to": "/",
            "-self-closing": "true"
          },
          {
            "-iso": "E08",
            "-to": "(",
            "-self-closing": "true"
          },
          {
            "-iso": "E09",
            "-to": ")",
            "-self-closing": "true"
          },
          {
            "-iso": "E10",
            "-to": "=",
            "-self-closing": "true"
          },
          {
            "-iso": "E11",
            "-to": "?",
            "-self-closing": "true"
          },
          {
            "-iso": "E12",
            "-to": "`",
            "-self-closing": "true"
          },
          {
            "-iso": "D00",
            "-to": "\\u{09}",
            "-self-closing": "true"
          },
          {
            "-iso": "D01",
            "-to": "Q",
            "-self-closing": "true"
          },
          {
            "-iso": "D02",
            "-to": "W",
            "-self-closing": "true"
          },
          {
            "-iso": "D03",
            "-to": "E",
            "-self-closing": "true"
          },
          {
            "-iso": "D04",
            "-to": "R",
            "-self-closing": "true"
          },
          {
            "-iso": "D05",
            "-to": "T",
            "-self-closing": "true"
          },
          {
            "-iso": "D06",
            "-to": "Y",
            "-self-closing": "true"
          },
          {
            "-iso": "D07",
            "-to": "U",
            "-self-closing": "true"
          },
          {
            "-iso": "D08",
            "-to": "I",
            "-self-closing": "true"
          },
          {
            "-iso": "D09",
            "-to": "O",
            "-self-closing": "true"
          },
          {
            "-iso": "D10",
            "-to": "P",
            "-self-closing": "true"
          },
          {
            "-iso": "D11",
            "-to": "Å",
            "-self-closing": "true"
          },
          {
            "-iso": "D12",
            "-to": "^",
            "-self-closing": "true"
          },
          {
            "-iso": "C01",
            "-to": "A",
            "-self-closing": "true"
          },
          {
            "-iso": "C02",
            "-to": "S",
            "-self-closing": "true"
          },
          {
            "-iso": "C03",
            "-to": "D",
            "-self-closing": "true"
          },
          {
            "-iso": "C04",
            "-to": "F",
            "-self-closing": "true"
          },
          {
            "-iso": "C05",
            "-to": "G",
            "-self-closing": "true"
          },
          {
            "-iso": "C06",
            "-to": "H",
            "-self-closing": "true"
          },
          {
            "-iso": "C07",
            "-to": "J",
            "-self-closing": "true"
          },
          {
            "-iso": "C08",
            "-to": "K",
            "-self-closing": "true"
          },
          {
            "-iso": "C09",
            "-to": "L",
            "-self-closing": "true"
          },
          {
            "-iso": "C10",
            "-to": "Ö",
            "-self-closing": "true"
          },
          {
            "-iso": "C11",
            "-to": "Ä",
            "-self-closing": "true"
          },
          {
            "-iso": "C12",
            "-to": "*",
            "-self-closing": "true"
          },
          {
            "-iso": "C13",
            "-to": "\\u{0D}",
            "-self-closing": "true"
          },
          {
            "-iso": "B00",
            "-to": ">",
            "-self-closing": "true"
          },
          {
            "-iso": "B01",
            "-to": "Z",
            "-self-closing": "true"
          },
          {
            "-iso": "B02",
            "-to": "X",
            "-self-closing": "true"
          },
          {
            "-iso": "B03",
            "-to": "C",
            "-self-closing": "true"
          },
          {
            "-iso": "B04",
            "-to": "V",
            "-self-closing": "true"
          },
          {
            "-iso": "B05",
            "-to": "B",
            "-self-closing": "true"
          },
          {
            "-iso": "B06",
            "-to": "N",
            "-self-closing": "true"
          },
          {
            "-iso": "B07",
            "-to": "M",
            "-self-closing": "true"
          },
          {
            "-iso": "B08",
            "-to": ";",
            "-self-closing": "true"
          },
          {
            "-iso": "B09",
            "-to": ":",
            "-self-closing": "true"
          },
          {
            "-iso": "B10",
            "-to": "_",
            "-self-closing": "true"
          }
        ]
      },
      {
        "-modifiers": "ctrl",
        "map": [
          {
            "-iso": "E00",
            "-to": "\\u{1C}",
            "-self-closing": "true"
          },
          {
            "-iso": "D11",
            "-to": "\\u{1B}",
            "-self-closing": "true"
          },
          {
            "-iso": "D12",
            "-to": "\\u{1D}",
            "-self-closing": "true"
          },
          {
            "-iso": "C13",
            "-to": "\\u{0A}",
            "-self-closing": "true"
          },
          {
            "-iso": "B00",
            "-to": "\\u{1C}",
            "-self-closing": "true"
          },
          {
            "-iso": "B10",
            "-to": "\\u{1F}",
            "-self-closing": "true"
          }
        ]
      },
      {
        "-modifiers": "ctrl+alt altR",
        "map": [
          {
            "-iso": "E02",
            "-to": "@",
            "-self-closing": "true"
          },
          {
            "-iso": "E03",
            "-to": "£",
            "-self-closing": "true"
          },
          {
            "-iso": "E04",
            "-to": "$",
            "-self-closing": "true"
          },
          {
            "-iso": "E05",
            "-to": "€",
            "-self-closing": "true"
          },
          {
            "-iso": "E07",
            "-to": "{",
            "-self-closing": "true"
          },
          {
            "-iso": "E08",
            "-to": "[",
            "-self-closing": "true"
          },
          {
            "-iso": "E09",
            "-to": "]",
            "-self-closing": "true"
          },
          {
            "-iso": "E10",
            "-to": "}",
            "-self-closing": "true"
          },
          {
            "-iso": "E11",
            "-to": "\\",
            "-self-closing": "true"
          },
          {
            "-iso": "D03",
            "-to": "€",
            "-self-closing": "true"
          },
          {
            "-iso": "D12",
            "-to": "~",
            "-self-closing": "true"
          },
          {
            "-iso": "B00",
            "-to": "|",
            "-self-closing": "true"
          },
          {
            "-iso": "B07",
            "-to": "µ",
            "-self-closing": "true"
          }
        ]
      },
      {
        "-modifiers": "shift+ctrl",
        "map": {
          "-iso": "E06",
          "-to": "\\u{1E}",
          "-self-closing": "true"
        }
      },
      {
        "-modifiers": "caps",
        "map": [
          {
            "-iso": "E00",
            "-to": "§",
            "-self-closing": "true"
          },
          {
            "-iso": "E01",
            "-to": "1",
            "-self-closing": "true"
          },
          {
            "-iso": "E02",
            "-to": "2",
            "-self-closing": "true"
          },
          {
            "-iso": "E03",
            "-to": "3",
            "-self-closing": "true"
          },
          {
            "-iso": "E04",
            "-to": "4",
            "-self-closing": "true"
          },
          {
            "-iso": "E05",
            "-to": "5",
            "-self-closing": "true"
          },
          {
            "-iso": "E06",
            "-to": "6",
            "-self-closing": "true"
          },
          {
            "-iso": "E07",
            "-to": "7",
            "-self-closing": "true"
          },
          {
            "-iso": "E08",
            "-to": "8",
            "-self-closing": "true"
          },
          {
            "-iso": "E09",
            "-to": "9",
            "-self-closing": "true"
          },
          {
            "-iso": "E10",
            "-to": "0",
            "-self-closing": "true"
          },
          {
            "-iso": "E11",
            "-to": "+",
            "-self-closing": "true"
          },
          {
            "-iso": "E12",
            "-to": "´",
            "-self-closing": "true"
          },
          {
            "-iso": "D00",
            "-to": "\\u{09}",
            "-self-closing": "true"
          },
          {
            "-iso": "D01",
            "-to": "Q",
            "-self-closing": "true"
          },
          {
            "-iso": "D02",
            "-to": "W",
            "-self-closing": "true"
          },
          {
            "-iso": "D03",
            "-to": "E",
            "-self-closing": "true"
          },
          {
            "-iso": "D04",
            "-to": "R",
            "-self-closing": "true"
          },
          {
            "-iso": "D05",
            "-to": "T",
            "-self-closing": "true"
          },
          {
            "-iso": "D06",
            "-to": "Y",
            "-self-closing": "true"
          },
          {
            "-iso": "D07",
            "-to": "U",
            "-self-closing": "true"
          },
          {
            "-iso": "D08",
            "-to": "I",
            "-self-closing": "true"
          },
          {
            "-iso": "D09",
            "-to": "O",
            "-self-closing": "true"
          },
          {
            "-iso": "D10",
            "-to": "P",
            "-self-closing": "true"
          },
          {
            "-iso": "D11",
            "-to": "Å",
            "-self-closing": "true"
          },
          {
            "-iso": "D12",
            "-to": "¨",
            "-self-closing": "true"
          },
          {
            "-iso": "C01",
            "-to": "A",
            "-self-closing": "true"
          },
          {
            "-iso": "C02",
            "-to": "S",
            "-self-closing": "true"
          },
          {
            "-iso": "C03",
            "-to": "D",
            "-self-closing": "true"
          },
          {
            "-iso": "C04",
            "-to": "F",
            "-self-closing": "true"
          },
          {
            "-iso": "C05",
            "-to": "G",
            "-self-closing": "true"
          },
          {
            "-iso": "C06",
            "-to": "H",
            "-self-closing": "true"
          },
          {
            "-iso": "C07",
            "-to": "J",
            "-self-closing": "true"
          },
          {
            "-iso": "C08",
            "-to": "K",
            "-self-closing": "true"
          },
          {
            "-iso": "C09",
            "-to": "L",
            "-self-closing": "true"
          },
          {
            "-iso": "C10",
            "-to": "Ö",
            "-self-closing": "true"
          },
          {
            "-iso": "C11",
            "-to": "Ä",
            "-self-closing": "true"
          },
          {
            "-iso": "C12",
            "-to": "'",
            "-self-closing": "true"
          },
          {
            "-iso": "C13",
            "-to": "\\u{0D}",
            "-self-closing": "true"
          },
          {
            "-iso": "B00",
            "-to": "<",
            "-self-closing": "true"
          },
          {
            "-iso": "B01",
            "-to": "Z",
            "-self-closing": "true"
          },
          {
            "-iso": "B02",
            "-to": "X",
            "-self-closing": "true"
          },
          {
            "-iso": "B03",
            "-to": "C",
            "-self-closing": "true"
          },
          {
            "-iso": "B04",
            "-to": "V",
            "-self-closing": "true"
          },
          {
            "-iso": "B05",
            "-to": "B",
            "-self-closing": "true"
          },
          {
            "-iso": "B06",
            "-to": "N",
            "-self-closing": "true"
          },
          {
            "-iso": "B07",
            "-to": "M",
            "-self-closing": "true"
          },
          {
            "-iso": "B08",
            "-to": ",",
            "-self-closing": "true"
          },
          {
            "-iso": "B09",
            "-to": ".",
            "-self-closing": "true"
          },
          {
            "-iso": "B10",
            "-to": "-",
            "-self-closing": "true"
          }
        ]
      },
      {
        "-modifiers": "shift+caps",
        "map": [
          {
            "-iso": "E00",
            "-to": "½",
            "-self-closing": "true"
          },
          {
            "-iso": "E01",
            "-to": "!",
            "-self-closing": "true"
          },
          {
            "-iso": "E02",
            "-to": "\"",
            "-self-closing": "true"
          },
          {
            "-iso": "E03",
            "-to": "#",
            "-self-closing": "true"
          },
          {
            "-iso": "E04",
            "-to": "¤",
            "-self-closing": "true"
          },
          {
            "-iso": "E05",
            "-to": "%",
            "-self-closing": "true"
          },
          {
            "-iso": "E06",
            "-to": "&",
            "-self-closing": "true"
          },
          {
            "-iso": "E07",
            "-to": "/",
            "-self-closing": "true"
          },
          {
            "-iso": "E08",
            "-to": "(",
            "-self-closing": "true"
          },
          {
            "-iso": "E09",
            "-to": ")",
            "-self-closing": "true"
          },
          {
            "-iso": "E10",
            "-to": "=",
            "-self-closing": "true"
          },
          {
            "-iso": "E11",
            "-to": "?",
            "-self-closing": "true"
          },
          {
            "-iso": "E12",
            "-to": "`",
            "-self-closing": "true"
          },
          {
            "-iso": "D00",
            "-to": "\\u{09}",
            "-self-closing": "true"
          },
          {
            "-iso": "D01",
            "-to": "q",
            "-self-closing": "true"
          },
          {
            "-iso": "D02",
            "-to": "w",
            "-self-closing": "true"
          },
          {
            "-iso": "D03",
            "-to": "e",
            "-self-closing": "true"
          },
          {
            "-iso": "D04",
            "-to": "r",
            "-self-closing": "true"
          },
          {
            "-iso": "D05",
            "-to": "t",
            "-self-closing": "true"
          },
          {
            "-iso": "D06",
            "-to": "y",
            "-self-closing": "true"
          },
          {
            "-iso": "D07",
            "-to": "u",
            "-self-closing": "true"
          },
          {
            "-iso": "D08",
            "-to": "i",
            "-self-closing": "true"
          },
          {
            "-iso": "D09",
            "-to": "o",
            "-self-closing": "true"
          },
          {
            "-iso": "D10",
            "-to": "p",
            "-self-closing": "true"
          },
          {
            "-iso": "D11",
            "-to": "å",
            "-self-closing": "true"
          },
          {
            "-iso": "D12",
            "-to": "^",
            "-self-closing": "true"
          },
          {
            "-iso": "C01",
            "-to": "a",
            "-self-closing": "true"
          },
          {
            "-iso": "C02",
            "-to": "s",
            "-self-closing": "true"
          },
          {
            "-iso": "C03",
            "-to": "d",
            "-self-closing": "true"
          },
          {
            "-iso": "C04",
            "-to": "f",
            "-self-closing": "true"
          },
          {
            "-iso": "C05",
            "-to": "g",
            "-self-closing": "true"
          },
          {
            "-iso": "C06",
            "-to": "h",
            "-self-closing": "true"
          },
          {
            "-iso": "C07",
            "-to": "j",
            "-self-closing": "true"
          },
          {
            "-iso": "C08",
            "-to": "k",
            "-self-closing": "true"
          },
          {
            "-iso": "C09",
            "-to": "l",
            "-self-closing": "true"
          },
          {
            "-iso": "C10",
            "-to": "ö",
            "-self-closing": "true"
          },
          {
            "-iso": "C11",
            "-to": "ä",
            "-self-closing": "true"
          },
          {
            "-iso": "C12",
            "-to": "*",
            "-self-closing": "true"
          },
          {
            "-iso": "C13",
            "-to": "\\u{0D}",
            "-self-closing": "true"
          },
          {
            "-iso": "B00",
            "-to": ">",
            "-self-closing": "true"
          },
          {
            "-iso": "B01",
            "-to": "z",
            "-self-closing": "true"
          },
          {
            "-iso": "B02",
            "-to": "x",
            "-self-closing": "true"
          },
          {
            "-iso": "B03",
            "-to": "c",
            "-self-closing": "true"
          },
          {
            "-iso": "B04",
            "-to": "v",
            "-self-closing": "true"
          },
          {
            "-iso": "B05",
            "-to": "b",
            "-self-closing": "true"
          },
          {
            "-iso": "B06",
            "-to": "n",
            "-self-closing": "true"
          },
          {
            "-iso": "B07",
            "-to": "m",
            "-self-closing": "true"
          },
          {
            "-iso": "B08",
            "-to": ";",
            "-self-closing": "true"
          },
          {
            "-iso": "B09",
            "-to": ":",
            "-self-closing": "true"
          },
          {
            "-iso": "B10",
            "-to": "_",
            "-self-closing": "true"
          }
        ]
      }
    ],
    "vkeys": {
      "-type": "windows",
      "vkey": [
        {
          "-iso": "E11",
          "-vkey": "VK_OEM_PLUS",
          "-self-closing": "true"
        },
        {
          "-iso": "E12",
          "-vkey": "VK_OEM_4",
          "-self-closing": "true"
        },
        {
          "-iso": "D11",
          "-vkey": "VK_OEM_6",
          "-self-closing": "true"
        },
        {
          "-iso": "D12",
          "-vkey": "VK_OEM_1",
          "-self-closing": "true"
        },
        {
          "-iso": "C10",
          "-vkey": "VK_OEM_3",
          "-self-closing": "true"
        },
        {
          "-iso": "E00",
          "-vkey": "VK_OEM_5",
          "-self-closing": "true"
        },
        {
          "-iso": "C12",
          "-vkey": "VK_OEM_2",
          "-self-closing": "true"
        },
        {
          "-iso": "B10",
          "-vkey": "VK_OEM_MINUS",
          "-self-closing": "true"
        }
      ]
    },
    "transforms": {
      "-type": "simple",
      "transform": [
        {
          "-from": "´a",
          "-to": "á",
          "-self-closing": "true"
        },
        {
          "-from": "´e",
          "-to": "é",
          "-self-closing": "true"
        },
        {
          "-from": "´i",
          "-to": "í",
          "-self-closing": "true"
        },
        {
          "-from": "´o",
          "-to": "ó",
          "-self-closing": "true"
        },
        {
          "-from": "´u",
          "-to": "ú",
          "-self-closing": "true"
        },
        {
          "-from": "´y",
          "-to": "ý",
          "-self-closing": "true"
        },
        {
          "-from": "´A",
          "-to": "Á",
          "-self-closing": "true"
        },
        {
          "-from": "´E",
          "-to": "É",
          "-self-closing": "true"
        },
        {
          "-from": "´I",
          "-to": "Í",
          "-self-closing": "true"
        },
        {
          "-from": "´O",
          "-to": "Ó",
          "-self-closing": "true"
        },
        {
          "-from": "´U",
          "-to": "Ú",
          "-self-closing": "true"
        },
        {
          "-from": "´Y",
          "-to": "Ý",
          "-self-closing": "true"
        },
        {
          "-from": "´ ",
          "-to": "´",
          "-self-closing": "true"
        },
        {
          "-from": "¨a",
          "-to": "ä",
          "-self-closing": "true"
        },
        {
          "-from": "¨e",
          "-to": "ë",
          "-self-closing": "true"
        },
        {
          "-from": "¨i",
          "-to": "ï",
          "-self-closing": "true"
        },
        {
          "-from": "¨o",
          "-to": "ö",
          "-self-closing": "true"
        },
        {
          "-from": "¨u",
          "-to": "ü",
          "-self-closing": "true"
        },
        {
          "-from": "¨y",
          "-to": "ÿ",
          "-self-closing": "true"
        },
        {
          "-from": "¨A",
          "-to": "Ä",
          "-self-closing": "true"
        },
        {
          "-from": "¨E",
          "-to": "Ë",
          "-self-closing": "true"
        },
        {
          "-from": "¨I",
          "-to": "Ï",
          "-self-closing": "true"
        },
        {
          "-from": "¨O",
          "-to": "Ö",
          "-self-closing": "true"
        },
        {
          "-from": "¨U",
          "-to": "Ü",
          "-self-closing": "true"
        },
        {
          "-from": "¨ ",
          "-to": "¨",
          "-self-closing": "true"
        },
        {
          "-from": "`a",
          "-to": "à",
          "-self-closing": "true"
        },
        {
          "-from": "`e",
          "-to": "è",
          "-self-closing": "true"
        },
        {
          "-from": "`i",
          "-to": "ì",
          "-self-closing": "true"
        },
        {
          "-from": "`o",
          "-to": "ò",
          "-self-closing": "true"
        },
        {
          "-from": "`u",
          "-to": "ù",
          "-self-closing": "true"
        },
        {
          "-from": "`A",
          "-to": "À",
          "-self-closing": "true"
        },
        {
          "-from": "`E",
          "-to": "È",
          "-self-closing": "true"
        },
        {
          "-from": "`I",
          "-to": "Ì",
          "-self-closing": "true"
        },
        {
          "-from": "`O",
          "-to": "Ò",
          "-self-closing": "true"
        },
        {
          "-from": "`U",
          "-to": "Ù",
          "-self-closing": "true"
        },
        {
          "-from": "` ",
          "-to": "`",
          "-self-closing": "true"
        },
        {
          "-from": "^a",
          "-to": "â",
          "-self-closing": "true"
        },
        {
          "-from": "^e",
          "-to": "ê",
          "-self-closing": "true"
        },
        {
          "-from": "^i",
          "-to": "î",
          "-self-closing": "true"
        },
        {
          "-from": "^o",
          "-to": "ô",
          "-self-closing": "true"
        },
        {
          "-from": "^u",
          "-to": "û",
          "-self-closing": "true"
        },
        {
          "-from": "^A",
          "-to": "Â",
          "-self-closing": "true"
        },
        {
          "-from": "^E",
          "-to": "Ê",
          "-self-closing": "true"
        },
        {
          "-from": "^I",
          "-to": "Î",
          "-self-closing": "true"
        },
        {
          "-from": "^O",
          "-to": "Ô",
          "-self-closing": "true"
        },
        {
          "-from": "^U",
          "-to": "Û",
          "-self-closing": "true"
        },
        {
          "-from": "^ ",
          "-to": "^",
          "-self-closing": "true"
        },
        {
          "-from": "~a",
          "-to": "ã",
          "-self-closing": "true"
        },
        {
          "-from": "~o",
          "-to": "õ",
          "-self-closing": "true"
        },
        {
          "-from": "~n",
          "-to": "ñ",
          "-self-closing": "true"
        },
        {
          "-from": "~A",
          "-to": "Ã",
          "-self-closing": "true"
        },
        {
          "-from": "~O",
          "-to": "Õ",
          "-self-closing": "true"
        },
        {
          "-from": "~N",
          "-to": "Ñ",
          "-self-closing": "true"
        },
        {
          "-from": "~ ",
          "-to": "~",
          "-self-closing": "true"
        },
        {
          "-from": "´a",
          "-to": "á",
          "-self-closing": "true"
        },
        {
          "-from": "´e",
          "-to": "é",
          "-self-closing": "true"
        },
        {
          "-from": "´i",
          "-to": "í",
          "-self-closing": "true"
        },
        {
          "-from": "´o",
          "-to": "ó",
          "-self-closing": "true"
        },
        {
          "-from": "´u",
          "-to": "ú",
          "-self-closing": "true"
        },
        {
          "-from": "´y",
          "-to": "ý",
          "-self-closing": "true"
        },
        {
          "-from": "´A",
          "-to": "Á",
          "-self-closing": "true"
        },
        {
          "-from": "´E",
          "-to": "É",
          "-self-closing": "true"
        },
        {
          "-from": "´I",
          "-to": "Í",
          "-self-closing": "true"
        },
        {
          "-from": "´O",
          "-to": "Ó",
          "-self-closing": "true"
        },
        {
          "-from": "´U",
          "-to": "Ú",
          "-self-closing": "true"
        },
        {
          "-from": "´Y",
          "-to": "Ý",
          "-self-closing": "true"
        },
        {
          "-from": "´ ",
          "-to": "´",
          "-self-closing": "true"
        },
        {
          "-from": "¨a",
          "-to": "ä",
          "-self-closing": "true"
        },
        {
          "-from": "¨e",
          "-to": "ë",
          "-self-closing": "true"
        },
        {
          "-from": "¨i",
          "-to": "ï",
          "-self-closing": "true"
        },
        {
          "-from": "¨o",
          "-to": "ö",
          "-self-closing": "true"
        },
        {
          "-from": "¨u",
          "-to": "ü",
          "-self-closing": "true"
        },
        {
          "-from": "¨y",
          "-to": "ÿ",
          "-self-closing": "true"
        },
        {
          "-from": "¨A",
          "-to": "Ä",
          "-self-closing": "true"
        },
        {
          "-from": "¨E",
          "-to": "Ë",
          "-self-closing": "true"
        },
        {
          "-from": "¨I",
          "-to": "Ï",
          "-self-closing": "true"
        },
        {
          "-from": "¨O",
          "-to": "Ö",
          "-self-closing": "true"
        },
        {
          "-from": "¨U",
          "-to": "Ü",
          "-self-closing": "true"
        },
        {
          "-from": "¨ ",
          "-to": "¨",
          "-self-closing": "true"
        },
        {
          "-from": "`a",
          "-to": "à",
          "-self-closing": "true"
        },
        {
          "-from": "`e",
          "-to": "è",
          "-self-closing": "true"
        },
        {
          "-from": "`i",
          "-to": "ì",
          "-self-closing": "true"
        },
        {
          "-from": "`o",
          "-to": "ò",
          "-self-closing": "true"
        },
        {
          "-from": "`u",
          "-to": "ù",
          "-self-closing": "true"
        },
        {
          "-from": "`A",
          "-to": "À",
          "-self-closing": "true"
        },
        {
          "-from": "`E",
          "-to": "È",
          "-self-closing": "true"
        },
        {
          "-from": "`I",
          "-to": "Ì",
          "-self-closing": "true"
        },
        {
          "-from": "`O",
          "-to": "Ò",
          "-self-closing": "true"
        },
        {
          "-from": "`U",
          "-to": "Ù",
          "-self-closing": "true"
        },
        {
          "-from": "` ",
          "-to": "`",
          "-self-closing": "true"
        },
        {
          "-from": "^a",
          "-to": "â",
          "-self-closing": "true"
        },
        {
          "-from": "^e",
          "-to": "ê",
          "-self-closing": "true"
        },
        {
          "-from": "^i",
          "-to": "î",
          "-self-closing": "true"
        },
        {
          "-from": "^o",
          "-to": "ô",
          "-self-closing": "true"
        },
        {
          "-from": "^u",
          "-to": "û",
          "-self-closing": "true"
        },
        {
          "-from": "^A",
          "-to": "Â",
          "-self-closing": "true"
        },
        {
          "-from": "^E",
          "-to": "Ê",
          "-self-closing": "true"
        },
        {
          "-from": "^I",
          "-to": "Î",
          "-self-closing": "true"
        },
        {
          "-from": "^O",
          "-to": "Ô",
          "-self-closing": "true"
        },
        {
          "-from": "^U",
          "-to": "Û",
          "-self-closing": "true"
        },
        {
          "-from": "^ ",
          "-to": "^",
          "-self-closing": "true"
        }
      ]
    }
  },
  "#omit-xml-declaration": "yes"
};

/**
 * Swedish keyboard layout.
 */
export const DTDKeyboardLayout_SW = { keymapper, DTDKeyboardLayout };
