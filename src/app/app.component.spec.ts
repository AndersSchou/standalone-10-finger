import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { AppComponent } from './app.component';
import { UserService } from './services/api/user.service';
import { AuthService } from './services/auth.service';
import { CustomIconService } from './services/custom-icon.service';
import { LanguageHelperService } from './services/language.service';
import { SettingsService } from './services/settings.service';

describe('AppComponent', () => {
  let languageHelperServiceSpy: jasmine.SpyObj<LanguageHelperService>;
  let customIconServiceSpy: jasmine.SpyObj<CustomIconService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let onGetUserInfoActionSpy;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let onLoggedInActionSpy;

  beforeEach(async () => {
    languageHelperServiceSpy = jasmine.createSpyObj<LanguageHelperService>([
      'getCurrentLanguageAndTranslations',
    ]);

    customIconServiceSpy = jasmine.createSpyObj<CustomIconService>([
      'addCustomIcons',
      'fetchCustomIcons'
    ]);

    userServiceSpy = jasmine.createSpyObj<UserService>([
      'getUserInfo',
    ]);
    (userServiceSpy as any).getUserInfo = new Observable(
      (subscriber) => {
        onGetUserInfoActionSpy = subscriber;
      }
    );

    settingsServiceSpy = jasmine.createSpyObj<SettingsService>([
      'setDefaultSettings',
    ]);

    authServiceSpy = jasmine.createSpyObj<AuthService>([
      'loggedInAction',
    ]);
    (authServiceSpy as any).loggedInAction = new Observable(
      (subscriber) => {
        onLoggedInActionSpy = subscriber;
      }
    );

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        { provide: LanguageHelperService, useValue: languageHelperServiceSpy },
        { provide: CustomIconService, useValue: customIconServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: SettingsService, useValue: settingsServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
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
