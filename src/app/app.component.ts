import { Component, OnInit } from '@angular/core';
import { APP_ICONS } from './common/constants';
import { CustomIconService } from './services/custom-icon.service';
import { LanguageHelperService } from './services/language.service';

/** Main app component. */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // Stores the current selected language.
  usedLanguage = '';

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param customIconService Reference to CustomIconService.
   * @param languageHelperService Reference to LanguageHelperService.
   */
  constructor(
    private readonly customIconService: CustomIconService,
    private readonly languageHelperService: LanguageHelperService,
  ) { }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    this.getAllSvgs();
    this.usedLanguage = this.languageHelperService.getCurrentLanguageAndTranslations();
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
}
