import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { AppSharedSettingsComponent } from '../shared/settings/settings.component';
import { NgIf } from '@angular/common';
import { AppSharedTopMenuComponent } from '../shared/top-menu/top-menu.component';

/**
 * This component holds the logic for home page.
 */
@Component({
  selector: 'app-modules-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    AppSharedTopMenuComponent,
    NgIf,
    AppSharedSettingsComponent,
    MatIcon,
    TranslateModule,
  ],
})
export class AppHomeComponent implements OnInit, OnDestroy {
  // Tells if it should show the settings view or not.
  viewSettings: boolean = false;
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<boolean>();

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param router Reference to Router.
   * @param settingsService Reference to SettingsService.
   */
  constructor(
    private readonly router: Router,
    private readonly settingsService: SettingsService
  ) {}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
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
  navigateTo(url: string, param: boolean = false): void {
    if (param) {
      this.router.navigate([url], { queryParams: { resume: 'Course' } });
    } else {
      this.router.navigate([url]);
    }
  }
}
