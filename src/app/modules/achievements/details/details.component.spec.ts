import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPrinterService } from 'ngx-printer';
import { Observable } from 'rxjs';
import { CourseHelperService } from 'src/app/services/course-helper.service';
import { MaterialModule } from '../../shared/material.module';
import { AppAchievementDetailsComponent } from './details.component';

describe('AppAchievementDetailsComponent', () => {
  let component: AppAchievementDetailsComponent;
  let fixture: ComponentFixture<AppAchievementDetailsComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let courseHelperServiceSpy: jasmine.SpyObj<CourseHelperService>;
  let oncloseDetailsModalActionSpy;
  let printerServiceSpy: jasmine.SpyObj<NgxPrinterService>;
  let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<any, any>>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj<Router>(['navigate']);

    courseHelperServiceSpy = jasmine.createSpyObj<CourseHelperService>([
      'calculateSpeed',
      'calculateAccuracy',
      'startExercise',
      'closeDetailsModalAction'
    ]);
    (courseHelperServiceSpy as any).closeDetailsModalAction = new Observable(
      (subscriber) => {
        oncloseDetailsModalActionSpy = subscriber;
      }
    );

    printerServiceSpy = jasmine.createSpyObj<NgxPrinterService>(['printHTMLElement']);

    matDialogRefSpy = jasmine.createSpyObj<MatDialogRef<any, any>>(['close']);

    await TestBed.configureTestingModule({
      declarations: [AppAchievementDetailsComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: CourseHelperService, useValue: courseHelperServiceSpy },
        { provide: NgxPrinterService, useValue: printerServiceSpy },
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      imports: [
        TranslateModule.forRoot(),
        MaterialModule,
        MatIconTestingModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAchievementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
