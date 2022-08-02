import { Component, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';

/**
 * This component holds the logic for info page.
 */
@Component({
  selector: 'app-modules-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class AppInfoComponent implements OnInit {
  // Tells if it should show the settings view or not.
  viewSettings: boolean = false;
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<never>();

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param settingsService Reference to SettingsService.
   */
  constructor(
    private readonly settingsService: SettingsService,
  ) { }

  ngOnInit(): void {
    // Listens for any changes regarding the settings view (show/hide).
    this.settingsService.viewSettingsAction
      .pipe(takeUntil(this.destroyed))
      .subscribe((viewSettings: boolean) => { this.viewSettings = viewSettings; });
  }
}
