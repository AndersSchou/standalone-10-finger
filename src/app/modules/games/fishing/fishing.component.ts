import { takeUntil } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { GameStorageDTO } from 'src/app/dto/game.dto';
import { STORAGE_KEY_TYPE } from 'src/app/common/enums';
import { LanguageHelperService } from 'src/app/services/language.service';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AppGamesFishSetLevelComponent } from './set-level/set-level.component';
import { AppGamesFishInstructionsComponent } from './instructions/instructions.component';
import { NgIf } from '@angular/common';

/**
 * This component is used to hold the loading screen for the fish game.
 */
@Component({
  selector: 'app-modules-games-fishing',
  templateUrl: './fishing.component.html',
  styleUrls: ['./fishing.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    AppGamesFishInstructionsComponent,
    AppGamesFishSetLevelComponent,
    TranslateModule,
  ],
})
export class AppGamesFishingComponent implements OnInit {
  // Tells if it should show the loading screen or not.
  showLoadingScreen = true;
  // Stores the current language.
  currentLanguage: string;
  // Show level screen.
  showLevelScreen = false;
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<boolean>();

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param languageHelperService Reference to LanguageHelperService.
   */
  constructor(private readonly languageHelperService: LanguageHelperService) {
    this.currentLanguage = this.languageHelperService.currentLangUsed;
  }

  /**
   *  A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    this.checkForCompletedLevels();

    // Show the loading screen for 3 seconds.
    setTimeout(() => {
      this.showLoadingScreen = false;
    }, 3000);

    // Listens for any changes regarding the current used language.
    this.languageHelperService.OnLanguageChanged.pipe(
      takeUntil(this.destroyed)
    ).subscribe(() => {
      this.currentLanguage = this.languageHelperService.currentLangUsed;
      this.checkForCompletedLevels();
    });
  }

  /**
   * Check for completed levels and show the set level screen.
   */
  checkForCompletedLevels(): void {
    if (this.currentLanguage && this.currentLanguage.length > 0) {
      if (localStorage.getItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS)) {
        const storedData = JSON.parse(
          localStorage.getItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS) as string
        );
        if (storedData) {
          const findLanguage = storedData.find(
            (item: GameStorageDTO) => item.language === this.currentLanguage
          );
          if (findLanguage) {
            this.showLevelScreen = true;
          }
        }
      }
    }
  }
}
