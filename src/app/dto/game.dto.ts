
export interface GameDTO {
  id?: number;
  name: string;
  words: string[];
  selected: boolean;
  result: GameResultDTO[];
  updatedAt: Date;
}

export interface GameResultDTO {
  numberOfWords: number;
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
    name: '',
    words: [],
    selected: false,
    updatedAt: new Date(),
    result: [],
  };
}
