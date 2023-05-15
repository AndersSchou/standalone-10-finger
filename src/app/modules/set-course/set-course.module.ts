import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../shared/material.module';
import { SharedModule } from '../shared/shared.module';
import { AppSetCourseCourseComponent } from './course/course.component';
import { AppSetCourseComponent } from './set-course.component';

@NgModule({
  declarations: [AppSetCourseComponent, AppSetCourseCourseComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
  ],
  providers: [],
})
export class SetCourseModule { }
