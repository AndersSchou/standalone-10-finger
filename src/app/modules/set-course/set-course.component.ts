import { Component, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { Courses } from 'src/app/courses';
import { CategoriesDTO } from 'src/app/dto/course.dto';
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
  selectedCourse: CategoriesDTO = {
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
  }

  /**
   * Get all categories for the current language.
   */
  getAllCategories(): void {
    if (this.currentLanguage in Courses) {
      const cat = Courses[this.currentLanguage];
      let index = 10;
      if (cat && cat.categories) {
        this.categories = cat.categories.map((el: CategoriesDTO) => {
          const elem = el;
          elem.progress = 10 + index + '%';
          index += 15;
          return elem;
        });
        this.selectedCourse = this.categories[0];
      }
    }
  }

  /**
   * Select course.
   *
   * @param course Represents the selected course.
   */
  selectCourse(course: CategoriesDTO): void {
    this.selectedCourse = course;
  }

}
