import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppGamesFishingGameOverComponent } from './game-over.component';

describe('AppGamesFishingGameOverComponent', () => {
  let component: AppGamesFishingGameOverComponent;
  let fixture: ComponentFixture<AppGamesFishingGameOverComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<any, any>>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj<Router>(['navigate']);

    matDialogRefSpy = jasmine.createSpyObj<MatDialogRef<any, any>>(['close']);

    await TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      imports: [
        TranslateModule.forRoot(),
        MatIconTestingModule,
        AppGamesFishingGameOverComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppGamesFishingGameOverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
