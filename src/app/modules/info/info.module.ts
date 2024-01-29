import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../shared/material.module';
import { SharedModule } from '../shared/shared.module';
import { AppInfoComponent } from './info.component';

@NgModule({
  declarations: [AppInfoComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule
  ],
  providers: [],
})
export class InfoModule { }
