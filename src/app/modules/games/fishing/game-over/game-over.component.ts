import { environment } from 'src/environments/environment';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { STORAGE_KEY_TYPE } from 'src/app/common/enums';
import { ResultDTO } from 'src/app/dto/course.dto';
import { GameDTO, GameResultDTO, GameStorageDTO } from 'src/app/dto/game.dto';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { NgIf, DatePipe } from '@angular/common';

/**
 * This component is used to show the achievement details in a modal.
 */
@Component({
  selector: 'app-modules-games-fishing-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatDialogTitle,
    MatIcon,
    MatDialogContent,
    MatDialogActions,
    MatTooltip,
    DatePipe,
    TranslateModule,
  ],
})
export class AppGamesFishingGameOverComponent implements OnInit {
  // Stores the maximum result of the current level.
  findMaxResult?: ResultDTO;
  // Stores the time as string.
  time = '';
  // Tells if the current result is the highest or not.
  isHighScore = false;

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param router Is an instance of Router.
   * @param dialogRef Is an instance of MatDialogRef.
   * @param data Is an instance of input data.
   */
  constructor(
    private readonly router: Router,
    private readonly dialogRef: MatDialogRef<AppGamesFishingGameOverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GameResultDTO
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  ngOnInit(): void {
    if (this.data && this.data.language) {
      if (localStorage.getItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS)) {
        const storedData = JSON.parse(
          localStorage.getItem(STORAGE_KEY_TYPE.FISH_GAME_PROGRESS) as string
        );
        if (storedData) {
          const findLanguage = storedData.find(
            (item: GameStorageDTO) => item.language === this.data.language
          );
          if (findLanguage) {
            const findLevel = findLanguage.data.find(
              (item: GameDTO) => item.id === this.data.level.id
            );
            if (
              findLevel &&
              findLevel.results &&
              findLevel.results.length > 1
            ) {
              this.findMaxResult = findLevel.results.reduce(
                (prev: any, current: any) =>
                  prev.time < current.time ? prev : current
              );
              if (
                this.findMaxResult &&
                this.findMaxResult.time ===
                  findLevel.results[findLevel.results.length - 1].time &&
                this.findMaxResult.numberOfWords ===
                  findLevel.results[findLevel.results.length - 1].numberOfWords
              ) {
                this.isHighScore = true;
              }
            } else {
              this.findMaxResult = undefined;
            }
            this.time = this.calculateTime(
              findLevel.results[findLevel.results.length - 1].time
            );
          }
        }
      }
    }
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
   * Play next level.
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

  /**
   * Calculate the time from milliseconds to minutes and seconds.
   *
   * @param time Represents the time in milliseconds.
   *
   * @returns The total time in minutes and seconds.
   */
  calculateTime(time: number): string {
    let minutes = 0;
    let seconds = 0;
    if (!this.data.timeOut) {
      minutes = Math.floor(time / 60000);
      seconds = Number(((time % 60000) / 1000).toFixed(0));
    } else {
      const timeArray = environment.gameTime.split(':');
      const mins = timeArray[0].split('');
      minutes = Number(mins[1]);
      seconds = Number(timeArray[1]);
    }
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  }
}
