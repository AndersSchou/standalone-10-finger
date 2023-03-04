import { CourseHelperService } from 'src/app/services/course-helper.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ExtendedCategoryDTO, ExtendedCourseDTO, createEmptyExtendedCategoryDTO } from 'src/app/dto/course.dto';
import { SettingsService } from 'src/app/services/settings.service';
import { LanguageHelperService } from 'src/app/services/language.service';

/**
 * This component holds the logic for set course page.
 */
@Component({
  selector: 'app-modules-set-course',
  templateUrl: './set-course.component.html',
  styleUrls: ['./set-course.component.scss']
})
export class AppSetCourseComponent implements OnInit, OnDestroy {
  // Stores the categories array.
  categories: ExtendedCategoryDTO[] = [];
  // Stores the selected course;
  currentCategory: ExtendedCategoryDTO = createEmptyExtendedCategoryDTO();
  // Stores the current language.
  currentLanguage: string;
  // Tells if it should show the settings view or not.
  viewSettings: boolean = false;
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<boolean>();

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param settingsService Reference to SettingsService.
   * @param courseHelperService Reference to CourseHelperService.
   * @param languageHelperService Reference to LanguageHelperService.
   */
  constructor(
    private readonly settingsService: SettingsService,
    private readonly courseHelperService: CourseHelperService,
    private readonly languageHelperService: LanguageHelperService,
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
    this.languageHelperService.OnLanguageChanged
      .pipe(takeUntil(this.destroyed)).subscribe(() => {
        this.currentLanguage = this.languageHelperService.currentLangUsed;
        this.getCategories();
      });

    // Listens for any changes regarding the settings view (show/hide).
    this.settingsService.viewSettingsAction
      .pipe(takeUntil(this.destroyed))
      .subscribe((viewSettings: boolean) => { this.viewSettings = viewSettings; });
  }

  /**
   * Unsubscribe Observables and detach event handlers to avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  /**
   * Get all categories.
   */
  getCategories(): void {
    this.categories = [];
    const data = this.courseHelperService.getCategories(this.currentLanguage);
    if (data) {
      this.categories = data.data.map((el: ExtendedCategoryDTO) => {
        const elem = el;
        const completedCourses = el.courses.filter((course: ExtendedCourseDTO) => {
          const findIncompleteExercise = course.exercises.find(ex => !ex.results || (ex.results && ex.results.length === 0));
          if (findIncompleteExercise) {
            return false;
          }
          return true;
        });
        elem.progress = ((100 * completedCourses.length) / el.courses.length);
        return elem;
      });
      this.findLatestCat(this.categories);
    }
  }

  /**
   * Find the latest category.
   *
   * @param coursesProgress Represents the courses progress data.
   */
  findLatestCat(categories: ExtendedCategoryDTO[]): void {
    const findLatestCategory = this.courseHelperService.getLatestCategory(categories);

    if (findLatestCategory) {
      if (!findLatestCategory.completed) {
        this.currentCategory = findLatestCategory;
      } else {
        const findIndex = this.categories.findIndex((el: ExtendedCategoryDTO) => el.id === findLatestCategory.id);
        if (findIndex && ((findIndex + 1) <= this.categories.length - 1)) {
          this.currentCategory = this.categories[findIndex + 1];
        } else {
          this.currentCategory = this.categories[0];
        }
      }
    } else {
      this.currentCategory = this.categories[0];
    }
  }

  /**
   * Select category.
   *
   * @param category Represents the selected category.
   */
  selectCategory(category: ExtendedCategoryDTO): void {
    this.currentCategory = { ...category };
  }
}
