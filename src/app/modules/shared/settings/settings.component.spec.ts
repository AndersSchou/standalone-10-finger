import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AppSharedSettingsComponent } from './settings.component';
import { SettingsService } from 'src/app/services/settings.service';
import { LanguageHelperService } from 'src/app/services/language.service';
import { Observable } from 'rxjs';

describe('AppSharedSettingsComponent', () => {
  let component: AppSharedSettingsComponent;
  let fixture: ComponentFixture<AppSharedSettingsComponent>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;
  let languageHelperServiceSpy: jasmine.SpyObj<LanguageHelperService>;
  let onLanguageChangedSpy;

  beforeEach(async () => {
    settingsServiceSpy = jasmine.createSpyObj<SettingsService>([
      'toggleSettings',
      'getDefaultKeyboardThemeColor',
      'getDefaultKeyboardPrimaryLayout',
      'storageCleanup',
      'setThemeSetting',
      'setDefaultSettings',
      'getDefaultTextDisplayLayout',
    ]);

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
        AppSharedSettingsComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSharedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
