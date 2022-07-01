import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppHomeComponent } from './modules/home/home.component';
import { AppLoginComponent } from './modules/login/login.component';
import { AuthGuardService } from './services/guards/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: AppHomeComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'login',
    component: AppLoginComponent,
    // canDeactivate: [HasChangesGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
