import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { STORAGE_KEY_TYPE } from 'src/app/common/enums';
import { Courses } from 'src/app/courses';
import { CompletedLevelDTO, CompletedLevelDetailsDTO } from 'src/app/dto/award-details.dto';
import { CategoriesDTO, StoredCourseResponseDTO, CourseDTO, ResultDTO } from 'src/app/dto/course.dto';
import { GameDTO, GameStorageDTO } from 'src/app/dto/game.dto';
import { TranslationsDTO } from 'src/app/dto/translation.dto';
import { FishGame } from 'src/app/games/fish';
import { LanguageHelperService } from 'src/app/services/language.service';
import { SettingsService } from 'src/app/services/settings.service';

/**
 * This component holds the logic for the achievements view.
 */
@Component({
  selector: 'app-modules-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AppAchievementsComponent implements OnInit, OnDestroy {
  // Stores the categories array.
  categories: CategoriesDTO[] = [];
  // Stores the selected course;
  currentCategory: CategoriesDTO = {
    name: '',
    courses: []
  };
  // Stores the current language.
  currentLanguage: string;
  // Stores the completed courses.
  completedCourses: CourseDTO[] = [];
  // Tells if it should show the settings view or not.
  viewSettings: boolean = false;
  // Stores the games.
  games = [
    { type: 'FishTyping', name: '', selected: false },
  ];
  // Stores all the completed game levels as an array.
  fishingGameLevels: GameDTO[] = [];
  // Stores the total completed game levels.
  gameLevels: number = 0;
  // Stores the total game levels.
  totalGameLevels: number = 0;
  // Stores the category progress.
  categoryProgress: number = 0;
  // Stores the speed.
  speed: number = 0;
  // Stores the accuracy.
  accuracy: number = 0;
  // Stores the completed courses/game levels.
  completedLevels: CompletedLevelDTO[] = [];
  // Stores the translations.
  translatedObj: TranslationsDTO;
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<boolean>();

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param settingsService Reference to SettingsService.
   * @param languageHelperService Reference to LanguageHelperService.
   */
  constructor(
    private readonly settingsService: SettingsService,
    private readonly languageHelperService: LanguageHelperService,
  ) {
    this.currentLanguage = this.languageHelperService.currentLangUsed;
    this.translatedObj = this.languageHelperService.translationObject;
  }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  ngOnInit(): void {
    if (this.currentLanguage && this.currentLanguage.length > 0) {
      this.games[0].name = this.translatedObj['translateFishTyping'];
      this.getCategories();
      this.getGameProgress();
    }

    // Listens for any changes regarding the current used language.
    this.languageHelperService.OnLanguageChanged
      .pipe(takeUntil(this.destroyed)).subscribe((trans) => {
        this.translatedObj = trans;
        this.games[0].name = this.translatedObj['translateFishTyping'];
        this.currentLanguage = this.languageHelperService.currentLangUsed;
        this.getCategories();
        this.getGameProgress();
        this.games.forEach(el => {
          el.selected = false;
        });
        this.selectCategory(this.currentCategory);
      });

    // Listens for any changes regarding the settings view (show/hide).
    this.settingsService.viewSettingsAction
      .pipe(takeUntil(this.destroyed))
      .subscribe((viewSettings: boolean) => { this.viewSettings = viewSettings; });
  }

  /**
   * Unsubscribe Observables and detach event handlers to avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  /**
   * Get all categories.
   */
  getCategories(): void {
    this.categories = [];
    if (localStorage.getItem(STORAGE_KEY_TYPE.COURSES_PROGRESS)) {
      const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY_TYPE.COURSES_PROGRESS) as string);
      const findCategories = storedData.find((el: StoredCourseResponseDTO) => el.language === this.currentLanguage.split('-')[0]);
      if (findCategories) {
        this.categories = findCategories.data.categories;
        this.currentCategory = this.categories[0];
        this.filterCompletedCourses();
      } else {
        this.getAllCategories();
      }
    } else {
      this.getAllCategories();
    }
  }

  /**
   * Find all categories for the current language.
   */
  getAllCategories(): void {
    if (this.currentLanguage && this.currentLanguage.length > 0) {
      const lang = this.currentLanguage.split('-')[0];
      if (lang in Courses) {
        const cat = Courses[lang];
        if (cat && cat.categories) {
          this.categories = cat.categories.map((el: CategoriesDTO) => {
            const elem = el;
            elem.progress = 0;
            return elem;
          });
          this.currentCategory = this.categories[0];
        }
      }
    }
  }

  /**
   * Find all the completed game levels for the current language.
   */
  getGameProgress(): void {
    if (localStorage.getItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS)) {
      const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS) as string);
      if (storedData) {
        const findLanguage = storedData.find((item: GameStorageDTO) => item.language === this.currentLanguage);
        if (findLanguage) {
          const lang = this.currentLanguage.split('-')[0];
          if (lang in FishGame) {
            const cat = FishGame[lang];
            if (cat && cat.length > 0) {
              this.totalGameLevels = cat.length;
            }
          }
          this.gameLevels = findLanguage.totalLevels;
          this.fishingGameLevels = findLanguage.data;
        } else {
          this.fishingGameLevels = [];
        }
      }
    } else {
      this.fishingGameLevels = [];
    }
  }

  /**
   * Filter completed courses.
   */
  filterCompletedCourses(): void {
    this.completedCourses = this.currentCategory.courses.filter(el => {
      const findIncompleteExercise = el.exercises.find(ex => !ex.results || (ex.results && ex.results.length === 0));
      if (findIncompleteExercise) {
        return false;
      }
      return true;
    });
    this.completedLevels = this.completedCourses.map(el => {
      const levelDetails: CompletedLevelDetailsDTO = {
        categoryName: this.currentCategory.name,
        levelName: el.name,
        currentLanguage: this.currentLanguage,
        indexLevel: this.currentCategory.courses.indexOf(el),
        totalLevels: this.currentCategory.courses.length,
        highestResult: this.calculateMaxRes(el.results),
        currentCategory: this.currentCategory,
        categories: this.categories
      };
      const level: CompletedLevelDTO = {
        name: el.name,
        isGame: false,
        details: levelDetails
      };
      return level;
    });
    this.categoryProgress = this.calculateProgress(this.completedCourses.length, this.currentCategory.courses.length);
    this.speed = this.calculateSpeedAndAccuracy(this.completedCourses).speed;
    this.accuracy = this.calculateSpeedAndAccuracy(this.completedCourses).accuracy;
  }

  /**
   * Select category.
   *
   * @param category Represents the selected category.
   */
  selectCategory(category: CategoriesDTO): void {
    this.currentCategory = { ...category };
    this.games.forEach(el => {
      el.selected = false;
    });
    this.filterCompletedCourses();
  }

  /**
   * Select game.
   *
   * @param game Represents the selected game.
   */
  selectGame(game: { name: string, selected: boolean }): void {
    this.categories.forEach(el => {
      el.selected = false;
    });
    this.games.forEach(el => {
      el.selected = false;
    });
    game.selected = true;
    const cat: CategoriesDTO = {
      name: game.name,
      courses: [],
      selected: game.selected
    };
    this.mapCompletedGameLevels();
    this.currentCategory = cat;
    this.categoryProgress = this.calculateProgress(this.fishingGameLevels.length, this.gameLevels);
    this.speed = this.calculateSpeedAndAccuracy(this.fishingGameLevels).speed;
    this.accuracy = this.calculateSpeedAndAccuracy(this.fishingGameLevels).accuracy;
  }

  /**
   * Map completed game levels.
   */
  mapCompletedGameLevels(): void {
    this.completedLevels = this.fishingGameLevels.map(el => {
      const levelDetails: CompletedLevelDetailsDTO = {
        categoryName: this.games[0].name,
        levelName: el.name,
        currentLanguage: this.currentLanguage,
        indexLevel: this.fishingGameLevels.indexOf(el),
        totalLevels: this.totalGameLevels,
        highestResult: this.calculateMaxRes(el.results),
        gameLevels: this.fishingGameLevels,
        categories: [],
        currentCategory: this.currentCategory
      };
      const level: CompletedLevelDTO = {
        name: el.name,
        isGame: true,
        details: levelDetails
      };
      return level;
    });
  }

  /**
   * Calculates the progress of the current category.
   *
   * @param completed Represents the number of completed courses/game levels.
   * @param total Represents the total number of courses/game levels.
   *
   * @returns The current progress as number of the current category.
   */
  calculateProgress(completed: number, total: number): number {
    return completed > 0 ? ((100 * completed) / total) : 0;
  }

  /**
   * Calculates the average speed and accuracy of the current category.
   *
   * @param completed Represents the completed courses or game levels.
   *
   * @returns The average speed and accuracy of the current category.
   */
  calculateSpeedAndAccuracy(completed: CourseDTO[] | GameDTO[]): { speed: number, accuracy: number } {
    if (completed.length > 0) {
      let speed = 0;
      let accuracy = 0;
      let totalChars = 0;
      let totalTime = 0;
      let totalMistakes = 0;

      for (const res of completed) {
        const highestResult = this.calculateMaxRes(res.results);
        totalChars += highestResult.characters;
        totalTime += highestResult.time;
        totalMistakes += highestResult.mistakes;
      }

      speed = Math.round((totalChars * 60000) / totalTime);
      accuracy = Math.round((totalChars - totalMistakes) * 100 / totalChars);
      return { speed, accuracy };
    } else {
      return { speed: 0, accuracy: 0 };
    }
  }

  /**
   * Calculate the highest result of the course/game level.
   *
   * @param results Represents the results of the course/game level.
   *
   * @returns The highest result of the course/game level.
   */
  calculateMaxRes(results: ResultDTO[]): ResultDTO {
    const highestResult = results.reduce((prev: ResultDTO, current: ResultDTO) => {
      if (prev) {
        if (Math.round(((prev.characters * 60000 / prev.time) + ((prev.characters - prev.mistakes) * 100 / prev.characters)) / 2)
          > Math.round(((current.characters * 60000 / current.time) + ((current.characters - current.mistakes) * 100 / current.characters)) / 2)) {
          return prev;
        }
      }
      return current;
    });
    return highestResult;
  }
}
