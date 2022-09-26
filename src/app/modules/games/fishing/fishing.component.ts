import { Component, OnInit } from '@angular/core';

/**
 * This component is used to hold the loading screen for the fish game.
 */
@Component({
  selector: 'app-modules-games-fishing',
  templateUrl: './fishing.component.html',
  styleUrls: ['./fishing.component.scss']
})
export class AppGamesFishingComponent implements OnInit {
  // Tells if it should show the loading screen or not.
  showLoadingScreen = true;

  /**
   *  A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    // Show the loading screen for 3 seconds.
    setTimeout(() => {
      this.showLoadingScreen = false;
    }, 3000);
  }
}
