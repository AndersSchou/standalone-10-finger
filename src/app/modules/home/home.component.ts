import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { DefaultReadLetterOptions, DefaultReadTextOptions } from 'src/app/common/constants';
import { TEXT_SETTINGS_TYPE } from 'src/app/common/enums';
import { SettingsService } from 'src/app/services/settings.service';

/**
 * This component holds the logic for home page.
 */
@Component({
  selector: 'app-modules-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class AppHomeComponent implements OnInit {
  // Tells if it should show the settings view or not.
  viewSettings: boolean = false;
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<never>();

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param router Reference to Router.
   * @param settingsService Reference to SettingsService.
   */
  constructor(
    private readonly router: Router,
    private readonly settingsService: SettingsService,
  ) { }

  ngOnInit(): void {
    this.setDefaultSettings();

    // Listens for any changes regarding the settings view (show/hide).
    this.settingsService.viewSettingsAction
      .pipe(takeUntil(this.destroyed))
      .subscribe((viewSettings: boolean) => { this.viewSettings = viewSettings; });
  }

  /**
   * Navigate to a specific page.
   *
   * @param url Represents the page url.
   */
  navigateTo(url: string): void {
    this.router.navigate([url]);
  }

  setDefaultSettings(): void {
    localStorage.setItem(TEXT_SETTINGS_TYPE.TEXT_SIZE, JSON.stringify(
      {
        fontSize: '24px',
        fontFamily: 'Roboto'
      }
    ));
    localStorage.setItem(TEXT_SETTINGS_TYPE.TEXT_COLOR, JSON.stringify('no-color'));
    localStorage.setItem(TEXT_SETTINGS_TYPE.TEXT_DISPLAY_LAYOUT, JSON.stringify('bottom'));

    const readLetter = DefaultReadLetterOptions[DefaultReadLetterOptions.length - 1];
    readLetter.selected = true;
    localStorage.setItem(TEXT_SETTINGS_TYPE.READ_LETTER, JSON.stringify(readLetter));

    const readText = DefaultReadTextOptions;
    for (const opt of readText) {
      opt.selected = true;
    }
    localStorage.setItem(TEXT_SETTINGS_TYPE.READ_TEXT, JSON.stringify(readText));
  }
}
