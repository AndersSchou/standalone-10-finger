import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { SESSIONID_NOT_VALID, SESSIONID_TIMEOUT, SPEAK_NOT_VALID } from '../common/constants';
import { ErrorModalService } from './error-modal.service';

/**
 * This service is used to throw the error. It shows the error in a dialog.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  // Tells if the error was showned or not.
  errorShown = true;

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param modalService Is an instance of ErrorModalService.
   * @param ngZone Is an instance of NgZone.
   * @param logger Is an instance of NGXLogger.
   */
  constructor(
    public readonly modalService: ErrorModalService,
    private readonly ngZone: NgZone,
    private readonly logger: NGXLogger
  ) { }

  /**
   * Calls the openModal method to open the modal and show the error.
   *
   * @param error Represents the error that will be handled.
   */
  handleError(error: HttpErrorResponse): void {
    this.ngZone.run(() => {
      if (error) {
        if (error.error) {
          if (error.status === 0) {
            // A client-side or network error occurred. Handle it accordingly.
            this.modalService.openModal(error);
          } else if (
            error.error.errorCode !== SESSIONID_TIMEOUT &&
            error.error.errorCode !== SESSIONID_NOT_VALID &&
            error.error.errorCode !== SPEAK_NOT_VALID
          ) {
            this.modalService.openModal(error);
          }
        } else {
          // We only show one error. This was done to avoid displaying multiple errors when the icons were not found.
          if (this.errorShown) {
            const dialogRef = this.modalService.openModal(error);
            dialogRef.afterClosed().subscribe(() => {
              this.errorShown = !this.errorShown;
            });
            this.errorShown = !this.errorShown;
          }
        }
        // Used to show the error in the console.
        this.logger.debug(error);
      }
    });
  }
}
