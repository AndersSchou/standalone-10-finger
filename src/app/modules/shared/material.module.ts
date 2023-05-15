import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
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
