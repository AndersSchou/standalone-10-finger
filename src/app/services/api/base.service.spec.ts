import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { BaseService } from './base.service';

describe('BaseService', () => {
  let service: BaseService<any>;
  let httpServiceSpy: jasmine.SpyObj<HttpClient>;
  let cookieServiceSpy: jasmine.SpyObj<CookieService>;

  beforeEach(() => {
    httpServiceSpy = jasmine.createSpyObj<HttpClient>(['get', 'post', 'put', 'delete']);
    cookieServiceSpy = jasmine.createSpyObj<CookieService>(['get']);

    TestBed.configureTestingModule({
      providers: [
        BaseService,
        { provide: HttpClient, useValue: httpServiceSpy },
        { provide: CookieService, useValue: cookieServiceSpy },
      ],
    });
    service = TestBed.inject(BaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
