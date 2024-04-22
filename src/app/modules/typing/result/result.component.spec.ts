import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsService } from 'src/app/services/settings.service';
import { Observable } from 'rxjs';
import { LanguageHelperService } from 'src/app/services/language.service';
import { CourseHelperService } from 'src/app/services/course-helper.service';
import { AppTypingResultComponent } from './result.component';
import { NgxPrinterService } from 'ngx-printer';

describe('AppTypingResultComponent', () => {
  let component: AppTypingResultComponent;
  let fixture: ComponentFixture<AppTypingResultComponent>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;
  let onViewSettingsActionSpy;
  let languageHelperServiceSpy: jasmine.SpyObj<LanguageHelperService>;
  let onLanguageChangedSpy;
  let courseHelperServiceSpy: jasmine.SpyObj<CourseHelperService>;
  let printerServiceSpy: jasmine.SpyObj<NgxPrinterService>;

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
      'getLatestCourse',
      'getLatestCategory',
      'getLatestExercise',
    ]);

    printerServiceSpy = jasmine.createSpyObj<NgxPrinterService>([
      'printHTMLElement',
    ]);

    await TestBed.configureTestingModule({
      providers: [
        { provide: SettingsService, useValue: settingsServiceSpy },
        { provide: LanguageHelperService, useValue: languageHelperServiceSpy },
        { provide: CourseHelperService, useValue: courseHelperServiceSpy },
        { provide: NgxPrinterService, useValue: printerServiceSpy },
      ],
      imports: [
        TranslateModule.forRoot(),
        MatIconTestingModule,
        AppTypingResultComponent,
        RouterTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTypingResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
