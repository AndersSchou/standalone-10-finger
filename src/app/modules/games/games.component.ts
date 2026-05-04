import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { FishGame } from 'src/app/games/fish';
import { LanguageHelperService } from 'src/app/services/language.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { AppSharedSettingsComponent } from '../shared/settings/settings.component';
import { NgIf } from '@angular/common';
import { AppSharedTopMenuComponent } from '../shared/top-menu/top-menu.component';

/**
 * This component holds the logic for the games view.
 */
@Component({
  selector: 'app-modules-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
  standalone: true,
  imports: [
    AppSharedTopMenuComponent,
    NgIf,
    AppSharedSettingsComponent,
    MatIcon,
    TranslateModule,
  ],
})
export class AppGamesComponent implements OnInit, OnDestroy {
  // Tells if it should show the settings view or not.
  viewSettings: boolean = false;
  // Tells if it should show the game or not.
  showGame: boolean = false;
  // Stores the current language.
  currentLanguage: string;
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<boolean>();

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param settingsService Reference to SettingsService.
   */
  constructor(
    private readonly settingsService: SettingsService,
    private readonly router: Router,
    private readonly languageHelperService: LanguageHelperService
  ) {
    this.currentLanguage = this.languageHelperService.currentLangUsed;
  }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  ngOnInit(): void {
    if (this.currentLanguage && this.currentLanguage.length > 0) {
      this.gameData();
    }

    // Listens for any changes regarding the settings view (show/hide).
    this.settingsService.viewSettingsAction
      .pipe(takeUntil(this.destroyed))
      .subscribe((viewSettings: boolean) => {
        this.viewSettings = viewSettings;
      });

    // Listens for any changes regarding the current used language.
    this.languageHelperService.OnLanguageChanged.pipe(
      takeUntil(this.destroyed)
    ).subscribe(() => {
      this.currentLanguage = this.languageHelperService.currentLangUsed;
      this.gameData();
    });
  }

  /**
   * Unsubscribe Observables and detach event handlers to avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  /**
   * Gets the fishing game data.
   */
  gameData(): void {
    const lang = this.currentLanguage.split('-')[0];
    if (lang in FishGame) {
      const cat = FishGame[lang];
      if (cat && cat.length > 0) {
        this.showGame = true;
      } else {
        this.showGame = false;
      }
    } else {
      this.showGame = false;
    }
  }

  /**
   * Navigate to a specific game.
   *
   * @param url Represents the url to navigate to.
   */
  navigateTo(url: string): void {
    this.router.navigate(['/games/' + url]);
  }
}
