import { AppGamesFishingWordFishComponent } from "../modules/games/fishing/word-fish/word-fish.component";

export interface FishLevelDTO {
  id: number;
  name: string;
  goal?: number;
  selected?: boolean;
  completed?: boolean;
}

export interface FishDTO {
  category: number;
  data: FishDetailsDTO[];
  min: number;
  max: number;
  reward: number;
  extraTime: number;
  errors: number;
}

export interface FishDetailsDTO {
  name: string;
  // Grid width (1 = 25px).
  width: number;
  // Grid height (1 = 25px).
  height: number;
  xPos?: number;
  yPos?: number;
}

export interface FishWithWordDTO {
  fish: FishDefinitionDTO;
  fishImage: FishDetailsDTO;
  word: string;
  // It has the focus so it receives the input. All other fish are disregarded.
  active: boolean;
  // As long as it has more letters, it will be available.
  available: boolean;
  // Marks if this should be disregarded when counting fishes in school.
  leftTheSchool: boolean;

  left: string;
  top: string;
  _x: number;
  _y: number;
  _w: number;
  _h: number;
}

export function createFishWithWordDTO(partial: Partial<FishWithWordDTO>): FishWithWordDTO {
  return {
    ...createEmptyFishWithWordDTO(),
    ...partial
  };
}


export interface FishDefinitionDTO {
  category: number;
  name: string;
  wordMinSize: number;
  wordMaxSize: number;
  extraTime: number;
  reward: number;
  maxErrors: number;
}

/**
 * Creates an empty level.
 *
 * @returns An object as GameDTO.
 */
export function createEmptyFishWithWordDTO(): FishWithWordDTO {
  return {
    fish: createEmptyFishDetailsDTO(),
    fishImage: createEmptyFishDefinitionDTO(),
    word: '',
    active: false,
    available: false,
    leftTheSchool: false,
    left: '',
    top: '',
    _x: 0,
    _y: 0,
    _w: 0,
    _h: 0,
  };
}

/**
 * Creates an empty level.
 *
 * @returns An object as GameDTO.
 */
export function createEmptyFishDetailsDTO(): FishDefinitionDTO {
  return {
    category: 0,
    name: '',
    wordMinSize: 0,
    wordMaxSize: 0,
    extraTime: 0,
    reward: 0,
    maxErrors: 0,
  };
}

/**
 * Creates an empty level.
 *
 * @returns An object as GameDTO.
 */
export function createEmptyFishDefinitionDTO(): FishDetailsDTO {
  return {
    name: '',
    width: 0,
    height: 0
  };
}

/**
 * Creates an empty level.
 *
 * @returns An object as GameDTO.
 */
export function createEmptyFishLevelDTO(): FishLevelDTO {
  return {
    id: 0,
    name: '',
    goal: 0,
    selected: false,
    completed: false,
  };
}
