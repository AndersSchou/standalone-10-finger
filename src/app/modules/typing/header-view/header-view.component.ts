import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  createEmptyExtendedCategoryDTO,
  createEmptyExtendedCourseDTO,
  ExtendedCategoryDTO,
  ExtendedCourseDTO
} from 'src/app/dto/course.dto';

/**
 * This component holds the logic for displaying common header for type and result pages.
 */
@Component({
  selector: 'app-modules-typing-header-view',
  templateUrl: './header-view.component.html',
  styleUrls: ['./header-view.component.scss']
})
export class AppTypingHeaderViewComponent {
  @Input() currentCategory: ExtendedCategoryDTO = createEmptyExtendedCategoryDTO();
  @Input() selectedCourse: ExtendedCourseDTO = createEmptyExtendedCourseDTO();
  @Input() exerciseIndex: number = 0;
  @Input() currentProgress: number = 0;

  @Output() resetCourseEmit: EventEmitter<boolean> = new EventEmitter();

  /**
   * Constructor function responsible for injecting the needed services.
   *
   * @param router Reference to Router.
   */
  constructor(
    private readonly router: Router,
  ) { }

  /**
   * Reset course method.
   */
  resetCourse(): void {
    this.resetCourseEmit.emit(true);
  }

  /**
   * Go back method.
   */
  goBack(): void {
    this.router.navigate(['/set-course']);
  }
}
