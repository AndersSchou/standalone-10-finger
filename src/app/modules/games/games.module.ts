import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../shared/material.module';
import { SharedModule } from '../shared/shared.module';
import { AppGamesComponent } from './games.component';
import { AppGamesFishInstructionsComponent } from './fishing/instructions/instructions.component';
import { AppGamesFishSetLevelComponent } from './fishing/set-level/set-level.component';
import { AppGamesFishPlayComponent } from './fishing/play/play.component';
import { AppGamesFishComponent } from './fishing/fish/fish.component';
import { AppGamesFishingComponent } from './fishing/fishing.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AppGamesFishingGameOverComponent } from './fishing/game-over/game-over.component';
import { AppGamesFishingSchoolFishComponent } from './fishing/school-fish/school-fish.component';
import { AppGamesFishingWordFishComponent } from './fishing/word-fish/word-fish.component';

@NgModule({
  declarations: [
    AppGamesComponent,
    AppGamesFishingComponent,
    AppGamesFishInstructionsComponent,
    AppGamesFishSetLevelComponent,
    AppGamesFishPlayComponent,
    AppGamesFishComponent,
    AppGamesFishingGameOverComponent,
    AppGamesFishingSchoolFishComponent,
    AppGamesFishingWordFishComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
  ],
  providers: [],
})
export class GamesModule { }
