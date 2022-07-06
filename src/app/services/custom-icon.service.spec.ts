import { TestBed } from '@angular/core/testing';
import { CustomIconService } from './custom-icon.service';

describe('CustomIconService', () => {
  let service: CustomIconService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CustomIconService] });
    service = TestBed.inject(CustomIconService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call addCustomIcons', () => {
    const getIcon = spyOn(service, 'addCustomIcons');
    service.addCustomIcons('en');
    expect(getIcon).toHaveBeenCalled();
  });

  it('should call addCustomIcons', () => {
    const getIcons = spyOn(service, 'addCustomIcons');
    service.addCustomIcons(['en']);
    expect(getIcons).toHaveBeenCalled();
  });
});
