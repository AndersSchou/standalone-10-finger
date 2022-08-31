import { TestBed } from '@angular/core/testing';
import { CourseHelperService } from './course-helper.service';

describe('CourseHelperService', () => {
  let service: CourseHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CourseHelperService] });
    service = TestBed.inject(CourseHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
