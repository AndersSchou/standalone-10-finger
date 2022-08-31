/**
 * Course response.
 */
export interface CourseResponseDTO {
  categories: CategoriesDTO[];
}

/**
 * Stored categories interface.
 */
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

/**
 * Result interface.
 */
export interface CourseResultDTO {
  mistakes: number;
  start?: Date;
  end?: Date;
  time: number;
  characters: number;
  lastIndex?: number;
  updatedAt: Date;
}

export function createEmptyCourseResponseDTO(): CourseResponseDTO { return { categories: [] }; }

/**
 * Creates an empty category.
 *
 * @returns An object as CategoriesDTO.
 */
export function createEmptyCategoriesDTO(): CategoriesDTO {
  return {
    name: '',
    courses: [],
    completed: false,
    progress: 0,
    selected: false,
    updatedAt: new Date(),
  };
}

/**
 * Creates an empty course.
 *
 * @returns An object as CourseDTO.
 */
export function createEmptyCourseDTO(): CourseDTO {
  return {
    name: '',
    exercises: [],
    completed: false,
    showAll: false,
    updatedAt: new Date(),
    results: [],
  };
}
