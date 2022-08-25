import { AppTypingComponent } from './typing.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../shared/material.module';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { VKeyboardModule } from 'src/app/vkeyboard/vkeyboard.module';
import { NgxPrinterModule } from 'ngx-printer';
import { AppTypingResultComponent } from './result/result.component';
import { AppTypingHeaderViewComponent } from './header-view/header-view.component';

@NgModule({
  declarations: [AppTypingComponent, AppTypingHeaderViewComponent, AppTypingResultComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    MaterialModule,
    VKeyboardModule,
    NgxPrinterModule,
  ],
  providers: [],
})
export class TypingModule { }
