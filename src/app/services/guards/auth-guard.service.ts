import { LanguageHelperService } from './../language.service';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../api/user.service';
import { Observable, map, mergeMap, of } from 'rxjs';
import { STORAGE_KEY_TYPE } from 'src/app/common/enums';

/**
 * AuthGuardService is used to handle user authentification.
 */
@Injectable()
export class AuthGuardService {
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
    private readonly authService: AuthService,
    private readonly languageHelperService: LanguageHelperService,
    private readonly userService: UserService
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
   * @return True if user has access to the app, else returns false.
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    if (route) {
      return this.checkUserAccess(route).pipe(
        map((access) => {
          if (access.access) {
            // Navigate to the url that was requested before login and remove queryParams.
            this.handleURLNavigation(route);
            return true;
          }
          // Redirect to login page.
          if (access.shouldLogOut) {
            this.authService.logout();
            localStorage.setItem(STORAGE_KEY_TYPE.APP_USER_ACCESS, 'false');
          } else {
            this.router.navigate(['/login']);
          }
          return false;
        })
      );
    }
    return of(false);
  }

  /**
   * Check if the user has access to the app.
   *
   * @param route Represents the activated route snapshot.
   *
   * @returns An observable of true if user has access to the app, false otherwise.
   */
  private checkUserAccess(
    route: ActivatedRouteSnapshot
  ): Observable<{ access?: boolean; shouldLogOut?: boolean }> {
    if (
      (route.queryParams['authToken'] && route.queryParams['language']) ||
      route.queryParams['SessionID']
    ) {
      const sessionID = route.queryParams['authToken']
        ? window.atob(decodeURIComponent(route.queryParams['authToken']))
        : route.queryParams['SessionID'];
      this.cookieService.set('mvf_session_id', sessionID, this.cookiesOption);

      return this.userService.checkUserAccess().pipe(
        mergeMap((data) => {
          if (data.length === 0) {
            return of({ shouldLogOut: true });
          } else {
            if (
              route.queryParams['authToken'] &&
              route.queryParams['language']
            ) {
              // If language param exists, then we need to set that language as default.
              return this.languageHelperService.initLangChanged.pipe(
                map(() => {
                  // Check if the language exists in the default languages array.
                  let usedLanguage = route.queryParams['language'];
                  const findLanguage = environment.availableLanguages.find(
                    (lang) => lang === usedLanguage
                  );
                  if (!findLanguage) {
                    // If the language doesn't exist, set current language to danish.
                    usedLanguage = environment.availableLanguages[0];
                  }
                  this.languageHelperService.setLanguage(usedLanguage, true);
                  this.authService.loggedIn(true);
                  return { access: true };
                })
              );
            }
            this.authService.loggedIn(true);
            return of({ access: true });
          }
        })
      );
    }

    if (!this.cookieService.get('mvf_session_id')) {
      return of({});
    }
    this.authService.loggedIn(true);
    return of({ access: true });
  }

  /**
   * Handle URL navigation after login and clear queryParams.
   *
   * @param route Represents the activated route snapshot.
   */
  private handleURLNavigation(route: ActivatedRouteSnapshot): void {
    let path = '';
    if (route.url && route.url.length > 0) {
      path = route.url[0].path;
    }
    if (Object.keys(route.queryParams).length > 0) {
      this.router.navigateByUrl(path, { replaceUrl: true });
    }
  }
}
