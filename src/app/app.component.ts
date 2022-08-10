import { WhoAmIResponseDTO } from './dto/whoami.dto';
import { Component, OnInit } from '@angular/core';
import { APP_ICONS } from './common/constants';
import { UserService } from './services/api/user.service';
import { CustomIconService } from './services/custom-icon.service';
import { LanguageHelperService } from './services/language.service';

/** Main app component. */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param customIconService Reference to CustomIconService.
   * @param languageHelperService Reference to LanguageHelperService.
   */
  constructor(
    private readonly customIconService: CustomIconService,
    private readonly languageHelperService: LanguageHelperService,
    private readonly userService: UserService,
  ) { }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    this.getAllSvgs();
    // this.getUserLanguage();
  }

  getUserLanguage(): void {
    this.userService.getUserInfo().subscribe((user: WhoAmIResponseDTO) => {
      console.log('user', user);
    });
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
