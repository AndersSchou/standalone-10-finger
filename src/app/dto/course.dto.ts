/** *********************** */
/** ***** COMMON DTOs ***** */
/** *********************** */
/**
 * Common properties interface.
 */
export interface CommonPropDTO {
  id: number;
}

/**
 * Extended properties interface.
 */
export interface ExtendedDataDTO extends CommonPropDTO {
  completed?: boolean;
  progress?: number;
  selected?: boolean;
  updatedAt?: Date;
  results?: ResultDTO[];
}

/** ******************** */
/** ***** API DTOs ***** */
/** ******************** */
/**
 * Courses data DTO.
 */
export interface CoursesDataDTO {
  categories: CategoryDataDTO[];
}

/**
 * Category data DTO.
 */
export interface CategoryDataDTO extends CommonPropDTO {
  name: string;
  courses: CourseDataDTO[];
}

/**
 * Course data DTO.
 */
export interface CourseDataDTO extends CommonPropDTO {
  name: string;
  exercises: CourseExerciseDataDTO[];
}

/**
 * Course exercise data DTO.
 */
export interface CourseExerciseDataDTO extends CommonPropDTO {
  name: string;
  text: string;
}

/** ******************* */
/** ***** UI DTOs ***** */
/** ******************* */
/**
 * Courses DTO.
 */
export interface CoursesDTO {
  language: string;
  data: ExtendedCategoryDTO[];
}

/**
 * Extended Category DTO.
 */
export interface ExtendedCategoryDTO extends CommonPropDTO, ExtendedDataDTO {
  name: string;
  courses: ExtendedCourseDTO[];
}

/**
 * Extended Course DTO.
 */
export interface ExtendedCourseDTO extends CommonPropDTO, ExtendedDataDTO {
  name: string;
  exercises: ExtendedCourseExerciseDTO[];
  showDetails?: boolean;
}

/**
 * Extended Course Exercise DTO.
 */
export interface ExtendedCourseExerciseDTO extends CommonPropDTO, ExtendedDataDTO {
  name: string;
  text: string;
}

/** *********************** */
/** ***** Stored DTOs ***** */
/** *********************** */
/**
 * Stored courses DTO.
 */
export interface StoredCoursesDTO {
  language: string;
  data: StoredCoursesDataDTO[];
}

/**
 * Stored courses data DTO.
 */
export interface StoredCoursesDataDTO {
  categories: StoredCategoryDataDTO[];
}

/**
 * Stored category data DTO.
 */
export interface StoredCategoryDataDTO extends CommonPropDTO, ExtendedDataDTO {
  courses: StoredCourseDataDTO[];
}

/**
 * Stored course data DTO.
 */
export interface StoredCourseDataDTO extends CommonPropDTO, ExtendedDataDTO {
  exercises: StoredCourseExerciseDataDTO[];
  showDetails?: boolean;
}

/**
 * Stored course exercise data DTO.
 */
export interface StoredCourseExerciseDataDTO extends CommonPropDTO, ExtendedDataDTO { }

/**
 * Result interface.
 */
export interface ResultDTO {
  mistakes: number;
  numberOfWords?: number;
  start?: Date;
  end?: Date;
  time: number;
  characters: number;
  lastIndex?: number;
  updatedAt: Date;
}

/**
 * Set exercise interface.
 */
export interface SetExerciseDTO {
  index: number;
  course: ExtendedCourseDTO;
}

/**
 * Create empty courses.
 *
 * @returns Returns an empty courses DTO.
 */
export function createEmptyCoursesDTO(): CoursesDTO {
  return {
    language: '',
    data: []
  };
}

/**
 * Create empty stored courses.
 *
 * @returns Returns an empty stored courses DTO.
 */
export function createEmptyExtendedCategoryDTO(): ExtendedCategoryDTO {
  return {
    id: 0,
    name: '',
    courses: [],
    completed: false,
    progress: 0,
    selected: false,
  };
}

/**
 * Create empty extended course.
 *
 * @returns Returns an empty extended course DTO.
 */
export function createEmptyExtendedCourseDTO(): ExtendedCourseDTO {
  return {
    id: 0,
    name: '',
    exercises: [],
    completed: false,
    showDetails: false,
    results: [],
  };
}

/**
 * Create empty result.
 *
 * @returns Returns an empty result DTO.
 */
export function createEmptyResultDTO(): ResultDTO {
  return {
    mistakes: 0,
    time: 0,
    characters: 0,
    updatedAt: new Date(),
  };
}
