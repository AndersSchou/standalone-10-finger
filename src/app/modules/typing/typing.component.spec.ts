import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SettingsService } from 'src/app/services/settings.service';
import { Observable, Subject } from 'rxjs';
import { AppTypingComponent } from './typing.component';
import { LanguageHelperService } from 'src/app/services/language.service';
import { SpeechService } from 'src/app/services/speech.service';
import { MaterialModule } from '../shared/material.module';
import { CourseHelperService } from 'src/app/services/course-helper.service';
import { ActivatedRoute } from '@angular/router';
import { VKeyboardComponent } from 'src/app/vkeyboard/vkeyboard.component';

describe('AppTypingComponent', () => {
  let component: AppTypingComponent;
  let fixture: ComponentFixture<AppTypingComponent>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;
  let onViewSettingsActionSpy;
  let speechServiceSpy: jasmine.SpyObj<SpeechService>;
  let languageHelperServiceSpy: jasmine.SpyObj<LanguageHelperService>;
  let onLanguageChangedSpy;
  let courseHelperServiceSpy: jasmine.SpyObj<CourseHelperService>;

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

    await TestBed.configureTestingModule({
      declarations: [AppTypingComponent, VKeyboardComponent],
      providers: [
        { provide: SettingsService, useValue: settingsServiceSpy },
        { provide: LanguageHelperService, useValue: languageHelperServiceSpy },
        { provide: SpeechService, useValue: speechServiceSpy },
        { provide: CourseHelperService, useValue: courseHelperServiceSpy },
        { provide: ActivatedRoute, useValue: { queryParams: new Subject() } },
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
    fixture = TestBed.createComponent(AppTypingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
