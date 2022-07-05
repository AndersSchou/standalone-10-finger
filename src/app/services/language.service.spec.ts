import { LanguageHelperService } from './language.service';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

describe('LanguageHelperService', () => {
  let service: LanguageHelperService;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;
  const availableLanguages = environment.availableLanguages;

  beforeEach(() => {
    translateServiceSpy = jasmine.createSpyObj('TranslateService', [
      'addLangs',
      'setDefaultLang',
      'use',
      'currentLang',
    ]);

    TestBed.configureTestingModule({
      providers: [
        LanguageHelperService,
        { provide: TranslateService, useValue: translateServiceSpy },
      ],
    });
    service = TestBed.inject(LanguageHelperService);
    translateServiceSpy = TestBed.inject(
      TranslateService
    ) as jasmine.SpyObj<TranslateService>;
  });

  it('it should be created', () => {
    expect(service).toBeTruthy();
    expect(translateServiceSpy.addLangs).toHaveBeenCalledWith(
      availableLanguages
    );
    expect(translateServiceSpy.setDefaultLang).toHaveBeenCalledWith(
      availableLanguages[0]
    );
    expect(translateServiceSpy.use).toHaveBeenCalledWith(availableLanguages[0]);
  });
});
