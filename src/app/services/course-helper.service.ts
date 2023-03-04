import {
  SetExerciseDTO,
  CoursesDataDTO,
  CategoryDataDTO,
  createEmptyExtendedCategoryDTO,
  CourseDataDTO,
  CourseExerciseDataDTO,
  CoursesDTO,
  ExtendedCategoryDTO,
  ExtendedCourseDTO,
  ExtendedCourseExerciseDTO,
  StoredCoursesDataDTO,
  StoredCategoryDataDTO,
  StoredCoursesDTO,
  createEmptyExtendedCourseDTO,
  StoredCourseDataDTO,
  StoredCourseExerciseDataDTO
} from 'src/app/dto/course.dto';
import { Injectable } from '@angular/core';
import { STORAGE_KEY_TYPE } from '../common/enums';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Courses } from '../courses';

/**
 * CourseHelperService is used to handle the course data.
 */
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

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param router Reference to the Router service.
   */
  constructor(
    private readonly router: Router,
  ) { }

  /**
   * Get all course categories based on the provided language.
   *
   * @param language Represents the language.
   *
   * @returns A CoursesDTO object.
   */
  getCategories(language: string): CoursesDTO {
    let courses: CoursesDTO = {
      language: '',
      data: []
    };
    const lang = language.split('-')[0];
    // Check if we have a course for the language in the JSON file.
    if (lang in Courses) {
      const cat = Courses[lang];
      if (cat && cat.categories) {
        // Check local storage for the course progress.
        if (localStorage.getItem(STORAGE_KEY_TYPE.COURSES_PROGRESS)) {
          const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY_TYPE.COURSES_PROGRESS) as string);
          const findData = storedData.find((el: StoredCoursesDTO) => el.language === lang);
          if (findData) {
            // Map the course with the stored data.
            courses = this.mapCourseDataWithStoredData(cat, findData);
          } else {
            // Map original categories.
            courses = this.convertCoursesDataDTOToCoursesDTO(cat, lang);
          }
        } else {
          // Map original categories.
          courses = this.convertCoursesDataDTOToCoursesDTO(cat, lang);
        }
      }
    }
    return courses;
  }

  /**
   *  Map the course data with the stored data.
   *
   * @param course Represents the course data.
   * @param storedData Represents the stored data.
   *
   * @returns A CoursesDTO object.
   */
  mapCourseDataWithStoredData(course: CoursesDataDTO, storedData: StoredCoursesDTO): CoursesDTO {
    const categories: ExtendedCategoryDTO[] = course.categories.map((category: CategoryDataDTO) => {
      const storedCategory = storedData.data[0].categories.find((el: StoredCategoryDataDTO) => el.id === category.id);
      if (storedCategory) {
        const courses = category.courses.map((course: CourseDataDTO) => {
          const storedCourse = storedCategory.courses.find((el: StoredCourseDataDTO) => el.id === course.id);
          if (storedCourse) {
            const exercises = course.exercises.map((exercise: CourseExerciseDataDTO) => {
              const storedExercise = storedCourse.exercises.find((el: StoredCourseExerciseDataDTO) => el.id === exercise.id);
              if (storedExercise) {
                return {
                  ...exercise,
                  completed: storedExercise.completed,
                  progress: storedExercise.progress,
                  results: storedExercise.results ? storedExercise.results : [],
                  updatedAt: storedExercise.updatedAt
                };
              }
              return {
                ...exercise,
                completed: false,
                progress: 0,
                selected: false,
              };
            });
            return {
              ...course,
              exercises,
              completed: storedCourse.completed,
              results: storedCourse.results ? storedCourse.results : [],
              updatedAt: storedCourse.updatedAt
            };
          }
          return {
            ...course,
            completed: false,
            results: [],
          };
        });
        return {
          ...category,
          courses,
          completed: storedCategory.completed,
          progress: storedCategory.progress,
          selected: storedCategory.selected,
          updatedAt: storedCategory.updatedAt
        };
      }
      return {
        ...category,
        completed: false,
        progress: 0,
        selected: false
      }
    });

    return { data: categories, language: storedData.language };
  }

  /**
   * Convert from CoursesDTO to StoredCoursesDTO.
   *
   * @param courses Represents the courses data.
   *
   * @returns A StoredCoursesDTO object.
   */
  convertCoursesDTOToStoredCoursesDTO(courses: CoursesDTO): StoredCoursesDTO {
    const cats: StoredCategoryDataDTO[] = courses.data.map((category: ExtendedCategoryDTO) => {
      const courses = category.courses.map((course: ExtendedCourseDTO) => {
        const exercises = course.exercises.map((exercise: ExtendedCourseExerciseDTO) => {
          return {
            id: exercise.id,
            completed: exercise.completed,
            progress: exercise.progress,
            results: exercise.results,
            updatedAt: exercise.updatedAt
          };
        });
        return {
          id: course.id,
          completed: course.completed,
          results: course.results,
          updatedAt: course.updatedAt,
          exercises
        };
      });
      return {
        id: category.id,
        completed: category.completed ? category.completed : false,
        progress: category.progress ? category.progress : 0,
        selected: category.selected ? category.selected : false,
        updatedAt: category.updatedAt,
        courses
      };
    });
    const categories: StoredCoursesDataDTO = { categories: cats };
    return { data: [categories], language: courses.language };
  }


  /**
   * Convert from CoursesDataDTO to CoursesDTO based on the provided language.
   *
   * @param courses Represents the courses data.
   * @param language Represents the language.
   *
   * @returns A CoursesDTO object.
   */
  convertCoursesDataDTOToCoursesDTO(courses: CoursesDataDTO, language: string): CoursesDTO {
    const cats: ExtendedCategoryDTO[] = courses.categories.map((category: CategoryDataDTO) => {
      const courses = category.courses.map((course: CourseDataDTO) => {
        const exercises = course.exercises.map((exercise: CourseExerciseDataDTO) => {
          return {
            id: exercise.id,
            name: exercise.name,
            text: exercise.text,
            completed: false,
            progress: 0,
            selected: false,
            results: [],
          };
        });
        return {
          id: course.id,
          name: course.name,
          exercises,
          completed: false,
          results: [],
        };
      });
      return {
        id: category.id,
        name: category.name,
        courses,
        completed: false,
        progress: 0,
        selected: false
      };
    });
    return { data: cats, language };
  }

  /**
   * Update localStorage data.
   *
   * @param courses Represents the courses data.
   */
  updateLocalStorageData(courses: CoursesDTO): void {
    const dataToUpdate = this.convertCoursesDTOToStoredCoursesDTO(courses);
    if (localStorage.getItem(STORAGE_KEY_TYPE.COURSES_PROGRESS)) {
      const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY_TYPE.COURSES_PROGRESS) as string);
      const findData = storedData.find((el: StoredCoursesDTO) => el.language === courses.language);
      if (findData) {
        const index = storedData.indexOf(findData);
        storedData[index] = dataToUpdate;
      } else {
        storedData.push(dataToUpdate);
      }
      localStorage.setItem(STORAGE_KEY_TYPE.COURSES_PROGRESS, JSON.stringify(storedData));
    } else {
      localStorage.setItem(STORAGE_KEY_TYPE.COURSES_PROGRESS, JSON.stringify([dataToUpdate]));
    }
  }

  /**
   * Get the latest category.
   *
   * @param categories Represents the categories data.
   *
   * @returns An object as ExtendedCategoryDTO.
   */
  getLatestCategory(categories: ExtendedCategoryDTO[]): ExtendedCategoryDTO {
    return categories.reduce((prev: ExtendedCategoryDTO, current: ExtendedCategoryDTO) => {
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
   * @returns An object as ExtendedCourseDTO.
   */
  getLatestCourse(category: ExtendedCategoryDTO): ExtendedCourseDTO {
    return category.courses.reduce((prev: ExtendedCourseDTO, current: ExtendedCourseDTO) => {
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
   * @returns An object as ExtendedCourseExerciseDTO.
   */
  getLatestExercise(course: ExtendedCourseDTO): ExtendedCourseExerciseDTO {
    return course.exercises.reduce((prev: ExtendedCourseExerciseDTO, current: ExtendedCourseExerciseDTO) => {
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
   * Set current category.
   *
   * @param coursesProgress Represents the categories data.
   * @param resumeCourse Represents the resume course flag.
   *
   * @returns An object as ExtendedCategoryDTO.
   */
  setCurrentCategory(categories: ExtendedCategoryDTO[], resumeCourse: boolean): ExtendedCategoryDTO {
    const findLatestCategory = this.getLatestCategory(categories);
    let currentCategory: ExtendedCategoryDTO = createEmptyExtendedCategoryDTO();
    if (!resumeCourse) {
      currentCategory = findLatestCategory;
    } else {
      // Resume course. Check if the latest category is completed.
      if (findLatestCategory.completed) {
        // If it's completed, find the next category.
        const findNextCat = categories.find((cat: ExtendedCategoryDTO) => !cat.completed);
        if (findNextCat) {
          currentCategory = findNextCat;
        } else {
          // If all categories are completed, then start from the beginning.
          currentCategory = categories[0];
        }
      } else {
        currentCategory = findLatestCategory;
      }
    }
    return currentCategory;
  }

  /**
   * Set current course.
   *
   * @param currentCategory Represents the category data.
   * @param resumeCourse Represents the resume course flag.
   *
   * @returns An object as ExtendedCourseDTO.
   */
  setCurrentCourse(currentCategory: ExtendedCategoryDTO, resumeCourse: boolean): ExtendedCourseDTO {
    const findLatestCourse = this.getLatestCourse(currentCategory);
    let selectedCourse: ExtendedCourseDTO = createEmptyExtendedCourseDTO();
    if (!resumeCourse) {
      selectedCourse = findLatestCourse;
    } else {
      // Resume course. Check if the latest category is completed.
      if (findLatestCourse.completed) {
        // If it's completed, find the next category.
        const findNextCourse = currentCategory.courses.find(course => !course.completed);
        if (findNextCourse) {
          selectedCourse = findNextCourse;
        } else {
          // If all categories are completed, then start from the beginning.
          selectedCourse = currentCategory.courses[0];
        }
      } else {
        selectedCourse = findLatestCourse;
      }
    }

    selectedCourse.results = selectedCourse.results ? selectedCourse.results : [];
    selectedCourse.exercises = selectedCourse.exercises.map(el => {
      const elem = el;
      elem.results = el.results ? el.results : [];
      return elem;
    });
    return selectedCourse;
  }

  /**
   * Set current exercise.
   *
   * @param selectedCourse Represents the course data.
   * @param resumeCourse Represents the resume course flag.
   *
   * @returns An object as SetExerciseDTO.
   */
  setCurrentExercise(selectedCourse: ExtendedCourseDTO, resumeCourse: boolean): SetExerciseDTO {
    const findLastExercise = this.getLatestExercise(selectedCourse);
    const findIndex = selectedCourse.exercises.findIndex(el => el.id === findLastExercise.id);
    let exerciseIndex = 0;
    if (findIndex !== -1) {
      if (!resumeCourse) {
        exerciseIndex = findIndex;
        selectedCourse.exercises = selectedCourse.exercises.map((el, index) => {
          const elem: ExtendedCourseExerciseDTO = { ...el };
          elem.results = el.results ? el.results : [];
          if (index >= exerciseIndex) {
            elem.completed = false;
          }
          return elem;
        });
      } else {
        if (!findLastExercise.completed) {
          exerciseIndex = findIndex;
          selectedCourse.exercises = selectedCourse.exercises.map((el, index) => {
            const elem: ExtendedCourseExerciseDTO = { ...el };
            elem.results = el.results ? el.results : [];
            if (index >= exerciseIndex) {
              elem.completed = false;
            }
            return elem;
          });
        } else {
          if (findIndex + 1 <= selectedCourse.exercises.length - 1) {
            exerciseIndex = findIndex + 1;
          }
        }
      }
    } else {
      exerciseIndex = 0;
    }
    return { index: exerciseIndex, course: selectedCourse };
  }

  /**
   * Start exercise method.
   *
   * @param courseIndex Represents the course index.
   * @param exerciseIndex Represents the exercise index.
   * @param language Represents the language.
   * @param categoryId Represents the category id.
   * @param categories Represents the categories.
   * @param shouldCloseDetails Tells if it should close the details modal or not.
   * @param resumeCourse Represents the resume course flag.
   */
  startExercise(
    courseIndex: number,
    exerciseIndex: number,
    language: string,
    categoryId: number,
    categories: ExtendedCategoryDTO[],
    shouldCloseDetails: boolean = false,
    resumeCourse: boolean = false,
  ): void {
    const findCat = categories.find((el: ExtendedCategoryDTO) => el.id === categoryId);
    if (findCat) {
      findCat.updatedAt = new Date();
      findCat.courses[courseIndex].updatedAt = new Date();
      findCat.courses[courseIndex].completed = false;
      findCat.courses[courseIndex].exercises[exerciseIndex].updatedAt = new Date();
      findCat.courses[courseIndex].exercises[exerciseIndex].completed = false;
    }
    const cats = this.getCategories(language);
    cats.data = [...categories];
    this.updateLocalStorageData(cats);

    setTimeout(() => {
      const queryParams = resumeCourse ? { resume: 'Course' } : {};
      this.router.navigate(['/type'], { queryParams });
      if (shouldCloseDetails) {
        this.closeDetailsModalSource.next(true);
      }
    }, 300);
  }

  /**
   * Calculate the speed for the current course.
   *
   * @param selectedCourse Represents the selected course.
   *
   * @returns The total speed value for the current course.
   */
  calculateSpeed(selectedCourse: ExtendedCourseDTO): number {
    if (selectedCourse.results) {
      const lastResult = selectedCourse.results[selectedCourse.results.length - 1];
      const speed = Math.round((lastResult.characters * 60000) / lastResult.time);
      return speed;
    }
    return 0;
  }

  /**
   * Calculate the accuracy for the current course.
   *
   * @param selectedCourse Represents the selected course.
   *
   * @returns The total accuracy value for the current course.
   */
  calculateAccuracy(selectedCourse: ExtendedCourseDTO): number {
    if (selectedCourse.results) {
      const lastResult = selectedCourse.results[selectedCourse.results.length - 1];
      const accuracy = Math.round((lastResult.characters - lastResult.mistakes) * 100 / lastResult.characters);
      return accuracy;
    }
    return 0;
  }

  /**
   * Calculate course progress based on completed exercises.
   *
   * @param selectedCourse Represents the selected course.
   *
   * @returns The total progress value for the current course.
   */
  calculateCourseProgress(selectedCourse: ExtendedCourseDTO): number {
    const completedExercises = selectedCourse.exercises.filter((exercise: ExtendedCourseExerciseDTO) => exercise.completed);
    let index = completedExercises.length > 0 ? completedExercises.length : 0;
    return (100 * index) / selectedCourse.exercises.length;
  }
}
