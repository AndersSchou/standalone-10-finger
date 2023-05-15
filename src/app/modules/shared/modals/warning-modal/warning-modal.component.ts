import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

/**
 * This component is used to show the warning in a modal.
 */
@Component({
  selector: 'app-warning-modal',
  templateUrl: './warning-modal.component.html',
  styleUrls: ['./warning-modal.component.scss'],
})
export class WarningModalComponent {
  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param dialogRef Is an instance of MatDialogRef.
   * @param data Is an instance of input data.
   */
  constructor(
    public dialogRef: MatDialogRef<WarningModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  /**
   * Closes the modal.
   */
  close(accept: boolean = false): void {
    this.dialogRef.close(accept);
  }
}
