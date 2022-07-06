import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { CustomIconService } from './services/custom-icon.service';
import { LanguageHelperService } from './services/language.service';

describe('AppComponent', () => {
  let languageHelperServiceSpy: jasmine.SpyObj<LanguageHelperService>;
  let customIconServiceSpy: jasmine.SpyObj<CustomIconService>;

  beforeEach(async () => {
    languageHelperServiceSpy = jasmine.createSpyObj<LanguageHelperService>([
      'getCurrentLanguageAndTranslations',
    ]);

    customIconServiceSpy = jasmine.createSpyObj<CustomIconService>([
      'addCustomIcons',
      'fetchCustomIcons'
    ]);
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        { provide: LanguageHelperService, useValue: languageHelperServiceSpy },
        { provide: CustomIconService, useValue: customIconServiceSpy },
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
