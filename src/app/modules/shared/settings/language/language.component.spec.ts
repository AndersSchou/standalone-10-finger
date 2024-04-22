import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AppSharedSettingsLanguageComponent } from './language.component';
import { LanguageHelperService } from 'src/app/services/language.service';

describe('AppSharedSettingsLanguageComponent', () => {
  let component: AppSharedSettingsLanguageComponent;
  let fixture: ComponentFixture<AppSharedSettingsLanguageComponent>;
  let languageHelperServiceSpy: jasmine.SpyObj<LanguageHelperService>;

  beforeEach(async () => {
    languageHelperServiceSpy = jasmine.createSpyObj<LanguageHelperService>([
      'setLanguage',
    ]);

    await TestBed.configureTestingModule({
      providers: [
        { provide: LanguageHelperService, useValue: languageHelperServiceSpy },
      ],
      imports: [
        TranslateModule.forRoot(),
        MatIconTestingModule,
        AppSharedSettingsLanguageComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSharedSettingsLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
