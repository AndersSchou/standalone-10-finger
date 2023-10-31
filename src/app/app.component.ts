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
import { STORAGE_KEY_TYPE } from './common/enums';
import { MatDialog } from '@angular/material/dialog';
import { WarningModalComponent } from './modules/shared/modals/warning-modal/warning-modal.component';

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
   * @param dialog Reference to MatDialog.
   */
  constructor(
    private readonly customIconService: CustomIconService,
    private readonly languageHelperService: LanguageHelperService,
    private readonly userService: UserService,
    private readonly settingsService: SettingsService,
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
    private readonly dialog: MatDialog,
  ) { }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    this.validateWindowSize();
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

    // Listens for theme changes.
    this.settingsService.themeSettingsAction
      .pipe(takeUntil(this.destroyed)).subscribe((theme: string) => {
        this.changeTheme(theme);
      });

    // Set the theme if it's already stored in the local storage.
    if (localStorage.getItem(STORAGE_KEY_TYPE.MAIN_THEME_COLOR)) {
      const mainThemeOption = localStorage.getItem(STORAGE_KEY_TYPE.MAIN_THEME_COLOR);
      if (mainThemeOption) {
        this.changeTheme(mainThemeOption);
      }
    }
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

  /**
   * Change the theme.
   *
   * @param theme Represent the new selected theme.
   */
  changeTheme(theme: string): void {
    const target = document.getElementsByTagName('html')[0];
    target.className = '';
    target.className = theme;
    localStorage.setItem(STORAGE_KEY_TYPE.MAIN_THEME_COLOR, theme);
  }

  /**
   * Validates the window size. If the window height is less than 800px, show a warning message.
   */
  validateWindowSize(): void {
    if (window.innerHeight < 719) {
      this.dialog.open(WarningModalComponent, {
        panelClass: 'error-class',
        data: {
          title: 'translateWindowSmallWarningTitle',
          description: 'translateWindowSmallWarningDescription',
          hideActions: true,
          showOkButton: true,
        }
      });
    }
  }

}
