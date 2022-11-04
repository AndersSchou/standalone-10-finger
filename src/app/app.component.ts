import { CookieService } from 'ngx-cookie-service';
import { SettingsService } from 'src/app/services/settings.service';
import { WhoAmIResponseDTO } from './dto/whoami.dto';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { APP_ICONS } from './common/constants';
import { UserService } from './services/api/user.service';
import { CustomIconService } from './services/custom-icon.service';
import { LanguageHelperService } from './services/language.service';
import { AuthService } from './services/auth.service';
import { ReplaySubject, takeUntil } from 'rxjs';

/** Main app component. */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<boolean>();

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param customIconService Reference to CustomIconService.
   * @param languageHelperService Reference to LanguageHelperService.
   * @param userService Reference to UserService.
   * @param settingsService Reference to SettingsService.
   * @param authService Reference to AuthService.
   * @param cookieService Reference to cookieService.
   */
  constructor(
    private readonly customIconService: CustomIconService,
    private readonly languageHelperService: LanguageHelperService,
    private readonly userService: UserService,
    private readonly settingsService: SettingsService,
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) { }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    this.getAllSvgs();

    // Listens if the user is logged in.
    this.authService.loggedInAction
      .pipe(takeUntil(this.destroyed))
      .subscribe((isLogged?: boolean) => {
        if (isLogged && (!this.cookieService.get('mvf_session_id'))) {
          this.setUserLanguage();
        }
      });
    this.settingsService.setDefaultSettings();
  }

  /**
   * Unsubscribe Observables and detach event handlers to avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  /**
   * Set the user language based on the whoami response.
   */
  setUserLanguage(): void {
    this.userService.getUserInfo().subscribe((user: WhoAmIResponseDTO) => {
      if (user) {
        const userLang = this.userService.convertRegionToLanguageIdentifier(user.CountryRegionCode);
        this.languageHelperService.setLanguage(userLang);
      }
    });
  }

  /**
   * Get all svgs.
   */
  getAllSvgs(): void {
    // Add all icons to MatIconRegistry.
    this.customIconService.addCustomIcons(APP_ICONS);
    // Fetch all the icons.
    this.customIconService.fetchCustomIcons(APP_ICONS);
  }
}
