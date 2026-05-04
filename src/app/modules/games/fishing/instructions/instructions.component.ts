import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, ViewChild } from '@angular/core';
import { MatStepper, MatStep } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modules-games-fish-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss'],
  standalone: true,
  imports: [MatStepper, MatStep, FormsModule, MatIcon, TranslateModule],
})
export class AppGamesFishInstructionsComponent {
  @ViewChild('instructionStepper') instructionStepper?: MatStepper;
  // Stores the selected index.
  selectedIndex: number = 0;

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param router Reference to Router.
   */
  constructor(private readonly router: Router) {}

  /**
   * Go to the next step.
   */
  next(): void {
    if (this.selectedIndex === 1) {
      // Navigate to set level.
      this.router.navigate(['/games/fish/level']);
    }
    this.instructionStepper?.next();
  }

  /**
   * Go to the previous step.
   */
  previous(): void {
    if (this.selectedIndex === 0) {
      // Navigate to games view.
      this.router.navigate(['/games']);
    }
    this.instructionStepper?.previous();
  }

  /**
   * Selection change listener.
   *
   * @param event Represents the event that is triggered when the selection has changed.
   */
  selectionChange(event: StepperSelectionEvent): void {
    this.selectedIndex = event.selectedIndex;
  }

  /**
   * Start the game.
   */
  startPlay(): void {
    this.router.navigate(['/games/fish/level/', 0]);
  }
}
