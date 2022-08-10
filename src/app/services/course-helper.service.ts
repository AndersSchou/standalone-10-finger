import { CourseDTO, CategoriesDTO, CourseResponseDTO, CourseExerciseDTO } from 'src/app/dto/course.dto';
import { Injectable } from '@angular/core';

@Injectable()
export class CourseHelperService {

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
}
