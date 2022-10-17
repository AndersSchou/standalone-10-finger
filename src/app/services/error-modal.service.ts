import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorModalComponent } from '../modules/shared/modals/error-modal/error-modal.component';

/**
 * This service is used to open the error modal.
 */
@Injectable()
export class ErrorModalService {
  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param dialog Is an instance of MatDialog.
   */
  constructor(public dialog: MatDialog) { }

  /**
   * Opens the error modal.
   *
   * @param message Represents the error message.
   *
   * @returns An instance of MatDialogRef.
   */
  openModal(message: HttpErrorResponse): MatDialogRef<ErrorModalComponent> {
    return this.dialog.open(ErrorModalComponent, {
      panelClass: 'error-class',
      data: message
    });
  }
}
