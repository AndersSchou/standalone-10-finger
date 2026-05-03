import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Planet10fingerComponent } from './modules/games/planet10finger/planet10finger.component';

const routes: Routes = [
  {
    path: '',
    component: Planet10fingerComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
