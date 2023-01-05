import { TestBed } from '@angular/core/testing';
import { WPSService } from './wps.service';

describe('WPSService', () => {
  let service: WPSService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: []
    });
    service = TestBed.inject(WPSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
