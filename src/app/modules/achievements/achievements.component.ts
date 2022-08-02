import { Component, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-modules-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AppAchievementsComponent implements OnInit {
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
