import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { KeyboardSettingsDTO } from 'src/app/dto/settings.dto';
import { TranslationsDTO } from 'src/app/dto/translation.dto';
import { LanguageHelperService } from 'src/app/services/language.service';
import { SettingsService } from 'src/app/services/settings.service';
import { WarningModalComponent } from '../modals/warning-modal/warning-modal.component';

/**
 * This component holds the logic for the settings view.
 */
@Component({
  selector: 'app-shared-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class AppSharedSettingsComponent implements OnInit, OnDestroy {
  // Stores the selected option.
  selectedOption: KeyboardSettingsDTO = {} as KeyboardSettingsDTO;
  // Stores the settings options.
  settingsOptions: KeyboardSettingsDTO[] = [
    { type: 'keyboard', icon: 'keyboard', label: 'Keyboard', selected: true },
    { type: 'text', icon: 'icon_text', label: 'Text', selected: false },
    { type: 'read', icon: 'icon_read', label: 'Read', selected: false },
    { type: 'language', icon: 'icon_language', label: 'Language', selected: false },
    { type: 'theme', icon: 'settings', label: 'Theme', selected: false },
    { type: 'logout', icon: 'icon_logout', label: 'Logout', selected: false },
  ];
  // Stores the translations.
  translatedObj: TranslationsDTO;
  // Stores the current language.
  currentLanguage: string = '';
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<boolean>();

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param settingsService Reference to SettingsService.
   * @param languageHelperService Reference to LanguageHelperService.
   * @param dialog Reference to MatDialog.
   * @param router Reference to Router.
   */
  constructor(
    private readonly settingsService: SettingsService,
    private readonly languageHelperService: LanguageHelperService,
    private readonly dialog: MatDialog,
    private readonly router: Router,
  ) {
    this.translatedObj = this.languageHelperService.translationObject;
    this.currentLanguage = this.languageHelperService.currentLangUsed;
  }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    this.selectedOption = this.settingsOptions[0];

    // Listens for the language change.
    this.languageHelperService.OnLanguageChanged.pipe(
      takeUntil(this.destroyed)
    ).subscribe((trans) => {
      this.translatedObj = trans;
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
   * Selects the settings option.
   *
   * @param option Represents the selected option.
   */
  selectOption(option?: KeyboardSettingsDTO) {
    if (!option) {
      this.reset();
    } else {
      this.settingsOptions.forEach(opt => {
        opt.selected = false;
      });
      option.selected = true;
      this.selectedOption = option;
    }
  }

  /**
   * Opens the warning modal.
   */
  reset(): void {
    const dialogRef = this.dialog.open(WarningModalComponent, {
      panelClass: 'error-class',
      data: {
        title: this.translatedObj['translateAreYouSure'],
        description: this.translatedObj['translateResetWarningDescription']
      }
    });
    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        const secDialogRef = this.dialog.open(WarningModalComponent, {
          panelClass: 'error-class',
          data: {
            title: this.translatedObj['translateAreYouReallySure'],
            description: this.translatedObj['translateResetWarningDescription']
          }
        });
        secDialogRef.afterClosed().subscribe((res: boolean) => {
          if (res) {
            this.resetAll();
          }
        });
      }
    });
  }

  /**
   * Resets the progress and all the settings.
   */
  resetAll(): void {
    this.settingsService.storageCleanup();
    this.settingsService.setDefaultSettings();
    setTimeout(() => {
      // Reload current page.
      this.pageReload();
      this.router.navigate([this.router.url.split('?')[0]]);
    }, 200);
  }

  /**
   * Reloads the page.
   */
  pageReload(): void {
    this.router.onSameUrlNavigation = 'reload';
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  /**
   * Closes the settings view.
   */
  close(): void {
    this.settingsService.toggleSettings(false);
  }
}
