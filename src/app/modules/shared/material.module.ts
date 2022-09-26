import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';

/**
 * Module holding all material component shared dependencies.
 */
@NgModule({
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSelectModule,
    MatTabsModule,
    MatRadioModule,
    FormsModule,
    MatStepperModule,
  ],
  exports: [
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSelectModule,
    MatTabsModule,
    MatRadioModule,
    FormsModule,
    MatStepperModule,
  ],
  providers: [],
})
export class MaterialModule { }
