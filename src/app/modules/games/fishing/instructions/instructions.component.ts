import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modules-games-fish-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})
export class AppGamesFishInstructionsComponent {
  @ViewChild('instructionStepper') instructionStepper?: MatStepper;
  selectedIndex: number = 0;

  constructor(
    private readonly router: Router,
  ) { }

  // ngOnInit(): void {}

  next(): void {
    if (this.selectedIndex === 1) {
      // navigate to set level.
      this.router.navigate(['/games/fish/level']);
    }
    this.instructionStepper?.next();
  }

  previous(): void {
    this.instructionStepper?.previous();
  }

  selectionChange(event: StepperSelectionEvent): void {
    this.selectedIndex = event.selectedIndex;
  }
}
