// Stores the default fish definitions.
export const FishDefinitionsData = [
  /**
   * Fish category 1 - Word length max 3 (max 2 errors)
   * marine_fish - Reward: 1
   * marine_fish_1 - Reward: 1
   * blue_fish_1 - Reward: 1
   * blue_fish_2 - Reward: 1
   *
   * Fish category 2 - Word length 4-6 (max 1 error)
   * striped_fish - Reward: 2
   * striped_fish_1 - Reward: 2
   * red_fish - Reward: 2
   *
   * Fish category 3 - Word length 7-9 (no error)
   * koi_white_red_1 - Reward: 4
   * koi_red_black - Reward: 4
   * koi_orange_white - Reward: 4
   * koi_orange_white_1 - Reward: 4
   * koi_orange_black - Reward: 4
   *
   * Fish category 4 Word length 10+ (no error)
   * koi_black - Reward: 5
   * koi_yellow - Reward: 5
   * crap - Reward: 5
   *
   * Fish category 5 Word length 12+ (1 error)
   * chest - Reward: 10
   */
  {
    id: 1,
    categoryName: 'Category 1',
    wordMinSize: 1,
    wordMaxSize: 3,
    maxErrors: 2,
    extraTime: 0,
    reward: 1,
    images: [
      { name: 'marine_fish', width: 9, height: 4 },
      { name: 'marine_fish_1', width: 5, height: 3 },
      { name: 'blue_fish_1', width: 8, height: 4 },
      { name: 'blue_fish_2', width: 8, height: 4 },
    ]
  },
  {
    id: 2,
    categoryName: 'Category 2',
    wordMinSize: 4,
    wordMaxSize: 6,
    maxErrors: 1,
    extraTime: 0,
    reward: 2,
    images: [
      { name: 'striped_fish', width: 6, height: 6 },
      { name: 'striped_fish_1', width: 6, height: 4 },
      { name: 'red_fish', width: 5, height: 3 },
    ]
  },
  {
    id: 3,
    categoryName: 'Category 3',
    wordMinSize: 7,
    wordMaxSize: 9,
    maxErrors: 0,
    extraTime: 0,
    reward: 4,
    images: [
      { name: 'koi_white_red_1', width: 5, height: 4 },
      { name: 'koi_red_black', width: 6, height: 4 },
      { name: 'koi_orange_white', width: 6, height: 4 },
      { name: 'koi_orange_white_1', width: 5, height: 5 },
      { name: 'koi_orange_black', width: 3, height: 6 },
    ]
  },
  {
    id: 4,
    categoryName: 'Category 4',
    wordMinSize: 10,
    wordMaxSize: 11,
    maxErrors: 0,
    extraTime: 0,
    reward: 5,
    images: [
      { name: 'koi_black', width: 6, height: 5 },
      { name: 'koi_yellow', width: 6, height: 5 },
      { name: 'crab', width: 5, height: 5, xPos: 10, yPos: 6 },
    ]
  },
  {
    id: 5,
    categoryName: 'Category 5',
    wordMinSize: 12,
    wordMaxSize: 100,
    maxErrors: 1,
    extraTime: 0,
    reward: 10,
    images: [
      { name: 'chest', width: 5, height: 4, xPos: 18, yPos: 1 }
    ]
  },
];
