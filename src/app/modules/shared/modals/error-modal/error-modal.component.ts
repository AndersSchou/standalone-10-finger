import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

/**
 * This component is used to show the error in a modal.
 */
@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss'],
  standalone: true,
  imports: [
    MatDialogTitle,
    MatIcon,
    MatDialogContent,
    NgIf,
    MatDialogActions,
    TranslateModule,
  ],
})
export class ErrorModalComponent {
  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param dialogRef Is an instance of MatDialogRef.
   * @param data Is an instance of input data.
   */
  constructor(
    public dialogRef: MatDialogRef<ErrorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HttpErrorResponse
  ) {}

  /**
   * Closes the modal.
   */
  cancel(): void {
    this.dialogRef.close();
  }
}
