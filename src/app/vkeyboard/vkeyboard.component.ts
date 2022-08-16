import { Component } from '@angular/core';
import { DTDKeyboardLayout_DK } from './keyboards/danish.keyboard.dtd';
import { DTDKeyboardLayout_SW } from './keyboards/swedish.keboard.dtd';
import { DTDKeyboardLayout_NO } from './keyboards/norwegian.keboard.dtd';
import { dtd2conf, dtd2skm } from './tools/dtd2skm';
import { KEYBOARD_COLOR_GROUP_TYPE, KEYBOARD_LANGUAGE, KEYBOARD_LAYOUT_GROUP_TYPE } from '../common/types';

@Component({
  selector: 'app-vkeyboard',
  templateUrl: './vkeyboard.component.html',
  styleUrls: ['./vkeyboard.component.scss']
})
export class VKeyboardComponent {
  class = '';
  altClassName = '5-3';
  shiftClassName = '4-1';

  hasNumbers: '' | 'no-numbers' = '';
  theme: KEYBOARD_COLOR_GROUP_TYPE = '';
  mode: KEYBOARD_LAYOUT_GROUP_TYPE = 'full';
  keysPressed: string[] = [];

  keyboardDefinition: {
    [key: string]: {
      key: string;
      value: string;
      shift: boolean;
      alt: boolean;
    };
  } = {};
  keyboardKeyDefinition: {
    [key: string]: {
      key: string;
      value: string;
      shift: boolean;
      alt: boolean;
    };
  } = {};

  constructor(
  ) {
    this.setLanguage('da');
    this.processClass();
  }

  setLanguage(lan: KEYBOARD_LANGUAGE) {
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
  getKeyDefinition(key: string) {
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
  highlightKey(key: string) {
    this.keysPressed = [];
    if (key in this.keyboardDefinition) {
      const keyPressed = this.keyboardDefinition[key];
      this.keysPressed = [keyPressed.key];
      if (keyPressed.shift) {
        this.keysPressed.push(this.shiftClassName);
      }
      if (keyPressed.alt) {
        this.keysPressed.push(this.altClassName);
      }
    }
    this.processClass();
  }

  setTheme(theme: KEYBOARD_COLOR_GROUP_TYPE) {
    this.theme = theme;
    this.processClass();
  }

  setMode(mode: KEYBOARD_LAYOUT_GROUP_TYPE) {
    this.mode = mode;
    this.processClass();
  }

  setNumbers(hasNumbers: boolean) {
    this.hasNumbers = hasNumbers ? '' : 'no-numbers';
    this.processClass();
  }

  getKey(row: number, col: number, shif = false, alt = false) {
    const key = `${row - 1}-${col}-${shif ? 'shift' : ''}${alt ? 'alt' : ''}`;
    if (this.keyboardKeyDefinition[key]) {
      return this.keyboardKeyDefinition[key].value;
    }
    return '';
  }

  private processClass() {
    this.class = [this.theme, this.hasNumbers, this.mode, ...this.keysPressed.map(el => `kp${el}`)].join(' ');
  }

}
