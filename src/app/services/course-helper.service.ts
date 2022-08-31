import { CourseDTO, CategoriesDTO, CourseResponseDTO, CourseExerciseDTO, StoredCourseResponseDTO } from 'src/app/dto/course.dto';
import { Injectable } from '@angular/core';
import { STORAGE_KEY_TYPE } from '../common/enums';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class CourseHelperService {
  // The subject used to controls the service communication.
  private closeDetailsModalSource = new Subject<boolean>();
  // Observable instance of the source object.
  private closeDetailsModalObservable = this.closeDetailsModalSource.asObservable();

  /**
   * Getter function for private viewSettings Observable.
   *
   * @return Observable<boolean> That listens for any actions.
   */
  public get closeDetailsModalAction(): Observable<boolean> {
    return this.closeDetailsModalObservable;
  }

  constructor(
    private readonly router: Router,
  ) { }

  /**
   * Get the latest category.
   *
   * @param coursesProgress Represents the categories data.
   *
   * @returns An object as CategoriesDTO.
   */
  getLatestCategory(coursesProgress: CourseResponseDTO): CategoriesDTO {
    return coursesProgress.categories.reduce((prev: CategoriesDTO, current: CategoriesDTO) => {
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
  }

  /**
   * Get the latest course.
   *
   * @param category Represents the category data.
   *
   * @returns An object as CourseDTO.
   */
  getLatestCourse(category: CategoriesDTO): CourseDTO {
    return category.courses.reduce((prev: CourseDTO, current: CourseDTO) => {
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
  }

  /**
   * Get the latest exercise.
   *
   * @param course Represents the course data.
   *
   * @returns An object as CourseExerciseDTO.
   */
  getLatestExercise(course: CourseDTO): CourseExerciseDTO {
    return course.exercises.reduce((prev: CourseExerciseDTO, current: CourseExerciseDTO) => {
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
  }

  /**
   * Start exercise method.
   *
   * @param courseIndex Represents the course index.
   * @param exerciseIndex Represents the exercise index.
   * @param language Represents the language.
   * @param categoryName Represents the category name.
   * @param categories Represents the categories.
   */
  startExercise(
    courseIndex: number,
    exerciseIndex: number,
    language: string,
    categoryName: string,
    categories: CategoriesDTO[],
    shouldCloseDetails: boolean = false,
  ): void {
    const findCat = categories.find((el: CategoriesDTO) => el.name === categoryName);
    if (findCat) {
      findCat.updatedAt = new Date();
      findCat.courses[courseIndex].updatedAt = new Date();
      findCat.courses[courseIndex].completed = false;
      findCat.courses[courseIndex].exercises[exerciseIndex].updatedAt = new Date();
      findCat.courses[courseIndex].exercises[exerciseIndex].completed = false;
    }

    // Update local storage with the new data.
    const lang = language.split('-')[0];
    if (localStorage.getItem(STORAGE_KEY_TYPE.COURSES_PROGRESS)) {
      const allCats = JSON.parse(localStorage.getItem(STORAGE_KEY_TYPE.COURSES_PROGRESS) as string);
      const findLangCategories = allCats.find((el: StoredCourseResponseDTO) => el.language === lang);
      if (findLangCategories) {
        findLangCategories.data = { categories };
      } else {
        allCats.push({
          language: lang,
          data: { categories }
        });
      }
      localStorage.setItem(STORAGE_KEY_TYPE.COURSES_PROGRESS, JSON.stringify(allCats));
    } else {
      const storedData = [{
        language: lang,
        data: { categories }
      }];
      localStorage.setItem(STORAGE_KEY_TYPE.COURSES_PROGRESS, JSON.stringify(storedData));
    }
    setTimeout(() => {
      this.router.navigate(['/type']);
      if (shouldCloseDetails) {
        this.closeDetailsModalSource.next(true);
      }
    }, 300);
  }

  /**
   * Calculate the speed for the current course.
   *
   * @returns The total speed value for the current course.
   */
  calculateSpeed(selectedCourse: CourseDTO): number {
    const lastResult = selectedCourse.results[selectedCourse.results.length - 1];
    const speed = Math.round((lastResult.characters * 60000) / lastResult.time);
    return speed;
  }

  /**
   * Calculate the accuracy for the current course.
   *
   * @returns The total accuracy value for the current course.
   */
  calculateAccuracy(selectedCourse: CourseDTO): number {
    const lastResult = selectedCourse.results[selectedCourse.results.length - 1];
    const accuracy = Math.round((lastResult.characters - lastResult.mistakes) * 100 / lastResult.characters);
    return accuracy;
  }
}
