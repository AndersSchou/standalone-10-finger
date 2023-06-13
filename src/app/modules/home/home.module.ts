import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../shared/material.module';
import { SharedModule } from '../shared/shared.module';
import { AppHomeComponent } from './home.component';

@NgModule({
  declarations: [AppHomeComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule
  ],
  providers: [],
})
export class HomeModule { }
