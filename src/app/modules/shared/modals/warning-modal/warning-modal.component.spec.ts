import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TranslateModule } from '@ngx-translate/core';
import { WarningModalComponent } from './warning-modal.component';

describe('WarningModalComponent', () => {
  let component: WarningModalComponent;
  let fixture: ComponentFixture<WarningModalComponent>;
  let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<any, any>>;

  beforeEach(async () => {
    matDialogRefSpy = jasmine.createSpyObj<MatDialogRef<any, any>>(['close']);

    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatIconTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: matDialogRefSpy },
      ],
      declarations: [WarningModalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close WarningModalComponent', () => {
    component.close();
    expect(matDialogRefSpy.close).toHaveBeenCalled();
  });
});
