import { AuthService } from 'src/app/services/auth.service';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  SESSIONID_NOT_VALID,
  SESSIONID_TIMEOUT,
} from 'src/app/common/constants';

/**
 * HttpRequest interface.
 */
export interface HttpRequestI {
  headers: HttpHeaders;
  method: string;
  params: HttpParams;
  reportProgress: boolean;
  responseType: string;
  url: string;
  urlWithParams: string;
  withCredentials: boolean;
}

/**
 * This interceptor is used to validate the session on http requests.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param authService Reference to AuthService.
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Intercepts the response of a http request.
   * If the response is an error with the errorCode for invalid session, then we invalidate the session.
   *
   * @param request Represents the http request.
   * @param next Represents the http handler.
   *
   * @return An observable that will allow to capture the error for invalid session.
   */
  intercept(
    request: HttpRequest<HttpRequestI>,
    next: HttpHandler
  ): Observable<HttpEvent<HttpRequestI>> {
    return next.handle(request).pipe(
      tap(
        () => {},
        (err: Error) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 0) {
              throw err;
            } else if (
              err.error.errorCode === SESSIONID_TIMEOUT ||
              err.error.errorCode === SESSIONID_NOT_VALID
            ) {
              this.authService.logout();
            }
          }
        }
      )
    );
  }
}
