import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { VoiceService } from './voice.service';
import { Platform } from '@angular/cdk/platform';
import { CookieService } from 'ngx-cookie-service';

describe('VoiceService', () => {
  let service: VoiceService;
  let httpServiceSpy: jasmine.SpyObj<HttpClient>;
  let cookieServiceSpy: jasmine.SpyObj<CookieService>;
  let platformSpy: jasmine.SpyObj<Platform>;

  beforeEach(() => {
    httpServiceSpy = jasmine.createSpyObj<HttpClient>(['post']);
    cookieServiceSpy = jasmine.createSpyObj<CookieService>(['get']);

    platformSpy = jasmine.createSpyObj<Platform>(['SAFARI']);

    TestBed.configureTestingModule({
      providers: [
        VoiceService,
        { provide: HttpClient, useValue: httpServiceSpy },
        { provide: Platform, useValue: platformSpy },
        { provide: CookieService, useValue: cookieServiceSpy },
      ],
    });
    service = TestBed.inject(VoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
