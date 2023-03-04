import { Component, Input } from '@angular/core';
import { CourseHelperService } from 'src/app/services/course-helper.service';
import { MatDialog } from '@angular/material/dialog';
import { AppAchievementDetailsComponent } from '../details/details.component';
import { CompletedLevelDTO } from 'src/app/dto/award-details.dto';
import { Router } from '@angular/router';

/**
 * This component is used to show the all the awards.
 */
@Component({
  selector: 'app-modules-achievements-awards',
  templateUrl: './awards.component.html',
  styleUrls: ['./awards.component.scss']
})
export class AppAchievementsAwardsComponent {
  @Input() completedLevels: CompletedLevelDTO[] = [];

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param courseHelperService Reference to CourseHelperService.
   * @param dialog Reference to MatDialog.
   * @param router Reference to Router.
   */
  constructor(
    private readonly courseHelperService: CourseHelperService,
    private readonly dialog: MatDialog,
    private readonly router: Router,
  ) { }

  /**
   * Replay the current course/game level.
   */
  replay(level: CompletedLevelDTO): void {
    if (!level.isGame) {
      // Replay the current course.
      this.courseHelperService.startExercise(
        level.details.indexLevel,
        0,
        level.details.currentLanguage,
        level.details.id,
        level.details.categories);
    } else {
      // Replay the game level.
      this.router.navigate(['/games/fish/level/', level.details.indexLevel]);
    }
  }

  /**
   * Opens achievement details modal.
   *
   * @param level Represents the selected course/game level.
   */
  viewDetails(level: CompletedLevelDTO): void {
    this.dialog.open(AppAchievementDetailsComponent, {
      panelClass: 'achievement-class',
      backdropClass: 'achievement-backdrop',
      data: level
    });
  }

}
