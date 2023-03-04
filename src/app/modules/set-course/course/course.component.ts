import { CourseHelperService } from 'src/app/services/course-helper.service';
import { Component, Input } from "@angular/core";
import { ExtendedCategoryDTO, ExtendedCourseDTO, createEmptyExtendedCategoryDTO, ExtendedCourseExerciseDTO } from "src/app/dto/course.dto";
import { DEFAULT_DEBOUNCE_MIN_TIME } from 'src/app/common/constants';

/**
 * This component holds the logic for displaying course exercises.
 */
@Component({
  selector: 'app-modules-set-course-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class AppSetCourseCourseComponent {
  @Input() currentLanguage: string = '';
  @Input()
  set course(cat: ExtendedCategoryDTO) {
    if (cat) {
      this.courseVal = cat;
      this.findLatestCourse(cat);

      setTimeout(() => {
        this.scrollToExercise();
      }, DEFAULT_DEBOUNCE_MIN_TIME);
    }
  }
  @Input() categories: ExtendedCategoryDTO[] = [];

  // Stores the active course index.
  activeCourseIndex = 0;
  // Stores the active exercise index.
  activeExerciseIndex = 0;
  // Stores the course.
  courseVal: ExtendedCategoryDTO = createEmptyExtendedCategoryDTO();

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param courseHelperService Reference to CourseHelperService.
   */
  constructor(
    private readonly courseHelperService: CourseHelperService,
  ) { }

  /**
   * Find the latest course.
   *
   * @param cat Represents the selected category.
   */
  findLatestCourse(cat: ExtendedCategoryDTO): void {
    const findLatestCourse = this.courseHelperService.getLatestCourse(cat);
    let currentCourse = findLatestCourse;
    const findIndex = cat.courses.findIndex((el: ExtendedCourseDTO) => el.id === findLatestCourse.id);
    if (findIndex !== -1) {
      this.activeCourseIndex = findIndex;
    }
    this.findLatestExercise(currentCourse);
  }

  /**
   * Find the latest exercise.
   *
   * @param course Represents the selected course.
   */
  findLatestExercise(course: ExtendedCourseDTO): void {
    const findLastExercise = this.courseHelperService.getLatestExercise(course);
    const findIndex = course.exercises.findIndex((el: ExtendedCourseExerciseDTO) => el.id === findLastExercise.id);
    if (findIndex !== -1) {
      this.activeExerciseIndex = findIndex;
    }
    if (findLastExercise.completed) {
      if (findIndex && ((findIndex + 1) <= course.exercises.length - 1)) {
        this.activeExerciseIndex = findIndex + 1;
      } else {
        if (!course.completed) {
          this.activeExerciseIndex = 0;
        }
      }
    }
  }

  /**
   * Scrolls to the last active exercise.
   */
  scrollToExercise(): void {
    const findCourseElem = document.getElementsByClassName('course-holder-' + this.activeCourseIndex);
    if (findCourseElem && findCourseElem.length > 0) {
      const findExerciseElem = findCourseElem[0].getElementsByClassName('exercise-index-' + this.activeExerciseIndex)[0];
      if (findExerciseElem) {
        findExerciseElem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  /**
   * Start exercise function.
   *
   * @param courseIndex Represents the selected course index.
   * @param exerciseIndex Represents the selected exercise index.
   */
  startExercise(courseIndex: number, exerciseIndex: number): void {
    this.courseHelperService.startExercise(courseIndex, exerciseIndex, this.currentLanguage, this.courseVal.id, this.categories);
  }
}
