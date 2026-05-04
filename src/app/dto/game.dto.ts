import { ResultDTO } from './course.dto';

/**
 * Game interface.
 */
export interface GameDTO {
  id: number;
  name: string;
  selected?: boolean;
  results: ResultDTO[];
  updatedAt?: Date;
}

/**
 * Game storage interface.
 */
export interface GameStorageDTO {
  language: string;
  totalLevels: number;
  data: GameDTO[];
}

/**
 * Game result interface.
 */
export interface GameResultDTO {
  level: GameDTO;
  wordsCount: number;
  language: string;
  showNext: boolean;
  timeOut: boolean;
}

/**
 * Score update interface.
 */
export interface ScoreUpdateDTO {
  score: number;
  completedWords: number;
  chars: number;
  errors: number;
}

/**
 * Creates an empty level.
 *
 * @returns An object as GameDTO.
 */
export function createEmptyLevelDTO(): GameDTO {
  return {
    id: 0,
    name: '',
    selected: false,
    updatedAt: new Date(),
    results: [],
  };
}
