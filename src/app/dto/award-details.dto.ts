import { ResultDTO, ExtendedCourseDTO, ExtendedCategoryDTO } from './course.dto';
import { GameDTO } from './game.dto';

/**
 * Award details DTO.
 */
export interface AwardDetailsDTO {
  course: ExtendedCourseDTO;
  currentLanguage: string;
  currentCategory: ExtendedCategoryDTO;
  categories: ExtendedCategoryDTO[];
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
  id: number;
  categoryName: string;
  levelName: string;
  currentLanguage: string;
  indexLevel: number;
  totalLevels: number;
  highestResult: ResultDTO;
  currentCategory: ExtendedCategoryDTO;
  categories: ExtendedCategoryDTO[];
  gameLevels?: GameDTO[];
}
