import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { MaterialModule } from 'src/app/modules/shared/material.module';
import { LanguageHelperService } from 'src/app/services/language.service';
import { AppGamesFishSetLevelComponent } from './set-level.component';

describe('AppGamesFishSetLevelComponent', () => {
  let component: AppGamesFishSetLevelComponent;
  let fixture: ComponentFixture<AppGamesFishSetLevelComponent>;
  let languageHelperServiceSpy: jasmine.SpyObj<LanguageHelperService>;
  let onLanguageChangedSpy;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    languageHelperServiceSpy = jasmine.createSpyObj<LanguageHelperService>(['OnLanguageChanged']);
    (languageHelperServiceSpy as any).OnLanguageChanged = new Observable(
      (subscriber) => {
        onLanguageChangedSpy = subscriber;
      }
    );

    routerSpy = jasmine.createSpyObj<Router>(['navigate']);

    await TestBed.configureTestingModule({
      declarations: [AppGamesFishSetLevelComponent],
      providers: [
        { provide: LanguageHelperService, useValue: languageHelperServiceSpy },
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
    fixture = TestBed.createComponent(AppGamesFishSetLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
