import { CategoriesDTO, CourseDTO, ResultDTO } from './course.dto';
import { GameDTO } from './game.dto';

/**
 * Award details DTO.
 */
export interface AwardDetailsDTO {
  course: CourseDTO;
  currentLanguage: string;
  currentCategory: CategoriesDTO;
  categories: CategoriesDTO[];
  isGame?: boolean;
}

/**
 * Completed level DTO.
 */
export interface CompletedLevelDTO {
  name: string;
  isGame: boolean;
  details: CompletedLevelDetailsDTO;
}

/**
 * Completed level details DTO.
 */
export interface CompletedLevelDetailsDTO {
  categoryName: string;
  levelName: string;
  currentLanguage: string;
  indexLevel: number;
  totalLevels: number;
  highestResult: ResultDTO;
  currentCategory: CategoriesDTO;
  categories: CategoriesDTO[];
  gameLevels?: GameDTO[];
}
