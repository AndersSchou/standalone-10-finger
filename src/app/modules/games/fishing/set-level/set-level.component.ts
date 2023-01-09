import { GameStorageDTO } from 'src/app/dto/game.dto';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ReplaySubject, takeUntil } from "rxjs";
import { STORAGE_KEY_TYPE } from "src/app/common/enums";
import { createEmptyFishLevelDTO, FishLevelDTO } from "src/app/dto/fish.dto";
import { LevelDefinitionsData } from "src/app/games/fish/level-definition";
import { LanguageHelperService } from "src/app/services/language.service";

/**
 * This component holds the set level screen for the fish game.
 */
@Component({
  selector: 'app-modules-games-fish-set-level',
  templateUrl: './set-level.component.html',
  styleUrls: ['./set-level.component.scss']
})
export class AppGamesFishSetLevelComponent implements OnInit, OnDestroy {
  // Stores all the levels for the fishing game.
  levels: FishLevelDTO[] = [];
  // Stores the selected level.
  selectedLevel: FishLevelDTO = createEmptyFishLevelDTO();
  // Stores the current language.
  currentLanguage: string;
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<boolean>();

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param router Reference to Router.
   * @param languageHelperService Reference to LanguageHelperService.
   */
  constructor(
    private readonly router: Router,
    private readonly languageHelperService: LanguageHelperService,
  ) {
    this.currentLanguage = this.languageHelperService.currentLangUsed;
  }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit() {
    if (this.currentLanguage && this.currentLanguage.length > 0) {
      this.getFishGameData();
    }

    // Listens for any changes regarding the current used language.
    this.languageHelperService.OnLanguageChanged
      .pipe(takeUntil(this.destroyed)).subscribe(() => {
        this.currentLanguage = this.languageHelperService.currentLangUsed;
        this.getFishGameData();
      });
  }

  /**
   * Unsubscribe Observables and detach event handlers to avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  /**
   * Get the levels for the fish game.
   */
  getFishGameData(): void {
    this.levels = LevelDefinitionsData.map((el => {
      return {
        id: el.id,
        name: el.name,
        goal: el.goal,
        selected: false,
        completed: false,
      };
    }));
    this.checkForCompletedLevels();
  }

  /**
   * Check for completed levels and unblock the next level as well.
   */
  checkForCompletedLevels(): void {
    if (this.currentLanguage) {
      if (localStorage.getItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS)) {
        const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS) as string);
        if (storedData) {
          const findLanguage = storedData.find((item: GameStorageDTO) => item.language === this.currentLanguage);
          if (findLanguage) {
            this.levels.forEach((el: FishLevelDTO, index: number) => {
              const findLevel = findLanguage.data.find((item: FishLevelDTO) => item.id === el.id);
              if (findLevel) {
                el.completed = true;
                if (index < this.levels.length - 1) {
                  this.levels[index + 1].completed = true;
                }
              }
            });
          }
        }
      } else {
        this.levels[0].completed = true;
      }
    }
  }

  /**
   * Select level.
   *
   * @param level Represents the selected level.
   */
  selectLevel(level: FishLevelDTO) {
    if (level.completed) {
      this.levels.forEach((el: FishLevelDTO) => {
        el.selected = false;
      });
      level.selected = true;
      this.selectedLevel = level;
    }
  }

  /**
   * Navigate to the play view.
   */
  play(): void {
    if (this.selectedLevel && this.selectedLevel.selected) {
      this.router.navigate(['/games/fish/level/', this.selectedLevel.id]);
    }
  }

  /**
   * Navigate to the games view.
   */
  backToGames() {
    this.router.navigate(['/games']);
  }
}
