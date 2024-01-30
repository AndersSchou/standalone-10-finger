import { AchievementsModule } from './modules/achievements/achievements.module';
import { AuthInterceptor } from './services/guards/auth-interceptor.service';
import { environment } from 'src/environments/environment';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppLoginComponent } from './modules/login/login.component';
import { AuthService } from './services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { AuthGuardService } from './services/guards/auth-guard.service';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { GamesModule } from './modules/games/games.module';
import { HomeModule } from './modules/home/home.module';
import { SetCourseModule } from './modules/set-course/set-course.module';
import { TypingModule } from './modules/typing/typing.module';
import { CustomIconService } from './services/custom-icon.service';
import { GlobalErrorHandler } from './services/global-error-handler.service';
import { SettingsService } from './services/settings.service';
import { VoiceService } from './services/api/voice.service';
import { SpeechService } from './services/speech.service';
import { CourseHelperService } from './services/course-helper.service';
import { UserService } from './services/api/user.service';
import { GridService } from './services/grid.service';
import { LevelService } from './services/level.service';
import { InfoModule } from './modules/info/info.module';


// TranslateHttpLoader is used to load the translations automatically.
// AoT requires an exported function for factories.
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    AppLoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AchievementsModule,
    GamesModule,
    HomeModule,
    InfoModule,
    SetCourseModule,
    TypingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    // Logger config based on environment.
    LoggerModule.forRoot({
      level: !environment.production
        ? environment.logLevel
          ? environment.logLevel
          : NgxLoggerLevel.LOG
        : NgxLoggerLevel.OFF,
      // serverLogLevel
      serverLogLevel: NgxLoggerLevel.OFF,
    }),
  ],
  providers: [
    GridService,
    AuthService,
    CookieService,
    AuthGuardService,
    CustomIconService,
    SettingsService,
    VoiceService,
    SpeechService,
    UserService,
    LevelService,
    CourseHelperService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
