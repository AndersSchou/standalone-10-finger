import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../shared/material.module';
import { AppSetCourseCourseComponent } from './course.component';

describe('AppSetCourseCourseComponent', () => {
  let component: AppSetCourseCourseComponent;
  let fixture: ComponentFixture<AppSetCourseCourseComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [AppSetCourseCourseComponent],
      providers: [],
      imports: [
        TranslateModule.forRoot(),
        MaterialModule,
        MatIconTestingModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSetCourseCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
