import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { AppSharedTopMenuComponent } from './top-menu/top-menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorModalComponent } from './modals/error-modal/error-modal.component';
import { ErrorModalService } from 'src/app/services/error-modal.service';
import { LanguageHelperService } from 'src/app/services/language.service';

@NgModule({
  declarations: [AppSharedTopMenuComponent, ErrorModalComponent],
  imports: [
    FormsModule,
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    RouterModule,
    TranslateModule.forRoot(),
  ],
  exports: [
    TranslateModule,
    AppSharedTopMenuComponent,
    ErrorModalComponent
  ],
  providers: [
    ErrorModalService,
    LanguageHelperService,
  ],
})
export class SharedModule { }
