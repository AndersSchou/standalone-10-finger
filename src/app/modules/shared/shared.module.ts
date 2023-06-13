import { AppSharedSettingsLogoutComponent } from './settings/logout/logout.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { AppSharedTopMenuComponent } from './top-menu/top-menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorModalComponent } from './modals/error-modal/error-modal.component';
import { ErrorModalService } from 'src/app/services/error-modal.service';
import { LanguageHelperService } from 'src/app/services/language.service';
import { AppSharedSettingsComponent } from './settings/settings.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppSharedSettingsKeyboardComponent } from './settings/keyboard/keyboard.component';
import { AppSharedSettingsTextComponent } from './settings/text/text.component';
import { AppSharedSettingsLanguageComponent } from './settings/language/language.component';
import { AppSharedSettingsReadComponent } from './settings/read/read.component';
import { WarningModalComponent } from './modals/warning-modal/warning-modal.component';
import { AppSharedSettingsThemeComponent } from './settings/theme/theme.component';

@NgModule({
  declarations: [
    AppSharedTopMenuComponent,
    ErrorModalComponent,
    WarningModalComponent,
    AppSharedSettingsComponent,
    AppSharedSettingsKeyboardComponent,
    AppSharedSettingsTextComponent,
    AppSharedSettingsLanguageComponent,
    AppSharedSettingsReadComponent,
    AppSharedSettingsLogoutComponent,
    AppSharedSettingsThemeComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    MaterialModule,
    DragDropModule,
    RouterModule,
    TranslateModule.forRoot(),
  ],
  exports: [
    TranslateModule,
    AppSharedTopMenuComponent,
    ErrorModalComponent,
    WarningModalComponent,
    AppSharedSettingsComponent,
    AppSharedSettingsKeyboardComponent,
    AppSharedSettingsTextComponent,
    AppSharedSettingsLanguageComponent,
    AppSharedSettingsReadComponent,
    AppSharedSettingsLogoutComponent,
    AppSharedSettingsThemeComponent,
  ],
  providers: [
    ErrorModalService,
    LanguageHelperService,
  ],
})
export class SharedModule { }
