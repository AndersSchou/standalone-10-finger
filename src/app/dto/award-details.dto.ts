import { CategoriesDTO, CourseDTO, ResultDTO } from './course.dto';
import { GameDTO } from './game.dto';

/**
 * AwardDetailsDTO holds the details of an award.
 */
export interface AwardDetailsDTO {
  course: CourseDTO;
  currentLanguage: string;
  currentCategory: CategoriesDTO;
  categories: CategoriesDTO[];
  isGame?: boolean;
}

export interface CompletedLevelDTO {
  name: string;
  isGame: boolean;
  details: CompletedLevelDetailsDTO;
}

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
