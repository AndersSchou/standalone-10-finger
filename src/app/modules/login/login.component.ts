import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

/**
 * Login component.
 */
@Component({
  selector: 'app-modules-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class AppLoginComponent {
  /**
     * Constructor function responsible for injecting the needed services.
     *
     * @param authService Reference to AuthService.
     */
  constructor(
    private readonly authService: AuthService,
  ) { }

  /**
   * User login.
   */
  login(): void {
    this.authService.login();
  }
}
