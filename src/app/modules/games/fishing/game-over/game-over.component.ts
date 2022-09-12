import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { STORAGE_KEY_TYPE } from 'src/app/common/enums';
import { GameDTO, GameResultDTO, GameStorageDTO } from 'src/app/dto/game.dto';

/**
 * This component is used to show the achievement details in a modal.
 */
@Component({
  selector: 'app-modules-games-fishing-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss'],
})
export class AppGamesFishingGameOverComponent implements OnInit, OnDestroy {
  findMaxResult?: GameResultDTO;
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<boolean>();

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param dialogRef Is an instance of MatDialogRef.
   * @param data Is an instance of input data.
   */
  constructor(
    private readonly router: Router,
    private readonly dialogRef: MatDialogRef<AppGamesFishingGameOverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  ngOnInit(): void {
    console.log('Game Over', this.data);
    if (this.data && this.data.language) {
      if (localStorage.getItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS)) {
        const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS) as string);
        console.log('storedData', storedData);
        if (storedData) {
          const findLanguage = storedData.find((item: GameStorageDTO) => item.language === this.data.language);
          console.log('findLanguage', findLanguage);
          if (findLanguage) {
            const findLevel = findLanguage.data.find((item: GameDTO) => item.id === this.data.level.id);
            if (findLevel && findLevel.result && findLevel.result.length > 1) {
              this.findMaxResult = findLevel.result.reduce((prev: any, current: any) => (prev.numberOfWords > current.numberOfWords) ? prev : current);
              console.log('findMaxResult', this.findMaxResult);
            } else {
              this.findMaxResult = undefined;
            }
          }
        }
      }
    }
  }

  /**
   * Unsubscribe Observables and detach event handlers to avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  /**
   * Closes the modal.
   */
  close(): void {
    this.router.navigate(['/games/fish/level']);
    this.dialogRef.close();
  }

  replay(): void {
    this.dialogRef.close('replay');
  }

  exit(): void {
    this.router.navigate(['/games']);
    this.dialogRef.close();
  }

  playNext(): void {
    this.dialogRef.close('next');
  }

  selectLevel(): void {
    this.router.navigate(['/games/fish/level']);
    this.dialogRef.close();
  }
}
