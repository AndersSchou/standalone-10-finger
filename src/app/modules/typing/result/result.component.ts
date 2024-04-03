import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgxPrinterService } from 'ngx-printer';
import { ReplaySubject, takeUntil } from 'rxjs';
import {
  createEmptyCoursesDTO,
  CoursesDTO,
  createEmptyExtendedCourseDTO,
  ExtendedCourseDTO,
  ExtendedCategoryDTO,
  createEmptyExtendedCategoryDTO,
} from 'src/app/dto/course.dto';
import { CourseHelperService } from 'src/app/services/course-helper.service';
import { LanguageHelperService } from 'src/app/services/language.service';
import { SettingsService } from 'src/app/services/settings.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { AppTypingHeaderViewComponent } from '../header-view/header-view.component';
import { AppSharedSettingsComponent } from '../../shared/settings/settings.component';
import { NgIf } from '@angular/common';
import { AppSharedTopMenuComponent } from '../../shared/top-menu/top-menu.component';

/**
 * This component holds the logic for displaying the result page.
 */
@Component({
  selector: 'app-modules-typing-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  standalone: true,
  imports: [
    AppSharedTopMenuComponent,
    NgIf,
    AppSharedSettingsComponent,
    AppTypingHeaderViewComponent,
    MatIcon,
    MatTooltip,
    TranslateModule,
  ],
})
export class AppTypingResultComponent implements OnInit, OnDestroy {
  @ViewChild('resultEl') resultEl: ElementRef<HTMLElement> = {} as ElementRef;
  // Stores the data from the local storage.
  storedData: CoursesDTO = createEmptyCoursesDTO();
  // Stores the selected course.
  selectedCourse: ExtendedCourseDTO = createEmptyExtendedCourseDTO();
  // Stores all categories.
  categories: ExtendedCategoryDTO[] = [];
  // Stores the current category.
  currentCategory: ExtendedCategoryDTO = createEmptyExtendedCategoryDTO();
  // Stores the exercise index.
  exerciseIndex: number = 0;
  // Stores the current language.
  currentLanguage: string;
  // Stores the HTMLElement that will be used for print.
  printDivElement?: HTMLElement;
  // Tells if it should show the settings view or not.
  viewSettings: boolean = false;
  // Stores the current course progress.
  currentProgress: number = 100;
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<boolean>();

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param settingsService Reference to SettingsService.
   * @param courseHelperService Reference to CourseHelperService.
   * @param languageHelperService Reference to LanguageHelperService.
   * @param router Reference to Router.
   * @param printerService Reference to Router.
   */
  constructor(
    private readonly settingsService: SettingsService,
    private readonly courseHelperService: CourseHelperService,
    private readonly languageHelperService: LanguageHelperService,
    private readonly router: Router,
    private readonly printerService: NgxPrinterService
  ) {
    this.currentLanguage = this.languageHelperService.currentLangUsed;
  }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit() {
    if (this.currentLanguage && this.currentLanguage.length > 0) {
      this.getCategories();
    }

    // Listens for any changes regarding the current used language.
    this.languageHelperService.OnLanguageChanged.pipe(
      takeUntil(this.destroyed)
    ).subscribe(() => {
      // Go to set course page when the language changed (same logic applies for browser refresh).
      this.goBack();
    });

    // Listens for any changes regarding the settings view (show/hide).
    this.settingsService.viewSettingsAction
      .pipe(takeUntil(this.destroyed))
      .subscribe((viewSettings: boolean) => {
        this.viewSettings = viewSettings;
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
   * Get all categories.
   */
  getCategories(): void {
    this.storedData = this.courseHelperService.getCategories(
      this.currentLanguage
    );
    this.categories = this.storedData.data;
    this.findLatestCat(this.categories);
  }

  /**
   * Find the latest category.
   *
   * @param coursesProgress Represents the course progress response.
   */
  findLatestCat(categories: ExtendedCategoryDTO[]): void {
    const findLatestCategory =
      this.courseHelperService.getLatestCategory(categories);
    if (findLatestCategory) {
      this.currentCategory = findLatestCategory;
      const findCurrentCourse = this.courseHelperService.getLatestCourse(
        this.currentCategory
      );
      if (findCurrentCourse) {
        this.selectedCourse = findCurrentCourse;
        this.exerciseIndex = this.selectedCourse.exercises.length - 1;
      }
    }
  }

  /**
   * Download the result view as PDF.
   */
  downloadAsPDF(): void {
    const data = this.resultEl.nativeElement;
    html2canvas(data).then((canvas) => {
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
      pdf.addImage(contentDataURL, 'PNG', 0, 10, imgWidth, imgHeight);
      pdf.save('result.pdf');
    });
  }

  /**
   * Print result view.
   */
  print(): void {
    if (this.resultEl) {
      const elemToPrint = this.resultEl.nativeElement.cloneNode(true);
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
  nextCourse(): void {
    const currentCourseIndex = this.currentCategory.courses.indexOf(
      this.selectedCourse
    );
    if (currentCourseIndex < this.currentCategory.courses.length - 1) {
      this.courseHelperService.startExercise(
        currentCourseIndex + 1,
        0,
        this.currentLanguage,
        this.currentCategory.id,
        this.categories,
        false,
        true
      );
    } else {
      // Go to the next category.
      const catIndex = this.categories.indexOf(this.currentCategory);
      if (catIndex < this.categories.length - 1) {
        this.currentCategory = this.categories[catIndex + 1];
        this.courseHelperService.startExercise(
          0,
          0,
          this.currentLanguage,
          this.currentCategory.id,
          this.categories,
          false,
          true
        );
      } else {
        // Start from the first category.
        this.currentCategory = this.categories[0];
        this.courseHelperService.startExercise(
          0,
          0,
          this.currentLanguage,
          this.currentCategory.id,
          this.categories,
          false,
          true
        );
      }
    }
  }

  /**
   * Replay the current course.
   */
  replay(): void {
    this.courseHelperService.startExercise(
      this.currentCategory.courses.indexOf(this.selectedCourse),
      0,
      this.currentLanguage,
      this.currentCategory.id,
      this.categories
    );
  }

  /**
   * Reset the current course progress.
   */
  resetCourse(): void {
    this.selectedCourse.updatedAt = new Date();
    this.selectedCourse.exercises = this.selectedCourse.exercises.map((el) => {
      const exercise = {
        id: el.id,
        name: el.name,
        text: el.text,
        results: [],
      };
      return exercise;
    });

    // Update course progress in local storage.
    const findItem = this.storedData.data.find(
      (el) => el.id === this.currentCategory.id
    );
    if (findItem) {
      findItem.updatedAt = new Date();
      this.courseHelperService.updateLocalStorageData(this.storedData);
    }
    this.goBack();
  }

  /**
   * Go back method.
   */
  goBack(): void {
    this.router.navigate(['/set-course']);
  }

  /**
   * Calculate the speed for the current course.
   *
   * @returns Returns the total speed value for the current course.
   */
  calculateSpeed(): number {
    return this.courseHelperService.calculateSpeed(this.selectedCourse);
  }

  /**
   * Calculate the accuracy for the current course.
   *
   * @returns Returns the total accuracy value for the current course.
   */
  calculateAccuracy(): number {
    return this.courseHelperService.calculateAccuracy(this.selectedCourse);
  }

  /**
   * Clean the DOM before the page unloads (used when we refresh the page).
   */
  @HostListener('window:beforeunload', ['$event'])
  cleanupBeforeUnload(): void {
    // Remove printDivElement from DOM.
    if (this.printDivElement) {
      this.printDivElement.remove();
    }
  }
}
