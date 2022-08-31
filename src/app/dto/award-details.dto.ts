import { CategoriesDTO, CourseDTO } from './course.dto';

/**
 * AwardDetailsDTO holds the details of an award.
 */
export interface AwardDetailsDTO {
  course: CourseDTO;
  currentLanguage: string;
  currentCategory: CategoriesDTO;
  categories: CategoriesDTO[];
}
