import { LevelService } from 'src/app/services/level.service';
import { GridService } from 'src/app/services/grid.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of, Subject } from 'rxjs';
import { LanguageHelperService } from 'src/app/services/language.service';
import { AppGamesFishPlayComponent } from './play.component';
import { SpeechService } from 'src/app/services/speech.service';
import { SettingsService } from 'src/app/services/settings.service';

describe('AppGamesFishPlayComponent', () => {
  let component: AppGamesFishPlayComponent;
  let fixture: ComponentFixture<AppGamesFishPlayComponent>;
  let languageHelperServiceSpy: jasmine.SpyObj<LanguageHelperService>;
  let onLanguageChangedSpy;
  let routerSpy: jasmine.SpyObj<Router>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let gridServiceSpy: jasmine.SpyObj<GridService>;
  let levelServiceSpy: jasmine.SpyObj<LevelService>;
  let speechServiceSpy: jasmine.SpyObj<SpeechService>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;

  beforeEach(async () => {
    languageHelperServiceSpy = jasmine.createSpyObj<LanguageHelperService>([
      'OnLanguageChanged',
    ]);
    (languageHelperServiceSpy as any).OnLanguageChanged = new Observable(
      (subscriber) => {
        onLanguageChangedSpy = subscriber;
      }
    );

    routerSpy = jasmine.createSpyObj<Router>(['navigate']);

    matDialogSpy = jasmine.createSpyObj<MatDialog>(['open']);
    matDialogSpy.open.and.returnValue({
      afterClosed: () => of(true),
    } as any);

    gridServiceSpy = jasmine.createSpyObj<GridService>(['initGrid']);
    levelServiceSpy = jasmine.createSpyObj<LevelService>([
      'generateLevel',
      'getNumberOfLevels',
    ]);
    speechServiceSpy = jasmine.createSpyObj<SpeechService>([
      'isPlaying',
      'unload',
      'playFishGameSound',
    ]);
    settingsServiceSpy = jasmine.createSpyObj<SettingsService>([
      'getDefaultGameSoundOption',
    ]);

    await TestBed.configureTestingModule({
      providers: [
        { provide: LanguageHelperService, useValue: languageHelperServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: ActivatedRoute, useValue: { queryParams: new Subject() } },
        { provide: GridService, useValue: gridServiceSpy },
        { provide: LevelService, useValue: levelServiceSpy },
        { provide: SpeechService, useValue: speechServiceSpy },
        { provide: SettingsService, useValue: settingsServiceSpy },
      ],
      imports: [
        TranslateModule.forRoot(),
        MatIconTestingModule,
        AppGamesFishPlayComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppGamesFishPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
