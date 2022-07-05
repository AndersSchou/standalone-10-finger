import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppAchievementsComponent } from './modules/achievements/achievements.component';
import { AppGamesComponent } from './modules/games/games.component';
import { AppHomeComponent } from './modules/home/home.component';
import { AppInfoComponent } from './modules/info/info.component';
import { AppLoginComponent } from './modules/login/login.component';
import { AppSetCourseComponent } from './modules/set-course/set-course.component';
import { AppTypingComponent } from './modules/typing/typing.component';
import { AuthGuardService } from './services/guards/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: AppHomeComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'login',
    component: AppLoginComponent
  },
  {
    path: 'type',
    component: AppTypingComponent
  },
  {
    path: 'set-course',
    component: AppSetCourseComponent
  },
  {
    path: 'games',
    component: AppGamesComponent
  },
  {
    path: 'achivements',
    component: AppAchievementsComponent
  },
  {
    path: 'info',
    component: AppInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
