import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../modules/shared/material.module';
import { VKeyboardComponent } from './vkeyboard.component';

@NgModule({
  declarations: [VKeyboardComponent],
  imports: [
    FormsModule,
    CommonModule,
    MaterialModule,
  ],
  exports: [VKeyboardComponent],
  providers: [],
})
export class VKeyboardModule { }
