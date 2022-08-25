import { CourseHelperService } from 'src/app/services/course-helper.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { STORAGE_KEY_TYPE } from 'src/app/common/enums';
import { Courses } from 'src/app/courses';
import { CategoriesDTO, CourseDTO, CourseResponseDTO, StoredCourseResponseDTO } from 'src/app/dto/course.dto';
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
  categories: CategoriesDTO[] = [];
  // Stores the selected course;
  currentCategory: CategoriesDTO = {
    name: '',
    courses: []
  };
  // Stores the current language.
  currentLanguage: string;
  // Tells if it should show the settings view or not.
  viewSettings: boolean = false;
  // Stores the categories data.
  storedData: StoredCourseResponseDTO[] = [];
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
    if (localStorage.getItem(STORAGE_KEY_TYPE.COURSES_PROGRESS)) {
      this.storedData = JSON.parse(localStorage.getItem(STORAGE_KEY_TYPE.COURSES_PROGRESS) as string);
      const findCategories = this.storedData.find((el: StoredCourseResponseDTO) => el.language === this.currentLanguage.split('-')[0]);
      if (findCategories) {
        this.categories = findCategories.data.categories.map((el: CategoriesDTO) => {
          const elem = el;
          const completedCourses = el.courses.filter((course: CourseDTO) => course.completed);
          elem.progress = ((100 * completedCourses.length) / el.courses.length);
          return elem;
        });
        this.findLatestCat(findCategories.data);
      } else {
        this.getAllCategories();
      }
    } else {
      this.getAllCategories();
    }
  }

  /**
   * Find the latest category.
   */
  findLatestCat(coursesProgress: CourseResponseDTO): void {
    const findLatestCategory = this.courseHelperService.getLatestCategory(coursesProgress);

    if (findLatestCategory) {
      if (!findLatestCategory.completed) {
        this.currentCategory = findLatestCategory;
      } else {
        const findIndex = this.categories.findIndex((el: CategoriesDTO) => el.name === findLatestCategory.name);
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
   * Select category.
   *
   * @param category Represents the selected category.
   */
  selectCategory(category: CategoriesDTO): void {
    this.currentCategory = { ...category };
  }
}
