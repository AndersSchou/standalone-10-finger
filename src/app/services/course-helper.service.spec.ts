import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CourseHelperService } from './course-helper.service';

describe('CourseHelperService', () => {
  let service: CourseHelperService;
  let routerServiceSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerServiceSpy = jasmine.createSpyObj<Router>(['navigate']);

    TestBed.configureTestingModule({
      providers: [
        CourseHelperService,
        { provide: Router, useValue: routerServiceSpy },
      ]
    });
    service = TestBed.inject(CourseHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
