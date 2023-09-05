import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { LanguageHelperService } from 'src/app/services/language.service';
import { SettingsService } from 'src/app/services/settings.service';

/**
 * This component holds the logic for the toolbar.
 */
@Component({
  selector: 'app-shared-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class AppSharedTopMenuComponent implements OnInit, OnDestroy {
  // Tells if it should close the settings view or not.
  isActive: boolean = false;
  // Stores the current language.
  currentLanguage: string;
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<boolean>();

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param settingsService Reference to SettingsService.
   * @param languageHelperService Reference to LanguageHelperService.
   */
  constructor(
    private readonly settingsService: SettingsService,
    private readonly languageHelperService: LanguageHelperService,
  ) {
    this.currentLanguage = this.languageHelperService.currentLangUsed;
   }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    // Subscribes to the settings service to know when to close the settings view.
    this.settingsService.viewSettingsAction
      .pipe(takeUntil(this.destroyed))
      .subscribe((viewSettings: boolean) => {
        this.isActive = viewSettings;
      });

      // Listens for any changes regarding the current used language.
    this.languageHelperService.OnLanguageChanged
    .pipe(takeUntil(this.destroyed)).subscribe((trans) => {
      this.currentLanguage = this.languageHelperService.currentLangUsed;
    });

  }

  /**
   * Unsubscribe Observables and detach event handlers to avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  /**
   * Toggles the settings view.
   */
  toggleSettings() {
    this.isActive = !this.isActive;
    this.settingsService.toggleSettings(this.isActive);
  }
}
