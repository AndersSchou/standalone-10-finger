import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { STORAGE_KEY_TYPE } from '../common/enums';

/**
 * This service is used to handle login and logout logic.
 */
@Injectable()
export class AuthService {
  /**
   * The subject used to controls the service communication.
   */
  private loggedInSource = new Subject<boolean>();
  /**
   * Observable instance of the source object.
   */
  private loggedInObservable = this.loggedInSource.asObservable();

  /**
   * Getter function for private loggedIn Observable.
   *
   * @return Observable<boolean> That listens for any actions.
   */
  public get loggedInAction(): Observable<boolean> {
    return this.loggedInObservable;
  }

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param cookieService Reference to CookieService.
   */
  constructor(private readonly cookieService: CookieService) {}

  /**
   * Calls the source of the observable and cascades the action.
   *
   * @param isLoggedIn Is the action object you want to cascade.
   */
  loggedIn(isLoggedIn: boolean): void {
    this.loggedInSource.next(isLoggedIn);
  }

  /**
   * Redirects to signon login flow.
   */
  login(): void {
    window.location.href =
      environment.UrlEndpoints.auth + '/?returnUrl=' + environment.location;
  }

  /**
   * User logout.
   */
  logout(): void {
    const sessiondID = this.cookieService.get('mvf_session_id');
    localStorage.removeItem(STORAGE_KEY_TYPE.APP_USER_ACCESS);
    if (sessiondID) {
      // Clean up cookies.
      this.cookieService.delete('mvf_session_id');

      window.location.href =
        environment.UrlEndpoints.auth +
        '/logout.php?SessionID=' +
        sessiondID +
        '&return_to=' +
        environment.location;
    }
  }
}
