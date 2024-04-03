import { AuthService } from 'src/app/services/auth.service';
import { TestBed } from '@angular/core/testing';
import { AuthInterceptor } from './auth-interceptor.service';

describe('AuthInterceptor', () => {
  let service: AuthInterceptor;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj<AuthService>(['logout']);

    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });
    service = TestBed.inject(AuthInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
