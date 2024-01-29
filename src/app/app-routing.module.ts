import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppAchievementsComponent } from './modules/achievements/achievements.component';
import { AppGamesFishingComponent } from './modules/games/fishing/fishing.component';
import { AppGamesFishPlayComponent } from './modules/games/fishing/play/play.component';
import { AppGamesFishSetLevelComponent } from './modules/games/fishing/set-level/set-level.component';
import { AppGamesComponent } from './modules/games/games.component';
import { AppHomeComponent } from './modules/home/home.component';
import { AppLoginComponent } from './modules/login/login.component';
import { AppSetCourseComponent } from './modules/set-course/set-course.component';
import { AppTypingResultComponent } from './modules/typing/result/result.component';
import { AppTypingComponent } from './modules/typing/typing.component';
import { AuthGuardService } from './services/guards/auth-guard.service';
import { AppInfoComponent } from './modules/info/info.component';

const routes: Routes = [
  {
    path: '',
    component: AppHomeComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'login',
    component: AppLoginComponent,
  },
  {
    path: 'type',
    component: AppTypingComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'type/result',
    component: AppTypingResultComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'set-course',
    component: AppSetCourseComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'games',
    component: AppGamesComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'games/fish',
    component: AppGamesFishingComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'games/fish/level',
    component: AppGamesFishSetLevelComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'games/fish/level/:id',
    component: AppGamesFishPlayComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'achivements',
    component: AppAchievementsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'info',
    component: AppInfoComponent,
    canActivate: [AuthGuardService],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
