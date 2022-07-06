import { AuthService } from 'src/app/services/auth.service';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthGuardService } from './auth-guard.service';

describe('AuthService', () => {
  let service: AuthGuardService;
  let cookieServiceSpy: jasmine.SpyObj<CookieService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    cookieServiceSpy = jasmine.createSpyObj<CookieService>(['get', 'set']);
    routerSpy = jasmine.createSpyObj<Router>(['navigate']);
    authServiceSpy = jasmine.createSpyObj<AuthService>([
      'loggedIn',
      'login',
      'logout',
    ]);

    TestBed.configureTestingModule({
      providers: [
        AuthGuardService,
        { provide: CookieService, useValue: cookieServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });
    service = TestBed.inject(AuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
