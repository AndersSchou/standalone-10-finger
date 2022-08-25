import { CourseDTO, CategoriesDTO, CourseResponseDTO, CourseExerciseDTO, StoredCourseResponseDTO } from 'src/app/dto/course.dto';
import { Injectable } from '@angular/core';
import { STORAGE_KEY_TYPE } from '../common/enums';
import { Router } from '@angular/router';

@Injectable()
export class CourseHelperService {

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
  startExercise(courseIndex: number, exerciseIndex: number, language: string, categoryName: string, categories: CategoriesDTO[]): void {
    const findCat = categories.find((el: CategoriesDTO) => el.name === categoryName);
    if (findCat) {
      findCat.updatedAt = new Date();
      findCat.courses[courseIndex].updatedAt = new Date();
      findCat.courses[courseIndex].exercises[exerciseIndex].updatedAt = new Date();
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
    }, 500);
  }
}
