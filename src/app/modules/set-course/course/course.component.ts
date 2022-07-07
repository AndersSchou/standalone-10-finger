import { Component, Input } from "@angular/core";
import { CategoriesDTO, CourseDTO } from "src/app/dto/course.dto";

/**
 * This component holds the logic for displaying course exercises.
 */
@Component({
  selector: 'app-modules-set-course-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class AppSetCourseCourseComponent {
  @Input()
  set course(cat: CategoriesDTO) {
    if (cat) {
      this.courseVal = cat;
      this.courseVal.courses[0].exercises[0].selected = true;
      this.courseVal.courses[0].exercises[0].progress = '24%';
    }
  }

  // Stores the course.
  courseVal: CategoriesDTO = {
    name: '',
    courses: []
  };

  /**
   * Toggles show all button.
   *
   * @param course Represents the selected course.
   * @param target Represents the HTML target.
   */
  showAll(course: CourseDTO, target: HTMLElement): void {
    course.showAll = !course.showAll;
    if (!course.showAll) {
      // Scroll to course title.
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
