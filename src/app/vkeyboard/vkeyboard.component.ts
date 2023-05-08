import { Component } from '@angular/core';
import { DTDKeyboardLayout_DK } from './keyboards/danish.keyboard.dtd';
import { DTDKeyboardLayout_SW } from './keyboards/swedish.keboard.dtd';
import { DTDKeyboardLayout_NO } from './keyboards/norwegian.keboard.dtd';
import { dtd2conf, dtd2skm, KeyboardDefinitionDTO } from './tools/dtd2skm';
import { KEYBOARD_COLOR_GROUP_TYPE, KEYBOARD_LANGUAGE, KEYBOARD_LAYOUT_GROUP_TYPE } from '../common/types';


/**
 * This component holds the logic for the virtual keyboard.
 */
@Component({
  selector: 'app-vkeyboard',
  templateUrl: './vkeyboard.component.html',
  styleUrls: ['./vkeyboard.component.scss']
})
export class VKeyboardComponent {
  // Stores the css class for the keyboard.
  class = '';
  // Stores the alt class name.
  altClassName = '5-3';
  // Stores the shift class name (default is set to the left shift key).
  shiftClassName = '4-1';

  // Stores the theme for the keyboard.
  theme: KEYBOARD_COLOR_GROUP_TYPE = '';
  // Stores the mode for the keyboard.
  mode: KEYBOARD_LAYOUT_GROUP_TYPE = 'partial';
  // Stores the pressed keys.
  keysPressed: string[] = [];

  // Stores the keyboard definition.
  keyboardDefinition: KeyboardDefinitionDTO = {};
  // Stores the keyboard key definition.
  keyboardKeyDefinition: KeyboardDefinitionDTO = {};

  /**
   * Constructor function responsible for injecting the needed services.
   */
  constructor() {
    this.setLanguage('da');
    this.processClass();
  }

  /**
   * Set the language for the keyboard layout.
   *
   * @param lan Represents the selected language for the keyboard.
   */
  setLanguage(lan: KEYBOARD_LANGUAGE): void {
    if (lan === 'da') {
      this.keyboardDefinition = dtd2skm(DTDKeyboardLayout_DK as any);
      this.keyboardKeyDefinition = dtd2conf(DTDKeyboardLayout_DK as any);
    } else if (lan === 'nn' || lan === 'nb') {
      this.keyboardDefinition = dtd2skm(DTDKeyboardLayout_NO as any);
      this.keyboardKeyDefinition = dtd2conf(DTDKeyboardLayout_NO as any);
    } else {
      this.keyboardDefinition = dtd2skm(DTDKeyboardLayout_SW as any);
      this.keyboardKeyDefinition = dtd2conf(DTDKeyboardLayout_SW as any);
    }
  }

  /**
   * Get the key definition for a given character.
   *
   * @param key Represents the character to get the key definition for.
   *
   * @returns An object of the key definition or null.
   */
  getKeyDefinition(key: string): {
    key: string;
    value: string;
    shift: boolean;
    alt: boolean;
  } | null {
    if (this.keyboardDefinition[key]) {
      return this.keyboardDefinition[key];
    }
    return null;
  }

  /**
   * Highlight the key/keys for the given character.
   *
   * @param key Represents the character to highlight the key/keys for.
   */
  highlightKey(key: string): void {
    this.keysPressed = [];
    if (key in this.keyboardDefinition) {
      const keyPressed = this.keyboardDefinition[key];
      this.keysPressed = [keyPressed.key];

      if (keyPressed.shift) {
        const keyPos = keyPressed.key.split('-');
        const keyRow = Number(keyPos[0]);
        const keyCol = Number(keyPos[1]);
        this.shiftClassName = this.getShiftClass(keyRow, keyCol);
        this.keysPressed.push(this.shiftClassName);
      }
      if (keyPressed.alt) {
        this.keysPressed.push(this.altClassName);
      }
    }
    this.processClass();
  }


  /**
   * Set the keyboard theme.
   *
   * @param theme Represents the selected theme.
   */
  setTheme(theme: KEYBOARD_COLOR_GROUP_TYPE): void {
    this.theme = theme;
    this.processClass();
  }

  /**
   * Set the keyboard mode.
   *
   * @param mode Represents the selected keyboard mode.
   */
  setMode(mode: KEYBOARD_LAYOUT_GROUP_TYPE): void {
    this.mode = mode;
    this.processClass();
  }

  /**
   * Get the key for a given position.
   *
   * @param row Represents the row of the key.
   * @param col Represents the column of the key.
   * @param shift Tells if the key has the shift modifier.
   * @param alt Tells if the key has the alt modifier.
   *
   * @returns The value for the key.
   */
  getKey(row: number, col: number, shift = false, alt = false): string {
    const key = `${row - 1}-${col}-${shift ? 'shift' : ''}${alt ? 'alt' : ''}`;
    if (this.keyboardKeyDefinition[key]) {
      return this.keyboardKeyDefinition[key].value;
    }
    return '';
  }

  /**
   * set the css class for the keyboard.
   */
  private processClass(): void {
    this.class = [this.theme, this.mode, ...this.keysPressed.map(el => `kp${el}`)].join(' ');
  }

  /**
   * Get shift class based on the key position.
   *
   * @param row Represents the row of the key.
   * @param col Represents the column of the key.
   *
   * @returns The shift class name.
   */
  getShiftClass(row: number, col: number): string {
    if (((row === 1 || row === 4) && col > 7) || ((row === 2 || row === 3) && col > 6)) {
      // Right shift.
      return '4-13';
    } else {
      // Left shift.
      return '4-1';
    }
  }

}
