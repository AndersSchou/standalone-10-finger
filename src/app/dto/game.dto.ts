import { ResultDTO } from "./course.dto";

/**
 * Game interface.
 */
export interface GameDTO {
  id: number;
  name: string;
  words: string[];
  selected: boolean;
  results: ResultDTO[];
  updatedAt: Date;
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
    words: [],
    selected: false,
    updatedAt: new Date(),
    results: [],
  };
}
