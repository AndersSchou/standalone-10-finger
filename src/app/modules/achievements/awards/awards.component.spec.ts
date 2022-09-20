import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CourseHelperService } from 'src/app/services/course-helper.service';
import { MaterialModule } from '../../shared/material.module';
import { AppAchievementsAwardsComponent } from './awards.component';

describe('AppAchievementsAwardsComponent', () => {
  let component: AppAchievementsAwardsComponent;
  let fixture: ComponentFixture<AppAchievementsAwardsComponent>;
  let courseHelperServiceSpy: jasmine.SpyObj<CourseHelperService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    courseHelperServiceSpy = jasmine.createSpyObj<CourseHelperService>(['startExercise']);

    routerSpy = jasmine.createSpyObj<Router>(['navigate']);

    await TestBed.configureTestingModule({
      declarations: [AppAchievementsAwardsComponent],
      providers: [
        { provide: CourseHelperService, useValue: courseHelperServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
      imports: [
        TranslateModule.forRoot(),
        MaterialModule,
        MatIconTestingModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAchievementsAwardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
