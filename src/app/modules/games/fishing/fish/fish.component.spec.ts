import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { LanguageHelperService } from 'src/app/services/language.service';
import { AppGamesFishComponent } from './fish.component';

describe('AppGamesFishComponent', () => {
  let component: AppGamesFishComponent;
  let fixture: ComponentFixture<AppGamesFishComponent>;
  let languageHelperServiceSpy: jasmine.SpyObj<LanguageHelperService>;
  let onLanguageChangedSpy;

  beforeEach(async () => {
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
        { provide: LanguageHelperService, useValue: languageHelperServiceSpy },
      ],
      imports: [
        TranslateModule.forRoot(),
        MatIconTestingModule,
        BrowserAnimationsModule,
        AppGamesFishComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppGamesFishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
