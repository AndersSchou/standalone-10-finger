import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';
import { AppInfoComponent } from './info.component';
import { LanguageHelperService } from 'src/app/services/language.service';

describe('AppInfoComponent', () => {
  let component: AppInfoComponent;
  let fixture: ComponentFixture<AppInfoComponent>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;
  let onViewSettingsActionSpy;
  let languageHelperServiceSpy: jasmine.SpyObj<LanguageHelperService>;
  let onLanguageChangedSpy;

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

    await TestBed.configureTestingModule({
      providers: [
        { provide: SettingsService, useValue: settingsServiceSpy },
        { provide: LanguageHelperService, useValue: languageHelperServiceSpy },
      ],
      imports: [
        TranslateModule.forRoot(),
        MatIconTestingModule,
        AppInfoComponent,
        RouterTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
