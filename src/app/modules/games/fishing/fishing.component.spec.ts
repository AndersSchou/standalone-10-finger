import { Observable } from 'rxjs';
import { LanguageHelperService } from 'src/app/services/language.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AppGamesFishingComponent } from './fishing.component';

describe('AppGamesFishingComponent', () => {
  let component: AppGamesFishingComponent;
  let fixture: ComponentFixture<AppGamesFishingComponent>;
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
        AppGamesFishingComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppGamesFishingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
