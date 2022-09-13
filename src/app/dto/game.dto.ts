
export interface GameDTO {
  id: number;
  name: string;
  words: string[];
  selected: boolean;
  result: GameResultDTO[];
  updatedAt: Date;
}

export interface GameResultDTO {
  numberOfWords: number;
  mistakes: number;
  time: number;
  characters: number;
  updatedAt: Date;
}

export interface GameStorageDTO {
  language: string;
  data: GameDTO[];
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
    result: [],
  };
}
