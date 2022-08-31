import { CategoriesDTO, createEmptyCategoriesDTO } from 'src/app/dto/course.dto';
import { CourseDTO } from 'src/app/dto/course.dto';
import { Component, Input } from '@angular/core';
import { CourseHelperService } from 'src/app/services/course-helper.service';
import { MatDialog } from '@angular/material/dialog';
import { AppAchievementDetailsComponent } from '../details/details.component';

/**
 * This component is used to show the all the awards.
 */
@Component({
  selector: 'app-modules-achievements-awards',
  templateUrl: './awards.component.html',
  styleUrls: ['./awards.component.scss']
})
export class AppAchievementsAwardsComponent {
  @Input() courses: CourseDTO[] = [];
  @Input() currentLanguage: string = '';
  @Input() currentCategory: CategoriesDTO = createEmptyCategoriesDTO();
  @Input() categories: CategoriesDTO[] = [];

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param courseHelperService Reference to CourseHelperService.
   * @param dialog Reference to MatDialog.
   */
  constructor(
    private readonly courseHelperService: CourseHelperService,
    private readonly dialog: MatDialog,
  ) { }

  /**
   * Replay the current course.
   */
  replay(course: CourseDTO): void {
    this.courseHelperService.startExercise(
      this.currentCategory.courses.indexOf(course),
      0,
      this.currentLanguage,
      this.currentCategory.name,
      this.categories);
  }

  /**
   * Opens achievement details modal.
   *
   * @param course Represents the selected course.
   */
  viewDetails(course: CourseDTO): void {
    this.dialog.open(AppAchievementDetailsComponent, {
      panelClass: 'achievement-class',
      backdropClass: 'achievement-backdrop',
      data: { course, currentLanguage: this.currentLanguage, currentCategory: this.currentCategory, categories: this.categories }
    });
  }

}
