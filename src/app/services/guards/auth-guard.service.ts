import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

/**
 * AuthGuardService is used to handle user authentification.
 */
@Injectable()
export class AuthGuardService implements CanActivate {
  // Stores the location of the localhost.
  localhostLocation = 'http://localhost:4200/';
  // Stores cookies options.
  cookiesOption = {};

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param cookieService Instance of CookieService.
   * @param router Instance of Router.
   * @param authService Instance of AuthService.
   */
  constructor(
    private readonly cookieService: CookieService,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {
    // Localhost for Safari does not store the cookies if sameSite is present.
    if (environment.location !== this.localhostLocation) {
      this.cookiesOption = { sameSite: 'None', secure: true };
    }
  }

  /**
   * Guard that decides if a route can be activated. If the guard returns true, navigation continues, else, navigation is canceled.
   *
   * @param route Represents the ActivatedRouteSnapshot.
   *
   * @return True if mvf_session_id exists, else returns false.
   */
  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (route) {
      if (route.queryParams['authToken']) {
        const token = route.queryParams['authToken'];
        // Login from external url. Decode the sessionID token.
        const sessionID = atob(decodeURIComponent(token));
        let path = '';
        if (route.url && route.url.length > 0) {
          path = route.url[0].path;
        }
        const newQueryParam = {
          queryParams: {
            SessionID: sessionID,
            path
          }
        };
        this.router.navigate([path], newQueryParam);
      } else {
        if (this.cookieService.get('mvf_session_id')) {
          if (route.queryParams['SessionID']) {
            const path = route.queryParams['path'] ? route.queryParams['path'] : '';
            this.cookieService.set('mvf_session_id', route.queryParams['SessionID'], this.cookiesOption);
            this.router.navigate([path]);
          }
          return true;
        } else {
          // Redirect to login page and if it gets the session ID returns true, else returns false.
          this.router.navigate(['/login']);
          if (route.queryParams['SessionID']) {
            this.cookieService.set('mvf_session_id', route.queryParams['SessionID'], this.cookiesOption);
            this.authService.loggedIn(true);
            this.router.navigate(['']);
            return true;
          }
        }
      }
    }
    return false;
  }
}
