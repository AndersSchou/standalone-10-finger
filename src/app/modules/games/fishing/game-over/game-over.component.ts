import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { STORAGE_KEY_TYPE } from 'src/app/common/enums';
import { ResultDTO } from 'src/app/dto/course.dto';
import { GameDTO, GameResultDTO, GameStorageDTO } from 'src/app/dto/game.dto';

/**
 * This component is used to show the achievement details in a modal.
 */
@Component({
  selector: 'app-modules-games-fishing-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss'],
})
export class AppGamesFishingGameOverComponent implements OnInit {
  // Stores the maximum result of the current level.
  findMaxResult?: ResultDTO;

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param dialogRef Is an instance of MatDialogRef.
   * @param data Is an instance of input data.
   * @param data Is an instance of input data.
   */
  constructor(
    private readonly router: Router,
    private readonly dialogRef: MatDialogRef<AppGamesFishingGameOverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GameResultDTO,
  ) { }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  ngOnInit(): void {
    if (this.data && this.data.language) {
      if (localStorage.getItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS)) {
        const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS) as string);
        if (storedData) {
          const findLanguage = storedData.find((item: GameStorageDTO) => item.language === this.data.language);
          if (findLanguage) {
            const findLevel = findLanguage.data.find((item: GameDTO) => item.id === this.data.level.id);
            if (findLevel && findLevel.results && findLevel.results.length > 1) {
              this.findMaxResult = findLevel.results.reduce((prev: any, current: any) => (prev.numberOfWords > current.numberOfWords) ? prev : current);
            } else {
              this.findMaxResult = undefined;
            }
          }
        }
      }
    }
  }

  /**
   * Closes the modal.
   */
  close(): void {
    this.router.navigate(['/games/fish/level']);
    this.dialogRef.close();
  }

  /**
   * Replay level.
   */
  replay(): void {
    this.dialogRef.close('replay');
  }

  /**
   * Back to games screen.
   */
  exit(): void {
    this.router.navigate(['/games']);
    this.dialogRef.close();
  }

  /**
   * Play to next level.
   */
  playNext(): void {
    this.dialogRef.close('next');
  }

  /**
   * Select the level.
   */
  selectLevel(): void {
    this.router.navigate(['/games/fish/level']);
    this.dialogRef.close();
  }
}
