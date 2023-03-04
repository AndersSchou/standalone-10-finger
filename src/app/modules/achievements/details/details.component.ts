import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CourseHelperService } from 'src/app/services/course-helper.service';
import { CompletedLevelDTO } from 'src/app/dto/award-details.dto';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { NgxPrinterService } from 'ngx-printer';
import { ReplaySubject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

/**
 * This component is used to show the achievement details in a modal.
 */
@Component({
  selector: 'app-modules-achievements-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class AppAchievementDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('detailsEl') detailsEl: ElementRef<HTMLElement> = {} as ElementRef;
  // Stores the HTMLElement that will be used for print.
  printDivElement?: HTMLElement;
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<boolean>();

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param router Reference to Router.
   * @param courseHelperService Reference to CourseHelperService.
   * @param printerService Reference to NgxPrinterService.
   * @param dialogRef Is an instance of MatDialogRef.
   * @param data Is an instance of input data.
   */
  constructor(
    private readonly router: Router,
    private readonly courseHelperService: CourseHelperService,
    private readonly printerService: NgxPrinterService,
    private readonly dialogRef: MatDialogRef<AppAchievementDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CompletedLevelDTO
  ) { }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  ngOnInit(): void {
    this.courseHelperService.closeDetailsModalAction
      .pipe(takeUntil(this.destroyed))
      .subscribe((close: boolean) => {
        if (close) {
          this.close();
        }
      });
  }

  /**
   * Unsubscribe Observables and detach event handlers to avoid memory leaks.
   */
  ngOnDestroy(): void {
    // Cleanup the DOM.
    if (this.printDivElement) {
      this.printDivElement.remove();
    }
    this.destroyed.next(true);
  }

  /**
   * Closes the modal.
   */
  close(): void {
    this.dialogRef.close();
  }

  /**
   * Calculates the speed for the current course/game level.
   *
   * @returns The total speed value for the current course/game level.
   */
  calculateSpeed(): number {
    if (this.data && this.data.details) {
      const highestResult = this.data.details.highestResult;
      return Math.round((highestResult.characters * 60000) / highestResult.time);
    } else {
      return 0;
    }
  }

  /**
   * Calculates the accuracy for the current course/game level.
   *
   * @returns The total accuracy value for the current course/game level.
   */
  calculateAccuracy(): number {
    if (this.data && this.data.details) {
      const highestResult = this.data.details.highestResult;
      return Math.round((highestResult.characters - highestResult.mistakes) * 100 / highestResult.characters);
    } else {
      return 0;
    }
  }

  /**
   * Replays the current course/game level.
   */
  replay(): void {
    if (this.data) {
      if (!this.data.isGame) {
        // Replay the course.
        this.courseHelperService.startExercise(
          this.data.details.indexLevel, // index
          0,
          this.data.details.currentLanguage,
          this.data.details.id,
          this.data.details.categories,
          true);
      } else {
        // Replay the game level.
        this.router.navigate(['/games/fish/level/', this.data.details.indexLevel]);
        this.close();
      }
    }
  }

  /**
   * Download the result view as PDF.
   */
  downloadAsPDF(): void {
    if (this.detailsEl) {
      const data = this.detailsEl.nativeElement;
      html2canvas(data).then(canvas => {
        const imgWidth = 208;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
        pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('award.pdf');
      });
    }
  }

  /**
   * Print result view.
   */
  print(): void {
    if (this.detailsEl) {
      const elemToPrint = this.detailsEl.nativeElement.cloneNode(true);
      const divEl = document.createElement('div');
      divEl.style.paddingTop = '100px';
      divEl.appendChild(elemToPrint);
      this.printDivElement = divEl;
      this.printerService.printOpenWindow = false;
      this.printerService.printHTMLElement(this.printDivElement);
      this.printerService.printOpenWindow = true;
    }
  }

  /**
  * Go to the next course.
  */
  nextLevel(): void {
    if (this.data) {
      // Start next course.
      if (!this.data.isGame) {
        const currentCourseIndex = this.data.details.indexLevel;
        if (currentCourseIndex < this.data.details.totalLevels - 1) {
          this.courseHelperService.startExercise(currentCourseIndex + 1, 0, this.data.details.currentLanguage,
            this.data.details.id, this.data.details.categories, true, true);
        } else {
          // Go to the next category.
          const catIndex = this.data.details.categories.indexOf(this.data.details.currentCategory);
          if (catIndex < this.data.details.categories.length - 1) {
            this.data.details.currentCategory = this.data.details.categories[catIndex + 1];
            this.courseHelperService.startExercise(0, 0, this.data.details.currentLanguage, this.data.details.id,
              this.data.details.categories, true, true);
          } else {
            // Start from the first category.
            this.data.details.currentCategory = this.data.details.categories[0];
            this.courseHelperService.startExercise(0, 0, this.data.details.currentLanguage, this.data.details.id,
              this.data.details.categories, true, true);
          }
        }
      } else {
        // Start next game level.
        if (this.data.details.gameLevels) {
          if (this.data.details.gameLevels.length < this.data.details.totalLevels) {
            this.router.navigate(['/games/fish/level/', this.data.details.indexLevel + 1]);
          } else {
            this.router.navigate(['/games/fish/level/', 0]);
          }
          this.close();
        }
      }
    }
  }
}
