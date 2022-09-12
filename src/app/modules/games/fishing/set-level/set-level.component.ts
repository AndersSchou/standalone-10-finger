import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ReplaySubject, takeUntil } from "rxjs";
import { createEmptyLevelDTO, GameDTO } from "src/app/dto/game.dto";
import { FishGame } from "src/app/games/fish";
import { LanguageHelperService } from "src/app/services/language.service";

@Component({
  selector: 'app-modules-games-fish-set-level',
  templateUrl: './set-level.component.html',
  styleUrls: ['./set-level.component.scss']
})
export class AppGamesFishSetLevelComponent implements OnInit, OnDestroy {
  // levels = [0, 1, 2, 3, 4, 5, 6];
  levels: GameDTO[] = [];
  selectedLevel: GameDTO = createEmptyLevelDTO();
  // Stores the current language.
  currentLanguage: string;
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<boolean>();

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
    console.log('this.currentLanguage', this.currentLanguage);
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


  getFishGameData(): void {
    if (this.currentLanguage && this.currentLanguage.length > 0) {
      const lang = this.currentLanguage.split('-')[0];
      if (lang in FishGame) {
        const cat = FishGame[lang];
        console.log('cat', cat);
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

  selectLevel(level: GameDTO) {
    this.levels.forEach((el: GameDTO) => {
      el.selected = false;
    });
    level.selected = true;
    this.selectedLevel = level;
  }

  play(): void {
    if (this.selectedLevel && this.selectedLevel.selected) {
      this.router.navigate(['/games/fish/level/', this.selectedLevel.id]);
    }
  }

  backToGames() {
    this.router.navigate(['/games']);
  }
}
