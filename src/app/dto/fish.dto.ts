import { AppGamesFishingWordFishComponent } from "../modules/games/fishing/word-fish/word-fish.component";

/**
 * Fish level interface.
 */
export interface FishLevelDTO {
  id: number;
  name: string;
  goal?: number;
  selected?: boolean;
  completed?: boolean;
}

/**
 * Fish interface.
 */
export interface FishDTO {
  category: number;
  data: FishDetailsDTO[];
  min: number;
  max: number;
  reward: number;
  extraTime: number;
  errors: number;
}

/**
 * Fish details interface.
 */
export interface FishDetailsDTO {
  name: string;
  // Grid width (1 = 25px).
  width: number;
  // Grid height (1 = 25px).
  height: number;
  xPos?: number;
  yPos?: number;
}

/**
 * Fish with word interface.
 */
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

/**
 * Creates a fish with word default object.
 *
 * @param partial Represents the partial object.
 *
 * @returns An object as FishWithWordDTO.
 */
export function createFishWithWordDTO(partial: Partial<FishWithWordDTO>): FishWithWordDTO {
  return {
    ...createEmptyFishWithWordDTO(),
    ...partial
  };
}

/**
 * Fish definition interface.
 */
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
 * Creates an empty fish with word object.
 *
 * @returns An object as FishWithWordDTO.
 */
export function createEmptyFishWithWordDTO(): FishWithWordDTO {
  return {
    fish: createEmptyFishDefinitionDTO(),
    fishImage: createEmptyFishDetailsDTO(),
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
 * Creates an empty fish with default definition object.
 *
 * @returns An object as FishDefinitionDTO.
 */
export function createEmptyFishDefinitionDTO(): FishDefinitionDTO {
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
 * Creates an empty fish details object.
 *
 * @returns An object as FishDetailsDTO.
 */
export function createEmptyFishDetailsDTO(): FishDetailsDTO {
  return {
    name: '',
    width: 0,
    height: 0
  };
}

/**
 * Creates an empty level.
 *
 * @returns An object as FishLevelDTO.
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
