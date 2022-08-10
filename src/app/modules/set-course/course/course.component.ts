import { CourseHelperService } from 'src/app/services/course-helper.service';
import { Component, Input, Output } from "@angular/core";
import { Router } from "@angular/router";
import { STORAGE_KEY_TYPE } from "src/app/common/enums";
import { CategoriesDTO, CourseDTO, CourseExerciseDTO } from "src/app/dto/course.dto";

/**
 * This component holds the logic for displaying course exercises.
 */
@Component({
  selector: 'app-modules-set-course-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class AppSetCourseCourseComponent {
  @Input()
  set course(cat: CategoriesDTO) {
    if (cat) {
      this.courseVal = cat;
      this.findLatestCourse(cat);

      setTimeout(() => {
        this.scrollToExercise();
      }, 500);
    }
  }
  @Input() categories: CategoriesDTO[] = [];
  activeCourseIndex = 0;
  activeExerciseIndex = 0;

  // Stores the course.
  courseVal: CategoriesDTO = {
    name: '',
    courses: []
  };

  constructor(
    private readonly router: Router,
    private readonly courseHelperService: CourseHelperService,
  ) { }

  findLatestCourse(cat: CategoriesDTO): void {
    const findLatestCourse = this.courseHelperService.getLatestCourse(cat);
    console.log('findLatestCourse', findLatestCourse);

    let currentCourse = findLatestCourse;
    const findIndex = cat.courses.findIndex((el: CourseDTO) => el.name === findLatestCourse.name);
    this.activeCourseIndex = findIndex;
    if (findLatestCourse.completed) {
      if (findIndex && ((findIndex + 1) <= cat.courses.length - 1)) {
        currentCourse = cat.courses[findIndex + 1];
        this.activeCourseIndex = findIndex + 1;
        console.log('----');
      } else {
        currentCourse = cat.courses[0];
        this.activeCourseIndex = 0;
      }
    }
    console.log('currentCourse', currentCourse);
    this.findLatestExercise(currentCourse);

  }

  findLatestExercise(course: CourseDTO): void {
    const findLastExercise = this.courseHelperService.getLatestExercise(course);

    const findIndex = course.exercises.findIndex((el: CourseExerciseDTO) => el.name === findLastExercise.name);
    this.activeExerciseIndex = findIndex;
    if (findLastExercise.completed) {
      if (findIndex && ((findIndex + 1) <= course.exercises.length - 1)) {
        this.activeExerciseIndex = findIndex + 1;
      } else {
        if (!course.completed) {
          this.activeExerciseIndex = 0;
        }
      }
    }
    console.log('findLastExercise', findLastExercise);
  }

  scrollToExercise(): void {
    const findCourseElem = document.getElementsByClassName('course-holder-' + this.activeCourseIndex);
    if (findCourseElem && findCourseElem.length > 0) {
      const findExerciseElem = findCourseElem[0].getElementsByClassName('exercise-index-' + this.activeExerciseIndex)[0];
      if (findExerciseElem) {
        findExerciseElem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  startExercise(courseIndex: number, exerciseIndex: number): void {
    const findCat = this.categories.find((el: CategoriesDTO) => el.name === this.courseVal.name);
    if (findCat) {
      findCat.updatedAt = new Date();
      findCat.courses[courseIndex].updatedAt = new Date();
      findCat.courses[courseIndex].exercises[exerciseIndex].updatedAt = new Date();
    }
    localStorage.setItem(STORAGE_KEY_TYPE.COURSES_PROGRESS, JSON.stringify({ categories: this.categories }));
    setTimeout(() => {
      this.router.navigate(['/type']);
    }, 500);

  }

  /**
   * Toggles show all button.
   *
   * @param course Represents the selected course.
   * @param target Represents the HTML target.
   */
  showAll(course: CourseDTO, target: HTMLElement): void {
    // course.showAll = !course.showAll;
    // if (!course.showAll) {
    //   // Scroll to course title.
    //   target.scrollIntoView({ behavior: 'smooth' });
    // }
  }
}
