import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ReplaySubject, takeUntil } from "rxjs";
import { createEmptyLevelDTO, GameDTO } from "src/app/dto/game.dto";
import { FishGame } from "src/app/games/fish";
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
  levels: GameDTO[] = [];
  // Stores the selected level.
  selectedLevel: GameDTO = createEmptyLevelDTO();
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
    if (this.currentLanguage && this.currentLanguage.length > 0) {
      const lang = this.currentLanguage.split('-')[0];
      if (lang in FishGame) {
        const cat = FishGame[lang];
        if (cat) {
          this.levels = cat.map((el: GameDTO) => {
            const elem = el;
            elem.selected = false;
            return elem;
          });
        }
      }
    }
  }

  /**
   * Select level.
   *
   * @param level Represents the selected level.
   */
  selectLevel(level: GameDTO) {
    this.levels.forEach((el: GameDTO) => {
      el.selected = false;
    });
    level.selected = true;
    this.selectedLevel = level;
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
