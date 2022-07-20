import { AppTypingComponent } from './typing.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../shared/material.module';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { VKeyboardModule } from 'src/app/vkeyboard/vkeyboard.module';

@NgModule({
  declarations: [AppTypingComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    MaterialModule,
    VKeyboardModule,
  ],
  providers: [],
})
export class TypingModule { }
