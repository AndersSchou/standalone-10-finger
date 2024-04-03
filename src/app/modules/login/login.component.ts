import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { WarningModalComponent } from '../shared/modals/warning-modal/warning-modal.component';
import { STORAGE_KEY_TYPE } from 'src/app/common/enums';
import { environment } from 'src/environments/environment';
import { NgClass } from '@angular/common';

/**
 * Login component.
 */
@Component({
  selector: 'app-modules-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [NgClass],
})
export class AppLoginComponent implements OnInit {
  // Stores the app language.
  currentLanguage = '';
  // Stores the available languages.
  availableLanguages = environment.availableLanguages;

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param authService Reference to AuthService.
   * @param dialog Reference to MatDialog.
   */
  constructor(
    private readonly authService: AuthService,
    private readonly dialog: MatDialog
  ) {
    if (localStorage.getItem(STORAGE_KEY_TYPE.CURRENT_LANGUAGE)) {
      this.currentLanguage = localStorage.getItem(
        STORAGE_KEY_TYPE.CURRENT_LANGUAGE
      ) as string;
    } else {
      this.currentLanguage = this.availableLanguages[0];
    }
  }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    if (localStorage.getItem(STORAGE_KEY_TYPE.APP_USER_ACCESS)) {
      this.showAccessDenied();
    }
  }

  /**
   * User login.
   */
  login(): void {
    this.authService.login();
  }

  /**
   * Shows the access denied modal.
   */
  showAccessDenied(): void {
    const dialogRef = this.dialog.open(WarningModalComponent, {
      panelClass: 'error-class',
      data: {
        title: 'translateAccessDenied',
        description: 'translateAccessDeniedDescription',
        hideActions: true,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      localStorage.removeItem(STORAGE_KEY_TYPE.APP_USER_ACCESS);
    });
  }
}
