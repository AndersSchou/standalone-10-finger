import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { STORAGE_KEY_TYPE } from 'src/app/common/enums';
import { GameDTO, GameStorageDTO } from 'src/app/dto/game.dto';
import { FishGame } from 'src/app/games/fish';
import { LanguageHelperService } from 'src/app/services/language.service';

@Component({
  selector: 'app-modules-games-fish-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})
export class AppGamesFishInstructionsComponent implements OnInit, OnDestroy {
  @ViewChild('instructionStepper') instructionStepper?: MatStepper;
  // Stores the selected index.
  selectedIndex: number = 0;
  // Stores the selected leved ID.
  selectedLevelId: number = 0;
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
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  ngOnInit(): void {
    if (this.currentLanguage && this.currentLanguage.length > 0) {
      this.findLatestLevel();
    }
    // Listens for any changes regarding the current used language.
    this.languageHelperService.OnLanguageChanged
      .pipe(takeUntil(this.destroyed)).subscribe(() => {
        this.currentLanguage = this.languageHelperService.currentLangUsed;
        this.findLatestLevel();
      });
  }

  /**
     * Unsubscribe Observables and detach event handlers to avoid memory leaks.
     */
  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  /**
   * Go to the next step.
   */
  next(): void {
    if (this.selectedIndex === 1) {
      // Navigate to set level.
      this.router.navigate(['/games/fish/level']);
    }
    this.instructionStepper?.next();
  }

  /**
   * Go to the previous step.
   */
  previous(): void {
    if (this.selectedIndex === 0) {
      // Navigate to games view.
      this.router.navigate(['/games']);
    }
    this.instructionStepper?.previous();
  }

  /**
   * Selection change listener.
   *
   * @param event Represents the event that is triggered when the selection has changed.
   */
  selectionChange(event: StepperSelectionEvent): void {
    this.selectedIndex = event.selectedIndex;
  }

  /**
   * Finds the latest level.
   */
  findLatestLevel(): void {
    if (localStorage.getItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS)) {
      const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS) as string);
      if (storedData) {
        const findLanguage = storedData.find((item: GameStorageDTO) => item.language === this.currentLanguage);
        if (findLanguage) {
          const latestLevel = findLanguage.data.reduce((prev: GameDTO, current: GameDTO) => {
            if (current.updatedAt) {
              if (!prev || !prev.updatedAt) {
                return current;
              }
              if (new Date(current.updatedAt) > new Date(prev.updatedAt)) {
                return current;
              }
            }
            return prev;
          });
          if (latestLevel) {
            this.selectedLevelId = latestLevel.id;
          } else {
            this.selectedLevelId = findLanguage.data[0].id;
          }
        }
      }
    } else {
      const lang = this.currentLanguage.split('-')[0];
      if (lang in FishGame) {
        const cat = FishGame[lang];
        if (cat && cat.length > 0) {
          this.selectedLevelId = cat[0].id;
        }
      }
    }
  }

  /**
   * Start the game.
   */
  startPlay(): void {
    this.router.navigate(['/games/fish/level/', this.selectedLevelId]);
  }
}
