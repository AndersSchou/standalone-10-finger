import { Component } from '@angular/core';
import { DTDKeyboardLayout_DK } from './keyboards/danish.keyboard.dtd';
import { DTDKeyboardLayout_SW } from './keyboards/swidish.keboard.dtd';
import { DTDKeyboardLayout_NO } from './keyboards/norwegian.keboard.dtd';
import { DTDKeyboardLayout_RO } from './keyboards/romanian.keboard.dtd';
import { dtd2conf, dtd2skm } from './tools/dtd2skm';

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
  theme: '' | 'color-group' | 'sinle-color-group' = '';
  mode: 'full' | 'partial' | 'minimal' = 'full';
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
    this.setLanguage('dk');
    this.processClass();
    console.log(this.keyboardKeyDefinition);
  }

  setLanguage(lan: 'dk' | 'sw' | 'no' | 'ro') {
    if (lan === 'dk') {
      this.keyboardDefinition = dtd2skm(DTDKeyboardLayout_DK as any);
      this.keyboardKeyDefinition = dtd2conf(DTDKeyboardLayout_DK as any);
    } else if (lan === 'no') {
      this.keyboardDefinition = dtd2skm(DTDKeyboardLayout_NO as any);
      this.keyboardKeyDefinition = dtd2conf(DTDKeyboardLayout_NO as any);
    } else if (lan === 'ro') {
      this.keyboardDefinition = dtd2skm(DTDKeyboardLayout_RO as any);
      this.keyboardKeyDefinition = dtd2conf(DTDKeyboardLayout_RO as any);
    } else {
      this.keyboardDefinition = dtd2skm(DTDKeyboardLayout_SW as any);
      this.keyboardKeyDefinition = dtd2conf(DTDKeyboardLayout_SW as any);
    }
  }

  getKeyDefinition(key: string) {
    if (this.keyboardDefinition[key]) {
      return this.keyboardDefinition[key];
    }
    return null;
  }

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

  setTheme(theme: '' | 'color-group' | 'sinle-color-group') {
    this.theme = theme;
    this.processClass();
  }

  setMode(mode: 'full' | 'partial' | 'minimal') {
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
