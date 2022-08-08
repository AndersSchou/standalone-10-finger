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
  ) { }

  findLatestCourse(cat: CategoriesDTO): void {
    const findLatestCourse = cat.courses.reduce((prev: CourseDTO, current: CourseDTO) => {
      if (current.updatedAt) {
        if (!prev || !prev.updatedAt) {
          return current;
        }
        if (new Date(current.updatedAt) > new Date(prev.updatedAt)) {
          return current;
        }
      }
      return prev;
    });
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
    const findLastExercise = course.exercises.reduce((prev: CourseExerciseDTO, current: CourseExerciseDTO) => {
      if (current.updatedAt) {
        if (!prev || !prev.updatedAt) {
          return current;
        }
        if (new Date(current.updatedAt) > new Date(prev.updatedAt)) {
          return current;
        }
      }
      return prev;
    });
    console.log('findLastExercise', findLastExercise);

    const findIndex = course.exercises.findIndex((el: CourseExerciseDTO) => el.name === findLastExercise.name);
    this.activeExerciseIndex = findIndex;
    if (findLastExercise.completed) {
      if (findIndex && ((findIndex + 1) <= course.exercises.length - 1)) {
        this.activeExerciseIndex = findIndex + 1;
      } else {
        this.activeExerciseIndex = 0;
      }
    }
    console.log('findLastExercise', findLastExercise);
  }

  scrollToExercise(): void {
    console.log('exercise', this.activeExerciseIndex, this.activeCourseIndex);
    const findCourseElem = document.getElementsByClassName('course-holder-' + this.activeCourseIndex);
    console.log('findCourseElem', findCourseElem);
    if (findCourseElem && findCourseElem.length > 0) {
      const findExerciseElem = findCourseElem[0].getElementsByClassName('exercise-index-' + this.activeExerciseIndex)[0];
      console.log('findExerciseElem', findExerciseElem);
      if (findExerciseElem) {
        findExerciseElem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  startExercise(courseIndex: number, exerciseIndex: number): void {
    console.log('startExercise', courseIndex, exerciseIndex);
    const findCat = this.categories.find((el: CategoriesDTO) => el.name === this.courseVal.name);
    if (findCat) {
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
