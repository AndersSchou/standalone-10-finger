import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../shared/material.module';
import { SharedModule } from '../shared/shared.module';
import { AppAchievementsComponent } from './achievements.component';
import { AppAchievementsAwardsComponent } from './awards/awards.component';
import { AppAchievementDetailsComponent } from './details/details.component';

@NgModule({
  declarations: [AppAchievementsComponent, AppAchievementsAwardsComponent, AppAchievementDetailsComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
  ],
  providers: [],
})
export class AchievementsModule { }
