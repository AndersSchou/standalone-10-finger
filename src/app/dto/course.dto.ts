/**
 * Course response.
 */
export interface CourseResponseDTO {
  categories: CategoriesDTO[];
}

export interface StoredCourseResponseDTO {
  language: string;
  data: CourseResponseDTO;
}

/**
 * Categories interface.
 */
export interface CategoriesDTO {
  name: string;
  courses: CourseDTO[];
  completed?: boolean;
  progress?: number;
  selected?: boolean;
  updatedAt?: Date;
}

/**
 * Course interface.
 */
export interface CourseDTO {
  name: string;
  exercises: CourseExerciseDTO[];
  completed?: boolean;
  showAll?: boolean;
  updatedAt?: Date;
  results: CourseResultDTO[];
}

/**
 * Exercise interface.
 */
export interface CourseExerciseDTO {
  name: string;
  text: string;
  completed?: boolean;
  progress?: number;
  results: CourseResultDTO[];
  updatedAt?: Date;
}

export interface CourseResultDTO {
  mistakes: number;
  start?: Date;
  end?: Date;
  time: number;
  characters: number;
  lastIndex?: number;
  updatedAt: Date;
}
