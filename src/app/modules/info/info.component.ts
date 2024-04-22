import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { LanguageHelperService } from 'src/app/services/language.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { AppSharedSettingsComponent } from '../shared/settings/settings.component';
import { NgIf } from '@angular/common';
import { AppSharedTopMenuComponent } from '../shared/top-menu/top-menu.component';

/**
 * This component holds the logic for info page.
 */
@Component({
  selector: 'app-modules-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  standalone: true,
  imports: [
    AppSharedTopMenuComponent,
    NgIf,
    AppSharedSettingsComponent,
    MatIcon,
    TranslateModule,
  ],
})
export class AppInfoComponent implements OnInit, OnDestroy {
  // Tells if it should show the settings view or not.
  viewSettings: boolean = false;
  // Stores the current language.
  currentLanguage: string;
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<boolean>();

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param settingsService Reference to SettingsService.
   * @param languageHelperService Reference to LanguageHelperService.
   * @param router Reference to Router.
   */
  constructor(
    private readonly settingsService: SettingsService,
    private readonly languageHelperService: LanguageHelperService,
    private readonly router: Router
  ) {
    this.currentLanguage = this.languageHelperService.currentLangUsed;
  }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    // Listens for any changes regarding the current used language.
    this.languageHelperService.OnLanguageChanged.pipe(
      takeUntil(this.destroyed)
    ).subscribe(() => {
      this.currentLanguage = this.languageHelperService.currentLangUsed;
      if (
        this.currentLanguage === 'nl-NL' ||
        this.currentLanguage === 'sv-SE'
      ) {
        this.router.navigate(['/']);
      }
    });

    // Listens for any changes regarding the settings view (show/hide).
    this.settingsService.viewSettingsAction
      .pipe(takeUntil(this.destroyed))
      .subscribe((viewSettings: boolean) => {
        this.viewSettings = viewSettings;
      });
  }

  /**
   * Unsubscribe Observables and detach event handlers to avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  /**
   * Navigate to a specific page.
   *
   * @param url Represents the page url.
   * @param param Tells if it should add a query param or not.
   */
  navigateTo(): void {
    if (
      this.currentLanguage &&
      (this.currentLanguage === 'nn-NO' || this.currentLanguage === 'nb-NO')
    ) {
      window.open('../../../assets/pdf/10-Fingre_veileder NO.pdf', '_blank');
    } else {
      window.open('../../../assets/pdf/10 finger vejledning DK.pdf', '_blank');
    }
  }
}
