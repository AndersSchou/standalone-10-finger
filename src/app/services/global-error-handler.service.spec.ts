import { NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NGXLogger } from 'ngx-logger';
import { of } from 'rxjs';
import { ErrorModalService } from './error-modal.service';
import { GlobalErrorHandler } from './global-error-handler.service';

// TODO: better tests.
describe('GlobalErrorHandler', () => {
  let service: GlobalErrorHandler;
  let errorModalServiceSpy: jasmine.SpyObj<ErrorModalService>;
  let nGXLoggerSpy: jasmine.SpyObj<NGXLogger>;
  let ngZoneSpy: jasmine.SpyObj<NgZone>;

  beforeEach(() => {
    errorModalServiceSpy = jasmine.createSpyObj<ErrorModalService>([
      'openModal',
    ]);
    nGXLoggerSpy = jasmine.createSpyObj<NGXLogger>(['debug']);
    ngZoneSpy = jasmine.createSpyObj<NgZone>(['run']);
    ngZoneSpy.run.and.returnValue({
      afterClosed: () => of(true),
    } as any);

    TestBed.configureTestingModule({
      providers: [
        { provide: NGXLogger, useValue: nGXLoggerSpy },
        { provide: ErrorModalService, useValue: errorModalServiceSpy },
      ],
    });
    service = new GlobalErrorHandler(
      errorModalServiceSpy,
      ngZoneSpy,
      nGXLoggerSpy
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
