import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { WarningDialogDataDTO } from 'src/app/dto/warning-dialog.dto';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

/**
 * This component is used to show the warning in a modal.
 */
@Component({
  selector: 'app-warning-modal',
  templateUrl: './warning-modal.component.html',
  styleUrls: ['./warning-modal.component.scss'],
  standalone: true,
  imports: [
    MatDialogTitle,
    MatIcon,
    MatDialogContent,
    MatDialogActions,
    NgIf,
    TranslateModule,
  ],
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
    @Inject(MAT_DIALOG_DATA) public data: WarningDialogDataDTO
  ) {}

  /**
   * Closes the modal.
   */
  close(accept: boolean = false): void {
    this.dialogRef.close(accept);
  }
}
