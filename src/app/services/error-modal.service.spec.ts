import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { of } from 'rxjs';
import { ErrorModalService } from './error-modal.service';

describe('ErrorModalService', () => {
  let service: ErrorModalService;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    matDialogSpy = jasmine.createSpyObj<MatDialog>(['open']);
    matDialogSpy.open.and.returnValue({
      afterClosed: () => of(true),
    } as any);

    TestBed.configureTestingModule({
      providers: [
        ErrorModalService,
        { provide: MatDialog, useValue: matDialogSpy }
      ]
    });
    service = TestBed.inject(ErrorModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open error modal', () => {
    const openModalView = spyOn(service, 'openModal');
    service.openModal({} as HttpErrorResponse);
    expect(openModalView).toHaveBeenCalled();
  });
});
