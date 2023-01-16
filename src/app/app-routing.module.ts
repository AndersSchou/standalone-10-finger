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
    path: 'type/result',
    component: AppTypingResultComponent
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
    path: 'games/fish',
    component: AppGamesFishingComponent
  },
  {
    path: 'games/fish/level',
    component: AppGamesFishSetLevelComponent
  },
  {
    path: 'games/fish/level/:id',
    component: AppGamesFishPlayComponent
  },
  {
    path: 'achivements',
    component: AppAchievementsComponent
  },
  {
    path: 'info',
    component: AppHomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
