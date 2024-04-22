import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { CourseHelperService } from 'src/app/services/course-helper.service';
import { LanguageHelperService } from 'src/app/services/language.service';
import { SettingsService } from 'src/app/services/settings.service';
import { AppAchievementsComponent } from './achievements.component';

describe('AppAchievementsComponent', () => {
  let component: AppAchievementsComponent;
  let fixture: ComponentFixture<AppAchievementsComponent>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;
  let onViewSettingsActionSpy;
  let languageHelperServiceSpy: jasmine.SpyObj<LanguageHelperService>;
  let onLanguageChangedSpy;
  let courseHelperServiceSpy: jasmine.SpyObj<CourseHelperService>;

  beforeEach(async () => {
    settingsServiceSpy = jasmine.createSpyObj<SettingsService>([
      'viewSettingsAction',
    ]);
    (settingsServiceSpy as any).viewSettingsAction = new Observable(
      (subscriber) => {
        onViewSettingsActionSpy = subscriber;
      }
    );

    languageHelperServiceSpy = jasmine.createSpyObj<LanguageHelperService>([
      'OnLanguageChanged',
    ]);
    (languageHelperServiceSpy as any).OnLanguageChanged = new Observable(
      (subscriber) => {
        onLanguageChangedSpy = subscriber;
      }
    );

    courseHelperServiceSpy = jasmine.createSpyObj<CourseHelperService>([
      'getCategories',
    ]);

    await TestBed.configureTestingModule({
      providers: [
        { provide: SettingsService, useValue: settingsServiceSpy },
        { provide: LanguageHelperService, useValue: languageHelperServiceSpy },
        { provide: CourseHelperService, useValue: courseHelperServiceSpy },
      ],
      imports: [
        TranslateModule.forRoot(),
        MatIconTestingModule,
        AppAchievementsComponent,
        RouterTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAchievementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
