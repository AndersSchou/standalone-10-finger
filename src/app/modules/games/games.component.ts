import { Component, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-modules-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class AppGamesComponent implements OnInit {
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
