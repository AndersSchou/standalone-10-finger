import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { STORAGE_KEY_TYPE } from 'src/app/common/enums';
import { Courses } from 'src/app/courses';
import { CategoriesDTO, StoredCourseResponseDTO, CourseDTO } from 'src/app/dto/course.dto';
import { LanguageHelperService } from 'src/app/services/language.service';
import { SettingsService } from 'src/app/services/settings.service';

/**
 * This component holds the logic for the achievements view.
 */
@Component({
  selector: 'app-modules-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AppAchievementsComponent implements OnInit, OnDestroy {
  // Stores the categories array.
  categories: CategoriesDTO[] = [];
  // Stores the selected course;
  currentCategory: CategoriesDTO = {
    name: '',
    courses: []
  };
  // Stores the current language.
  currentLanguage: string;
  // Stores the completed courses.
  completedCourses: CourseDTO[] = [];
  // Tells if it should show the settings view or not.
  viewSettings: boolean = false;
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<boolean>();

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param settingsService Reference to SettingsService.
   * @param languageHelperService Reference to LanguageHelperService.
   */
  constructor(
    private readonly settingsService: SettingsService,
    private readonly languageHelperService: LanguageHelperService,
  ) {
    this.currentLanguage = this.languageHelperService.currentLangUsed;
  }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  ngOnInit(): void {
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
    if (localStorage.getItem(STORAGE_KEY_TYPE.COURSES_PROGRESS)) {
      const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY_TYPE.COURSES_PROGRESS) as string);
      const findCategories = storedData.find((el: StoredCourseResponseDTO) => el.language === this.currentLanguage.split('-')[0]);
      if (findCategories) {
        this.categories = findCategories.data.categories;
        this.currentCategory = this.categories[0];
        this.filterCompletedCourses();
      } else {
        this.getAllCategories();
      }
    } else {
      this.getAllCategories();
    }
  }

  /**
   * Get all categories for the current language.
   */
  getAllCategories(): void {
    if (this.currentLanguage && this.currentLanguage.length > 0) {
      const lang = this.currentLanguage.split('-')[0];
      if (lang in Courses) {
        const cat = Courses[lang];
        if (cat && cat.categories) {
          this.categories = cat.categories.map((el: CategoriesDTO) => {
            const elem = el;
            elem.progress = 0;
            return elem;
          });
          this.currentCategory = this.categories[0];
        }
      }
    }
  }

  /**
   * Filter completed courses.
   */
  filterCompletedCourses(): void {
    this.completedCourses = this.currentCategory.courses.filter(el => {
      const findIncompleteExercise = el.exercises.find(ex => !ex.results || (ex.results && ex.results.length === 0));
      if (findIncompleteExercise) {
        return false;
      }
      return true;
    });
  }

  /**
   * Select category.
   *
   * @param category Represents the selected category.
   */
  selectCategory(category: CategoriesDTO): void {
    this.currentCategory = { ...category };
    this.filterCompletedCourses();
  }

  /**
   * Calculates the progress of the current category.
   *
   * @returns The current progress as number of the current category.
   */
  calculateProgress(): number {
    return this.completedCourses.length > 0 ? ((100 * this.completedCourses.length) / this.currentCategory.courses.length) : 0;
  }

  /**
   * Calculates the average speed and accuracy of the current category.
   *
   * @returns The average speed and accuracy of the current category.
   */
  calculateSpeedAndAccuracy(): { speed: number, accuracy: number } {
    if (this.completedCourses.length > 0) {
      let speed = 0;
      let accuracy = 0;
      let totalChars = 0;
      let totalTime = 0;
      let totalMistakes = 0;

      for (const res of this.completedCourses) {
        const lastResult = res.results[res.results.length - 1];
        totalChars += lastResult.characters;
        totalTime += lastResult.time;
        totalMistakes += lastResult.mistakes;
      }

      speed = Math.round((totalChars * 60000) / totalTime);
      accuracy = Math.round((totalChars - totalMistakes) * 100 / totalChars);
      return { speed, accuracy };
    } else {
      return { speed: 0, accuracy: 0 };
    }
  }
}
