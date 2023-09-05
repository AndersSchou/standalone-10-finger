import { MaterialModule } from './../material.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AppSharedTopMenuComponent } from './top-menu.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SettingsService } from 'src/app/services/settings.service';
import { Observable } from 'rxjs';
import { LanguageHelperService } from 'src/app/services/language.service';

describe('AppSharedTopMenuComponent', () => {
  let component: AppSharedTopMenuComponent;
  let fixture: ComponentFixture<AppSharedTopMenuComponent>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;
  let onViewSettingsActionSpy;
  let languageHelperServiceSpy: jasmine.SpyObj<LanguageHelperService>;
  let onLanguageChangedSpy;

  beforeEach(async () => {
    settingsServiceSpy = jasmine.createSpyObj<SettingsService>(['viewSettingsAction']);
    (settingsServiceSpy as any).viewSettingsAction = new Observable(
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

    await TestBed.configureTestingModule({
      declarations: [AppSharedTopMenuComponent],
      providers: [
        { provide: SettingsService, useValue: settingsServiceSpy },
        { provide: LanguageHelperService, useValue: languageHelperServiceSpy },
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
    fixture = TestBed.createComponent(AppSharedTopMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
