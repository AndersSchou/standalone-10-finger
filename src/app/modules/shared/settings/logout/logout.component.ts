import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

/**
 * This component holds the logic for the logout view.
 */
@Component({
  selector: 'app-shared-settings-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
  standalone: true,
  imports: [TranslateModule],
})
export class AppSharedSettingsLogoutComponent {
  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param authService Reference to AuthService.
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * User logout.
   */
  logout(): void {
    this.authService.logout();
  }
}
