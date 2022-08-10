import { CourseHelperService } from 'src/app/services/course-helper.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { STORAGE_KEY_TYPE } from 'src/app/common/enums';
import { Courses } from 'src/app/courses';
import { CategoriesDTO, CourseDTO, CourseResponseDTO } from 'src/app/dto/course.dto';
import { SettingsService } from 'src/app/services/settings.service';

/**
 * This component holds the logic for set course page.
 */
@Component({
  selector: 'app-modules-set-course',
  templateUrl: './set-course.component.html',
  styleUrls: ['./set-course.component.scss']
})
export class AppSetCourseComponent implements OnInit {
  // Stores the categories array.
  categories: CategoriesDTO[] = [];
  // Stores the selected course;
  currentCategory: CategoriesDTO = {
    name: '',
    courses: []
  };
  // Stores the current language.
  currentLanguage = 'da';
  // Tells if it should show the settings view or not.
  viewSettings: boolean = false;
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<never>();

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param settingsService Reference to SettingsService.
   */
  constructor(
    private readonly settingsService: SettingsService,
    private readonly cdr: ChangeDetectorRef,
    private readonly courseHelperService: CourseHelperService,
  ) { }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit() {
    // TODO: When navigating to course screen we should scroll to the current progress of the user so the last active exercise is visible in the top.
    this.getAllCategories();

    // Listens for any changes regarding the settings view (show/hide).
    this.settingsService.viewSettingsAction
      .pipe(takeUntil(this.destroyed))
      .subscribe((viewSettings: boolean) => { this.viewSettings = viewSettings; });

    if (localStorage.getItem(STORAGE_KEY_TYPE.COURSES_PROGRESS)) {
      const coursesProgress = JSON.parse(localStorage.getItem(STORAGE_KEY_TYPE.COURSES_PROGRESS) as string);
      this.categories = coursesProgress.categories.map((el: CategoriesDTO) => {
        const elem = el;
        const completedCourses = el.courses.filter((course: CourseDTO) => course.completed);
        elem.progress = ((100 * completedCourses.length) / el.courses.length);
        return elem;
      });
      this.findLatestCat(coursesProgress);

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
    if (this.currentLanguage in Courses) {
      const cat = Courses[this.currentLanguage];
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

  /**
   * Select category.
   *
   * @param category Represents the selected category.
   */
  selectCategory(category: CategoriesDTO): void {
    this.currentCategory = { ...category };
  }
}
