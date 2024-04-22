import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CourseHelperService } from 'src/app/services/course-helper.service';
import { AppSetCourseCourseComponent } from './course.component';

describe('AppSetCourseCourseComponent', () => {
  let component: AppSetCourseCourseComponent;
  let fixture: ComponentFixture<AppSetCourseCourseComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let courseHelperServiceSpy: jasmine.SpyObj<CourseHelperService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj<Router>(['navigate']);

    courseHelperServiceSpy = jasmine.createSpyObj<CourseHelperService>([
      'getLatestCourse',
    ]);

    await TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: CourseHelperService, useValue: courseHelperServiceSpy },
      ],
      imports: [
        TranslateModule.forRoot(),
        MatIconTestingModule,
        AppSetCourseCourseComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSetCourseCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
