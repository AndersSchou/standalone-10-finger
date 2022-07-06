import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let cookieServiceSpy: jasmine.SpyObj<CookieService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    cookieServiceSpy = jasmine.createSpyObj<CookieService>(['delete', 'get']);
    routerSpy = jasmine.createSpyObj<Router>(['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: CookieService, useValue: cookieServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should logout', () => {
    service.logout();
    expect(cookieServiceSpy.get).toHaveBeenCalledWith('mvf_session_id');
  });
});
