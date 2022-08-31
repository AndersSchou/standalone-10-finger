import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SettingsService } from 'src/app/services/settings.service';
import { Observable, Subject } from 'rxjs';
import { LanguageHelperService } from 'src/app/services/language.service';
import { SpeechService } from 'src/app/services/speech.service';
import { CourseHelperService } from 'src/app/services/course-helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppTypingResultComponent } from './result.component';
import { MaterialModule } from '../../shared/material.module';
import { NgxPrinterService } from 'ngx-printer';

describe('AppTypingResultComponent', () => {
  let component: AppTypingResultComponent;
  let fixture: ComponentFixture<AppTypingResultComponent>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;
  let onViewSettingsActionSpy;
  let speechServiceSpy: jasmine.SpyObj<SpeechService>;
  let languageHelperServiceSpy: jasmine.SpyObj<LanguageHelperService>;
  let onLanguageChangedSpy;
  let courseHelperServiceSpy: jasmine.SpyObj<CourseHelperService>;
  let routerServiceSpy: jasmine.SpyObj<Router>;
  let printerServiceSpy: jasmine.SpyObj<NgxPrinterService>;

  beforeEach(async () => {
    settingsServiceSpy = jasmine.createSpyObj<SettingsService>(['viewSettingsAction']);
    (settingsServiceSpy as any).viewSettingsAction = new Observable(
      (subscriber) => {
        onViewSettingsActionSpy = subscriber;
      }
    );
    (settingsServiceSpy as any).keyboardThemeColorAction = new Observable(
      (subscriber) => {
        onViewSettingsActionSpy = subscriber;
      }
    );
    (settingsServiceSpy as any).keyboardPrimaryModeAction = new Observable(
      (subscriber) => {
        onViewSettingsActionSpy = subscriber;
      }
    );
    (settingsServiceSpy as any).textSettingsAction = new Observable(
      (subscriber) => {
        onViewSettingsActionSpy = subscriber;
      }
    );

    languageHelperServiceSpy = jasmine.createSpyObj<LanguageHelperService>(['OnLanguageChanged']);
    (languageHelperServiceSpy as any).OnLanguageChanged = new Observable(
      (subscriber) => {
        onLanguageChangedSpy = subscriber;
      }
    );

    speechServiceSpy = jasmine.createSpyObj<SpeechService>(['handleReading', 'play']);

    courseHelperServiceSpy = jasmine.createSpyObj<CourseHelperService>(['getLatestCourse', 'getLatestCategory', 'getLatestExercise']);

    routerServiceSpy = jasmine.createSpyObj<Router>(['navigate']);

    printerServiceSpy = jasmine.createSpyObj<NgxPrinterService>(['printHTMLElement']);

    await TestBed.configureTestingModule({
      declarations: [AppTypingResultComponent],
      providers: [
        { provide: SettingsService, useValue: settingsServiceSpy },
        { provide: LanguageHelperService, useValue: languageHelperServiceSpy },
        { provide: SpeechService, useValue: speechServiceSpy },
        { provide: CourseHelperService, useValue: courseHelperServiceSpy },
        { provide: ActivatedRoute, useValue: { queryParams: new Subject() } },
        { provide: Router, useValue: routerServiceSpy },
        { provide: NgxPrinterService, useValue: printerServiceSpy },
      ],
      imports: [
        TranslateModule.forRoot(),
        MaterialModule,
        MatIconTestingModule,
        RouterTestingModule
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
