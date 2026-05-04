import { LanguageHelperService } from 'src/app/services/language.service';
import { AuthService } from 'src/app/services/auth.service';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthGuardService } from './auth-guard.service';
import { Observable } from 'rxjs';
import { UserService } from '../api/user.service';

describe('AuthService', () => {
  let service: AuthGuardService;
  let cookieServiceSpy: jasmine.SpyObj<CookieService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let languageHelperServiceSpy: jasmine.SpyObj<LanguageHelperService>;
  let initLangChangedSpy: jasmine.SpyObj<Observable<any>>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let onCheckUserAccessSpy;

  beforeEach(() => {
    cookieServiceSpy = jasmine.createSpyObj<CookieService>(['get', 'set']);
    routerSpy = jasmine.createSpyObj<Router>(['navigate']);
    authServiceSpy = jasmine.createSpyObj<AuthService>([
      'loggedIn',
      'login',
      'logout',
    ]);

    languageHelperServiceSpy = jasmine.createSpyObj<LanguageHelperService>([
      'initLangChanged',
      'setLanguage',
    ]);
    initLangChangedSpy = jasmine.createSpyObj<Observable<any>>([
      'subscribe',
      'pipe',
    ]);
    initLangChangedSpy.pipe.and.returnValue(initLangChangedSpy);
    languageHelperServiceSpy.initLangChanged = initLangChangedSpy;

    userServiceSpy = jasmine.createSpyObj<UserService>(['checkUserAccess']);
    (userServiceSpy as any).getUserInfo = new Observable((subscriber) => {
      onCheckUserAccessSpy = subscriber;
    });

    TestBed.configureTestingModule({
      providers: [
        AuthGuardService,
        { provide: CookieService, useValue: cookieServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: LanguageHelperService, useValue: languageHelperServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
      ],
    });
    service = TestBed.inject(AuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
