/**
 * Course response.
 */
export interface CourseResponseDTO {
  categories: CategoriesDTO[];
}

/**
 * Categories interface.
 */
export interface CategoriesDTO {
  name: string;
  courses: CourseDTO[];
  completed?: boolean;
  progress?: string;
  selected?: boolean;
}

/**
 * Course interface.
 */
export interface CourseDTO {
  name: string;
  exercises: CourseExerciseDTO[];
  completed?: boolean;
  showAll?: boolean;
}

/**
 * Exercise interface.
 */
export interface CourseExerciseDTO {
  name: string;
  text: string;
  completed?: boolean;
  selected?: boolean;
  progress?: string;
}
