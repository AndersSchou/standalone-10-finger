import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * This component holds the logic for home page.
 */
@Component({
  selector: 'app-modules-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class AppHomeComponent {

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param router Reference to Router.
   */
  constructor(
    private readonly router: Router
  ) { }

  /**
   * Navigate to a specific page.
   *
   * @param url Represents the page url.
   */
  navigateTo(url: string): void {
    this.router.navigate([url]);
  }
}
